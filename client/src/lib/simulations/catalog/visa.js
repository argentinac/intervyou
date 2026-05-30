import { makeLabelResolver } from './_util'
import { COUNTRIES_ES } from '../countries'

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
  interlocutorRole: 'Oficial Consular USA',
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
        { id: 'nationality', label: 'Tu nacionalidad', type: 'country', options: COUNTRIES_ES, defaultValue: 'Argentina', required: true },
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

const NATURALIZACION_USA = {
  id: 'naturalizacion_usa',
  category: 'visa',
  title: 'Naturalización — Ciudadanía USA',
  shortDescription: 'Practicá la entrevista para obtener la ciudadanía estadounidense (N-400).',
  icon: 'Flag',
  durationMinutes: 12,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish', 'English'],
  interlocutorDefaultGender: 'male',
  interlocutorRole: 'Oficial de USCIS',
  uiCopy: {
    interlocutorLabel: 'Oficial USCIS',
    sessionTitle: 'Entrevista de naturalización',
    interlocutorContext: 'Oficina de USCIS',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Cuál es tu situación?',
      questions: [
        {
          id: 'tiempo_residencia',
          label: '¿Cuánto tiempo llevas como residente permanente?',
          type: 'select',
          required: true,
          options: [
            { value: '3y', label: '3 años (casado/a con ciudadano/a)' },
            { value: '5y', label: '5 años (ruta estándar)' },
          ],
        },
        {
          id: 'preocupacion',
          label: '¿Qué te preocupa más?',
          type: 'select',
          required: false,
          options: [
            { value: 'civics', label: 'El examen de civismo (historia y gobierno)' },
            { value: 'viajes', label: 'Mis viajes al exterior o ausencias largas' },
            { value: 'antecedentes', label: 'Algún antecedente o infracción menor' },
            { value: 'english', label: 'Mi nivel de inglés' },
          ],
        },
      ],
    },
    screen2: {
      heading: '¿Cómo querés que sea el oficial?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Oficial estándar, proceso fluido.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Profundiza en ausencias y viajes.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Muy riguroso, indaga inconsistencias en el historial.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 12,
    interventionsRange: { Basic: [8, 10], Intermediate: [10, 13], Advanced: [13, 16] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(NATURALIZACION_USA)
    return `
Sos un oficial de USCIS conduciendo la entrevista de naturalización N-400. El solicitante lleva ${L('tiempo_residencia', a.tiempo_residencia)} como residente permanente.

CÓMO TE COMPORTÁS:
- Sos formal y directo/a. Hacés jurar a la persona que sus respuestas son verdaderas.
- Repasás las secciones clave del N-400: residencia, viajes, afiliaciones, antecedentes, preguntas de sí/no.
- Hacés el examen de civismo: hacés hasta 10 preguntas de historia y gobierno de EE.UU. (la persona necesita responder 6 correctamente).
- Hacés el test de inglés (lectura y escritura) si aplica.
- En Básico: proceso fluido, validás rápido los documentos y avanzás.
- En Intermedio: profundizás en ausencias del país, viajes largos, cambios de dirección.
- En Difícil: cuestionás inconsistencias, pedís explicaciones sobre el punto sensible declarado (${L('preocupacion', a.preocupacion) || 'ninguno declarado'}).

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que la persona se familiarice con el proceso N-400, las preguntas de civismo y cómo responder con consistencia.
`.trim()
  },
}

const EMPLOYMENT_VISA_USA = {
  id: 'employment_visa_usa',
  category: 'visa',
  title: 'Employment Visa — USA',
  shortDescription: 'Practicá la entrevista consular para visas de trabajo H1B, L1 o O1.',
  icon: 'BadgeCheck',
  durationMinutes: 10,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish', 'English'],
  interlocutorDefaultGender: 'male',
  interlocutorRole: 'Oficial Consular USA',
  uiCopy: {
    interlocutorLabel: 'Oficial Consular',
    sessionTitle: 'Entrevista — Visa de trabajo',
    interlocutorContext: 'Embajada de EE.UU.',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Qué visa de trabajo?',
      questions: [
        {
          id: 'visaType',
          label: 'Tipo de visa',
          type: 'select',
          required: true,
          options: [
            { value: 'H1B', label: 'H1B — Trabajo especializado', flag: '💼' },
            { value: 'L1', label: 'L1 — Traslado intracompañía', flag: '🏢' },
            { value: 'O1', label: 'O1 — Talento extraordinario', flag: '⭐' },
          ],
        },
        { id: 'nationality', label: 'Tu nacionalidad', type: 'country', options: COUNTRIES_ES, defaultValue: 'Argentina', required: true },
        {
          id: 'redFlags',
          label: '¿Hay algo que podría generar dudas?',
          type: 'multiselect',
          max: 2,
          required: false,
          options: [
            { value: 'visa_rechazada', label: 'Tuve una visa rechazada antes' },
            { value: 'gap_empleo', label: 'Hay un gap en mi historial laboral' },
            { value: 'cambio_empleador', label: 'Cambié de empleador recientemente' },
            { value: 'ingresos_bajos', label: 'El salario ofrecido es bajo para el estándar' },
          ],
        },
      ],
    },
    screen2: {
      heading: '¿Cómo querés que sea el oficial?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Oficial neutro, preguntas estándar.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Metódico, repregunta inconsistencias.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Desconfiado, pone la carga de la prueba en vos.' },
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
    const L = makeLabelResolver(EMPLOYMENT_VISA_USA)
    return `
Sos un oficial consular de los Estados Unidos. El solicitante es de ${a.nationality || 'no especificado'} y aplica para visa ${L('visaType', a.visaType)}.

CÓMO TE COMPORTÁS:
- Tenés poder absoluto sobre la decisión. No explicás nada que no sea necesario.
- Preguntas clave según visa: H1B → relación con el empleador, especialidad, petición aprobada; L1 → rol en la empresa madre, cuánto tiempo afuera; O1 → evidencia de talento extraordinario, premios, publicaciones.
- En Básico: proceso estándar, verificás documentos y hacés preguntas de rutina.
- En Intermedio: detectás inconsistencias y volvés sobre ellas, pedís aclaraciones.
- En Difícil: asumís intención de inmigrar permanentemente y exigís prueba de intención de retorno. Explorás los puntos débiles declarados: ${(a.redFlags || []).map((v) => L('redFlags', v)).join(', ') || 'ninguno declarado'}.

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que la persona aprenda a responder con consistencia, brevedad y confianza sobre su petición de trabajo.
`.trim()
  },
}

