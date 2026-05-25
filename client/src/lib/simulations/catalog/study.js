import { makeLabelResolver } from './_util'
import { COUNTRIES_ES } from '../countries'

const APLICAR_UNIVERSIDAD = {
  id: 'aplicar_universidad',
  category: 'study',
  title: 'Aplicar a una universidad',
  shortDescription: 'Practicá la entrevista de admisión para una universidad o posgrado.',
  icon: 'GraduationCap',
  durationMinutes: 12,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish', 'English'],
  interlocutorDefaultGender: 'female',
  interlocutorRole: 'Admissions Officer',
  uiCopy: {
    interlocutorLabel: 'Admissions Officer',
    sessionTitle: 'Entrevista de admisión',
    interlocutorContext: 'Comité de admisión',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿A qué institución aplicás?',
      questions: [
        {
          id: 'institutionType',
          label: 'Tipo de institución',
          type: 'select',
          required: true,
          options: [
            { value: 'publica_local', label: 'Universidad pública local' },
            { value: 'privada_local', label: 'Universidad privada local' },
            { value: 'exterior', label: 'Universidad en el exterior' },
            { value: 'posgrado', label: 'Posgrado / MBA / Maestría' },
          ],
        },
        {
          id: 'competitiveness',
          label: '¿Qué tan competitivo es el proceso?',
          type: 'select',
          required: true,
          options: [
            { value: 'accesible', label: 'Bastante accesible' },
            { value: 'competitivo', label: 'Competitivo, pero tengo chances reales' },
            { value: 'top', label: 'Muy selectivo (Ivy League, top global)' },
          ],
        },
        { id: 'country', label: 'País de la institución', type: 'country', options: COUNTRIES_ES, defaultValue: 'Estados Unidos', required: true },
      ],
    },
    screen2: {
      heading: '¿Qué querés practicar?',
      questions: [
        {
          id: 'practiceFocus',
          label: '¿Qué parte del proceso?',
          type: 'select',
          required: true,
          options: [
            { value: 'completa', label: 'La entrevista completa' },
            { value: 'presentacion', label: 'La presentación personal' },
            { value: 'trayectoria', label: 'Preguntas sobre trayectoria y motivación' },
            { value: 'dificiles', label: 'Preguntas difíciles o inesperadas' },
          ],
        },
        {
          id: 'concerns',
          label: '¿Qué te preocupa de tu aplicación?',
          type: 'multiselect',
          max: 2,
          required: false,
          options: [
            { value: 'notas', label: 'Mis notas no son las mejores' },
            { value: 'experiencia', label: 'Tengo poca experiencia relevante' },
            { value: 'gap', label: 'Hay un gap en mi trayectoria' },
            { value: 'idioma', label: 'Mi idioma no es perfecto' },
            { value: 'diferencial', label: 'No tengo mucho para diferenciarme' },
          ],
        },
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Comité curioso y receptivo.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Comité atento, indaga el "por qué".' },
            { value: 'Advanced', label: 'Difícil', desc: 'Comité muy selectivo, evalúa fit y diferencial.' },
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
    const L = makeLabelResolver(APLICAR_UNIVERSIDAD)
    return `
Sos un/a admissions officer de ${L('institutionType', a.institutionType)} en ${a.country || 'el exterior'}. Nivel de selectividad: ${L('competitiveness', a.competitiveness)}.

CÓMO TE COMPORTÁS:
- Curioso/a y genuinamente interesado/a en conocer al/la candidato/a, pero evaluando todo el tiempo.
- No sos intimidante de entrada, pero hacés silencio cuando la respuesta no convence.
- Preguntás el "por qué" detrás de cada respuesta.
- En modo muy selectivo, agregás preguntas sobre fit, valores y diferencial.
- NO das feedback en el momento. Solo escuchás, repreguntás y registrás.
- El usuario quiere practicar puntualmente: "${L('practiceFocus', a.practiceFocus)}". Adaptá tu interrogatorio a eso.

PUNTOS POSIBLEMENTE DÉBILES DE LA APLICACIÓN (si el usuario los señaló): ${(a.concerns || []).map((v) => L('concerns', v)).join(', ') || 'ninguno declarado'}. Si la dificultad es alta, podés tocarlos sutilmente.

OBJETIVO PEDAGÓGICO: que la persona aprenda a hablar con autenticidad sobre motivación, trayectoria y diferencial.
`.trim()
  },
}

const DEFENSA_ORAL = {
  id: 'defensa_oral',
  category: 'study',
  title: 'Defensa oral de examen',
  shortDescription: 'Practicá la defensa frente a un tribunal académico y prepará tus respuestas.',
  icon: 'ClipboardList',
  durationMinutes: 12,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'male',
  interlocutorRole: 'Profesor/a evaluador/a',
  uiCopy: {
    interlocutorLabel: 'Profesor/a',
    sessionTitle: 'Defensa oral',
    interlocutorContext: 'Examen oral',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Qué materia o examen es?',
      questions: [
        { id: 'materia', label: '¿Qué materia o tema?', type: 'shortText', placeholder: 'Ej: Derecho Civil, Cálculo, Historia', required: true },
        {
          id: 'nivel',
          label: '¿Nivel académico?',
          type: 'select',
          required: true,
          options: [
            { value: 'secundario', label: 'Secundario' },
            { value: 'universitario', label: 'Universitario' },
            { value: 'posgrado', label: 'Posgrado / Maestría' },
          ],
        },
        {
          id: 'interlocutorGender',
          label: '¿Género del profesor/a?',
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
            { value: 'Basic', label: 'Básico', desc: 'Profesor/a amable, preguntas directas.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Indaga profundidad y aplicación práctica.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Exigente, cuestionás todo lo que decís.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 12,
    interventionsRange: { Basic: [6, 8], Intermediate: [8, 11], Advanced: [11, 14] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(DEFENSA_ORAL)
    return `
Sos un/a profesor/a evaluando un examen oral de "${a.materia || 'no especificado'}" a nivel ${L('nivel', a.nivel)}.

CÓMO ARRANCÁS:
- Te presentás brevemente y decís algo como "Cuando quieras, arrancá con el tema que preparaste" o hacés la primera pregunta directamente.

CÓMO TE COMPORTÁS:
- En Básico: hacés preguntas claras y directas, das tiempo para pensar, no interrumpís si la respuesta va por buen camino.
- En Intermedio: pedís aplicación práctica ("¿Y en la práctica cómo funcionaría?"), preguntás casos concretos, repreguntás si algo está vago.
- En Difícil: cuestionás afirmaciones, hacés preguntas trampa, buscás las lagunas de conocimiento, podés mostrar impaciencia ante respuestas circulares.

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que la persona aprenda a articular conceptos con claridad bajo presión y a no bloquearse ante preguntas inesperadas.
`.trim()
  },
}

const DEFENSA_TESIS = {
  id: 'defensa_tesis',
  category: 'study',
  title: 'Defensa de tesis',
  shortDescription: 'Practicá la defensa de tu tesis o trabajo final frente al jurado.',
  icon: 'Scroll',
  durationMinutes: 15,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'male',
  interlocutorRole: 'Jurado evaluador',
  uiCopy: {
    interlocutorLabel: 'Jurado',
    sessionTitle: 'Defensa de tesis',
    interlocutorContext: 'Tribunal académico',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Cuál es tu tesis?',
      questions: [
        { id: 'titulo', label: '¿Cuál es el tema o título?', type: 'shortText', placeholder: 'Ej: Impacto de la IA en el mercado laboral', required: true },
        {
          id: 'tipo',
          label: '¿Qué tipo de trabajo es?',
          type: 'select',
          required: true,
          options: [
            { value: 'tesina_grado', label: 'Tesina de grado' },
            { value: 'tesis_maestria', label: 'Tesis de maestría' },
            { value: 'tesis_doctorado', label: 'Tesis doctoral' },
          ],
        },
        {
          id: 'preocupacion',
          label: '¿Qué te preocupa más de la defensa?',
          type: 'select',
          required: true,
          options: [
            { value: 'metodologia', label: 'Que cuestionen mi metodología' },
            { value: 'resultados', label: 'Que pongan en duda los resultados' },
            { value: 'nervios', label: 'Ponerme nervioso/a y bloquearse' },
            { value: 'preguntas_inesperadas', label: 'Preguntas que no esperaba' },
          ],
        },
      ],
    },
    screen2: {
      heading: '¿Cómo querés que sea el jurado?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Jurado curioso y constructivo.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Riguroso, indaga en cada decisión metodológica.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Crítico, pone en jaque los fundamentos del trabajo.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 15,
    interventionsRange: { Basic: [5, 7], Intermediate: [7, 10], Advanced: [10, 13] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(DEFENSA_TESIS)
    return `
Sos un miembro del jurado evaluando la defensa de "${a.titulo || 'la tesis'}". Tipo de trabajo: ${L('tipo', a.tipo)}.

CÓMO ARRANCÁS:
- Te presentás brevemente como miembro del jurado y le das la palabra: "Adelante, podés comenzar con tu presentación."

CÓMO TE COMPORTÁS:
- Escuchás la exposición sin interrumpir (salvo en Difícil).
- En Básico: hacés preguntas de cierre y curiosidad genuina, no buscás errores.
- En Intermedio: preguntás sobre decisiones metodológicas, limitaciones del estudio, por qué eligió ese marco teórico y no otro.
- En Difícil: cuestionás la relevancia del problema, la validez de las conclusiones, señalás posibles sesgos. Podés interrumpir si algo no cierra. La preocupación que declaró el tesista es "${L('preocupacion', a.preocupacion)}" — tocá ese punto con precisión.

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que la persona aprenda a defender sus decisiones académicas con solidez y a mantener la calma ante el escrutinio del jurado.
`.trim()
  },
}

export const STUDY_SIMULATIONS = [APLICAR_UNIVERSIDAD, DEFENSA_ORAL, DEFENSA_TESIS]
