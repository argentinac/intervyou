export const CUSTOM_SIMULATIONS = [
  {
    id: 'custom_situation',
    type: 'custom',
    category: 'other',
    title: 'Tu Situación',
    shortDescription: 'Describí cualquier situación y practicá con un interlocutor adaptado a vos.',
    icon: 'Sparkles',
    durationMinutes: 7,
    defaultLanguage: 'Spanish',
    interlocutorDefaultGender: 'male',
    showPhaseIndicator: false,
    uiCopy: {
      interlocutorLabel: 'Tu interlocutor',
      sessionTitle: 'Tu Situación',
      interlocutorContext: 'Simulación personalizada',
    },
    internalInstructions: {
      durationMaxMinutes: 7,
      interventionsRange: { Basic: [6, 8], Intermediate: [7, 9], Advanced: [8, 10] },
    },
    systemPromptTemplate: (a) => {
      const situation = a.dynamicSituation || ''
      const core = a.dynamicPersonaCore || ''
      const contextLines = Object.entries(a.dynamicAnswers || {})
        .filter(([, v]) => v && v !== 'other')
        .map(([, v]) => (Array.isArray(v) ? v.join(', ') : v))
        .join('. ')
      return [
        `La persona usuaria quiere practicar esta situación: "${situation}".`,
        contextLines ? `Contexto adicional que eligió: ${contextLines}.` : '',
        '',
        core,
        '',
        'OBJETIVO PEDAGÓGICO: Ayudá a la persona a practicar cómo manejar esta situación de forma efectiva, clara y segura.',
      ]
        .filter((l) => l !== null && l !== undefined)
        .join('\n')
        .trim()
    },
  },
]
