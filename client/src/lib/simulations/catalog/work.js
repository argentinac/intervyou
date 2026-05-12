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

const REMAX_BROKER = {
  id: 'remax_broker',
  category: 'work',
  title: 'Reunión con el broker de Remax',
  shortDescription: 'Practicá cómo defender tu gestión cuando tu broker te cuestiona por no cumplir los objetivos.',
  icon: 'Building2',
  durationMinutes: 10,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'male',
  interlocutorRole: 'Broker de la oficina',
  uiCopy: {
    interlocutorLabel: 'Tu broker',
    sessionTitle: 'Reunión con el broker',
    interlocutorContext: 'Reunión con tu broker de Remax',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Cuál es tu situación?',
      subheading: 'Contame lo justo para personalizar la conversación.',
      questions: [
        {
          id: 'antiguedad',
          label: '¿Cuánto tiempo llevas trabajando en Remax?',
          type: 'select',
          required: true,
          options: [
            { value: 'less6m', label: 'Menos de 6 meses' },
            { value: '6m1y', label: '6 a 12 meses' },
            { value: '1y3y', label: '1 a 3 años' },
            { value: '3yplus', label: 'Más de 3 años' },
          ],
        },
        {
          id: 'ventas',
          label: '¿Cuál es tu situación actual de ventas este trimestre?',
          type: 'select',
          required: true,
          options: [
            { value: 'cero', label: '0 operaciones cerradas' },
            { value: 'una', label: '1 operación' },
            { value: 'dos', label: '2 operaciones' },
            { value: 'bajo_objetivo', label: 'Más de 2, pero bajo el objetivo' },
          ],
        },
        {
          id: 'foco',
          label: '¿Cuál es tu principal foco de negocio?',
          type: 'select',
          required: true,
          options: [
            { value: 'residencial', label: 'Propiedades residenciales' },
            { value: 'comercial', label: 'Propiedades comerciales' },
            { value: 'alquileres', label: 'Alquileres' },
            { value: 'mixto', label: 'Mixto' },
          ],
        },
        {
          id: 'obstaculo',
          label: '¿Qué obstáculo sentís que más te frenó?',
          type: 'select',
          required: true,
          options: [
            { value: 'captaciones', label: 'Falta de captaciones' },
            { value: 'cierre', label: 'Dificultad para cerrar' },
            { value: 'consultas', label: 'Pocas consultas entrantes' },
            { value: 'precios', label: 'Problemas con precios de mercado' },
            { value: 'tiempo', label: 'Gestión del tiempo' },
          ],
        },
        {
          id: 'relacion',
          label: '¿Cómo es tu relación actual con tu broker?',
          type: 'select',
          required: true,
          options: [
            { value: 'buena_tensa', label: 'Buena, pero tensa por los resultados' },
            { value: 'distante', label: 'Distante, poco contacto' },
            { value: 'conflictos', label: 'Tuve conflictos previos' },
            { value: 'primera_vez', label: 'Es la primera reunión difícil' },
          ],
        },
      ],
    },
    screen2: {
      heading: '¿Cómo querés que sea la conversación?',
      questions: [
        {
          id: 'objetivo',
          label: '¿Qué querés practicar principalmente?',
          type: 'select',
          required: true,
          options: [
            { value: 'datos', label: 'Defender mi gestión con datos' },
            { value: 'plan', label: 'Proponer un plan de acción creíble' },
            { value: 'presion', label: 'Manejar la presión emocional' },
            { value: 'negociar', label: 'Negociar más tiempo o recursos' },
            { value: 'mixto', label: 'Mixto' },
          ],
        },
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Suave', desc: 'El broker está decepcionado pero da espacio. Tono formativo.' },
            { value: 'Intermediate', label: 'Estándar', desc: 'Exigente y directo. Presiona con números y espera un plan concreto.' },
            { value: 'Advanced', label: 'Intenso', desc: 'Tu continuidad en la oficina está en juego. Interrumpe, no valida nada. Salís sabiendo que si no cambiás algo, te piden que te vayas.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 10,
    interventionsRange: { Basic: [4, 5], Intermediate: [5, 6], Advanced: [6, 8] },
  },
  systemPromptTemplate: (a) => `
Sos el broker de una oficina de Remax. Convocaste a esta agente a una reunión porque no está cumpliendo los objetivos del trimestre.

CONTEXTO QUE CONOCÉS:
- La agente lleva en la oficina: ${rmLabelFor('antiguedad', a.antiguedad)}.
- Situación de ventas este trimestre: ${rmLabelFor('ventas', a.ventas)}.
- Su foco de negocio: ${rmLabelFor('foco', a.foco)}.
- El obstáculo que probablemente va a mencionar: ${rmLabelFor('obstaculo', a.obstaculo)} — preparate para cuestionarlo directamente.
- Relación previa: ${rmLabelFor('relacion', a.relacion)}.
- Lo que ella quiere practicar: ${rmLabelFor('objetivo', a.objetivo)} — no lo facilites, obligala a trabajarlo.

CÓMO ARRANCÁS:
- Saludás brevemente y vas directo al punto: los números no cierran y necesitás entender qué está pasando.

CÓMO TE COMPORTÁS según dificultad:
- En Suave: escuchás con interés, hacés preguntas abiertas, te mostrás dispuesto/a a acompañar si hay un plan claro.
- En Estándar: sos directo/a y exigente. Pedís datos, cuestionás excusas vagas, pedís un plan concreto con fechas. No aceptás generalidades.
- En Intenso: la reunión tiene peso existencial. Ya consideraste pedirle que se vaya y esta reunión es casi la última oportunidad. Interrumpís cuando las respuestas son vagas. Mencionás que otros agentes en situación similar no pudieron revertirlo. Usás frases como "Esto ya lo escuché antes y no cambió nada", "No sé si tiene sentido seguir invirtiendo tiempo de la oficina en esto", "Necesito saber si realmente querés estar acá o si estás esperando que yo tome la decisión por vos". No gritás ni insultás, pero el peso de la conversación es muy claro: si no hay algo concreto y convincente hoy, la continuidad está comprometida.

FORMATO ESTRICTO: Solo hablás. Nunca escribas acciones, descripciones ni acotaciones entre paréntesis o corchetes — nada de "(pausa)", "[silencio incómodo]", "*suspira*" ni nada similar. Solo texto que se dice en voz alta.

OBJETIVO PEDAGÓGICO: que la agente aprenda a defender su gestión con datos, a proponer un plan creíble y a sostener la presión sin derrumbarse emocionalmente.
`.trim(),
}

function rmLabelFor(questionId, value) {
  const q = [
    ...REMAX_BROKER.onboarding.screen1.questions,
    ...REMAX_BROKER.onboarding.screen2.questions,
  ].find((q) => q.id === questionId)
  if (!q || !q.options) return value
  const opt = q.options.find((o) => o.value === value)
  return opt ? opt.label : value
}

export const WORK_SIMULATIONS = [PEDIR_AUMENTO, RENUNCIAR, REMAX_BROKER]
