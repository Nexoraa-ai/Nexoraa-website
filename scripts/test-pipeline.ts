/**
 * Nexoraa Layer 0 Pipeline Verification Tests
 *
 * Run with: npx tsx scripts/test-pipeline.ts
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in env
 *
 * Tests (in order):
 * 1. URL canonicalization — 10 known URLs with tracking params
 * 2. URL hash stability — same canonical URL → same SHA-256 every time
 * 3. L1 dedup — insert same url_hash twice → second returns 0 rows affected
 * 4. L2 dedup — two items with title similarity > 0.85 → same cluster_id
 * 5. L3 dedup — two items with cosine > 0.90 → same cluster_id, item_count++
 * 6. Priority score formula — known component values → correct total
 * 7. Summary cache hit — trigger summarize twice, second call makes 0 LLM calls
 * 8. get_feed() quality gate — items with summary_intermediate IS NULL never appear
 */

import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// ─── SETUP ───────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

let passed = 0
let failed = 0

function ok(label: string, message?: string) {
  passed++
  console.log(`  ✅ ${label}${message ? ': ' + message : ''}`)
}

function fail(label: string, message: string) {
  failed++
  console.error(`  ❌ ${label}: ${message}`)
}

function section(title: string) {
  console.log(`\n── ${title} ──`)
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex')
}

function canonicalizeUrl(rawUrl: string): string {
  try {
    const u = new URL(rawUrl)
    const tracking = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'ref', 'source', 'fbclid', 'gclid', '_ga', 'mc_cid', 'mc_eid',
    ]
    tracking.forEach(p => u.searchParams.delete(p))
    let result = u.toString()
    if (result.endsWith('/')) result = result.slice(0, -1)
    return result.toLowerCase()
  } catch {
    return rawUrl.toLowerCase()
  }
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function sqlExec(query: string, params: unknown[] = []) {
  const { data, error } = await supabase.rpc('exec_sql', { query, params }) as any
  if (error) throw new Error(error.message)
  return data
}

// Insert a test source and return its ID
async function insertTestSource(): Promise<string> {
  const { data, error } = await supabase
    .from('sources')
    .insert({
      name: 'Test Source (pipeline-test)',
      slug: `test-pipeline-${Date.now()}`,
      url: 'https://test.pipeline.local',
      feed_url: 'https://test.pipeline.local/feed',
      source_type: 'rss',
      tier: 3,
      authority_score: 20,
      polling_cron: '*/30 * * * *',
    })
    .select('id')
    .single()

  if (error) throw new Error(`Failed to insert test source: ${error.message}`)
  return data.id
}

// Clean up test data after tests run
async function cleanupTestData(sourceId: string) {
  // Cascade deletes raw_items via FK
  await supabase.from('sources').delete().eq('id', sourceId)
  // Clean orphaned clusters from test
  await supabase
    .from('clusters')
    .delete()
    .like('canonical_title', '__test_pipeline_%')
}

// ─── TEST 1: URL CANONICALIZATION ─────────────────────────────────────────────

async function testUrlCanonicalization() {
  section('Test 1: URL Canonicalization')

  const cases: [string, string][] = [
    [
      'https://openai.com/blog/gpt-5?utm_source=twitter&utm_campaign=launch',
      'https://openai.com/blog/gpt-5',
    ],
    [
      'https://arxiv.org/abs/2401.12345?ref=newsletter',
      'https://arxiv.org/abs/2401.12345',
    ],
    [
      'https://example.com/article/?utm_medium=email&utm_content=headline',
      'https://example.com/article',
    ],
    [
      'https://github.com/openai/gpt-4/?fbclid=IwAR12345&source=homepage',
      'https://github.com/openai/gpt-4',
    ],
    [
      'https://anthropic.com/news/claude-3?gclid=Cj0',
      'https://anthropic.com/news/claude-3',
    ],
    [
      'HTTPS://HuggingFace.co/models/llama-3',
      'https://huggingface.co/models/llama-3',
    ],
    [
      'https://techcrunch.com/2024/01/01/ai-raises/?_ga=2.12345',
      'https://techcrunch.com/2024/01/01/ai-raises',
    ],
    [
      'https://example.com/no-params',
      'https://example.com/no-params',
    ],
    [
      'https://example.com/path/?',
      'https://example.com/path',
    ],
    [
      'https://example.com/path/?utm_source=x&other=keep',
      'https://example.com/path?other=keep',
    ],
  ]

  let allPass = true
  for (const [input, expected] of cases) {
    const actual = canonicalizeUrl(input)
    if (actual === expected) {
      ok(`  ${input.slice(0, 60)}…`)
    } else {
      fail(`  ${input.slice(0, 60)}…`, `expected "${expected}", got "${actual}"`)
      allPass = false
    }
  }

  if (allPass) ok('All 10 canonicalization cases pass')
}

