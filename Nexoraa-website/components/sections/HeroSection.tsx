import { CinematicHero } from '../ui/cinematic-landing-hero'

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0A101D]">
      <CinematicHero 
        brandName="Nexoraa"
        tagline1="Automate the work"
        tagline2="that slows growth."
        cardHeading="Intelligent automation, productized."
        cardDescription={
          <>
            <span className="text-white font-semibold">Nexoraa</span> builds secure, scalable, and auditable AI automations across operations, trade services, healthcare, and financial workflows.
          </>
        }
        metricValue={24}
        metricLabel="Hours Saved"
        ctaHeading="Plan your automation roadmap."
        ctaDescription="Bring us the workflow. We will map the bottlenecks, ship the pilot, and measure the ROI."
      />
    </section>
  )
}
