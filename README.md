# Nexoraa Website

Modern, futuristic website for Nexoraa built with Next.js (App Router) and Tailwind CSS.

## Run locally

```sh
pnpm install
pnpm dev
```

Or with npm:

```sh
npm install
npm run dev
```

## Build and deploy

```sh
npm run build
npm start
```

Outputs a standalone server (`output=standalone`) suitable for any platform (Docker, VM, Fly.io, Render, Railway, Vercel, Netlify with adapter, etc.).

## Tech
- Next.js 14 (App Router)
- Tailwind CSS 3
- TypeScript

## Content structure
- Business units: Corporate Core, TradeSync, HealthTrust, FinSecure
- Approach: Process Mining, Productized Solutions, Continuous Optimization
- Contact: Uses `https://formsubmit.co` by default (replace with your own endpoint as needed)

## Customize
- Update brand colors in `tailwind.config.ts`
- Edit copy in `app/page.tsx`
- Add assets (vectors/gifs) in `public/` and reference via `/...`

## Contact form endpoint
Both homepage and `/contact` currently submit to `https://formsubmit.co`.
To use your own backend/API route, update each form `action` value in:
- `app/page.tsx`
- `app/contact/page.tsx`
