// All Claude prompt templates for Nexoraa Layer 0 pipeline.
// These are the canonical templates — only change after team discussion.
// Word counts in summary prompts are contractual: UI is built around them.

export const CLASSIFICATION_SYSTEM = `You are a classifier for AI industry news. Respond with valid JSON only. No explanation outside the JSON.`

export function buildClassificationPrompt(params: {
  title: string
  sourceName: string
  excerpt: string
}): string {
  const excerptTruncated = params.excerpt.split(' ').slice(0, 100).join(' ')
  return `Title: ${params.title}
Source: ${params.sourceName}
Excerpt: ${excerptTruncated}

Classify this item and output this exact JSON:
{
  "category": "<one of: model_release|tool_launch|research_paper|funding|opinion|tutorial|security|regulation>",
  "priority_signal": <0-100 integer>,
  "reasoning": "<one sentence max>"
}

Priority signal guide:
- 100: GPT-5 / Claude 4 release
- 80: major model release or significant capability breakthrough
- 60: significant new tool or API launch
- 40: research paper (notable but not a release)
- 20: opinion / analysis piece
- 10: tutorial or how-to guide`
}

// ─── 3-LEVEL SUMMARY SYSTEM PROMPT ─────────────────────────────────────────
// This is cached via Anthropic prompt caching (cache_control: ephemeral).
// All items processed within 5 minutes reuse this cached system prompt.
export const SUMMARIZATION_SYSTEM = `You are an AI news analyst for Nexoraa. You write summaries of AI developments at three reading levels simultaneously.

Rules:
- beginner: ~200 words, zero jargon, plain English, start with "What happened:", explain why non-technical people should care
- intermediate: ~100 words, for working developers, include specific model names, benchmark numbers, API changes if relevant
- expert: ~50 words, for ML engineers and researchers, dense, technical terms permitted, focus on architecture/methodology/implication
- Never pad to hit word counts — say less if there's less to say
- Output valid JSON only, no text outside the JSON object`

export function buildSummarizationPrompt(params: {
  canonicalTitle: string
  itemCount: number
  sourceExcerpts: string  // top 3 items, max 500 words total
}): string {
  return `Story cluster: ${params.canonicalTitle}
Sources (${params.itemCount} sources corroborate this story):
${params.sourceExcerpts}

Output this exact JSON:
{
  "beginner": "<~200 words. Plain English. Start with 'What happened:'. Why should non-technical readers care.>",
  "intermediate": "<~100 words. For working developers. Include model names, benchmark numbers, API changes.>",
  "expert": "<~50 words. For ML engineers. Dense. Technical terms. Architecture/training methodology/implication.>",
  "category": "<confirm: model_release|tool_launch|research_paper|funding|opinion|tutorial|security|regulation>",
  "headline_score_boost": <-10 to +10 integer, your assessment of story importance vs preliminary score>
}`
}

// ─── 8-VERTICAL INDUSTRY IMPACT SYSTEM PROMPT ──────────────────────────────
// Used with Claude Haiku (not Sonnet) — supplementary content, not primary summary.
// Single call for all 8 verticals simultaneously (not 8 separate calls).
export const VERTICAL_PANELS_SYSTEM = `You are a technology impact analyst. For each developer vertical listed, write exactly 2 sentences describing what this AI development means for that audience. Output valid JSON only, no text outside the JSON.`

export function buildVerticalPanelsPrompt(params: {
  canonicalTitle: string
  intermediateSummary: string
}): string {
  return `News: ${params.canonicalTitle}
Summary: ${params.intermediateSummary}

Output this JSON with exactly these 8 keys (2 sentences each):
{
  "web-dev": "<2 sentences. How this affects web developers building with APIs, frameworks, or AI features.>",
  "mobile": "<2 sentences. Impact on iOS/Android/React Native/Flutter developers.>",
  "data-ml": "<2 sentences. Implications for data scientists and ML engineers.>",
  "devops-cloud": "<2 sentences. Impact on infrastructure, MLOps, deployment pipelines.>",
  "design-ux": "<2 sentences. How AI changes design tools, creative workflows, or user experience.>",
  "product": "<2 sentences. Strategic implications for product managers and founders.>",
  "students": "<2 sentences. How this affects learning paths, career options, and what to study.>",
  "entrepreneurs": "<2 sentences. Business opportunities or threats created by this development.>"
}`
}

// ─── CHALLENGE SCAFFOLD PROMPT (L1/L2 pipeline) ─────────────────────────────
// Called by n8n when cluster.priority >= 80 and category = model_release|tool_launch
// Returns a challenge scaffold for team review — not auto-published.
export function buildChallengeScaffoldPrompt(params: {
  canonicalTitle: string
  expertSummary: string
  category: string
}): string {
  return `You are creating a coding challenge for developers based on a real AI development.

News item: ${params.canonicalTitle}
Technical context: ${params.expertSummary}
Category: ${params.category}

Generate a Python coding challenge that teaches the KEY technical concept from this news.
The challenge should be solvable in 20-40 minutes by an intermediate developer.

Output this exact JSON:
{
  "title": "<challenge title, imperative form, e.g. 'Implement Sliding Window Attention'>",
  "description": "<markdown problem statement, 150-250 words>",
  "difficulty": "<easy|medium|hard>",
  "starter_code": "<Python starter code with TODOs, 20-40 lines>",
  "test_cases": [
    {"input": "<input>", "expected_output": "<output>", "is_hidden": false},
    {"input": "<input>", "expected_output": "<output>", "is_hidden": false},
    {"input": "<input>", "expected_output": "<output>", "is_hidden": true}
  ],
  "editorial_outline": "<3-5 bullet points for the editorial solution>",
  "estimated_minutes": <15-40>
}`
}
