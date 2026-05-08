const SOURCES = [
  'arXiv', 'OpenAI Blog', 'Anthropic', 'Google DeepMind', 'Hacker News',
  'HuggingFace', 'GitHub Trending', 'Meta AI', 'Mistral', 'Reddit r/ML',
  'TLDR AI', 'MIT Tech Review', 'Product Hunt', 'VentureBeat AI', 'The Batch',
]

export function LogoTicker() {
  const doubled = [...SOURCES, ...SOURCES]

  return (
    <section className="relative py-10 overflow-hidden border-y border-[#1e1f30]">
      <p className="text-center font-mono text-[10px] text-[#383960] tracking-widest uppercase mb-6">
        Ingesting from 500+ sources including
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#08090e] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#08090e] to-transparent" />

        {/* Ticker */}
        <div
          className="flex gap-6"
          style={{
            animation: 'marquee 30s linear infinite',
            '--duration': '30s',
            '--gap': '1.5rem',
            width: 'max-content',
          } as React.CSSProperties}
        >
          {doubled.map((source, i) => (
            <div
              key={i}
              className="flex items-center gap-2 shrink-0 px-4 py-1.5 rounded-full bg-[#0e0f18] border border-[#1e1f30]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#383960]" />
              <span className="font-mono text-[11px] text-[#565775] whitespace-nowrap">{source}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
