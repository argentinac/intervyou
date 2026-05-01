import { supabase } from '../lib/supabase.js'
import express from 'express'

export const logsRouter = express.Router()

logsRouter.post('/latency', async (req, res) => {
  const { session_id, turn_number, t0_ms, t3_ms, t4_ms, t5_ms, t6_ms, t7_ms, language, interview_type,
          llm_cost_usd, llm_tokens_input, llm_tokens_output, llm_tokens_cache_read, llm_tokens_cache_write,
          tts_chars, tts_cost_usd } = req.body

  if (!session_id || turn_number == null) {
    return res.status(400).json({ error: 'session_id and turn_number are required' })
  }

  if (!supabase) return res.status(200).json({ ok: true, skipped: true })

  try {
    await supabase.from('latency_logs').insert({
      session_id,
      turn_number,
      t0_ms: t0_ms ?? null,
      t3_ms: t3_ms ?? null,
      t4_ms: t4_ms ?? null,
      t5_ms: t5_ms ?? null,
      t6_ms: t6_ms ?? null,
      t7_ms: t7_ms ?? null,
      language: language ?? null,
      interview_type: interview_type ?? null,
      llm_cost_usd: llm_cost_usd ?? null,
      llm_tokens_input: llm_tokens_input ?? null,
      llm_tokens_output: llm_tokens_output ?? null,
      llm_tokens_cache_read: llm_tokens_cache_read ?? null,
      llm_tokens_cache_write: llm_tokens_cache_write ?? null,
      tts_chars: tts_chars ?? null,
      tts_cost_usd: tts_cost_usd ?? null,
    })
    res.json({ ok: true })
  } catch (err) {
    console.error('Latency log error:', err)
    res.status(500).json({ error: err.message })
  }
})
