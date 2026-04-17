/**
 * ═══════════════════════════════════════════════════════════════
 * SYNTHESIZER MODULE (NO GAME) — Final Report Generation
 * ═══════════════════════════════════════════════════════════════
 * 
 * Takes the combined analysis results from all agents and
 * generates the premium intelligence report narrative.
 */

import { generateStructuredJSON, MODELS } from '@/lib/gemini';
import { NOGAME_SYSTEM_PROMPT } from './prompts/synthesizer';
import type {
  AnalysisResult,
  ProfileReport,
  ReportSection,
  ReportType,
  AnalysisDepth,
  ConfidenceLevel,
} from './types';

// ── Format Analysis for Synthesis ─────────────────────────────

function formatAnalysisForSynthesis(
  analysis: AnalysisResult,
  targetName: string,
  reportType: ReportType,
): string {
  return `═══ CLASSIFIED INTELLIGENCE BRIEFING ═══
TARGET: ${targetName}
REPORT TYPE: ${reportType.toUpperCase()}
OVERALL CONFIDENCE: ${analysis.overallConfidence}
DATA QUALITY: ${analysis.dataQuality}

═══ OCEAN/HEXACO PROFILE (Dr. Makise) ═══
Openness: ${analysis.ocean.openness.score}/10 (${analysis.ocean.openness.confidence}) — ${analysis.ocean.openness.interpretation}
Conscientiousness: ${analysis.ocean.conscientiousness.score}/10 (${analysis.ocean.conscientiousness.confidence}) — ${analysis.ocean.conscientiousness.interpretation}
Extraversion: ${analysis.ocean.extraversion.score}/10 (${analysis.ocean.extraversion.confidence}) — ${analysis.ocean.extraversion.interpretation}
Agreeableness: ${analysis.ocean.agreeableness.score}/10 (${analysis.ocean.agreeableness.confidence}) — ${analysis.ocean.agreeableness.interpretation}
Neuroticism: ${analysis.ocean.neuroticism.score}/10 (${analysis.ocean.neuroticism.confidence}) — ${analysis.ocean.neuroticism.interpretation}
Honesty-Humility: ${analysis.ocean.honestyHumility.score}/10 (${analysis.ocean.honestyHumility.confidence}) — ${analysis.ocean.honestyHumility.interpretation}
Key Insight: ${analysis.ocean.keyInsight}
Pattern Flags: ${analysis.ocean.responsePatternFlags || 'None detected'}

═══ DARK TRIAD ASSESSMENT (Dr. Meruem) ═══
Machiavellianism: ${analysis.darkTriad.machiavellianism.score}/10 (${analysis.darkTriad.machiavellianism.riskLevel}) — Indicators: ${analysis.darkTriad.machiavellianism.indicators.join('; ')}
Narcissism: ${analysis.darkTriad.narcissism.score}/10 (${analysis.darkTriad.narcissism.riskLevel}) — Indicators: ${analysis.darkTriad.narcissism.indicators.join('; ')}
Psychopathy: ${analysis.darkTriad.psychopathy.score}/10 (${analysis.darkTriad.psychopathy.riskLevel}) — Indicators: ${analysis.darkTriad.psychopathy.indicators.join('; ')}
D-Factor: ${analysis.darkTriad.dFactor.score}/10 — ${analysis.darkTriad.dFactor.interpretation}
Overall Risk: ${analysis.darkTriad.overallRiskLevel}
Manipulation Vectors: ${analysis.darkTriad.manipulationVectors.join('; ')}

═══ ATTACHMENT PROFILE (Dr. Hange) ═══
Primary Style: ${analysis.attachment.primaryStyle}
${analysis.attachment.secondaryStyle ? `Secondary Style: ${analysis.attachment.secondaryStyle}` : ''}
Anxiety Dimension: ${analysis.attachment.anxietyDimension}/10
Avoidance Dimension: ${analysis.attachment.avoidanceDimension}/10
Trust Dynamics: ${analysis.attachment.trustDynamics}
Key Insight: ${analysis.attachment.keyInsight}

═══ MOTIVATION & VALUES (Commander Reinhard) ═══
Top Values: ${analysis.motivation.values.slice(0, 5).map(v => `${v.rank}. ${v.name} (${v.score})`).join(', ')}
Holland Codes: ${analysis.motivation.hollandCodes.primary}/${analysis.motivation.hollandCodes.secondary} — ${analysis.motivation.hollandCodes.interpretation}
Intrinsic Drivers: ${analysis.motivation.intrinsicDrivers.join('; ')}
Motivational Conflicts: ${analysis.motivation.motivationalConflicts.join('; ')}
Key Insight: ${analysis.motivation.keyInsight}

═══ DISC COMMUNICATION STYLE ═══
Primary: ${analysis.disc.primary} | Secondary: ${analysis.disc.secondary}
D: ${analysis.disc.dominance} | I: ${analysis.disc.influence} | S: ${analysis.disc.steadiness} | C: ${analysis.disc.conscientiousness}
Style: ${analysis.disc.communicationStyle}

═══ ASIX v2.0 VEDIC LAYER (Yogi) ═══
Sattva: ${analysis.asix.sattva}% | Rajas: ${analysis.asix.rajas}% | Tamas: ${analysis.asix.tamas}%
Dominant Guna: ${analysis.asix.dominantGuna}
Consciousness State: ${analysis.asix.consciousnessState}
Evolutionary Direction: ${analysis.asix.evolutionaryDirection}
Vedantic Archetype: ${analysis.asix.vedanticArchetype}
Key Insight: ${analysis.asix.keyInsight}

═══ CROSS-FRAMEWORK INSIGHTS ═══
${analysis.crossFrameworkInsights.map((insight, i) => `${i + 1}. ${insight}`).join('\n')}`;
}

