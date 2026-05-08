import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#08090e',
        s1: '#0e0f18',
        s2: '#13141f',
        s3: '#191a28',
        border: '#1e1f30',
        border2: '#2a2b40',
        muted: '#565775',
        dim: '#383960',
        gold: '#f5c842',
        ink: '#0B0F1A',

        // Layer colors
        l0: '#00d4ff',
        l1: '#7c6df8',
        l2: '#f7a435',
        l3: '#f74470',
        l4: '#35d97a',
        l5: '#ff6b35',
        l6: '#a855f7',

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#F3EEFF',
          100: '#E6DDFF',
          200: '#CBB9FF',
          300: '#B096FF',
          400: '#9672FF',
          500: '#7c6df8',
          600: '#5E35FF',
          700: '#4728D1',
          800: '#331E99',
          900: '#221466'
        },
        neon: '#00d4ff',

        // shadcn/ui CSS variable tokens
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
        },
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      fontFamily: {
        sans: ['var(--font-outfit)'],
        outfit: ['var(--font-outfit)'],
        mono: ['var(--font-mono)'],
        display: ['var(--font-outfit)'],
      },
      backgroundImage: {
        'grid': "radial-gradient(circle at 1px 1px, rgba(124,77,255,0.12) 1px, transparent 0)",
        'glow': "radial-gradient(60% 60% at 50% 0%, rgba(124,77,255,0.25), rgba(0,0,0,0) 70%)",
        'hero-glow': "radial-gradient(ellipse at 50% 0%, rgba(124,109,248,0.15) 0%, transparent 60%)",
      },
      boxShadow: {
        'l1': '0 0 20px rgba(124,109,248,0.2)',
        'l0': '0 0 20px rgba(0,212,255,0.2)',
        'gold': '0 0 20px rgba(245,200,66,0.2)',
      },
      animation: {
        'aurora': 'aurora-move 12s ease-in-out infinite',
        'aurora-slow': 'aurora-move 18s ease-in-out infinite',
        'fadein': 'float-up 0.6s ease both',
        'pulse-glow': 'pulse-glow 2.2s ease-in-out infinite',
        'meteor-effect': 'meteor 5s linear infinite',
        'marquee': 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
      },
      keyframes: {
        'aurora-move': {
          '0%, 100%': { transform: 'translateX(-15%) translateY(0) scale(1)' },
          '50%': { transform: 'translateX(15%) translateY(-4%) scale(1.05)' },
        },
        'float-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 rgba(124,77,255,0.0)' },
          '50%': { boxShadow: '0 0 20px rgba(0,240,255,0.4)' },
        },
        'meteor': {
          '0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
          '70%': { opacity: '1' },
          '100%': {
            transform: 'rotate(215deg) translateX(-500px)',
            opacity: '0',
          },
        },
        'marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
      },
    }
  },
  plugins: []
}

export default config
