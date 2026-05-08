-- NeuralForge Layer 0: Postgres Functions
-- These are called by n8n workflows and the Next.js API.

-- ─── CANONICALIZE URL ───────────────────────────────────────────────────────
-- Called in n8n Code node before SHA-256 hash computation.
-- Strips UTM params, tracking tokens, trailing slash, lowercases.
create or replace function canonicalize_url(raw_url text)
returns text
language plpgsql
immutable
as $$
declare
  cleaned text;
begin
  if raw_url is null or raw_url = '' then
    return null;
  end if;

  cleaned := raw_url;

  -- Strip common tracking query parameters
  cleaned := regexp_replace(cleaned,
    '[?&](utm_source|utm_medium|utm_campaign|utm_term|utm_content|ref|source|fbclid|gclid|_ga|mc_cid|mc_eid)=[^&]*',
    '', 'gi');

  -- Clean up dangling ? or & after stripping params
  cleaned := regexp_replace(cleaned, '[?&]+$', '');
  cleaned := regexp_replace(cleaned, '\?&', '?');

  -- Remove trailing slash
  cleaned := regexp_replace(cleaned, '/$', '');

  -- Lowercase the whole URL (scheme + host are case-insensitive)
  cleaned := lower(cleaned);

  return cleaned;
exception when others then
  return lower(raw_url);
end;
$$;

-- ─── NORMALIZE TITLE ────────────────────────────────────────────────────────
-- Used for L2 trigram dedup: lowercase + strip punctuation + collapse whitespace
create or replace function normalize_title(raw_title text)
returns text
language plpgsql
immutable
as $$
begin
  if raw_title is null then return null; end if;
  return trim(
    regexp_replace(
      regexp_replace(lower(raw_title), '[^\w\s]', ' ', 'g'),
      '\s+', ' ', 'g'
    )
  );
end;
$$;

-- ─── FIND OR CREATE CLUSTER ─────────────────────────────────────────────────
-- Core data quality function. Called by n8n after embedding is stored.
-- Implements L2 (trigram) and L3 (cosine) dedup, then assigns cluster.
-- Returns: (is_duplicate, cluster_id, dedup_method)
--
-- NOTE on L2 vs L3 distinction:
-- - L2 title trigram match → mark as duplicate (same article re-posted)
-- - L3 embedding cosine match → same story from different source (NOT a duplicate;
--   boosts cluster.item_count which raises score_cross_coverage component)
create or replace function find_or_create_cluster(
  p_item_id          uuid,
  p_title_normalized text,
  p_embedding        vector(1536),
  p_published_at     timestamptz
)
returns table(is_duplicate boolean, cluster_id uuid, dedup_method text)
language plpgsql
as $$
declare
  v_cluster_id       uuid;
  v_matched_item_id  uuid;
  v_similarity       numeric;
  v_dedup_method     text := 'new_cluster';
  v_is_dup           boolean := false;
  v_item_title       text;
  v_item_priority    int;
  v_item_region      text;
begin
  -- Fetch item data for cluster creation fallback
  select title, priority_score, region_relevance
  into v_item_title, v_item_priority, v_item_region
  from raw_items where id = p_item_id;

  -- ── L2: Title trigram similarity (7-day window) ──────────────────────────
  -- Catches same article re-posted with identical/near-identical titles
  if p_title_normalized is not null then
    select ri.cluster_id, similarity(ri.title_normalized, p_title_normalized), ri.id
    into v_cluster_id, v_similarity, v_matched_item_id
    from raw_items ri
    where ri.id != p_item_id
      and ri.ingested_at > now() - interval '7 days'
      and ri.is_duplicate = false
      and ri.cluster_id is not null
      and ri.title_normalized is not null
      and similarity(ri.title_normalized, p_title_normalized) > 0.85
    order by similarity(ri.title_normalized, p_title_normalized) desc
    limit 1;

    if v_cluster_id is not null then
      v_dedup_method := 'title_trigram';
      v_is_dup := true;
      insert into dedup_log(item_id, method, matched_id, similarity)
      values (p_item_id, 'title_trigram', v_matched_item_id, v_similarity);
    end if;
  end if;

  -- ── L3: Embedding cosine similarity (14-day window) ─────────────────────
  -- Catches same story covered by different sources (cross-source coverage)
  if v_cluster_id is null and p_embedding is not null then
    select c.id, 1 - (c.embedding <=> p_embedding)
    into v_cluster_id, v_similarity
    from clusters c
    where c.last_updated_at > now() - interval '14 days'
      and c.embedding is not null
      and 1 - (c.embedding <=> p_embedding) > 0.90
    order by c.embedding <=> p_embedding
    limit 1;

    if v_cluster_id is not null then
      v_dedup_method := 'embedding_cosine';
      -- Cross-source: boost item_count (this raises score_cross_coverage)
      update clusters
      set item_count = item_count + 1,
          last_updated_at = now()
      where id = v_cluster_id;
    end if;
  end if;

  -- ── Create new cluster if no match found ─────────────────────────────────
  if v_cluster_id is null then
    insert into clusters(
      canonical_title, priority_score, region_relevance,
      category, embedding
    )
    select
      v_item_title, v_item_priority, v_item_region,
      coalesce(ri.category, 'opinion'), p_embedding
    from raw_items ri where ri.id = p_item_id
    returning id into v_cluster_id;
  end if;

  -- ── Update item with cluster assignment ──────────────────────────────────
  update raw_items
  set cluster_id = v_cluster_id,
      is_duplicate = v_is_dup,
      pipeline_status = 'clustered'
  where id = p_item_id;

  return query select v_is_dup, v_cluster_id, v_dedup_method;
