import { useState, useEffect } from 'react'
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
  // Normalize: lowercase, trim, remove punctuation for matching
  const normalized = name.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').trim()
  if (KNOWN_DOMAINS[normalized]) return KNOWN_DOMAINS[normalized]
  // Also try without spaces
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
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
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
  const stripBold = (s) => s.replace(/\*\*/g, '')

  let text = `${title}\n`
  text += `${formatDate(completed_at)}\n`
  if (config?.interviewType) text += `Tipo: ${TYPE_LABEL[config.interviewType] ?? config.interviewType}\n`
  if (config?.difficulty) text += `Nivel: ${DIFFICULTY_LABEL[config.difficulty] ?? config.difficulty}\n`
  if (feedback?.score) text += `Score: ${Math.round(feedback.score)}/1000\n`
  if (feedback?.headline) text += `\n${feedback.headline}\n`

  if (feedback?.went_well?.length) {
    text += `\nPuntos fuertes\n`
    feedback.went_well.forEach(item => { text += `• ${stripBold(item)}\n` })
  }
  if (feedback?.to_improve?.length) {
    text += `\nOportunidades de mejora\n`
    feedback.to_improve.forEach(item => { text += `• ${stripBold(item)}\n` })
  }
  if (feedback?.suggestions?.length) {
    text += `\nAccionables concretos\n`
    feedback.suggestions.forEach(item => { text += `• ${stripBold(item)}\n` })
  }

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function InterviewRow({ interview, onClick }) {
  const { config, completed_at, interview_feedback } = interview
  const feedback = interview_feedback?.[0]
  const hasFeedback = !!feedback?.score
  const title = [config?.jobTitle, config?.companyName].filter(Boolean).join(' para ') || 'Entrevista sin título'
  const difficulty = DIFFICULTY_LABEL[config?.difficulty] ?? config?.difficulty
  const type = TYPE_LABEL[config?.interviewType] ?? config?.interviewType

  return (
    <div
      className={`iv-row ${hasFeedback ? 'iv-row--clickable' : 'iv-row--disabled'}`}
      onClick={hasFeedback ? onClick : undefined}
    >
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
        {hasFeedback
          ? <ScoreBadge score={feedback.score} />
          : null
        }
        {hasFeedback && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        )}
      </div>
    </div>
  )
}

function InterviewDetail({ id, onBack, onRepeat }) {
  const { getToken } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const token = await getToken()
      const res = await fetch(`/api/interviews/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const json = await res.json()
      setData(json)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="iv-loading"><div className="spinner" /></div>
  if (!data) return <div className="iv-empty">No se encontró la entrevista.</div>

  const { config, completed_at, interview_feedback } = data
  const feedback = interview_feedback?.[0]
  const title = [config?.jobTitle, config?.companyName].filter(Boolean).join(' para ') || 'Entrevista'

  return (
    <div className="iv-detail">
      <div className="iv-detail-topbar">
        <button className="iv-back-btn" onClick={onBack}>
          ← Volver a mis entrevistas
        </button>
        <div style={{ display:'flex', gap:8 }}>
          {config && onRepeat && (
            <button className="iv-repeat-btn" onClick={() => onRepeat(config)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
              </svg>
              Realizar nuevamente
            </button>
          )}
          {feedback && (
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
        {feedback?.score && <ScoreBadge score={feedback.score} />}
      </div>

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

export default function MyInterviews({ onNewInterview, onRepeat }) {
  const { getToken } = useAuth()
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)

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
    return <InterviewDetail id={selectedId} onBack={() => setSelectedId(null)} onRepeat={onRepeat} />
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
        <div className="iv-list">
          {interviews.map(iv => (
            <InterviewRow key={iv.id} interview={iv} onClick={() => setSelectedId(iv.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
