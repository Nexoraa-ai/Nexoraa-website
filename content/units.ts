export type Unit = {
  slug: 'corporate-core' | 'tradesync' | 'healthtrust' | 'finsecure'
  title: string
  focus: string
  description: string
  keywords: string[]
  integrations: string[]
  features: string[]
  outcomes: string[]
}

export const units: Unit[] = [
  {
    slug: 'corporate-core',
    title: 'Nexoraa Corporate Core',
    focus: 'Mid-market to Enterprise',
    description:
      'Intelligent automations for Finance, HR, and Sales & Marketing. We integrate with your core software stack to deliver measurable ROI.',
    keywords: ['operational efficiency', 'data-driven insights', 'productized playbooks', 'ROI'],
    integrations: ['Salesforce', 'NetSuite', 'Workday', 'Slack', 'GDrive'],
    features: [
      'AP/AR automation with human-in-the-loop',
      'HR onboarding workflows',
      'Sales/Marketing OS automations',
      'Audit-ready change log and telemetry',
    ],
    outcomes: [
      'Cut cycle times in Finance by 30–60%',
      'Reduce onboarding SLA by 50%+',
      'Increase Sales ops throughput with fewer manual steps',
    ],
  },
  {
    slug: 'tradesync',
    title: 'Nexoraa TradeSync',
    focus: 'Home Service Contractors',
    description:
      '24/7 AI Receptionist and Operations Platform to book more jobs and increase technician efficiency with SMS-first experiences.',
    keywords: ['AI Receptionist', 'book more jobs', 'technician efficiency', 'automated estimates'],
    integrations: ['Jobber', 'ServiceTitan', 'Housecall Pro', 'Twilio SMS'],
    features: [
      '24/7 lead capture and scheduling',
      'Automated quoting and follow-ups',
      'Dispatch coordination and reminders',
      'Unified SMS communication flows',
    ],
    outcomes: [
      'Increase booking rate by 15–30%',
      'Reduce no-shows with smart reminders',
      'Faster estimates and higher close rates',
    ],
  },
  {
    slug: 'healthtrust',
    title: 'Nexoraa HealthTrust',
    focus: 'Private Practices & Medical Billing',
    description:
      'HIPAA/GDPR-compliant automations that reduce claim denials, cut no-shows, and optimize revenue cycles end to end.',
    keywords: ['HIPAA-compliant', 'revenue cycle optimization', 'claim denials', 'prior authorization'],
    integrations: ['EHRs', 'Clearinghouses', 'Payer Portals', 'Calendar'],
    features: [
      'Eligibility checks and benefits verification',
      'Automated prior authorization workflows',
      'Denial prevention and appeals routing',
      'Secure patient engagement and reminders',
    ],
    outcomes: [
      'Lower denial rates by 20–40%',
      'Shorter time-to-authorization',
      'Higher patient show-up rates',
    ],
  },
  {
    slug: 'finsecure',
    title: 'Nexoraa FinSecure',
    focus: 'Fintech & Financial Services',
    description:
      'Secure, auditable AI for KYC/AML, onboarding, and portfolio workflows to scale safely with strict compliance.',
    keywords: ['regulatory compliance', 'auditable', 'secure', 'KYC/AML', 'wealth management'],
    integrations: ['KYC/AML Providers', 'CRMs', 'Custodians', 'BI Tools'],
    features: [
      'Compliant client onboarding workflows',
      'Automated KYC/AML checks',
      'Portfolio operations automations',
      'Full audit trails and approvals',
    ],
    outcomes: [
      'Reduce onboarding time by 40%+',
      'Lower compliance overhead',
      'Improved risk visibility and auditability',
    ],
  },
]

export const unitBySlug = (slug: Unit['slug']) => units.find(u => u.slug === slug)
