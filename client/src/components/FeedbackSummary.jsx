import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import QAReviewTable from './QAReviewTable'

const KNOWN_DOMAINS = {
  'tiendanube': 'tiendanube.com',
  'tienda nube': 'tiendanube.com',
  'mercadolibre': 'mercadolibre.com',
  'mercado libre': 'mercadolibre.com',
  'mercado pago': 'mercadopago.com',
  'mercadopago': 'mercadopago.com',
  'globant': 'globant.com',
  'despegar': 'despegar.com',
  'ualá': 'uala.ar',
  'uala': 'uala.ar',
  'naranja x': 'naranjax.com',
  'naranjax': 'naranjax.com',
  'google': 'google.com',
  'meta': 'meta.com',
  'microsoft': 'microsoft.com',
  'amazon': 'amazon.com',
  'accenture': 'accenture.com',
  'deloitte': 'deloitte.com',
  'santander': 'santander.com',
  'hsbc': 'hsbc.com',
  'galicia': 'galicia.com.ar',
  'banco galicia': 'galicia.com.ar',
  'rappi': 'rappi.com',
  'pedidosya': 'pedidosya.com',
  'pedidos ya': 'pedidosya.com',
}

function getCompanyDomain(name) {
  if (!name) return null
  return KNOWN_DOMAINS[name.toLowerCase().trim()] || null
}

function CompanyLogo({ name }) {
  const [error, setError] = useState(false)
  const domain = getCompanyDomain(name)
  if (domain && !error) {
    return (
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt={name}
        onError={() => setError(true)}
        style={{ width: 20, height: 20, objectFit: 'contain', borderRadius: 3 }}
      />
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatName(fullName) {
  if (!fullName) return null
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]
  return `${parts[0]} ${parts[parts.length - 1][0]}.`
}

function formatDuration(seconds) {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  if (m < 1) return `${seconds} seg`
  return `${m} minutos`
}

function formatDate(date) {
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function erf(x) {
  const sign = x >= 0 ? 1 : -1
  x = Math.abs(x)
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911
  const t = 1 / (1 + p * x)
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
  return sign * y
}

function normalCDF(z) {
  return 0.5 * (1 + erf(z / Math.sqrt(2)))
}

function getPercentile(score, comparableScores = []) {
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n))
  if (Array.isArray(comparableScores) && comparableScores.length >= 100) {
    const lower = comparableScores.filter(s => s < score).length
    const equal = comparableScores.filter(s => s === score).length
    return clamp(Math.round(100 * (lower + 0.5 * equal) / comparableScores.length), 1, 99)
  }
  const z = (score - 600) / 180
  return clamp(Math.round(100 * normalCDF(z)), 1, 99)
}

function getAxisValues(axes, interviewType) {
  if (!axes) return {}
  const isHR = String(interviewType || 'HR').toUpperCase() !== 'TECHNICAL'
  return {
    claridad:     axes.clarity         ?? null,
    estructura:   axes.structure       ?? null,
    relevancia:   axes.roleRelevance   ?? null,
    consistencia: isHR ? (axes.narrativeCoherence   ?? null) : (axes.technicalCorrectness   ?? null),
    profundidad:  isHR ? (axes.reflectionDepth      ?? null) : (axes.depth                  ?? null),
    evidencia:    isHR ? (axes.concreteEvidence      ?? null) : (axes.problemSolvingEvidence ?? null),
  }
}

const AXIS_LABELS = {
  claridad: 'Claridad', estructura: 'Estructura', relevancia: 'Relevancia',
  consistencia: 'Consistencia', profundidad: 'Profundidad', evidencia: 'Evidencia',
}

const AXIS_COLORS = {
  claridad: '#3b82f6', estructura: '#f59e0b', relevancia: '#10b981',
  consistencia: '#8b5cf6', profundidad: '#6366f1', evidencia: '#0ea5e9',
}

const AXIS_TAG_COLORS = {
  claridad:     { bg: '#eff6ff', color: '#1d4ed8' },
  estructura:   { bg: '#fffbeb', color: '#92400e' },
  relevancia:   { bg: '#f0fdf4', color: '#166534' },
  consistencia: { bg: '#f5f3ff', color: '#5b21b6' },
  profundidad:  { bg: '#eef2ff', color: '#3730a3' },
  evidencia:    { bg: '#f0f9ff', color: '#0c4a6e' },
}

const BLOG_RESOURCES = {
  claridad:     { title: 'Cómo responder "Háblame de ti"',      slug: '04-como-responder-hablame-de-ti-entrevista' },
  estructura:   { title: 'El Método STAR',                       slug: '10-metodo-star-entrevista' },
  relevancia:   {
    HR:        { title: 'Prepararse para una entrevista HR',     slug: '01-como-prepararse-entrevista-recursos-humanos' },
    TECHNICAL: { title: 'Superar una entrevista técnica IT',     slug: '09-como-pasar-entrevista-tecnica-it' },
  },
  consistencia: { title: 'Las 10 preguntas trampa',              slug: '02-preguntas-trampa-entrevista-de-trabajo' },
  profundidad:  { title: 'Fortalezas y debilidades',             slug: '03-fortalezas-y-debilidades-entrevista' },
  evidencia:    { title: 'El Método STAR',                       slug: '10-metodo-star-entrevista' },
}

function getResource(axis, interviewType) {
  const r = BLOG_RESOURCES[axis]
  if (!r) return null
  if (r.HR) {
    const t = String(interviewType || 'HR').toUpperCase() === 'TECHNICAL' ? 'TECHNICAL' : 'HR'
    return r[t]
  }
  return r
}

function getWeakAxes(axisValues, count = 2) {
  return Object.entries(axisValues)
    .filter(([, v]) => v !== null)
    .sort(([, a], [, b]) => a - b)
    .slice(0, count)
    .map(([k]) => k)
}

// ── Axis Icons (SVG) ────────────────────────────────────────────────────────

const AxisIcons = {
  claridad: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  estructura: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  relevancia: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  consistencia: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  profundidad: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  evidencia: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 13.5V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.5"/><path d="M2 10.5V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5.5"/>
      <path d="M12 12v6"/><path d="M8 12h8"/>
    </svg>
  ),
}

