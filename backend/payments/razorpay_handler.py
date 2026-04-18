# payments/razorpay_handler.py
import razorpay
import os
from loguru import logger
from dotenv import load_dotenv

load_dotenv()

key_id = os.environ.get("RAZORPAY_KEY_ID")
key_secret = os.environ.get("RAZORPAY_KEY_SECRET")
webhook_secret = os.environ.get("RAZORPAY_WEBHOOK_SECRET")

client = razorpay.Client(auth=(key_id, key_secret)) if key_id and key_secret else None

# MVP Pricing in INR (Paise)
PRICE_MAP = {
    "adhoc": 75000,         # 750 INR
    "personal": 499900,     # 4999 INR
    "pro": 999900,          # 9999 INR
    "organization": 5999900 # 59999 INR
}

class PaymentService:
    @staticmethod
    def create_order(tier: str, email: str) -> dict:
        """Create a Razorpay order before checkout."""
        if not client:
            logger.error("Razorpay not configured. Simulating order.")
            return {"id": "order_simulated_123", "amount": PRICE_MAP.get(tier, 0)}

        amount = PRICE_MAP.get(tier)
        if not amount:
            raise ValueError("Invalid Tier")

        data = {
            "amount": amount,
            "currency": "INR",
            "receipt": f"receipt_{email.split('@')[0]}",
            "notes": {
                "tier": tier,
                "email": email
            }
        }
        
        try:
            order = client.order.create(data=data)
            return order
        except Exception as e:
            logger.error(f"Razorpay order creation failed: {e}")
            raise e

    @staticmethod
    def verify_webhook(body: str, signature: str) -> bool:
        """Verify the webhook signature cryptographically."""
        if not client:
            logger.warning("Razorpay not configured. Simulating webhook verification as TRUE.")
            return True
            
        try:
            client.utility.verify_webhook_signature(body, signature, webhook_secret)
            return True
        except razorpay.errors.SignatureVerificationError:
            logger.error("Razorpay webhook signature verification FAIILED.")
            return False
        except Exception as e:
            logger.error(f"Razorpay webhook generic error: {e}")
            return False
