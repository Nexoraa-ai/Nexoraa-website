import type { Metadata } from 'next'
import { Outfit, JetBrains_Mono } from 'next/font/google'
import '@neuralforge/ui/globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Nexoraa — AI Work OS',
    template: '%s | Nexoraa',
  },
  description: 'Stay current, learn fast, build better. The AI Work OS for developers.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.neuralforge.io'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <body
        suppressHydrationWarning
        className="bg-[#08090e] text-[#e8e9f5] font-sans antialiased"
      >
        {children}
      </body>
    </html>
  )
}
