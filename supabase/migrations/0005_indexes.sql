-- NeuralForge Layer 0: Performance Indexes
-- Created AFTER schema and functions are in place.

-- ─── RAW ITEMS ──────────────────────────────────────────────────────────────
-- Pipeline processing queries
create index idx_raw_items_url_hash
  on raw_items(url_hash);

create index idx_raw_items_pipeline_status
  on raw_items(pipeline_status)
  where pipeline_status not in ('summarized', 'archived');  -- partial: only active items

create index idx_raw_items_cluster_id
  on raw_items(cluster_id)
  where cluster_id is not null;

create index idx_raw_items_ingested_at
  on raw_items(ingested_at desc);

create index idx_raw_items_published_at
  on raw_items(published_at desc);

create index idx_raw_items_source_id
  on raw_items(source_id);

-- L2 dedup: trigram index on normalized title (requires pg_trgm extension)
create index idx_raw_items_title_trgm
  on raw_items using gin(title_normalized gin_trgm_ops)
  where title_normalized is not null;

-- L3 dedup + semantic search: HNSW index on embedding
-- HNSW chosen over IVFFlat because:
-- - No rebuild needed when new items are inserted (IVFFlat degrades on new data)
-- - Better query-time performance for approximate nearest neighbor
-- - ef_construction=64 + m=16: good accuracy/speed balance for our volume
create index idx_raw_items_embedding
  on raw_items using hnsw(embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

-- ─── CLUSTERS ───────────────────────────────────────────────────────────────
-- Feed queries (ordered by priority_score + first_seen_at)
create index idx_clusters_priority_time
  on clusters(priority_score desc, first_seen_at desc)
  where priority_score >= 50 and summary_intermediate is not null;

create index idx_clusters_category
  on clusters(category);

create index idx_clusters_last_updated
  on clusters(last_updated_at desc);

create index idx_clusters_first_seen
  on clusters(first_seen_at desc);

-- L3 dedup + cluster-level semantic search
create index idx_clusters_embedding
  on clusters using hnsw(embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

-- ─── SUMMARY CACHE ──────────────────────────────────────────────────────────
-- Cache lookup: check before every LLM call
create index idx_summary_cache_lookup
  on summary_cache(cluster_id, cache_type, vertical_slug);

-- ─── USER READS ─────────────────────────────────────────────────────────────
-- Feed personalization: exclude already-read clusters
create index idx_user_reads_user_cluster
  on user_reads(user_id, cluster_id);

-- ─── CLASSIFICATION LOG ─────────────────────────────────────────────────────
-- Cost monitoring queries
create index idx_classification_log_created
  on classification_log(created_at desc);

create index idx_classification_log_method
  on classification_log(method, created_at desc);

-- ─── DEDUP LOG ──────────────────────────────────────────────────────────────
create index idx_dedup_log_item
  on dedup_log(item_id);

-- ─── DIGEST SENDS ───────────────────────────────────────────────────────────
create index idx_digest_sends_user
  on digest_sends(user_id, sent_at desc);
