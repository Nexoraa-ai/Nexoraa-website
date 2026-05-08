import { createClient } from '@/lib/supabase/server'
import { FeedContainer } from '@/components/feed/FeedContainer'
import type { FeedCluster, VerticalSlug } from '@neuralforge/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIPulse Feed — Nexoraa',
  description: 'AI news intelligence hub — stay current with every breakthrough, summarized at your level.',
}

export const revalidate = 900

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('preferred_level, selected_verticals, plan, current_streak, display_name')
    .eq('id', user!.id)
    .single()

  const { data: clusters, error } = await supabase.rpc('get_feed', {
    p_user_id: user!.id,
    p_min_priority: 50,
    p_limit: 20,
    p_offset: 0,
  })

  if (error) console.error('Feed fetch error:', error.message)

  const initialClusters: FeedCluster[] = (clusters ?? []).map((c: Record<string, unknown>) => ({
    cluster_id: c.cluster_id as string,
    canonical_title: c.canonical_title as string,
    category: c.category as FeedCluster['category'],
    priority_score: c.priority_score as number,
    item_count: c.item_count as number,
    first_seen_at: c.first_seen_at as string,
    summary_beginner: c.summary_beginner as string | null,
    summary_intermediate: c.summary_intermediate as string | null,
    summary_expert: (profile?.plan !== 'free' ? c.summary_expert : null) as string | null,
    vertical_panels: (c.vertical_panels ?? {}) as FeedCluster['vertical_panels'],
    region_relevance: c.region_relevance as FeedCluster['region_relevance'],
  }))

  return (
    <FeedContainer
      initialClusters={initialClusters}
      userId={user!.id}
      userPlan={profile?.plan ?? 'free'}
      preferredLevel={profile?.preferred_level ?? 'beginner'}
      streak={profile?.current_streak ?? 0}
      displayName={profile?.display_name ?? null}
      selectedVerticals={(profile?.selected_verticals as VerticalSlug[] | null) ?? null}
    />
  )
}
