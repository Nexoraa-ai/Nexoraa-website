import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NeuralForge — India\'s AI Work OS',
  description: 'The only platform where you stay current with AI, learn it hands-on, prove it in competitions, deploy AI agents as employees, and get hired for it — all in one account.',
  metadataBase: new URL('https://neuralforge.in'),
  openGraph: {
    title: 'NeuralForge — India\'s AI Work OS',
    description: 'AIPulse × NeuralForge: 7-layer AI Work OS for India\'s 5.8M developers. News · Learn · Build · Compete · Community · Deploy · Reward.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeuralForge — India\'s AI Work OS',
    description: 'Stay current. Learn AI. Compete. Deploy agents. Get hired. All in one platform.',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="font-sans">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
