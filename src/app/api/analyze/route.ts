/**
 * ═══════════════════════════════════════════════════════════════
 * API ROUTE: /api/analyze — Main Analysis Endpoint
 * ═══════════════════════════════════════════════════════════════
 * 
 * POST: Triggers the full intelligence pipeline for a target.
 * Accepts profile data, validates credits, runs the pipeline,
 * and stores the report.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { executeFullPipeline } from '@/lib/agents/orchestrator';
import { deductCredits } from '@/lib/credits';
import type { AnalyzeRequest, AnalyzeResponse, TargetInput } from '@/lib/agents/types';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";

// ── POST /api/analyze ─────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, status: 'failed', message: 'Unauthorized. Please check your credentials.', profileId: '' }, { status: 401 });
    }

    const body: AnalyzeRequest = await request.json();
    const { profileId, targetName, targetUrl, platform, reportType, analysisDepth = 'scout' } = body;

    // Validate required fields
    if (!profileId || !targetName || !reportType) {
      return NextResponse.json<AnalyzeResponse>({
        success: false,
        profileId: profileId || '',
        status: 'failed',
        message: 'Missing required fields: profileId, targetName, reportType',
        error: 'VALIDATION_ERROR',
      }, { status: 400 });
    }

    // Extract userId from the profile document (for credit deduction)
    let userId = '';
    let targetEmail = '';
    
    try {
      const profileDoc = await prisma.profile.findUnique({
        where: { id: profileId },
        include: { user: true }
      });
      if (profileDoc) {
        if (profileDoc.userId !== (session.user as any).id) {
          return NextResponse.json({ success: false, status: 'failed', message: 'Forbidden. Profile does not belong to you.', profileId: profileId }, { status: 403 });
        }
        userId = profileDoc.userId;
        targetEmail = profileDoc.user?.email || '';
      } else {
        userId = (session.user as any).id;
      }
    } catch {
      userId = (session.user as any).id;
    }

    // Deduct credits (skip in dev if no user exists)
    const creditDeducted = await deductCredits(userId, analysisDepth);
    if (!creditDeducted && process.env.NODE_ENV !== 'development') {
      return NextResponse.json<AnalyzeResponse>({
        success: false,
        profileId,
        status: 'failed',
        message: 'Insufficient credits. Please purchase more credits.',
        error: 'INSUFFICIENT_CREDITS',
      }, { status: 402 });
    }

    // Update profile status to 'intake'
    try {
      await prisma.profile.update({
        where: { id: profileId },
        data: { status: 'intake' }
      });
    } catch {
      console.warn('[API] Could not update profile status — continuing anyway');
    }

    // ── Run the full pipeline (async background) ──────────
    // We respond immediately and process in background
    const pipelinePromise = executeFullPipeline(
      {
        profileId,
        targetName,
        targetUrl,
        platform,
        reportType,
        analysisDepth,
        userId,
      } as TargetInput,
      async (status, message) => {
        // Update profile status as pipeline progresses
        try {
          // Store status in DB if needed. Currently we only have one status field, 
          // Appwrite had statusMessage which we don't have in Prisma yet. So we can update status.
          await prisma.profile.update({
            where: { id: profileId },
            data: { status }
          });
        } catch {
          console.warn(`[API] Status update to '${status}' failed`);
        }
      },
    );

    // Don't await the full pipeline — let it run in background
    // But DO handle its completion/failure
    pipelinePromise
      .then(async (report) => {
        try {
          await prisma.profile.update({
            where: { id: profileId },
            data: {
              status: 'completed',
              aiAnalysis: report as any,
            }
          });
          console.log(`[API] ✅ Report stored for profile ${profileId}`);

          // --- N8N WEBHOOK TRIGGER ---
          try {
            const webhookUrl = process.env.N8N_URL;
            if (webhookUrl && targetEmail) {
               console.log(`[API] Triggering n8n webhook for ${profileId}...`);
               await fetch(webhookUrl, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                   profileId,
                   targetName,
                   targetEmail,
                   renderTargetUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/render/${profileId}`
                 })
               });
               console.log(`[API] ✅ n8n webhook triggered`);
            } else {
               console.warn(`[API] Skipped n8n webhook. URL config: ${!!webhookUrl}, User Email: ${!!targetEmail}`);
            }
          } catch(webhookErr) {
             console.error('[API] Failed to trigger N8N webhook:', webhookErr);
          }
        } catch (err) {
          console.error('[API] Failed to store report:', err);
        }
      })
      .catch(async (err) => {
        console.error('[API] Pipeline failed:', err);
        try {
          await prisma.profile.update({
            where: { id: profileId },
            data: { status: 'failed' }
          });
        } catch {
          console.error('[API] Could not update failed status');
        }
      });

    // Respond immediately — client will poll for status
    return NextResponse.json<AnalyzeResponse>({
      success: true,
      profileId,
      status: 'intake',
      message: 'Intelligence pipeline activated. Estimated completion: 30-60 seconds.',
    }, { status: 202 });

  } catch (error) {
    console.error('[API] /api/analyze error:', error);
    return NextResponse.json<AnalyzeResponse>({
      success: false,
      profileId: '',
      status: 'failed',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
