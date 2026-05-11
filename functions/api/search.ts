/**
 * POST /api/search
 * Secure Cloudflare Pages Function — API key never reaches the client.
 *
 * Security measures:
 *  - ANTHROPIC_API_KEY lives only in Cloudflare env vars
 *  - Strict CORS (allow-list of origins)
 *  - Input validation + length caps
 *  - Input sanitisation (strip HTML/script chars)
 *  - URL allowlist: only youtube.com / youtu.be pass through
 *  - Generic error messages (no stack-traces to client)
 *  - Security response headers on every reply
 *  - Request body size limit (4 KB)
 */

interface Env {
  ANTHROPIC_API_KEY: string;
  /** Optional comma-separated extra origins e.g. "https://my-domain.com" */
  ALLOWED_ORIGINS?: string;
}

interface SearchBody {
  topic: unknown;
  unitTitle: unknown;
}

interface VideoResult {
  title: string;
  channel: string;
  url: string;
  type: string;
  difficulty: string;
  why_useful: string;
}

interface SearchResult {
  topic: string;
  unit: string;
  videos: VideoResult[];
  study_tip: string;
}

const BASE_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:8788',
];

const BODY_SIZE_LIMIT = 4 * 1024; // 4 KB
const MAX_TOKENS = 1500;

// ─── Security helpers ────────────────────────────────────────────────────────

function getAllowedOrigins(env: Env): string[] {
  const extra = env.ALLOWED_ORIGINS
    ? env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
    : [];
  return [...BASE_ALLOWED_ORIGINS, ...extra];
}

