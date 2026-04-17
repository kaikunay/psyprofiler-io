/**
 * ═══════════════════════════════════════════════════════════════
 * RAZORPAY PAYMENT GATEWAY — API ROUTE
 * ═══════════════════════════════════════════════════════════════
 * 
 * POST /api/payments/razorpay
 * Creates a Razorpay order and returns order_id + key_id
 * for client-side checkout.
 */

import { NextRequest, NextResponse } from 'next/server';
import { CREDIT_PLANS } from '@/lib/payments/config';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { planId, userId, userEmail, userName } = await request.json();

    // Validate plan
    const plan = CREDIT_PLANS.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Validate credentials
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay not configured' }, { status: 500 });
    }

    // Create Razorpay order via REST API
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const receiptId = `PSY-RP-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: plan.priceINR * 100, // Razorpay expects paise
        currency: 'INR',
        receipt: receiptId,
        notes: {
          planId: plan.id,
          credits: plan.credits.toString(),
          userId: userId || 'anonymous',
          planName: plan.name,
        },
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      console.error('[RAZORPAY] Order creation failed:', errData);
      return NextResponse.json(
        { error: 'Failed to create Razorpay order', details: errData },
        { status: response.status },
      );
    }

    const orderData = await response.json();
    console.log(`[RAZORPAY] ✅ Order created: ${orderData.id} | Amount: ₹${plan.priceINR}`);

    return NextResponse.json({
      orderId: orderData.id,
      keyId: keyId,
      amount: plan.priceINR * 100,
      currency: 'INR',
      credits: plan.credits,
      plan: plan.name,
      gateway: 'razorpay',
      prefill: {
        name: userName || '',
        email: userEmail || '',
      },
    });

  } catch (error) {
    console.error('[RAZORPAY] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// ── Signature Verification Helper ─────────────────────────────

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return expectedSignature === signature;
}
