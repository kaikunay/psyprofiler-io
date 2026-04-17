/**
 * ═══════════════════════════════════════════════════════════════
 * API ROUTE: /api/profiles/[id] — Profile Data Endpoint
 * ═══════════════════════════════════════════════════════════════
 * 
 * GET: Returns the profile status and report data if completed.
 * Used by the dashboard for status polling and the report viewer.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases } from 'node-appwrite';
import type { ProfileResponse, ProfileReport } from '@/lib/agents/types';

// ── Server Appwrite Client ────────────────────────────────────

function getServerDB() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

  const apiKey = process.env.APPWRITE_API_KEY;
  if (apiKey) client.setKey(apiKey);

  return new Databases(client);
}

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

    const databases = getServerDB();
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
    const profilesCollection = process.env.NEXT_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID || 'profiles';

    const doc = await databases.getDocument(dbId, profilesCollection, id);

    const response: ProfileResponse = {
      success: true,
      profile: {
        id: doc.$id,
        targetName: doc.targetName || doc.target || 'Unknown',
        status: doc.status || 'queued',
        createdAt: doc.$createdAt,
      },
    };

    // If completed, parse and include the report data
    if (doc.status === 'completed' && doc.reportData) {
      try {
        response.report = JSON.parse(doc.reportData) as ProfileReport;
      } catch {
        console.error('[API] Failed to parse stored report data');
      }
    }

    return NextResponse.json<ProfileResponse>(response);

  } catch (error: any) {
    if (error?.code === 404) {
      return NextResponse.json<ProfileResponse>({
        success: false,
        profile: { id: '', targetName: '', status: 'failed', createdAt: '' },
        error: 'Profile not found',
      }, { status: 404 });
    }

    console.error('[API] /api/profiles/[id] error:', error);
    return NextResponse.json<ProfileResponse>({
      success: false,
      profile: { id: '', targetName: '', status: 'failed', createdAt: '' },
      error: 'Internal server error',
    }, { status: 500 });
  }
}