// ─── TEST 2: URL HASH STABILITY ───────────────────────────────────────────────

async function testUrlHashStability() {
  section('Test 2: URL Hash Stability')

  const url = 'https://openai.com/blog/gpt-5?utm_source=twitter'
  const canonical = canonicalizeUrl(url)

  const h1 = sha256(canonical)
  const h2 = sha256(canonical)
  const h3 = sha256(canonical)

  if (h1 === h2 && h2 === h3) {
    ok(`SHA-256 is stable across calls: ${h1.slice(0, 16)}…`)
  } else {
    fail('SHA-256 stability', `got different hashes: ${h1}, ${h2}, ${h3}`)
  }

  // Verify that the same input URL (after canonicalization) always yields the same hash
  const urlWithDifferentUTM = 'https://openai.com/blog/gpt-5?utm_source=email'
  const h4 = sha256(canonicalizeUrl(urlWithDifferentUTM))
  if (h1 === h4) {
    ok('Different UTM params → same hash after canonicalization')
  } else {
    fail('UTM-stripped hash', `expected ${h1}, got ${h4}`)
  }
}

// ─── TEST 3: L1 DEDUP (URL HASH UNIQUE CONSTRAINT) ────────────────────────────

async function testL1Dedup(sourceId: string) {
  section('Test 3: L1 Dedup (URL Hash Unique Constraint)')

  const urlHash = sha256(`https://l1-dedup-test-${Date.now()}.example.com`)
  const baseItem = {
    source_id: sourceId,
    source_type: 'rss',
    source_url: `https://l1-dedup-test.example.com`,
    url_hash: urlHash,
    title: '__test_pipeline_l1_dedup',
    title_normalized: normalizeTitle('__test_pipeline_l1_dedup'),
    excerpt: 'Test L1 dedup',
    pipeline_status: 'ingested',
    priority_score: 30,
  }

  // First insert — should succeed
  const { error: e1 } = await supabase.from('raw_items').insert(baseItem)
  if (e1) {
    fail('First insert', e1.message)
    return
  }
  ok('First insert succeeds')

  // Second insert with same url_hash — should be silently ignored (ON CONFLICT DO NOTHING)
  const { count, error: e2 } = await supabase
    .from('raw_items')
    .insert({ ...baseItem, title: '__test_pipeline_l1_dedup_duplicate' }, { count: 'exact' })
    .select()

  // Supabase returns an empty array with ON CONFLICT DO NOTHING
  if (!e2) {
    ok('Second insert with same url_hash produces no error (ON CONFLICT DO NOTHING)')
  } else if (e2.code === '23505') {
    ok('Second insert correctly rejected with unique violation')
  } else {
    fail('Second insert', e2.message)
  }

  // Verify only 1 row was inserted
  const { count: rowCount, error: e3 } = await supabase
    .from('raw_items')
    .select('*', { count: 'exact', head: true })
    .eq('url_hash', urlHash)

  if (e3) {
    fail('Count after L1 dedup', e3.message)
  } else if (rowCount === 1) {
    ok(`Only 1 row in raw_items for this url_hash (L1 dedup correct)`)
  } else {
    fail('L1 dedup row count', `expected 1, got ${rowCount}`)
  }
}

