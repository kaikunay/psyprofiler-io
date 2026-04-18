/**
 * ═══════════════════════════════════════════════════════════════
 * API ROUTE: /api/profiles/[id] — Profile Data Endpoint
 * ═══════════════════════════════════════════════════════════════
 * 
 * GET: Returns the profile status and report data if completed.
 * Used by the dashboard for status polling and the report viewer.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { ProfileResponse, ProfileReport } from '@/lib/agents/types';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";

// ── GET /api/profiles/[id] ────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json<ProfileResponse>({
        success: false,
        profile: { id: '', targetName: '', status: 'failed', createdAt: '' },
        error: 'Profile ID is required',
      }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json<ProfileResponse>({
        success: false,
        profile: { id: '', targetName: '', status: 'failed', createdAt: '' },
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const doc = await prisma.profile.findUnique({
      where: { id },
    });

    if (doc && doc.userId !== (session.user as any).id) {
      return NextResponse.json<ProfileResponse>({
        success: false,
        profile: { id: '', targetName: '', status: 'failed', createdAt: '' },
        error: 'Forbidden',
      }, { status: 403 });
    }

    if (!doc) {
      return NextResponse.json<ProfileResponse>({
        success: false,
        profile: { id: '', targetName: '', status: 'failed', createdAt: '' },
        error: 'Profile not found',
      }, { status: 404 });
    }

    const response: ProfileResponse = {
      success: true,
      profile: {
        id: doc.id,
        targetName: doc.targetName || doc.targetUsername || 'Unknown',
        status: (doc.status as any) || 'queued',
        createdAt: doc.createdAt.toISOString(),
      },
    };

    // If completed, parse and include the report data
    if (doc.status === 'completed' && doc.aiAnalysis) {
      try {
        response.report = (typeof doc.aiAnalysis === 'string' ? JSON.parse(doc.aiAnalysis) : doc.aiAnalysis) as ProfileReport;
      } catch {
        console.error('[API] Failed to parse stored report data');
      }
    }

    return NextResponse.json<ProfileResponse>(response);

  } catch (error: any) {
    console.error('[API] /api/profiles/[id] error:', error);
    return NextResponse.json<ProfileResponse>({
      success: false,
      profile: { id: '', targetName: '', status: 'failed', createdAt: '' },
      error: 'Internal server error',
    }, { status: 500 });
  }
}
