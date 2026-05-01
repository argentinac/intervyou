function Bold({ text }) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

const IntervyouIcon = () => (
  <img src="/logo.png" alt="intervyou" style={{height:44,width:'auto'}} />
)

function ScoreRing({ score }) {
  const radius = 54
  const circ = 2 * Math.PI * radius
  const pct = Math.min(Math.max(score / 1000, 0), 1)
  const offset = circ * (1 - pct)
  const color = score >= 801 ? '#22c55e' : score >= 601 ? '#4f46e5' : score >= 401 ? '#f59e0b' : '#ef4444'
  return (
    <div className="fb-score">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="65" y="60" textAnchor="middle" fontSize="28" fontWeight="700" fill="#111827">{score}</text>
        <text x="65" y="78" textAnchor="middle" fontSize="12" fill="#6b7280">/ 1000</text>
      </svg>
      <p className="fb-score-label">Puntaje global</p>
    </div>
  )
}

function downloadFeedback() {
  window.print()
}

export default function FeedbackSummary({ feedback, onRestart, onDashboard }) {
  if (!feedback) {
    return (
      <div className="fb-loading">
        <div className="spinner" />
        <p>Generando tu feedback…</p>
      </div>
    )
  }

  if (feedback.parseError) {
    return (
      <div className="fb-page">
        <div className="fb-card">
          <div className="fb-logo" onClick={onDashboard} style={onDashboard ? { cursor: 'pointer' } : undefined}>
            <IntervyouIcon />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '8px 0 4px' }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827', textAlign: 'center' }}>Problema al generar feedback</h2>
            <p style={{ margin: 0, fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 1.6 }}>
              Ocurrió un error al procesar tu entrevista.<br />
              Podés intentar una nueva entrevista.
            </p>
          </div>
          <div className="fb-actions">
            <button className="fb-restart" onClick={onRestart}>Nueva entrevista →</button>
          </div>
        </div>
      </div>
    )
  }

  if (feedback.notEnoughData) {
    return (
      <div className="fb-page">
        <div className="fb-card">
          <div className="fb-logo" onClick={onDashboard} style={onDashboard ? { cursor: 'pointer' } : undefined}>
            <IntervyouIcon />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '8px 0 4px' }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827', textAlign: 'center' }}>Entrevista muy corta</h2>
            <p style={{ margin: 0, fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 1.6 }}>
              Necesitamos al menos un par de respuestas para analizar cómo te expresás.<br />
              Intentá completar más preguntas la próxima vez.
            </p>
          </div>
          <div className="fb-actions">
            <button className="fb-restart" onClick={onRestart}>Nueva entrevista →</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fb-page">
      <div className="fb-card">

        {/* Logo */}
        <div
          className="fb-logo"
          onClick={onDashboard}
          style={onDashboard ? { cursor: 'pointer' } : undefined}
          title={onDashboard ? 'Ir al inicio' : undefined}
        >
          <IntervyouIcon />
        </div>

        {/* Score */}
        {feedback.score != null && <ScoreRing score={feedback.score} />}

        {/* Headline */}
        <div className="fb-headline">
          <p className="fb-headline-label">Tu entrevista en pocas palabras</p>
          <h1 className="fb-headline-text">{feedback.headline}</h1>
        </div>

        {/* Went well */}
        <div className="fb-section fb-section--good">
          <h3 className="fb-section-title">Puntos fuertes</h3>
          <ul className="fb-list">
            {feedback.wentWell.map((item, i) => (
              <li key={i}><Bold text={item} /></li>
            ))}
          </ul>
        </div>

        {/* To improve */}
        <div className="fb-section fb-section--improve">
          <h3 className="fb-section-title">Oportunidades de mejora</h3>
          <ul className="fb-list">
            {feedback.toImprove.map((item, i) => (
              <li key={i}><Bold text={item} /></li>
            ))}
          </ul>
        </div>

        {/* Suggestions */}
        <div className="fb-section fb-section--suggestions">
          <h3 className="fb-section-title">Accionables concretos</h3>
          <ol className="fb-list fb-list--ordered">
            {feedback.suggestions.map((item, i) => (
              <li key={i}><Bold text={item} /></li>
            ))}
          </ol>
        </div>

        <div className="fb-actions">
          <button className="fb-download" onClick={() => downloadFeedback(feedback)}>Descargar feedback</button>
          <button className="fb-restart" onClick={onRestart}>Nueva entrevista →</button>
        </div>
      </div>
    </div>
  )
}
