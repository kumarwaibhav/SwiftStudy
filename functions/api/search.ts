/**
 * SwiftStudy — Cloudflare Pages Function
 * Powered by Google Gemini (FREE: 1500 req/day, no card needed)
 * Get your free key: https://aistudio.google.com → Get API Key
 */

interface Env {
  GEMINI_API_KEY: string;
  ALLOWED_ORIGINS?: string;
}

interface SearchBody { topic: unknown; unitTitle: unknown; }
interface VideoItem {
  title: string; channel: string; url: string;
  type: string; difficulty: string; why_useful: string;
}
interface SearchResult {
  topic: string; unit: string; videos: VideoItem[]; study_tip: string;
}
interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const BODY_LIMIT = 4096;
const BASE_ORIGINS = ['http://localhost:5173','http://localhost:4173','http://localhost:8788'];

function getAllowed(env: Env) {
  return [...BASE_ORIGINS, ...(env.ALLOWED_ORIGINS?.split(',').map(o=>o.trim()).filter(Boolean) ?? [])];
}
function cors(origin: string|null, allowed: string[]) {
  const allow = origin && allowed.includes(origin) ? origin : allowed[0] ?? '*';
  return { 'Access-Control-Allow-Origin': allow, 'Access-Control-Allow-Methods': 'POST, OPTIONS',
           'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' };
}
function sec() {
  return { 'Content-Type': 'application/json; charset=utf-8',
           'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY',
           'Referrer-Policy': 'no-referrer' };
}
function sanitise(s: string) {
  return s.replace(/[<>"'`\\]/g,'').replace(/\r?\n/g,' ').trim().slice(0,300);
}
function isYouTube(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  try {
    const u = new URL(url);
    if (!['www.youtube.com','youtube.com','youtu.be'].includes(u.hostname)) return false;
    if (u.hostname === 'youtu.be') return u.pathname.length > 1;
    return u.pathname.startsWith('/watch') && !!u.searchParams.get('v');
  } catch { return false; }
}
function errRes(msg: string, status: number, c: Record<string,string>) {
  return new Response(JSON.stringify({error:msg}), {status, headers:{...sec(),...c}});
}

function sysPrompt() {
  return `You are a Senior NLP Education Curator. Find 4-6 YouTube videos for the given NLP topic.
Use Google Search. Prioritise: MIT/Stanford > StatQuest/3B1B/Karpathy > Sentdex/CodeBasics > general.
Return ONLY valid JSON (no markdown, no preamble):
{
  "topic": "string", "unit": "string",
  "videos": [{"title":"...","channel":"...","url":"https://www.youtube.com/watch?v=ID",
               "type":"concept|lecture|implementation|visualization",
               "difficulty":"beginner|intermediate|advanced","why_useful":"..."}],
  "study_tip": "..."
}`;
}

function userPrompt(topic: string, unit: string) {
  return `Topic: "${topic}" | Unit: "${unit}"
Search:
1. "${topic} NLP tutorial explained youtube"
2. "stanford MIT ${topic} NLP lecture youtube"  
3. "${topic} python NLP implementation youtube"
Return only JSON with 4-6 YouTube videos for M.Tech Data Science semester exam prep.`;
}

export const onRequestOptions: PagesFunction<Env> = async ({request, env}) => {
  const o = request.headers.get('Origin');
  return new Response(null, {status:204, headers:{...cors(o,getAllowed(env)),...sec()}});
};

export const onRequestPost: PagesFunction<Env> = async ({request, env}) => {
  const o = request.headers.get('Origin');
  const c = cors(o, getAllowed(env));
  const h = {...sec(),...c};

  if (!env.GEMINI_API_KEY) return errRes('Server configuration error', 500, c);

  let body: SearchBody;
  try {
    const txt = await request.text();
    if (txt.length > BODY_LIMIT) return errRes('Request too large', 413, c);
    body = JSON.parse(txt) as SearchBody;
  } catch { return errRes('Invalid JSON', 400, c); }

  if (typeof body.topic !== 'string' || body.topic.trim().length < 2)
    return errRes('Invalid topic', 400, c);
  if (typeof body.unitTitle !== 'string' || body.unitTitle.trim().length < 2)
    return errRes('Invalid unitTitle', 400, c);

  const topic = sanitise(body.topic);
  const unit  = sanitise(body.unitTitle);

  let gemData: GeminiResponse;
  try {
    const res = await fetch(`${GEMINI_URL}?key=${env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        systemInstruction: {parts:[{text: sysPrompt()}]},
        contents: [{role:'user', parts:[{text: userPrompt(topic,unit)}]}],
        tools: [{google_search:{}}],
        generationConfig: {temperature:0.4, maxOutputTokens:1500},
      }),
    });
    if (!res.ok) return errRes('AI service unavailable', 502, c);
    gemData = await res.json() as GeminiResponse;
  } catch { return errRes('Failed to reach AI service', 502, c); }

  const rawText = (gemData.candidates??[])
    .flatMap(c2 => c2.content?.parts??[])
    .filter((p): p is {text:string} => typeof p.text === 'string')
    .map(p => p.text).join('');

  if (!rawText) return errRes('AI returned empty response', 500, c);

  const match = rawText.match(/\{[\s\S]*\}/);
  if (!match) return errRes('AI returned unexpected format', 500, c);

  let result: SearchResult;
  try { result = JSON.parse(match[0]) as SearchResult; }
  catch { return errRes('Failed to parse AI response', 500, c); }

  if (!Array.isArray(result.videos)) result.videos = [];
  result.videos = result.videos
    .filter((v): v is VideoItem => v !== null && typeof v === 'object')
    .map(v => ({
      title:      String(v.title??'').slice(0,200),
      channel:    String(v.channel??'').slice(0,100),
      url:        String(v.url??''),
      type:       ['concept','lecture','implementation','visualization'].includes(v.type) ? v.type : 'concept',
      difficulty: ['beginner','intermediate','advanced'].includes(v.difficulty) ? v.difficulty : 'intermediate',
      why_useful: String(v.why_useful??'').slice(0,300),
    }))
    .filter(v => isYouTube(v.url))
    .slice(0,8);

  result.study_tip = String(result.study_tip??'').slice(0,400);
  result.topic = topic;
  result.unit  = unit;

  return new Response(JSON.stringify(result), {status:200, headers:h});
};