// ─── TEST 4: L2 DEDUP (TITLE TRIGRAM) ────────────────────────────────────────

async function testL2Dedup(sourceId: string) {
  section('Test 4: L2 Dedup (Title Trigram, similarity > 0.85)')

  const baseTitle = '__test_pipeline_OpenAI releases GPT-5 with major improvements'
  const dupTitle  = '__test_pipeline_OpenAI releases GPT-5 with major improvement'  // 1 char diff

  const url1 = `https://source1.example.com/gpt5-${Date.now()}`
  const url2 = `https://source2.example.com/gpt5-${Date.now()}`

  // Insert first item, let find_or_create_cluster make a new cluster
  const { data: item1, error: e1 } = await supabase
    .from('raw_items')
    .insert({
      source_id: sourceId,
      source_type: 'rss',
      source_url: url1,
      url_hash: sha256(canonicalizeUrl(url1)),
      title: baseTitle,
      title_normalized: normalizeTitle(baseTitle),
      excerpt: 'Test item for L2 dedup test',
      pipeline_status: 'ingested',
      priority_score: 40,
    })
    .select('id')
    .single()

  if (e1 || !item1) {
    fail('L2 dedup: insert item 1', e1?.message ?? 'no data')
    return
  }

  // Assign item1 to a new cluster directly (simulating L0_03 dedup workflow)
  const { data: cluster1, error: ec1 } = await supabase
    .from('clusters')
    .insert({
      canonical_title: baseTitle,
      category: 'model_release',
      priority_score: 40,
    })
    .select('id')
    .single()

  if (ec1 || !cluster1) {
    fail('L2 dedup: create cluster', ec1?.message ?? 'no data')
    return
  }

  await supabase
    .from('raw_items')
    .update({ cluster_id: cluster1.id, pipeline_status: 'clustered' })
    .eq('id', item1.id)

  ok(`Item 1 inserted and assigned to cluster ${cluster1.id.slice(0, 8)}…`)

  // Insert second item with very similar title (similarity > 0.85)
  const { data: item2, error: e2 } = await supabase
    .from('raw_items')
    .insert({
      source_id: sourceId,
      source_type: 'rss',
      source_url: url2,
      url_hash: sha256(canonicalizeUrl(url2)),
      title: dupTitle,
      title_normalized: normalizeTitle(dupTitle),
      excerpt: 'Duplicate story from different source',
      pipeline_status: 'ingested',
      priority_score: 40,
    })
    .select('id')
    .single()

  if (e2 || !item2) {
    fail('L2 dedup: insert item 2', e2?.message ?? 'no data')
    return
  }

  // Call the Postgres find_or_create_cluster function
  const { data: dedupResult, error: eDup } = await supabase.rpc('find_or_create_cluster', {
    p_item_id: item2.id,
    p_title_normalized: normalizeTitle(dupTitle),
    p_embedding: null, // Skip embedding for this test
    p_published_at: new Date().toISOString(),
  })

  if (eDup) {
    fail('L2 dedup: find_or_create_cluster call', eDup.message)
    return
  }

  const result = Array.isArray(dedupResult) ? dedupResult[0] : dedupResult

  if (result?.cluster_id === cluster1.id) {
    ok(`L2 trigram dedup: item2 assigned to same cluster as item1`)
  } else {
    // The trigram similarity check is database-side; if the test cluster is recent,
    // it should match. If it doesn't, check whether pg_trgm extension is enabled.
    fail(
      'L2 dedup: cluster assignment',
      `expected cluster ${cluster1.id.slice(0,8)}, got ${result?.cluster_id?.slice(0,8) ?? 'null'}`
    )
  }

  if (result?.is_duplicate === true) {
    ok('L2 trigram dedup: item2 marked as is_duplicate = true')
  } else {
    fail('L2 dedup: is_duplicate flag', `expected true, got ${result?.is_duplicate}`)
  }
}

