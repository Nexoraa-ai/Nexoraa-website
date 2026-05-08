-- NeuralForge Layer 0: Day-1 MVP Sources (20 sources)
-- Week 1: all free RSS (11 sources)
-- Week 2: add Apify X (1 paid source)
-- Week 3: Substack newsletters + YouTube RSS (6 sources)
-- Week 4: India-specific (2 sources)
--
-- authority_score scale: 0-40
-- OpenAI/Anthropic/Google primary blogs = 38-40 (highest authority)
-- Tier 2 lab blogs = 28-35
-- Tier 3 community/social = 15-22
-- Meta aggregators = 10-18 (used for cross-validation, not primary signal)

insert into sources (name, slug, url, feed_url, source_type, tier, authority_score, polling_cron, region) values

-- ── TIER 1: Primary Sources (Week 1) ───────────────────────────────────────
(
  'arXiv cs.AI',
  'arxiv-csai',
  'https://arxiv.org/list/cs.AI/recent',
  'https://rss.arxiv.org/rss/cs.AI',
  'rss', 1, 35,
  '0 */4 * * *',  -- every 4 hours (arXiv publishes in batches)
  'global'
),
(
  'arXiv cs.LG',
  'arxiv-cslg',
  'https://arxiv.org/list/cs.LG/recent',
  'https://rss.arxiv.org/rss/cs.LG',
  'rss', 1, 35,
  '0 */4 * * *',
  'global'
),
(
  'Hacker News',
  'hackernews',
  'https://news.ycombinator.com',
  'https://hnrss.org/newest?q=AI+OR+LLM+OR+claude+OR+openai+OR+gemini&points=10',
  'rss', 1, 30,
  '*/15 * * * *',  -- 15-min polling (HN moves fast)
  'global'
),
(
  'HuggingFace Daily Papers',
  'huggingface-papers',
  'https://huggingface.co/papers',
  'https://huggingface.co/papers.rss',
  'rss', 1, 38,
  '0 */2 * * *',
  'global'
),
(
  'Product Hunt AI',
  'producthunt-ai',
  'https://www.producthunt.com/topics/artificial-intelligence',
  'https://www.producthunt.com/feed?category=artificial-intelligence',
  'rss', 1, 22,
  '0 */3 * * *',
  'global'
),

-- ── TIER 2: Lab Blogs (Week 1) ─────────────────────────────────────────────
(
  'OpenAI Blog',
  'openai-blog',
  'https://openai.com/news',
  'https://openai.com/news.rss',
  'rss', 2, 40,
  '*/30 * * * *',
  'global'
),
(
  'Anthropic Blog',
  'anthropic-blog',
  'https://www.anthropic.com/news',
  'https://www.anthropic.com/rss.xml',
  'rss', 2, 40,
  '*/30 * * * *',
  'global'
),
(
  'Google DeepMind Blog',
  'deepmind-blog',
  'https://deepmind.google/discover/blog',
  'https://deepmind.google/discover/blog/rss.xml',
  'rss', 2, 38,
  '*/30 * * * *',
  'global'
),
(
  'Google AI Blog',
  'google-ai-blog',
  'https://blog.google/technology/ai',
  'https://blog.google/technology/ai/rss',
  'rss', 2, 36,
  '*/30 * * * *',
  'global'
),
(
  'Meta AI Blog',
  'meta-ai-blog',
  'https://ai.meta.com/blog',
  'https://ai.meta.com/blog/feed',
  'rss', 2, 36,
  '*/30 * * * *',
  'global'
),

-- ── TIER 3: Community / Social (Week 1 - free JSON endpoints) ──────────────
(
  'Reddit r/MachineLearning',
  'reddit-machinelearning',
  'https://www.reddit.com/r/MachineLearning',
  'https://www.reddit.com/r/MachineLearning/new.json?limit=25',
  'json_undoc', 3, 20,
  '*/20 * * * *',
  'global'
),
(
  'Reddit r/LocalLLaMA',
  'reddit-localllama',
  'https://www.reddit.com/r/LocalLLaMA',
  'https://www.reddit.com/r/LocalLLaMA/new.json?limit=25',
  'json_undoc', 3, 22,
  '*/20 * * * *',
  'global'
),

-- ── TIER 2: Additional Lab Blogs (Week 2) ──────────────────────────────────
(
  'Microsoft Research Blog',
  'microsoft-research',
  'https://www.microsoft.com/en-us/research/blog',
  'https://www.microsoft.com/en-us/research/feed',
  'rss', 2, 32,
  '0 */2 * * *',
  'global'
),
(
  'NVIDIA AI Blog',
  'nvidia-ai-blog',
  'https://blogs.nvidia.com/blog/category/artificial-intelligence',
  'https://blogs.nvidia.com/blog/category/artificial-intelligence/feed',
  'rss', 2, 30,
  '0 */4 * * *',
  'global'
),
(
  'Mistral AI Blog',
  'mistral-blog',
  'https://mistral.ai/news',
  'https://mistral.ai/news/rss.xml',
  'rss', 2, 34,
  '*/30 * * * *',
  'global'
),

-- ── TIER 5: Meta Aggregators (Week 2, for cross-validation) ────────────────
(
  'TLDR AI Newsletter',
  'tldr-ai',
  'https://tldr.tech/ai',
  'https://tldr.tech/ai/rss',
  'rss', 5, 18,
  '0 8 * * *',  -- daily at 8am UTC (TLDR publishes once daily)
  'global'
),
(
  'The Batch (DeepLearning.AI)',
  'the-batch',
  'https://www.deeplearning.ai/the-batch',
  'https://www.deeplearning.ai/the-batch/feed',
  'rss', 5, 20,
  '0 9 * * 3',  -- weekly on Wednesdays
  'global'
),
(
  'Smol AI News',
  'smol-ai-news',
  'https://smol.ai/news',
  'https://smol.ai/news/rss.xml',
  'rss', 5, 15,
  '0 */6 * * *',
  'global'
),

-- ── TIER 4: India-Specific (Week 4) ────────────────────────────────────────
(
  'AIM (Analytics India Magazine)',
  'aim-india',
  'https://analyticsindiamag.com',
  'https://analyticsindiamag.com/feed',
  'rss', 4, 24,
  '0 */4 * * *',
  'india'
),
(
  'Inc42 Technology',
  'inc42-tech',
  'https://inc42.com/category/features/technology',
  'https://inc42.com/feed/?cat=technology',
  'rss', 4, 22,
  '0 */4 * * *',
  'india'
);

-- Verify seed data
do $$
begin
  if (select count(*) from sources) < 20 then
    raise exception 'Expected at least 20 sources, found %', (select count(*) from sources);
  end if;
  raise notice 'Seed successful: % sources loaded', (select count(*) from sources);
end;
$$;
