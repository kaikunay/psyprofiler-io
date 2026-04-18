import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { Client, Databases, ID, Permission, Role, Query } from 'node-appwrite';

// Server-side Appwrite client (uses API key, not cookies)
function getAppwriteClient() {
  const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('psy-profiler-backend');

  const apiKey = process.env.APPWRITE_API_KEY;
  if (apiKey) client.setKey(apiKey);
  return new Databases(client);
}

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'psyprofiler-db';
const PROFILES_COL = process.env.NEXT_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID || 'profiles';

// GET /api/profiles — list all profiles for the authenticated user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ documents: [] });
  }

  try {
    const db = getAppwriteClient();
    const response = await db.listDocuments(DB_ID, PROFILES_COL, [
      Query.orderDesc('$createdAt'),
    ]);
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API/profiles] List error:', error);
    return NextResponse.json({ documents: [] });
  }
}

// POST /api/profiles — create a new profile
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const db = getAppwriteClient();

    const doc = await db.createDocument(DB_ID, PROFILES_COL, ID.unique(), {
      userId: body.userId || (session.user as any).id || session.user.email,
      targetName: body.targetName,
      status: body.status || 'queued',
    });

    return NextResponse.json(doc);
  } catch (error) {
    console.error('[API/profiles] Create error:', error);
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}