const TURISMO_B2 = {
  id: 'turismo_b2',
  category: 'visa',
  title: 'Visa Turismo B1/B2 — USA',
  shortDescription: 'Practicá la entrevista consular para la visa de turismo o negocios a Estados Unidos.',
  icon: 'Luggage',
  durationMinutes: 8,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish', 'English'],
  interlocutorDefaultGender: 'male',
  interlocutorRole: 'Oficial Consular USA',
  uiCopy: {
    interlocutorLabel: 'Oficial Consular',
    sessionTitle: 'Entrevista — Visa B1/B2',
    interlocutorContext: 'Embajada de EE.UU.',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿Cuál es tu situación?',
      questions: [
        { id: 'nationality', label: 'Tu nacionalidad', type: 'country', options: COUNTRIES_ES, defaultValue: 'Argentina', required: true },
        {
          id: 'motivo_viaje',
          label: '¿Cuál es el motivo del viaje?',
          type: 'select',
          required: true,
          options: [
            { value: 'turismo', label: 'Turismo / vacaciones' },
            { value: 'negocios', label: 'Negocios o conferencia' },
            { value: 'familia', label: 'Visita a familiares o amigos' },
            { value: 'medico', label: 'Tratamiento médico' },
          ],
        },
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
          ],
        },
      ],
    },
    screen2: {
      heading: '¿Cómo querés que sea el oficial?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Oficial neutro, preguntas de rutina.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Indaga vínculos con el país de origen.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Asume intención de quedarse, exige prueba de retorno.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 8,
    interventionsRange: { Basic: [6, 8], Intermediate: [8, 10], Advanced: [10, 12] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(TURISMO_B2)
    return `
Sos un oficial consular de los Estados Unidos. El solicitante es de ${a.nationality || 'no especificado'} y aplica para visa B1/B2 por motivo de ${L('motivo_viaje', a.motivo_viaje)}.

CÓMO TE COMPORTÁS:
- Hablás poco. Hacés preguntas cortas y directas.
- Explorás vínculos en el país de origen: trabajo, familia, propiedades, razones para volver.
- En Básico: proceso estándar, preguntas de rutina, no profundizás.
- En Intermedio: indagás sobre ingresos, estabilidad laboral, duración del viaje y vínculos familiares.
- En Difícil: asumís que el solicitante podría querer quedarse ilegalmente. La carga de la prueba es del solicitante. Explorás los puntos débiles: ${(a.redFlags || []).map((v) => L('redFlags', v)).join(', ') || 'ninguno declarado'}.
- Nunca das señales de cómo va la entrevista.

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que la persona aprenda a demostrar sus vínculos con el país de origen y responder con brevedad y seguridad.
`.trim()
  },
}

