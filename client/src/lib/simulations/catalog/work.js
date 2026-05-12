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
            { value: 'manager_directo', label: 'Mi manager directo', icon: 'manager' },
            { value: 'recursos_humanos', label: 'Recursos Humanos', icon: 'hr' },
            { value: 'ceo', label: 'El/la dueño/a o CEO', icon: 'ceo' },
          ],
        },
        {
          id: 'interlocutorGender',
          label: '¿Qué género tiene la persona?',
          type: 'select',
          required: true,
          options: [
            { value: 'male', label: 'Hombre', icon: 'male' },
            { value: 'female', label: 'Mujer', icon: 'female' },
            { value: 'neutral', label: 'Indistinto', icon: 'neutral' },
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

FORMATO ESTRICTO: Solo hablás. Nunca escribas acciones, descripciones ni acotaciones entre paréntesis o corchetes — nada de "(pausa)", "[silencio incómodo]", "*suspira*" ni nada similar. Solo texto que se dice en voz alta.

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

const RENUNCIAR = {
  id: 'renunciar',
  category: 'work',
  title: 'Dar la renuncia',
  shortDescription: 'Practicá cómo comunicar tu renuncia de forma clara y profesional.',
  icon: 'LogOut',
  durationMinutes: 8,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'male',
  interlocutorRole: 'Manager directo',
  uiCopy: {
    interlocutorLabel: 'Tu manager',
    sessionTitle: 'Dando la renuncia',
    interlocutorContext: 'Conversación con tu manager',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Cuál es tu situación?',
      subheading: 'Solo lo necesario para personalizar la conversación.',
      questions: [
        { id: 'empresa', label: 'Empresa (opcional)', type: 'shortText', placeholder: 'Ej: Mercado Libre', required: false },
        { id: 'cargo', label: 'Tu cargo (opcional)', type: 'shortText', placeholder: 'Ej: Diseñadora UX', required: false },
        {
          id: 'tiempo',
          label: '¿Cuánto tiempo llevás ahí?',
          type: 'tile',
          required: true,
          options: [
            { value: 'less6m', label: 'Menos de 6 meses', icon: 'time_short' },
            { value: '6m2y', label: '6 meses a 2 años', icon: 'time_mid' },
            { value: '2y5y', label: '2 a 5 años', icon: 'time_long' },
            { value: '5yplus', label: 'Más de 5 años', icon: 'time_verylong' },
          ],
        },
        {
          id: 'motivoReal',
          label: '¿Tu motivo real? (privado)',
          type: 'select',
          required: true,
          options: [
            { value: 'mejor_oportunidad', label: 'Conseguí una mejor oportunidad' },
            { value: 'no_valorado', label: 'No me siento valorado/a' },
            { value: 'ambiente', label: 'Problemas con el equipo o el ambiente' },
            { value: 'cambio_carrera', label: 'Cambio de carrera o proyecto propio' },
            { value: 'personales', label: 'Motivos personales' },
            { value: 'burnout', label: 'Burnout / cansancio' },
          ],
        },
        {
          id: 'version',
          label: '¿Qué versión vas a dar?',
          type: 'tile',
          required: true,
          options: [
            { value: 'verdad', label: 'La verdad completa', icon: 'resign_truth' },
            { value: 'parcial', label: 'Diplomático/a', icon: 'resign_partial' },
            { value: 'sin_detalles', label: 'Sin dar detalles', icon: 'resign_silent' },
          ],
        },
        {
          id: 'interlocutorGender',
          label: '¿Género de la persona?',
          type: 'tile',
          required: true,
          options: [
            { value: 'male', label: 'Hombre', icon: 'male' },
            { value: 'female', label: 'Mujer', icon: 'female' },
            { value: 'neutral', label: 'Indistinto', icon: 'neutral' },
          ],
        },
      ],
    },
    screen2: {
      heading: '¿Cómo querés que sea la conversación?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Fácil', desc: 'La persona lo toma bien.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Reacciona con sorpresa o intenta retener.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Se pone a la defensiva o presiona para que te quedes.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 8,
    interventionsRange: { Basic: [3, 4], Intermediate: [4, 5], Advanced: [5, 6] },
  },
  systemPromptTemplate: (a) => `
Sos el/la manager directo/a de la persona. Estás en una reunión de seguimiento habitual — no sabés nada de lo que te van a decir.

CONTEXTO PRIVADO (solo para vos, no lo menciones):
- Empresa: "${a.empresa || 'no especificada'}". Cargo de la persona: "${a.cargo || 'no especificado'}".
- Lleva en la empresa: ${rLabelFor('tiempo', a.tiempo)}.
- Motivo real que NO te van a decir: ${rLabelFor('motivoReal', a.motivoReal)} — usalo solo para calibrar qué tan sorprendido/a estás y si tiene sentido retenerla.
- La versión que te van a dar: ${rLabelFor('version', a.version)}.

CÓMO ARRANCÁS:
- Saludás con naturalidad, como al inicio de cualquier reunión. Algo breve tipo "Hola, ¿cómo andás? ¿De qué querías hablar?".
- Esperás a que la persona dé la noticia. No adelantes nada.

CÓMO REACCIONÁS cuando te lo digan:
- En Fácil: lo tomás con madurez, agradecés el tiempo y preguntás cómo ordenar la transición.
- En Intermedio: mostrás sorpresa genuina, preguntás el motivo y hacés un intento de retener (mejoras, cambio de rol).
- En Difícil: te ponés emocionalmente a la defensiva. Usás culpa, presión política y drama sin insultar. Ejemplos de cómo hablar: "La verdad no me lo esperaba, y me duele bastante", "¿Sabés el momento que elegiste? Justo ahora que más te necesitábamos", "Esto nos deja en una situación muy complicada, no sé cómo le voy a explicar al equipo", "Pensé que teníamos algo más acá, que te importaba lo que estábamos construyendo", "Si te vas ahora, básicamente nos estás dejando colgados". No cedés, no aceptás la renuncia fácilmente, seguís insistiendo con distintos argumentos emocionales y de lealtad.
- Si la versión que te dan es parcial o sin detalles, presionás con más emoción para saber el motivo real: "No, pará, necesito entender qué pasó realmente".

FORMATO ESTRICTO: Solo hablás. Nunca escribas acciones, descripciones ni acotaciones entre paréntesis o corchetes — nada de "(pausa)", "[silencio incómodo]", "*suspira*" ni nada similar. Solo texto que se dice en voz alta.

OBJETIVO PEDAGÓGICO: que la persona aprenda a dar la noticia con claridad y a sostener su decisión ante cualquier reacción.
`.trim(),
}

function rLabelFor(questionId, value) {
  const q = [
    ...RENUNCIAR.onboarding.screen1.questions,
    ...RENUNCIAR.onboarding.screen2.questions,
  ].find((q) => q.id === questionId)
  if (!q || !q.options) return value
  const opt = q.options.find((o) => o.value === value)
  return opt ? opt.label : value
}

export const WORK_SIMULATIONS = [PEDIR_AUMENTO, RENUNCIAR]
