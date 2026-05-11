const NEXT_STEPS = {
  ansiedad: [
    'Practicá la respiración 4-7-8 durante 5 minutos antes de dormir esta semana.',
    'Antes de tu próxima situación estresante, identificá el primer síntoma físico de ansiedad y usá la técnica trabajada hoy.',
    'Anotá en tu teléfono una frase de reencuadre personal para tenerla a mano cuando la necesites.',
  ],
  blanco: [
    'Practicá la técnica trabajada hoy en conversaciones cotidianas, no solo en entrevistas.',
    'Armá una lista de 5 temas sobre los que siempre podés hablar con confianza — tu "ancla" personal.',
    'Grabate respondiendo una pregunta difícil en voz alta y escuchate después.',
  ],
  impostor: [
    'Escribí 3 logros concretos y específicos de los últimos 6 meses. Guardalos en algún lugar accesible.',
    'Cuando aparezca la voz del impostor esta semana, preguntale: "¿Qué evidencia tenés de eso?"',
    'Hablá con alguien de confianza sobre un logro tuyo. Decilo en voz alta sin minimizarlo.',
  ],
  presion: [
    'En tu próxima conversación difícil, practicá la pausa táctica al menos una vez.',
    'Preparate 2 preguntas de clarificación que funcionen para diferentes situaciones.',
    'Grabate respondiendo una pregunta complicada e identificá si te apresuraste o te tomaste el tiempo.',
  ],
  star: [
    'Escribí 3 logros propios en formato STAR esta semana. No los guardes para una entrevista.',
    'Practicá el Mini-STAR en conversaciones informales cuando alguien te pregunta qué hiciste.',
    'Identificá cuál es la Acción más relevante de cada historia — esa es la parte que más importa.',
  ],
}

export default function SkillSuccess({ skill, messages, onDashboard }) {
  const lastAssistantMsg = messages
    ? [...messages].reverse().find((m) => m.role === 'assistant')
    : null
  const closingSummary = lastAssistantMsg
    ? lastAssistantMsg.content.replace('[END_INTERVIEW]', '').trim()
    : null

  const nextSteps = NEXT_STEPS[skill?.id] || []

  return (
    <div className="skill-success">
      <div className="skill-success-inner">
        <img src="/logo.png" alt="CoachToWork" className="skill-success-logo" />

        <div className="skill-success-check">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5955F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="skill-success-heading">¡Sesión completada!</h1>

        <div className="skill-success-badges">
          <span className="skill-success-badge skill-success-badge--name">{skill?.name}</span>
          <span className="skill-success-badge skill-success-badge--eje">Eje: {skill?.eje}</span>
        </div>

        {nextSteps.length > 0 && (
          <div className="skill-success-next">
            <div className="skill-success-next-label">Próximos pasos</div>
            <ul className="skill-success-next-list">
              {nextSteps.map((step, i) => (
                <li key={i} className="skill-success-next-item">
                  <span className="skill-success-next-bullet">→</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button className="skill-success-cta" onClick={onDashboard}>
          Volver al inicio
        </button>
      </div>
    </div>
  )
}