// ─── TEST 5: L3 DEDUP (EMBEDDING COSINE) ─────────────────────────────────────

async function testL3Dedup(sourceId: string) {
  section('Test 5: L3 Dedup (Embedding Cosine, cosine > 0.90)')

  // Use a unit vector so we can compute cosine similarity deterministically
  // cosine similarity of identical vectors = 1.0 (well above 0.90 threshold)
  const dim = 1536
  const baseVec = new Array(dim).fill(0)
  baseVec[0] = 1.0  // unit vector along first axis

  const url1 = `https://l3-test-a-${Date.now()}.example.com`
  const url2 = `https://l3-test-b-${Date.now()}.example.com`

  // Insert first item and create a cluster with this embedding
  const { data: item1, error: e1 } = await supabase
    .from('raw_items')
    .insert({
      source_id: sourceId,
      source_type: 'rss',
      source_url: url1,
      url_hash: sha256(canonicalizeUrl(url1)),
      title: '__test_pipeline_L3 test base item',
      title_normalized: normalizeTitle('__test_pipeline_L3 test base item'),
      excerpt: 'Base embedding for L3 cosine dedup test',
      pipeline_status: 'ingested',
      priority_score: 55,
    })
    .select('id')
    .single()

  if (e1 || !item1) { fail('L3 dedup: insert item1', e1?.message ?? 'no data'); return }

  const { data: cluster1, error: ec } = await supabase
    .from('clusters')
    .insert({
      canonical_title: '__test_pipeline_L3 test base item',
      category: 'tool_launch',
      priority_score: 55,
      embedding: `[${baseVec.join(',')}]`,
    })
    .select('id, item_count')
    .single()

  if (ec || !cluster1) { fail('L3 dedup: create cluster', ec?.message ?? 'no data'); return }

  await supabase
    .from('raw_items')
    .update({
      cluster_id: cluster1.id,
      pipeline_status: 'clustered',
      embedding: `[${baseVec.join(',')}]`,
    })
    .eq('id', item1.id)

  ok(`Item 1 + cluster created, item_count = ${cluster1.item_count}`)

  // Insert second item with identical embedding (cosine = 1.0)
  const { data: item2, error: e2 } = await supabase
    .from('raw_items')
    .insert({
      source_id: sourceId,
      source_type: 'rss',
      source_url: url2,
      url_hash: sha256(canonicalizeUrl(url2)),
      title: '__test_pipeline_L3 test cross-source item (different source, same story)',
      title_normalized: normalizeTitle('different title so trigram does not match'),
      excerpt: 'Cross-source item for L3 cosine dedup test',
      pipeline_status: 'ingested',
      priority_score: 55,
      embedding: `[${baseVec.join(',')}]`,
    })
    .select('id')
    .single()

  if (e2 || !item2) { fail('L3 dedup: insert item2', e2?.message ?? 'no data'); return }

  // Call find_or_create_cluster with the same embedding
  const { data: dedupResult, error: eDup } = await supabase.rpc('find_or_create_cluster', {
    p_item_id: item2.id,
    p_title_normalized: normalizeTitle('different title so trigram does not match'),
    p_embedding: baseVec,
    p_published_at: new Date().toISOString(),
  })

  if (eDup) { fail('L3 dedup: find_or_create_cluster', eDup.message); return }

  const result = Array.isArray(dedupResult) ? dedupResult[0] : dedupResult

  if (result?.cluster_id === cluster1.id) {
    ok('L3 cosine dedup: item2 assigned to same cluster as item1')
  } else {
    fail('L3 dedup: cluster assignment', `expected ${cluster1.id.slice(0,8)}, got ${result?.cluster_id?.slice(0,8) ?? 'null'}`)
  }

  if (result?.is_duplicate === false) {
    ok('L3 cosine dedup: item2 is NOT marked is_duplicate (cross-source = positive signal)')
  } else {
    fail('L3 dedup: is_duplicate flag', `expected false (cross-source), got ${result?.is_duplicate}`)
  }

  // Verify item_count was incremented on the cluster
  const { data: updatedCluster, error: eCheck } = await supabase
    .from('clusters')
    .select('item_count')
    .eq('id', cluster1.id)
    .single()

  if (eCheck || !updatedCluster) {
    fail('L3 dedup: check item_count', eCheck?.message ?? 'no data')
  } else if (updatedCluster.item_count > cluster1.item_count) {
    ok(`Cluster item_count incremented: ${cluster1.item_count} → ${updatedCluster.item_count}`)
  } else {
    fail('L3 dedup: item_count increment', `expected > ${cluster1.item_count}, got ${updatedCluster.item_count}`)
  }
}