// ── Synthesis Interface ───────────────────────────────────────

interface SynthesisOutput {
  executiveSummary: string;
  personaSnapshot: string;
  confidenceStatement: string;
  sections: ReportSection[];
  crossFrameworkInsights: string[];
  tacticalRecommendations: string[];
  riskAssessment: string;
  overallConfidence: ConfidenceLevel;
}

// ── Main Synthesizer Function ─────────────────────────────────

export async function synthesizeReport(
  analysis: AnalysisResult,
  targetName: string,
  reportType: ReportType,
  analysisDepth: AnalysisDepth,
  profileId: string,
  processingTimeMs: number,
): Promise<ProfileReport> {
  console.log('[SYNTHESIZER] 🔮 NO GAME generating intelligence report...');

  const briefing = formatAnalysisForSynthesis(analysis, targetName, reportType);

  const synthesis = await generateStructuredJSON<SynthesisOutput>(
    briefing,
    NOGAME_SYSTEM_PROMPT,
    MODELS.PRO,
    0.4,
  );

  console.log('[SYNTHESIZER] ✅ Report synthesized');

  // Build the final report
  const report: ProfileReport = {
    reportId: `PSY-${Date.now().toString(36).toUpperCase()}`,
    targetName,
    reportType,
    analysisDepth,
    generatedAt: new Date().toISOString(),

    // Narrative
    executiveSummary: synthesis.executiveSummary || 'Analysis complete. Review detailed sections below.',
    personaSnapshot: synthesis.personaSnapshot || `${targetName} — Psychological intelligence profile generated.`,
    confidenceStatement: synthesis.confidenceStatement || `Data quality: ${analysis.dataQuality}. Overall confidence: ${analysis.overallConfidence}.`,
    
    // Sections
    sections: synthesis.sections || [],

    // Structured Data (for charts)
    analysis,

    // Tactical Output
    tacticalRecommendations: synthesis.tacticalRecommendations || [],
    riskAssessment: synthesis.riskAssessment || 'No significant risk factors identified.',

    // Meta
    dataPointsAnalyzed: 0, // Set by orchestrator
    processingTimeMs,
    disclaimer: `DISCLAIMER: This report is generated by PsyProfiler.io, an AI-powered psychological intelligence tool by Kunaya Labs. All assessments are based on publicly available digital behavior and are probabilistic in nature — they do not constitute clinical diagnoses. Dark Triad scores reflect subclinical behavioral tendencies, not pathology. The ASIX Vedic layer is a philosophical framework supplement. This report is confidential and intended solely for the authorized recipient. Do not distribute without consent. © ${new Date().getFullYear()} Kunaya Labs.`,
  };

  return report;
}
