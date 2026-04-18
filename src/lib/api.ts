// src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface OrderCreateRequest {
  tier: 'personal' | 'pro' | 'organization' | 'adhoc';
  email: string;
  gateway: 'razorpay' | 'cashfree' | 'paypal';
}

export interface ProfilerRequest {
  email: string;
  tier: 'personal' | 'pro' | 'organization' | 'adhoc';
  use_case: 'hiring' | 'sales' | 'dating' | 'self';
  questionnaire_responses: Record<string, string>;
  github_handle?: string;
  twitter_handle?: string;
  consent_given: boolean;
}

export const createOrder = async (data: OrderCreateRequest) => {
  const response = await fetch(`${API_BASE_URL}/api/order/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'Failed to create order');
  }
  return response.json();
};

export const submitQuestionnaire = async (orderId: string, data: ProfilerRequest) => {
  const response = await fetch(`${API_BASE_URL}/api/submit?order_id=${orderId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'Failed to submit questionnaire');
  }
  return response.json();
};
