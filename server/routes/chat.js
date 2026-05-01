import Anthropic from '@anthropic-ai/sdk'

const INJECTION_PATTERNS = [
  /ignore (all |previous |your |the )?instructions/i,
  /forget (everything|all|your instructions)/i,
  /you are now/i,
  /act as (a |an )?(?!candidate|applicant)/i,
  /pretend (you are|to be)/i,
  /new (persona|role|instructions)/i,
  /system prompt/i,
  /jailbreak/i,
  /DAN mode/i,
  /override (your )?instructions/i,
  /disregard (your )?instructions/i,
]

function sanitizeMessages(messages) {
  return messages.map((msg) => {
    if (msg.role !== 'user') return msg
    const flagged = INJECTION_PATTERNS.some((p) => p.test(msg.content))
    if (flagged) {
      return { ...msg, content: '[Candidate said something off-topic or attempted to change the interview context.]' }
    }
    return msg
  })
}

export async function chatRoute(req, res) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in .env' })

    // Client created per-request so it always reads the current env value
    const anthropic = new Anthropic({ apiKey })
    const { messages, system, max_tokens, model } = req.body
    const safeMessages = sanitizeMessages(messages)
    const allowedModels = ['claude-sonnet-4-6', 'claude-haiku-4-5-20251001']
    const resolvedModel = allowedModels.includes(model) ? model : 'claude-haiku-4-5-20251001'

    // Cache system prompt to avoid reprocessing on every turn
    const cachedSystem = [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }]

    // Cache conversation history up to the penultimate message so only the latest exchange is processed fresh
    const messagesWithCache = safeMessages.map((msg, i) => {
      if (i !== safeMessages.length - 2) return msg
      const text = typeof msg.content === 'string' ? msg.content : msg.content.map((c) => c.text).join('')
      return { ...msg, content: [{ type: 'text', text, cache_control: { type: 'ephemeral' } }] }
    })

    const t3 = Date.now()
    const response = await anthropic.messages.create({
      model: resolvedModel,
      max_tokens: max_tokens || 400,
      system: cachedSystem,
      messages: messagesWithCache,
    })
    const t4 = Date.now()

    if (!response.content?.[0]?.text) throw new Error('Empty response from Claude API')
    res.json({ text: response.content[0].text, t3, t4 })
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ error: err.message })
  }
}
