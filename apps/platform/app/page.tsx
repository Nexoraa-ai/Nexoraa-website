import { Nav } from '@/components/landing/Nav'
import { Hero } from '@/components/landing/Hero'
import { LogoTicker } from '@/components/landing/LogoTicker'
import { Features } from '@/components/landing/Features'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Testimonials } from '@/components/landing/Testimonials'
import { Pricing } from '@/components/landing/Pricing'
import { FAQ } from '@/components/landing/FAQ'
import { LandingFooter } from '@/components/landing/LandingFooter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nexoraa — The AI Work OS for Developers',
  description: 'Stay ahead of every AI breakthrough. Curated news, personalized summaries at 3 reading levels, and a 7-layer platform to learn, build, and compete — all in one place.',
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#08090e] text-[#e8e9f5]">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-200px] right-[-200px] w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse,rgba(124,109,248,0.1)_0%,transparent_65%)] animate-aurora" />
        <div className="absolute bottom-[-150px] left-[-150px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(0,212,255,0.07)_0%,transparent_65%)] animate-aurora-slow" />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(247,68,112,0.04)_0%,transparent_65%)]" />
      </div>

      <div className="relative z-10">
        <Nav />
        <Hero />
        <LogoTicker />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <LandingFooter />
      </div>
    </div>
  )
}
