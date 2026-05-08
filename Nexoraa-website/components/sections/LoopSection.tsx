'use client'

import { TracingBeam } from '../ui/tracing-beam'
import { motion } from 'framer-motion'

const steps = [
  { n: '1', icon: '📡', color: '#00d4ff', title: 'Read', desc: 'Stay updated with daily AI news drops, summarized specifically for your role.', out: 'Stay Current' },
  { n: '2', icon: '🎓', color: '#7c6df8', title: 'Learn', desc: 'Practice in browser-based coding labs. No environment setup required.', out: 'Hands-on Skills' },
  { n: '3', icon: '⚡', color: '#f7a435', title: 'Build', desc: 'Solve daily challenges and build your streak. Master prompt engineering to MLOps.', out: 'Build Habits' },
  { n: '4', icon: '🏆', color: '#f74470', title: 'Compete', desc: 'Enter weekly contests and hackathons to prove your skills on the global leaderboard.', out: 'Prove Yourself' },
  { n: '5', icon: '🤖', color: '#ff6b35', title: 'Deploy', desc: 'Deploy pre-trained AI agents to automate your workflow and save 10+ hours a week.', out: 'Scale Output' },
  { n: '6', icon: '🏅', color: '#f5c842', title: 'Get Hired', desc: 'Use your verified portfolio of solved challenges to land top freelance gigs.', out: 'Monetize Skills' },
]

export default function LoopSection() {
  return (
    <section className="py-24 px-6 md:px-12 border-b border-[#1e1f30] bg-[#08090e]">
      <div className="max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold tracking-[-0.02em] mb-4 text-white">
            How it works
          </h2>
          <p className="text-base text-[#565775] max-w-[600px] mx-auto leading-relaxed">
            Everything you need to master AI and monetize your skills, built into one seamless journey.
          </p>
        </motion.div>

        <TracingBeam className="px-6">
          <div className="max-w-2xl mx-auto pt-4 pb-12">
            {steps.map((s, idx) => (
              <motion.div 
                key={s.n}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-12 relative"
              >
                <div 
                  className="bg-[#0e0f18] border border-[#1e1f30] rounded-2xl p-6 md:p-8 relative overflow-hidden group"
                  style={{ borderTop: `3px solid ${s.color}` }}
                >
                  <div className="font-mono text-6xl font-extrabold opacity-[0.03] absolute top-2 right-4 leading-none group-hover:scale-110 transition-transform duration-500">
                    {s.n}
                  </div>
                  <div className="flex items-start gap-5 relative z-10">
                    <div className="text-4xl bg-[#13141f] p-4 rounded-xl">
                      {s.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: s.color }}>{s.title}</h3>
                      <p className="text-[#8e8fa6] leading-relaxed mb-4 text-[15px]">
                        {s.desc}
                      </p>
                      <span 
                        className="font-mono text-xs px-3 py-1.5 rounded-md inline-block font-medium"
                        style={{ background: `${s.color}18`, color: s.color }}
                      >
                        {s.out}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TracingBeam>
      </div>
    </section>
  )
}
