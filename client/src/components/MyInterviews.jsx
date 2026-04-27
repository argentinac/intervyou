import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const DIFFICULTY_LABEL = { Junior: 'Junior', Intermediate: 'Semi-Senior', Senior: 'Senior' }
const TYPE_LABEL = { HR: 'RRHH', Technical: 'Técnica', 'Real Simulation': 'Simulación real', Coach: 'Coach' }

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

function ScoreBadge({ score }) {
  if (score === null || score === undefined) return null
  const color = score >= 8 ? '#10b981' : score >= 6 ? '#f59e0b' : '#ef4444'
  return (
    <span className="iv-score-badge" style={{ background: color + '18', color }}>
      {score.toFixed(1)}<span style={{ fontSize: 11, opacity: 0.7 }}>/10</span>
    </span>
  )
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

function InterviewDetail({ id, onBack }) {
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
      <button className="iv-back-btn" onClick={onBack}>
        ← Volver a mis entrevistas
      </button>

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
            {feedback.went_well.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      )}

      {feedback?.to_improve?.length > 0 && (
        <div className="iv-detail-section">
          <h3>Oportunidades de mejora</h3>
          <ul>
            {feedback.to_improve.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      )}

      {feedback?.suggestions?.length > 0 && (
        <div className="iv-detail-section">
          <h3>Accionables concretos</h3>
          <ul className="iv-detail-suggestions">
            {feedback.suggestions.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function MyInterviews({ onNewInterview }) {
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
        <div className="iv-list">
          {interviews.map(iv => (
            <InterviewRow key={iv.id} interview={iv} onClick={() => setSelectedId(iv.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
