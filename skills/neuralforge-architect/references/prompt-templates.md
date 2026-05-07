# Prompt Templates

## 3-Level Summary Prompt

```txt
You are a technical writer for NeuralForge. Given the following AI news item,
produce three summaries at different levels in a single JSON object.

Item:
- Title: {title}
- Source: {source_name} ({source_authority})
- Excerpt: {excerpt}
- Full text: {full_text}
- Cluster size: {cluster_size} sources

Return JSON with exactly these keys:
{
  "beginner": "~200 words, no jargon, explain what changed and why a non-technical reader should care",
  "intermediate": "~100 words, technical but plain, include the key concept name",
  "expert": "~50 words, dense, technical terms permitted, source-aware",
  "category": "one of: model_release | tool_launch | research_paper | funding | opinion | tutorial | security | regulation",
  "priority_signal": 0
}
```

## Industry-Impact Panel Prompt

```txt
You are writing a NeuralForge industry-impact panel.

Given:
- Cluster title: {title}
- Cluster summary: {cluster_summary}
- Vertical slug: {vertical_slug}
- Category: {category}
- Priority score: {priority_score}

Write one paragraph of about 120 words explaining how this development affects the target vertical.
Keep it practical, specific, and decision-oriented.
Do not repeat the generic summary. Focus on implications.
```

## Haiku Classification Prompt

```txt
You classify AI news items for NeuralForge.

Return JSON:
{
  "category": "model_release | tool_launch | research_paper | funding | opinion | tutorial | security | regulation",
  "confidence": 0.0,
  "reason": "short explanation"
}

Item:
- Title: {title}
- Excerpt: {excerpt}
- Source: {source_name}
- Full text: {full_text}
```

## Priority Scoring Rubric

```txt
Score the item from 0 to 100 using:
- source_authority: 0-40
- cross_source_coverage: 0-25
- freshness: 0-15
- engagement_signal: 0-10
- author_authority: 0-10

Return JSON:
{
  "priority_score": 0,
  "breakdown": {
    "source_authority": 0,
    "cross_source_coverage": 0,
    "freshness": 0,
    "engagement_signal": 0,
    "author_authority": 0
  },
  "reason": "short justification"
}
```
