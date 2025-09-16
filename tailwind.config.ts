import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C4DFF',
          50: '#F3EEFF',
          100: '#E6DDFF',
          200: '#CBB9FF',
          300: '#B096FF',
          400: '#9672FF',
          500: '#7C4DFF',
          600: '#5E35FF',
          700: '#4728D1',
          800: '#331E99',
          900: '#221466'
        },
        neon: '#00F0FF',
        ink: '#0B0F1A',
        slate: '#0F172A'
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      backgroundImage: {
        'grid': "radial-gradient(circle at 1px 1px, rgba(124,77,255,0.25) 1px, transparent 0)",
        'glow': "radial-gradient(60% 60% at 50% 0%, rgba(124,77,255,0.35), rgba(0,0,0,0) 70%)"
      }
    }
  },
  plugins: [
  ]
}

export default config
