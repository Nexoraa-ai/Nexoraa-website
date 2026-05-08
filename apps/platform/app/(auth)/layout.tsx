import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08090e] flex flex-col">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(124,109,248,0.1)_0%,transparent_65%)] animate-aurora" />
        <div className="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(0,212,255,0.07)_0%,transparent_65%)] animate-aurora-slow" />
      </div>

      {/* Nav strip */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[#1e1f30]">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-md bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-[#00d4ff] font-mono">NF</span>
          </div>
          <span className="font-mono text-[11px] font-bold text-[#00d4ff] tracking-[0.15em] uppercase">
            Nexoraa
          </span>
        </Link>
      </header>

      {/* Auth content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  )
}