function getCorsHeaders(origin: string | null, allowedOrigins: string[]): Record<string, string> {
  const allow = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

function sanitise(input: string): string {
  return input
    .replace(/[<>"'`\\]/g, '')
    .replace(/\r?\n/g, ' ')
    .trim()
    .slice(0, 300);
}

function isValidYouTubeUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  try {
    const u = new URL(url);
    const validHosts = ['www.youtube.com', 'youtube.com', 'youtu.be'];
    if (!validHosts.includes(u.hostname)) return false;
    if (u.hostname === 'youtu.be') return u.pathname.length > 1;
    return u.pathname.startsWith('/watch') && !!u.searchParams.get('v');
  } catch {
    return false;
  }
}

function err(msg: string, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify({ error: msg }), { status, headers: { ...getSecurityHeaders(), ...headers } });
}

// ─── Prompt builders ─────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `You are a Senior NLP Education Curator and Academic Content Strategist.

[RISEN FRAMEWORK — SYSTEM CONTEXT]
Role: Expert academic content strategist specialising in NLP education curation
Instructions: Use web search to find 4–6 high-quality YouTube videos for the given NLP topic
Steps:
  1. Decompose the topic into its core sub-concepts (Least-to-Most strategy)
  2. Execute targeted YouTube search queries (ReAct: Think → Act → Observe)
  3. Curate the top 4–6 videos by quality, relevance, and exam utility
  4. Return structured JSON output (CO-STAR format)
End goal: Help a final-year M.Tech Data Science student master this topic for their semester exam
Narrowing: Prioritise → MIT/Stanford/CMU lectures > StatQuest/3B1B/Andrej Karpathy > Sentdex/CodeBasics/Krish Naik > general tutorials

[CO-STAR — OUTPUT SPEC]
Context: B.Tech/M.Tech Integrated Data Science, SRMIST Chennai, semester exam preparation
Objective: Return a curated list of the best YouTube videos for this NLP topic
Style: Clean, structured JSON only — no markdown, no preamble, no explanation outside JSON
Tone: Academic precision + pedagogical utility
Audience: Final-year engineering student, strong in ML, preparing for theory + application exam
Response: ONLY valid JSON — no markdown fences, no preamble

Return ONLY this JSON structure:
{
  "topic": "string",
  "unit": "string",
  "videos": [
    {
      "title": "exact YouTube video title",
      "channel": "channel name",
      "url": "https://www.youtube.com/watch?v=VIDEO_ID",
      "type": "concept|lecture|implementation|visualization",
      "difficulty": "beginner|intermediate|advanced",
      "why_useful": "one precise sentence on exam-prep value"
    }
  ],
  "study_tip": "concise exam-focused tip in 1–2 sentences"
}`;
}

function buildUserPrompt(topic: string, unitTitle: string): string {
  return `[ReAct SEARCH LOOP]
Topic: "${topic}"
Unit: "${unitTitle}"

THINK: What are the foundational sub-concepts within "${topic}"?
ACT-1: Search → "${topic} NLP tutorial explained youtube"
ACT-2: Search → "stanford MIT ${topic} NLP lecture youtube"
ACT-3: Search → "${topic} python implementation NLP tutorial youtube"
OBSERVE: Identify the 4–6 most relevant, high-quality videos

[Least-to-Most DECOMPOSITION]
Level 1 → Foundational: what is ${topic}? (beginner, clear explanation)
Level 2 → Theoretical depth: math/algorithm understanding (lecture videos)
Level 3 → Application: coding/implementation (tutorial videos)

[QUALITY RANKING]
1. University lectures (MIT OCW, Stanford NLP, CMU)
2. Reputable educators (Jurafsky, Manning, StatQuest, 3B1B, Karpathy)
3. Practical educators (Sentdex, CodeBasics, Krish Naik, AssemblyAI)
4. General tutorials (only if above unavailable)

Execute the three searches and return the JSON now.`;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export const onRequestOptions: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin, getAllowedOrigins(env));
  return new Response(null, { status: 204, headers: { ...corsHeaders, ...getSecurityHeaders() } });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get('Origin');
  const allowedOrigins = getAllowedOrigins(env);
  const corsHeaders = getCorsHeaders(origin, allowedOrigins);
  const allHeaders = { ...getSecurityHeaders(), ...corsHeaders };

  // ── Env check ──────────────────────────────────────────────────────────────
  if (!env.ANTHROPIC_API_KEY) {
    console.error('[search] ANTHROPIC_API_KEY not set');
    return err('Server configuration error', 500, corsHeaders);
  }

  // ── Body size guard ────────────────────────────────────────────────────────
  const contentLength = parseInt(request.headers.get('Content-Length') ?? '0', 10);
  if (contentLength > BODY_SIZE_LIMIT) return err('Request too large', 413, corsHeaders);

  // ── Parse body ─────────────────────────────────────────────────────────────
  let body: SearchBody;
  try {
    const text = await request.text();
    if (text.length > BODY_SIZE_LIMIT) return err('Request too large', 413, corsHeaders);
    body = JSON.parse(text) as SearchBody;
  } catch {
    return err('Invalid JSON body', 400, corsHeaders);
  }

  // ── Input validation ───────────────────────────────────────────────────────
  if (typeof body.topic !== 'string' || body.topic.trim().length < 2 || body.topic.length > 250)
    return err('Invalid topic', 400, corsHeaders);
  if (typeof body.unitTitle !== 'string' || body.unitTitle.trim().length < 2 || body.unitTitle.length > 120)
    return err('Invalid unitTitle', 400, corsHeaders);

  const safeTopic = sanitise(body.topic);
  const safeUnit  = sanitise(body.unitTitle);

  if (!safeTopic || !safeUnit) return err('Invalid input after sanitisation', 400, corsHeaders);

  // ── Call Anthropic API ─────────────────────────────────────────────────────
  let anthropicData: { content?: Array<{ type: string; text?: string }> };
  try {
    const apiResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: MAX_TOKENS,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        system: buildSystemPrompt(),
        messages: [{ role: 'user', content: buildUserPrompt(safeTopic, safeUnit) }],
      }),
    });

    if (!apiResp.ok) {
      const errBody = await apiResp.text();
      console.error(`[search] Anthropic ${apiResp.status}:`, errBody.slice(0, 200));
      return err('AI service unavailable', 502, corsHeaders);
    }

    anthropicData = await apiResp.json() as typeof anthropicData;
  } catch (e) {
    console.error('[search] fetch error:', e);
    return err('Failed to reach AI service', 502, corsHeaders);
  }

  // ── Extract JSON from response ─────────────────────────────────────────────
  const rawText = (anthropicData.content ?? [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text ?? '')
    .join('');

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('[search] No JSON in response. Raw:', rawText.slice(0, 300));
    return err('AI returned an unexpected format', 500, corsHeaders);
  }

  let result: SearchResult;
  try {
    result = JSON.parse(jsonMatch[0]) as SearchResult;
  } catch {
    return err('Failed to parse AI response', 500, corsHeaders);
  }

  // ── Sanitise output ────────────────────────────────────────────────────────
  if (!Array.isArray(result.videos)) result.videos = [];

  result.videos = result.videos
    .filter((v): v is VideoResult => v !== null && typeof v === 'object')
    .map((v) => ({
      title:       String(v.title      ?? '').slice(0, 200),
      channel:     String(v.channel    ?? '').slice(0, 100),
      url:         String(v.url        ?? ''),
      type:        ['concept','lecture','implementation','visualization'].includes(v.type) ? v.type : 'concept',
      difficulty:  ['beginner','intermediate','advanced'].includes(v.difficulty) ? v.difficulty : 'intermediate',
      why_useful:  String(v.why_useful ?? '').slice(0, 300),
    }))
    // ── Critical: only allow real YouTube URLs ──────────────────────────────
    .filter((v) => isValidYouTubeUrl(v.url))
    .slice(0, 8); // hard cap

  result.study_tip = String(result.study_tip ?? '').slice(0, 400);
  result.topic     = safeTopic;
  result.unit      = safeUnit;

  return new Response(JSON.stringify(result), { status: 200, headers: allHeaders });
};
