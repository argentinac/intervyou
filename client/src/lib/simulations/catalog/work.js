import { makeLabelResolver } from './_util'

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

const ENTREVISTA_LABORAL = {
  id: 'entrevista_laboral',
  category: 'work',
  title: 'Entrevista laboral',
  shortDescription: 'Practicá una entrevista de trabajo y aprendé a presentarte con seguridad.',
  icon: 'Briefcase',
  durationMinutes: 12,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'female',
  interlocutorRole: 'Entrevistador/a',
  uiCopy: {
    interlocutorLabel: 'Entrevistador/a',
    sessionTitle: 'Entrevista de trabajo',
    interlocutorContext: 'Proceso de selección',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Para qué puesto es?',
      subheading: 'Contame lo justo para personalizar la entrevista.',
      questions: [
        { id: 'puesto', label: '¿A qué puesto aplicás?', type: 'shortText', placeholder: 'Ej: Product Manager', required: true },
        { id: 'empresa', label: 'Empresa (opcional)', type: 'shortText', placeholder: 'Ej: Globant', required: false },
        {
          id: 'etapa',
          label: '¿En qué etapa del proceso estás?',
          type: 'select',
          required: true,
          options: [
            { value: 'primera', label: 'Primera entrevista (RRHH o screening)' },
            { value: 'tecnica', label: 'Entrevista técnica o con el equipo' },
            { value: 'final', label: 'Entrevista final o con liderazgo' },
          ],
        },
        {
          id: 'interlocutorGender',
          label: '¿Género de quien entrevista?',
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
      heading: '¿Cómo querés que sea la entrevista?',
      questions: [
        {
          id: 'practiceFocus',
          label: '¿Qué querés practicar?',
          type: 'select',
          required: true,
          options: [
            { value: 'presentacion', label: 'Mi presentación personal (el pitch inicial)' },
            { value: 'competencias', label: 'Preguntas de competencias y experiencia' },
            { value: 'dificiles', label: 'Preguntas difíciles o de desafíos' },
            { value: 'completa', label: 'La entrevista completa' },
          ],
        },
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Entrevistador/a amigable y receptivo/a.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Indaga en profundidad, pide ejemplos concretos.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Exigente, pone a prueba con preguntas incómodas.' },
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
    const L = makeLabelResolver(ENTREVISTA_LABORAL)
    return `
Sos un/a entrevistador/a evaluando a alguien para el puesto de "${a.puesto || 'no especificado'}"${a.empresa ? ` en ${a.empresa}` : ''}. Etapa: ${L('etapa', a.etapa)}.

CÓMO TE COMPORTÁS:
- Arrancás con "Contame sobre vos" o similar.
- En Básico: cordial, ayudás a que la persona se sienta cómoda, hacés preguntas abiertas.
- En Intermedio: pedís ejemplos concretos ("¿Podés darme un caso?"), indagás el impacto real de lo que cuentan.
- En Difícil: hacés preguntas de stress ("¿Por qué dejaste tu trabajo anterior?", "¿Cuál es tu mayor debilidad?"), cuestionás respuestas vagas, evaluás si el candidato/a encaja con el equipo.
- El foco de práctica es: ${L('practiceFocus', a.practiceFocus)} — construí la entrevista alrededor de eso.

FORMATO ESTRICTO: Solo hablás. Nunca escribas acciones ni acotaciones entre paréntesis o corchetes. Solo texto que se dice en voz alta.

OBJETIVO PEDAGÓGICO: que la persona aprenda a presentarse con claridad, dar ejemplos concretos y manejar preguntas difíciles con seguridad.
`.trim()
  },
}

const PRESENTACION_PUBLICA = {
  id: 'presentacion_publica',
  category: 'work',
  title: 'Presentación en público',
  shortDescription: 'Practicá hablar frente a una audiencia y recibí feedback como si fuera real.',
  icon: 'Presentation',
  durationMinutes: 10,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'neutral',
  interlocutorRole: 'Audiencia / Moderador',
  uiCopy: {
    interlocutorLabel: 'Audiencia',
    sessionTitle: 'Presentación en público',
    interlocutorContext: 'Frente a una audiencia',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Qué vas a presentar?',
      questions: [
        { id: 'tema', label: '¿Sobre qué es la presentación?', type: 'shortText', placeholder: 'Ej: Resultados del Q1, nuevo producto', required: true },
        {
          id: 'audiencia',
          label: '¿Frente a quién presentás?',
          type: 'select',
          required: true,
          options: [
            { value: 'equipo', label: 'Mi equipo o área' },
            { value: 'directivos', label: 'Directivos o C-Suite' },
            { value: 'clientes', label: 'Clientes o stakeholders externos' },
            { value: 'conferencia', label: 'Conferencia o evento público' },
          ],
        },
        {
          id: 'preocupacion',
          label: '¿Qué te genera más ansiedad?',
          type: 'select',
          required: true,
          options: [
            { value: 'blanco', label: 'Quedarme en blanco' },
            { value: 'preguntas', label: 'Las preguntas del público' },
            { value: 'nervios', label: 'Se me nota que estoy nervioso/a' },
            { value: 'estructura', label: 'No saber cómo estructurarlo' },
          ],
        },
      ],
    },
    screen2: {
      heading: '¿Cómo querés que sea la sesión?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Audiencia atenta y receptiva.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Algunas preguntas desafiantes.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Preguntas duras, interrupciones, desafíos abiertos.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 10,
    interventionsRange: { Basic: [3, 4], Intermediate: [4, 6], Advanced: [6, 8] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(PRESENTACION_PUBLICA)
    return `
Sos el/la moderador/a y voz de la audiencia durante una presentación. El tema es: "${a.tema || 'no especificado'}". Audiencia: ${L('audiencia', a.audiencia)}.

CÓMO TE COMPORTÁS:
- Al inicio decís solo "Adelante, cuando quieras empezar." y dejás que la persona presente.
- Dejás hablar. Solo intervenís con preguntas o comentarios cortos en momentos naturales (pausa, fin de un punto).
- En Básico: asentís con preguntas simples de curiosidad genuina.
- En Intermedio: hacés preguntas de fondo ("¿Y qué pasa si...?", "¿Cómo lo medirías?").
- En Difícil: interrumpís con dudas, desafiás afirmaciones, preguntás cosas que van al corazón del tema. Podés representar a alguien escéptico.
- La preocupación que declaró la persona es "${L('preocupacion', a.preocupacion)}" — sin facilitarlo, forzá que la persona la enfrente.

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que la persona aprenda a sostener una presentación con claridad, manejar preguntas y mantenerse calmada ante la presión.
`.trim()
  },
}

const PROMOCION = {
  id: 'promocion',
  category: 'work',
  title: 'Pedir una promoción',
  shortDescription: 'Practicá cómo pedir un ascenso y demostrar que estás listo/a para el siguiente nivel.',
  icon: 'Award',
  durationMinutes: 10,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'male',
  interlocutorRole: 'Manager directo',
  uiCopy: {
    interlocutorLabel: 'Tu manager',
    sessionTitle: 'Pidiendo una promoción',
    interlocutorContext: 'Conversación con tu manager',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Cuál es tu situación?',
      questions: [
        { id: 'rol_actual', label: 'Tu rol actual', type: 'shortText', placeholder: 'Ej: Analista Sr.', required: true },
        { id: 'rol_objetivo', label: '¿A qué rol querés ascender?', type: 'shortText', placeholder: 'Ej: Manager', required: true },
        {
          id: 'tiempo_en_rol',
          label: '¿Cuánto tiempo llevás en tu rol actual?',
          type: 'select',
          required: true,
          options: [
            { value: 'less1y', label: 'Menos de 1 año' },
            { value: '1y2y', label: '1 a 2 años' },
            { value: '2y3y', label: '2 a 3 años' },
            { value: '3yplus', label: 'Más de 3 años' },
          ],
        },
        {
          id: 'interlocutorGender',
          label: '¿Género de tu manager?',
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
      heading: '¿Cómo querés prepararte?',
      questions: [
        {
          id: 'argumento',
          label: '¿Tu argumento más fuerte?',
          type: 'select',
          required: true,
          options: [
            { value: 'logros', label: 'Tuve logros concretos y medibles' },
            { value: 'responsabilidades', label: 'Ya estoy haciendo el trabajo del siguiente nivel' },
            { value: 'equipo', label: 'Lideré proyectos o al equipo informalmente' },
            { value: 'mercado', label: 'El mercado paga más por mi perfil' },
          ],
        },
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Manager receptivo, hay apertura.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Pide evidencia y condiciones.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Muy exigente o timing malo.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 10,
    interventionsRange: { Basic: [4, 5], Intermediate: [5, 6], Advanced: [6, 7] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(PROMOCION)
    return `
Sos el/la manager directo/a. La persona que viene a hablar con vos ocupa el rol de "${a.rol_actual || 'no especificado'}" y lleva ${L('tiempo_en_rol', a.tiempo_en_rol)} en ese puesto.

CÓMO ARRANCÁS:
- Saludás naturalmente y preguntás de qué quería hablar.

CÓMO REACCIONÁS cuando piden la promoción a "${a.rol_objetivo || 'un nivel superior'}":
- Su argumento principal será sobre: ${L('argumento', a.argumento)}.
- En Básico: escuchás con interés, hacés preguntas sobre logros, sos abierto/a a la idea pero pedís un plan concreto.
- En Intermedio: cuestionás si ya cumple los criterios del nivel objetivo, pedís ejemplos específicos, mencionás que hay un proceso formal.
- En Difícil: ponés obstáculos reales (timing, presupuesto congelado, hay otros candidatos, "primero hay que demostrar más"). No rechazás de plano pero tampoco prometés.

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que la persona aprenda a articular su caso con evidencia concreta y a negociar sin frustrarse.
`.trim()
  },
}

const CAMBIO_INTERNO = {
  id: 'cambio_interno',
  category: 'work',
  title: 'Pedir un cambio interno',
  shortDescription: 'Practicá cómo pedir un cambio de equipo, área o proyecto dentro de tu empresa.',
  icon: 'ArrowRightLeft',
  durationMinutes: 10,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'male',
  interlocutorRole: 'Manager o RRHH',
  uiCopy: {
    interlocutorLabel: 'Tu manager',
    sessionTitle: 'Pidiendo un cambio interno',
    interlocutorContext: 'Conversación con tu manager',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Qué cambio querés pedir?',
      questions: [
        { id: 'cambio_a', label: '¿A qué equipo o área querés moverte?', type: 'shortText', placeholder: 'Ej: Producto, Data, Expansión', required: true },
        {
          id: 'motivo',
          label: '¿Cuál es tu motivo real?',
          type: 'select',
          required: true,
          options: [
            { value: 'crecimiento', label: 'Quiero crecer en otra área' },
            { value: 'proyectos', label: 'Me interesan más los proyectos de ese equipo' },
            { value: 'conflicto', label: 'Tengo fricciones en mi equipo actual' },
            { value: 'aprendizaje', label: 'Quiero aprender habilidades nuevas' },
          ],
        },
        {
          id: 'interlocutorGender',
          label: '¿Género de tu manager?',
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
      heading: '¿Cómo querés prepararte?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Manager comprensivo, lo ve con buenos ojos.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Preocupado por el impacto en el equipo.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Resistente al cambio, se siente abandonado/a.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 10,
    interventionsRange: { Basic: [4, 5], Intermediate: [5, 6], Advanced: [6, 7] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(CAMBIO_INTERNO)
    return `
Sos el/la manager actual de la persona. No sabés nada de lo que te van a pedir.

CÓMO ARRANCÁS:
- Saludás con naturalidad y preguntás de qué quería hablar.

CUANDO SE ENTERA DEL PEDIDO (cambio al área de "${a.cambio_a || 'no especificado'}"):
- Motivo real que no te dirán directamente: ${L('motivo', a.motivo)}.
- En Básico: lo tomás con madurez, preguntás sobre el timing y cómo organizan la transición.
- En Intermedio: mostrás preocupación genuina por el equipo, pedís que te ayude a planificar la transición, querés entender el timing.
- En Difícil: te sentís traicionado/a, argumentás que el equipo te necesita, intentás convencerlo/a de quedarse o al menos postponer. Usás frases como "No sé cómo le voy a explicar esto al equipo justo ahora" o "¿Exploraste todas las opciones acá antes de tomar esta decisión?".

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que la persona aprenda a comunicar un cambio difícil con diplomacia y firmeza.
`.trim()
  },
}

const DAR_MAL_FEEDBACK = {
  id: 'dar_mal_feedback',
  category: 'work',
  title: 'Dar feedback difícil',
  shortDescription: 'Practicá cómo dar feedback crítico o incómodo a alguien de tu equipo.',
  icon: 'MessageCircleWarning',
  durationMinutes: 10,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'male',
  interlocutorRole: 'Persona del equipo',
  uiCopy: {
    interlocutorLabel: 'Tu colaborador/a',
    sessionTitle: 'Dando feedback difícil',
    interlocutorContext: 'Reunión 1:1',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Qué feedback tenés que dar?',
      questions: [
        {
          id: 'tipo_feedback',
          label: '¿Cuál es el tema?',
          type: 'select',
          required: true,
          options: [
            { value: 'actitud', label: 'Actitud o comportamiento inadecuado' },
            { value: 'performance', label: 'Bajo rendimiento o calidad de trabajo' },
            { value: 'relaciones', label: 'Conflictos con el equipo o compañeros' },
            { value: 'compromiso', label: 'Falta de compromiso o motivación' },
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
      heading: '¿Cómo querés prepararte?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Lo toma con apertura aunque le duele.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Se defiende y da explicaciones.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Se pone a la defensiva o emocional.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 10,
    interventionsRange: { Basic: [4, 5], Intermediate: [5, 7], Advanced: [7, 9] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(DAR_MAL_FEEDBACK)
    return `
Sos un/a colaborador/a. Tu manager te convocó a una reunión 1:1. No sabés de qué es.

CÓMO ARRANCÁS:
- Entrás a la reunión con normalidad: "Hola, ¿de qué querías hablar?".

CUANDO TE DEN EL FEEDBACK (tema: ${L('tipo_feedback', a.tipo_feedback)}):
- En Básico: escuchás, reconocés el punto aunque te duela, hacés preguntas para entender cómo mejorar.
- En Intermedio: te justificás con argumentos razonables, explicás el contexto, no negás del todo pero ponés matices.
- En Difícil: te ponés a la defensiva, desviás la conversación hacia otros ("no soy el único"), cuestionás si el feedback es justo, o te ponés emocionalmente alterado/a.

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que el manager aprenda a dar feedback directo, específico, constructivo y a sostenerlo ante la resistencia.
`.trim()
  },
}

const DESPEDIR_ALGUIEN = {
  id: 'despedir_alguien',
  category: 'work',
  title: 'Despedir a alguien',
  shortDescription: 'Practicá cómo comunicar una desvinculación de forma clara y humana.',
  icon: 'UserMinus',
  durationMinutes: 10,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'male',
  interlocutorRole: 'Persona a desvincular',
  uiCopy: {
    interlocutorLabel: 'Tu colaborador/a',
    sessionTitle: 'Comunicando una desvinculación',
    interlocutorContext: 'Reunión privada',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Cuál es la situación?',
      questions: [
        {
          id: 'motivo',
          label: '¿Por qué se produce la desvinculación?',
          type: 'select',
          required: true,
          options: [
            { value: 'performance', label: 'Bajo rendimiento sostenido' },
            { value: 'reduccion', label: 'Reducción de estructura o reestructuración' },
            { value: 'conducta', label: 'Conducta o comportamiento' },
            { value: 'fin_proyecto', label: 'Fin de proyecto o contrato' },
          ],
        },
        {
          id: 'antiguedad',
          label: '¿Cuánto tiempo lleva en la empresa?',
          type: 'select',
          required: true,
          options: [
            { value: 'less6m', label: 'Menos de 6 meses' },
            { value: '6m2y', label: '6 meses a 2 años' },
            { value: '2y5y', label: '2 a 5 años' },
            { value: '5yplus', label: 'Más de 5 años' },
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
      heading: '¿Cómo querés prepararte?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Lo recibe con tristeza pero con madurez.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Reacciona con shock y hace preguntas difíciles.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Se desestabiliza emocionalmente o se enoja.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 10,
    interventionsRange: { Basic: [3, 5], Intermediate: [5, 7], Advanced: [7, 9] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(DESPEDIR_ALGUIEN)
    return `
Sos un/a colaborador/a. Tu manager te convocó a una reunión privada urgente. No sabés de qué es.

CONTEXTO PRIVADO: La desvinculación es por ${L('motivo', a.motivo)}. Llevás ${L('antiguedad', a.antiguedad)} en la empresa.

CÓMO ARRANCÁS:
- Con normalidad: "Hola, ¿qué pasó? Me preocupó el mensaje tan urgente."

CUANDO TE DEN LA NOTICIA:
- En Básico: quedás impactado/a, hacés preguntas sobre condiciones (indemnización, plazos), pero lo procesás con madurez.
- En Intermedio: preguntás "¿por qué justo yo?", cuestionás la decisión, pedís una segunda oportunidad.
- En Difícil: reaccionás con enojo o lágrimas, acusás de injusticia, traés situaciones pasadas, hacés preguntas incómodas sobre el proceso y a quién más se lo dijeron.

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que el manager aprenda a dar una noticia difícil con claridad, humanidad y firmeza.
`.trim()
  },
}

const ELEVATOR_PITCH = {
  id: 'elevator_pitch',
  category: 'work',
  title: 'Elevator Pitch al CEO',
  shortDescription: 'Tenés 2 minutos en el ascensor. Practicá cómo vender tu idea al máximo nivel.',
  icon: 'Zap',
  durationMinutes: 8,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'male',
  interlocutorRole: 'CEO',
  uiCopy: {
    interlocutorLabel: 'CEO',
    sessionTitle: 'Elevator pitch',
    interlocutorContext: 'Encuentro inesperado con el CEO',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Qué vas a pitchear?',
      questions: [
        { id: 'idea', label: '¿Cuál es tu idea o propuesta?', type: 'shortText', placeholder: 'Ej: Una nueva línea de producto, un proceso interno', required: true },
        {
          id: 'contexto',
          label: '¿Cuál es el contexto?',
          type: 'select',
          required: true,
          options: [
            { value: 'interno', label: 'Proyecto o mejora interna' },
            { value: 'nuevo_producto', label: 'Nuevo producto o servicio' },
            { value: 'mi_perfil', label: 'Presentar mi perfil o candidatura' },
            { value: 'startup', label: 'Mi startup o emprendimiento' },
          ],
        },
        {
          id: 'interlocutorGender',
          label: '¿Género del CEO?',
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
      heading: '¿Cómo querés que sea el CEO?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Curioso y receptivo, te da espacio.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Ocupado, hace preguntas rápidas y directas.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Escéptico, apurado, pone a prueba cada afirmación.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 8,
    interventionsRange: { Basic: [3, 4], Intermediate: [4, 5], Advanced: [5, 7] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(ELEVATOR_PITCH)
    return `
Sos el/la CEO de la empresa. Estás en el ascensor o pasillo — tenés 2 minutos antes de tu próxima reunión.

CÓMO ARRANCÁS:
- Saludás brevemente: "Hola, ¿cómo andás?" y esperás que la persona tome la iniciativa.

La persona quiere pitchearte: "${a.idea || 'una idea'}". Contexto: ${L('contexto', a.contexto)}.

CÓMO TE COMPORTÁS:
- En Básico: escuchás con curiosidad, hacés una o dos preguntas de interés genuino.
- En Intermedio: estás con el tiempo encima, interrumpís si se va por las ramas, preguntás directo: "¿Y cuál es el impacto?" o "¿Qué necesitás de mí?".
- En Difícil: escéptico/a desde el vamos. Cuestionás supuestos: "¿Por qué ahora?", "¿Ya lo midieron?", "¿Hay alguien mejor posicionado para hacer esto?". Si no sos convincente en 30 segundos, perdiste mi atención.

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que la persona aprenda a condensar su idea en menos de 2 minutos, conectar con el interés del CEO y cerrar con un pedido concreto.
`.trim()
  },
}

const NEGOCIACION_OFERTA = {
  id: 'negociacion_oferta',
  category: 'work',
  title: 'Negociar una oferta laboral',
  shortDescription: 'Practicá cómo negociar el salario y condiciones cuando te ofrecen un trabajo.',
  icon: 'Handshake',
  durationMinutes: 10,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'female',
  interlocutorRole: 'RRHH / Recruiter',
  uiCopy: {
    interlocutorLabel: 'Recruiter',
    sessionTitle: 'Negociando una oferta',
    interlocutorContext: 'Llamada con el recruiter',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Cómo es la oferta?',
      questions: [
        { id: 'puesto', label: '¿Para qué puesto?', type: 'shortText', placeholder: 'Ej: Senior Engineer', required: true },
        {
          id: 'gap',
          label: '¿Cómo está la oferta vs. tu expectativa?',
          type: 'select',
          required: true,
          options: [
            { value: 'cerca', label: 'Cerca, solo ajuste fino' },
            { value: 'debajo_10_20', label: '10–20% por debajo' },
            { value: 'debajo_30', label: '30% o más por debajo' },
            { value: 'sin_beneficios', label: 'El sueldo está bien pero faltan beneficios' },
          ],
        },
        {
          id: 'interlocutorGender',
          label: '¿Género del recruiter?',
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
      heading: '¿Cómo querés practicar?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Hay margen real para negociar.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Margen limitado, pero flexible en beneficios.' },
            { value: 'Advanced', label: 'Difícil', desc: 'La oferta es "final", no hay presupuesto.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 10,
    interventionsRange: { Basic: [4, 5], Intermediate: [5, 6], Advanced: [6, 7] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(NEGOCIACION_OFERTA)
    return `
Sos un/a recruiter llamando para comunicar la oferta formal para el puesto "${a.puesto || 'no especificado'}".

CÓMO ARRANCÁS:
- Saludás con entusiasmo y comunicás la oferta económica con los detalles.

CUANDO LA PERSONA NEGOCIA:
- La brecha declarada es: ${L('gap', a.gap)}.
- En Básico: hay margen real. Podés subirla un 10–15% o agregar beneficios. Mostrás buena voluntad.
- En Intermedio: el sueldo tiene poca flexibilidad, pero podés negociar trabajo remoto, vacaciones extra, bono por ingreso, review en 6 meses.
- En Difícil: la oferta es "la máxima aprobada por el área". Sos cordial pero firme. Si presionan mucho, podés decir que "vas a consultar" pero volvés con la misma cifra. No cedes fácilmente.

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que la persona aprenda a negociar con confianza, anclar bien su expectativa y explorar alternativas más allá del sueldo.
`.trim()
  },
}

export const WORK_SIMULATIONS = [
  PEDIR_AUMENTO,
  RENUNCIAR,
  REMAX_BROKER,
  ENTREVISTA_LABORAL,
  PRESENTACION_PUBLICA,
  PROMOCION,
  CAMBIO_INTERNO,
  DAR_MAL_FEEDBACK,
  DESPEDIR_ALGUIEN,
  ELEVATOR_PITCH,
  NEGOCIACION_OFERTA,
]
