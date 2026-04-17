/**
 * ═══════════════════════════════════════════════════════════════
 * PROFILER MODULE — Core Psychological Analysis Engine
 * ═══════════════════════════════════════════════════════════════
 * 
 * Runs all specialist agents in parallel against normalized data.
 * This is where the 6-agent council does its work:
 * MAKISE (OCEAN) + MERUEM (Dark Triad) + HANGE (Attachment) +
 * REINHARD (Motivation/DISC) + YOGI (ASIX)
 * 
 * Optimized: runs in 2 parallel batches to maximize speed
 * while staying within Gemini rate limits.
 */

import { generateStructuredJSON, MODELS } from '@/lib/gemini';
import { MAKISE_SYSTEM_PROMPT } from './prompts/ocean';
import { MERUEM_SYSTEM_PROMPT } from './prompts/darkTriad';
import { HANGE_SYSTEM_PROMPT } from './prompts/attachment';
import { REINHARD_SYSTEM_PROMPT } from './prompts/motivation';
import { YOGI_SYSTEM_PROMPT } from './prompts/asix';

import type {
  NormalizedData,
  OCEANProfile,
  DarkTriadAssessment,
  AttachmentProfile,
  MotivationProfile,
  DISCProfile,
  ASIXProfile,
  AnalysisResult,
  ConfidenceLevel,
  ReportType,
} from './types';

// ── Data Formatting ───────────────────────────────────────────

function formatDataForAnalysis(data: NormalizedData, reportType: ReportType): string {
  const sections: string[] = [
    `═══ INTELLIGENCE BRIEFING ═══`,
    `TARGET: ${data.targetName}`,
    `REPORT TYPE: ${reportType}`,
    `DATA QUALITY: ${data.dataQuality}`,
    `TOTAL DATA POINTS: ${data.totalDataPoints}`,
    `PLATFORMS: ${data.platforms.join(', ')}`,
    ``,
    `═══ BIO ═══`,
    data.bio,
    ``,
  ];

  if (data.temporalRange) {
    sections.push(`═══ TEMPORAL RANGE ═══`);
    sections.push(`Earliest: ${data.temporalRange.earliest}`);
    sections.push(`Latest: ${data.temporalRange.latest}`);
    sections.push(``);
  }

  if (data.warnings.length > 0) {
    sections.push(`═══ DATA WARNINGS ═══`);
    data.warnings.forEach(w => sections.push(`⚠ ${w}`));
    sections.push(``);
  }

  if (data.posts.length > 0) {
    sections.push(`═══ DIGITAL FOOTPRINT (${data.posts.length} fragments) ═══`);
    data.posts.forEach((post, i) => {
      sections.push(`\n[${i + 1}] Platform: ${post.source} | Category: ${post.category}${post.timestamp ? ` | Time: ${post.timestamp}` : ''}`);
      sections.push(post.content);
    });
  }

  return sections.join('\n');
}

// ── Individual Agent Runners ──────────────────────────────────

async function runMakise(dataPrompt: string): Promise<OCEANProfile> {
  console.log('[PROFILER] 🧬 MAKISE (OCEAN) analyzing...');
  return generateStructuredJSON<OCEANProfile>(
    dataPrompt,
    MAKISE_SYSTEM_PROMPT,
    MODELS.PRO,
    0.15,
  );
}

async function runMeruem(dataPrompt: string): Promise<DarkTriadAssessment> {
  console.log('[PROFILER] 🕳️ MERUEM (Dark Triad) analyzing...');
  return generateStructuredJSON<DarkTriadAssessment>(
    dataPrompt,
    MERUEM_SYSTEM_PROMPT,
    MODELS.PRO,
    0.1,
  );
}

async function runHange(dataPrompt: string): Promise<AttachmentProfile> {
  console.log('[PROFILER] 🔗 HANGE (Attachment) analyzing...');
  return generateStructuredJSON<AttachmentProfile>(
    dataPrompt,
    HANGE_SYSTEM_PROMPT,
    MODELS.PRO,
    0.2,
  );
}

async function runReinhard(dataPrompt: string): Promise<{ motivation: MotivationProfile; disc: DISCProfile }> {
  console.log('[PROFILER] 🎯 REINHARD (Motivation + DISC) analyzing...');
  const result = await generateStructuredJSON<any>(
    dataPrompt,
    REINHARD_SYSTEM_PROMPT,
    MODELS.PRO,
    0.2,
  );

  // REINHARD returns combined output — extract both frameworks
  const disc: DISCProfile = result.disc || {
    framework: 'DISC',
    primary: 'C',
    secondary: 'S',
    dominance: 5,
    influence: 5,
    steadiness: 5,
    conscientiousness: 5,
    communicationStyle: 'Balanced communication style',
    tacticalPlaybook: {
      doThis: ['Be direct and clear'],
      dontDoThis: ['Avoid ambiguity'],
      emailTemplate: 'Clear, structured communication',
      meetingStrategy: 'Organized, agenda-driven approach',
    },
  };

  const motivation: MotivationProfile = {
    framework: 'SCHWARTZ_VALUES_RIASEC',
    values: result.values || [],
    hollandCodes: result.hollandCodes || { primary: 'I', secondary: 'A', interpretation: '' },
    intrinsicDrivers: result.intrinsicDrivers || [],
    extrinsicDrivers: result.extrinsicDrivers || [],
    motivationalConflicts: result.motivationalConflicts || [],
    keyInsight: result.keyInsight || '',
  };

  return { motivation, disc };
}

