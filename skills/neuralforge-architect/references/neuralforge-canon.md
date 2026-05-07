# NeuralForge Canon

## Product Snapshot

- NeuralForge is a 7-layer AI Work OS: Stay Current -> Learn -> Build -> Compete -> Hire.
- Core wedge: every meaningful AI development should become a learning artifact within 72 hours.
- Target audience: India-first but globally relevant developers, AI engineers, students, and early-career builders.
- Revenue logic: free distribution funded later by Layer 5 AI agents and Layer 6 verified talent marketplace.

## The 7 Layers

| Layer | Name | Tagline | Status | Accent |
| --- | --- | --- | --- | --- |
| L0 | News Intelligence Hub / AIPulse | Stay Current | Active build | `#00d4ff` |
| L1 | Learn - Interactive AI Curriculum | Understand It | Spec | `#7c6df8` |
| L2 | Build - Daily Challenges & Problem Sets | Practice It | Spec | `#f7a435` |
| L3 | Compete - Hackathons & Contests | Prove It | Future | `#f74470` |
| L4 | Community - Developer Feed & Portfolio | Show It | Future | `#35d97a` |
| L5 | Deploy - AI Agents Marketplace | Hire AI Employees | Future | `#ff6b35` |
| L6 | Deploy - Human Freelance Marketplace | Upwork, but Verified | Future | `#a855f7` |

## Approved Stack

| Area | Choice | Why |
| --- | --- | --- |
| Frontend | Next.js 14+ on Vercel | Fast server-rendered feeds, existing team familiarity |
| DB, auth, storage | Supabase | Postgres, Auth, Storage, pgvector in one place |
| Orchestration | n8n self-hosted on Railway | Native connectors, cheaper than cloud at projected volume |
| LLM | Claude Haiku, Sonnet, Opus | Tiered cost strategy |
| Embeddings | OpenAI `text-embedding-3-small` or Voyage `voyage-3-lite` | Cheap 1536d vectors in pgvector |
| Media | Bunny.net | Low-cost CDN and storage |
| Email | Resend | Digest and recap delivery |
| Background jobs | Supabase pg_cron plus Edge Functions, n8n for stateful flows | Clear separation of concerns |

## Rejected Alternatives

- Pinecone
- Airflow
- Firebase
- Sanity
- Twilio for this stack

## Layer 0 Rules

### 3-Level Summary Contract

- `beginner`: about 200 words, plain language, explain why it matters
- `intermediate`: about 100 words, technical but plain
- `expert`: about 50 words, dense, technical, signal first
- Generate all three in one Sonnet call with structured JSON

### 8 Vertical Slugs

- `web-dev`
- `mobile`
- `data-ml`
- `devops-cloud`
- `design-ux`
- `product`
- `students`
- `entrepreneurs`

### 8 Categories

- `model_release`
- `tool_launch`
- `research_paper`
- `funding`
- `opinion`
- `tutorial`
- `security`
- `regulation`

## Canonical Schema

```sql
create table raw_items (
  id               uuid primary key default gen_random_uuid(),
  source_id        uuid references sources(id),
  source_type      text not null,
  source_url       text not null unique,
  url_hash         text not null,
  title            text not null,
  title_normalized text,
  excerpt          text,
  full_text        text,
  author           text,
  published_at     timestamptz,
  ingested_at      timestamptz default now(),
  category         text,
  priority_score   int default 0,
  embedding        vector(1536),
  cluster_id       uuid references clusters(id),
  region_relevance text default 'global',
  raw_metadata     jsonb default '{}'::jsonb
);

create index raw_items_url_hash_idx on raw_items using hash (url_hash);
create index raw_items_title_trgm_idx on raw_items using gin (title_normalized gin_trgm_ops);
create index raw_items_embedding_idx on raw_items using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index raw_items_published_idx on raw_items (published_at desc);
create index raw_items_priority_idx on raw_items (priority_score desc) where priority_score >= 50;
```

Related tables:

- `sources`
- `clusters`
- `vertical_panels`

## Dedup Strategy

1. URL hash of canonicalized URL
2. Title trigram similarity over the last 7 days
3. Embedding cosine similarity over the last 14 days

Cluster-level UX wins:

- UI shows one card per cluster
- coverage badge is source-count based
- never ship per-item cards as the primary feed experience

## Priority Score

```txt
score =
  source_authority      0-40
  + cross_source_coverage 0-25
  + freshness             0-15
  + engagement_signal     0-10
  + author_authority      0-10
```

Thresholds:

- `>= 70`: trigger vertical panels, push notification, Layer 1 generation queue
- `50-69`: daily digest
- `< 50`: archive and search only

## Classification Pipeline

1. Rules engine in Postgres or workflow logic
2. Claude Haiku for unresolved cases
3. Embedding clustering in pgvector

## Cost Model

Budget against 25K MAU steady state, not day 1.

| Component | Monthly |
| --- | --- |
| n8n on Railway | `$20-50` |
| Supabase Pro | `$25` |
| Apify X scraping | `$80-150` |
| Reddit API if needed | `$0-120` |
| HTML fallback scraping | `$20-50` |
| Claude Sonnet summarization | `$80-200` |
| Claude Haiku classification | `$30-80` |
| Embeddings | `$5-15` |
| Resend | `$20-35` |
| Bunny.net | `$20-50` |
| Total steady state | `$300-875` |

Cost control priority:

1. Cluster-level summarization
2. Cache vertical panels by `(cluster_id, vertical_slug)`
3. Only generate vertical panels for priority `>= 70`
4. One LLM call for all three summary levels

## Source Risk Model

| Source class | Risk | Policy |
| --- | --- | --- |
| arXiv, HuggingFace, GitHub, YouTube RSS, Substack RSS | Low | Use freely, respect rate limits |
| Reddit JSON, Discord public channels, Product Hunt RSS | Low to medium | Use polite access and paid plans when scale requires it |
| X via Apify or TwitterAPI.io | Medium | Store IDs, do not republish raw tweets verbatim |
| LinkedIn post scraping | High | Do not do it |

## Design Tokens

```css
--bg: #08090e;
--s1: #0e0f18;
--s2: #13141f;
--s3: #191a28;
--border: #1e1f30;
--text: #e8e9f5;
--muted: #565775;

--l0: #00d4ff;
--l1: #7c6df8;
--l2: #f7a435;
--l3: #f74470;
--l4: #35d97a;
--l5: #ff6b35;
--l6: #a855f7;
```

Typography:

- Display and body: Outfit
- Mono and data: JetBrains Mono
- Do not default to Inter, Roboto, Arial, or system UI

UI patterns:

- Sticky tab nav with stage numbers in mono
- Cards with left accent border
- Why and How dual cards
- Dense technical hero with KPI row
- Dark code blocks with tinted syntax
- Status pills for cost and tier labels

## Non-Negotiables

- NeuralForge is separate from Hagerstone International work
- Do not propose Pinecone, Airflow, or Firebase
- Do not build per-item summaries where cluster summaries work
- Do not scrape LinkedIn posts
- Do not invent new canonical slugs, categories, or layer numbering unless the user explicitly changes canon
