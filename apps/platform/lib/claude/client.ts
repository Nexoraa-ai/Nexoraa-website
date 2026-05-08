import Anthropic from '@anthropic-ai/sdk'
import {
  CLASSIFICATION_SYSTEM,
  SUMMARIZATION_SYSTEM,
  VERTICAL_PANELS_SYSTEM,
  buildClassificationPrompt,
  buildSummarizationPrompt,
  buildVerticalPanelsPrompt,
} from './prompts'
import type {
  ClassificationResult,
  SummarizationResult,
  VerticalPanelResult,
  Category,
} from '@neuralforge/types'
import { PRIORITY } from '@neuralforge/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// ─── MODEL ROUTING ──────────────────────────────────────────────────────────
// Priority-based model selection (the 3-tier cost strategy, locked in plan)
function selectModel(priorityScore: number): 'claude-haiku-4-5-20251001' | 'claude-sonnet-4-6' | 'claude-opus-4-7' {
  if (priorityScore >= PRIORITY.OPUS_MIN) return 'claude-opus-4-7'
  return 'claude-sonnet-4-6'
}

// ─── CLASSIFY ITEM ──────────────────────────────────────────────────────────
// Called only when rules engine confidence < 0.85 (~40% of items)
export async function classifyItem(params: {
  title: string
  sourceName: string
  excerpt: string
}): Promise<ClassificationResult> {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    system: CLASSIFICATION_SYSTEM,
    messages: [
      {
        role: 'user',
        content: buildClassificationPrompt(params),
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const result = JSON.parse(text) as ClassificationResult
  return result
}

// ─── SUMMARIZE CLUSTER ──────────────────────────────────────────────────────
// Single call per cluster (NEVER per item). Includes prompt caching on system prompt.
export async function summarizeCluster(params: {
  canonicalTitle: string
  itemCount: number
  sourceExcerpts: string
  priorityScore: number
}): Promise<SummarizationResult & { inputTokens: number; outputTokens: number; costUsd: number }> {
  const model = selectModel(params.priorityScore)

  const message = await anthropic.messages.create({
    model,
    max_tokens: 1000,
    system: [
      {
        type: 'text',
        text: SUMMARIZATION_SYSTEM,
        // Prompt cache: reused across items in same batch window (5-min TTL)
        // Cuts system prompt token cost by ~90% for batched processing
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: buildSummarizationPrompt({
          canonicalTitle: params.canonicalTitle,
          itemCount: params.itemCount,
          sourceExcerpts: params.sourceExcerpts,
        }),
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const result = JSON.parse(text) as SummarizationResult

  // Calculate actual cost for cost monitoring in summary_cache
  const inputTokens = message.usage.input_tokens
  const outputTokens = message.usage.output_tokens
  const pricePerInputToken = model === 'claude-opus-4-7' ? 0.000015 : 0.000003
  const pricePerOutputToken = model === 'claude-opus-4-7' ? 0.000075 : 0.000015
  const costUsd = inputTokens * pricePerInputToken + outputTokens * pricePerOutputToken

  return { ...result, inputTokens, outputTokens, costUsd }
}

// ─── GENERATE VERTICAL PANELS ───────────────────────────────────────────────
// Single Haiku call for all 8 verticals. Only for priority >= 70.
export async function generateVerticalPanels(params: {
  canonicalTitle: string
  intermediateSummary: string
}): Promise<VerticalPanelResult & { inputTokens: number; outputTokens: number; costUsd: number }> {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    system: VERTICAL_PANELS_SYSTEM,
    messages: [
      {
        role: 'user',
        content: buildVerticalPanelsPrompt(params),
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const result = JSON.parse(text) as VerticalPanelResult

  const inputTokens = message.usage.input_tokens
  const outputTokens = message.usage.output_tokens
  // Haiku pricing
  const costUsd = inputTokens * 0.0000008 + outputTokens * 0.000004

  return { ...result, inputTokens, outputTokens, costUsd }
}

// ─── RULES ENGINE ───────────────────────────────────────────────────────────
// Deterministic classification (~60% of items, zero LLM cost).
// Returns { category, confidence } — if confidence >= 0.85, skip Haiku call.
export function rulesEngineClassify(params: {
  title: string
  sourceSlug: string
  url: string
  excerpt: string
}): { category: Category; confidence: number } {
  const titleLower = params.title.toLowerCase()
  const urlLower = params.url.toLowerCase()

  // Model release signals
  const modelReleaseKeywords = ['gpt-', 'claude-', 'gemini ', 'llama ', 'mistral-', 'releases model',
    'new model', 'model release', 'launches model', ' api available']
  const highAuthorityModelSlugs = ['openai-blog', 'anthropic-blog', 'deepmind-blog', 'google-ai-blog', 'meta-ai-blog', 'mistral-blog']
  if (highAuthorityModelSlugs.includes(params.sourceSlug) &&
      modelReleaseKeywords.some(k => titleLower.includes(k))) {
    return { category: 'model_release', confidence: 0.92 }
  }

  // Research paper signals
  if (urlLower.includes('arxiv.org') ||
      titleLower.includes('paper') ||
      titleLower.includes('survey of') ||
      titleLower.includes('we present') ||
      params.sourceSlug === 'huggingface-papers') {
    return { category: 'research_paper', confidence: 0.90 }
  }

  // Tool launch signals
  if (params.sourceSlug === 'github-trending' ||
      urlLower.includes('github.com') ||
      params.sourceSlug === 'producthunt-ai' ||
      titleLower.includes('open source') ||
      titleLower.includes('launches') ||
      titleLower.includes('introduces')) {
    return { category: 'tool_launch', confidence: 0.82 }
  }

  // Funding signals
  const fundingKeywords = ['raises', 'funding', 'series a', 'series b', 'seed round',
    'valuation', 'investment', 'million', 'billion', '$']
  if (fundingKeywords.filter(k => titleLower.includes(k)).length >= 2) {
    return { category: 'funding', confidence: 0.88 }
  }

  // Security signals
  const securityKeywords = ['vulnerability', 'jailbreak', 'attack', 'exploit', 'breach',
    'safety', 'alignment', 'red team', 'adversarial']
  if (securityKeywords.some(k => titleLower.includes(k))) {
    return { category: 'security', confidence: 0.85 }
  }

  // Tutorial signals
  if (titleLower.startsWith('how to') || titleLower.startsWith('building') ||
      titleLower.includes('tutorial') || titleLower.includes('guide to')) {
    return { category: 'tutorial', confidence: 0.87 }
  }

  // Regulation signals
  const regulationKeywords = ['regulation', 'policy', 'law', 'ban', 'eu ai act',
    'ftc', 'nist', 'compliance', 'govern']
  if (regulationKeywords.some(k => titleLower.includes(k))) {
    return { category: 'regulation', confidence: 0.86 }
  }

  // Default to opinion with low confidence → triggers Haiku
  return { category: 'opinion', confidence: 0.40 }
}
