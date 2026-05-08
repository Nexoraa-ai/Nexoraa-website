// Shared TypeScript types for Nexoraa platform

export type SourceType = 'rss' | 'api' | 'json_undoc' | 'third_party_api' | 'headless'

export type Category =
  | 'model_release'
  | 'tool_launch'
  | 'research_paper'
  | 'funding'
  | 'opinion'
  | 'tutorial'
  | 'security'
  | 'regulation'

export type PipelineStatus =
  | 'ingested'
  | 'dedup_done'
  | 'classified'
  | 'scored'
  | 'clustered'
  | 'summarized'
  | 'archived'

export type SummaryLevel = 'beginner' | 'intermediate' | 'expert'

export type VerticalSlug =
  | 'web-dev'
  | 'mobile'
  | 'data-ml'
  | 'devops-cloud'
  | 'design-ux'
  | 'product'
  | 'students'
  | 'entrepreneurs'

export type UserPlan = 'free' | 'pro' | 'premium' | 'enterprise'

export type RegionRelevance = 'global' | 'india' | 'india_first'

export interface ClusterSummary {
  beginner: string
  intermediate: string
  expert: string
  category: Category
  headline_score_boost: number
}

export interface VerticalPanels {
  'web-dev'?: string
  'mobile'?: string
  'data-ml'?: string
  'devops-cloud'?: string
  'design-ux'?: string
  'product'?: string
  'students'?: string
  'entrepreneurs'?: string
}

export interface FeedCluster {
  cluster_id: string
  canonical_title: string
  category: Category
  priority_score: number
  item_count: number
  first_seen_at: string
  summary_beginner: string | null
  summary_intermediate: string | null
  summary_expert: string | null
  vertical_panels: VerticalPanels
  region_relevance: RegionRelevance
}

export interface ClassificationResult {
  category: Category
  priority_signal: number
  reasoning: string
}

export interface SummarizationResult {
  beginner: string
  intermediate: string
  expert: string
  category: Category
  headline_score_boost: number
}

export interface VerticalPanelResult {
  'web-dev': string
  'mobile': string
  'data-ml': string
  'devops-cloud': string
  'design-ux': string
  'product': string
  'students': string
  'entrepreneurs': string
}

// Priority thresholds (locked — do not change without team discussion)
export const PRIORITY = {
  ARCHIVE_BELOW: 10,
  DIGEST_MIN: 50,
  FEED_MIN: 70,
  VERTICAL_PANELS_MIN: 70,
  OPUS_MIN: 90,
  PUSH_NOTIF_MIN: 70,
} as const

// Category color mapping for UI
export const CATEGORY_LAYER: Record<Category, string> = {
  model_release: 'l0',
  tool_launch: 'l4',
  research_paper: 'l1',
  funding: 'gold',
  security: 'l3',
  tutorial: 'l2',
  opinion: 'muted',
  regulation: 'l6',
}

export const VERTICAL_LABELS: Record<VerticalSlug, string> = {
  'web-dev': 'Web Developers',
  'mobile': 'Mobile Devs',
  'data-ml': 'Data & ML',
  'devops-cloud': 'DevOps & Cloud',
  'design-ux': 'Design & UX',
  'product': 'Product & Strategy',
  'students': 'Students',
  'entrepreneurs': 'Entrepreneurs',
}
