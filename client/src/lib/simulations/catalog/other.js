import { makeLabelResolver } from './_util'

const PITCH_VC = {
  id: 'pitch_vc',
  category: 'other',
  title: 'Pitch a un VC',
  shortDescription: 'Practicá tu pitch frente a un Venture Capitalist exigente.',
  icon: 'Rocket',
  durationMinutes: 12,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish', 'English'],
  interlocutorDefaultGender: 'male',
  interlocutorRole: 'Venture Capitalist',
  uiCopy: {
    interlocutorLabel: 'Venture Capitalist',
    sessionTitle: 'Pitch a un VC',
    interlocutorContext: 'Reunión de inversión',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿En qué etapa está la startup?',
      questions: [
        {
          id: 'stage',
          label: 'Etapa',
          type: 'select',
          required: true,
          options: [
            { value: 'idea', label: 'Idea / pre-producto' },
            { value: 'mvp', label: 'MVP lanzado, primeros usuarios' },
            { value: 'traccion', label: 'Producto con tracción (revenue o usuarios activos)' },
            { value: 'escala', label: 'Creciendo, buscamos escalar' },
          ],
        },
        {
          id: 'industry',
          label: 'Industria / sector',
          type: 'select',
          required: true,
          options: [
            { value: 'saas_ai', label: 'Tecnología / SaaS / IA' },
            { value: 'fintech', label: 'Fintech / cripto' },
            { value: 'health', label: 'Salud / biotech' },
            { value: 'edu', label: 'Educación' },
            { value: 'consumo', label: 'Consumo / marketplace / e-commerce' },
            { value: 'otro', label: 'Otro' },
          ],
        },
        {
          id: 'raise',
          label: '¿Cuánto buscás levantar?',
          type: 'select',
          required: true,
          options: [
            { value: 'sub500k', label: 'Menos de USD 500k' },
            { value: '500k_2M', label: 'USD 500k a 2M' },
            { value: '2M_5M', label: 'USD 2M a 5M' },
            { value: 'over5M', label: 'Más de USD 5M' },
          ],
        },
      ],
    },
    screen2: {
      heading: '¿Qué parte del pitch?',
      questions: [
        {
          id: 'practiceFocus',
          label: 'Foco de práctica',
          type: 'select',
          required: true,
          options: [
            { value: 'elevator', label: 'El elevator pitch de un minuto' },
            { value: 'mercado', label: 'Preguntas sobre mercado y competencia' },
            { value: 'unit_economics', label: 'Preguntas sobre unit economics y modelo' },
            { value: 'equipo', label: 'Preguntas sobre el equipo y por qué ustedes' },
            { value: 'completo', label: 'Todo el pitch completo' },
          ],
        },
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'VC curioso, quiere entender el negocio.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'VC analítico, pide números y benchmarks.' },
            { value: 'Advanced', label: 'Difícil', desc: 'VC escéptico, cuestiona mercado, equipo y timing.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 12,
    interventionsRange: { Basic: [6, 8], Intermediate: [8, 10], Advanced: [10, 12] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(PITCH_VC)
    return `
Sos un/a Venture Capitalist con experiencia. Escuchaste miles de pitches. La startup está en etapa "${L('stage', a.stage)}" en ${L('industry', a.industry)}, busca levantar ${L('raise', a.raise)}.

CÓMO TE COMPORTÁS:
- No sos grosero/a pero tampoco te dejás llevar por el entusiasmo.
- Detectás el discurso vacío al instante.
- En Difícil atacás los supuestos: "¿por qué no puede hacer esto Google?", "¿qué pasa si el CAC sube un 30%?", "¿por qué ustedes y no otro equipo?".
- Si la respuesta es larga o vaga, interrumpís con "¿qué significa eso exactamente?".
- Sin halagos vacíos. Si algo está bien dicho, asentís y avanzás.

EL FOUNDER QUIERE PRACTICAR PUNTUALMENTE: ${L('practiceFocus', a.practiceFocus)}. Adaptá tu interrogatorio a ese foco.

OBJETIVO PEDAGÓGICO: que el founder aprenda a ser directo/a, honesto/a y confiado/a, sin discurso de marketing.
`.trim()
  },
}

const MANEJO_ANSIEDAD = {
  id: 'manejo_ansiedad',
  category: 'other',
  title: 'Manejo de ansiedad',
  shortDescription: 'Practicá técnicas para manejar la ansiedad con un coach que te guía.',
  icon: 'Wind',
  durationMinutes: 10,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'female',
  interlocutorRole: 'Coach de bienestar',
  uiCopy: {
    interlocutorLabel: 'Tu coach',
    sessionTitle: 'Sesión de manejo de ansiedad',
    interlocutorContext: 'Sesión con tu coach',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Qué situación te genera ansiedad?',
      questions: [
        {
          id: 'context',
          label: '¿En qué área sentís más ansiedad?',
          type: 'select',
          required: true,
          options: [
            { value: 'social', label: 'Situaciones sociales / reuniones' },
            { value: 'trabajo', label: 'Trabajo / rendimiento' },
            { value: 'estudio', label: 'Exámenes / estudio' },
            { value: 'relaciones', label: 'Relaciones / conflictos' },
            { value: 'salud_futuro', label: 'Salud / futuro / incertidumbre' },
          ],
        },
        {
          id: 'trigger',
          label: '¿Qué suele desencadenarla?',
          type: 'select',
          required: true,
          options: [
            { value: 'situaciones_nuevas', label: 'Situaciones nuevas o desconocidas' },
            { value: 'miedo_error', label: 'Miedo a equivocarme o fracasar' },
            { value: 'opinion_otros', label: 'Lo que piensan los demás de mí' },
            { value: 'tiempo', label: 'No llegar a tiempo o no alcanzar' },
            { value: 'no_se', label: 'No lo sé con claridad' },
          ],
        },
        {
          id: 'practiceFocus',
          label: '¿Qué querés trabajar en esta sesión?',
          type: 'select',
          required: true,
          options: [
            { value: 'calmar_mente', label: 'Calmar la mente cuando explota' },
            { value: 'respiracion', label: 'Técnicas de respiración y relajación' },
            { value: 'hablar', label: 'Poner en palabras lo que siento' },
            { value: 'pensamientos', label: 'Cambiar pensamientos negativos' },
            { value: 'todo', label: 'Todo junto, que el coach decida' },
          ],
        },
      ],
    },
    screen2: {
      heading: '¿Cómo querés la sesión?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Coach empático, ritmo lento, sin presión.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Técnicas concretas y preguntas de reflexión.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Desafía patrones, empuja al cambio real.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 10,
    interventionsRange: { Basic: [5, 7], Intermediate: [7, 9], Advanced: [9, 11] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(MANEJO_ANSIEDAD)
    return `
Sos un/a coach de bienestar con formación en psicología cognitivo-conductual. Estás en una sesión individual con alguien que siente ansiedad en el área de ${L('context', a.context)}, desencadenada principalmente por: ${L('trigger', a.trigger)}.

Lo que la persona quiere trabajar hoy: ${L('practiceFocus', a.practiceFocus)}.

CÓMO TE COMPORTÁS:
- Primero escuchás y validás. Nunca minimizás ("eso es normal", "tranquilo/a") sin antes explorar.
- Hacés una pregunta a la vez. No bombardeás.
- Usás técnicas reales: respiración 4-7-8, grounding 5-4-3-2-1, reencuadre cognitivo, registro de pensamientos.
- Pedís que la persona practique las técnicas en voz alta contigo, no solo que las escuche.
- En Básico: ritmo lento, mucha validación, guiás paso a paso sin exigir, celebrás pequeños avances.
- En Intermedio: introducís técnicas concretas, hacés preguntas de reflexión profunda ("¿qué sería lo peor que podría pasar realmente?", "¿qué le dirías a un amigo en tu lugar?"), pedís que las apliquen.
- En Difícil: identificás distorsiones cognitivas (catastrofización, lectura mental, todo-o-nada), las nombrás, desafiás suavemente, y pedís compromisos de acción concretos para después de la sesión.

OBJETIVO PEDAGÓGICO: que la persona salga con al menos una técnica practicada y una comprensión nueva de su patrón de ansiedad.
`.trim()
  },
}

export const OTHER_SIMULATIONS = [PITCH_VC, MANEJO_ANSIEDAD]
