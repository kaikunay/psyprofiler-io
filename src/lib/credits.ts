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

import { Client, Databases, Query } from 'node-appwrite';
import type { AnalysisDepth } from './agents/types';

// ── Constants ─────────────────────────────────────────────────

export const CREDIT_COSTS: Record<AnalysisDepth, number> = {
  scout: 1,
  investigator: 3,
  oracle: 5,
};

export const FREE_CREDITS = 3; // New user welcome credits

// ── Server-side Appwrite Client ───────────────────────────────

function getServerClient(): { databases: Databases } {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

  const apiKey = process.env.APPWRITE_API_KEY;
  if (apiKey) {
    client.setKey(apiKey);
  }

  return { databases: new Databases(client) };
}

// ── Credit Operations ─────────────────────────────────────────

export async function getUserCredits(userId: string): Promise<number> {
  try {
    const { databases } = getServerClient();
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';

    // Look for user credits document
    const docs = await databases.listDocuments(dbId, 'user_credits', [
      Query.equal('userId', userId),
      Query.limit(1),
    ]);

    if (docs.documents.length === 0) {
      // First time — create with free credits
      await databases.createDocument(dbId, 'user_credits', 'unique()', {
        userId,
        credits: FREE_CREDITS,
        totalPurchased: 0,
        totalUsed: 0,
      });
      return FREE_CREDITS;
    }

    return docs.documents[0].credits || 0;
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
    const { databases } = getServerClient();
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';

    const docs = await databases.listDocuments(dbId, 'user_credits', [
      Query.equal('userId', userId),
      Query.limit(1),
    ]);

    if (docs.documents.length === 0) return false;

    const doc = docs.documents[0];
    const currentCredits = doc.credits || 0;

    if (currentCredits < cost) return false;

    await databases.updateDocument(dbId, 'user_credits', doc.$id, {
      credits: currentCredits - cost,
      totalUsed: (doc.totalUsed || 0) + cost,
    });

    return true;
  } catch (error) {
    console.error('[CREDITS] Failed to deduct credits:', error);
    // Fail open in dev
    if (process.env.NODE_ENV === 'development') return true;
    return false;
  }
}

export async function addCredits(userId: string, amount: number): Promise<boolean> {
  try {
    const { databases } = getServerClient();
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';

    const docs = await databases.listDocuments(dbId, 'user_credits', [
      Query.equal('userId', userId),
      Query.limit(1),
    ]);

    if (docs.documents.length === 0) {
      await databases.createDocument(dbId, 'user_credits', 'unique()', {
        userId,
        credits: amount,
        totalPurchased: amount,
        totalUsed: 0,
      });
    } else {
      const doc = docs.documents[0];
      await databases.updateDocument(dbId, 'user_credits', doc.$id, {
        credits: (doc.credits || 0) + amount,
        totalPurchased: (doc.totalPurchased || 0) + amount,
      });
    }

    return true;
  } catch (error) {
    console.error('[CREDITS] Failed to add credits:', error);
    return false;
  }
}
