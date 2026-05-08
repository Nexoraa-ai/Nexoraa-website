'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function WaitlistSection() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role })
      })
      
      if (res.ok) {
        setSent(true)
      } else {
        const data = await res.json().catch(() => null)
        setError(data?.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="waitlist" className="py-24 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-[720px] mx-auto text-center relative z-10">
        {/* Glow */}
        <div aria-hidden className="absolute left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(124,109,248,0.12)_0%,transparent_70%)] pointer-events-none -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#7c6df8] mb-4 flex items-center justify-center gap-2.5"
        >
          <span className="w-6 h-px bg-[#7c6df8] inline-block" />
          Automation Pilot · Limited Slots
          <span className="w-6 h-px bg-[#7c6df8] inline-block" />
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[clamp(28px,5vw,52px)] font-black leading-[1.05] tracking-[-0.03em] mb-4 text-white"
        >
          Start building with{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7c6df8] to-[#00d4ff]">
            Nexoraa
          </span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[15px] text-[#565775] leading-relaxed max-w-[540px] mx-auto mb-10"
        >
          Tell us where manual work is slowing the business down. We&apos;ll help you scope a secure AI automation pilot with measurable ROI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {sent ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[rgba(53,217,122,0.08)] border border-[rgba(53,217,122,0.25)] rounded-2xl p-8"
            >
              <div className="text-5xl mb-4">🎉</div>
              <div className="text-lg font-bold text-[#35d97a] mb-2">You&apos;re on the list!</div>
              <div className="text-[13px] text-[#8e8fa6]">We&apos;ll reach out with early access details soon. Follow us on X and LinkedIn for updates.</div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#0e0f18] border border-[#1e1f30] rounded-2xl p-7 text-left shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7c6df8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 relative z-10">
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Your name" 
                  required 
                  className="bg-[#13141f] border border-[#2a2b40] rounded-xl px-4 py-3 text-sm text-white outline-none w-full transition-colors focus:border-[#7c6df8] focus:bg-[#191a28]" 
                />
                <input 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  type="email" 
                  placeholder="Work / college email" 
                  required 
                  className="bg-[#13141f] border border-[#2a2b40] rounded-xl px-4 py-3 text-sm text-white outline-none w-full transition-colors focus:border-[#7c6df8] focus:bg-[#191a28]" 
                />
              </div>
              <select 
                value={role} 
                onChange={e => setRole(e.target.value)} 
                required 
                className="w-full bg-[#13141f] border border-[#2a2b40] rounded-xl px-4 py-3 text-sm text-[#8e8fa6] outline-none mb-4 transition-colors focus:border-[#7c6df8] focus:bg-[#191a28] appearance-none relative z-10"
              >
                <option value="">I am a... (select role)</option>
                <option value="Corporate Operations">Corporate Operations</option>
                <option value="Home Services">Home Services</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Startup / SMB">Startup / SMB</option>
              </select>
              {error && (
                <p className="relative z-10 mb-4 rounded-lg border border-[#f74470]/30 bg-[#f74470]/10 px-3 py-2 text-center text-xs text-[#ff9ab0]">
                  {error}
                </p>
              )}
              
              <div className="relative z-10 w-full flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7c6df8] to-[#00d4ff] text-white text-[15px] font-bold text-center disabled:opacity-70 disabled:cursor-wait hover:opacity-90 transition-opacity"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : 'Request a Pilot →'}
                </button>
              </div>
              
              <p className="text-[11px] text-[#565775] mt-4 text-center relative z-10">
                No spam. We use your details only to follow up about the automation pilot.
              </p>
            </form>
          )}
        </motion.div>

        {/* Social proof */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-10 flex justify-center gap-8 md:gap-12 flex-wrap"
        >
          {[
            { n: '4', l: 'Business Units' },
            { n: '24h', l: 'Initial Reply' },
            { n: 'ROI', l: 'Measured Pilots' },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-mono text-xl font-bold text-[#7c6df8] mb-1">{s.n}</div>
              <div className="text-[11px] text-[#565775] uppercase tracking-[0.08em]">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