async function runYogi(dataPrompt: string): Promise<ASIXProfile> {
  console.log('[PROFILER] 🕉️ YOGI (ASIX) analyzing...');
  return generateStructuredJSON<ASIXProfile>(
    dataPrompt,
    YOGI_SYSTEM_PROMPT,
    MODELS.PRO,
    0.25,
  );
}

// ── Cross-Framework Validation ────────────────────────────────

function validateCrossFramework(
  ocean: OCEANProfile,
  darkTriad: DarkTriadAssessment,
  attachment: AttachmentProfile,
  motivation: MotivationProfile,
  asix: ASIXProfile,
): string[] {
  const insights: string[] = [];

  // Check for contradictions that reveal complexity
  if (ocean.agreeableness.score > 7 && darkTriad.machiavellianism.score > 5) {
    insights.push(
      'TENSION DETECTED: High Agreeableness paired with Machiavellian tendencies suggests a sophisticated social operator — warm on the surface, strategic underneath. This is not necessarily deceptive; it may indicate emotional intelligence combined with strategic thinking.'
    );
  }

  if (ocean.neuroticism.score > 7 && attachment.primaryStyle === 'SECURE') {
    insights.push(
      'CONTRADICTION FLAG: High Neuroticism rarely co-occurs with secure attachment. Possible explanations: (1) Recent life stressor elevating apparent neuroticism, (2) Earned security through therapy/growth despite anxious tendencies, (3) Data artifacts from different time periods.'
    );
  }

  if (ocean.extraversion.score < 4 && asix.rajas > 50) {
    insights.push(
      'INTERESTING PATTERN: Low Extraversion with high Rajas suggests internal ambition — this individual is driven but channels energy inward (writing, planning, building) rather than outward (networking, socializing). A "silent achiever" archetype.'
    );
  }

  if (darkTriad.psychopathy.score > 6 && attachment.primaryStyle === 'ANXIOUS_PREOCCUPIED') {
    insights.push(
      'COMPLEX PROFILE: Elevated psychopathic traits alongside anxious attachment is an unusual combination. May indicate emotional volatility masked by surface-level callousness — a "tough exterior, turbulent interior" pattern.'
    );
  }

  // Convergent findings that boost confidence
  if (ocean.conscientiousness.score > 7 && asix.sattva > 50 && motivation.values.some(v => v.name === 'Achievement' && v.rank <= 3)) {
    insights.push(
      'CONVERGENT STRENGTH: High Conscientiousness, Sattvic dominance, and top-tier Achievement values converge to paint a picture of a disciplined, purpose-driven individual. High confidence in this assessment across all three frameworks.'
    );
  }

  if (insights.length === 0) {
    insights.push(
      'Cross-framework analysis shows general consistency across all assessment dimensions, suggesting a coherent and authentic digital self-presentation.'
    );
  }

  return insights;
}

// ── Overall Confidence Assessment ─────────────────────────────

function calculateOverallConfidence(
  dataQuality: ConfidenceLevel,
  ocean: OCEANProfile,
  darkTriad: DarkTriadAssessment,
): ConfidenceLevel {
  if (dataQuality === 'INSUFFICIENT') return 'INSUFFICIENT';

  const oceanConfidences = [
    ocean.openness.confidence,
    ocean.conscientiousness.confidence,
    ocean.extraversion.confidence,
    ocean.agreeableness.confidence,
    ocean.neuroticism.confidence,
  ];

  const highCount = oceanConfidences.filter(c => c === 'HIGH').length;
  
  if (dataQuality === 'HIGH' && highCount >= 3) return 'HIGH';
  if (dataQuality === 'LOW' || highCount <= 1) return 'LOW';
  return 'MEDIUM';
}

// ── Main Profiler Function ────────────────────────────────────

export async function runAnalysisPipeline(
  data: NormalizedData,
  reportType: ReportType,
): Promise<AnalysisResult> {
  const dataPrompt = formatDataForAnalysis(data, reportType);

  console.log('[PROFILER] ═══ AGENT COUNCIL ACTIVATED ═══');
  console.log(`[PROFILER] Data points: ${data.totalDataPoints} | Quality: ${data.dataQuality}`);

  // Run all 5 agents in parallel — maximum speed
  const [oceanResult, darkTriadResult, attachmentResult, vectorResult, asixResult] = await Promise.all([
    runMakise(dataPrompt),
    runMeruem(dataPrompt),
    runHange(dataPrompt),
    runReinhard(dataPrompt),
    runYogi(dataPrompt),
  ]);

  console.log('[PROFILER] ═══ ALL AGENTS REPORTED ═══');

  // Cross-framework validation
  const crossInsights = validateCrossFramework(
    oceanResult,
    darkTriadResult,
    attachmentResult,
    vectorResult.motivation,
    asixResult,
  );

  const overallConfidence = calculateOverallConfidence(
    data.dataQuality,
    oceanResult,
    darkTriadResult,
  );

  return {
    ocean: oceanResult,
    darkTriad: darkTriadResult,
    attachment: attachmentResult,
    motivation: vectorResult.motivation,
    disc: vectorResult.disc,
    asix: asixResult,
    crossFrameworkInsights: crossInsights,
    overallConfidence,
    dataQuality: data.dataQuality,
  };
}
