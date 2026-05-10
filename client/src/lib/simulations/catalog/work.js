// Pilot simulation: Pedir un aumento

const PEDIR_AUMENTO = {
  id: 'pedir_aumento',
  category: 'work',
  title: 'Pedir un aumento',
  shortDescription: 'Practicá la conversación con tu manager para pedir un ajuste salarial.',
  icon: 'TrendingUp',
  durationMinutes: 10,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'male',
  interlocutorRole: 'Manager directo',
  uiCopy: {
    interlocutorLabel: 'Tu manager',
    sessionTitle: 'Pidiendo un aumento',
    interlocutorContext: 'Conversación con tu manager',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Cuál es tu situación?',
      subheading: 'Contame lo justo para personalizar la conversación.',
      questions: [
        { id: 'role', label: '¿Cuál es tu rol?', type: 'shortText', placeholder: 'Ej: Product Manager', required: true },
        {
          id: 'speakingWith',
          label: '¿Con quién hablás?',
          type: 'select',
          required: true,
          options: [
            { value: 'manager_directo', label: 'Mi manager directo' },
            { value: 'recursos_humanos', label: 'Recursos Humanos' },
            { value: 'ceo', label: 'El/la dueño/a o CEO' },
          ],
        },
        {
          id: 'interlocutorGender',
          label: '¿Qué género tiene la persona?',
          type: 'select',
          required: true,
          options: [
            { value: 'male', label: 'Hombre' },
            { value: 'female', label: 'Mujer' },
            { value: 'neutral', label: 'Indistinto' },
          ],
        },
        {
          id: 'lastRaise',
          label: '¿Cuándo fue tu último aumento?',
          type: 'select',
          required: true,
          options: [
            { value: 'never', label: 'Nunca tuve uno acá' },
            { value: 'less6m', label: 'Hace menos de 6 meses' },
            { value: '6_12m', label: 'Hace 6 a 12 meses' },
            { value: 'more1y', label: 'Hace más de 1 año' },
          ],
        },
      ],
    },
    screen2: {
      heading: '¿Cómo querés que sea la conversación?',
      questions: [
        {
          id: 'mainArgument',
          label: '¿Cuál es tu argumento principal?',
          type: 'multiselect',
          max: 2,
          required: true,
          options: [
            { value: 'mas_responsabilidades', label: 'Mis responsabilidades crecieron' },
            { value: 'mercado', label: 'El mercado paga más por mi perfil' },
            { value: 'sin_ajuste', label: 'Hace tiempo que no me ajustan el salario' },
            { value: 'logros', label: 'Tuve logros concretos y medibles' },
            { value: 'oferta_externa', label: 'Tengo una oferta externa como referencia' },
          ],
        },
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'La empresa está bien y hay apertura.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Hay restricciones presupuestarias.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Momento complicado o manager muy duro/a.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 10,
    interventionsRange: { Basic: [4, 5], Intermediate: [5, 6], Advanced: [6, 7] },
  },
  systemPromptTemplate: (a) => `
Sos ${labelFor('speakingWith', a.speakingWith)}. Pragmático/a y orientado/a al presupuesto. Representás los intereses de la empresa.

CONTEXTO QUE CONOCÉS:
- La persona ocupa el rol de "${a.role || 'no especificado'}".
- Último aumento: ${labelFor('lastRaise', a.lastRaise)}.
- Su argumento principal va a girar alrededor de: ${(a.mainArgument || []).map(v => labelFor('mainArgument', v)).join(' y ') || 'no especificado'}.

CÓMO TE COMPORTÁS:
- Escuchás el pedido sin interrumpir, después hacés preguntas sobre logros concretos, comparaciones con el mercado, o impacto medible.
- Buscás bajar expectativas o ganar tiempo. No dices "sí" rápido.
- En Básico: podés aceptar con condiciones (ej. revisar números).
- En Intermedio: pedís evidencia y datos antes de comprometerte.
- En Difícil: proponé alternativas (bonos, revisión en 6 meses, beneficios no monetarios) en vez del aumento que pide. Mencioná el contexto de la empresa o el timing.

OBJETIVO PEDAGÓGICO: que la persona aprenda a sostener su pedido con evidencia y a no aceptar la primera contraoferta sin negociar.
`.trim(),
}

function labelFor(questionId, value) {
  const q = [
    ...PEDIR_AUMENTO.onboarding.screen1.questions,
    ...PEDIR_AUMENTO.onboarding.screen2.questions,
  ].find((q) => q.id === questionId)
  if (!q || !q.options) return value
  const opt = q.options.find((o) => o.value === value)
  return opt ? opt.label : value
}

export const WORK_SIMULATIONS = [PEDIR_AUMENTO]
