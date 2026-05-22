import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'
import { calculateScore } from '../lib/scoring.js'
import express from 'express'

export const interviewsRouter = express.Router()

// Save completed interview + feedback
interviewsRouter.post('/', requireAuth, async (req, res) => {
  const { config, transcript, feedback, durationSeconds } = req.body
  const userId = req.user.id

  const isSimulation = !!config.simulationId

  try {
    // Ensure the simulation row exists in the catalog table (idempotent upsert).
    if (isSimulation) {
      const { error: simErr } = await supabase.from('simulations').upsert({
        id:       config.simulationId,
        category: config.simulationCategory || 'other',
        title:    config.simulationTitle || config.simulationId,
        active:   true,
      }, { onConflict: 'id' })
      if (simErr) {
        console.error('[interviews] simulations upsert failed — migration may not have been applied:', simErr.message)
        throw new Error(`simulations upsert: ${simErr.message}`)
      }
    }

    const { data: interview, error: iErr } = await supabase
      .from('interviews')
      .insert({
        user_id:             userId,
        type:                isSimulation ? 'simulation' : (config.interviewType?.toLowerCase() ?? 'hr'),
        length:              'standard',
        config,
        status:              'completed',
        duration_seconds:    durationSeconds ?? null,
        completed_at:        new Date().toISOString(),
        simulation_id:       isSimulation ? config.simulationId : null,
        simulation_category: isSimulation ? (config.simulationCategory || null) : null,
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

    // Simulations use a different feedback shape (4 dimensions, no axes/penalties)
    if (isSimulation && feedback && !feedback.parseError) {
      await supabase.from('simulation_feedback').insert({
        interview_id:    interview.id,
        user_id:         userId,
        simulation_id:   config.simulationId,
        general_score:   feedback.general_score ?? null,
        summary:         feedback.summary ?? null,
        clarity_score:   feedback.clarity_score   ?? null,
        emotional_score: feedback.emotional_score ?? null,
        listening_score: feedback.listening_score ?? null,
        objective_score: feedback.objective_score ?? null,
        patterns:        Array.isArray(feedback.patterns) ? feedback.patterns : [],
        strengths:       Array.isArray(feedback.strengths) ? feedback.strengths : [],
        opportunities:   Array.isArray(feedback.opportunities) ? feedback.opportunities : [],
        next_steps:      Array.isArray(feedback.next_steps) ? feedback.next_steps : [],
        raw_response:    feedback,
      })
      return res.json({ id: interview.id })
    }

    if (feedback && !feedback.notEnoughData && !feedback.parseError) {
      // Re-compute score server-side from raw axes for authoritative storage
      let scoreResult = feedback.scoreResult ?? null
      if (feedback.axes && !scoreResult) {
        const { clarity, structure, roleRelevance, ...contentAxes } = feedback.axes
        scoreResult = calculateScore(
          config.interviewType || 'HR',
          { clarity, structure, roleRelevance },
          contentAxes
        )
      }

      const finalScore = scoreResult?.finalScore ?? feedback.score ?? null

      await supabase.from('interview_feedback').insert({
        interview_id: interview.id,
        user_id:      userId,
        score:        finalScore,
        headline:     feedback.headline,
        went_well:    feedback.wentWell   ?? null,
        to_improve:   feedback.toImprove  ?? null,
        suggestions:  feedback.actionPlan ?? feedback.suggestions ?? null,
        raw_response: feedback,
      })

      // Save full per-axis breakdown for auditability
      if (scoreResult && feedback.axes) {
        const { clarity, structure, roleRelevance, ...contentAxes } = feedback.axes
        const type = scoreResult.interviewType  // 'HR' | 'TECHNICAL'
        const isHR = type === 'HR'

        await supabase.from('interview_scoring_detail').insert({
          interview_id: interview.id,
          user_id:      userId,
          interview_type: type,

          // Base axes
          clarity:        clarity        ?? null,
          structure:      structure      ?? null,
          role_relevance: roleRelevance  ?? null,
          base_score:     scoreResult.baseScore.score,
          base_axes_measured: scoreResult.baseScore.measuredCount,

          // Content axes HR
          narrative_coherence: isHR ? (contentAxes.narrativeCoherence ?? null) : null,
          reflection_depth:    isHR ? (contentAxes.reflectionDepth    ?? null) : null,
          concrete_evidence:   isHR ? (contentAxes.concreteEvidence   ?? null) : null,

          // Content axes TECHNICAL
          technical_correctness:    !isHR ? (contentAxes.technicalCorrectness   ?? null) : null,
          depth:                    !isHR ? (contentAxes.depth                  ?? null) : null,
          problem_solving_evidence: !isHR ? (contentAxes.problemSolvingEvidence ?? null) : null,

          content_score:         scoreResult.contentScore.score,
          content_axes_measured: scoreResult.contentScore.measuredCount,

          pre_penalty_score: scoreResult.prePenaltyScore,
          final_score:       scoreResult.finalScore,
          confidence:        scoreResult.confidence,
          score_label:       scoreResult.scoreLabel,
          penalties_applied: scoreResult.penaltiesApplied,
          scoring_result:    scoreResult,
        })
      }
    }

    res.json({ id: interview.id })
  } catch (err) {
    console.error('Save interview error:', err)
    res.status(500).json({ error: 'save_failed', message: err.message })
  }
})

// Count interviews completed today by current user
interviewsRouter.get('/daily-count', requireAuth, async (req, res) => {
  const userId = req.user.id
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const { count, error } = await supabase
    .from('interviews')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('completed_at', todayStart.toISOString())

  if (error) return res.status(500).json({ error: error.message })
  res.json({ count: count ?? 0 })
})

// Get single interview with full feedback
interviewsRouter.get('/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('interviews')
    .select(`
      id, type, length, config, status, duration_seconds,
      started_at, completed_at,
      interview_feedback ( score, headline, went_well, to_improve, suggestions, raw_response ),
      simulation_feedback ( general_score, summary, clarity_score, emotional_score, listening_score, objective_score, patterns, strengths, opportunities, next_steps, raw_response )
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
      interview_feedback ( score, headline ),
      simulation_feedback ( general_score )
    `)
    .eq('user_id', req.user.id)
    .order('completed_at', { ascending: false })
    .limit(50)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})
