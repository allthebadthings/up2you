import { useEffect, useState } from 'react'
import { Button, Input, Card } from '../../components/ui'

type AiAgent = {
  id: string
  name: string
  systemPrompt: string
  temperature?: number
  maxTokens?: number
  language?: string
}

export default function AdminSettings() {
  const [loading, setLoading] = useState(true)
  const headers = {
    'x-admin-token': localStorage.getItem('admin_token') || '',
    'Content-Type': 'application/json'
  }

  const [provider, setProvider] = useState<'openai' | 'anthropic' | 'groq'>('openai')
  const [model, setModel] = useState('gpt-4o-mini')
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [tone, setTone] = useState<'neutral' | 'friendly' | 'luxury' | 'technical'>('neutral')
  const [language, setLanguage] = useState('en')
  const [maxLength, setMaxLength] = useState<number>(150)
  const [agents, setAgents] = useState<AiAgent[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/config/ai', { headers })
        const data = await res.json()
        const cfg = data?.config || {}
        setProvider(cfg.provider || 'openai')
        setModel(cfg.model || 'gpt-4o-mini')
        setIsActive(Boolean(data?.is_active))
        setTone(cfg.defaults?.tone || 'neutral')
        setLanguage(cfg.defaults?.language || 'en')
        setMaxLength(cfg.defaults?.maxLength || 150)
        setAgents(Array.isArray(cfg.agents) ? cfg.agents : [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const addAgent = () => {
    const id = Date.now().toString()
    setAgents([...agents, { id, name: 'New Agent', systemPrompt: 'Write concise, accurate descriptions.' }])
  }

  const updateAgent = (idx: number, patch: Partial<AiAgent>) => {
    const next = [...agents]
    next[idx] = { ...next[idx], ...patch }
    setAgents(next)
  }

  const removeAgent = (idx: number) => {
    const next = agents.filter((_, i) => i !== idx)
    setAgents(next)
  }

  const save = async () => {
    const config: any = {
      provider,
      model,
      defaults: { tone, language, maxLength },
      agents
    }
    if (apiKeyInput.trim()) {
      config.apiKey = apiKeyInput.trim()
    } else {
      config.apiKey = '****' // server will preserve existing key
    }
    const res = await fetch('/api/admin/config/ai', {
      method: 'POST',
      headers,
      body: JSON.stringify({ config, is_active: isActive })
    })
    const data = await res.json()
    if (data.error) {
      alert(data.error)
      return
    }
    alert('AI settings saved')
    setApiKeyInput('')
  }

  if (loading) return <div className="p-6">Loading settings...</div>

  return (
    <div className="space-y-6 p-2 sm:p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">AI Description Generation</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Provider</label>
            <select
              value={provider}
              onChange={e => setProvider(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic" disabled>Anthropic (soon)</option>
              <option value="groq" disabled>Groq (soon)</option>
            </select>
          </div>
          <Input label="Model" value={model} onChange={setModel} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="API Key"
            value={apiKeyInput}
            onChange={setApiKeyInput}
            placeholder="Enter to replace stored key"
          />
          <div className="flex items-center gap-2 mt-6">
            <input
              id="ai-active"
              type="checkbox"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
            />
            <label htmlFor="ai-active" className="text-sm text-gray-700 dark:text-gray-300">Active</label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tone</label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
            >
              <option value="neutral">Neutral</option>
              <option value="friendly">Friendly</option>
              <option value="luxury">Luxury</option>
              <option value="technical">Technical</option>
            </select>
          </div>
          <Input label="Language" value={language} onChange={setLanguage} />
          <Input label="Max Length (words)" type="number" value={String(maxLength)} onChange={(v) => setMaxLength(Number(v))} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Agents</label>
            <Button type="button" variant="secondary" onClick={addAgent}>Add Agent</Button>
          </div>
          {agents.length === 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">No agents configured.</div>
          )}
          {agents.map((agent, idx) => (
            <Card key={agent.id} className="p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input label="Name" value={agent.name} onChange={(v) => updateAgent(idx, { name: v })} />
                <Input label="Language (optional)" value={agent.language || ''} onChange={(v) => updateAgent(idx, { language: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Temperature" type="number" value={String(agent.temperature ?? '')} onChange={(v) => updateAgent(idx, { temperature: v ? Number(v) : undefined })} />
                  <Input label="Max Tokens" type="number" value={String(agent.maxTokens ?? '')} onChange={(v) => updateAgent(idx, { maxTokens: v ? Number(v) : undefined })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">System Prompt</label>
                <textarea
                  value={agent.systemPrompt}
                  onChange={(e) => updateAgent(idx, { systemPrompt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
                  rows={4}
                />
              </div>
              <div className="flex justify-end">
                <Button type="button" variant="primary" className="bg-red-600 hover:bg-red-700 focus:ring-red-500" onClick={() => removeAgent(idx)}>Remove</Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={save}>Save Settings</Button>
        </div>
      </Card>
    </div>
  )
}

