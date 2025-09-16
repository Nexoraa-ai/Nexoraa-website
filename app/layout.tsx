import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nexoraa — Intelligent Automation, Productized',
  description: 'Nexoraa builds secure, scalable, and auditable AI automations across Corporate Core, TradeSync, HealthTrust, and FinSecure.',
  metadataBase: new URL('https://nexoraa.example'),
  openGraph: {
    title: 'Nexoraa',
    description: 'Intelligent automation across industries — secure, scalable, auditable.',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexoraa',
    description: 'Productized AI playbooks and automations that drive ROI.'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink text-zinc-200 antialiased">
        {children}
      </body>
    </html>
  )
}
