import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'
import express from 'express'

export const interviewsRouter = express.Router()

// Save completed interview + feedback
interviewsRouter.post('/', requireAuth, async (req, res) => {
  const { config, transcript, feedback, durationSeconds } = req.body
  const userId = req.user.id

  try {
    const { data: interview, error: iErr } = await supabase
      .from('interviews')
      .insert({
        user_id:          userId,
        type:             config.interviewType?.toLowerCase() ?? 'hr',
        length:           'standard',
        config,
        status:           'completed',
        duration_seconds: durationSeconds ?? null,
        completed_at:     new Date().toISOString(),
      })
      .select('id')
      .single()

    if (iErr) throw iErr

    if (transcript) {
      await supabase.from('interview_transcripts').insert({
        interview_id: interview.id,
        user_id:      userId,
        messages:     transcript,
      })
    }

    if (feedback && !feedback.notEnoughData && !feedback.parseError) {
      await supabase.from('interview_feedback').insert({
        interview_id: interview.id,
        user_id:      userId,
        score:        feedback.score,
        headline:     feedback.headline,
        went_well:    feedback.wentWell,
        to_improve:   feedback.toImprove,
        suggestions:  feedback.suggestions,
        raw_response: feedback,
      })
    }

    res.json({ id: interview.id })
  } catch (err) {
    console.error('Save interview error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Get single interview with full feedback
interviewsRouter.get('/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('interviews')
    .select(`
      id, type, length, config, status, duration_seconds,
      started_at, completed_at,
      interview_feedback ( score, headline, went_well, to_improve, suggestions )
    `)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single()

  if (error) return res.status(500).json({ error: error.message })
  if (!data) return res.status(404).json({ error: 'Not found' })
  res.json(data)
})

// Get interview history for current user
interviewsRouter.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('interviews')
    .select(`
      id, type, length, config, status, duration_seconds,
      started_at, completed_at,
      interview_feedback ( score, headline )
    `)
    .eq('user_id', req.user.id)
    .order('completed_at', { ascending: false })
    .limit(50)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})
