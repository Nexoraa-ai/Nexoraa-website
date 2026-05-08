'use client'

import { motion } from 'framer-motion'
import { InfiniteBentoPan } from '../ui/infinite-bento-pan'

export default function BentoSection() {
  return (
    <section id="platform" className="relative h-[800px] border-b border-[#1e1f30] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <InfiniteBentoPan accentColor="#7c6df8" panSpeed={1.5} />
      </div>
      
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center bg-black/40 backdrop-blur-md p-10 rounded-3xl border border-white/10"
        >
          <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold tracking-[-0.02em] mb-4 text-white drop-shadow-xl">
            The complete developer toolkit.
          </h2>
          <p className="text-base text-gray-300 max-w-[600px] mx-auto leading-relaxed drop-shadow-lg">
            From reading the latest AI research to deploying autonomous agents in production. Everything you need to master AI, all in one browser tab.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
