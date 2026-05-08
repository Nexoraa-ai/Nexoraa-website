export const metadata = {
  title: 'Contact — Nexoraa',
  description: 'Start a conversation with Nexoraa about high-ROI automations.'
}

function ContactFormInner({ unit, topic }: { unit: string; topic: string }) {
  const preset = unit || topic ? `Unit: ${unit}\nTopic: ${topic}\n\n` : ''

  return (
    <form action="https://formsubmit.co" method="POST" className="mt-8 grid gap-4">
      <input type="hidden" name="_subject" value="Nexoraa Website Lead" />
      <div className="grid md:grid-cols-2 gap-4">
        <input name="name" placeholder="Your name" className="rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 placeholder:text-zinc-500" required />
        <input name="email" type="email" placeholder="Work email" className="rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 placeholder:text-zinc-500" required />
      </div>
      <input name="company" placeholder="Company" className="rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 placeholder:text-zinc-500" />
      <textarea name="message" placeholder="What problem are you solving?" rows={6} defaultValue={preset} className="rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 placeholder:text-zinc-500" />
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500">By submitting, you agree to our privacy policy.</p>
        <button className="rounded-md bg-primary-600 px-5 py-3 text-white font-medium hover:bg-primary-500">Send</button>
      </div>
    </form>
  )
}

type ContactPageProps = {
  searchParams?: Promise<{ unit?: string; topic?: string }>
}

export default async function ContactPage({
  searchParams,
}: ContactPageProps) {
  const resolvedSearchParams = await searchParams
  const unit = resolvedSearchParams?.unit || ''
  const topic = resolvedSearchParams?.topic || ''

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl md:text-5xl font-semibold text-white">Start a conversation</h1>
      <p className="mt-3 text-zinc-300">Tell us about your stack and bottlenecks. We’ll follow up within 24 hours.</p>
      <ContactFormInner unit={unit} topic={topic} />
    </main>
  )
}
