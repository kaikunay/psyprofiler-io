import os
import uuid
import httpx
import base64
from loguru import logger
from dotenv import load_dotenv

load_dotenv()

pp_client_id = os.environ.get("PAYPAL_CLIENT_ID")
pp_client_secret = os.environ.get("PAYPAL_CLIENT_SECRET")
pp_mode = os.environ.get("PAYPAL_MODE", "sandbox")
webhook_id = os.environ.get("PAYPAL_WEBHOOK_ID")

API_BASE_URL = "https://api-m.paypal.com" if pp_mode == "live" else "https://api-m.sandbox.paypal.com"

# PayPal prices in USD (Approximate since the other gateways are INR based)
# 1 USD ~= 80 INR
PRICE_MAP_USD = {
    "adhoc": "9.99",
    "personal": "59.99",
    "pro": "119.99",
    "organization": "699.99"
}

class PayPalPaymentService:
    @staticmethod
    async def get_access_token() -> str:
        if not pp_client_id or not pp_client_secret:
            return "mock_token"

        auth = base64.b64encode(f"{pp_client_id}:{pp_client_secret}".encode()).decode()
        headers = {
            "Authorization": f"Basic {auth}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {"grant_type": "client_credentials"}
        
        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(f"{API_BASE_URL}/v1/oauth2/token", data=data, headers=headers)
                res.raise_for_status()
                return res.json()["access_token"]
        except Exception as e:
            logger.error(f"Failed to get PayPal access token: {e}")
            raise e

    @staticmethod
    async def create_order(tier: str, email: str) -> dict:
        """Create a PayPal order and return the checkout URL."""
        amount_usd = PRICE_MAP_USD.get(tier)
        if not amount_usd:
            raise ValueError("Invalid Tier for PayPal")

        token = await PayPalPaymentService.get_access_token()

        if token == "mock_token":
            logger.error("PayPal not configured. Simulating order.")
            return {"order_id": "pp_mock_order", "checkout_url": "https://paypal.com/checkoutnow?token=mock"}

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
            "PayPal-Request-Id": str(uuid.uuid4())
        }

        data = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "reference_id": tier,
                    "amount": {
                        "currency_code": "USD",
                        "value": amount_usd
                    },
                    "description": f"PsyProfiler {tier.capitalize()} Plan"
                }
            ],
            "payment_source": {
                "paypal": {
                    "experience_context": {
                        "payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED",
                        "brand_name": "PsyProfiler",
                        "locale": "en-US",
                        "landing_page": "LOGIN",
                        "user_action": "PAY_NOW",
                        "return_url": "https://psyprofiler.io/dashboard?payment=paypal_success",
                        "cancel_url": "https://psyprofiler.io/dashboard?payment=cancelled"
                    }
                }
            }
        }

        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(f"{API_BASE_URL}/v2/checkout/orders", json=data, headers=headers)
                res.raise_for_status()
                order_data = res.json()
                
                checkout_url = next((link["href"] for link in order_data["links"] if link["rel"] == "payer-action"), None)
                
                return {
                    "order_id": order_data["id"],
                    "checkout_url": checkout_url,
                    "amount": amount_usd
                }
        except httpx.HTTPStatusError as exc:
            logger.error(f"PayPal order creation failed {exc.response.status_code}: {exc.response.text}")
            raise ValueError(f"PayPal API Error: {exc.response.text}")
        except Exception as e:
            logger.error(f"PayPal order creation generic error: {e}")
            raise e

    @staticmethod
    async def verify_webhook(headers: dict, raw_body: str) -> bool:
        """Verify PayPal Webhook Signature"""
        if not webhook_id or not pp_client_id:
            logger.error("PayPal webhook not fully configured. Allowing mock.")
            return True

        token = await PayPalPaymentService.get_access_token()
        verify_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
        
        data = {
            "auth_algo": headers.get("paypal-auth-algo"),
            "cert_url": headers.get("paypal-cert-url"),
            "transmission_id": headers.get("paypal-transmission-id"),
            "transmission_sig": headers.get("paypal-transmission-sig"),
            "transmission_time": headers.get("paypal-transmission-time"),
            "webhook_id": webhook_id,
            "webhook_event": raw_body
        }
        
        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(f"{API_BASE_URL}/v1/notifications/verify-webhook-signature", json=data, headers=verify_headers)
                res.raise_for_status()
                return res.json().get("verification_status") == "SUCCESS"
        except Exception as e:
            logger.error(f"PayPal Webhook Verification Failed: {e}")
            return False
