import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ credits: 3 }); // Default for unauthenticated
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { credits: true },
    });

    if (user) {
      return NextResponse.json({ credits: user.credits ?? 0 });
    }
    return NextResponse.json({ credits: 3 }); // New users get 3 free
  } catch (error) {
    console.error('[API/credits] Error:', error);
    return NextResponse.json({ credits: 3 }); // Graceful fallback
  }
}
