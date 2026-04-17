/**
 * ═══════════════════════════════════════════════════════════════
 * PAYPAL ORDER CREATION — /api/payments/paypal/create
 * ═══════════════════════════════════════════════════════════════
 *
 * POST /api/payments/paypal/create
 * Creates a PayPal order and returns approval URL
 * for client-side redirect checkout.
 */

import { NextRequest, NextResponse } from 'next/server';
import { CREDIT_PLANS } from '@/lib/payments/config';

// ── PayPal API Configuration ──────────────────────────────────

const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken(): Promise<string | null> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) return null;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.access_token;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { planId, userId } = await request.json();

    // Validate plan
    const plan = CREDIT_PLANS.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Get access token
    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: 'PayPal not configured' }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create PayPal order
    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: `PSY-PP-${Date.now()}`,
        description: `PsyProfiler - ${plan.name} Plan (${plan.credits} credits)`,
        custom_id: JSON.stringify({ planId: plan.id, userId, credits: plan.credits }),
        amount: {
          currency_code: 'USD',
          value: plan.priceUSD.toFixed(2),
        },
      }],
      application_context: {
        brand_name: 'PsyProfiler.io',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        return_url: `${appUrl}/dashboard?payment=success&gateway=paypal`,
        cancel_url: `${appUrl}/dashboard?payment=cancelled`,
      },
    };

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      console.error('[PAYPAL] Order creation failed:', errData);
      return NextResponse.json(
        { error: 'Failed to create PayPal order', details: errData },
        { status: response.status },
      );
    }

    const orderData = await response.json();
    const approvalLink = orderData.links?.find((l: any) => l.rel === 'approve');

    console.log(`[PAYPAL] ✅ Order created: ${orderData.id} | Amount: $${plan.priceUSD}`);

    return NextResponse.json({
      orderId: orderData.id,
      checkoutUrl: approvalLink?.href || '',
      amount: plan.priceUSD,
      currency: 'USD',
      credits: plan.credits,
      plan: plan.name,
      gateway: 'paypal',
    });

  } catch (error) {
    console.error('[PAYPAL] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
