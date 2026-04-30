import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/sections/HeroSection'
import BentoSection from '@/components/sections/BentoSection'
import AgentsSection from '@/components/sections/AgentsSection'
import LoopSection from '@/components/sections/LoopSection'
import PricingSection from '@/components/sections/PricingSection'
import WaitlistSection from '@/components/sections/WaitlistSection'

export default function HomePage() {
  return (
    <div className="relative bg-[#08090e] min-h-screen text-[#e2e8f0] font-sans overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <BentoSection />
        <AgentsSection />
        <LoopSection />
        <PricingSection />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  )
}
