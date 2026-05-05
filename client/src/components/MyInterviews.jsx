import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

const DIFFICULTY_LABEL = { Junior: 'Junior', Intermediate: 'Semi-Senior', Senior: 'Senior' }
const TYPE_LABEL = { HR: 'RRHH', Technical: 'Técnica', 'Real Simulation': 'Simulación real', Coach: 'Coach' }

const KNOWN_DOMAINS = {
  'gcba': 'buenosaires.gob.ar',
  'gobierno de la ciudad': 'buenosaires.gob.ar',
  'gobierno ciudad': 'buenosaires.gob.ar',
  'tiendanube': 'tiendanube.com',
  'tienda nube': 'tiendanube.com',
  'mercadolibre': 'mercadolibre.com',
  'mercado libre': 'mercadolibre.com',
  'mercadopago': 'mercadopago.com',
  'mercado pago': 'mercadopago.com',
  'naranjax': 'naranjax.com',
  'naranja x': 'naranjax.com',
  'auth0': 'auth0.com',
  'satellogic': 'satellogic.com',
  'despegar': 'despegar.com',
  'globant': 'globant.com',
  'ualá': 'uala.com.ar',
  'uala': 'uala.com.ar',
  'olx': 'olx.com',
}

function companyDomain(name) {
  if (!name) return null
  const normalized = name.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').trim()
  if (KNOWN_DOMAINS[normalized]) return KNOWN_DOMAINS[normalized]
  const noSpaces = normalized.replace(/\s+/g, '')
  if (KNOWN_DOMAINS[noSpaces]) return KNOWN_DOMAINS[noSpaces]
  return noSpaces + '.com'
}

function renderBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)
}

function CompanyLogo({ name }) {
  const [srcIndex, setSrcIndex] = useState(0)
  const domain = companyDomain(name)
  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?'

  const sources = domain ? [
    `https://img.logo.dev/${domain}?token=pk_IIJF6dh5Sd-mR00qgPmF9g`,
  ] : []

  if (!sources.length || srcIndex >= sources.length) {
    return <div className="iv-company-initials">{initials}</div>
  }
  return (
    <img
      className="iv-company-logo"
      src={sources[srcIndex]}
      alt={name}
      onError={() => setSrcIndex(prev => prev + 1)}
    />
  )
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

function formatDateShort(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function ScoreBadge({ score }) {
  if (score === null || score === undefined) return null
  const color = score >= 800 ? '#10b981' : score >= 600 ? '#f59e0b' : '#ef4444'
  return (
    <span className="iv-score-badge" style={{ background: color + '18', color }}>
      <span style={{ fontSize: 11, opacity: 0.7 }}>Score </span>{Math.round(score)}
    </span>
  )
}

function downloadFeedback(data) {
  const { config, completed_at, interview_feedback } = data
  const feedback = interview_feedback?.[0]
  const title = [config?.jobTitle, config?.companyName].filter(Boolean).join(' para ') || 'Entrevista'
  const strip = (s) => (s || '').replace(/\*\*/g, '')
  const typeLabel = TYPE_LABEL[config?.interviewType] ?? config?.interviewType ?? ''
  const diffLabel = DIFFICULTY_LABEL[config?.difficulty] ?? config?.difficulty ?? ''

  const sectionHtml = (heading, items) => items?.length
    ? `<h2>${heading}</h2><ul>${items.map(i => `<li>${strip(i)}</li>`).join('')}</ul>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;max-width:680px;margin:40px auto;padding:0 24px;color:#1e293b;line-height:1.6}
  h1{font-size:22px;margin:0 0 4px;color:#0f172a}
  .meta{font-size:13px;color:#64748b;margin-bottom:8px}
  .badges{margin-bottom:16px}
  .badge{display:inline-block;padding:2px 10px;border-radius:99px;font-size:12px;font-weight:600;background:#eff6ff;color:#3b82f6;margin-right:6px}
  .score{font-size:20px;font-weight:700;color:#6366f1;margin-bottom:12px}
  .headline{font-size:15px;color:#475569;font-style:italic;margin-bottom:24px;border-left:3px solid #6366f1;padding-left:12px}
  h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;margin:24px 0 8px}
  ul{padding-left:20px;margin:0}
  li{font-size:14px;color:#374151;margin-bottom:5px;line-height:1.55}
  hr{border:none;border-top:1px solid #e2e8f0;margin:20px 0}
  @media print{body{margin:0}}
</style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">${formatDate(completed_at)}</div>
  <div class="badges">
    ${typeLabel ? `<span class="badge">${typeLabel}</span>` : ''}
    ${diffLabel ? `<span class="badge">${diffLabel}</span>` : ''}
  </div>
  ${feedback?.score ? `<div class="score">Score: ${Math.round(feedback.score)}/1000</div>` : ''}
  ${feedback?.headline ? `<div class="headline">${strip(feedback.headline)}</div>` : ''}
  <hr>
  ${sectionHtml('Puntos fuertes', feedback?.went_well)}
  ${sectionHtml('Oportunidades de mejora', feedback?.to_improve)}
  ${sectionHtml('Accionables concretos', feedback?.suggestions)}
</body>
</html>`

  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print() }, 300)
}

