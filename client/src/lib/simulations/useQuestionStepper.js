import { useState } from 'react'

export function isAnswerValid(q, answers) {
  const v = answers[q.id]
  if (q.required === false) return true
  if (q.type === 'shortText') return typeof v === 'string' && v.trim().length > 0
  if (q.type === 'multiselect') return Array.isArray(v) && v.length > 0
  return !!v
}

export function useQuestionStepper(questions, answers, { onComplete, onBack }) {
  const [idx, setIdx] = useState(0)
  const total = questions.length
  const currentQ = questions[idx]
  const isLast = idx === total - 1
  const canAdvance = currentQ ? isAnswerValid(currentQ, answers) : false

  const goNext = () => {
    if (isLast) onComplete()
    else setIdx((i) => i + 1)
  }

  const goPrev = () => {
    if (idx === 0) onBack()
    else setIdx((i) => i - 1)
  }

  return { idx, total, currentQ, isLast, canAdvance, goNext, goPrev, setIdx }
}
