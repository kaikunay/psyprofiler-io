/**
 * ═══════════════════════════════════════════════════════════════
 * GEMINI CLIENT — Intelligence Engine Connection (Vertex AI)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Routes all inference through GCP Vertex AI to consume $1k credits
 * via vertex-genai-offer-2025 SKU. Uses Application Default
 * Credentials (ADC) when GOOGLE_GENAI_USE_VERTEXAI=TRUE.
 * 
 * Auth: `gcloud auth application-default login` on Azure VM.
 * Fallback: GEMINI_API_KEY (AI Studio) if Vertex AI is unavailable.
 */

import { GoogleGenAI, Type } from '@google/genai';

// ── Vertex AI vs AI Studio ────────────────────────────────────
// The @google/genai SDK reads GOOGLE_GENAI_USE_VERTEXAI automatically.
// When TRUE: uses ADC + project/location for Vertex AI billing.
// When FALSE/unset: uses GEMINI_API_KEY for AI Studio billing.
const useVertexAI = process.env.GOOGLE_GENAI_USE_VERTEXAI === 'TRUE';

if (useVertexAI) {
  console.log('[GEMINI] ✅ Vertex AI mode — using GCP credits (project:', process.env.GOOGLE_CLOUD_PROJECT, ')');
} else {
  console.warn('[GEMINI] ⚠️ AI Studio mode — NOT using GCP credits');
}

// The SDK auto-detects Vertex AI from env vars. For Vertex AI:
// - GOOGLE_GENAI_USE_VERTEXAI=TRUE
// - GOOGLE_CLOUD_PROJECT=kunaya-lab
// - GOOGLE_CLOUD_LOCATION=us-central1
// For AI Studio fallback:
// - GOOGLE_GENAI_API_KEY or apiKey constructor option
export const ai = useVertexAI
  ? new GoogleGenAI({
      vertexai: true,
      project: process.env.GOOGLE_CLOUD_PROJECT,
      location: process.env.GOOGLE_CLOUD_LOCATION,
    })
  : new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'PLACEHOLDER_KEY' });

// ── Model Constants ───────────────────────────────────────────

export const MODELS = {
  /** Deep reasoning — OCEAN, Dark Triad, synthesis. Gemini 3.1 Pro: 1M context, 65K output. */
  PRO: process.env.GEMINI_MODEL || 'gemini-3.1-pro-preview',
  /** Fast inference — intake, categorization, simple tasks. */
  FLASH: process.env.GEMINI_FLASH_MODEL || 'gemini-3-flash-preview',
  /** Image generation for reports — Gemini 3 Pro with native image output. */
  IMAGE: process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image-preview',
} as const;

// ── Helper: Structured JSON Generation ────────────────────────

export async function generateStructuredJSON<T>(
  prompt: string,
  systemInstruction: string,
  model: string = MODELS.PRO,
  temperature: number = 0.15,
): Promise<T> {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      temperature,
      responseMimeType: 'application/json',
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('[GEMINI] Empty response received from model');
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    // Sometimes the model wraps JSON in markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim()) as T;
    }
    throw new Error(`[GEMINI] Failed to parse JSON response: ${text.substring(0, 200)}`);
  }
}

// ── Helper: Narrative Text Generation ─────────────────────────

export async function generateNarrative(
  prompt: string,
  systemInstruction: string,
  model: string = MODELS.PRO,
  temperature: number = 0.4,
): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      temperature,
    },
  });

  return response.text || '';
}

// Re-export Type for schema definitions
export { Type };
