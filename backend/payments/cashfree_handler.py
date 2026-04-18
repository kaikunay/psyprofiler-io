import os
import hmac
import hashlib
import base64
import uuid
import httpx
from loguru import logger
from dotenv import load_dotenv

load_dotenv()

cf_app_id = os.environ.get("CASHFREE_APP_ID")
cf_secret_key = os.environ.get("CASHFREE_SECRET_KEY")
cf_env = os.environ.get("CASHFREE_ENV", "SANDBOX")
webhook_secret = os.environ.get("CASHFREE_WEBHOOK_SECRET")

# Cashfree Base URLs
API_BASE_URL = "https://api.cashfree.com/pg" if cf_env == "PRODUCTION" else "https://sandbox.cashfree.com/pg"

PRICE_MAP = {
    "adhoc": 750,         # 750 INR
    "personal": 4999,     # 4999 INR
    "pro": 9999,          # 9999 INR
    "organization": 59999 # 59999 INR
}

class CashfreePaymentService:
    @staticmethod
    async def create_order(tier: str, email: str, user_id: str = "guest") -> dict:
        """Create a Cashfree order and return session info."""
        if not cf_app_id or not cf_secret_key:
            logger.error("Cashfree not configured. Simulating order.")
            # Mock structure matching Cashfree response
            return {"payment_session_id": "simulated_cf_session", "order_id": "order_simulated", "amount": PRICE_MAP.get(tier, 0)}

        amount = PRICE_MAP.get(tier)
        if not amount:
            raise ValueError("Invalid Tier")

        order_id = f"ORDER_{uuid.uuid4().hex[:12].upper()}"

        headers = {
            "x-client-id": cf_app_id,
            "x-client-secret": cf_secret_key,
            "x-api-version": "2023-08-01",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        # Basic customer details since email is required
        data = {
            "order_id": order_id,
            "order_amount": amount,
            "order_currency": "INR",
            "customer_details": {
                "customer_id": user_id,
                "customer_email": email,
                "customer_phone": "9999999999" # Default required by CF
            },
            "order_meta": {
                "return_url": "https://psyprofiler.io/dashboard?payment=success&order_id={order_id}"
            },
            "order_tags": {
                "tier": tier
            }
        }

        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(f"{API_BASE_URL}/orders", json=data, headers=headers)
                res.raise_for_status()
                response_data = res.json()
                
                return {
                    "order_id": response_data.get("order_id"),
                    "payment_session_id": response_data.get("payment_session_id"),
                    "amount": amount
                }
        except httpx.HTTPStatusError as exc:
            logger.error(f"Cashfree order creation failed with status {exc.response.status_code}: {exc.response.text}")
            raise ValueError(f"Cashfree API Error: {exc.response.text}")
        except Exception as e:
            logger.error(f"Cashfree order creation failed: {e}")
            raise e

    @staticmethod
    def verify_webhook(raw_body: str, timestamp: str, signature: str) -> bool:
        """Verify the Cashfree webhook HMAC-SHA256 signature."""
        if not webhook_secret:
            logger.error("CASHFREE_WEBHOOK_SECRET not set. Allowing through as mock.")
            return True
            
        payload = timestamp + raw_body
        expected_sig = base64.b64encode(hmac.new(webhook_secret.encode(), payload.encode(), hashlib.sha256).digest()).decode()

        return hmac.compare_digest(expected_sig, signature)
