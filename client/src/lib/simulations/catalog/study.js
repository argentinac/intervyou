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

export const STUDY_SIMULATIONS = [APLICAR_UNIVERSIDAD]
