/**
 * ═══════════════════════════════════════════════════════════════
 * CASHFREE WEBHOOK — /api/payments/cashfree
 * ═══════════════════════════════════════════════════════════════
 *
 * POST /api/payments/cashfree
 * Receives Cashfree payment webhook callbacks.
 * Verifies HMAC-SHA256 signature using x-webhook-signature
 * and x-webhook-timestamp headers.
 *
 * On SUCCESS: logs transaction + increments user credit balance.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { addCredits } from '@/lib/credits';

// ── Signature Verification ────────────────────────────────────

function verifyCashfreeSignature(
  rawBody: string,
  timestamp: string,
  signature: string,
): boolean {
  const secret = process.env.CASHFREE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[CF-WEBHOOK] CASHFREE_WEBHOOK_SECRET is not set');
    return false;
  }

  // Cashfree signs: timestamp + rawBody
  const payload = timestamp + rawBody;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64');

  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  } catch {
    // Lengths differ — signatures don't match
    return false;
  }
}

// ── POST Handler ──────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // 1. Read raw body (must read as text for signature verification)
  const rawBody = await request.text();

  // 2. Extract signature headers
  const signature = request.headers.get('x-webhook-signature') || '';
  const timestamp = request.headers.get('x-webhook-timestamp') || '';

  if (!signature || !timestamp) {
    console.warn('[CF-WEBHOOK] Missing signature or timestamp headers');
    return NextResponse.json(
      { error: 'Missing webhook signature headers' },
      { status: 401 },
    );
  }

  // 3. Verify HMAC-SHA256 signature
  if (!verifyCashfreeSignature(rawBody, timestamp, signature)) {
    console.warn('[CF-WEBHOOK] ❌ Signature verification FAILED');
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 401 },
    );
  }

  console.log('[CF-WEBHOOK] ✅ Signature verified');

  // 4. Parse the payload
  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // 5. Check payment status
  const paymentStatus = body?.data?.payment?.payment_status;

  if (paymentStatus !== 'SUCCESS') {
    console.log(`[CF-WEBHOOK] Payment status: ${paymentStatus} — skipping`);
    return NextResponse.json({ status: 'acknowledged', paymentStatus });
  }

  // 6. Extract payment details
  const orderId: string = body.data.order?.order_id || body.data.payment?.order_id || '';
  const paymentAmount: number = body.data.payment?.payment_amount || body.data.order?.order_amount || 0;
  const customerId: string = body.data.payment?.customer_details?.customer_id || '';
  const paymentId: string = body.data.payment?.cf_payment_id || '';

  // customer_id maps to our Appwrite user_id
  const userId = customerId;

  if (!userId) {
    console.error('[CF-WEBHOOK] ❌ No customer_id (userId) in payment data');
    return NextResponse.json(
      { error: 'Missing customer_id in payment' },
      { status: 400 },
    );
  }

  // 7. Determine credits from order_tags or order_note
  const orderTags = body.data.order?.order_tags || {};
  const creditsFromTags = parseInt(orderTags.credits || '0', 10);

  // Fallback: calculate credits from amount using plan pricing
  let creditsToAdd = creditsFromTags;
  if (creditsToAdd <= 0) {
    // Map amount to credits (based on our plan pricing)
    if (paymentAmount >= 59999) creditsToAdd = 750;
    else if (paymentAmount >= 9999) creditsToAdd = 120;
    else if (paymentAmount >= 4999) creditsToAdd = 50;
    else if (paymentAmount >= 750) creditsToAdd = 5;
    else creditsToAdd = 1; // Minimum fallback
    console.warn(`[CF-WEBHOOK] No credits in tags, inferred ${creditsToAdd} from amount ₹${paymentAmount}`);
  }

  console.log(`[CF-WEBHOOK] Processing: order=${orderId} | user=${userId} | ₹${paymentAmount} | +${creditsToAdd} credits`);

  // 8. Write via lib/credits
  try {
    const success = await addCredits(userId, creditsToAdd, `cashfree_${paymentId || orderId}`);

    if (success) {
      console.log(`[CF-WEBHOOK] ✅ Created credit record: ${creditsToAdd} credits for user ${userId}`);
      return NextResponse.json({
        status: 'ok',
        orderId,
        creditsAdded: creditsToAdd,
      });
    } else {
      throw new Error('addCredits failed');
    }
  } catch (error) {
    console.error('[CF-WEBHOOK] ❌ DB write failed:', error);
    // Return 200 anyway to prevent Cashfree from retrying indefinitely
    // (we log the error and can reconcile manually)
    return NextResponse.json({
      status: 'error',
      message: 'Credit update failed — will reconcile',
      orderId,
    });
  }
}
