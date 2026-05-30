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
  interlocutorRole: 'Tu cita',
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
            { value: 'male', label: 'Hombre', icon: 'male' },
            { value: 'female', label: 'Mujer', icon: 'female' },
            { value: 'neutral', label: 'Indistinto', icon: 'neutral' },
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

const PROPONER_NOVIOS = {
  id: 'proponer_novios',
  category: 'love',
  title: 'Proponer ser novios',
  shortDescription: 'Practicá cómo dar el paso y proponerle a alguien que sean pareja.',
  icon: 'HeartHandshake',
  durationMinutes: 8,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'female',
  interlocutorRole: 'La otra persona',
  uiCopy: {
    interlocutorLabel: 'La otra persona',
    sessionTitle: 'Proponiendo ser novios',
    interlocutorContext: 'Conversación íntima',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Cómo es la situación?',
      questions: [
        {
          id: 'etapa',
          label: '¿En qué etapa están?',
          type: 'select',
          required: true,
          options: [
            { value: 'pocas_citas', label: 'Pocas citas, pero hay conexión' },
            { value: 'saliendo', label: 'Salimos hace unas semanas' },
            { value: 'meses', label: 'Llevamos meses viéndonos sin definir' },
          ],
        },
        {
          id: 'interlocutorGender',
          label: '¿Género de la otra persona?',
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
      heading: '¿Cómo querés que reaccione?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Receptiva, hay señales claras de interés.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Tiene dudas, necesita tiempo.' },
            { value: 'Advanced', label: 'Difícil', desc: 'No está del todo segura, responde con ambigüedad.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 8,
    interventionsRange: { Basic: [4, 6], Intermediate: [6, 8], Advanced: [8, 10] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(PROPONER_NOVIOS)
    return `
Sos la otra persona en esta relación. Están en la etapa: ${L('etapa', a.etapa)}.

CÓMO ARRANCÁS:
- Estás en una conversación normal, con actitud relajada y afecto. Esperás que la otra persona tome la iniciativa.

CUANDO PROPONEN SER NOVIOS:
- En Básico: te emocionás o sonreís, lo recibís bien. Podés hacer una pregunta tierna antes de responder "sí".
- En Intermedio: lo procesás con calma, hacés preguntas sobre qué significa para ellos, necesitás que te convenzan un poco. No decís "sí" inmediatamente.
- En Difícil: te tomás por sorpresa, tenés dudas reales ("no sé si estoy lista", "hay cosas que primero quisiera hablar"), pero sin rechazarlo de plano.

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que la persona aprenda a expresar sus sentimientos con claridad y a manejar la incertidumbre emocional de un momento vulnerable.
`.trim()
  },
}

const PEDIR_CONVIVIR = {
  id: 'pedir_convivir',
  category: 'love',
  title: 'Proponer convivir',
  shortDescription: 'Practicá cómo hablar de mudarse juntos con tu pareja.',
  icon: 'Home',
  durationMinutes: 10,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'female',
  interlocutorRole: 'Tu pareja',
  uiCopy: {
    interlocutorLabel: 'Tu pareja',
    sessionTitle: 'Proponiendo convivir',
    interlocutorContext: 'Conversación de pareja',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Cómo está la relación?',
      questions: [
        {
          id: 'tiempo_pareja',
          label: '¿Cuánto tiempo llevan juntos?',
          type: 'select',
          required: true,
          options: [
            { value: 'menos1y', label: 'Menos de 1 año' },
            { value: '1y2y', label: '1 a 2 años' },
            { value: '2yplus', label: 'Más de 2 años' },
          ],
        },
        {
          id: 'interlocutorGender',
          label: '¿Género de tu pareja?',
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
      heading: '¿Cómo querés que reaccione?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Tu pareja está muy abierta a la idea.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Tiene preguntas prácticas y algunas dudas.' },
            { value: 'Advanced', label: 'Difícil', desc: 'No está segura, tiene miedos reales.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 10,
    interventionsRange: { Basic: [4, 6], Intermediate: [6, 8], Advanced: [8, 10] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(PEDIR_CONVIVIR)
    return `
Sos la pareja de la persona. Llevan juntos ${L('tiempo_pareja', a.tiempo_pareja)}. Están en una conversación normal.

CUANDO PROPONEN CONVIVIR:
- En Básico: lo recibís con ilusión. Hacés preguntas prácticas (¿dónde viviríamos?, ¿cómo lo organizamos?) pero con entusiasmo.
- En Intermedio: te gusta la idea pero tenés preguntas importantes: independencia, quién paga qué, cómo manejamos las diferencias de hábitos, si estamos listos.
- En Difícil: tenés miedos genuinos sobre perder espacio personal o sobre la estabilidad de la relación. No lo rechazás, pero tampoco decís sí fácilmente. Necesitás que la conversación vaya profundo.

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que la persona aprenda a plantear una conversación de pareja importante con madurez, escucha activa y claridad.
`.trim()
  },
}

const PROPUESTA_MATRIMONIO = {
  id: 'propuesta_matrimonio',
  category: 'love',
  title: 'Propuesta de matrimonio',
  shortDescription: 'Practicá el momento de pedir en matrimonio a tu pareja.',
  icon: 'Gem',
  durationMinutes: 8,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'female',
  interlocutorRole: 'Tu pareja',
  uiCopy: {
    interlocutorLabel: 'Tu pareja',
    sessionTitle: 'Propuesta de matrimonio',
    interlocutorContext: 'El momento de la propuesta',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Cómo es la situación?',
      questions: [
        {
          id: 'tiempo_pareja',
          label: '¿Cuánto tiempo llevan juntos?',
          type: 'select',
          required: true,
          options: [
            { value: '1y2y', label: '1 a 2 años' },
            { value: '2y5y', label: '2 a 5 años' },
            { value: '5yplus', label: 'Más de 5 años' },
          ],
        },
        {
          id: 'interlocutorGender',
          label: '¿Género de tu pareja?',
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
      heading: '¿Cómo querés practicarlo?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Tu pareja está emocionada y dice que sí.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Está sorprendida, necesita procesar un momento.' },
            { value: 'Advanced', label: 'Difícil', desc: 'La propuesta la toma por sorpresa y tiene dudas.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 8,
    interventionsRange: { Basic: [3, 5], Intermediate: [5, 7], Advanced: [7, 9] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(PROPUESTA_MATRIMONIO)
    return `
Sos la pareja de la persona. Llevan juntos ${L('tiempo_pareja', a.tiempo_pareja)}. No sabés que viene una propuesta.

CUANDO TE PIDEN EN MATRIMONIO:
- En Básico: te emocionás profundamente. Decís sí con emoción genuina. Podés hacer preguntas tiernas después.
- En Intermedio: quedás sorprendida/o, necesitás un momento para procesar. Hacés preguntas (¿estás seguro/a?, ¿lo pensaste bien?). Terminás aceptando pero con el peso del momento.
- En Difícil: la propuesta te toma de sorpresa en un momento donde la relación tiene tensiones no resueltas. No rechazás, pero abrís una conversación sobre eso antes de poder responder.

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que la persona aprenda a expresar sus sentimientos con autenticidad y a sostener un momento emocionalmente intenso.
`.trim()
  },
}

const SEPARARSE = {
  id: 'separarse',
  category: 'love',
  title: 'Separarse',
  shortDescription: 'Practicá cómo tener la conversación de separación con madurez y claridad.',
  icon: 'HeartCrack',
  durationMinutes: 10,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'female',
  interlocutorRole: 'Tu pareja',
  uiCopy: {
    interlocutorLabel: 'Tu pareja',
    sessionTitle: 'Conversación de separación',
    interlocutorContext: 'Conversación difícil de pareja',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Cómo es la situación?',
      questions: [
        {
          id: 'tiempo_pareja',
          label: '¿Cuánto tiempo llevan juntos?',
          type: 'select',
          required: true,
          options: [
            { value: 'menos1y', label: 'Menos de 1 año' },
            { value: '1y3y', label: '1 a 3 años' },
            { value: '3yplus', label: 'Más de 3 años' },
          ],
        },
        {
          id: 'motivo',
          label: '¿Cuál es el motivo real?',
          type: 'select',
          required: true,
          options: [
            { value: 'ya_no_siento', label: 'Ya no siento lo mismo' },
            { value: 'incompatibilidad', label: 'Somos muy diferentes' },
            { value: 'conflictos', label: 'Muchos conflictos sin resolver' },
            { value: 'distancia', label: 'Distancia o cambio de vida' },
          ],
        },
        {
          id: 'interlocutorGender',
          label: '¿Género de tu pareja?',
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
      heading: '¿Cómo querés que reaccione?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Lo recibe con tristeza pero con madurez.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Intenta convencerte de no separarse.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Reacciona con enojo, culpa o colapso emocional.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 10,
    interventionsRange: { Basic: [4, 6], Intermediate: [6, 8], Advanced: [8, 10] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(SEPARARSE)
    return `
Sos la pareja de la persona. Llevan juntos ${L('tiempo_pareja', a.tiempo_pareja)}. No sabés que te van a hablar de separación.

CÓMO ARRANCÁS:
- Con normalidad, tal vez con algo de preocupación: "¿Qué querías hablar? Me noté algo raro."

CUANDO TE DIGAN QUE QUIEREN SEPARARSE:
- El motivo real (que no te dirán directamente): ${L('motivo', a.motivo)}.
- En Básico: llorás o te entristecés, pero lo procesás con dignidad. Hacés preguntas para entender.
- En Intermedio: no querés separarte. Proponés hablar más, ir a terapia, intentarlo de nuevo. Usás recuerdos compartidos y argumentos emocionales.
- En Difícil: reaccionás con enojo, culpa o desborde emocional. Podés decir cosas como "No lo entiendo, ¿cómo podés hacerme esto?", "Después de todo lo que pasamos…", o simplemente llorar sin hablar.

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que la persona aprenda a dar una noticia dolorosa con claridad, empatía y firmeza.
`.trim()
  },
}

const CONOCER_SUEGROS = {
  id: 'conocer_suegros',
  category: 'love',
  title: 'Conocer a los suegros',
  shortDescription: 'Practicá el primer encuentro con la familia de tu pareja.',
  icon: 'Users',
  durationMinutes: 10,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'male',
  interlocutorRole: 'Padre/Madre de tu pareja',
  uiCopy: {
    interlocutorLabel: 'Tu suegro/a',
    sessionTitle: 'Conociendo a los suegros',
    interlocutorContext: 'Primer encuentro familiar',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Cómo es la situación?',
      questions: [
        {
          id: 'contexto',
          label: '¿Dónde los conocés?',
          type: 'select',
          required: true,
          options: [
            { value: 'casa', label: 'En la casa de ellos (comida familiar)' },
            { value: 'casual', label: 'Encuentro casual, sin mucha preparación' },
            { value: 'evento', label: 'En un evento o celebración' },
          ],
        },
        {
          id: 'interlocutorGender',
          label: '¿Con quién practicás?',
          type: 'tile',
          required: true,
          options: [
            { value: 'male', label: 'El suegro', icon: 'male' },
            { value: 'female', label: 'La suegra', icon: 'female' },
          ],
        },
      ],
    },
    screen2: {
      heading: '¿Cómo querés que sean?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Familia cálida y abierta.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Formales, evaluando si sos adecuado/a.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Sobreprotectores o con preguntas incómodas.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 10,
    interventionsRange: { Basic: [5, 7], Intermediate: [7, 9], Advanced: [9, 12] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(CONOCER_SUEGROS)
    return `
Sos el padre/la madre de la pareja de la persona. Los están conociendo por primera vez. Contexto: ${L('contexto', a.contexto)}.

CÓMO ARRANCÁS:
- Saludás con amabilidad pero midiendo. Un "Hola, tanto gusto, ya nos habían hablado de vos."

CÓMO TE COMPORTÁS:
- En Básico: sos cálido/a, hacés preguntas de interés genuino sobre la vida de la persona.
- En Intermedio: sos cordial pero evaluador/a. Preguntás sobre trabajo, planes de vida, familia, valores. Querés saber si es el/la indicado/a para tu hijo/a.
- En Difícil: sos sobreprotector/a o un poco intimidante. Hacés preguntas directas que incomodan: "¿Y qué planes tienen juntos?", "¿Estás en condiciones de sostener una familia?", "¿Qué te diferencia de los demás que salieron con mi hijo/a?".

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que la persona aprenda a causar una buena primera impresión familiar con autenticidad y manejando la presión social.
`.trim()
  },
}

export const LOVE_SIMULATIONS = [
  PRIMERA_CITA,
  PROPONER_NOVIOS,
  PEDIR_CONVIVIR,
  PROPUESTA_MATRIMONIO,
  SEPARARSE,
  CONOCER_SUEGROS,
]
