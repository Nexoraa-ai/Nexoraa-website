export type Post = {
  slug: string
  title: string
  summary: string
  tags: string[]
}

export const posts: Post[] = [
  { slug: 'process-mining-101', title: 'Process Mining 101: Finding Automation Gold', summary: 'How to identify high-ROI automation candidates with real usage data.', tags: ['process-mining', 'roi'] },
  { slug: 'hipaa-by-design', title: 'HIPAA by Design for Healthcare Automations', summary: 'Design patterns for secure, compliant healthcare automations.', tags: ['healthcare', 'security'] },
  { slug: 'kyc-aml-automation', title: 'KYC/AML Automation Patterns', summary: 'Practical approaches for robust compliance automation in fintech.', tags: ['fintech', 'compliance'] },
]

export const postBySlug = (slug: string) => posts.find(p => p.slug === slug)
