import { makeLabelResolver } from './_util'

const DECLARAR_JUEZ = {
  id: 'declarar_juez',
  category: 'legal',
  title: 'Declarar ante un juez o fiscal',
  shortDescription: 'Practicá una declaración formal en sede judicial: precisión, calma, no caer en trampas.',
  icon: 'Scale',
  durationMinutes: 12,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish'],
  interlocutorDefaultGender: 'male',
  uiCopy: {
    interlocutorLabel: 'Juez/a o fiscal',
    sessionTitle: 'Declaración judicial',
    interlocutorContext: 'Sede judicial',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿En qué rol declarás?',
      questions: [
        {
          id: 'role',
          label: 'Rol del declarante',
          type: 'select',
          required: true,
          options: [
            { value: 'imputado', label: 'Imputado/a (me acusan de algo)' },
            { value: 'denunciante', label: 'Denunciante (hice una denuncia)' },
            { value: 'testigo', label: 'Testigo citado/a por la justicia' },
            { value: 'parte_civil', label: 'Parte en una causa civil' },
          ],
        },
        {
          id: 'forum',
          label: '¿Ante quién declarás?',
          type: 'select',
          required: true,
          options: [
            { value: 'solo_juez', label: 'Solo ante el/la juez/a' },
            { value: 'fiscal_abogado', label: 'Ante el/la fiscal con abogado/a presente' },
            { value: 'audiencia_oral', label: 'En audiencia oral con varias partes' },
            { value: 'cruzado', label: 'Interrogatorio cruzado (distintos abogados/as)' },
          ],
        },
      ],
    },
    screen2: {
      heading: '¿Qué querés practicar?',
      questions: [
        {
          id: 'practiceFocus',
          label: 'Foco de práctica',
          type: 'select',
          required: true,
          options: [
            { value: 'calma', label: 'Mantener la calma y no trabarme' },
            { value: 'precision', label: 'Ser preciso/a sin dar información de más' },
            { value: 'capciosas', label: 'Responder preguntas capciosas sin caer en trampas' },
            { value: 'relato', label: 'El relato inicial de los hechos' },
            { value: 'integral', label: 'Integral (default)' },
          ],
        },
        {
          id: 'weakPoints',
          label: '¿Hay puntos débiles en tu relato?',
          type: 'select',
          required: false,
          options: [
            { value: 'malinterpretado', label: 'Algo puede ser malinterpretado' },
            { value: 'lagunas', label: 'Hay lagunas de memoria' },
            { value: 'contradice', label: 'Mi versión difiere de la de otro testigo' },
            { value: 'claro', label: 'No, el relato es claro y consistente' },
          ],
        },
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Interrogatorio directo y ordenado.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Preguntas de varias partes, algunos cruces.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Contrainterrogatorio agresivo, acusaciones directas.' },
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
    const L = makeLabelResolver(DECLARAR_JUEZ)
    return `
Sos un/a juez/a o fiscal con autoridad real. La persona declara como ${L('role', a.role)}, en formato ${L('forum', a.forum)}.

CÓMO TE COMPORTÁS:
- Lenguaje técnico-jurídico. Hablás en tercera persona formal, usás términos legales sin explicarlos.
- El rol es asimétrico: vos tenés el poder.
- Esperás respuestas precisas. Si la respuesta es vaga, repetís la pregunta o reformulás con presión.
- En Difícil, podés interrumpir y reformular. Podés hacer preguntas capciosas ("¿entonces usted está diciendo que…?").
- Regla pedagógica: empujás a la persona a responder solo lo que se pregunta, ni más ni menos.

PUNTOS DÉBILES DEL RELATO declarados por la persona: ${L('weakPoints', a.weakPoints) || 'no especificado'}. Si la dificultad es alta, tomalos como vector de presión.

OBJETIVO PEDAGÓGICO: que la persona aprenda a no agregar información, no contradecirse y mantener la calma bajo presión.
`.trim()
  },
}

export const LEGAL_SIMULATIONS = [DECLARAR_JUEZ]