const ItemIcons = {
  claridad:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  estructura:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  relevancia:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>,
  consistencia: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  profundidad:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  evidencia:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.06 1.45L5 3 3 7l1.45 4.06L7 13.5l4.5-4.5L13 12l2.44-1.45L18 9l1.55-5L18 0l-4.06 1.45L12 4z"/></svg>,
}

// ── Radar Chart ─────────────────────────────────────────────────────────────

const RADAR_ORDER = ['claridad', 'consistencia', 'estructura', 'profundidad', 'evidencia', 'relevancia']

function RadarChart({ axisValues }) {
  const cx = 210, cy = 215, R = 105
  const n = RADAR_ORDER.length
  const labelDist = 152
  const iconR = 10

  const angle = (i) => ((i * 360 / n) - 90) * Math.PI / 180
  const pt = (i, v) => ({
    x: cx + (v / 100) * R * Math.cos(angle(i)),
    y: cy + (v / 100) * R * Math.sin(angle(i)),
  })
  const gridPts = (pct) =>
    RADAR_ORDER.map((_, i) => { const p = pt(i, pct); return `${p.x},${p.y}` }).join(' ')
  const dataPts = RADAR_ORDER.map((ax, i) => {
    const p = pt(i, axisValues[ax] ?? 0); return `${p.x},${p.y}`
  }).join(' ')

  const weakSet = new Set(getWeakAxes(axisValues, 2))

  const iconPaths = {
    claridad:     <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
    estructura:   <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    relevancia:   <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></>,
    consistencia: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    profundidad:  <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    evidencia:    <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  }

  return (
    <svg viewBox="0 0 420 430" className="rdr-svg">
      {/* Grid rings */}
      {[25, 50, 75, 100].map(p => (
        <polygon key={p} points={gridPts(p)} fill="none" stroke="#e5e7eb" strokeWidth={p === 100 ? 1.5 : 1} />
      ))}
      {/* Axis lines */}
      {RADAR_ORDER.map((_, i) => {
        const p = pt(i, 100)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e5e7eb" strokeWidth="1" />
      })}
      {/* Scale labels */}
      {[200, 500, 1000].map((label, idx) => {
        const pct = [20, 50, 100][idx]
        const p = pt(2, pct)
        return (
          <text key={label} x={p.x + 4} y={p.y} fontSize="9" fill="#d1d5db" textAnchor="start" dominantBaseline="middle">
            {label}
          </text>
        )
      })}
      {/* Data polygon */}
      <polygon points={dataPts} fill="rgba(91,91,255,0.12)" stroke="#5b5bff" strokeWidth="2" />
      {/* Data dots */}
      {RADAR_ORDER.map((ax, i) => {
        const p = pt(i, axisValues[ax] ?? 0)
        const isWeak = weakSet.has(ax)
        return (
          <g key={ax}>
            {isWeak && <circle cx={p.x} cy={p.y} r="9" fill="rgba(239,68,68,0.15)" />}
            <circle cx={p.x} cy={p.y} r="4.5" fill={isWeak ? '#ef4444' : '#5b5bff'} stroke="#fff" strokeWidth="1.5" />
          </g>
        )
      })}
      {/* Labels: tight groups using g translate so offsets are relative to anchor point */}
      {RADAR_ORDER.map((ax, i) => {
        const a = angle(i)
        const sinA = Math.sin(a)
        const cosA = Math.cos(a)
        const isWeak = weakSet.has(ax)
        const v = axisValues[ax] ?? null
        const isTop = sinA < 0

        const lx = cx + labelDist * cosA
        const ly = cy + labelDist * sinA
        const anchor = Math.abs(cosA) < 0.3 ? 'middle' : cosA > 0 ? 'start' : 'end'

        // Tight stacking relative to anchor (lx,ly):
        // top-half axes: icon(outermost up) → name → score(closest to polygon, down)
        //   iconCY=-26, nameTY=-9 (middle), scoreTY=+7 (hanging)
        // bottom-half axes: score(closest to polygon, up) → name → icon(outermost down)
        //   scoreTY=-8 (auto), nameTY=+4 (middle), iconCY=+21
        const iconCY  = isTop ? -26 :  21
        const nameTY  = isTop ?  -9 :   4
        const scoreTY = isTop ?   7 :  -8

        const iconColor  = isWeak ? '#ef4444' : AXIS_COLORS[ax]
        const nameColor  = isWeak ? '#ef4444' : '#475569'
        const scoreColor = isWeak ? '#ef4444' : (v !== null ? (v >= 70 ? '#16a34a' : v >= 50 ? '#d97706' : '#dc2626') : '#9ca3af')

        return (
          <g key={ax} transform={`translate(${lx},${ly})`}>
            <circle cx={0} cy={iconCY} r={iconR}
              fill={`${iconColor}20`} stroke={iconColor} strokeWidth={isWeak ? 1.8 : 1.2} />
            <svg x={-iconR + 2} y={iconCY - iconR + 2} width={(iconR - 2) * 2} height={(iconR - 2) * 2}
              viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              {iconPaths[ax]}
            </svg>
            <text x={0} y={nameTY} textAnchor={anchor} dominantBaseline="middle"
              fontSize="9.5" fontWeight="700" fill={nameColor} fontFamily="Inter, system-ui, sans-serif">
              {AXIS_LABELS[ax]}
            </text>
            <text x={0} y={scoreTY} textAnchor={anchor}
              dominantBaseline={isTop ? 'hanging' : 'auto'}
              fontSize="15" fontWeight="800" fill={scoreColor} fontFamily="Inter, system-ui, sans-serif">
              {v !== null ? v * 10 : '—'}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Shared sub-components ───────────────────────────────────────────────────

const IntervyouIcon = () => (
  <img src="/logo.png" alt="FeelReady" style={{ height: 32, width: 'auto' }} />
)

function AxisTag({ axis }) {
  const c = AXIS_TAG_COLORS[axis] || { bg: '#f3f4f6', color: '#374151' }
  return (
    <span className="rpt-tag" style={{ background: c.bg, color: c.color }}>
      {AXIS_LABELS[axis] || axis}
    </span>
  )
}

// ── Legacy renderer ─────────────────────────────────────────────────────────

function Bold({ text }) {
  return text.split(/\*\*(.*?)\*\*/g).map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : p)
}

function LegacyFeedback({ feedback, onRestart, onDashboard }) {
  const scoreColor = feedback.score >= 800 ? '#16a34a' : feedback.score >= 600 ? '#4f46e5' : feedback.score >= 400 ? '#d97706' : '#dc2626'
  const circ = 2 * Math.PI * 54
  const offset = circ * (1 - Math.min(Math.max((feedback.score ?? 0) / 1000, 0), 1))
  return (
    <div className="fb-page">
      <div className="fb-card">
        <div className="fb-logo" onClick={onDashboard} style={onDashboard ? { cursor: 'pointer' } : undefined}>
          <IntervyouIcon />
        </div>
        {feedback.score != null && (
          <div className="fb-score">
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r="54" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle cx="65" cy="65" r="54" fill="none" stroke={scoreColor} strokeWidth="10"
                strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                transform="rotate(-90 65 65)" style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
              <text x="65" y="60" textAnchor="middle" fontSize="28" fontWeight="700" fill="#111827">{feedback.score}</text>
              <text x="65" y="78" textAnchor="middle" fontSize="12" fill="#6b7280">/ 1000</text>
            </svg>
            <p className="fb-score-label">Puntaje global</p>
          </div>
        )}
        <div className="fb-headline"><p className="fb-headline-label">Tu entrevista en pocas palabras</p>
          <h1 className="fb-headline-text">{feedback.headline}</h1></div>
        {Array.isArray(feedback.wentWell) && feedback.wentWell.length > 0 && (
          <div className="fb-section fb-section--good"><h3 className="fb-section-title">Puntos fuertes</h3>
            <ul className="fb-list">{feedback.wentWell.map((item, i) => <li key={i}><Bold text={typeof item === 'string' ? item : item.title} /></li>)}</ul></div>
        )}
        {Array.isArray(feedback.toImprove) && feedback.toImprove.length > 0 && (
          <div className="fb-section fb-section--improve"><h3 className="fb-section-title">Oportunidades de mejora</h3>
            <ul className="fb-list">{feedback.toImprove.map((item, i) => <li key={i}><Bold text={typeof item === 'string' ? item : item.title} /></li>)}</ul></div>
        )}
        {Array.isArray(feedback.suggestions) && feedback.suggestions.length > 0 && (
          <div className="fb-section fb-section--suggestions"><h3 className="fb-section-title">Accionables concretos</h3>
            <ol className="fb-list fb-list--ordered">{feedback.suggestions.map((item, i) => <li key={i}><Bold text={typeof item === 'string' ? item : item.title} /></li>)}</ol></div>
        )}
        <div className="fb-actions">
          <button className="fb-download" onClick={() => window.print()}>Descargar feedback</button>
          <button className="fb-restart" onClick={onRestart}>Nueva entrevista →</button>
        </div>
      </div>
    </div>
  )
}

// ── New V2 report ───────────────────────────────────────────────────────────

function downloadReport() {
  window.print()
}

function NewFeedback({ feedback, config, onRestart, onDashboard, onBack, saveFailed }) {
  const { user } = useAuth()
  const userName   = formatName(user?.user_metadata?.full_name)
  const today      = formatDate(new Date())
  const interviewType  = feedback.interviewType || config?.interviewType || 'HR'
  const isHR           = String(interviewType).toUpperCase() !== 'TECHNICAL'
  const typeLabel      = isHR ? 'RRHH' : 'Técnica'
  const companyName    = config?.companyName || null
  const score          = feedback.score ?? null
  const prevScore      = feedback.previousScore ?? null
  const delta          = score !== null && prevScore !== null ? score - prevScore : null
  const percentile     = score !== null ? getPercentile(score) : null
  const scoreLabel     = feedback.scoreResult?.scoreLabel ?? null
  const axisValues     = getAxisValues(feedback.axes, interviewType)
  const weakAxes       = getWeakAxes(axisValues, 3)
  const resources      = weakAxes
    .map(ax => getResource(ax, interviewType))
    .filter(Boolean)
    .filter((r, i, a) => a.findIndex(x => x.slug === r.slug) === i)
    .slice(0, 2)

  const scoreBarPct = score !== null ? Math.min(Math.max(score / 1000, 0), 1) * 100 : 0

  return (
  <>
    <div className="rpt-page">

      {/* ── Header ── */}
      <div className="rpt-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {onBack && (
            <button onClick={onBack} className="rpt-back-btn">
              ← Volver
            </button>
          )}
          <div className="rpt-header-logo" onClick={onDashboard} style={onDashboard ? { cursor: 'pointer' } : undefined}>
            <IntervyouIcon />
          </div>
        </div>
        <div className="rpt-header-right">
          <span className="rpt-header-label">REPORTE DE ENTREVISTA</span>
          <span className="rpt-header-date">{today}</span>
        </div>
      </div>

      <div className="rpt-body">

        {/* ── User row ── */}
        <div className="rpt-user-row">
          {userName && <h1 className="rpt-user-name">{userName}</h1>}
          <div className="rpt-user-pills">
            {config?.jobTitle && (
              <div className="rpt-pill">
                <div className="rpt-pill-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div><div className="rpt-pill-label">Perfil</div><div className="rpt-pill-value">{config.jobTitle}</div></div>
              </div>
            )}
            <div className="rpt-pill">
              <div className="rpt-pill-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div><div className="rpt-pill-label">Tipo de entrevista</div><div className="rpt-pill-value">{typeLabel}</div></div>
            </div>
            {feedback.durationSeconds && (
              <div className="rpt-pill">
                <div className="rpt-pill-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div><div className="rpt-pill-label">Duración</div><div className="rpt-pill-value">{formatDuration(feedback.durationSeconds)}</div></div>
              </div>
            )}
            {companyName && (
              <div className="rpt-pill">
                <div className="rpt-pill-icon rpt-pill-icon--logo">
                  <CompanyLogo name={companyName} />
                </div>
                <div><div className="rpt-pill-label">Empresa</div><div className="rpt-pill-value">{companyName}</div></div>
              </div>
            )}
          </div>
        </div>

        {/* ── Main grid: left (score + exec) / right (radar) ── */}
        <div className="rpt-main-grid">
          <div className="rpt-left-col">

            {/* Score card */}
            <div className="rpt-score-card">
              <p className="rpt-score-eyebrow">SCORE GENERAL</p>
              <div className="rpt-score-main">
                <span className="rpt-score-num">{score ?? '—'}</span>
                <span className="rpt-score-denom">/1000</span>
              </div>
              {delta !== null && (
                <div className={`rpt-delta ${delta >= 0 ? 'rpt-delta--up' : 'rpt-delta--down'}`}>
                  {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)} puntos vs. tu última entrevista
                </div>
              )}
              <div className="rpt-bar-wrap">
                <div className="rpt-bar-track">
                  <div className="rpt-bar-fill" style={{ width: `${scoreBarPct}%` }} />
                  <div className="rpt-bar-dot" style={{ left: `${scoreBarPct}%` }} />
                </div>
                <div className="rpt-bar-ticks">
                  {[0, 250, 500, 750, 1000].map(t => (
                    <span key={t} style={{ position: 'absolute', left: `${t / 10}%`, transform: 'translateX(-50%)' }}>{t}</span>
                  ))}
                </div>
              </div>
              {(scoreLabel || percentile) && (
                <div className="rpt-score-footer">
                  {scoreLabel && (
                    <div className="rpt-score-footer-item">
                      <span className="rpt-score-footer-label">NIVEL ACTUAL</span>
                      <div className="rpt-score-footer-val-row">
                        <span className="rpt-score-footer-val">{scoreLabel}</span>
                        <div className="rpt-level-icon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                  {percentile && (
                    <div className="rpt-score-footer-item">
                      <span className="rpt-score-footer-label">PERCENTIL</span>
                      <div className="rpt-score-footer-val-row">
                        <span className="rpt-score-footer-pct">{percentile}%</span>
                      </div>
                      <span className="rpt-score-footer-sub">de los usuarios</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Executive summary */}
            {feedback.executiveSummary && (
              <div className="rpt-card rpt-exec">
                <p className="rpt-card-label">RESUMEN EJECUTIVO</p>
                {feedback.headline && (
                  <p className="rpt-exec-headline"><Bold text={feedback.headline} /></p>
                )}
                <p className="rpt-exec-text"><Bold text={feedback.executiveSummary} /></p>
              </div>
            )}
          </div>

          {/* Radar */}
          <div className="rpt-radar-card">
            <p className="rpt-radar-title">DESEMPEÑO POR DIMENSIÓN</p>
            <RadarChart axisValues={axisValues} />
          </div>
        </div>

        {/* ── Went well + To improve (single card, two columns) ── */}
        <div className="rpt-card rpt-feedback-grid">
          {/* Left: went well */}
          <div className="rpt-feedback-col">
            <div className="rpt-feedback-header rpt-feedback-header--good">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              ¿QUÉ HICISTE BIEN?
            </div>
            <div className="rpt-items">
              {(feedback.wentWell || []).map((item, i) => {
                const ax = item.axis
                const iconColor = ax ? AXIS_COLORS[ax] : '#16a34a'
                return (
                  <div key={i} className="rpt-item">
                    <div className="rpt-item-icon" style={{ background: `${iconColor}18`, color: iconColor }}>
                      {ax && ItemIcons[ax] ? ItemIcons[ax] : ItemIcons.consistencia}
                    </div>
                    <div className="rpt-item-body">
                      <div className="rpt-item-titlerow">
                        <span className="rpt-item-title">{item.title}</span>
                        {ax && <AxisTag axis={ax} />}
                      </div>
                      <p className="rpt-item-desc"><Bold text={item.description || ''} /></p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rpt-feedback-divider" />

          {/* Right: to improve */}
          <div className="rpt-feedback-col">
            <div className="rpt-feedback-header rpt-feedback-header--improve">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              OPORTUNIDADES DE MEJORA
            </div>
            <div className="rpt-items">
              {(feedback.toImprove || []).map((item, i) => {
                const ax = item.axis
                return (
                  <div key={i} className="rpt-item">
                    <div className="rpt-item-icon rpt-item-icon--improve">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6H8.3C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z"/>
                      </svg>
                    </div>
                    <div className="rpt-item-body">
                      <div className="rpt-item-titlerow">
                        <span className="rpt-item-title">{item.title}</span>
                        {ax && <AxisTag axis={ax} />}
                      </div>
                      <p className="rpt-item-desc"><Bold text={item.description || ''} /></p>
                      {item.verbatim && (() => {
                        const raw = item.verbatim.trim()
                        const capitalized = raw.charAt(0).toUpperCase() + raw.slice(1)
                        const prefix = raw.charAt(0) === raw.charAt(0).toLowerCase() ? '(...) ' : ''
                        const suffix = /[.!?]$/.test(raw) ? '' : ' (...)'
                        const question = item.verbatimQuestion || null
                        return (
                          <div className="rpt-verbatim">
                            <div className="rpt-verbatim-header">
                              <span className="rpt-verbatim-label">Fragmento detectado</span>
                              {question && (
                                <span className="rpt-verbatim-question">Pregunta: {question}</span>
                              )}
                            </div>
                            <p className="rpt-verbatim-text">{prefix}{capitalized}{suffix}</p>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Action plan ── */}
        {Array.isArray(feedback.actionPlan) && feedback.actionPlan.length > 0 && (
          <div className="rpt-card rpt-action-card">
            <div className="rpt-action-top">
              <div className="rpt-action-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
              <div>
                <p className="rpt-action-title">PLAN DE ACCIÓN RECOMENDADO</p>
                <p className="rpt-action-sub">Acciones concretas para seguir mejorando</p>
              </div>
            </div>
            <div className="rpt-action-items">
              {feedback.actionPlan.map((item, i) => (
                <div key={i} className="rpt-action-item-wrap">
                  <div className="rpt-action-item">
                    <div className="rpt-action-num">{i + 1}</div>
                    <p className="rpt-action-item-title">{item.title}</p>
                    <p className="rpt-action-item-desc"><Bold text={item.description || ''} /></p>
                    <div className="rpt-priority">
                      <span className={`rpt-priority-badge rpt-priority-badge--${item.priority || 'media'}`}>
                        ↑ Prioridad {item.priority || 'media'}
                      </span>
                    </div>
                  </div>
                  {i < feedback.actionPlan.length - 1 && (
                    <div className="rpt-action-arrow">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Next step + Resources (single card) ── */}
        {(feedback.nextStep || resources.length > 0) && (
          <div className="rpt-card rpt-bottom-card">
            {feedback.nextStep && (
              <div className="rpt-bottom-col">
                <div className="rpt-next-icon-wrap">
                  <div className="rpt-next-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                </div>
                <div className="rpt-next-content">
                  <p className="rpt-card-label">PRÓXIMO PASO SUGERIDO</p>
                  <p className="rpt-next-text"><Bold text={feedback.nextStep || ''} /></p>
                </div>
              </div>
            )}
            {feedback.nextStep && resources.length > 0 && (
              <div className="rpt-bottom-divider" />
            )}
            {resources.length > 0 && (
              <div className="rpt-bottom-col rpt-bottom-col--resources">
                <p className="rpt-card-label">RECURSOS RECOMENDADOS</p>
                <div className="rpt-resource-list">
                  {resources.map(r => (
                    <a key={r.slug} href={`/blog/${r.slug}`} target="_blank" rel="noopener noreferrer" className="rpt-resource-link">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      {r.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Q&A Review ── */}
        {Array.isArray(feedback.qa_review) && feedback.qa_review.length > 0 && (
          <div className="rpt-card" style={{ padding: 24, marginBottom: 16 }}>
            <p className="rpt-card-label" style={{ marginBottom: 16 }}>REVISIÓN DE RESPUESTAS</p>
            <QAReviewTable qaReview={feedback.qa_review} />
          </div>
        )}

      </div>

      {/* ── Footer ── */}
      <div className="rpt-footer">
        <img src="/logo.png" alt="FeelReady" className="rpt-footer-logo" />
        <span>Tu camino hacia tu mejor versión profesional</span>
        <span>feelready.io</span>
      </div>
    </div>

    {/* ── Actions (below footer) ── */}
    {saveFailed && (
      <div className="err-save-notice">
        No pudimos guardar tu entrevista. El feedback sigue disponible en pantalla.
      </div>
    )}
    <div className="rpt-actions-bar">
      <button
        className="rpt-btn-secondary"
        data-track="feedback_downloaded"
        onClick={downloadReport}
      >
        Descargar reporte
      </button>
      <button className="rpt-btn-primary" onClick={onRestart} data-track="restart_interview_clicked">
        {onDashboard ? 'Nueva entrevista →' : 'Ir al inicio'}
      </button>
    </div>
  </>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────

export default function FeedbackSummary({ feedback, config, onRestart, onDashboard, onBack, saveFailed }) {
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
      <div className="fb-page"><div className="fb-card">
        <div className="fb-logo" onClick={onDashboard} style={onDashboard ? { cursor: 'pointer' } : undefined}><IntervyouIcon /></div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, padding:'8px 0 4px' }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <h2 style={{ margin:0, fontSize:20, fontWeight:700, color:'#111827', textAlign:'center' }}>Problema al generar feedback</h2>
          <p style={{ margin:0, fontSize:14, color:'#6b7280', textAlign:'center', lineHeight:1.6 }}>
            Ocurrió un error al procesar tu entrevista.<br />Podés intentar una nueva entrevista.
          </p>
        </div>
        <div className="fb-actions"><button className="fb-restart" onClick={onRestart}>{onDashboard ? 'Nueva entrevista →' : 'Ir al inicio'}</button></div>
      </div></div>
    )
  }

  if (feedback.notEnoughData) {
    return (
      <div style={{ minHeight: '100vh', background: '#F7F9FD', display: 'flex', flexDirection: 'column', fontFamily: 'inherit' }}>
        <header style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '16px 24px' }}>
          <img src="/logo.png" alt="FeelReady" style={{ height: 32, width: 'auto', display: 'block' }} />
        </header>
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 32, maxWidth: 480, textAlign: 'center' }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0, marginBottom: 8 }}>Entrevista muy corta</h2>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6, margin: 0, marginBottom: 24 }}>
              Necesitamos al menos un par de respuestas para analizar cómo te expresás.<br />Intentá completar más preguntas la próxima vez.
            </p>
            <button
              onClick={onDashboard}
              style={{ padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: '#7C3AED', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Ir a inicio
            </button>
          </div>
        </main>
        <footer style={{ borderTop: '1px solid #E5E7EB', padding: '16px 24px', textAlign: 'center', fontSize: 12, color: '#9CA3AF' }}>
          <div style={{ marginBottom: 4 }}>FeelReady — practicá conversaciones difíciles antes de tenerlas.</div>
          <a href="https://feelready.io" style={{ color: '#7C3AED', textDecoration: 'none' }}>feelready.io</a>
        </footer>
      </div>
    )
  }

  if (Array.isArray(feedback.actionPlan)) {
    return <NewFeedback feedback={feedback} config={config} onRestart={onRestart} onDashboard={onDashboard} onBack={onBack} saveFailed={saveFailed} />
  }

  return <LegacyFeedback feedback={feedback} onRestart={onRestart} onDashboard={onDashboard} />
}