const MIGRACIONES_INGRESO = {
  id: 'migraciones_ingreso',
  category: 'visa',
  title: 'Control migratorio de ingreso',
  shortDescription: 'Practicá el control de migraciones al llegar a un país extranjero.',
  icon: 'Stamp',
  durationMinutes: 6,
  defaultLanguage: 'Spanish',
  availableLanguages: ['Spanish', 'English'],
  interlocutorDefaultGender: 'male',
  interlocutorRole: 'Oficial de Migraciones',
  uiCopy: {
    interlocutorLabel: 'Oficial de Migraciones',
    sessionTitle: 'Control migratorio',
    interlocutorContext: 'Aeropuerto — llegadas internacionales',
  },
  showPhaseIndicator: false,
  onboarding: {
    screen1: {
      heading: '¿A qué país llegás?',
      questions: [
        {
          id: 'destino',
          label: '¿A qué país llegás?',
          type: 'select',
          required: true,
          options: [
            { value: 'usa', label: 'Estados Unidos' },
            { value: 'uk', label: 'Reino Unido' },
            { value: 'canada', label: 'Canadá' },
            { value: 'australia', label: 'Australia' },
            { value: 'europa_schengen', label: 'Europa (Schengen)' },
          ],
        },
        {
          id: 'motivo',
          label: '¿Motivo del viaje?',
          type: 'select',
          required: true,
          options: [
            { value: 'turismo', label: 'Turismo' },
            { value: 'trabajo', label: 'Trabajo o conferencia' },
            { value: 'estudio', label: 'Estudio' },
            { value: 'visita_familiar', label: 'Visita familiar' },
          ],
        },
      ],
    },
    screen2: {
      heading: '¿Cómo querés que sea el control?',
      questions: [
        {
          id: 'difficulty',
          label: 'Nivel de dificultad',
          type: 'difficulty',
          required: true,
          options: [
            { value: 'Basic', label: 'Básico', desc: 'Oficial de rutina, proceso rápido.' },
            { value: 'Intermediate', label: 'Intermedio', desc: 'Hace preguntas adicionales sobre el viaje.' },
            { value: 'Advanced', label: 'Difícil', desc: 'Te manda a sala de revisión secundaria.' },
          ],
        },
      ],
    },
  },
  internalInstructions: {
    durationMaxMinutes: 6,
    interventionsRange: { Basic: [4, 5], Intermediate: [5, 7], Advanced: [7, 10] },
  },
  systemPromptTemplate: (a) => {
    const L = makeLabelResolver(MIGRACIONES_INGRESO)
    return `
Sos un oficial de migraciones en el aeropuerto de ${L('destino', a.destino)}. La persona llega con motivo de ${L('motivo', a.motivo)}.

CÓMO ARRANCÁS:
- Pedís el pasaporte con un gesto o "Pasaporte, por favor." y empezás las preguntas.

CÓMO TE COMPORTÁS:
- Sos conciso/a. Preguntás lo mínimo necesario.
- En Básico: preguntas estándar (¿cuánto tiempo se queda?, ¿dónde se hospeda?, ¿cuál es el propósito?). Fluido.
- En Intermedio: pedís detalles adicionales, chequeás si tiene carta de invitación o reservas, preguntás sobre ingresos o sponsor del viaje.
- En Difícil: algo en el perfil te genera sospecha (llevás al solicitante a sala de revisión secundaria y hacés preguntas más profundas). Podés hablar de dinero disponible, vínculos laborales en destino, historial de viajes.

FORMATO ESTRICTO: Solo hablás. Sin acotaciones ni acciones entre paréntesis.

OBJETIVO PEDAGÓGICO: que la persona aprenda a responder en forma breve, directa y consistente en un control migratorio sin ponerse nerviosa.
`.trim()
  },
}

export const VISA_SIMULATIONS = [
  ENTREVISTA_VISA_USA,
  NATURALIZACION_USA,
  EMPLOYMENT_VISA_USA,
  TURISMO_B2,
  MIGRACIONES_INGRESO,
]
