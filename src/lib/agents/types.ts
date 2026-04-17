/**
 * ═══════════════════════════════════════════════════════════════
 * PSYPROFILER INTELLIGENCE PIPELINE — TYPE DEFINITIONS
 * ═══════════════════════════════════════════════════════════════
 * 
 * Core type system for the 9-agent psychological analysis pipeline.
 * Every agent's input/output contracts are defined here.
 */

// ── Report Configuration ──────────────────────────────────────

export type ReportType = 'hiring' | 'sales' | 'dating' | 'self-discovery';
export type AnalysisDepth = 'scout' | 'investigator' | 'oracle';
export type AnalysisStatus = 'queued' | 'intake' | 'analyzing' | 'synthesizing' | 'completed' | 'failed';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT';
export type Platform = 'linkedin' | 'twitter' | 'instagram' | 'reddit' | 'github' | 'facebook' | 'youtube' | 'medium' | 'tiktok' | 'custom' | 'unknown';

// ── Target Input (from Dashboard) ─────────────────────────────

export interface TargetInput {
  profileId: string;
  targetName: string;
  targetUrl?: string;
  platform?: Platform;
  reportType: ReportType;
  analysisDepth: AnalysisDepth;
  customContext?: string; // Additional info user provides
  userId: string;
}

// ── Intake Pipeline Output ────────────────────────────────────

export interface DigitalFragment {
  source: Platform;
  content: string;
  contentType: 'text' | 'image' | 'story' | 'video' | 'article' | 'comment' | 'repost';
  timestamp?: string;
  engagement?: number;
  category: 'HIGH_EMOTION' | 'BUSINESS_LOGIC' | 'PERSONAL_VULNERABLE' | 'NEUTRAL' | 'CREATIVE' | 'PERFORMATIVE';
}

export interface MediaFragment {
  url?: string;
  description: string;
  caption?: string;
  context?: string;
  source: Platform;
}

