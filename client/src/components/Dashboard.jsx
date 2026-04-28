import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import MyInterviews from './MyInterviews'
import MyProgress from './MyProgress'
import MyProfile from './MyProfile'
import SettingsPage from './SettingsPage'
import BlogListPage from './BlogListPage'
import { INTERVIEW_TIPS } from '../data/tips'
import targetImg from '../assets/Target.png'
import mountainImg from '../assets/Montaña.png'

const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
)
const IconList = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)
const IconTrend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
  </svg>
)
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
const IconCrown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 20h20v2H2zM3 8l4 8h10l4-8-5 3-4-6-4 6z"/>
  </svg>
)
const IconBook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
)

const DAILY_TIP = INTERVIEW_TIPS[Math.floor(Date.now() / 86400000) % INTERVIEW_TIPS.length]

const PRACTICE_TYPES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    label: 'Preguntas de RRHH',
    sub: 'Contá sobre vos, fortalezas y debilidades.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    label: 'Preguntas técnicas',
    sub: 'Demostrá tus conocimientos y experiencia.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    label: 'Inglés',
    sub: 'Practicá entrevistas en inglés.',
  },
]

function MiniScoreChart({ interviews }) {
  const scored = interviews.filter(iv => iv.interview_feedback?.[0]?.score != null).slice(-7)
  if (scored.length < 2) return null
  const scores = scored.map(iv => iv.interview_feedback[0].score)
  const W = 220, H = 80, pad = 8
  const min = Math.max(0, Math.min(...scores) - 50)
  const max = Math.min(1000, Math.max(...scores) + 50)
  const x = (i) => pad + (i / (scores.length - 1)) * (W - pad * 2)
  const y = (s) => H - pad - ((s - min) / (max - min)) * (H - pad * 2)
  const points = scores.map((s, i) => `${x(i)},${y(s)}`).join(' ')
  const area = `M${x(0)},${y(scores[0])} ` + scores.map((s, i) => `L${x(i)},${y(s)}`).join(' ') + ` L${x(scores.length - 1)},${H} L${x(0)},${H} Z`
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#chartGrad)"/>
      <polyline points={points} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {scores.map((s, i) => (
        <circle key={i} cx={x(i)} cy={y(s)} r="3.5" fill="#fff" stroke="#6366f1" strokeWidth="2"/>
      ))}
    </svg>
  )
}

function makeMockInterview(i, score, daysAgo) {
  const companies = ['Mercado Libre', 'Globant', 'Despegar', 'OLX', 'Ualá', 'Naranja X', 'Auth0', 'Satellogic']
  const titles = ['Product Manager', 'Frontend Developer', 'Data Analyst', 'UX Designer', 'Backend Engineer', 'Tech Lead']
  const types = ['HR', 'Technical', 'Real Simulation']
  const difficulties = ['Junior', 'Intermediate', 'Senior']
  const date = new Date(Date.now() - daysAgo * 86400000).toISOString()
  return {
    id: `mock-${i}`,
    completed_at: date,
    config: {
      jobTitle: titles[i % titles.length],
      companyName: companies[i % companies.length],
      interviewType: types[i % types.length],
      difficulty: difficulties[i % difficulties.length],
    },
    interview_feedback: score != null ? [{
      score,
      headline: 'Buen desempeño general con áreas de mejora identificadas.',
      went_well: ['Comunicación clara', 'Ejemplos concretos'],
      to_improve: ['Profundidad técnica', 'Manejo del tiempo'],
      suggestions: ['Practicá el método STAR', 'Investigá más sobre la empresa'],
    }] : [],
  }
}

const DEMO_STATES = [
  { label: '0 entrevistas', interviews: [] },
  { label: '1 entrevista', interviews: [makeMockInterview(0, 680, 3)] },
  {
    label: '5 entrevistas',
    interviews: [
      makeMockInterview(0, 520, 30),
      makeMockInterview(1, 610, 22),
      makeMockInterview(2, 680, 15),
      makeMockInterview(3, 740, 8),
      makeMockInterview(4, 810, 2),
    ],
  },
  {
    label: '50 entrevistas',
    interviews: Array.from({ length: 50 }, (_, i) => {
      const score = Math.min(1000, 450 + (i / 50) * 450 + (Math.random() - 0.5) * 150)
      return makeMockInterview(i, Math.round(score), 180 - i * 3)
    }),
  },
]

