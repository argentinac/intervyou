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

    const anthropic = new Anthropic({ apiKey })
    const { messages, system, max_tokens, model, stream: doStream } = req.body
    const safeMessages = sanitizeMessages(messages)
    const allowedModels = ['claude-sonnet-4-6', 'claude-haiku-4-5-20251001']
    const resolvedModel = allowedModels.includes(model) ? model : 'claude-sonnet-4-6'

    if (doStream) {
      res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' })

      const t3 = Date.now()
      let t4Sent = false

      const stream = anthropic.messages.stream({
        model: resolvedModel,
        max_tokens: max_tokens || 1024,
        system,
        messages: safeMessages,
      })

      stream.on('text', (text) => {
        if (!t4Sent) {
          t4Sent = true
          res.write(`data: ${JSON.stringify({ type: 'ttft', t3, t4: Date.now() })}\n\n`)
        }
        res.write(`data: ${JSON.stringify({ type: 'token', text })}\n\n`)
      })

      stream.on('finalMessage', () => {
        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
        res.end()
      })

      stream.on('error', (err) => {
        console.error('Stream error:', err)
        try { res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`); res.end() } catch {}
      })

      req.on('close', () => { try { stream.abort() } catch {} })
      return
    }

    // Non-streaming path (feedback, interrupt, closing)
    const t3 = Date.now()
    const response = await anthropic.messages.create({
      model: resolvedModel,
      max_tokens: max_tokens || 1024,
      system,
      messages: safeMessages,
    })
    const t4 = Date.now()

    if (!response.content?.[0]?.text) throw new Error('Empty response from Claude API')
    res.json({ text: response.content[0].text, t3, t4 })
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ error: err.message })
  }
}
