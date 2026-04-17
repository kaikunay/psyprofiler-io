/**
 * ═══════════════════════════════════════════════════════════════
 * ORCHESTRATOR (LELOUCH / LELOUCH) — Master Pipeline Controller
 * ═══════════════════════════════════════════════════════════════
 * 
 * The supreme coordinator. Takes a target input, runs the full
 * pipeline (Intake → Profiler → Synthesizer), manages state
 * transitions, and returns the final report.
 * 
 * Named after Lelouch vi Britannia — the strategist who sees
 * 10 moves ahead and coordinates all pieces perfectly.
 */

import { collectAndNormalize } from './intake';
import { runAnalysisPipeline } from './profiler';
import { synthesizeReport } from './synthesizer';
import type { TargetInput, ProfileReport, AnalysisStatus } from './types';

// ── Status Callback Type ──────────────────────────────────────

type StatusCallback = (status: AnalysisStatus, message: string) => Promise<void>;

// ── Main Orchestration Function ───────────────────────────────

export async function executeFullPipeline(
  input: TargetInput,
  onStatusChange?: StatusCallback,
): Promise<ProfileReport> {
  const pipelineStart = Date.now();

  console.log('═══════════════════════════════════════════');
  console.log('  LELOUCH LELOUCH — INTELLIGENCE PIPELINE');
  console.log(`  Target: ${input.targetName}`);
  console.log(`  Report: ${input.reportType} | Depth: ${input.analysisDepth}`);
  console.log('═══════════════════════════════════════════');

  try {
    // ── PHASE 1: INTAKE ─────────────────────────────────────
    await onStatusChange?.('intake', 'Collecting digital intelligence...');
    console.log('\n[LELOUCH] Phase 1/3: INTAKE (MAYURI + FUTABA)');

    const normalizedData = await collectAndNormalize(
      input.targetName,
      input.targetUrl,
      input.platform,
      input.customContext,
    );

    console.log(`[LELOUCH] Intake complete: ${normalizedData.totalDataPoints} data points | Quality: ${normalizedData.dataQuality}`);

    // ── PHASE 2: ANALYSIS ───────────────────────────────────
    await onStatusChange?.('analyzing', 'Agent council is analyzing...');
    console.log('\n[LELOUCH] Phase 2/3: ANALYSIS (MAKISE + MERUEM + HANGE + REINHARD + YOGI)');

    const analysisResult = await runAnalysisPipeline(
      normalizedData,
      input.reportType,
    );

    console.log(`[LELOUCH] Analysis complete: ${analysisResult.crossFrameworkInsights.length} cross-framework insights`);

    // ── PHASE 3: SYNTHESIS ──────────────────────────────────
    await onStatusChange?.('synthesizing', 'Synthesizing intelligence report...');
    console.log('\n[LELOUCH] Phase 3/3: SYNTHESIS (NO GAME)');

    const processingTimeMs = Date.now() - pipelineStart;

    const report = await synthesizeReport(
      analysisResult,
      input.targetName,
      input.reportType,
      input.analysisDepth,
      input.profileId,
      processingTimeMs,
    );

    // Set the data points count
    report.dataPointsAnalyzed = normalizedData.totalDataPoints;

    // ── PHASE 4: AVATAR GENERATION (VERTEX AI / IMAGEN 3) ──
    try {
       await onStatusChange?.('synthesizing', 'Forging the Soul Sculpture Avatar...');
       console.log('\n[LELOUCH] Phase 4: Avatar Generation via Vertex AI (Imagen 3)');
       
       const ai = (await import('@/lib/gemini')).ai;
       const archetype = analysisResult.asix.vedanticArchetype;
       const risk = analysisResult.darkTriad.overallRiskLevel;
       const desc = `A stunning, high-contrast, cyberpunk crystal sculpture in dark obsidian and cyber-red neon, representing a psychological archetype of a ${risk} risk ${archetype} personality. Very abstract, beautiful, dramatic studio lighting, 8k resolution, trending on ArtStation.`;
       
       const imageResponse = await ai.models.generateImages({
          model: 'imagen-3.0-generate-001',
          prompt: desc,
          config: {
             numberOfImages: 1,
             outputMimeType: 'image/jpeg',
             aspectRatio: '1:1',
          }
       });
       
       if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
          report.soulSculptureBase64 = imageResponse.generatedImages![0].image!.imageBytes;
          console.log('[LELOUCH] ✅ Soul Sculpture forged successfully.');
       }
    } catch (imgError: any) {
       console.error('[LELOUCH] ⚠️ Failed to forge Soul Sculpture:', imgError?.message || imgError);
       // We ignore failure so the report is still delivered
    }

    const totalTime = ((Date.now() - pipelineStart) / 1000).toFixed(1);
    console.log('\n═══════════════════════════════════════════');
    console.log(`  PIPELINE COMPLETE — ${totalTime}s`);
    console.log(`  Report ID: ${report.reportId}`);
    console.log(`  Confidence: ${report.analysis.overallConfidence}`);
    console.log(`  Avatar Included: ${!!report.soulSculptureBase64}`);
    console.log('═══════════════════════════════════════════\n');

    return report;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown pipeline error';
    console.error('[LELOUCH] ❌ Pipeline failed:', errorMessage);
    await onStatusChange?.('failed', errorMessage);
    throw error;
  }
}
