import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

function ScoreLineChart({ points }) {
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

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block' }}>
      {/* Grid */}
      {gridScores.map(v => (
        <g key={v}>
          <line x1={pad.left} x2={W - pad.right} y1={yOf(v)} y2={yOf(v)} stroke="#e2e8f0" strokeWidth="1" />
          <text x={pad.left - 8} y={yOf(v) + 4} textAnchor="end" fontSize="11" fill="#94a3b8">{v}</text>
        </g>
      ))}

      {/* Area fill */}
      <polygon points={area} fill="url(#scoreGrad)" opacity="0.15" />

      {/* Line */}
      <polyline points={polyline} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {/* Points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={xOf(i)} cy={yOf(p.score)} r="5" fill="#fff" stroke="#6366f1" strokeWidth="2.5" />
          <text x={xOf(i)} y={yOf(p.score) - 10} textAnchor="middle" fontSize="11" fontWeight="600" fill="#6366f1">{Math.round(p.score)}</text>
        </g>
      ))}

      {/* X-axis labels */}
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
  )
}

function EmptyProgress({ onNewInterview }) {
  return (
    <div className="iv-empty">
      <div className="prog-empty-art">
        <svg viewBox="0 0 160 140" width="160" height="140" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#818cf8"/>
              <stop offset="100%" stopColor="#6366f1"/>
            </linearGradient>
            <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c7d2fe"/>
              <stop offset="100%" stopColor="#a5b4fc"/>
            </linearGradient>
          </defs>
          {/* base platform */}
          <ellipse cx="80" cy="118" rx="60" ry="12" fill="#e2e8f0"/>
          {/* bar 1 */}
          <rect x="32" y="70" width="22" height="44" rx="4" fill="url(#g2)" opacity="0.7"/>
          <rect x="32" y="66" width="22" height="8" rx="4" fill="#c7d2fe"/>
          {/* bar 2 */}
          <rect x="60" y="44" width="22" height="70" rx="4" fill="url(#g1)" opacity="0.85"/>
          <rect x="60" y="40" width="22" height="8" rx="4" fill="#818cf8"/>
          {/* bar 3 */}
          <rect x="88" y="56" width="22" height="58" rx="4" fill="url(#g2)" opacity="0.7"/>
          <rect x="88" y="52" width="22" height="8" rx="4" fill="#c7d2fe"/>
          {/* bar 4 */}
          <rect x="116" y="30" width="22" height="84" rx="4" fill="url(#g1)"/>
          <rect x="116" y="26" width="22" height="8" rx="4" fill="#6366f1"/>
          {/* sparkle */}
          <circle cx="130" cy="20" r="4" fill="#f59e0b" opacity="0.8"/>
          <circle cx="40" cy="58" r="3" fill="#10b981" opacity="0.6"/>
        </svg>
      </div>
      <h3>Todavía no tenés puntuaciones</h3>
      <p>Completá tu primera entrevista para ver tu progreso acá.</p>
    </div>
  )
}

export default function MyProgress() {
  const { getToken } = useAuth()
  const [points, setPoints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const token = await getToken()
      const res = await fetch('/api/interviews', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const list = await res.json()
      const scored = (Array.isArray(list) ? list : [])
        .filter(iv => iv.interview_feedback?.[0]?.score != null)
        .map(iv => ({ date: iv.completed_at, score: iv.interview_feedback[0].score }))
        .reverse()
      setPoints(scored)
      setLoading(false)
    }
    load()
  }, [])

  const avg = points.length ? Math.round(points.reduce((s, p) => s + p.score, 0) / points.length) : null
  const best = points.length ? Math.round(Math.max(...points.map(p => p.score))) : null
  const last = points.length ? Math.round(points[points.length - 1].score) : null

  return (
    <div className="iv-page">
      <div className="db-page-header">
        <h2>Mi progreso</h2>
      </div>

      {loading && <div className="iv-loading"><div className="spinner" /></div>}

      {!loading && points.length === 0 && <EmptyProgress />}

      {!loading && points.length > 0 && (
        <>
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
              <div className="prog-stat-value">{points.length}</div>
            </div>
          </div>

          <div className="prog-chart-card">
            <div className="prog-chart-title">Evolución de puntuaciones</div>
            <ScoreLineChart points={points} />
          </div>
        </>
      )}
    </div>
  )
}
