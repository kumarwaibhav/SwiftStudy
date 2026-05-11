/**
 * Prompt Engineering Stack — display-only representation.
 * The real prompt is constructed server-side in functions/api/search.ts
 * This module is used only to render the "Show Prompt Stack" panel in the UI.
 */

export const PROMPT_STACK_DISPLAY = `╔════ FRAMEWORK ARCHITECTURE ══════════════════════════════════════╗
║  Layer 1 ▸ RISEN     System role + scope + search mandate        ║
║  Layer 2 ▸ ReAct     Think → Act → Observe search loop           ║
║  Layer 3 ▸ L2M       Least-to-Most topic decomposition           ║
║  Layer 4 ▸ CO-STAR   Output spec: audience, format, response     ║
╚══════════════════════════════════════════════════════════════════╝

[RISEN — SYSTEM LAYER]
  R → Role:        Senior NLP Academic Content Curator
  I → Instructions: Find 4-6 best YouTube videos per topic via web search
  S → Steps:       Decompose → Search (3 queries) → Curate → Rank
  E → End goal:    Exam-ready video playlist, M.Tech semester prep
  N → Narrowing:   Uni lectures > Reputable educators > General tutorials

[ReAct — SEARCH EXECUTION]
  THINK  → Break topic into core sub-concepts
  ACT-1  → "{topic} NLP tutorial explained youtube"
  ACT-2  → "stanford MIT {topic} NLP lecture youtube"
  ACT-3  → "{topic} python NLP implementation tutorial"
  OBSERVE→ Compile results, rank by quality, curate top 4-6

[Least-to-Most — DECOMPOSITION LEVELS]
  L1: Foundational  → What is {topic}? (beginner, clear explanation)
  L2: Theoretical   → Math/algorithm depth (university lectures)
  L3: Applied       → How is it coded/used? (implementation tutorials)

[CO-STAR — OUTPUT FORMAT]
  Context  → M.Tech Data Science, SRMIST, semester exam preparation
  Objective→ Curate best YouTube videos per NLP syllabus topic
  Style    → Structured JSON with full metadata per video
  Tone     → Academic precision + pedagogical utility
  Audience → Final-year engineering student with strong ML background
  Response → Valid JSON: {title, channel, url, type, difficulty, why_useful}`

export const LOG_SEQUENCE = [
  'Initialising RISEN system context...',
  'Decomposing topic via Least-to-Most...',
  'ReAct ACT-1 → Searching tutorial videos...',
  'ReAct ACT-2 → Searching university lectures...',
  'ReAct ACT-3 → Searching implementations...',
  'Observing & curating top results...',
  'Applying CO-STAR output schema...',
] as const
