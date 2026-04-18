// src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || '';

export interface OrderCreateRequest {
  tier: string;
  email: string;
  userId?: string;
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
  const response = await fetch(`${API_BASE_URL}/api/payments/${data.gateway}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planId: data.tier,
      userEmail: data.email,
      userId: data.userId,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || errorData?.detail || 'Failed to create order');
  }
  return response.json();
};

export const submitQuestionnaire = async (orderId: string, data: ProfilerRequest) => {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, orderId }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || errorData?.detail || 'Failed to submit analysis request');
  }
  return response.json();
};
