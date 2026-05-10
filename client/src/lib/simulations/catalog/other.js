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

export const OTHER_SIMULATIONS = [PITCH_VC]
