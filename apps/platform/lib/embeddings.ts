import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// Embed title + excerpt (NOT full_text — ~10x cheaper, same dedup accuracy)
// text-embedding-3-small: 1536d, $0.00002/1K tokens
// At ~150 tokens per item: $0.000003 per embedding = ~$0.30/mo at 500 items/day
export async function embedText(title: string, excerpt?: string): Promise<number[]> {
  const input = excerpt
    ? `${title} ${excerpt}`.slice(0, 2000)  // cap at ~500 tokens
    : title

  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input,
    dimensions: 1536,
  })

  return response.data[0].embedding
}

// Format embedding array as Postgres vector literal for raw SQL inserts
export function formatPgVector(embedding: number[]): string {
  return `[${embedding.join(',')}]`
}
