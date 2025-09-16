export default function Footer() {
  const socials: Array<{ href: string; label: string; icon: JSX.Element }> = [
    {
      href: 'https://www.instagram.com/nexoraa.ai/',
      label: 'Instagram',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM18.5 6a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"/>
        </svg>
      )
    },
    {
      href: 'https://www.linkedin.com/company/nexoraa-ai/',
      label: 'LinkedIn',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.84-2.05 3.79-2.05C21.42 8.65 23 10.5 23 13.7V21h-4v-6.4c0-1.53-.03-3.5-2.13-3.5-2.13 0-2.45 1.66-2.45 3.38V21h-4z"/>
        </svg>
      )
    },
    {
      href: 'https://business.facebook.com/latest/home?asset_id=755202471015795&business_id=639105749026788',
      label: 'Facebook',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/>
        </svg>
      )
    },
    {
      href: 'https://x.com/NexoraaAi',
      label: 'X (Twitter)',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
          <path d="M3 3h4.3l5.2 6.9L17.5 3H21l-7 9.2L21 21h-4.3l-5.3-7.1L6.5 21H3l7.2-9.8L3 3z"/>
        </svg>
      )
  },
  ]

  const isExternal = (href: string) => href.startsWith('http') || href.startsWith('mailto:')

  return (
    <footer className="border-t border-white/10 py-10 text-sm text-zinc-400">
      <div className="mx-auto max-w-7xl px-6 flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          {socials.map(s => (
            <a
              key={s.label}
              href={s.href}
              className={`group inline-flex items-center gap-2 rounded-md px-3 py-2 ring-1 ring-white/10 hover:bg-white/5 ${s.href === '#' ? 'cursor-not-allowed opacity-60' : ''}`}
              target={isExternal(s.href) ? '_blank' : undefined}
              rel={isExternal(s.href) ? 'noopener noreferrer' : undefined}
              aria-label={s.label}
              title={s.href === '#' ? 'YouTube: provide channel URL to enable' : s.label}
            >
              <span className="text-zinc-200">{s.icon}</span>
              <span className="text-zinc-300">{s.label}</span>
            </a>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Nexoraa. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Security</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