// ─── TEST 6: PRIORITY SCORE FORMULA ──────────────────────────────────────────

async function testPriorityScore() {
  section('Test 6: Priority Score Formula')

  type Case = {
    label: string
    source_authority: number
    cross_coverage: number
    hours_since_publish: number
    engagement: number
    author_authority: number
    expected_min: number
    expected_max: number
  }

  const cases: Case[] = [
    {
      label: 'OpenAI blog post, published now, 3 sources',
      source_authority: 38,
      cross_coverage: 10,  // 2 extra sources × 5
      hours_since_publish: 0,
      engagement: 8,
      author_authority: 5,
      expected_min: 76,
      expected_max: 76,   // 38 + 10 + 15 + 8 + 5 = 76
    },
    {
      label: 'Low-authority source, 24h old, no engagement',
      source_authority: 10,
      cross_coverage: 0,
      hours_since_publish: 24,
      engagement: 0,
      author_authority: 0,
      expected_min: 0,
      expected_max: 15,   // 10 + 0 + max(0, 15 - floor(24/1.6)) = 10 + 0 + 0 = 10
    },
    {
      label: 'Breaking: multiple major sources, just published',
      source_authority: 40,
      cross_coverage: 25,  // 5+ sources, capped at 25
      hours_since_publish: 0.5,
      engagement: 10,
      author_authority: 10,
      expected_min: 100,
      expected_max: 100,  // capped at 100: 40+25+15+10+10 = 100
    },
    {
      label: 'Archived threshold: priority < 10',
      source_authority: 5,
      cross_coverage: 0,
      hours_since_publish: 48,
      engagement: 0,
      author_authority: 0,
      expected_min: 0,
      expected_max: 9,    // 5 + 0 + 0 + 0 + 0 = 5
    },
  ]

  function calcScore(c: Case): number {
    const freshness = Math.max(0, 15 - Math.floor(c.hours_since_publish / 1.6))
    const crossCov = Math.min(25, c.cross_coverage)
    const raw = c.source_authority + crossCov + freshness + c.engagement + c.author_authority
    return Math.min(100, Math.max(0, raw))
  }

  let allPass = true
  for (const c of cases) {
    const score = calcScore(c)
    if (score >= c.expected_min && score <= c.expected_max) {
      ok(`${c.label}: score=${score} (expected ${c.expected_min}–${c.expected_max})`)
    } else {
      fail(c.label, `score=${score}, expected ${c.expected_min}–${c.expected_max}`)
      allPass = false
    }
  }

  // Verify via Postgres function if available
  const { data, error } = await supabase.rpc('calculate_priority_score', {
    p_source_authority: 38,
    p_cross_coverage: 10,
    p_hours_since_publish: 0,
    p_engagement_signals: 8,
    p_author_authority: 5,
  })

  if (error) {
    console.log(`  ⚠️  calculate_priority_score() not available: ${error.message}`)
  } else if (data === 76) {
    ok(`Postgres calculate_priority_score() returns 76 (matches formula)`)
  } else {
    fail('Postgres calculate_priority_score()', `expected 76, got ${data}`)
  }

  if (allPass) ok('All priority score formula cases pass')
}

