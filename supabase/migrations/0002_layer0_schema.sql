-- NeuralForge Layer 0: Core Schema
-- Data flows: sources → raw_items → clusters → summary_cache

-- ─── SOURCES ────────────────────────────────────────────────────────────────
-- One row per ingestion source (RSS feed, API endpoint, Apify actor, etc.)
create table sources (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique,
  url             text not null,
  feed_url        text,
  source_type     text not null check (source_type in
                    ('rss','api','json_undoc','third_party_api','headless')),
  tier            int not null check (tier between 1 and 5),
  -- tier 1: arXiv/HN/GitHub/PH  tier 2: lab blogs  tier 3: social
  -- tier 4: niche/India          tier 5: meta aggregators
  authority_score int not null default 20 check (authority_score between 0 and 40),
  -- Feeds into score_source_authority component of priority score
  polling_cron    text not null default '*/30 * * * *',
  active          boolean not null default true,
  region          text not null default 'global' check (region in ('global','india','both')),
  last_polled_at  timestamptz,
  last_success_at timestamptz,
  consecutive_errors int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── CLUSTERS ───────────────────────────────────────────────────────────────
-- One row per story/event (NOT per source article).
-- Multiple raw_items from different sources map to one cluster via dedup.
-- UI shows one cluster card with item_count badge.
create table clusters (
  id                     uuid primary key default gen_random_uuid(),
  canonical_title        text not null,
  canonical_url          text,
  category               text not null check (category in (
                           'model_release','tool_launch','research_paper',
                           'funding','opinion','tutorial','security','regulation')),
  priority_score         int not null default 0 check (priority_score between 0 and 100),
  item_count             int not null default 1,
  first_seen_at          timestamptz not null default now(),
  last_updated_at        timestamptz not null default now(),

  -- ── 3-Level Summaries (single LLM call, stored in separate columns for query speed) ──
  summary_beginner       text,           -- ~200 words, plain English
  summary_intermediate   text,           -- ~100 words, working developer
  summary_expert         text,           -- ~50 words, ML engineer
  summary_generated_at   timestamptz,
  summary_model          text check (summary_model in ('haiku','sonnet','opus')),
  summary_cost_usd       numeric(8,6),

  -- ── Vertical Impact Panels (8 industries, cached JSONB, priority >= 70 only) ──
  vertical_panels        jsonb not null default '{}'::jsonb,
  -- { "web-dev": "...", "mobile": "...", "data-ml": "...", "devops-cloud": "...",
  --   "design-ux": "...", "product": "...", "students": "...", "entrepreneurs": "..." }
  vertical_panels_cached_at timestamptz,

  -- ── Cluster-level embedding for semantic search + L3 dedup ──
  embedding              vector(1536),

  region_relevance       text not null default 'global'
                         check (region_relevance in ('global','india','india_first')),
  metadata               jsonb not null default '{}'::jsonb,

  -- ── Processing state ──
  pipeline_status        text not null default 'pending'
                         check (pipeline_status in ('pending','summarized','failed')),
  summarization_attempts int not null default 0
);

-- ─── RAW ITEMS ──────────────────────────────────────────────────────────────
-- One row per article/post from any source.
-- Pipeline processes items through 7 stages: ingest → dedup → classify → score → cluster → summarize → feed
create table raw_items (
  id                     uuid primary key default gen_random_uuid(),
  source_id              uuid not null references sources(id) on delete cascade,
  source_type            text not null,
  source_url             text not null,
  url_hash               text not null,        -- SHA-256 of canonicalized URL (L1 dedup key)
  title                  text not null,
  title_normalized       text,                 -- lowercase, stripped punctuation (L2 trigram key)
  excerpt                text,
  full_text              text,
  author                 text,
  published_at           timestamptz,
  ingested_at            timestamptz not null default now(),

  category               text check (category in (
                           'model_release','tool_launch','research_paper',
                           'funding','opinion','tutorial','security','regulation')),
  priority_score         int not null default 0 check (priority_score between 0 and 100),

  -- ── Score components (stored for auditing + future ML feature engineering) ──
  score_source_authority int not null default 0,   -- 0-40 from sources.authority_score
  score_cross_coverage   int not null default 0,   -- 0-25 from cluster.item_count
  score_freshness        int not null default 0,   -- 0-15 time-decayed
  score_engagement       int not null default 0,   -- 0-10 HN/GH/Reddit signals
  score_author_authority int not null default 0,   -- 0-10 known author registry

  embedding              vector(1536),             -- text-embedding-3-small of title+excerpt
  cluster_id             uuid references clusters(id) on delete set null,
  region_relevance       text not null default 'global'
                         check (region_relevance in ('global','india','india_first')),

  -- ── Pipeline state machine ──
  pipeline_status        text not null default 'ingested'
                         check (pipeline_status in (
                           'ingested','dedup_done','classified',
                           'scored','clustered','summarized','archived')),
  is_duplicate           boolean not null default false,
  duplicate_of           uuid references raw_items(id) on delete set null,
  classification_method  text check (classification_method in ('rules','haiku','embedding_cluster')),

  raw_metadata           jsonb not null default '{}'::jsonb,
  created_at             timestamptz not null default now()
);

-- L1 dedup: DB-level URL uniqueness (catches ~80% of duplicates at zero cost)
alter table raw_items add constraint raw_items_url_hash_unique unique (url_hash);

-- ─── SUMMARY CACHE ──────────────────────────────────────────────────────────
-- THE key cost-control table. Every LLM output is written here.
-- Before any LLM call: check this table. If hit → skip. If miss → call → write.
-- Entries are IMMUTABLE after creation (no UPDATE RLS policy).
create table summary_cache (
  id            uuid primary key default gen_random_uuid(),
  cluster_id    uuid not null references clusters(id) on delete cascade,
  cache_key     text not null,
  -- Format: 'summary:{cluster_id}' or 'vertical:{cluster_id}:{vertical_slug}'
  cache_type    text not null check (cache_type in ('cluster_summary','vertical_panel')),
  vertical_slug text check (vertical_slug in (
                  'web-dev','mobile','data-ml','devops-cloud',
                  'design-ux','product','students','entrepreneurs')),
  content       text not null,
  model_used    text not null check (model_used in ('haiku','sonnet','opus')),
  input_tokens  int,
  output_tokens int,
  cost_usd      numeric(8,6),
  created_at    timestamptz not null default now(),

  -- Prevents accidental regeneration of cached content
  unique(cluster_id, cache_type, vertical_slug)
);

-- ─── DEDUP LOG ──────────────────────────────────────────────────────────────
-- Audit trail for dedup decisions. Used to tune L2/L3 thresholds after W2.
create table dedup_log (
  id          uuid primary key default gen_random_uuid(),
  item_id     uuid not null references raw_items(id) on delete cascade,
  method      text not null check (method in ('url_hash','title_trigram','embedding_cosine')),
  matched_id  uuid references raw_items(id) on delete set null,
  similarity  numeric(5,4),
  created_at  timestamptz not null default now()
);

-- ─── CLASSIFICATION LOG ─────────────────────────────────────────────────────
-- Tracks every classification call for cost monitoring.
-- Target: Haiku calls should be ~40% of total (rules handles ~60%).
create table classification_log (
  id              uuid primary key default gen_random_uuid(),
  item_id         uuid not null references raw_items(id) on delete cascade,
  method          text not null check (method in ('rules','haiku','embedding_cluster')),
  category_result text not null,
  priority_result int not null,
  input_tokens    int,
  output_tokens   int,
  cost_usd        numeric(8,6),
  created_at      timestamptz not null default now()
);

-- ─── USER PROFILES ──────────────────────────────────────────────────────────
create table user_profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  username             text unique,
  display_name         text,
  avatar_url           text,
  plan                 text not null default 'free'
                       check (plan in ('free','pro','premium','enterprise')),

  -- Personalization: which verticals to show in feed
  selected_verticals   text[] not null default array['web-dev','data-ml'],
  -- Free: max 3 verticals. Pro+: unlimited.
  preferred_level      text not null default 'beginner'
                       check (preferred_level in ('beginner','intermediate','expert')),

  -- Streak tracking
  current_streak       int not null default 0,
  longest_streak       int not null default 0,
  last_active_date     date,
  streak_freeze_count  int not null default 0,

  -- Free tier daily limits
  daily_swipes_used    int not null default 0,
  daily_reset_at       timestamptz,

  -- Digest settings
  digest_enabled       boolean not null default true,
  digest_time          text not null default '18:00',  -- IST

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- ─── USER READS ─────────────────────────────────────────────────────────────
-- Tracks what each user has seen. Used for:
-- 1. Excluding already-read items from feed (personalization)
-- 2. Excluding from daily digest
-- 3. Future: training signal for personalization model
create table user_reads (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  cluster_id  uuid not null references clusters(id) on delete cascade,
  read_at     timestamptz not null default now(),
  read_level  text check (read_level in ('beginner','intermediate','expert')),
  swiped      boolean not null default false,
  -- True = TikTok swipe interaction (stronger engagement signal)
  unique(user_id, cluster_id)
);

-- ─── DIGEST SENDS ───────────────────────────────────────────────────────────
create table digest_sends (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  sent_at     timestamptz not null default now(),
  cluster_ids uuid[] not null,
  resend_id   text,        -- Resend message ID for open tracking
  opened      boolean not null default false,
  opened_at   timestamptz
);

-- ─── WAITLIST ───────────────────────────────────────────────────────────────
-- Synced from Nexoraa website /api/waitlist endpoint
create table waitlist (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null unique,
  role        text,
  source      text not null default 'nexoraa-website',
  created_at  timestamptz not null default now()
);
