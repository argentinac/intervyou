// Shared helpers for simulation catalog files.

// Resolves a stored answer value to its human-readable label by looking it up
// in the simulation's onboarding schema. Falls back to the raw value if not
// found. Use this inside `systemPromptTemplate` to keep labels in sync with
// the onboarding without duplicating strings.
export function makeLabelResolver(simulation) {
  const all = [
    ...(simulation.onboarding?.screen1?.questions || []),
    ...(simulation.onboarding?.screen2?.questions || []),
  ]
  return (questionId, value) => {
    const q = all.find((x) => x.id === questionId)
    if (!q || !q.options) return value
    if (Array.isArray(value)) {
      return value
        .map((v) => (q.options.find((o) => o.value === v)?.label) || v)
        .join(', ')
    }
    return q.options.find((o) => o.value === value)?.label || value
  }
}
