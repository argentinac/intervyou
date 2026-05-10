import { makeLabelResolver } from './_util'

const ENTREVISTA_VISA_USA = {
  id: 'entrevista_visa_usa',
  category: 'visa',
  title: 'Entrevista consular — Visa USA',
  shortDescription: 'Simulá la entrevista en la embajada para obtener una visa estadounidense.',
  icon: 'Plane',
  durationMinutes: 10,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish', 'English'],
  interlocutorDefaultGender: 'male',
  uiCopy: {
    interlocutorLabel: 'Oficial Consular',
    sessionTitle: 'Entrevista consular',
    interlocutorContext: 'Embajada de EE.UU.',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Qué visa querés practicar?',
      questions: [
        {
          id: 'visaType',
          label: 'Tipo de visa',
          type: 'select',
          required: true,
          options: [
            { value: 'B1B2', label: 'B1/B2 — Turismo o negocios', flag: '🇺🇸' },
            { value: 'F1', label: 'F1 — Estudiante', flag: '🎓' },
            { value: 'J1', label: 'J1 — Intercambio', flag: '🌍' },
            { value: 'H1B', label: 'H1B — Trabajo especializado', flag: '💼' },
            { value: 'L1', label: 'L1 — Traslado intracompañía', flag: '🏢' },
            { value: 'O1', label: 'O1 — Talento extraordinario', flag: '⭐' },
            { value: 'K1', label: 'K1 — Prometido/a', flag: '💍' },
            { value: 'GreenCard', label: 'Green Card — Residencia permanente', flag: '🟢' },
          ],
        },
        { id: 'nationality', label: 'Tu nacionalidad', type: 'shortText', placeholder: 'Ej: Argentina', required: true },
      ],
    },
    screen2: {
      heading: '¿Cómo querés que sea el oficial?',
      questions: [
        {
          id: 'redFlags',
          label: '¿Hay algo que podría generar dudas?',
          type: 'multiselect',
          max: 2,
          required: false,
          options: [
            { value: 'visa_rechazada', label: 'Tuve una visa rechazada antes' },
            { value: 'sin_trabajo_formal', label: 'No tengo trabajo formal estable' },
            { value: 'familia_usa', label: 'Tengo familia directa viviendo en USA' },
            { value: 'ingresos_irregulares', label: 'Ingresos irregulares o freelance' },
            { value: 'overstay', label: 'Estuve en USA en overstay' },
          ],
        },
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Oficial neutro, preguntas estándar.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Oficial metódico, repregunta inconsistencias.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Oficial desconfiado, pone la carga de la prueba en vos.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 10,
    interventionsRange: { Basic: [8, 10], Intermediate: [10, 12], Advanced: [12, 14] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(ENTREVISTA_VISA_USA)
    return `
Sos un/a oficial consular de los Estados Unidos. Nacionalidad del solicitante: ${a.nationality || 'no especificada'}. Tipo de visa: ${L('visaType', a.visaType)}.

CÓMO TE COMPORTÁS:
- Tenés poder absoluto sobre la decisión y NO estás obligado/a a explicar nada.
- Hablás poco, escuchás mucho, usás pausas incómodas.
- Preguntas adaptadas a la visa: F1 → por qué esa universidad, qué hacés después; B1/B2 → vínculos en el país de origen, fuente de fondos; H1B → relación con el empleador.
- En Básico: seguís el formulario DS-160 sin profundizar.
- En Intermedio: detectás inconsistencias y volvés sobre ellas.
- En Difícil: asumís intención de quedarse ilegalmente y exigís prueba de lo contrario.
- Nunca das señales de cómo va la entrevista.

PUNTOS QUE DEBERÍAS EXPLORAR (si la dificultad lo amerita): ${(a.redFlags || []).map((v) => L('redFlags', v)).join(', ') || 'ninguno declarado por el solicitante'}.

OBJETIVO PEDAGÓGICO: que la persona aprenda a responder con consistencia, brevedad y verdad sin entrar en detalles innecesarios.
`.trim()
  },
}

export const VISA_SIMULATIONS = [ENTREVISTA_VISA_USA]
