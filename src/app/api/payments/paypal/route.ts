/**
 * ═══════════════════════════════════════════════════════════════
 * PAYPAL WEBHOOK — /api/payments/paypal
 * ═══════════════════════════════════════════════════════════════
 *
 * POST /api/payments/paypal
 * Receives PayPal webhook events.
 *
 * Verification strategy: Instead of custom cert-rotation crypto,
 * we POST the raw webhook back to PayPal's own
 * /v1/notifications/verify-webhook-signature endpoint.
 * If PayPal says "SUCCESS", we trust it. Jugaad-proof.
 *
 * On PAYMENT.CAPTURE.COMPLETED: logs transaction + credits user.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, ID, Query } from 'node-appwrite';

// ── PayPal API ────────────────────────────────────────────────

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

// ── PayPal Webhook Verification ───────────────────────────────

async function verifyPayPalWebhook(
  rawBody: string,
  headers: Headers,
): Promise<boolean> {
  const accessToken = await getPayPalAccessToken();
  if (!accessToken) {
    console.error('[PP-WEBHOOK] Cannot verify — no access token');
    return false;
  }

  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    console.error('[PP-WEBHOOK] PAYPAL_WEBHOOK_ID is not set');
    return false;
  }

  // Build the verification payload exactly as PayPal expects
  const verificationPayload = {
    auth_algo: headers.get('paypal-auth-algo') || '',
    cert_url: headers.get('paypal-cert-url') || '',
    transmission_id: headers.get('paypal-transmission-id') || '',
    transmission_sig: headers.get('paypal-transmission-sig') || '',
    transmission_time: headers.get('paypal-transmission-time') || '',
    webhook_id: webhookId,
    webhook_event: JSON.parse(rawBody),
  };

  try {
    const response = await fetch(
      `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationPayload),
      },
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error('[PP-WEBHOOK] Verification API error:', response.status, errBody);
      return false;
    }

    const result = await response.json();
    return result.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('[PP-WEBHOOK] Verification request failed:', error);
    return false;
  }
}

// ── Appwrite Server Client ────────────────────────────────────

function getServerDB(): Databases {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'psy-profiler-backend')
    .setKey(process.env.APPWRITE_API_KEY || '');
  return new Databases(client);
}

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'psyprofiler-db';

// ── POST Handler ──────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // 1. Read raw body
  const rawBody = await request.text();

  // 2. Quick sanity check — PayPal always sends these headers
  const transmissionId = request.headers.get('paypal-transmission-id');
  if (!transmissionId) {
    console.warn('[PP-WEBHOOK] Missing PayPal transmission headers');
    return NextResponse.json(
      { error: 'Not a valid PayPal webhook' },
      { status: 401 },
    );
  }

  // 3. Verify signature via PayPal's own endpoint
  const isValid = await verifyPayPalWebhook(rawBody, request.headers);

  if (!isValid) {
    console.warn('[PP-WEBHOOK] ❌ Signature verification FAILED');
    return NextResponse.json(
      { error: 'Webhook verification failed' },
      { status: 401 },
    );
  }

  console.log('[PP-WEBHOOK] ✅ Signature verified by PayPal');

  // 4. Parse payload
  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const eventType: string = body.event_type || '';
  console.log(`[PP-WEBHOOK] Event: ${eventType}`);

  // 5. Only process PAYMENT.CAPTURE.COMPLETED
  if (eventType !== 'PAYMENT.CAPTURE.COMPLETED') {
    console.log(`[PP-WEBHOOK] Ignoring event: ${eventType}`);
    return NextResponse.json({ status: 'acknowledged', event: eventType });
  }

  // 6. Extract payment details from the capture resource
  const resource = body.resource || {};
  const captureId: string = resource.id || '';
  const captureAmount: number = parseFloat(resource.amount?.value || '0');
  const captureCurrency: string = resource.amount?.currency_code || 'USD';

  // custom_id carries our JSON blob: { planId, userId, credits }
  const customId: string = resource.custom_id || '';
  // reference_id is on the purchase_unit (may also carry userId)
  const supplementaryData = resource.supplementary_data?.related_ids || {};

  let userId = '';
  let creditsToAdd = 0;
  let planId = '';

  // Parse custom_id JSON
  try {
    const parsed = JSON.parse(customId);
    userId = parsed.userId || '';
    creditsToAdd = parseInt(parsed.credits || '0', 10);
    planId = parsed.planId || '';
  } catch {
    console.warn('[PP-WEBHOOK] Could not parse custom_id:', customId);
  }

  if (!userId) {
    console.error('[PP-WEBHOOK] ❌ No userId in custom_id — cannot credit');
    return NextResponse.json(
      { error: 'Missing userId in payment custom_id' },
      { status: 400 },
    );
  }

  // Fallback: infer credits from USD amount
  if (creditsToAdd <= 0) {
    if (captureAmount >= 719) creditsToAdd = 750;
    else if (captureAmount >= 119) creditsToAdd = 120;
    else if (captureAmount >= 59) creditsToAdd = 50;
    else if (captureAmount >= 8) creditsToAdd = 5;
    else creditsToAdd = 1;
    console.warn(`[PP-WEBHOOK] Inferred ${creditsToAdd} credits from $${captureAmount}`);
  }

  const orderId = supplementaryData.order_id || captureId;

  console.log(`[PP-WEBHOOK] Processing: capture=${captureId} | user=${userId} | $${captureAmount} | +${creditsToAdd} credits`);

  // 7. Write to Appwrite
  const db = getServerDB();

  try {
    // ── 7a. Log the transaction ────────────────────────────
    await db.createDocument(DB_ID, 'transactions', ID.unique(), {
      userId,
      orderId,
      gateway: 'paypal',
      amount: captureAmount,
      currency: captureCurrency,
      status: 'success',
      creditsAdded: creditsToAdd,
      createdAt: new Date().toISOString(),
    });

    // ── 7b. Increment user credit balance ──────────────────
    const existing = await db.listDocuments(DB_ID, 'user_credits', [
      Query.equal('userId', userId),
      Query.limit(1),
    ]);

    if (existing.documents.length > 0) {
      const doc = existing.documents[0];
      await db.updateDocument(DB_ID, 'user_credits', doc.$id, {
        credits: (doc.credits || 0) + creditsToAdd,
        totalPurchased: (doc.totalPurchased || 0) + creditsToAdd,
      });
      console.log(`[PP-WEBHOOK] ✅ Updated: ${doc.credits} → ${(doc.credits || 0) + creditsToAdd} credits for ${userId}`);
    } else {
      await db.createDocument(DB_ID, 'user_credits', ID.unique(), {
        userId,
        credits: creditsToAdd,
        totalPurchased: creditsToAdd,
        totalUsed: 0,
      });
      console.log(`[PP-WEBHOOK] ✅ Created credit record: ${creditsToAdd} credits for ${userId}`);
    }

    return NextResponse.json({
      status: 'ok',
      captureId,
      creditsAdded: creditsToAdd,
    });

  } catch (error) {
    console.error('[PP-WEBHOOK] ❌ Appwrite write failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Credit update failed — will reconcile',
      captureId,
    });
  }
}