end;
$$;

-- ─── CALCULATE PRIORITY SCORE ───────────────────────────────────────────────
-- Called in n8n Code node after classification.
-- All 5 components stored individually in raw_items for audit + ML.
create or replace function calculate_priority_score(
  p_source_authority    int,    -- 0-40: from sources.authority_score
  p_cross_coverage      int,    -- 0-25: min(25, cluster.item_count * 5)
  p_hours_since_publish float8, -- for freshness decay
  p_engagement_signals  int,    -- 0-10: HN points, GH stars delta, Reddit upvotes
  p_author_authority    int     -- 0-10: known author registry score
)
returns int
language plpgsql
immutable
as $$
declare
  freshness int;
begin
  -- Freshness: 15pts at 0h, decays ~1.6pts/hour, 0 at 9.4h+
  freshness := greatest(0, 15 - floor(p_hours_since_publish / 1.6)::int);

  return least(100, greatest(0,
    coalesce(p_source_authority, 0) +
    coalesce(p_cross_coverage, 0) +
    freshness +
    coalesce(p_engagement_signals, 0) +
    coalesce(p_author_authority, 0)
  ));
end;
$$;

-- ─── GET FEED ────────────────────────────────────────────────────────────────
-- Used by Next.js API to serve the personalized AIPulse feed.
-- Quality gate: summary_intermediate IS NOT NULL ensures no incomplete items.
create or replace function get_feed(
  p_user_id      uuid      default null,
  p_verticals    text[]    default null,
  p_category     text      default null,
  p_min_priority int       default 50,
  p_limit        int       default 20,
  p_offset       int       default 0,
  p_after        timestamptz default null
)
returns table(
  cluster_id           uuid,
  canonical_title      text,
  category             text,
  priority_score       int,
  item_count           int,
  first_seen_at        timestamptz,
  summary_beginner     text,
  summary_intermediate text,
  summary_expert       text,
  vertical_panels      jsonb,
  region_relevance     text
)
language sql
stable
as $$
  select
    c.id,
    c.canonical_title,
    c.category,
    c.priority_score,
    c.item_count,
    c.first_seen_at,
    c.summary_beginner,
    c.summary_intermediate,
    c.summary_expert,
    c.vertical_panels,
    c.region_relevance
  from clusters c
  where c.priority_score >= p_min_priority
    and c.summary_intermediate is not null        -- final quality gate: no unsummarized items
    and (p_category is null or c.category = p_category)
    and (p_after is null or c.first_seen_at < p_after)
    and (p_user_id is null or not exists (
      select 1 from user_reads ur
      where ur.user_id = p_user_id
        and ur.cluster_id = c.id
    ))
  order by c.priority_score desc, c.first_seen_at desc
  limit p_limit
  offset p_offset;
$$;

-- ─── UPDATE USER STREAK ──────────────────────────────────────────────────────
-- Called by Next.js API on each active user session.
create or replace function update_user_streak(p_user_id uuid)
returns void
language plpgsql
as $$
declare
  v_last_date date;
  v_today     date := current_date;
begin
  select last_active_date into v_last_date
  from user_profiles where id = p_user_id;

  if v_last_date is null or v_last_date < v_today - interval '1 day' then
    -- Streak broken (more than 1 day gap) or first time
    update user_profiles
    set current_streak = case
          when v_last_date = v_today - 1 then current_streak + 1
          else 1
        end,
        longest_streak = greatest(longest_streak,
          case when v_last_date = v_today - 1 then current_streak + 1 else 1 end),
        last_active_date = v_today,
        updated_at = now()
    where id = p_user_id;
  end if;
end;
$$;