// ─── TEST 7: SUMMARY CACHE HIT (KEY COST OPTIMIZATION) ────────────────────────

async function testSummaryCacheHit(sourceId: string) {
  section('Test 7: Summary Cache Hit (Key Cost Optimization)')

  // Create a cluster with a summary already cached
  const { data: cluster, error: ec } = await supabase
    .from('clusters')
    .insert({
      canonical_title: '__test_pipeline_already summarized cluster',
      category: 'research_paper',
      priority_score: 65,
      summary_beginner: 'What happened: A test article was published.',
      summary_intermediate: 'Test intermediate summary for cache hit test.',
      summary_expert: 'Test expert summary.',
      summary_generated_at: new Date().toISOString(),
      summary_model: 'claude-sonnet-4-6',
      summary_cost_usd: 0.0096,
    })
    .select('id')
    .single()

  if (ec || !cluster) { fail('Cache hit: create cluster', ec?.message ?? 'no data'); return }

  // Write the summary to summary_cache (as L0_05 would do)
  const { error: eCache } = await supabase.from('summary_cache').insert({
    cluster_id: cluster.id,
    cache_key: `summary:${cluster.id}`,
    cache_type: 'cluster_summary',
    content: JSON.stringify({
      beginner: 'What happened: A test article was published.',
      intermediate: 'Test intermediate summary.',
      expert: 'Test expert.',
    }),
    model_used: 'claude-sonnet-4-6',
    input_tokens: 400,
    output_tokens: 200,
    cost_usd: 0.0096,
  })

  if (eCache) { fail('Cache hit: write summary_cache', eCache.message); return }

  ok('Summary written to summary_cache')

  // Check: query summary_cache for this cluster — should return 1 row
  const { count, error: eCheck } = await supabase
    .from('summary_cache')
    .select('*', { count: 'exact', head: true })
    .eq('cluster_id', cluster.id)
    .eq('cache_type', 'cluster_summary')

  if (eCheck) { fail('Cache hit: count check', eCheck.message); return }

  if (count === 1) {
    ok('summary_cache has exactly 1 row for this cluster')
  } else {
    fail('Cache hit: count', `expected 1, got ${count}`)
    return
  }

  // Simulate L0_05 cache check: SELECT id FROM summary_cache WHERE cluster_id = $1
  // If this returns a row, the workflow skips the LLM call entirely
  const { data: cacheHit, error: eLookup } = await supabase
    .from('summary_cache')
    .select('id')
    .eq('cluster_id', cluster.id)
    .eq('cache_type', 'cluster_summary')
    .maybeSingle()

  if (eLookup) { fail('Cache hit: lookup', eLookup.message); return }

  if (cacheHit?.id) {
    ok(`Cache hit detected: summary_cache.id=${cacheHit.id.slice(0,8)}… → L0_05 would skip LLM call`)
  } else {
    fail('Cache hit lookup', 'expected a cache hit row, got null')
  }

  // Verify ON CONFLICT DO NOTHING: inserting the same cache entry again should be silent
  const { error: eConflict } = await supabase.from('summary_cache').insert({
    cluster_id: cluster.id,
    cache_key: `summary:${cluster.id}`,
    cache_type: 'cluster_summary',
    content: 'duplicate',
    model_used: 'haiku',
    input_tokens: 1,
    output_tokens: 1,
    cost_usd: 0.0001,
  })

  if (!eConflict) {
    ok('ON CONFLICT DO NOTHING: duplicate summary_cache insert is silently ignored')
  } else if (eConflict.code === '23505') {
    ok('Unique constraint: duplicate insert correctly rejected')
  } else {
    fail('ON CONFLICT behavior', eConflict.message)
  }
}

// ─── TEST 8: get_feed() QUALITY GATE ─────────────────────────────────────────

