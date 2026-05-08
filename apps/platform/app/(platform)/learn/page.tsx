import { ComingSoonPage } from '@/components/layout/ComingSoonPage'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Learn — Nexoraa' }

export default function LearnPage() {
  return (
    <ComingSoonPage
      layerNum="01"
      layerName="Learn"
      color="var(--l1)"
      headline="AI curriculum built from today's news"
      description="Every major AI release triggers a structured lesson within 72 hours. Understand the concept, not just the headline. Video + MDX content, track-based curriculum."
      features={[
        'News → lesson in 72h SLA',
        'Monaco editor in-browser',
        'Track-based curriculum',
        'Progress tracking',
        'Video walkthroughs',
        'Linked to AIPulse feed',
      ]}
    />
  )
}
