/**
 * ═══════════════════════════════════════════════════════════════
 * MAYURI MODULE (MAYURI) — 3-Stage OSINT Intelligence Collection
 * ═══════════════════════════════════════════════════════════════
 * 
 * Stage 1: SHERLOCK — Username discovery across 400+ platforms
 * Stage 2: LIGHTPANDA — Headless browser page rendering (Zig, 11x faster)
 * Stage 3: PAGE-AGENT — AI-powered DOM content extraction
 * 
 * Fallback chain: Sherlock → URL-only → fetch() → Gemini raw extraction
 */

import { generateStructuredJSON, MODELS } from '@/lib/gemini';
import type { NormalizedData, DigitalFragment, MediaFragment, BehaviorSignal, Platform, ConfidenceLevel } from './types';

// ── Configuration ─────────────────────────────────────────────

const SHERLOCK_URL = process.env.SHERLOCK_SERVICE_URL || 'http://localhost:8000';
const LIGHTPANDA_CDP = process.env.LIGHTPANDA_CDP_ENDPOINT || 'ws://127.0.0.1:9222';
const PAGE_AGENT_ENABLED = process.env.PAGE_AGENT_ENABLED === 'true';

// ── Temporal Configuration ────────────────────────────────────
const DATA_WINDOW_YEARS = 2; // Scrape 2 years of historical data
const DATA_CUTOFF = new Date();
DATA_CUTOFF.setFullYear(DATA_CUTOFF.getFullYear() - DATA_WINDOW_YEARS);

// ── Types ─────────────────────────────────────────────────────

interface SherlockResult {
  platform: string;
  url: string;
  username: string;
  exists: boolean;
}

interface ScrapedPage {
  url: string;
  platform: Platform;
  title: string;
  content: string;
  rawHtml?: string;
  success: boolean;
  error?: string;
}

// ── Stage 1: SHERLOCK — Username Discovery ─────────────────────

