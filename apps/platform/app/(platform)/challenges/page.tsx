import { ComingSoonPage } from '@/components/layout/ComingSoonPage'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Build — Nexoraa' }

export default function ChallengesPage() {
  return (
    <ComingSoonPage
      layerNum="02"
      layerName="Build"
      color="var(--l2)"
      headline="Coding challenges from real AI papers"
      description="Daily coding challenges extracted directly from AI research. Monaco editor, test cases, editorial — all in-browser. Master what you just read in the feed."
      features={[
        'Daily challenge from feed story',
        'Monaco editor + Judge0',
        'Hidden test cases',
        'Streak multipliers',
        'Multi-language support',
        'Editorial unlock (Pro)',
      ]}
    />
  )
}
