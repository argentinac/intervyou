// Builds the scoring prompt for non-job-interview simulations.
// Returns the prompt and the JSON schema that the LLM must conform to.
//
// Output shape (4 dimensions, 0-1000 each):
// {
//   general_score: int 0-1000,
//   summary: string (1 sentence),
//   clarity_score: int 0-1000,
//   emotional_score: int 0-1000,
//   listening_score: int 0-1000,
//   objective_score: int 0-1000,
//   patterns: string[],         // 3-6 chips
//   strengths: { title, description }[],     // max 3
//   opportunities: { title, description }[], // max 3
//   next_steps: string[],       // max 4 concrete actions
// }

const SCORING_RUBRIC = `
Calificá la conversación en 4 dimensiones, escala 0-1000:

1. CLARIDAD — ¿Se entiende lo que dice la persona?
   Considerá precisión, brevedad, ausencia de muletillas, hilo coherente.

2. MANEJO EMOCIONAL — ¿Sostiene la presión?
   Considerá control de nervios, tono adecuado, no escalada del conflicto.

3. ESCUCHA Y ADAPTACIÓN — ¿Responde a las preguntas?
   Considerá si escucha realmente, si responde lo preguntado, si se adapta a las repreguntas.

4. OBJETIVO LOGRADO — ¿Llegó a lo que quería llegar?
   Considerá si avanzó hacia el objetivo declarado de la simulación, sin ceder de más ni sin quedarse corto.

GENERAL (0-1000): Tu juicio global de la conversación. NO es necesariamente el promedio de las 4. Una persona puede tener buenas dimensiones individuales pero una conversación globalmente mediocre, o viceversa.
`.trim()

const OUTPUT_INSTRUCTIONS = `
Devolvé JSON válido con esta forma exacta:

{
  "general_score": <int 0-1000>,
  "summary": "<1 oración resumiendo el desempeño, ej: 'Lograste el objetivo pero cediste más de lo necesario.'>",
  "clarity_score": <int 0-1000>,
  "emotional_score": <int 0-1000>,
  "listening_score": <int 0-1000>,
  "objective_score": <int 0-1000>,
  "patterns": ["<chip 1>", "<chip 2>", ...],
  "strengths": [{"title": "<corto>", "description": "<1 oración>"}, ...],
  "opportunities": [{"title": "<corto>", "description": "<1 oración>"}, ...],
  "next_steps": ["<acción concreta 1>", "<acción concreta 2>", ...]
}

REGLAS:
- patterns: entre 3 y 6 chips. Cada uno una observación corta sobre la persona (ej: "Tendencia a justificarse", "Habla rápido bajo presión").
- strengths: máximo 3.
- opportunities: máximo 3.
- next_steps: máximo 4. Acciones concretas y accionables, no abstractas.
- Sin texto fuera del JSON. Sin markdown.
`.trim()

export function buildScoringPrompt(simulation, transcript, answers) {
  const language = answers.language || simulation.defaultLanguage || 'Spanish'
  const difficulty = answers.difficulty || 'Intermediate'

  const onboardingSummary = Object.entries(answers)
    .filter(([k]) => !['interviewType', 'simulationId', 'language'].includes(k))
    .map(([k, v]) => `- ${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join('\n')

  return [
    `Estás evaluando una simulación de práctica conversacional.`,
    `Simulación: "${simulation.title}" (categoría: ${simulation.category}).`,
    `Idioma: ${language}. Dificultad: ${difficulty}.`,
    '',
    `CONTEXTO DEL USUARIO (respuestas del onboarding):`,
    onboardingSummary || '(sin contexto adicional)',
    '',
    SCORING_RUBRIC,
    '',
    `TRANSCRIPCIÓN DE LA CONVERSACIÓN:`,
    typeof transcript === 'string' ? transcript : JSON.stringify(transcript, null, 2),
    '',
    OUTPUT_INSTRUCTIONS,
  ].join('\n')
}

export const SIMULATION_FEEDBACK_KEYS = [
  'general_score',
  'summary',
  'clarity_score',
  'emotional_score',
  'listening_score',
  'objective_score',
  'patterns',
  'strengths',
  'opportunities',
  'next_steps',
]