async function discoverProfiles(username: string): Promise<SherlockResult[]> {
  try {
    const response = await fetch(`${SHERLOCK_URL}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
      signal: AbortSignal.timeout(90000), // Sherlock can take 60s+
    });

    if (!response.ok) {
      console.warn(`[MAYURI] Sherlock returned ${response.status}`);
      return [];
    }

    const data = await response.json();

    // sherlock-api returns { username, results: { "Platform": { url_user, ... } } }
    const results: SherlockResult[] = [];
    const raw = data.results || {};

    for (const [platform, info] of Object.entries(raw)) {
      const entry = info as any;
      // Sherlock marks claimed accounts — those are found profiles
      if (entry.url_user) {
        results.push({
          platform,
          url: entry.url_user,
          username,
          exists: true,
        });
      }
    }

    // Cap at 20 profiles to manage costs
    const capped = results.slice(0, 20);
    console.log(`[MAYURI] 🔍 Sherlock discovered ${capped.length} profiles for @${username}`);
    return capped;
  } catch (error) {
    console.warn('[MAYURI] Sherlock service unavailable:', (error as Error).message);
    return [];
  }
}

// ── Stage 2: LIGHTPANDA — Page Rendering ──────────────────────

async function renderPageWithLightpanda(url: string): Promise<string> {
  try {
    // Connect to Lightpanda via CDP-compatible endpoint
    const response = await fetch(`${SHERLOCK_URL}/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        cdpEndpoint: LIGHTPANDA_CDP,
        waitFor: 3000, // Wait 3s for JS to execute
        extractText: true,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Render failed: ${response.status}`);
    }

    const data = await response.json();
    return data.textContent || data.html || '';
  } catch (error) {
    console.warn(`[MAYURI] Lightpanda render failed for ${url}:`, (error as Error).message);
    // Fallback: simple fetch
    return await fetchPageContent(url);
  }
}

// ── Stage 2 Fallback: Simple HTTP Fetch ───────────────────────

async function fetchPageContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PsyProfiler/2.0; +https://psyprofiler.io)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return '';

    const html = await response.text();
    // Strip HTML tags, scripts, styles — extract text only
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 15000); // Cap at 15K chars per page
  } catch {
    return '';
  }
}

// ── Stage 3: PAGE-AGENT — AI Content Extraction ───────────────

async function extractWithPageAgent(
  pageContent: string,
  url: string,
  platform: Platform,
): Promise<ScrapedPage> {
  if (!PAGE_AGENT_ENABLED || !pageContent) {
    return {
      url,
      platform,
      title: '',
      content: pageContent.substring(0, 5000),
      success: !!pageContent,
    };
  }

  // Use Gemini as the backing LLM for Page-Agent style extraction
  const extractionPrompt = `You are an AI page content extractor. Analyze this web page content from ${platform} and extract structured information about the person.

URL: ${url}
PLATFORM: ${platform}
DATA WINDOW: Last ${DATA_WINDOW_YEARS} years (since ${DATA_CUTOFF.toISOString().split('T')[0]})

RAW PAGE CONTENT:
${pageContent.substring(0, 20000)}

Extract ALL of the following (2-year window):
1. Person's name, bio, headline, description
2. Text posts, tweets, comments, threads, articles
3. Image posts — describe the image content, captions, alt-text
4. Stories / status updates / ephemeral content references
5. Video descriptions, reels, shorts metadata
6. Professional information (job title, company, skills, endorsements)
7. Social metrics (followers, connections, engagement rates)
8. Emotional/personal/vulnerable content (rants, confessions, celebrations)
9. Creative output (art, projects, code, writing)
10. Behavioral patterns (posting frequency, time-of-day patterns, engagement style)
11. Relationship signals (mentions, tags, replies, collaborations)
12. Value/belief indicators (causes, opinions, political/social stances)

Categorize each extracted item by emotional valence:
- HIGH_EMOTION: Strong feelings, passion, anger, joy, outrage
- BUSINESS_LOGIC: Professional, strategic, analytical, networking
- PERSONAL_VULNERABLE: Intimate, revealing, emotional depth, confessions
- NEUTRAL: Factual, informational, routine updates
- CREATIVE: Artistic, innovative, expressive, experimental
- PERFORMATIVE: Curated image, virtue signaling, impression management

OUTPUT as JSON:
{
  "name": "",
  "bio": "",
  "headline": "",
  "posts": [{"content": "", "type": "text|image|story|video|article", "category": "", "engagement": 0, "timestamp": ""}],
  "images": [{"description": "", "caption": "", "context": ""}],
  "stories": [{"content": "", "timestamp": "", "category": ""}],
  "metrics": {"followers": 0, "connections": 0, "avgEngagement": 0},
  "professional": {"title": "", "company": "", "skills": [], "endorsements": 0},
  "behaviorPatterns": {"postingFrequency": "", "peakActivity": "", "contentMix": ""},
  "rawDataQuality": "HIGH|MEDIUM|LOW|INSUFFICIENT"
}`;

  try {
    const extracted = await generateStructuredJSON<any>(
      extractionPrompt,
      'You are a precision data extractor. Return clean, structured JSON. Never fabricate data.',
      MODELS.FLASH, // Use flash for extraction (faster, cheaper)
      0.05,
    );

    return {
      url,
      platform,
      title: extracted.headline || extracted.name || '',
      content: JSON.stringify(extracted),
      success: true,
    };
  } catch (error) {
    console.warn(`[MAYURI] Page-Agent extraction failed for ${url}`);
    return {
      url,
      platform,
      title: '',
      content: pageContent.substring(0, 5000),
      success: false,
      error: (error as Error).message,
    };
  }
}

// ── Platform Detection ────────────────────────────────────────

function detectPlatform(url: string): Platform {
  const lower = url.toLowerCase();
  if (lower.includes('linkedin.com')) return 'linkedin';
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter';
  if (lower.includes('instagram.com')) return 'instagram';
  if (lower.includes('reddit.com')) return 'reddit';
  if (lower.includes('github.com')) return 'github';
  if (lower.includes('facebook.com') || lower.includes('fb.com')) return 'facebook';
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('medium.com')) return 'medium';
  if (lower.includes('tiktok.com')) return 'tiktok';
  return 'unknown';
}

function extractUsername(nameOrUrl: string): string | null {
  // Try to extract username from URL
  const urlMatch = nameOrUrl.match(/(?:twitter|x|instagram|linkedin|reddit|github)\.com\/(?:in\/)?@?([^/?#\s]+)/i);
  if (urlMatch) return urlMatch[1];
  
  // If it looks like a handle
  if (nameOrUrl.startsWith('@')) return nameOrUrl.slice(1);
  
  // If it's a single word, treat as username
  if (!nameOrUrl.includes(' ') && nameOrUrl.length < 30) return nameOrUrl;
  
  return null;
}

// ── Legacy: Serper.dev Web Search (Fallback) ──────────────────

interface SerperResult {
  title: string;
  link: string;
  snippet: string;
  date?: string;
}

async function searchWeb(query: string): Promise<SerperResult[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: query, num: 10 }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    return (data.organic || []).map((r: any) => ({
      title: r.title || '',
      link: r.link || '',
      snippet: r.snippet || '',
      date: r.date,
    }));
  } catch {
    return [];
  }
}

// ── Gemini Normalization Prompt ───────────────────────────────

const NORMALIZATION_PROMPT = `You are MAYURI, the Intake Intelligence Specialist for PsyProfiler.io.

Your job: Take raw scraped data from multiple platforms and normalize it into a unified psychological analysis dataset.
DATA WINDOW: Extract EVERYTHING from the last ${DATA_WINDOW_YEARS} years (since ${DATA_CUTOFF.toISOString().split('T')[0]}).

For each piece of content:
- Identify behavior patterns, emotional expressions, decision-making signals
- Categorize: HIGH_EMOTION / BUSINESS_LOGIC / PERSONAL_VULNERABLE / NEUTRAL / CREATIVE / PERFORMATIVE
- Include ALL content types: text posts, image descriptions, stories/status updates, videos, articles, comments
- Assess overall data quality honestly

CRITICAL RULES:
- Do NOT fabricate data. If information is sparse, report it honestly.
- Data quality levels: HIGH (20+ data points), MEDIUM (10-19), LOW (3-9), INSUFFICIENT (<3)
- Focus on PSYCHOLOGICAL SIGNALS, not surface-level facts
- Extract behavioral patterns: posting frequency, time-of-day habits, engagement style
- Note relationship signals: who they interact with, how they respond to others

OUTPUT as JSON:
{
  "targetName": "",
  "bio": "",
  "posts": [{"source": "", "content": "", "contentType": "text|image|story|video|article|comment|repost", "timestamp": "", "engagement": 0, "category": ""}],
  "images": [{"description": "", "caption": "", "context": "", "source": ""}],
  "stories": [{"description": "", "caption": "", "context": "", "source": ""}],
  "totalDataPoints": 0,
  "platforms": [],
  "temporalRange": {"earliest": "", "latest": ""},
  "dataWindowYears": ${DATA_WINDOW_YEARS},
  "behaviorPatterns": [{"pattern": "", "frequency": "", "significance": "HIGH|MEDIUM|LOW"}],
  "dataQuality": "",
  "warnings": []
}`;

// ── Main Intake Function — 3-Stage Pipeline ───────────────────

export async function collectAndNormalize(
  targetName: string,
  targetUrl?: string,
  platform?: Platform,
  customContext?: string,
): Promise<NormalizedData> {
  console.log('[MAYURI] ═══ MAYURI INTELLIGENCE COLLECTION ═══');
  console.log(`[MAYURI] Target: ${targetName} | URL: ${targetUrl || 'none'}`);

  const collectedData: ScrapedPage[] = [];
  const discoveredUrls: string[] = [];

  // ── STAGE 1: SHERLOCK — Username Discovery ────────────────
  const username = extractUsername(targetUrl || targetName);
  
  if (username) {
    console.log(`[MAYURI] Stage 1: Sherlock scanning for @${username}...`);
    const sherlockResults = await discoverProfiles(username);
    
    for (const result of sherlockResults) {
      discoveredUrls.push(result.url);
    }
    console.log(`[MAYURI] Sherlock found ${discoveredUrls.length} platform URLs`);
  }

  // Add the explicit target URL if provided
  if (targetUrl && !discoveredUrls.includes(targetUrl)) {
    discoveredUrls.unshift(targetUrl);
  }

  // ── STAGE 2: LIGHTPANDA — Page Rendering ──────────────────
  if (discoveredUrls.length > 0) {
    console.log(`[MAYURI] Stage 2: Rendering ${Math.min(discoveredUrls.length, 10)} pages...`);
    
    // Render up to 10 pages in parallel (batches of 3)
    const urlsToRender = discoveredUrls.slice(0, 10);
    
    for (let i = 0; i < urlsToRender.length; i += 3) {
      const batch = urlsToRender.slice(i, i + 3);
      const rendered = await Promise.all(
        batch.map(async (url) => {
          const content = await renderPageWithLightpanda(url);
          const detectedPlatform = detectPlatform(url);
          
          // ── STAGE 3: PAGE-AGENT — Extract ──────────────────
          return extractWithPageAgent(content, url, detectedPlatform);
        })
      );
      collectedData.push(...rendered.filter(r => r.success));
    }
    
    console.log(`[MAYURI] Successfully scraped ${collectedData.length}/${urlsToRender.length} pages`);
  }

  // ── FALLBACK: Serper.dev Search (if no Sherlock data) ─────
  let serperResults: SerperResult[] = [];
  if (collectedData.length === 0) {
    console.log('[MAYURI] Fallback: Using Serper.dev web search...');
    const queries = [
      `"${targetName}" social media profile`,
      `"${targetName}" professional background`,
    ];
    
    const searchPromises = queries.map(q => searchWeb(q));
    const results = await Promise.all(searchPromises);
    serperResults = results.flat();
  }

  // ── NORMALIZE with Gemini ──────────────────────────────────
  const contextParts: string[] = [
    `═══ RAW INTELLIGENCE BRIEFING ═══`,
    `TARGET: ${targetName}`,
    `SCRAPING METHOD: ${collectedData.length > 0 ? 'SHERLOCK + LIGHTPANDA + PAGE-AGENT' : 'SERPER.DEV FALLBACK'}`,
    ``,
  ];

  if (targetUrl) {
    contextParts.push(`PRIMARY URL: ${targetUrl}`);
    contextParts.push(`DETECTED PLATFORM: ${platform || detectPlatform(targetUrl)}`);
  }

  if (customContext) {
    contextParts.push(`\nUSER-PROVIDED CONTEXT:\n${customContext}`);
  }

  // Include scraped data
  if (collectedData.length > 0) {
    contextParts.push(`\n═══ SCRAPED PROFILES (${collectedData.length} pages) ═══`);
    collectedData.forEach((page, i) => {
      contextParts.push(`\n[PAGE ${i + 1}] Platform: ${page.platform} | URL: ${page.url}`);
      contextParts.push(`Title: ${page.title}`);
      contextParts.push(`Content:\n${page.content.substring(0, 8000)}`);
    });
  }

  // Include serper results as fallback
  if (serperResults.length > 0) {
    contextParts.push(`\n═══ WEB SEARCH RESULTS (${serperResults.length}) ═══`);
    serperResults.forEach((r, i) => {
      contextParts.push(`\n[${i + 1}] ${r.title}\nURL: ${r.link}\nSnippet: ${r.snippet}${r.date ? `\nDate: ${r.date}` : ''}`);
    });
  }

  if (collectedData.length === 0 && serperResults.length === 0) {
    contextParts.push('\nNO DATA COLLECTED. Analyze based on target name and user-provided context only.');
  }

  // ── Gemini Normalization ────────────────────────────────────
  try {
    const normalizedData = await generateStructuredJSON<NormalizedData>(
      contextParts.join('\n'),
      NORMALIZATION_PROMPT,
      MODELS.FLASH,
      0.1,
    );

    const result: NormalizedData = {
      targetName: normalizedData.targetName || targetName,
      bio: normalizedData.bio || 'No biographical information available.',
      posts: (normalizedData.posts || []).map(p => ({
        ...p,
        contentType: p.contentType || 'text',
      })),
      images: normalizedData.images || [],
      stories: normalizedData.stories || [],
      totalDataPoints: normalizedData.totalDataPoints || normalizedData.posts?.length || 0,
      platforms: normalizedData.platforms || (platform ? [platform] : ['unknown']),
      temporalRange: normalizedData.temporalRange,
      dataWindowYears: DATA_WINDOW_YEARS,
      behaviorPatterns: normalizedData.behaviorPatterns || [],
      dataQuality: normalizedData.dataQuality || assessDataQuality(collectedData.length, normalizedData),
      warnings: normalizedData.warnings || [],
    };

    console.log(`[MAYURI] ✅ Normalization complete: ${result.totalDataPoints} data points | ${result.images.length} images | ${result.stories.length} stories | Quality: ${result.dataQuality}`);
    return result;
  } catch (error) {
    console.error('[MAYURI] Normalization failed:', error);
    return {
      targetName,
      bio: `Target: ${targetName}. Data collection encountered errors.`,
      posts: [],
      images: [],
      stories: [],
      totalDataPoints: 0,
      platforms: platform ? [platform] : ['unknown'],
      dataWindowYears: DATA_WINDOW_YEARS,
      behaviorPatterns: [],
      dataQuality: 'INSUFFICIENT',
      warnings: ['Data collection failed. Analysis will be based on minimal available information.'],
    };
  }
}

// ── Data Quality Assessment ───────────────────────────────────

function assessDataQuality(pagesScraped: number, data: Partial<NormalizedData>): ConfidenceLevel {
  const postCount = data.posts?.length || 0;
  const totalSignals = postCount + pagesScraped;
  
  if (totalSignals >= 20) return 'HIGH';
  if (totalSignals >= 10) return 'MEDIUM';
  if (totalSignals >= 3) return 'LOW';
  return 'INSUFFICIENT';
}
