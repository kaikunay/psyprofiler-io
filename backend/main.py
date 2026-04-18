# main.py
from fastapi import FastAPI, HTTPException, Request, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
import json
import uuid
import os
from loguru import logger

from models.schemas import OrderCreateRequest, ProfilerRequest, WebhookResponse
from models.database import create_db_and_tables, get_session, ReportOrder
from payments.razorpay_handler import PaymentService
from payments.cashfree_handler import CashfreePaymentService
from payments.paypal_handler import PayPalPaymentService
from agents.runner import engine
from tools.osint_tool import OSINTGatherer
from tools.pdf_generator import Generator
from tools.email_sender import EmailService

# Logging
logger.add("logs/app.log", rotation="500 MB", level="INFO")

app = FastAPI(title="PsyProfiler Intelligence MVP", version="1.0.0")

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://psyprofiler.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    os.makedirs("logs", exist_ok=True)
    os.makedirs("output_pdfs", exist_ok=True)
    logger.info("Server started, Database Initialized")

@app.post("/api/order/create")
async def create_order(req: OrderCreateRequest, db: Session = Depends(get_session)):
    """Creates an order based on gateway selected before user submits the form."""
    try:
        gateway = getattr(req, "gateway", "razorpay").lower()
        amount = 0
        order_id = ""
        extras = {}
        
        if gateway == "cashfree":
            cf_order = await CashfreePaymentService.create_order(req.tier, req.email)
            order_id = cf_order["order_id"]
            amount = cf_order["amount"]
            extras["payment_session_id"] = cf_order["payment_session_id"]
        elif gateway == "paypal":
            pp_order = await PayPalPaymentService.create_order(req.tier, req.email)
            order_id = pp_order["order_id"]
            amount = float(pp_order["amount"])
            extras["checkout_url"] = pp_order["checkout_url"]
        else: # Default razorpay
            rzp_order = PaymentService.create_order(req.tier, req.email)
            order_id = rzp_order["id"]
            amount = rzp_order.get("amount", 0)

        # Stash it in the DB early
        new_order = ReportOrder(
            order_id=order_id,
            email=req.email,
            tier=req.tier,
            amount=amount
        )
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        
        return {"order_id": order_id, "amount": amount, **extras}
    except Exception as e:
        logger.error(f"Failed to create order: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/submit")
def submit_questionnaire(req: ProfilerRequest, order_id: str, db: Session = Depends(get_session)):
    """Saves the questionnaire payload against the order_id. Awaits webhook for processing."""
    statement = select(ReportOrder).where(ReportOrder.order_id == order_id)
    order_record = db.exec(statement).first()
    
    if not order_record:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if not req.consent_given:
        raise HTTPException(status_code=400, detail="Consent is mandatory")

    # Save payload to process later
    payload = req.dict()
    order_record.payload = json.dumps(payload)
    order_record.status = "pending_payment"
    
    db.add(order_record)
    db.commit()
    return {"status": "success", "message": "Payload saved. Awaiting payment."}

async def process_intelligence_pipeline(order_id: str):
    """The core background task that runs after payment."""
    logger.info(f"Starting Intelligence Pipeline for Order: {order_id}")
    
    # 1. Fetch from DB
    with Session(engine.engine) as db:  # new session for background task
        statement = select(ReportOrder).where(ReportOrder.order_id == order_id)
        order_record = db.exec(statement).first()
        
        if not order_record or not order_record.payload:
            logger.error(f"Order or payload not found for pipeline: {order_id}")
            return
            
        payload = json.loads(order_record.payload)
        order_record.status = "processing"
        db.add(order_record)
        db.commit()
        
        email = order_record.email
        tier = order_record.tier
    
    # 2. Run OSINT
    handles = {
        "twitter": payload.get("twitter_handle"),
        "github": payload.get("github_handle")
    }
    osint_gatherer = OSINTGatherer()
    osint_data = await osint_gatherer.gather_intel(handles)
    
    # 3. Compile Master Input
    master_input = {
        "tier": tier,
        "use_case": payload.get("use_case"),
        "questionnaire_responses": payload.get("questionnaire_responses"),
        "osint_data": osint_data
    }
    
    # 4. Run ADK Agents
    session_id = str(uuid.uuid4())
    logger.info(f"Triggering ADK Runner, Session: {session_id}")
    agent_result = await engine.run_profile(master_input, session_id)
    raw_json_str = agent_result.get("raw_output", "{}")
    
    # Check if Gemini wrapped in markdown blocks
    if raw_json_str.startswith("```json"):
        raw_json_str = raw_json_str[7:]
    if raw_json_str.endswith("```"):
        raw_json_str = raw_json_str[:-3]
    raw_json_str = raw_json_str.strip()
    
    # 5. Generate PDF
    pdf_path = f"output_pdfs/{order_id}_intel.pdf"
    gen_success = Generator.create_report(raw_json_str, pdf_path)
    
    if not gen_success:
        logger.error(f"PDF Generation failed for {order_id}")
        return
        
    # 6. Email Report
    email_success = EmailService.send_report(to_email=email, pdf_path=pdf_path)
    
    # 7. Update DB
    with Session(engine.engine) as db:
        statement = select(ReportOrder).where(ReportOrder.order_id == order_id)
        order_record = db.exec(statement).first()
        order_record.status = "completed" if email_success else "failed_email"
        order_record.report_path = pdf_path
        db.add(order_record)
        db.commit()

    logger.info(f"Pipeline completed perfectly for {order_id}")


