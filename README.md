# Nexoraa — The AI Work OS for Developers

A 7-layer AI Work OS targeting Indian developers and students. Layer 0 (AIPulse) is the live news intelligence hub that powers the entire platform's flywheel — Read → Learn → Build → Compete → Connect → Agent → Work.

---

## Architecture

This is a Turborepo monorepo with pnpm workspaces.

```
nexoraa/
├── apps/
│   ├── nexoraa-web/          Marketing & waitlist site (Next.js 16)
│   └── platform/             Platform app (Next.js 16 App Router, Supabase)
│       ├── app/              Routes: (auth), (platform), api
│       ├── components/       feed, settings, layout, auth, landing
│       └── lib/              supabase clients, claude prompts, embeddings
├── packages/
│   ├── ui/                   Shared design tokens, globals.css
│   └── types/                Shared TypeScript types (@neuralforge/types)
├── supabase/
│   ├── migrations/           5 ordered SQL migration files
│   └── seed/                 Day-1 source seeds
├── n8n/workflows/            Pipeline workflow JSON exports
└── scripts/                  test-pipeline, backfill-embeddings, seed-sources
```

---

## Quickstart in a fresh Supabase project

### 1. Create a new Supabase project

Sign up at [supabase.com](https://supabase.com) → create project → note the project URL and keys.

### 2. Apply migrations in order

The `supabase/migrations/` folder contains 5 ordered SQL files. Run them **in numerical order** in the Supabase SQL Editor (Dashboard → SQL → New query):

| File | What it creates |
|---|---|
| `0001_extensions.sql` | Postgres extensions: `uuid-ossp`, `pgcrypto`, `pg_trgm`, `vector` |
| `0002_layer0_schema.sql` | Tables: `sources`, `clusters`, `raw_items`, `summary_cache`, `dedup_log`, `classification_log`, `user_profiles`, `user_reads`, `digest_sends`, `waitlist` |
| `0003_rls_policies.sql` | Row Level Security policies for all tables |
| `0004_functions.sql` | `canonicalize_url()`, `find_or_create_cluster()`, `calculate_priority_score()`, `get_feed()` |
| `0005_indexes.sql` | HNSW indexes for `embedding`, GIN for trigrams, btree for hot queries |

### 3. Seed sources (optional but recommended)

Run `supabase/seed/sources.sql` to populate the 20 Day-1 sources (arXiv, Hacker News, Anthropic Blog, Reddit r/ML, etc.).

### 4. Configure environment

```sh
cp apps/platform/.env.example apps/platform/.env.local
# Edit .env.local with your Supabase URL + keys + Anthropic key + OpenAI key
```

Required keys for Layer 0 to work end-to-end:
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (browser)
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
- `ANTHROPIC_API_KEY` (Haiku classification + Sonnet summarization)
- `OPENAI_API_KEY` (text-embedding-3-small)

Optional (per pipeline stage):
- `RESEND_API_KEY` — daily digest email delivery (L0_08)
- `APIFY_API_KEY` — X/Twitter scraping (L0_02)
- `N8N_WEBHOOK_BASE_URL`, `N8N_WEBHOOK_SECRET` — pipeline orchestration

### 5. Install + run

```sh
pnpm install
pnpm dev          # runs all apps via turbo
# or scope to platform:
pnpm --filter platform dev
```

Open http://localhost:3001 — the landing page is at `/`, the feed is at `/feed`.

---

## Cost optimization at 25K MAU

The pipeline is engineered to hit ~$268/mo at 25K MAU vs a naive $605/mo through 9 locked rules:

| Rule | Savings |
|---|---|
| Cluster-level summarization (1 LLM call per cluster, not per article) | 5–10× on Sonnet |
| Single call for all 3 summary levels | 3× vs separate calls |
| Vertical panel caching by `(cluster_id, vertical_slug)` | ~100% on follow-ups |
| Priority gating: < 50 → no summary, < 70 → no vertical panels | 60% volume reduction |
| Rules engine before Haiku (handles ~60% of classifications) | 60% Haiku reduction |
| Batch API for priority 50–69 (overnight queue) | 50% on digest-tier |
| Embed input = title + excerpt only (150 tokens, not full_text) | 10× embedding cost |
| Apify runs once daily (not 15-min poll) | $70/mo savings |
| Prompt caching on Sonnet system prompt | ~$1.62/mo |

---

## n8n Workflows

The 8 pipeline workflows live in `n8n/workflows/`:

| Workflow | Purpose |
|---|---|
| `L0_01_rss_ingest.json` | Per-source scheduled RSS pull |
| `L0_02_social_ingest.json` | Apify (X) + Reddit JSON, daily 06:00 IST |
| `L0_03_dedup_cluster.json` | Embed + 3-layer dedup + cluster assignment |
| `L0_04_classify_score.json` | Rules engine + Haiku fallback + score calc |
| `L0_05_summarize.json` | Sonnet/Opus 3-level summary with cache check |
| `L0_06_vertical_panels.json` | Single Haiku call for 8 verticals |
| `L0_07_digest_builder.json` | Per-user feed query + email payload |
| `L0_08_daily_digest_email.json` | Resend send + delivery tracking |

Import into n8n via Settings → Import. Workflows expect environment variables for Supabase, Anthropic, OpenAI, Apify, Resend.

---

## Tech stack

- **Next.js 16** App Router (Turbopack)
- **Supabase** (Postgres + pgvector + Auth + RLS)
- **Tailwind CSS** with custom design tokens (`packages/ui`)
- **TypeScript** end-to-end
- **Turborepo** + **pnpm workspaces**
- **n8n** (Docker on Railway) for pipeline orchestration
- **Anthropic Claude** Haiku 4.5 / Sonnet 4.6 / Opus 4.7
- **OpenAI** `text-embedding-3-small` (1536d)

---

## Verifying the pipeline

After migrations + seed sources are applied, run:

```sh
pnpm tsx scripts/test-pipeline.ts
```

This verifies:
1. URL canonicalization with UTM params
2. URL hash stability
3. L1 dedup (URL hash collision)
4. L2 dedup (title trigram > 0.85 within 7d)
5. L3 dedup (cosine > 0.90 within 14d, increments `item_count`)
6. Priority score calculation
7. Summary cache hit (0 LLM calls on second run)
8. `get_feed()` predicate excludes items with `summary_intermediate IS NULL`

---

## License

Proprietary. © 2026 Nexoraa.
