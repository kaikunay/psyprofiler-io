import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * ═══════════════════════════════════════════════════════════════
 * API ROUTE: /api/pipeline/publish
 * ═══════════════════════════════════════════════════════════════
 * 
 * Called by the Orchestrator after NO GAME completes synthesis.
 * This triggers the n8n webhook positioned on Azure D8s_v5 VM,
 * which takes over headless PDF rendering and email delivery.
 */

export async function POST(request: NextRequest) {
  try {
    const { profileId, targetEmail } = await request.json();

    if (!profileId || !targetEmail) {
      return NextResponse.json({ error: 'Missing profileId or targetEmail' }, { status: 400 });
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      console.warn('[PIPELINE] WARNING: n8n webhook URL not configured. Skipping PDF generation trigger.');
      return NextResponse.json({ success: true, warning: 'n8n not configured' });
    }

    // 1. Verify profile is complete in DB
    const doc = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!doc) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (doc.status !== 'completed') {
      return NextResponse.json({ error: 'Profile not completed' }, { status: 400 });
    }

    // 2. Transmit signal to n8n Nervous System (Azure VM)
    console.log(`[PIPELINE] 📡 Transmitting PDF rendering signal to n8n for ${profileId}...`);
    
    // We send the internal App URL so n8n can access it without public routing if inside same VNET
    const renderTargetUrl = `${process.env.INTERNAL_APP_URL || process.env.NEXT_PUBLIC_APP_URL}/report/${profileId}`;

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.N8N_WEBHOOK_SECRET || 'psyprofiler-secret-key'}`,
      },
      body: JSON.stringify({
        profileId,
        targetEmail,
        renderTargetUrl,
        targetName: doc.targetName,
        metadata: {
          timestamp: new Date().toISOString(),
          requestedBy: doc.userId,
        }
      }),
    });

    if (!n8nResponse.ok) {
      const err = await n8nResponse.text();
      console.error('[PIPELINE] 🚨 n8n trigger failed:', err);
      return NextResponse.json({ error: 'Failed to trigger n8n' }, { status: 502 });
    }

    console.log('[PIPELINE] ✅ n8n trigger successful. PDF pipeline active.');
    return NextResponse.json({ success: true, message: 'PDF workflow triggered' });

  } catch (error) {
    console.error('[PIPELINE] Publish error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
