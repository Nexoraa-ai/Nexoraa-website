import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

function SectionTitle({ kicker, title, subtitle }: { kicker?: string, title: string, subtitle?: string }) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      {kicker && <p className="text-primary-300/90 text-xs uppercase tracking-[0.2em] mb-2">{kicker}</p>}
      <h2 className="text-2xl md:text-4xl font-semibold text-white leading-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-zinc-400">{subtitle}</p>}
    </div>
  )
}

function Glow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary-500/30 blur-3xl" />
      <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-neon/20 blur-2xl" />
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="relative">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Subtle animated aurora for higher contrast with blue logo */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[#0b6bff]/18 blur-3xl animate-aurora" />
            <div className="absolute top-10 -right-10 h-64 w-64 rounded-full bg-[#00e0ff]/14 blur-2xl animate-aurora-slow" />
          </div>
          <div className="mx-auto max-w-7xl px-6 pt-20 pb-24">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-primary-200 text-xs uppercase tracking-[0.25em] mb-3">Intelligent Automation</p>
                <h1 className="text-4xl md:text-6xl font-semibold text-white leading-tight">
                  AI that operates like a partner, not a plugin.
                </h1>
                <p className="mt-5 text-zinc-300 text-lg">
                  Nexoraa deploys secure, scalable, and auditable AI that turns operational drag into streamlined, data-driven workflows.
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <a href="#contact" className="rounded-md bg-primary-600 px-5 py-3 text-white font-medium shadow-[0_0_40px_rgba(124,77,255,0.35)] hover:bg-primary-500 transition">Start a conversation</a>
                  <a href="#units" className="rounded-md ring-1 ring-white/15 px-5 py-3 text-zinc-200 hover:bg-white/5 transition">Explore solutions</a>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-6 text-sm text-zinc-400">
                  <div>
                    <p className="text-white text-lg font-semibold">Secure</p>
                    <p>Auditable by design</p>
                  </div>
                  <div>
                    <p className="text-white text-lg font-semibold">Scalable</p>
                    <p>Built for production</p>
                  </div>
                  <div>
                    <p className="text-white text-lg font-semibold">ROI</p>
                    <p>Measured outcomes</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-xl ring-1 ring-white/10 bg-gradient-to-br from-primary-500/20 via-ink to-ink p-1">
                  <div className="h-full w-full rounded-[0.7rem] bg-ink grid place-items-center">
                    <div className="p-6 text-center text-zinc-300">
                      <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
                        <svg viewBox="0 0 24 24" className="h-10 w-10 text-zinc-200" aria-hidden>
                          <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3v2" />
                            <circle cx="12" cy="2.5" r="1" fill="currentColor" />
                            <rect x="5" y="6.5" width="14" height="10" rx="2.5" />
                            <path d="M7 16.5h10" />
                          </g>
                          <circle cx="9" cy="11.5" r="1.25" fill="currentColor" />
                          <circle cx="15" cy="11.5" r="1.25" fill="currentColor" />
                        </svg>
                      </div>
                      <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] text-primary-200/90 mb-2">Secure • Scalable • Auditable</p>
                      <p className="text-[18px] md:text-xl leading-relaxed text-zinc-100">System-level automations, not one-off chatbots.</p>
                      <p className="mt-2 text-[14px] md:text-base text-zinc-400">Integrations across Salesforce, NetSuite, Workday, ServiceTitan, Jobber, EHRs, KYC/AML and more.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Units */}
  <section id="units" className="relative py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionTitle
              kicker="Business Units"
              title="Productized AI playbooks across industries"
              subtitle="We build and deploy tailored automations with deep system integrations."
            />
            <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                {
                  title: 'Nexoraa Corporate Core',
                  desc: 'Operational efficiency for mid-market and enterprise. AP/AR, HR onboarding, Sales/Marketing OS.',
                  tags: ['Salesforce', 'NetSuite', 'Workday'],
                  href: '/units/corporate-core'
                },
                {
                  title: 'Nexoraa TradeSync',
                  desc: 'Home services AI. 24/7 AI Receptionist, quoting engines, and SMS flows with Jobber/ServiceTitan.',
                  tags: ['Jobber', 'ServiceTitan', 'Twilio SMS'],
                  href: '/units/tradesync'
                },
                {
                  title: 'Nexoraa HealthTrust',
                  desc: 'HIPAA/GDPR-compliant automations. Revenue cycle optimization, prior auth, EHR integration.',
                  tags: ['HIPAA', 'EHR', 'GDPR'],
                  href: '/units/healthtrust'
                },
                {
                  title: 'Nexoraa FinSecure',
                  desc: 'Secure, auditable AI for fintech. KYC/AML checks, onboarding, and portfolio workflows.',
                  tags: ['KYC/AML', 'Compliance', 'Wealth'],
                  href: '/units/finsecure'
                },
              ].map((c) => (
                <a href={c.href} key={c.title} className="group rounded-xl bg-white/5 ring-1 ring-white/10 p-6 hover:bg-white/[0.07] transition relative overflow-hidden">
                  <div className="absolute -top-24 -right-24 size-56 rounded-full bg-primary-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition" />
                  <h3 className="text-white text-lg font-semibold">{c.title}</h3>
                  <p className="mt-2 text-zinc-400 text-sm">{c.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {c.tags.map(t => (
                      <span key={t} className="rounded-md bg-ink ring-1 ring-white/10 px-2 py-1 text-xs text-zinc-300">{t}</span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Approach */}
        <section id="approach" className="relative py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionTitle
              kicker="Our Approach"
              title="Data-first, outcome-driven"
              subtitle="From process mining to continuous optimization, we build for measurable ROI."
            />
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {[
                { name: 'Process Mining Audit', desc: 'Identify bottlenecks, quantify automation potential, and align on success metrics.' },
                { name: 'Productized Solutions', desc: 'Deploy refined playbooks, tailored to your stack and regulatory requirements.' },
                { name: 'Continuous Optimization', desc: 'Close the loop with telemetry and human-in-the-loop feedback for compounding gains.' },
              ].map((s, i) => (
                <div key={s.name} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
                  <div className="text-primary-300 text-sm">Step {i+1}</div>
                  <h4 className="mt-2 text-white font-semibold">{s.name}</h4>
                  <p className="mt-2 text-zinc-400 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
  <section id="contact" className="relative py-20">
          <div className="mx-auto max-w-3xl px-6">
            <SectionTitle
              kicker="Get in touch"
              title="Let’s align on a high-ROI automation target"
              subtitle="Share a bit about your stack and bottlenecks. We’ll follow up within 24 hours."
            />
            <form action="https://formsubmit.co" method="POST" className="mt-10 grid gap-4">
              <input type="hidden" name="_subject" value="Nexoraa Website Lead" />
              <div className="grid md:grid-cols-2 gap-4">
                <input name="name" placeholder="Your name" className="rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 placeholder:text-zinc-500" required />
                <input name="email" type="email" placeholder="Work email" className="rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 placeholder:text-zinc-500" required />
              </div>
              <input name="company" placeholder="Company" className="rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 placeholder:text-zinc-500" />
              <textarea name="message" placeholder="What problem are you solving?" rows={5} className="rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 placeholder:text-zinc-500" />
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500">By submitting, you agree to our privacy policy.</p>
                <button className="rounded-md bg-primary-600 px-5 py-3 text-white font-medium hover:bg-primary-500">Send</button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
