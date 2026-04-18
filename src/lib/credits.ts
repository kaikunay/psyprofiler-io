/**
 * ═══════════════════════════════════════════════════════════════
 * CREDIT MANAGEMENT SYSTEM
 * ═══════════════════════════════════════════════════════════════
 * 
 * Manages user credits for analysis requests.
 * Credit costs by tier:
 *   Scout → 1 credit
 *   Investigator → 3 credits
 *   Oracle → 5 credits
 */

import prisma from './prisma';
import type { AnalysisDepth } from './agents/types';

// ── Constants ─────────────────────────────────────────────────

export const CREDIT_COSTS: Record<AnalysisDepth, number> = {
  scout: 1,
  investigator: 3,
  oracle: 5,
};

export const FREE_CREDITS = 3; // New user welcome credits

// ── Helpers ───────────────────────────────────────────────────

async function findUser(userIdOrEmail: string) {
  return await prisma.user.findFirst({
    where: {
      OR: [
        { id: userIdOrEmail },
        { email: userIdOrEmail },
      ],
    },
  });
}

// ── Credit Operations ─────────────────────────────────────────

export async function getUserCredits(userId: string): Promise<number> {
  try {
    const user = await findUser(userId);

    if (!user) {
      // First time — create with free credits if it's an email
      if (userId.includes('@')) {
        const newUser = await prisma.user.create({
          data: {
            email: userId,
            credits: FREE_CREDITS,
          }
        });
        return newUser.credits;
      }
      return 0;
    }

    return user.credits || 0;
  } catch (error) {
    console.error('[CREDITS] Failed to get user credits:', error);
    // Fail open in dev — allow analysis even if credit check fails
    if (process.env.NODE_ENV === 'development') return 999;
    return 0;
  }
}

export async function deductCredits(userId: string, depth: AnalysisDepth): Promise<boolean> {
  try {
    const cost = CREDIT_COSTS[depth];
    const user = await findUser(userId);

    if (!user) return false;
    
    const currentCredits = user.credits || 0;
    if (currentCredits < cost) return false;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { credits: currentCredits - cost },
      }),
      prisma.creditHistory.create({
        data: {
          userId: user.id,
          amount: -cost,
          reason: `profile_generation_${depth}`,
        }
      })
    ]);

    return true;
  } catch (error) {
    console.error('[CREDITS] Failed to deduct credits:', error);
    // Fail open in dev
    if (process.env.NODE_ENV === 'development') return true;
    return false;
  }
}

export async function addCredits(userId: string, amount: number, stripeId?: string): Promise<boolean> {
  try {
    let user = await findUser(userId);

    if (!user) {
      if (userId.includes('@')) {
        user = await prisma.user.create({
          data: {
            email: userId,
            credits: amount,
          }
        });
      } else {
        return false;
      }
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { credits: (user.credits || 0) + amount },
      });
    }

    await prisma.creditHistory.create({
      data: {
        userId: user.id,
        amount: amount,
        reason: 'purchase',
        stripeId: stripeId,
      }
    });

    return true;
  } catch (error) {
    console.error('[CREDITS] Failed to add credits:', error);
    return false;
  }
}