@app.post("/api/webhooks/razorpay")
async def razorpay_webhook(request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_session)):
    """Receives event from Razorpay. Verifies signature, triggers processing."""
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")
    
    if not PaymentService.verify_webhook(body.decode('utf-8'), signature):
        raise HTTPException(status_code=400, detail="Invalid signature")

    payload = await request.json()
    event = payload.get("event")
    
    if event == "payment.captured":
        # Get order_id from payload structure
        # Razorpay payload usually has payload.payment.entity.order_id
        try:
            order_id = payload["payload"]["payment"]["entity"]["order_id"]
        except KeyError:
            return WebhookResponse(status="ignored")

        # Update DB
        statement = select(ReportOrder).where(ReportOrder.order_id == order_id)
        order_record = db.exec(statement).first()
        
        if order_record:
            order_record.status = "paid"
            db.add(order_record)
            db.commit()
            
            # Fire intelligence pipeline in background!
            background_tasks.add_task(process_intelligence_pipeline, order_id)
            
    return WebhookResponse(status="ok")

@app.post("/api/webhooks/cashfree")
async def cashfree_webhook(request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_session)):
    raw_body = await request.body()
    signature = request.headers.get("x-webhook-signature", "")
    timestamp = request.headers.get("x-webhook-timestamp", "")
    
    if not CashfreePaymentService.verify_webhook(raw_body.decode('utf-8'), timestamp, signature):
        raise HTTPException(status_code=400, detail="Invalid Cashfree signature")
        
    payload = await request.json()
    try:
        payment_status = payload.get("data", {}).get("payment", {}).get("payment_status")
        if payment_status == "SUCCESS":
            order_id = payload.get("data", {}).get("order", {}).get("order_id")
            
            statement = select(ReportOrder).where(ReportOrder.order_id == order_id)
            order_record = db.exec(statement).first()
            if order_record:
                order_record.status = "paid"
                db.add(order_record)
                db.commit()
                background_tasks.add_task(process_intelligence_pipeline, order_id)
    except Exception as e:
        logger.error(f"Cashfree webhook parsing error: {e}")
        
    return WebhookResponse(status="ok")

@app.post("/api/webhooks/paypal")
async def paypal_webhook(request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_session)):
    raw_body = await request.body()
    # Verify PayPal webhook using headers + body
    if not await PayPalPaymentService.verify_webhook(request.headers, raw_body.decode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid PayPal signature")
        
    payload = await request.json()
    try:
        event_type = payload.get("event_type")
        if event_type == "CHECKOUT.ORDER.APPROVED" or event_type == "PAYMENT.CAPTURE.COMPLETED":
            resource = payload.get("resource", {})
            try:
                # Capture complete can have slightly different structure usually
                # order ID might be under supplementary_data or direct
                if event_type == "PAYMENT.CAPTURE.COMPLETED":
                    order_id = resource.get("supplementary_data", {}).get("related_ids", {}).get("order_id")
                else: 
                    order_id = resource.get("id")
                    
                if order_id:
                    statement = select(ReportOrder).where(ReportOrder.order_id == order_id)
                    order_record = db.exec(statement).first()
                    if order_record:
                        order_record.status = "paid"
                        db.add(order_record)
                        db.commit()
                        background_tasks.add_task(process_intelligence_pipeline, order_id)
            except Exception as pe:
                logger.error(f"Error fetching PayPal order ID: {pe}")
    except Exception as e:
        logger.error(f"PayPal webhook parsing error: {e}")
        
    return WebhookResponse(status="ok")

@app.get("/health")
def health_check():
    return {"status": "operation_vayu_active", "system": "PsyProfiler Backend"}
