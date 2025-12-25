export interface AiAgent {
  id: string
  name: string
  systemPrompt: string
  temperature?: number
  maxTokens?: number
  language?: string
}

export interface AiDefaults {
  tone?: 'neutral' | 'friendly' | 'luxury' | 'technical'
  language?: string
  maxLength?: number
}

export interface AiConfig {
  provider: 'openai' | 'anthropic' | 'groq'
  apiKey: string
  model: string
  defaults?: AiDefaults
  agents?: AiAgent[]
}

export const validateAiConfig = (raw: any): AiConfig => {
  const errors: string[] = []
  const provider = raw?.provider
  const apiKey = raw?.apiKey
  const model = raw?.model
  const defaults = raw?.defaults
  const agents = raw?.agents

  if (!provider || !['openai', 'anthropic', 'groq'].includes(provider)) {
    errors.push('provider must be one of: openai, anthropic, groq')
  }
  if (!apiKey || typeof apiKey !== 'string') {
    errors.push('apiKey is required')
  }
  if (!model || typeof model !== 'string') {
    errors.push('model is required')
  }

  if (defaults) {
    if (defaults.tone && !['neutral', 'friendly', 'luxury', 'technical'].includes(defaults.tone)) {
      errors.push('defaults.tone invalid')
    }
    if (defaults.language && typeof defaults.language !== 'string') {
      errors.push('defaults.language must be string')
    }
    if (defaults.maxLength !== undefined && (typeof defaults.maxLength !== 'number' || defaults.maxLength <= 0)) {
      errors.push('defaults.maxLength must be a positive number')
    }
  }

  if (agents) {
    if (!Array.isArray(agents)) {
      errors.push('agents must be an array')
    } else {
      agents.forEach((a, i) => {
        if (!a || typeof a !== 'object') {
          errors.push(`agents[${i}] must be an object`)
          return
        }
        if (!a.id || typeof a.id !== 'string') errors.push(`agents[${i}].id is required`)
        if (!a.name || typeof a.name !== 'string') errors.push(`agents[${i}].name is required`)
        if (!a.systemPrompt || typeof a.systemPrompt !== 'string') errors.push(`agents[${i}].systemPrompt is required`)
        if (a.temperature !== undefined && (typeof a.temperature !== 'number' || a.temperature < 0 || a.temperature > 2)) {
          errors.push(`agents[${i}].temperature must be number in [0,2]`)
        }
        if (a.maxTokens !== undefined && (typeof a.maxTokens !== 'number' || a.maxTokens <= 0)) {
          errors.push(`agents[${i}].maxTokens must be positive number`)
        }
        if (a.language !== undefined && typeof a.language !== 'string') {
          errors.push(`agents[${i}].language must be string`)
        }
      })
    }
  }

  if (errors.length) {
    const err = new Error(`Invalid AI config: ${errors.join('; ')}`)
    ;(err as any).status = 400
    throw err
  }

  return {
    provider,
    apiKey,
    model,
    defaults: defaults || { tone: 'neutral', language: 'en', maxLength: 150 },
    agents: Array.isArray(agents) ? agents : []
  }
}

interface ProductInput {
  id: string
  name: string
  price?: number
  description?: string
  stock?: number
  images?: string[]
  is_bundle?: boolean
  min_price?: number
  category?: string
  sku?: string
  metal_type?: string
  gemstone?: string
  weight?: string | number
}

interface GenerateOptions {
  agentId?: string
  tone?: 'neutral' | 'friendly' | 'luxury' | 'technical'
  language?: string
  keywords?: string[]
  maxLength?: number
}

const clampLength = (text: string, limit: number) => {
  const cleaned = text.replace(/\s+/g, ' ').replace(/<[^>]*>/g, '').trim()
  if (cleaned.length <= limit) return cleaned
  return cleaned.slice(0, limit).replace(/\s+\S*$/, '') // cut at word boundary
}

export const generateProductDescription = async (
  product: ProductInput,
  options: GenerateOptions,
  aiConfig: AiConfig | null
): Promise<string> => {
  const tone = options.tone || aiConfig?.defaults?.tone || 'neutral'
  const language = options.language || aiConfig?.defaults?.language || 'en'
  const maxLength = options.maxLength || aiConfig?.defaults?.maxLength || 150

  const factLines = [
    `Name: ${product.name}`,
    product.category ? `Category: ${product.category}` : null,
    product.is_bundle ? `Type: Bundle` : null,
    product.metal_type ? `Metal: ${product.metal_type}` : null,
    product.gemstone ? `Gemstone: ${product.gemstone}` : null,
    product.weight ? `Weight: ${product.weight}` : null,
    product.sku ? `SKU: ${product.sku}` : null,
    product.price !== undefined ? `Price: ${product.price}` : null,
    product.min_price !== undefined ? `Min Price: ${product.min_price}` : null,
    product.stock !== undefined ? `Stock: ${product.stock}` : null,
    product.images && product.images.length ? `Images: ${product.images.length}` : null,
  ].filter(Boolean) as string[]

  const keywordLine = options.keywords && options.keywords.length
    ? `Keywords: ${options.keywords.join(', ')}`
    : ''

  const systemPrompt =
    (aiConfig?.agents?.find(a => a.id === options.agentId)?.systemPrompt) ||
    'You write concise, accurate, SEO-friendly product descriptions. Avoid hallucinations, avoid brand claims, avoid HTML. Keep to the requested language and tone.'

  const userPrompt = [
    `Language: ${language}`,
    `Tone: ${tone}`,
    `Target length: ~${maxLength} words`,
    ...factLines,
    keywordLine
  ].filter(Boolean).join('\n')

  if (!aiConfig || !aiConfig.apiKey) {
    const base = `${product.name}${product.category ? ` (${product.category})` : ''} — a thoughtfully crafted item described in a ${tone} tone.`
    return clampLength(base, maxLength * 8) // approximate characters; fallback keeps short
  }

  if (aiConfig.provider !== 'openai') {
    throw new Error(`Provider ${aiConfig.provider} not supported yet`)
  }

  const body = {
    model: aiConfig.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: (aiConfig.agents?.find(a => a.id === options.agentId)?.temperature) ?? 0.7,
    max_tokens: (aiConfig.agents?.find(a => a.id === options.agentId)?.maxTokens) ?? 512
  }

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${aiConfig.apiKey}`
    },
    body: JSON.stringify(body)
  })

  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`AI provider error: ${resp.status} ${text}`)
  }

  const json = await resp.json()
  const content = json?.choices?.[0]?.message?.content || ''
  return clampLength(content, maxLength * 8)
}
