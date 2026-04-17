/**
 * ═══════════════════════════════════════════════════════════════
 * API ROUTE: /api/analyze — Main Analysis Endpoint
 * ═══════════════════════════════════════════════════════════════
 * 
 * POST: Triggers the full intelligence pipeline for a target.
 * Accepts profile data, validates credits, runs the pipeline,
 * and stores the report in Appwrite.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases } from 'node-appwrite';
import { executeFullPipeline } from '@/lib/agents/orchestrator';
import { deductCredits } from '@/lib/credits';
import type { AnalyzeRequest, AnalyzeResponse, TargetInput } from '@/lib/agents/types';

// ── Server Appwrite Client ────────────────────────────────────

function getServerDB() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

  const apiKey = process.env.APPWRITE_API_KEY;
  if (apiKey) client.setKey(apiKey);

  return new Databases(client);
}

// ── POST /api/analyze ─────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
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
    const databases = getServerDB();
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
    const profilesCollection = process.env.NEXT_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID || 'profiles';

    let userId = '';
    try {
      const profileDoc = await databases.getDocument(dbId, profilesCollection, profileId);
      userId = profileDoc.userId || '';
    } catch {
      // Profile might not exist yet in dev
      userId = 'dev-user';
    }

    // Deduct credits (skip in dev if no collection exists)
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
      await databases.updateDocument(dbId, profilesCollection, profileId, {
        status: 'intake',
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
        // Update profile status in Appwrite as pipeline progresses
        try {
          await databases.updateDocument(dbId, profilesCollection, profileId, {
            status,
            statusMessage: message,
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
          await databases.updateDocument(dbId, profilesCollection, profileId, {
            status: 'completed',
            statusMessage: 'Intelligence report ready',
            reportData: JSON.stringify(report),
            completedAt: new Date().toISOString(),
          });
          console.log(`[API] ✅ Report stored for profile ${profileId}`);
        } catch (err) {
          console.error('[API] Failed to store report:', err);
        }
      })
      .catch(async (err) => {
        console.error('[API] Pipeline failed:', err);
        try {
          await databases.updateDocument(dbId, profilesCollection, profileId, {
            status: 'failed',
            statusMessage: err instanceof Error ? err.message : 'Pipeline failed',
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
