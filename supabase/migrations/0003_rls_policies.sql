-- NeuralForge Layer 0: Row Level Security Policies
-- Applied AFTER schema is settled (per plan).
-- Service role (n8n pipeline) bypasses RLS by design in Postgres.

alter table sources           enable row level security;
alter table clusters          enable row level security;
alter table raw_items         enable row level security;
alter table summary_cache     enable row level security;
alter table dedup_log         enable row level security;
alter table classification_log enable row level security;
alter table user_profiles     enable row level security;
alter table user_reads        enable row level security;
alter table digest_sends      enable row level security;
alter table waitlist          enable row level security;

-- ── SOURCES: public read (needed for feed metadata display) ─────────────────
create policy "sources_public_read" on sources
  for select using (active = true);

-- ── CLUSTERS: public read for priority >= 50 ────────────────────────────────
-- Items below 50 are archived and never surfaced
create policy "clusters_public_read" on clusters
  for select using (priority_score >= 50);

-- ── RAW ITEMS: service role only (n8n pipeline writes) ──────────────────────
create policy "raw_items_service_only" on raw_items
  for all using (auth.role() = 'service_role');

-- ── SUMMARY CACHE: public read, service role write ──────────────────────────
-- Cached summaries are public content (headlines + analysis of public news)
create policy "summary_cache_public_read" on summary_cache
  for select using (true);

create policy "summary_cache_service_write" on summary_cache
  for insert with check (auth.role() = 'service_role');

-- ── DEDUP + CLASSIFICATION LOGS: service role only ──────────────────────────
create policy "dedup_log_service" on dedup_log
  for all using (auth.role() = 'service_role');

create policy "classification_log_service" on classification_log
  for all using (auth.role() = 'service_role');

-- ── USER PROFILES: users read/write their own row ───────────────────────────
create policy "user_profiles_own" on user_profiles
  for all using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── USER READS: users read/write their own rows ─────────────────────────────
create policy "user_reads_own" on user_reads
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── DIGEST SENDS: users read their own sends ────────────────────────────────
create policy "digest_sends_read_own" on digest_sends
  for select using (auth.uid() = user_id);

create policy "digest_sends_service_write" on digest_sends
  for insert with check (auth.role() = 'service_role');

-- ── WAITLIST: public insert, service role read ──────────────────────────────
create policy "waitlist_public_insert" on waitlist
  for insert with check (true);

create policy "waitlist_service_read" on waitlist
  for select using (auth.role() = 'service_role');
