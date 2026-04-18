import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { Client, Databases, Query } from 'node-appwrite';

// Server-side Appwrite client (uses API key, not cookies)
function getAppwriteClient() {
  const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('psy-profiler-backend');

  const apiKey = process.env.APPWRITE_API_KEY;
  if (apiKey) client.setKey(apiKey);
  return new Databases(client);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ credits: 3 }); // Default for unauthenticated
  }

  try {
    const db = getAppwriteClient();
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'psyprofiler-db';
    const userId = (session.user as any).id || session.user.email;

    const docs = await db.listDocuments(dbId, 'user_credits', [
      Query.equal('userId', userId),
      Query.limit(1),
    ]);

    if (docs.documents.length > 0) {
      return NextResponse.json({ credits: docs.documents[0].credits ?? 0 });
    }
    return NextResponse.json({ credits: 3 }); // New users get 3 free
  } catch (error) {
    console.error('[API/credits] Error:', error);
    return NextResponse.json({ credits: 3 }); // Graceful fallback
  }
}
