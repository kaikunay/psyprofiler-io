import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/profiles — list all profiles for the authenticated user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ documents: [] });
  }

  try {
    const userId = (session.user as any).id || session.user.email;
    const profiles = await prisma.profile.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    // Map Prisma objects to match the old Appwrite structure expected by the frontend
    const documents = profiles.map(p => ({
      $id: p.id,
      targetName: p.targetName,
      status: p.status,
      $createdAt: p.createdAt,
      reportUrl: p.reportUrl,
      userId: p.userId
    }));

    return NextResponse.json({ documents });
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
    const userId = body.userId || (session.user as any).id || session.user.email;

    // First ensure the User exists in Prisma
    await prisma.user.upsert({
      where: { email: session.user.email || '' },
      update: {},
      create: {
        email: session.user.email || '',
        name: session.user.name,
        image: session.user.image,
        credits: 2
      }
    });

    const newProfile = await prisma.profile.create({
      data: {
        userId: userId,
        targetName: body.targetName || 'Unknown Target',
        status: body.status || 'queued',
      }
    });

    // Map back for the frontend
    return NextResponse.json({
      $id: newProfile.id,
      targetName: newProfile.targetName,
      status: newProfile.status,
      $createdAt: newProfile.createdAt,
      reportUrl: newProfile.reportUrl,
      userId: newProfile.userId
    });
  } catch (error) {
    console.error('[API/profiles] Create error:', error);
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}