export interface BehaviorSignal {
  pattern: string;
  frequency: string;
  significance: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface NormalizedData {
  targetName: string;
  bio: string;
  posts: DigitalFragment[];
  images: MediaFragment[];
  stories: MediaFragment[];
  totalDataPoints: number;
  platforms: Platform[];
  temporalRange?: { earliest: string; latest: string };
  dataWindowYears: number;
  behaviorPatterns: BehaviorSignal[];
  dataQuality: ConfidenceLevel;
  warnings: string[];
}

// ── OCEAN/Big Five Profile (ATLAS Agent) ──────────────────────

export interface DimensionScore {
  score: number;        // 1-10 scale
  confidence: ConfidenceLevel;
  interpretation: string;
  prediction: string;
  evidenceCitations: string[];
}

export interface OCEANProfile {
  framework: 'OCEAN_HEXACO';
  openness: DimensionScore;
  conscientiousness: DimensionScore;
  extraversion: DimensionScore;
  agreeableness: DimensionScore;
  neuroticism: DimensionScore;
  honestyHumility: DimensionScore;
  keyInsight: string;
  responsePatternFlags: string | null;
}

// ── Dark Triad Assessment (EREBUS Agent) ──────────────────────

export type RiskLevel = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export interface DarkTriadDimension {
  score: number;        // 1-10 scale
  riskLevel: RiskLevel;
  confidence: ConfidenceLevel;
  indicators: string[];
  adversarialCheck: string;  // Counter-argument to own assessment
}

export interface DarkTriadAssessment {
  framework: 'DARK_TRIAD_SD3';
  machiavellianism: DarkTriadDimension;
  narcissism: DarkTriadDimension;
  psychopathy: DarkTriadDimension;
  dFactor: {
    score: number;
    interpretation: string;
  };
  overallRiskLevel: RiskLevel;
  manipulationVectors: string[];
  ethicalDisclaimer: string;
}

// ── Attachment Theory (PRISM Agent) ───────────────────────────

export type AttachmentStyle = 'SECURE' | 'ANXIOUS_PREOCCUPIED' | 'DISMISSIVE_AVOIDANT' | 'FEARFUL_AVOIDANT';

export interface AttachmentProfile {
  framework: 'ATTACHMENT_THEORY';
  primaryStyle: AttachmentStyle;
  secondaryStyle?: AttachmentStyle;
  confidence: ConfidenceLevel;
  anxietyDimension: number;     // 1-10
  avoidanceDimension: number;   // 1-10
  interpersonalPatterns: string[];
  conflictResponses: string[];
  trustDynamics: string;
  keyInsight: string;
}

// ── Motivation/Values (VECTOR Agent) ──────────────────────────

export interface SchwartzValue {
  name: string;
  score: number;       // 1-10
  rank: number;
  evidence: string;
}

export interface MotivationProfile {
  framework: 'SCHWARTZ_VALUES_RIASEC';
  values: SchwartzValue[];
  hollandCodes: {
    primary: string;
    secondary: string;
    interpretation: string;
  };
  intrinsicDrivers: string[];
  extrinsicDrivers: string[];
  motivationalConflicts: string[];
  keyInsight: string;
}

// ── DISC Communication (tactical layer) ───────────────────────

export type DISCType = 'D' | 'I' | 'S' | 'C';

export interface DISCProfile {
  framework: 'DISC';
  primary: DISCType;
  secondary: DISCType;
  dominance: number;
  influence: number;
  steadiness: number;
  conscientiousness: number;
  communicationStyle: string;
  tacticalPlaybook: {
    doThis: string[];
    dontDoThis: string[];
    emailTemplate: string;
    meetingStrategy: string;
  };
}

// ── ASIX Vedic Layer (ORACLE Agent) ───────────────────────────

export type GunaBalance = 'SATTVA_DOMINANT' | 'RAJAS_DOMINANT' | 'TAMAS_DOMINANT' | 'BALANCED' | 'SATTVA_RAJAS' | 'RAJAS_TAMAS';

export interface ASIXProfile {
  framework: 'ASIX_V2';
  sattva: number;      // 0-100
  rajas: number;       // 0-100
  tamas: number;       // 0-100
  dominantGuna: GunaBalance;
  consciousnessState: string;
  evolutionaryDirection: string;
  spiritualIntelligence: string;
  vedanticArchetype: string;
  keyInsight: string;
}

// ── Combined Analysis Result ──────────────────────────────────

export interface AnalysisResult {
  ocean: OCEANProfile;
  darkTriad: DarkTriadAssessment;
  attachment: AttachmentProfile;
  motivation: MotivationProfile;
  disc: DISCProfile;
  asix: ASIXProfile;
  crossFrameworkInsights: string[];
  overallConfidence: ConfidenceLevel;
  dataQuality: ConfidenceLevel;
}

// ── Final Synthesized Report ──────────────────────────────────

export interface ReportSection {
  title: string;
  content: string;
  confidenceLevel: ConfidenceLevel;
}

export interface ProfileReport {
  reportId: string;
  targetName: string;
  reportType: ReportType;
  analysisDepth: AnalysisDepth;
  generatedAt: string;
  
  // Executive Summary
  executiveSummary: string;
  personaSnapshot: string;    // 3-line elevator pitch
  confidenceStatement: string;
  
  // Detailed Sections
  sections: ReportSection[];
  
  // Structured Data (for charts)
  analysis: AnalysisResult;
  soulSculptureBase64?: string;
  
  // Tactical Output (report-type specific)
  tacticalRecommendations: string[];
  riskAssessment: string;
  
  // Meta
  dataPointsAnalyzed: number;
  processingTimeMs: number;
  disclaimer: string;
}

// ── API Contracts ─────────────────────────────────────────────

export interface AnalyzeRequest {
  profileId: string;
  targetName: string;
  targetUrl?: string;
  platform?: Platform;
  reportType: ReportType;
  analysisDepth?: AnalysisDepth;
}

export interface AnalyzeResponse {
  success: boolean;
  profileId: string;
  status: AnalysisStatus;
  message: string;
  error?: string;
}

export interface ProfileResponse {
  success: boolean;
  profile: {
    id: string;
    targetName: string;
    status: AnalysisStatus;
    createdAt: string;
  };
  report?: ProfileReport;
  error?: string;
}
