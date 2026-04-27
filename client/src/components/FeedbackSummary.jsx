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
          <div className="fb-logo" />
          <div className="fb-notice fb-notice--warn">
            Ocurrió un problema al generar el feedback. Podés intentar una nueva entrevista.
          </div>
          <button className="fb-restart" onClick={onRestart}>Nueva entrevista</button>
        </div>
      </div>
    )
  }

  if (feedback.notEnoughData) {
    return (
      <div className="fb-page">
        <div className="fb-card">
          <div className="fb-logo" />
          <div className="fb-notice fb-notice--info">
            <p>La entrevista fue demasiado corta para generar feedback detallado.</p>
            <p>Necesitamos al menos un par de respuestas tuyas para analizar cómo te expresás.</p>
          </div>
          <button className="fb-restart" onClick={onRestart}>Nueva entrevista</button>
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
