import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '../razorpay/route';
import { addCredits } from '@/lib/credits';
import { CREDIT_PLANS } from '@/lib/payments/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, userId } = body;

    // Verify signature
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      console.warn(`[RAZORPAY_VERIFY] Invalid signature for order: ${razorpay_order_id}`);
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Add credits
    const plan = CREDIT_PLANS.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const success = await addCredits(userId, plan.credits, razorpay_payment_id);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to add credits to user account' }, { status: 500 });
    }

    console.log(`[RAZORPAY_VERIFY] ✅ Successfully verified payment & added ${plan.credits} credits to ${userId}`);
    return NextResponse.json({ success: true, message: 'Payment verified and credits added' });
  } catch (error) {
    console.error('[RAZORPAY_VERIFY] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
