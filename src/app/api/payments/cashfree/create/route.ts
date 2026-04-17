/**
 * ═══════════════════════════════════════════════════════════════
 * CASHFREE ORDER CREATION — /api/payments/cashfree/create
 * ═══════════════════════════════════════════════════════════════
 *
 * POST /api/payments/cashfree/create
 * Creates a Cashfree order and returns payment_session_id
 * for client-side checkout initiation via Cashfree JS SDK.
 */

import { NextRequest, NextResponse } from 'next/server';
import { CREDIT_PLANS } from '@/lib/payments/config';

// ── Cashfree API Integration ──────────────────────────────────

const CASHFREE_API_BASE = process.env.CASHFREE_ENV === 'PRODUCTION'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

const API_VERSION = '2023-08-01';

export async function POST(request: NextRequest) {
  try {
    const { planId, userId, userEmail, userName, userPhone } = await request.json();

    // Validate plan
    const plan = CREDIT_PLANS.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Validate credentials
    const clientId = process.env.CASHFREE_APP_ID;
    const clientSecret = process.env.CASHFREE_SECRET_KEY;
    
    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    // Generate unique order ID
    const orderId = `PSY-CF-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    // Create Cashfree order via REST API
    const orderPayload = {
      order_id: orderId,
      order_amount: plan.priceINR,
      order_currency: 'INR',
      customer_details: {
        customer_id: userId || `guest_${Date.now()}`,
        customer_email: userEmail || 'customer@psyprofiler.io',
        customer_phone: userPhone || '9999999999',
        customer_name: userName || 'PsyProfiler User',
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?payment=success&order_id={order_id}`,
        notify_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/cashfree`,
      },
      order_note: `PsyProfiler - ${plan.name} Plan (${plan.credits} credits)`,
      order_tags: {
        planId: plan.id,
        credits: plan.credits.toString(),
        userId: userId,
      },
    };

    const response = await fetch(`${CASHFREE_API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
        'x-api-version': API_VERSION,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      console.error('[CASHFREE] Order creation failed:', errData);
      return NextResponse.json(
        { error: 'Failed to create payment order', details: errData },
        { status: response.status },
      );
    }

    const orderData = await response.json();
    console.log(`[CASHFREE] ✅ Order created: ${orderId} | Amount: ₹${plan.priceINR}`);

    return NextResponse.json({
      orderId: orderId,
      paymentSessionId: orderData.payment_session_id,
      amount: plan.priceINR,
      currency: 'INR',
      credits: plan.credits,
      plan: plan.name,
      gateway: 'cashfree',
    });

  } catch (error) {
    console.error('[CASHFREE] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
