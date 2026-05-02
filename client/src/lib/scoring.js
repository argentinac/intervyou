/**
 * Client-side scoring engine — mirrors server/lib/scoring.js exactly.
 * Used to compute the score immediately after Claude returns axes,
 * so FeedbackSummary can render a number without waiting for the DB save.
 *
 * Keep in sync with server/lib/scoring.js.
 */

function normaliseType(t) {
  return String(t).toUpperCase() === 'HR' ? 'HR' : 'TECHNICAL'
}

function weightedBlock(valuesObj, weightsObj) {
  const entries = Object.entries(valuesObj).filter(([, v]) => v !== null && v !== undefined)
  const measuredCount = entries.length

  if (measuredCount < 2) {
    return { score: null, measuredCount }
  }

  const totalWeight = entries.reduce((sum, [k]) => sum + weightsObj[k], 0)
  let score = 0
  for (const [k, v] of entries) {
    score += v * (weightsObj[k] / totalWeight)
  }
  return { score, measuredCount }
}

function computeConfidence(baseMeasured, contentMeasured) {
  if (baseMeasured === 3 && contentMeasured === 3) return 'HIGH'
  if (baseMeasured >= 2 && contentMeasured >= 2) return 'MEDIUM'
  return 'LOW'
}

function scoreLabel(score) {
  if (score === null) return 'Sin score confiable'
  if (score >= 900) return 'Excelente'
  if (score >= 800) return 'Muy fuerte'
  if (score >= 650) return 'Fuerte'
  if (score >= 500) return 'Competente básico'
  if (score >= 300) return 'En desarrollo'
  return 'Riesgo alto'
}

export function calculateScore(interviewType, baseAxes, contentAxes) {
  const type = normaliseType(interviewType)

  const baseWeights = { clarity: 0.375, structure: 0.375, roleRelevance: 0.25 }
  const baseBlock = weightedBlock(
    { clarity: baseAxes.clarity ?? null, structure: baseAxes.structure ?? null, roleRelevance: baseAxes.roleRelevance ?? null },
    baseWeights
  )

  let contentBlock
  if (type === 'HR') {
    const w = { narrativeCoherence: 0.40, reflectionDepth: 0.30, concreteEvidence: 0.30 }
    contentBlock = weightedBlock(
      {
        narrativeCoherence: contentAxes.narrativeCoherence ?? null,
        reflectionDepth:    contentAxes.reflectionDepth    ?? null,
        concreteEvidence:   contentAxes.concreteEvidence   ?? null,
      },
      w
    )
  } else {
    const w = { technicalCorrectness: 0.50, depth: 0.30, problemSolvingEvidence: 0.20 }
    contentBlock = weightedBlock(
      {
        technicalCorrectness:   contentAxes.technicalCorrectness   ?? null,
        depth:                  contentAxes.depth                  ?? null,
        problemSolvingEvidence: contentAxes.problemSolvingEvidence ?? null,
      },
      w
    )
  }

  if (baseBlock.score === null || contentBlock.score === null) {
    return {
      interviewType: type,
      baseScore:    { score: null, axes: { ...baseAxes },    measuredCount: baseBlock.measuredCount },
      contentScore: { score: null, axes: { ...contentAxes }, measuredCount: contentBlock.measuredCount },
      prePenaltyScore: null,
      finalScore:      null,
      penaltiesApplied: [],
      confidence: 'LOW',
      scoreLabel:  'Sin score confiable',
    }
  }

  const weights = type === 'HR' ? { base: 6.5, content: 3.5 } : { base: 4, content: 6 }
  const prePenaltyScore = baseBlock.score * weights.base + contentBlock.score * weights.content
  const contentThreshold = type === 'HR' ? 40 : 50
  const penalties = []
  let finalScore = prePenaltyScore

  if (contentBlock.score < contentThreshold) {
    finalScore = finalScore * 0.6
    penalties.push({
      type:       'LOW_CONTENT',
      reason:     `Content score ${contentBlock.score.toFixed(1)} < ${contentThreshold} — penalización del 40%`,
      multiplier: 0.6,
    })
  }

  if (contentBlock.score < 30) {
    finalScore = Math.min(finalScore, 300)
    penalties.push({
      type:   'VERY_LOW_CONTENT_CAP',
      reason: `Content score ${contentBlock.score.toFixed(1)} < 30 — cap duro en 300`,
      cap:    300,
    })
  }

  finalScore = Math.max(0, Math.min(1000, Math.round(finalScore)))

  return {
    interviewType: type,
    baseScore: {
      score:        baseBlock.score,
      axes:         { ...baseAxes },
      measuredCount: baseBlock.measuredCount,
    },
    contentScore: {
      score:        contentBlock.score,
      axes:         { ...contentAxes },
      measuredCount: contentBlock.measuredCount,
    },
    prePenaltyScore,
    finalScore,
    penaltiesApplied: penalties,
    confidence: computeConfidence(baseBlock.measuredCount, contentBlock.measuredCount),
    scoreLabel: scoreLabel(finalScore),
  }
}
