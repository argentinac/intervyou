function Bold({ text }) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

const IntervyouIcon = () => (
  <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="10" fill="#4f46e5"/>
    <circle cx="13.5" cy="11" r="3.5" fill="white"/>
    <rect x="10" y="16" width="7" height="11" rx="3.5" fill="white"/>
    <rect x="21" y="11" width="2.5" height="15" rx="1.25" fill="rgba(255,255,255,0.55)"/>
    <rect x="25" y="8"  width="2.5" height="18" rx="1.25" fill="rgba(255,255,255,0.35)"/>
  </svg>
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

function downloadFeedback(feedback) {
  const stripBold = (s) => s.replace(/\*\*(.*?)\*\*/g, '$1')
  const lines = [
    'INTERVYOU — Feedback de tu entrevista',
    '======================================',
    '',
    `Puntaje: ${feedback.score ?? '—'} / 1000`,
    `Veredicto: ${feedback.headline}`,
    '',
    'CÓMO COMUNICASTE BIEN',
    '----------------------',
    ...(feedback.wentWell || []).map((s) => `• ${stripBold(s)}`),
    '',
    'OPORTUNIDADES DE MEJORA',
    '------------------------',
    ...(feedback.toImprove || []).flatMap((cat) => [
      `[${cat.category}]`,
      ...(cat.items || []).map((s) => `  • ${stripBold(s)}`),
      '',
    ]),
    'SUGERENCIAS CONCRETAS',
    '----------------------',
    ...(feedback.suggestions || []).map((s, i) => `${i + 1}. ${stripBold(s)}`),
    '',
    '— intervyou.app',
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'intervyou-feedback.txt'
  a.click()
  URL.revokeObjectURL(url)
}

export default function FeedbackSummary({ feedback, onRestart }) {
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
          <div className="fb-logo"><IntervyouIcon /><span>intervyou</span></div>
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
          <div className="fb-logo"><IntervyouIcon /><span>intervyou</span></div>
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
        <div className="fb-logo">
          <IntervyouIcon />
          <span>intervyou</span>
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
          <h3 className="fb-section-title">Cómo comunicaste bien</h3>
          <ul className="fb-list">
            {feedback.wentWell.map((item, i) => (
              <li key={i}><Bold text={item} /></li>
            ))}
          </ul>
        </div>

        {/* To improve */}
        <div className="fb-section fb-section--improve">
          <h3 className="fb-section-title">Oportunidades de mejora</h3>
          <div className="fb-categories">
            {feedback.toImprove.map((cat, i) => (
              <div key={i} className="fb-category">
                <span className="fb-category-label">{cat.category}</span>
                <ul className="fb-list">
                  {cat.items.map((item, j) => (
                    <li key={j}><Bold text={item} /></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="fb-section fb-section--suggestions">
          <h3 className="fb-section-title">Sugerencias concretas</h3>
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
