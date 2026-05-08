export type Case = {
  slug: string
  title: string
  unit: 'corporate-core' | 'tradesync' | 'healthtrust' | 'finsecure'
  summary: string
  metrics: string[]
}

export const cases: Case[] = [
  {
    slug: 'enterprise-ap-automation',
    title: 'Enterprise AP Automation cuts cycle time 54%+',
    unit: 'corporate-core',
    summary: 'Automated invoice ingestion, coding, and approvals with full audit logs and human-in-the-loop exceptions.',
    metrics: ['54% cycle time reduction', '99.2% extraction accuracy', 'Audit-ready logs']
  },
  {
    slug: 'tradesync-ai-receptionist',
    title: 'AI Receptionist boosts booking rate by 22%',
    unit: 'tradesync',
    summary: '24/7 SMS-first receptionist captured leads, scheduled jobs, and chased quotes for a plumbing contractor.',
    metrics: ['+22% bookings', '-31% no-shows', 'Faster dispatch']
  },
  {
    slug: 'healthtrust-prior-auth',
    title: 'Prior authorization automation reduces denials 28%',
    unit: 'healthtrust',
    summary: 'Eligibility checks, PA document generation, and status monitoring integrated with EHR.',
    metrics: ['-28% denials', 'Fewer staff hours', 'Faster approvals']
  }
]

export const caseBySlug = (slug: string) => cases.find(c => c.slug === slug)
