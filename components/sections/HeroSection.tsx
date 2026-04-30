import { CinematicHero } from '../ui/cinematic-landing-hero'

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0A101D]">
      <CinematicHero 
        brandName="NeuralForge"
        tagline1="Build the future,"
        tagline2="with AI agents."
        cardHeading="India's AI Work OS."
        cardDescription={
          <>
            <span className="text-white font-semibold">NeuralForge</span> is the only platform where you stay current with AI news, learn hands-on with browser-based labs, prove your skills in hackathons, and deploy AI agents as employees.
          </>
        }
        metricValue={24}
        metricLabel="Hours Active"
        ctaHeading="Join the Waitlist."
        ctaDescription="The complete ecosystem for developers and businesses. Deploy your first AI employee today."
      />
    </section>
  )
}