function HomeSection({ onNewInterview, user, fullName, mockInterviews }) {
  const firstName = fullName
    ? fullName.split(' ')[0]
    : (user?.email?.split('@')[0] ?? 'ahí')

  const [realInterviews, setRealInterviews] = useState(null)
  const { getToken } = useAuth()

  useEffect(() => {
    if (mockInterviews !== undefined) return
    async function load() {
      try {
        const token = await getToken?.()
        const res = await fetch('/api/interviews', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const json = await res.json()
        setRealInterviews(Array.isArray(json) ? json : [])
      } catch {
        setRealInterviews([])
      }
    }
    load()
  }, [mockInterviews])

  const interviews = mockInterviews !== undefined ? mockInterviews : realInterviews

  const hasInterviews = interviews && interviews.length > 0
  const scoredInterviews = interviews?.filter(iv => iv.interview_feedback?.[0]?.score != null) ?? []
  const lastScore = scoredInterviews.length > 0 ? scoredInterviews[scoredInterviews.length - 1].interview_feedback[0].score : null
  const avgScore = scoredInterviews.length > 0
    ? (scoredInterviews.reduce((s, iv) => s + iv.interview_feedback[0].score, 0) / scoredInterviews.length).toFixed(1)
    : null

  return (
    <div className="db-home">
      {/* Header */}
      <div className="db-welcome">
        <h1>Hola, {firstName} 👋</h1>
        <p>Bienvenido a tu espacio de entrenamiento.</p>
      </div>

      {/* Hero banner — solo sin entrevistas */}
      {interviews !== null && !hasInterviews && (
        <div className="home-hero-banner">
          <div className="home-hero-text">
            <div className="home-hero-eyebrow">Empecemos tu camino</div>
            <h2>Tu primera entrevista te está esperando</h2>
            <p>Practicar es la mejor manera de prepararte y ganar confianza.</p>
            <button className="home-hero-btn" onClick={onNewInterview}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
              Comenzar mi primera entrevista
            </button>
          </div>
          <div className="home-hero-art" aria-hidden="true">
            <img src={targetImg} alt="" className="home-hero-img" />
          </div>
        </div>
      )}

      {/* Así es tu camino */}
      <div className="home-section">
        <div className="home-section-title">Así es tu camino en CoachToWork</div>
        <div className="home-journey">

          {/* 1. Practicá — micrófono 3D */}
          <div className="home-journey-item">
            <div className="home-journey-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="#eef2ff"/>
                <circle cx="32" cy="32" r="22" fill="#e0e7ff"/>
                <rect x="24" y="14" width="16" height="24" rx="8" fill="url(#mic-grad)"/>
                <rect x="26" y="16" width="6" height="4" rx="2" fill="white" opacity="0.4"/>
                <path d="M20 34c0 6.627 5.373 12 12 12s12-5.373 12-12" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <line x1="32" y1="46" x2="32" y2="52" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="26" y1="52" x2="38" y2="52" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="mic-grad" x1="24" y1="14" x2="40" y2="38" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#818cf8"/>
                    <stop offset="1" stopColor="#6366f1"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="home-journey-label">1. Practicá</div>
            <div className="home-journey-sub">Simulá entrevistas reales con IA.</div>
          </div>

          <div className="home-journey-connector" />

          {/* 2. Recibí feedback — documento con check 3D */}
          <div className="home-journey-item">
            <div className="home-journey-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="#f0fdf4"/>
                <circle cx="32" cy="32" r="22" fill="#dcfce7"/>
                <rect x="18" y="12" width="28" height="36" rx="4" fill="url(#doc-grad)"/>
                <rect x="20" y="14" width="10" height="6" rx="2" fill="white" opacity="0.35"/>
                <rect x="22" y="24" width="16" height="2.5" rx="1.25" fill="white" opacity="0.5"/>
                <rect x="22" y="30" width="12" height="2.5" rx="1.25" fill="white" opacity="0.4"/>
                <rect x="22" y="36" width="14" height="2.5" rx="1.25" fill="white" opacity="0.4"/>
                <circle cx="44" cy="44" r="10" fill="#22c55e"/>
                <path d="M39.5 44l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="doc-grad" x1="18" y1="12" x2="46" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4ade80"/>
                    <stop offset="1" stopColor="#16a34a"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="home-journey-label">2. Recibí feedback</div>
            <div className="home-journey-sub">Obtené un análisis personalizado.</div>
          </div>

          <div className="home-journey-connector" />

          {/* 3. Mejorá — flecha curva hacia arriba 3D */}
          <div className="home-journey-item">
            <div className="home-journey-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="#eff6ff"/>
                <circle cx="32" cy="32" r="22" fill="#dbeafe"/>
                <rect x="14" y="38" width="8" height="14" rx="2" fill="#60a5fa"/>
                <rect x="26" y="30" width="8" height="22" rx="2" fill="#3b82f6"/>
                <rect x="38" y="20" width="8" height="32" rx="2" fill="url(#bar-grad)"/>
                <rect x="40" y="22" width="3" height="5" rx="1" fill="white" opacity="0.35"/>
                <path d="M16 36 Q28 18 44 16" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="3 2"/>
                <polygon points="44,10 50,18 38,18" fill="#1d4ed8"/>
                <defs>
                  <linearGradient id="bar-grad" x1="38" y1="20" x2="46" y2="52" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#93c5fd"/>
                    <stop offset="1" stopColor="#2563eb"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="home-journey-label">3. Mejorá</div>
            <div className="home-journey-sub">Aplicá las sugerencias y repetí.</div>
          </div>

          <div className="home-journey-connector" />

          {/* 4. Crecé — trofeo 3D */}
          <div className="home-journey-item">
            <div className="home-journey-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="#fffbeb"/>
                <circle cx="32" cy="32" r="22" fill="#fef3c7"/>
                <path d="M22 14h20v16c0 5.523-4.477 10-10 10s-10-4.477-10-10V14z" fill="url(#trophy-grad)"/>
                <path d="M24 16h14v4H24z" fill="white" opacity="0.25"/>
                <path d="M22 18h-5a4 4 0 0 0 4 8h2" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M42 18h5a4 4 0 0 1-4 8h-2" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <rect x="28" y="40" width="8" height="6" rx="1" fill="#f59e0b"/>
                <rect x="24" y="46" width="16" height="4" rx="2" fill="url(#base-grad)"/>
                <defs>
                  <linearGradient id="trophy-grad" x1="22" y1="14" x2="42" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fcd34d"/>
                    <stop offset="1" stopColor="#f59e0b"/>
                  </linearGradient>
                  <linearGradient id="base-grad" x1="24" y1="46" x2="40" y2="50" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fbbf24"/>
                    <stop offset="1" stopColor="#d97706"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="home-journey-label">4. Crecé</div>
            <div className="home-journey-sub">Subí tu score y alcanzá tus objetivos.</div>
          </div>

        </div>
      </div>

      {/* Grid inferior */}
      <div className="home-grid">
        {/* ¿Qué podés practicar? */}
        <div className="home-card">
          <div className="home-card-title">¿Qué podés practicar?</div>
          <div className="home-practice-list">
            {PRACTICE_TYPES.map((pt, i) => (
              <button key={i} className="home-practice-item" onClick={onNewInterview}>
                <span className="home-practice-icon">{pt.icon}</span>
                <span className="home-practice-text">
                  <span className="home-practice-label">{pt.label}</span>
                  <span className="home-practice-sub">{pt.sub}</span>
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            ))}
          </div>
        </div>

        {/* Consejo del día */}
        <div className="home-card home-card--tip">
          <div className="home-tip-label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21h6"/><path d="M12 3a6 6 0 0 1 6 6c0 2.5-1.5 4.7-3.5 5.9V17H9.5v-2.1C7.5 13.7 6 11.5 6 9a6 6 0 0 1 6-6z"/></svg>
            Consejo del día
          </div>
          <div className="home-tip-body">
            <div className="home-tip-text">
              <blockquote className="home-tip-quote">"{DAILY_TIP}"</blockquote>
              <p className="home-tip-sub">Cuanto más practiques, más seguro y claro vas a ser.</p>
            </div>
            <img src={mountainImg} alt="" className="home-tip-img" />
          </div>
        </div>

        {/* Estadísticas */}
        <div className="home-card">
          <div className="home-card-title">Estadísticas</div>
          {scoredInterviews.length > 0 ? (
            <div className="home-stats">
              {scoredInterviews.length === 1 ? (
                <div className="home-stats-single">
                  <div className="home-stat-val-big">{Math.round(lastScore)}</div>
                  <div className="home-stat-key-sub">Tu última entrevista</div>
                </div>
              ) : (
                <div className="home-stats-nums">
                  <div className="home-stat">
                    <div className="home-stat-val">{Math.round(lastScore)}</div>
                    <div className="home-stat-key">Última</div>
                  </div>
                  <div className="home-stat">
                    <div className="home-stat-val">{Math.round(avgScore)}</div>
                    <div className="home-stat-key">Promedio</div>
                  </div>
                  <div className="home-stat">
                    <div className="home-stat-val">{scoredInterviews.length}</div>
                    <div className="home-stat-key">Total</div>
                  </div>
                </div>
              )}
              <MiniScoreChart interviews={interviews} />
            </div>
          ) : (
            <div className="home-stats-empty">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              <p>Completá tu primera entrevista para ver tu progreso.</p>
              <button className="db-btn-primary" onClick={onNewInterview}>Comenzar ahora</button>
            </div>
          )}
        </div>
      </div>

      {/* Banner de feedback */}
      <div className="home-feedback-banner">
        <div className="home-feedback-text">
          <span>¿Tenés sugerencias para mejorar CoachToWork?</span>
          <span className="home-feedback-sub">Tu opinión nos ayuda a crecer.</span>
        </div>
        <a href="mailto:matiasabas@gmail.com?subject=Feedback CoachToWork" className="home-feedback-btn">
          Danos feedback →
        </a>
      </div>
    </div>
  )
}

export default function Dashboard({ onNewInterview, onSignOut, onBlogPost, onRepeatInterview }) {
  const { user, signOut } = useAuth()
  const [section, setSection] = useState('home')
  const [deepInterviewId, setDeepInterviewId] = useState(null)
  const [profile, setProfile] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [demoIndex, setDemoIndex] = useState(null)
  const isAdmin = import.meta.env.DEV || user?.email === 'matiasabas@gmail.com'

  useEffect(() => {
    if (!user || !supabase) return
    supabase.from('profiles').select('tier, full_name').eq('id', user.id).single()
      .then(({ data }) => setProfile(data))
    supabase.from('subscriptions').select('tier, current_period_end, status').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => setSubscription(data))
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    onSignOut()
  }

  const isPremium = profile?.tier === 'premium'
  const daysLeft = subscription?.current_period_end
    ? Math.max(0, Math.ceil((new Date(subscription.current_period_end) - Date.now()) / 86400000))
    : null

  const navItems = [
    { id: 'home',       label: 'Inicio',               icon: <IconHome /> },
    { id: 'new',        label: 'Nueva entrevista',      icon: <IconPlus />, primary: true },
    { id: 'interviews', label: 'Mis entrevistas',       icon: <IconList /> },
    { id: 'progress',   label: 'Mi progreso',           icon: <IconTrend /> },
    { id: 'recursos',   label: 'Recursos',              icon: <IconBook /> },
    { id: 'profile',    label: 'Mi perfil profesional', icon: <IconUser /> },
    { id: 'settings',   label: 'Configuración',         icon: <IconSettings /> },
  ]

  const handleNav = (id) => {
    if (id === 'new') { onNewInterview(); return }
    setSection(id)
  }

  return (
    <div className="db-layout">
      <aside className="db-sidebar">
        <div className="db-sidebar-logo" onClick={() => setSection('home')} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="intervyou" style={{ height: 32, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
        </div>

        <nav className="db-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`db-nav-item ${item.primary ? 'db-nav-item--primary' : ''} ${section === item.id ? 'db-nav-item--active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              <span className="db-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="db-sidebar-bottom">
          <div className="db-plan-badge">
            {isPremium ? (
              <>
                <div className="db-plan-row">
                  <span className="db-plan-crown"><IconCrown /></span>
                  <span className="db-plan-name">Plan Premium</span>
                </div>
                {daysLeft !== null && (
                  <div className="db-plan-sub">{daysLeft} días restantes</div>
                )}
              </>
            ) : (
              <>
                <div className="db-plan-row">
                  <span className="db-plan-name">Plan Free</span>
                </div>
                <button className="db-plan-upgrade">Upgrade a Premium →</button>
              </>
            )}
          </div>

          <button className="db-signout" onClick={handleSignOut}>
            <IconLogout /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="db-content">
        {section === 'home'       && (
          <HomeSection
            onNewInterview={onNewInterview}
            user={user}
            fullName={profile?.full_name}
            mockInterviews={demoIndex !== null ? DEMO_STATES[demoIndex].interviews : undefined}
          />
        )}
        {section === 'interviews' && <MyInterviews onNewInterview={onNewInterview} onRepeat={onRepeatInterview} initialSelectedId={deepInterviewId} />}
        {section === 'progress'   && <MyProgress onInterviewClick={(id) => { setDeepInterviewId(id); setSection('interviews') }} />}
        {section === 'recursos'   && <BlogListPage onBlogPost={onBlogPost} />}
        {section === 'profile'    && <MyProfile />}
        {section === 'settings'   && <SettingsPage onSignOut={handleSignOut} />}
      </main>

      {isAdmin && (
        <div className="demo-bar">
          <span className="demo-bar-label">🛠 Demo</span>
          {DEMO_STATES.map((s, i) => (
            <button
              key={i}
              className={`demo-bar-btn ${demoIndex === i ? 'demo-bar-btn--active' : ''}`}
              onClick={() => { setDemoIndex(demoIndex === i ? null : i); setSection('home') }}
            >
              {s.label}
            </button>
          ))}
          {demoIndex !== null && (
            <button className="demo-bar-btn demo-bar-btn--reset" onClick={() => setDemoIndex(null)}>
              ✕ Real
            </button>
          )}
        </div>
      )}
    </div>
  )
}
