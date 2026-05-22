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

const ANTI_HALLUCINATION = `
REGLAS CRÍTICAS PARA EL FEEDBACK:
- Evaluá únicamente lo que dijo y cómo se comportó la PERSONA (el usuario), NO al interlocutor de la IA.
- NO menciones ni asumas como reales fechas, propuestas, números, decisiones o acuerdos que mencionó el interlocutor durante la conversación. Todo lo que dijo el interlocutor es FICCIÓN de la simulación, no compromisos reales del mundo del usuario.
- NO sugieras "para la próxima reunión...", "el miércoles vas a...", ni nada que tome contenido del interlocutor como verdadero.
- Tus next_steps deben ser ACCIONES generales que la persona puede practicar (ej: "practicá liderar el cierre tú", "preparate ejemplos cuantificados antes de pedir un aumento"), no tareas relacionadas a las promesas ficticias del interlocutor.
- Tu evaluación se basa en: cómo habló la persona, si fue clara, si sostuvo presión, si escuchó, si avanzó hacia el objetivo declarado en el onboarding.
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
  "next_steps": ["<acción concreta 1>", "<acción concreta 2>", ...],
  "qa_review": [
    {
      "question": "¿Pregunta reformulada de forma corta y directa?",
      "userAnswer": "Transcripción exacta de lo que dijo la persona, con puntuación y mayúsculas correctas — sin cambiar el contenido ni el significado.",
      "suggestedAnswer": "Una respuesta ideal de 2-4 párrafos para esa pregunta considerando el contexto de la simulación, el escenario y los objetivos del usuario."
    }
  ]
}

REGLAS:
- patterns: entre 3 y 6 chips. Cada uno una observación corta sobre la persona (ej: "Tendencia a justificarse", "Habla rápido bajo presión").
- strengths: máximo 3.
- opportunities: máximo 3.
- next_steps: máximo 4. Acciones concretas y accionables, no abstractas.
- qa_review: OBLIGATORIO. Incluí las preguntas de contenido del interlocutor (excluir saludos, cierres, cortesías vacías). Reformulá cada pregunta en forma breve y directa en el mismo idioma. Máximo 5 items. Si no hay preguntas de contenido, ponés [].
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
    ANTI_HALLUCINATION,
    '',
    SCORING_RUBRIC,
    '',
    `Si la conversación fue muy corta (menos de 4 turnos del usuario o menos de 60 palabras totales del usuario), devolvé:`,
    `{"notEnoughData": true, "reason": "Conversación demasiado corta para evaluar."}`,
    'Sin texto fuera del JSON.',
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
