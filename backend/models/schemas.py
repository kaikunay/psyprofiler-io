# models/schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict

class ProfilerRequest(BaseModel):
    """Incoming request from the frontend."""
    email: EmailStr
    tier: str = Field(..., pattern="^(recon|deep|oracle|scout|investigator)$")
    use_case: str = Field(..., pattern="^(hiring|sales|dating|self-discovery)$")
    questionnaire_responses: Optional[Dict[str, str]] = Field(default=None, description="Optional assessment answers")
    
    # OSINT targets (optional)
    github_handle: Optional[str] = None
    twitter_handle: Optional[str] = None
    target_name: Optional[str] = None
    target_url: Optional[str] = None
    consent_given: bool = Field(..., description="User must explicitly consent to data processing.")

class OrderCreateRequest(BaseModel):
    """Request to create a Payment order."""
    tier: str
    email: EmailStr
    gateway: str = "razorpay"

class WebhookResponse(BaseModel):
    status: str
