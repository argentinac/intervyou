import { makeLabelResolver } from './_util'

const PRIMERA_CITA = {
  id: 'primera_cita',
  category: 'love',
  title: 'Primera cita',
  shortDescription: 'Practicá la conversación de una primera cita: romper el hielo, fluir, generar interés.',
  icon: 'Heart',
  durationMinutes: 12,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'female',
  uiCopy: {
    interlocutorLabel: 'Tu cita',
    sessionTitle: 'Primera cita',
    interlocutorContext: 'Conversación cara a cara',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Cómo arrancan?',
      questions: [
        {
          id: 'howMet',
          label: '¿Cómo se conocieron?',
          type: 'select',
          required: true,
          options: [
            { value: 'app', label: 'App de citas (Tinder, Bumble, Hinge…)' },
            { value: 'amigos', label: 'A través de amigos en común' },
            { value: 'trabajo_facu', label: 'En el trabajo o la facultad' },
            { value: 'evento', label: 'En un evento o salida' },
            { value: 'redes', label: 'Por redes sociales' },
          ],
        },
        {
          id: 'practiceFocus',
          label: '¿Qué querés practicar?',
          type: 'select',
          required: true,
          options: [
            { value: 'romper_hielo', label: 'Romper el hielo y arrancar la conversación' },
            { value: 'mantener_flujo', label: 'Mantener el flujo sin silencios incómodos' },
            { value: 'mostrar_interes', label: 'Mostrar interés sin parecer desesperado/a' },
            { value: 'tension', label: 'Generar atracción y algo de tensión' },
            { value: 'cierre', label: 'El cierre: quedar para una segunda cita' },
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
      ],
    },
    screen2: {
      heading: '¿Cómo es la otra persona?',
      questions: [
        {
          id: 'personality',
          label: 'Personalidad',
          type: 'select',
          required: true,
          options: [
            { value: 'abierta', label: 'Abierta y sociable, habla mucho' },
            { value: 'reservada', label: 'Más reservada, hay que ganarse su confianza' },
            { value: 'ironica', label: 'Inteligente y un poco irónica' },
            { value: 'divertida', label: 'Divertida y relajada, todo fluye fácil' },
            { value: 'desconocido', label: 'No sé mucho todavía' },
          ],
        },
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Receptiva, ayuda a que fluya.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Reactiva, tiene sus propias opiniones.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Exigente, no regala interés.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 12,
    interventionsRange: { Basic: [8, 10], Intermediate: [10, 13], Advanced: [13, 15] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(PRIMERA_CITA)
    return `
Sos una persona real en una primera cita. Se conocieron: ${L('howMet', a.howMet)}. Personalidad: ${L('personality', a.personality)}.

CÓMO TE COMPORTÁS:
- Tenés tus propias opiniones, sentido del humor y límites.
- No facilitás todo. Si algo te aburre, cambiás el tema.
- No regalás aprobación.
- Hacés preguntas de vuelta. No sos un receptor pasivo.
- Das señales sutiles de interés o desinterés que el usuario tiene que leer.
- En Básico: ayudás a que la conversación fluya.
- En Intermedio: reactiva, opiniás libremente.
- En Difícil: exigente, no te entusiasmás fácil.

EL USUARIO QUIERE PRACTICAR PUNTUALMENTE: ${L('practiceFocus', a.practiceFocus)}. Adaptate a ese foco sin forzarlo.

OBJETIVO PEDAGÓGICO: que la persona aprenda a sostener una conversación auténtica, leer señales y avanzar (o cerrar) sin sobreactuar.
`.trim()
  },
}

export const LOVE_SIMULATIONS = [PRIMERA_CITA]