// ── Progress chart ────────────────────────────────────────────────────────────

function ScoreLineChart({ points, onPointClick }) {
  const [tooltip, setTooltip] = useState(null)
  const svgRef = useRef(null)

  if (points.length < 1) return null

  const W = 600, H = 220
  const pad = { top: 20, right: 24, bottom: 48, left: 44 }
  const chartW = W - pad.left - pad.right
  const chartH = H - pad.top - pad.bottom

  const scores = points.map(p => p.score)
  const minS = Math.max(0, Math.min(...scores) - 50)
  const maxS = Math.min(1000, Math.max(...scores) + 50)

  const xOf = (i) => pad.left + (points.length === 1 ? chartW / 2 : (i / (points.length - 1)) * chartW)
  const yOf = (s) => pad.top + chartH - ((s - minS) / (maxS - minS)) * chartH

  const polyline = points.map((p, i) => `${xOf(i)},${yOf(p.score)}`).join(' ')
  const area = `${xOf(0)},${pad.top + chartH} ${polyline} ${xOf(points.length - 1)},${pad.top + chartH}`

  const gridScores = [0, 250, 500, 750, 1000].filter(v => v >= minS && v <= maxS)

  const handlePointEnter = (e, p, i) => {
    const svgEl = svgRef.current
    if (!svgEl) return
    const rect = svgEl.getBoundingClientRect()
    const svgW = rect.width
    const scaleX = svgW / W
    const scaleY = rect.height / H
    const cx = xOf(i) * scaleX
    const cy = yOf(p.score) * scaleY
    setTooltip({ p, cx, cy })
  }

  const handlePointLeave = () => setTooltip(null)

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block' }}>
        {gridScores.map(v => (
          <g key={v}>
            <line x1={pad.left} x2={W - pad.right} y1={yOf(v)} y2={yOf(v)} stroke="#e2e8f0" strokeWidth="1" />
            <text x={pad.left - 8} y={yOf(v) + 4} textAnchor="end" fontSize="11" fill="#94a3b8">{v}</text>
          </g>
        ))}

        <polygon points={area} fill="url(#scoreGrad)" opacity="0.15" />
        <polyline points={polyline} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {points.map((p, i) => (
          <g
            key={i}
            style={{ cursor: onPointClick ? 'pointer' : 'default' }}
            onMouseEnter={(e) => handlePointEnter(e, p, i)}
            onMouseLeave={handlePointLeave}
            onClick={() => onPointClick && onPointClick(p.id)}
          >
            <circle cx={xOf(i)} cy={yOf(p.score)} r="14" fill="transparent" />
            <circle cx={xOf(i)} cy={yOf(p.score)} r="5" fill="#fff" stroke="#6366f1" strokeWidth="2.5" />
            <text x={xOf(i)} y={yOf(p.score) - 10} textAnchor="middle" fontSize="11" fontWeight="600" fill="#6366f1">{Math.round(p.score)}</text>
          </g>
        ))}

        {points.map((p, i) => (
          <text key={i} x={xOf(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#94a3b8">
            {new Date(p.date).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
          </text>
        ))}

        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {tooltip && (
        <div
          className="prog-tooltip"
          style={{ left: tooltip.cx, top: tooltip.cy }}
        >
          <div className="prog-tooltip-title">
            {[tooltip.p.jobTitle, tooltip.p.companyName].filter(Boolean).join(' para ') || 'Entrevista'}
          </div>
          <div className="prog-tooltip-meta">{formatDateShort(tooltip.p.date)}</div>
          {tooltip.p.type && (
            <div className="prog-tooltip-meta">
              {TYPE_LABEL[tooltip.p.type] ?? tooltip.p.type}
              {tooltip.p.difficulty ? ` · ${DIFFICULTY_LABEL[tooltip.p.difficulty] ?? tooltip.p.difficulty}` : ''}
            </div>
          )}
          <div className="prog-tooltip-score">{Math.round(tooltip.p.score)}<span>/1000</span></div>
          {onPointClick && <div className="prog-tooltip-hint">Click para ver detalle</div>}
        </div>
      )}
    </div>
  )
}

function ProgressStats({ interviews, onPointClick }) {
  const scored = interviews
    .filter(iv => iv.interview_feedback?.[0]?.score != null)
    .map(iv => ({
      id: iv.id,
      date: iv.completed_at,
      score: iv.interview_feedback[0].score,
      jobTitle: iv.config?.jobTitle,
      companyName: iv.config?.companyName,
      type: iv.config?.interviewType,
      difficulty: iv.config?.difficulty,
    }))
    .reverse()

  if (scored.length === 0) return null

  const avg = Math.round(scored.reduce((s, p) => s + p.score, 0) / scored.length)
  const best = Math.round(Math.max(...scored.map(p => p.score)))
  const last = Math.round(scored[scored.length - 1].score)

  return (
    <div className="iv-progress-block">
      <div className="prog-stats">
        <div className="prog-stat-card">
          <div className="prog-stat-label">Última puntuación</div>
          <div className="prog-stat-value">{last}<span>/1000</span></div>
        </div>
        <div className="prog-stat-card">
          <div className="prog-stat-label">Promedio general</div>
          <div className="prog-stat-value">{avg}<span>/1000</span></div>
        </div>
        <div className="prog-stat-card">
          <div className="prog-stat-label">Mejor puntuación</div>
          <div className="prog-stat-value prog-stat-value--best">{best}<span>/1000</span></div>
        </div>
        <div className="prog-stat-card">
          <div className="prog-stat-label">Entrevistas</div>
          <div className="prog-stat-value">{scored.length}</div>
        </div>
      </div>

      {scored.length >= 2 && (
        <div className="prog-chart-card">
          <div className="prog-chart-title">Evolución de puntuaciones</div>
          <ScoreLineChart points={scored} onPointClick={onPointClick} />
        </div>
      )}
    </div>
  )
}

// ── Interview row & detail ────────────────────────────────────────────────────

function InterviewRow({ interview, onClick }) {
  const { config, completed_at, interview_feedback } = interview
  const feedback = interview_feedback?.[0]
  const hasFeedback = !!feedback?.score
  const title = [config?.jobTitle, config?.companyName].filter(Boolean).join(' para ') || 'Entrevista sin título'
  const difficulty = DIFFICULTY_LABEL[config?.difficulty] ?? config?.difficulty
  const type = TYPE_LABEL[config?.interviewType] ?? config?.interviewType

  return (
    <div className="iv-row iv-row--clickable" onClick={onClick}>
      {config?.companyName && (
        <div className="iv-row-logo">
          <CompanyLogo name={config.companyName} />
        </div>
      )}
      <div className="iv-row-main">
        <div className="iv-row-title">{title}</div>
        <div className="iv-row-meta">
          {formatDate(completed_at)}
          {type && <span className="iv-badge iv-badge--type">{type}</span>}
          {difficulty && <span className="iv-badge iv-badge--diff">{difficulty}</span>}
          {!hasFeedback && <span className="iv-badge iv-badge--nofeedback">Sin feedback disponible</span>}
        </div>
      </div>
      <div className="iv-row-right">
        {hasFeedback && <ScoreBadge score={feedback.score} />}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </div>
  )
}

function InterviewDetail({ id, onBack }) {
  const { getToken } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken()
        const res = await fetch(`/api/interviews/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (!res.ok) {
          setError('No se pudo cargar la entrevista.')
          setLoading(false)
          return
        }
        const json = await res.json()
        setData(json)
        setLoading(false)
      } catch {
        setError('Error al cargar la entrevista.')
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="iv-loading"><div className="spinner" /></div>
  if (error) return <div className="iv-empty">{error}</div>
  if (!data) return <div className="iv-empty">No se encontró la entrevista.</div>

  const { config, completed_at, interview_feedback } = data
  const feedback = interview_feedback?.[0]
  const hasFeedback = !!feedback?.score
  const title = [config?.jobTitle, config?.companyName].filter(Boolean).join(' para ') || 'Entrevista'

  return (
    <div className="iv-detail">
      <div className="iv-detail-topbar">
        <button className="iv-back-btn" onClick={onBack}>
          ← Volver a mis entrevistas
        </button>
        <div style={{ display:'flex', gap:8 }}>
          {hasFeedback && (
            <button className="iv-download-btn" onClick={() => downloadFeedback(data)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Descargar
            </button>
          )}
        </div>
      </div>

      <div className="iv-detail-header">
        <div>
          <h2>{title}</h2>
          <div className="iv-row-meta" style={{ marginTop: 6 }}>
            {formatDate(completed_at)}
            {config?.interviewType && <span className="iv-badge iv-badge--type">{TYPE_LABEL[config.interviewType] ?? config.interviewType}</span>}
            {config?.difficulty && <span className="iv-badge iv-badge--diff">{DIFFICULTY_LABEL[config.difficulty] ?? config.difficulty}</span>}
          </div>
        </div>
        {hasFeedback && <ScoreBadge score={feedback.score} />}
      </div>

      {!hasFeedback && (
        <div className="iv-detail-no-feedback">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>Esta entrevista no tiene feedback disponible.</p>
        </div>
      )}

      {feedback?.headline && (
        <p className="iv-detail-headline">{feedback.headline}</p>
      )}

      {feedback?.went_well?.length > 0 && (
        <div className="iv-detail-section">
          <h3>Puntos fuertes</h3>
          <ul>
            {feedback.went_well.map((item, i) => <li key={i}>{renderBold(item)}</li>)}
          </ul>
        </div>
      )}

      {feedback?.to_improve?.length > 0 && (
        <div className="iv-detail-section">
          <h3>Oportunidades de mejora</h3>
          <ul>
            {feedback.to_improve.map((item, i) => <li key={i}>{renderBold(item)}</li>)}
          </ul>
        </div>
      )}

      {feedback?.suggestions?.length > 0 && (
        <div className="iv-detail-section">
          <h3>Accionables concretos</h3>
          <ul className="iv-detail-suggestions">
            {feedback.suggestions.map((item, i) => <li key={i}>{renderBold(item)}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function MyInterviews({ onNewInterview, onRepeat, initialSelectedId }) {
  const { getToken } = useAuth()
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(initialSelectedId || null)

  useEffect(() => {
    if (initialSelectedId) setSelectedId(initialSelectedId)
  }, [initialSelectedId])

  useEffect(() => {
    async function load() {
      const token = await getToken()
      const res = await fetch('/api/interviews', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const json = await res.json()
      setInterviews(Array.isArray(json) ? json : [])
      setLoading(false)
    }
    load()
  }, [])

  if (selectedId) {
    return <InterviewDetail id={selectedId} onBack={() => setSelectedId(null)} />
  }

  return (
    <div className="iv-page">
      <div className="db-page-header">
        <h2>Mis entrevistas</h2>
      </div>

      {loading && <div className="iv-loading"><div className="spinner" /></div>}

      {!loading && interviews.length === 0 && (
        <div className="iv-empty">
          <div className="iv-empty-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
            </svg>
          </div>
          <h3>Todavía no tenés entrevistas</h3>
          <p>Hacé tu primera simulación y vas a ver tu historial acá.</p>
          <button className="db-btn-primary" onClick={onNewInterview}>Hacer mi primera entrevista</button>
        </div>
      )}

      {!loading && interviews.length > 0 && (
        <>
          <ProgressStats interviews={interviews} onPointClick={(id) => setSelectedId(id)} />
          <div className="iv-list">
            {interviews.map(iv => (
              <InterviewRow key={iv.id} interview={iv} onClick={() => setSelectedId(iv.id)} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