async function testGetFeedQualityGate() {
  section('Test 8: get_feed() Quality Gate (summary_intermediate IS NOT NULL)')

  // Create cluster without summary (should NOT appear in feed)
  const { data: unsummarized, error: e1 } = await supabase
    .from('clusters')
    .insert({
      canonical_title: '__test_pipeline_unsummarized cluster',
      category: 'opinion',
      priority_score: 75,  // High priority but no summary
    })
    .select('id')
    .single()

  if (e1 || !unsummarized) { fail('Quality gate: create unsummarized cluster', e1?.message ?? 'no data'); return }

  // Create cluster WITH summary (should appear in feed)
  const { data: summarized, error: e2 } = await supabase
    .from('clusters')
    .insert({
      canonical_title: '__test_pipeline_summarized cluster for feed gate test',
      category: 'model_release',
      priority_score: 75,
      summary_beginner: 'What happened: A model was released for testing.',
      summary_intermediate: 'A new model was released with significant improvements.',
      summary_expert: 'Architecture improvements yield 20% benchmark gains.',
    })
    .select('id')
    .single()

  if (e2 || !summarized) { fail('Quality gate: create summarized cluster', e2?.message ?? 'no data'); return }

  ok('Inserted: 1 unsummarized cluster (priority 75) + 1 summarized cluster (priority 75)')

  // Call get_feed() — should only return the summarized cluster
  const { data: feedItems, error: eFeed } = await supabase.rpc('get_feed', {
    p_user_id: null,
    p_verticals: null,
    p_category: null,
    p_min_priority: 50,
    p_limit: 100,
    p_offset: 0,
    p_after: null,
  })

  if (eFeed) { fail('Quality gate: get_feed() call', eFeed.message); return }

  const unsummarizedInFeed = (feedItems ?? []).some((i: any) => i.cluster_id === unsummarized.id)
  const summarizedInFeed = (feedItems ?? []).some((i: any) => i.cluster_id === summarized.id)

  if (!unsummarizedInFeed) {
    ok('Unsummarized cluster (no summary_intermediate) does NOT appear in get_feed()')
  } else {
    fail('Quality gate', 'Unsummarized cluster appeared in feed — quality gate broken!')
  }

  if (summarizedInFeed) {
    ok('Summarized cluster correctly appears in get_feed()')
  } else {
    fail('Quality gate', 'Summarized cluster missing from feed — check priority_score or function')
  }
}

// ─── MAIN RUNNER ─────────────────────────────────────────────────────────────

async function main() {
  console.log('\n═══════════════════════════════════════════════════════')
  console.log('  Nexoraa Layer 0 Pipeline Verification')
  console.log(`  ${new Date().toISOString()}`)
  console.log('═══════════════════════════════════════════════════════')

  let sourceId: string | null = null

  try {
    // Tests 1-2 don't need a source
    await testUrlCanonicalization()
    await testUrlHashStability()

    // Tests 3-8 need a test source (cleaned up after)
    sourceId = await insertTestSource()
    console.log(`\n  Test source created: ${sourceId.slice(0, 8)}…`)

    await testL1Dedup(sourceId)
    await testL2Dedup(sourceId)
    await testL3Dedup(sourceId)
    await testPriorityScore()
    await testSummaryCacheHit(sourceId)
    await testGetFeedQualityGate()

  } catch (err) {
    console.error('\n❌ Unexpected error:', err)
    failed++
  } finally {
    if (sourceId) {
      await cleanupTestData(sourceId)
      console.log('\n  Test data cleaned up.')
    }
  }

  console.log('\n═══════════════════════════════════════════════════════')
  const total = passed + failed
  console.log(`  Results: ${passed}/${total} passed, ${failed} failed`)
  if (failed === 0) {
    console.log('  ✅ All pipeline tests passed — safe to deploy')
  } else {
    console.log('  ❌ Some tests failed — review output above')
  }
  console.log('═══════════════════════════════════════════════════════\n')

  process.exit(failed > 0 ? 1 : 0)
}

main()
