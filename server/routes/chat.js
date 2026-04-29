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
    const resolvedModel = allowedModels.includes(model) ? model : 'claude-sonnet-4-6'

    const response = await anthropic.messages.create({
      model: resolvedModel,
      max_tokens: max_tokens || 1024,
      system,
      messages: safeMessages,
    })

    if (!response.content?.[0]?.text) throw new Error('Empty response from Claude API')
    res.json({ text: response.content[0].text })
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ error: err.message })
  }
}
