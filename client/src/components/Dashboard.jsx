import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePlan } from '../contexts/PlanContext'
import { track } from '../lib/analytics'
import { supabase } from '../lib/supabase'
import MyInterviews from './MyInterviews'
import FeedbackSummary from './FeedbackSummary'
import SetupForm from './SetupForm'
import MyProfile from './MyProfile'
import SettingsPage from './SettingsPage'
import BlogListPage from './BlogListPage'
import BlogPost from './BlogPost'
import UpgradeModal from './UpgradeModal'
import SimulationsHub from './simulations/SimulationsHub'
import SkillsHub from './SkillsHub'
import { INTERVIEW_TIPS } from '../data/tips'
import { SKILLS_CATALOG } from '../lib/skills/catalog'
import { unlockAudio } from '../audioContext'
import { blogPosts } from '../data/blogPosts'

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
const IconFlask = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6"/><path d="M10 3v5l-5.17 8.33A1 1 0 0 0 5.72 18h12.56a1 1 0 0 0 .89-1.67L14 8V3"/>
    <line x1="9" y1="13" x2="15" y2="13"/>
  </svg>
)

const IconStar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
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
    sub: 'Practicá en inglés.',
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
          <stop offset="0%" stopColor="#5955F6" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#5955F6" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#chartGrad)"/>
      <polyline points={points} fill="none" stroke="#5955F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {scores.map((s, i) => (
        <circle key={i} cx={x(i)} cy={y(s)} r="3.5" fill="#fff" stroke="#5955F6" strokeWidth="2"/>
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
      raw_response: {
        notEnoughData: false,
        score,
        headline: 'Buen desempeño general con áreas de mejora identificadas.',
        executiveSummary: 'Mostraste **buenas habilidades de comunicación** y ejemplos concretos. Podés mejorar la **profundidad técnica** y el manejo del tiempo en tus respuestas.',
        axes: { clarity: 78, structure: 72, roleRelevance: 68, narrativeCoherence: 75, reflectionDepth: 65, concreteEvidence: 70 },
        wentWell: [
          { title: 'Comunicación clara', description: 'Tus respuestas fueron **fáciles de seguir** y bien organizadas.', axis: 'claridad' },
          { title: 'Ejemplos concretos', description: 'Usaste **situaciones reales** para ilustrar tu experiencia.', axis: 'evidencia' },
        ],
        toImprove: [
          { title: 'Profundidad técnica', description: 'Podés desarrollar más los **detalles técnicos** de tus respuestas.', verbatim: null, verbatimQuestion: null, axis: 'profundidad' },
          { title: 'Manejo del tiempo', description: 'Algunas respuestas fueron muy largas; intentá ser más **conciso**.', verbatim: null, verbatimQuestion: null, axis: 'estructura' },
        ],
        actionPlan: [
          { title: 'Practicá el método STAR', description: 'Usá **Situación → Tarea → Acción → Resultado** en cada respuesta conductual.', priority: 'alta' },
          { title: 'Investigá la empresa', description: 'Leé sobre los **valores y productos** de la empresa antes de la entrevista.', priority: 'alta' },
          { title: 'Cronometrá tus respuestas', description: 'Apuntá a **2-3 minutos** por respuesta para mantener el interés de quien te evalúa.', priority: 'media' },
          { title: 'Preparate 3 logros clave', description: 'Tené listos **ejemplos cuantificados** que demuestren impacto real.', priority: 'media' },
        ],
        nextStep: 'Preparate **3 logros concretos con métricas** antes de tu próxima entrevista.',
        qa_review: [
          {
            question: '¿Podés contarme sobre vos y tu experiencia?',
            userAnswer: 'Soy licenciada en Comunicación y hace más de cuatro años que trabajo en marketing digital. [[Me especialicé en la gestión de campañas paid y en redes sociales.]] [[Me considero una persona proactiva, organizada y me gusta aprender constantemente.]]',
            suggestedAnswer: 'Soy licenciada en Comunicación con más de cuatro años de experiencia en marketing digital. ((Lideré campañas de performance que aumentaron la tasa de conversión en un 35% y la comunidad en un 50%, gestionando presupuestos y equipos multidisciplinarios.)) ((Me defino como una profesional orientada a resultados, con iniciativa para proponer mejoras y capacidad para adaptarme a entornos cambiantes.)) Estoy en búsqueda activa de nuevos desafíos donde pueda seguir generando impacto.',
          },
          {
            question: '¿Por qué te interesa este rol?',
            userAnswer: '[[Me interesa porque es una empresa innovadora y en crecimiento.]] [[Creo que es un gran lugar para seguir desarrollándome]] y aportar mi experiencia en marketing digital.',
            suggestedAnswer: '((Me atrae específicamente el foco de la empresa en la expansión de mercado y su cultura data-driven, que es exactamente el entorno donde mejor me desarrollo.)) Identifico una oportunidad concreta para aplicar mi experiencia en campañas de performance y analítica para impulsar resultados medibles. ((Además, la combinación de escala y velocidad de crecimiento me parece un desafío profesional muy valioso en esta etapa de mi carrera.))',
          },
          {
            question: '¿Cuál fue una situación difícil en el trabajo y cómo la resolviste?',
            userAnswer: 'Hubo un desacuerdo con un compañero sobre la prioridad de tareas. Hablamos, escuchamos cada uno el punto del otro y acordamos un plan. Al final se resolvió y cumplimos con los objetivos.',
            suggestedAnswer: 'En un proyecto, hubo un desacuerdo con un compañero sobre la priorización de tareas. Organicé una reunión para alinear objetivos, entendí la perspectiva de cada uno y propuse una solución basada en impacto y recursos disponibles. Acordamos un plan conjunto y logramos entregar los resultados a tiempo mientras mejoramos la dinámica de colaboración del equipo.',
          },
        ],
      },
    }] : [],
  }
}

const DEMO_STATES = [
  { label: '0 sesiones', interviews: [] },
  { label: '1 sesión', interviews: [makeMockInterview(0, 680, 3)] },
  {
    label: '5 sesiones',
    interviews: [
      makeMockInterview(0, 520, 30),
      makeMockInterview(1, 610, 22),
      makeMockInterview(2, 680, 15),
      makeMockInterview(3, 740, 8),
      makeMockInterview(4, 810, 2),
    ],
  },
  {
    label: '50 sesiones',
    interviews: Array.from({ length: 50 }, (_, i) => {
      const score = Math.min(1000, 450 + (i / 50) * 450 + (Math.random() - 0.5) * 150)
      return makeMockInterview(i, Math.round(score), 180 - i * 3)
    }),
  },
]

const RECURSO_PREVIEW_COUNT = 3

function shuffled(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const RANDOM_RECURSOS = shuffled(blogPosts).slice(0, RECURSO_PREVIEW_COUNT)

function HomeSkeleton() {
  return (
    <div className="db-home">
      <div className="home-sk-welcome">
        <span className="sk" style={{ width: 220, height: 34 }} />
        <span className="sk" style={{ width: 280, height: 20 }} />
      </div>
      <span className="sk home-sk-hero" />
      <div className="home-sk-grid">
        <span className="sk home-sk-card" />
        <span className="sk home-sk-card" />
        <span className="sk home-sk-card" />
      </div>
      <div className="home-sk-recursos">
        <span className="sk home-sk-recurso" />
        <span className="sk home-sk-recurso" />
        <span className="sk home-sk-recurso" />
      </div>
    </div>
  )
}


function getNextAction(interviews, scoredInterviews) {
  if (!interviews || interviews.length === 0) {
    return { msg: 'Completá tu primera sesión para comenzar', cta: 'Empezar ahora', target: 'interview' }
  }
  const last = interviews[interviews.length - 1]
  const daysSinceLast = last?.completed_at
    ? Math.floor((Date.now() - new Date(last.completed_at).getTime()) / 86400000)
    : 999
  if (daysSinceLast >= 7) {
    return { msg: `Llevas ${daysSinceLast} días sin practicar. ¡Retomá tu entrenamiento!`, cta: 'Practicar ahora', target: 'interview' }
  }
  if (interviews.length <= 2) {
    return { msg: 'Seguí practicando para mejorar tu puntaje', cta: 'Nueva práctica', target: 'interview' }
  }
  return { msg: 'Completá una simulación esta semana para mejorar tu puntaje', cta: 'Ir a simulaciones', target: 'simulations' }
}

function getRecomendado(interviews) {
  if (!interviews || interviews.length === 0) {
    return {
      eyebrow: 'Empezá aquí',
      title: 'Tu primera sesión',
      desc: 'Practicá y recibí feedback personalizado en minutos.',
      cta: 'Comenzar →',
      target: 'interview',
    }
  }
  const last = interviews[interviews.length - 1]
  const cfg = last?.config || {}
  const label = cfg.jobTitle
    ? `${cfg.interviewType === 'Technical' ? 'Sesión técnica' : 'Entrevista'} de ${cfg.jobTitle}`
    : 'Sesión de práctica'
  return {
    eyebrow: 'Simulación recomendada',
    title: label,
    desc: 'Practicá preguntas clave y recibí feedback personalizado.',
    cta: 'Retomar práctica →',
    target: 'interview',
  }
}

function WeeklyScoreChart({ interviews }) {
  const scored = interviews.filter(iv => iv.interview_feedback?.[0]?.score != null).slice(-7)
  if (scored.length < 2) return null
  const scores = scored.map(iv => iv.interview_feedback[0].score)
  const labels = scored.map(iv => {
    const d = new Date(iv.completed_at || iv.created_at)
    if (isNaN(d)) return ''
    return `${d.getDate()}/${d.getMonth() + 1}`
  })
  const W = 280, H = 90, padX = 4, padY = 10
  const min = Math.max(0, Math.min(...scores) - 50)
  const max = Math.min(1000, Math.max(...scores) + 50)
  const x = (i) => padX + (i / (scores.length - 1)) * (W - padX * 2)
  const y = (s) => padY + (1 - (s - min) / (max - min)) * (H - padY * 2 - 16)
  const points = scores.map((s, i) => `${x(i)},${y(s)}`).join(' ')
  const area = `M${x(0)},${y(scores[0])} ` + scores.map((s, i) => `L${x(i)},${y(s)}`).join(' ') + ` L${x(scores.length - 1)},${H - 16} L${x(0)},${H - 16} Z`
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="wcGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5955F6" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#5955F6" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#wcGrad)"/>
      <polyline points={points} fill="none" stroke="#5955F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {scores.map((s, i) => (
        <circle key={i} cx={x(i)} cy={y(s)} r="3.5" fill="#fff" stroke="#5955F6" strokeWidth="2"/>
      ))}
      {labels.map((label, i) => (
        <text key={i} x={x(i)} y={H} textAnchor="middle" fontSize="10" fill="#94a3b8">
          {label}
        </text>
      ))}
    </svg>
  )
}

function HomeSection({ onNewInterview, user, fullName, mockInterviews, onGoToRecursos, onGoToSkills, onBlogPost, onStartSkill, onGoToProgress, onGoToSimulaciones, onStartSimulation }) {
  const firstName = fullName === undefined
    ? ''
    : (fullName ? fullName.split(' ')[0] : (user?.email?.split('@')[0] ?? 'ahí'))

  const [realInterviews, setRealInterviews] = useState(null)
  const [skillProgress, setSkillProgress] = useState({})
  const { getToken } = useAuth()

  useEffect(() => {
    if (!user?.id) return
    supabase
      .from('skill_progress')
      .select('skill_id, technique_idx')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (!data) return
        const map = {}
        data.forEach(({ skill_id, technique_idx }) => {
          if (!map[skill_id]) map[skill_id] = new Set()
          map[skill_id].add(technique_idx)
        })
        const counts = {}
        Object.entries(map).forEach(([id, set]) => { counts[id] = set.size })
        setSkillProgress(counts)
      })
  }, [user?.id])

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

  if (interviews === null) return <HomeSkeleton />

  const scoredInterviews = interviews?.filter(iv => iv.interview_feedback?.[0]?.score != null) ?? []
  const lastScore = scoredInterviews.length > 0 ? scoredInterviews[scoredInterviews.length - 1].interview_feedback[0].score : null
  const avgScore = scoredInterviews.length > 0
    ? scoredInterviews.reduce((s, iv) => s + iv.interview_feedback[0].score, 0) / scoredInterviews.length
    : null

  const recomendado = getRecomendado(interviews)
  const nextAction = getNextAction(interviews, scoredInterviews)

  return (
    <div className="db-home">
      {/* Header */}
      <div className="db-welcome">
        <h1>Hola, {fullName === undefined ? <span className="name-skeleton" /> : firstName} 👋</h1>
        <p>Listo para seguir creciendo hoy.</p>
      </div>

      {/* Top grid: Recomendado | Tu progreso | Stats */}
      <div className="home-top-grid">
        {/* Recomendado para vos */}
        <div className="home-recomendado-card">
          <div className="home-recomendado-eyebrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            {recomendado.eyebrow}
          </div>
          <div className="home-recomendado-body">
            <div className="home-recomendado-text">
              <h3 className="home-recomendado-title">{recomendado.title}</h3>
              <p className="home-recomendado-desc">{recomendado.desc}</p>
              <button className="home-recomendado-btn" onClick={onNewInterview} data-track="new_interview_clicked">
                {recomendado.cta}
              </button>
            </div>
            <img src="/3d/01_monitor_recomendado.png" alt="" className="home-recomendado-img" />
          </div>
        </div>

        {/* Tu progreso */}
        <div className="home-progreso-card">
          <div className="home-progreso-header">
            <span className="home-progreso-title">Tu progreso</span>
            <button className="home-progreso-detalle" onClick={onGoToProgress}>Ver detalle →</button>
          </div>
          {scoredInterviews.length > 0 ? (
            <>
              <div className="home-progreso-label">Puntaje promedio</div>
              <div className="home-progreso-score">{Math.round(avgScore)}</div>
              <WeeklyScoreChart interviews={interviews} />
            </>
          ) : (
            <div className="home-stats-empty">
              <p>Completá tu primera sesión para ver tu progreso.</p>
              <button className="db-btn-primary" onClick={onNewInterview} data-track="new_interview_clicked">Comenzar ahora</button>
            </div>
          )}
        </div>

        {/* Tu Situación card */}
        <div className="home-custom-sim-card">
          <div className="home-custom-sim-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
          </div>
          <h3 className="home-custom-sim-title">Creá tu propia situación</h3>
          <p className="home-custom-sim-desc">Practicá cualquier situación, personal o laboral, con un interlocutor adaptado a vos.</p>
          <div className="home-custom-sim-meta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            7 min
          </div>
          <button
            className="home-custom-sim-btn"
            onClick={() => onStartSimulation?.('custom_situation')}
          >
            Crear situación →
          </button>
        </div>
      </div>

      {/* Desarrollá tus habilidades */}
      <div className="home-section-block">
        <div className="home-section-header">
          <h2 className="home-section-h2">Desarrollá tus habilidades</h2>
          <button className="home-ver-todos-btn" onClick={onGoToSkills}>Ver todos →</button>
        </div>
        <div className="home-skills-v2-grid">
          {SKILLS_CATALOG.slice(0, 5).map((skill) => {
            const done = skillProgress[skill.id] || 0
            const pct = Math.round((done / skill.techniques.length) * 100)
            const barColor = pct === 100 ? '#22c55e' : '#5955F6'
            const nivelLabel = done === 0 ? 'Nivel principiante' : done === 1 ? 'Nivel intermedio' : done === 2 ? 'Nivel avanzado' : 'Nivel experto'
            return (
              <button
                key={skill.id}
                className="home-skill-v2-card"
                onClick={() => { unlockAudio(); onStartSkill?.(skill.id) }}
              >
                <div className="home-skill-v2-img-wrap">
                  <img src={skill.img3d} alt={skill.shortTitle} className="home-skill-v2-img" />
                </div>
                <div className="home-skill-v2-name">{skill.shortTitle}</div>
                <div className="home-skill-v2-nivel">{nivelLabel}</div>
                <div className="home-skill-v2-bar-wrap">
                  <div className="home-skill-v2-bar-track">
                    <div className="home-skill-v2-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
                  </div>
                  <span className="home-skill-v2-pct">{pct}%</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Recursos + Consejo del día */}
      <div className="home-recursos-tip-grid">
        {/* Recursos */}
        <div className="home-section-block">
          <div className="home-section-header">
            <h2 className="home-section-h2">Recursos para seguir aprendiendo</h2>
            <button className="home-ver-todos-btn" onClick={onGoToRecursos}>Ver todos →</button>
          </div>
          <div className="home-recursos-grid">
            {RANDOM_RECURSOS.map((post) => (
              <button
                key={post.slug}
                className="home-recurso-tile"
                onClick={() => onBlogPost(post.slug)}
              >
                <div className="home-recurso-img-wrap">
                  <img src={post.image} alt={post.imageAlt} className="home-recurso-img" />
                </div>
                <div className="home-recurso-body">
                  {(post.type || post.readTime) && (
                    <div className="home-recurso-meta">{post.type}{post.readTime ? ` · ${post.readTime} min` : ''}</div>
                  )}
                  <div className="home-recurso-title">{post.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Consejo del día */}
        <div className="home-tip-v2-col">
          <div className="home-tip-v2-card">
            <div className="home-tip-v2-header">
              <span className="home-tip-v2-quote-icon">"</span>
              <span className="home-tip-v2-label">Consejo del día</span>
            </div>
            <div className="home-tip-v2-body">
              <blockquote className="home-tip-v2-text">"{DAILY_TIP}"</blockquote>
              <img src="/3d/07_planta_consejo_del_dia.png" alt="" className="home-tip-v2-img" />
            </div>
          </div>
        </div>
      </div>

      {/* Banner de feedback */}
      <div className="home-feedback-banner">
        <div className="home-feedback-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5955F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div className="home-feedback-text">
          <span>¿Tenés sugerencias para mejorar FeelReady?</span>
          <span className="home-feedback-sub">Tu opinión nos ayuda a crecer.</span>
        </div>
        <a href="https://forms.gle/WQF6jseUj8ME9nJ6A" target="_blank" rel="noopener noreferrer" className="home-feedback-btn">
          Danos feedback →
        </a>
      </div>
    </div>
  )
}

function SimulacionesSection({
  demoIndex, setDemoIndex, setSection,
  setDemoPlan, setPaymentBannerDismissed,
  openUpgradeModal, onPricing, onPaymentSuccess, onPaymentError, onNewInterview, onVisaInterview,
}) {
  const SimCard = ({ title, children }) => (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{children}</div>
    </div>
  )
  const Btn = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: '1.5px solid',
        borderColor: active ? '#6366f1' : '#d1d5db',
        background: active ? '#eef2ff' : '#fff',
        color: active ? '#4f46e5' : '#374151',
      }}
    >{children}</button>
  )

  return (
    <div className="iv-page blp-page">
      <div className="db-page-header">
        <h2>Simulaciones</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
          Tipos de simulación disponibles
        </p>
      </div>

      <div className="blp-grid">
        <article className="blp-card" style={{ cursor: 'pointer' }} onClick={onVisaInterview} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onVisaInterview()}>
          <div className="blp-card-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=220&fit=crop&auto=format"
              alt="Simulación de Visa"
              className="blp-card-img"
            />
          </div>
          <div className="blp-card-body">
            <h3 className="blp-card-title">Simulación de Visa</h3>
            <p className="blp-card-excerpt">Practicá las preguntas más comunes de sesiones consulares para obtener tu visa.</p>
            <span style={{ display: 'inline-block', marginTop: 8, fontSize: 13, fontWeight: 600, color: '#4f46e5' }}>Comenzar simulación →</span>
          </div>
        </article>
      </div>
    </div>
  )
}

export default function Dashboard({ initialSection = 'home', onNewInterview, onStartInterview, onSignOut, onRepeatInterview, onPricing, onPaymentSuccess, onPaymentError, pendingInterviewId, onPendingInterviewIdConsumed, onVisaInterview, onStartSimulation, onStartSkill, pendingFeedback, pendingFeedbackConfig, onPendingFeedbackConsumed }) {
  const { user, signOut } = useAuth()
  const { isPro, planStatus, showUpgradeModal, openUpgradeModal, setDemoPlan, setDemoCountry, country } = usePlan()
  const [section, setSection] = useState(initialSection)
  const [deepInterviewId, setDeepInterviewId] = useState(null)
  const [blogSlug, setBlogSlug] = useState(null)

  useEffect(() => {
    if (pendingInterviewId) {
      setDeepInterviewId(pendingInterviewId)
      setSection('interviews')
      onPendingInterviewIdConsumed?.()
    }
  }, [pendingInterviewId])

  const [localFeedback, setLocalFeedback] = useState(null)
  const [localFeedbackConfig, setLocalFeedbackConfig] = useState(null)
  useEffect(() => {
    if (pendingFeedback) {
      setLocalFeedback(pendingFeedback)
      setLocalFeedbackConfig(pendingFeedbackConfig)
      setSection('feedback')
      onPendingFeedbackConsumed?.()
    }
  }, [pendingFeedback])

  const [profile, setProfile] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [demoIndex, setDemoIndex] = useState(null)
  const [demoOpen, setDemoOpen] = useState(false)
  const [paymentBannerDismissed, setPaymentBannerDismissed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isAdmin = import.meta.env.DEV || user?.email === 'matiasabas@gmail.com'
  const showPaymentBanner = isPro && planStatus === 'past_due' && !paymentBannerDismissed

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

  const navItems = [
    { id: 'home',          label: 'Inicio',               icon: <IconHome /> },
    { id: 'new',           label: 'Nueva sesión',      icon: <IconPlus />, primary: true },
    { id: 'interviews',    label: 'Mis sesiones',       icon: <IconList /> },
    { id: 'recursos',      label: 'Recursos',              icon: <IconBook /> },
    { id: 'profile',       label: 'Mi perfil profesional', icon: <IconUser /> },
    { id: 'simulaciones',  label: 'Simulaciones',          icon: <IconFlask /> },
    { id: 'skills',        label: 'Entrená habilidades',   icon: <IconStar /> },
  ].filter(item => !item.adminOnly || isAdmin)

  const handleNav = (id) => {
    setSidebarOpen(false)
    setBlogSlug(null)
    track(`dashboard_nav_${id}`)
    if (id === 'new') {
      window.history.pushState({}, '', '/nueva-entrevista')
      setSection('new')
      return
    }
    if (section === 'new') window.history.pushState({}, '', '/')
    setSection(id)
  }

  const handleBlogPost = (slug) => {
    setBlogSlug(slug)
    setSection('recursos')
  }

  return (
    <div className="db-layout">
      <div className="db-mobile-topbar">
        <button className="db-hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Menú">
          <span /><span /><span />
        </button>
        <img src="/logo.png" alt="FeelReady" style={{ height: 32, width: 'auto' }} />
      </div>
      {sidebarOpen && <div className="db-overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`db-sidebar${sidebarOpen ? ' db-sidebar--open' : ''}`}>
        <div className="db-sidebar-logo" onClick={() => user?.is_anonymous ? handleSignOut() : setSection('home')} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="FeelReady" style={{ height: 32, width: 'auto' }} />
        </div>

        <nav className="db-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`db-nav-item${section === item.id ? ' db-nav-item--active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              <span className="db-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="db-sidebar-bottom">
          <div className="db-plan-badge">
            {isPro ? (
              <>
                <div className="db-plan-row">
                  <div className="db-plan-crown-wrap">
                    <IconCrown />
                  </div>
                  <span className="db-plan-name">Plan Premium</span>
                  {planStatus === 'past_due' ? null : (
                    <span className="db-plan-status-active">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      Activo
                    </span>
                  )}
                </div>
                <div className="db-plan-divider" />
                {planStatus === 'past_due' ? (
                  <div className="db-plan-feature-row">
                    <div className="db-plan-feature-icon db-plan-feature-icon--error">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                    </div>
                    <div>
                      <div className="db-plan-feature-title db-plan-feature-title--error">Pago fallido</div>
                      <button className="db-plan-pastdue-link" onClick={onPaymentError}>Actualizar método de pago</button>
                    </div>
                  </div>
                ) : (
                  <div className="db-plan-feature-row">
                    <div className="db-plan-feature-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z"/>
                        <path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="db-plan-feature-title">Sesiones ilimitadas</div>
                      <div className="db-plan-feature-sub">Practicá sin límites este mes.</div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="db-plan-row">
                  <div className="db-plan-icon-free">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <span className="db-plan-name db-plan-name--free">Plan Free</span>
                </div>
                <button className="db-plan-upgrade" onClick={openUpgradeModal} data-track="upgrade_modal_opened">Upgrade a Premium →</button>
              </>
            )}
          </div>

          <div className="db-sidebar-divider" />
          <button className="db-sidebar-profile" onClick={() => setSection('settings')}>
            <div className="db-sidebar-profile-avatar">
              {user?.user_metadata?.avatar_url
                ? <img src={user.user_metadata.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} referrerPolicy="no-referrer" />
                : profile === null ? '…' : (profile?.full_name || user?.email || 'U')[0]?.toUpperCase()}
            </div>
            <div className="db-sidebar-profile-info">
              <span className="db-sidebar-profile-name">
                {profile === null ? <span className="name-skeleton name-skeleton--sm" /> : (profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0])}
              </span>
              <span className="db-sidebar-profile-sub">Ver perfil</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', flexShrink: 0, color: '#94a3b8' }}><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </aside>

      <main className="db-content">
        {showPaymentBanner && (
          <div className="db-payment-banner">
            <div className="db-payment-banner-left">
              <div className="db-payment-banner-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <div className="db-payment-banner-title">No pudimos procesar tu pago</div>
                <div className="db-payment-banner-sub">Actualizá tu método de pago para evitar la suspensión de tu plan y seguir accediendo a todas las funcionalidades.</div>
              </div>
            </div>
            <div className="db-payment-banner-actions">
              <button className="db-payment-banner-btn">Actualizar pago</button>
              <button className="db-payment-banner-close" onClick={() => setPaymentBannerDismissed(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {section === 'new'          && (
          <SetupForm
            onSubmit={(cfg) => { window.history.pushState({}, '', '/'); onStartInterview(cfg) }}
            onBack={() => { window.history.pushState({}, '', '/'); setSection('home') }}
            hideHeader
          />
        )}
        {section === 'home'         && (
          <HomeSection
            onNewInterview={() => handleNav('new')}
            user={user}
            fullName={profile === null ? undefined : (profile?.full_name ?? null)}
            mockInterviews={demoIndex !== null ? DEMO_STATES[demoIndex].interviews : undefined}
            onGoToRecursos={() => setSection('recursos')}
            onGoToSkills={() => setSection('skills')}
            onBlogPost={handleBlogPost}
            onStartSkill={onStartSkill}
            onGoToProgress={() => setSection('interviews')}
            onGoToSimulaciones={() => setSection('simulaciones')}
            onStartSimulation={onStartSimulation}
          />
        )}
        {section === 'interviews'  && <MyInterviews onNewInterview={() => handleNav('new')} onRepeat={onRepeatInterview} initialSelectedId={deepInterviewId} onDeepIdConsumed={() => setDeepInterviewId(null)} mockInterviews={demoIndex !== null ? DEMO_STATES[demoIndex].interviews : undefined} />}
        {section === 'feedback' && localFeedback && (
          <FeedbackSummary
            feedback={localFeedback}
            config={localFeedbackConfig}
            onRestart={() => { setLocalFeedback(null); setLocalFeedbackConfig(null); setSection('new') }}
            onDashboard={() => { setLocalFeedback(null); setLocalFeedbackConfig(null); setSection('home') }}
            onBack={() => { setLocalFeedback(null); setLocalFeedbackConfig(null); setSection('interviews') }}
            embedded
            backLabel="← Mis entrevistas"
            saveFailed={localFeedback?.saveFailed}
          />
        )}
        {section === 'recursos'    && (
          blogSlug
            ? <BlogPost slug={blogSlug} onBack={() => setBlogSlug(null)} hideHeader loggedIn />
            : <BlogListPage onBlogPost={handleBlogPost} />
        )}
        {section === 'skills'      && <SkillsHub user={user} onStartSkill={(id) => { onStartSkill?.(id) }} />}
        {section === 'profile'     && <MyProfile />}
        {section === 'settings'    && <SettingsPage onSignOut={handleSignOut} />}
        {section === 'simulaciones' && (
          <SimulationsHub onStartSimulation={onStartSimulation} />
        )}
      </main>

      {showUpgradeModal && <UpgradeModal />}

      {isAdmin && (
        <div className="demo-bar">
          <button className="demo-bar-toggle" onClick={() => setDemoOpen(o => !o)}>
            🛠 Demo {demoIndex !== null ? `· ${DEMO_STATES[demoIndex].label}` : ''} {demoOpen ? '▲' : '▼'}
          </button>
          {demoOpen && (
            <div className="demo-bar-panel">
              <div className="demo-bar-group">
                <span className="demo-bar-label">Entrevistas</span>
                {DEMO_STATES.map((s, i) => (
                  <button
                    key={i}
                    className={`demo-bar-btn ${demoIndex === i ? 'demo-bar-btn--active' : ''}`}
                    onClick={() => setDemoIndex(demoIndex === i ? null : i)}
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
              <div className="demo-bar-divider" />
              <div className="demo-bar-group">
                <span className="demo-bar-label">Plan</span>
                <button className="demo-bar-btn" onClick={() => { setDemoPlan({ plan: 'free', status: 'active' }); setPaymentBannerDismissed(false) }}>Free</button>
                <button className="demo-bar-btn" onClick={() => { setDemoPlan({ plan: 'pro', status: 'active', period: 'monthly' }); setPaymentBannerDismissed(false) }}>Pro Activo</button>
                <button className="demo-bar-btn" onClick={() => { setDemoPlan({ plan: 'pro', status: 'past_due', period: 'monthly' }); setPaymentBannerDismissed(false) }}>Pro Pago fallido</button>
              </div>
              <div className="demo-bar-divider" />
              <div className="demo-bar-group">
                <span className="demo-bar-label">País</span>
                {[
                  { code: 'AR', label: '🇦🇷 AR' },
                  { code: 'BR', label: '🇧🇷 BR' },
                  { code: 'MX', label: '🇲🇽 MX' },
                  { code: 'CO', label: '🇨🇴 CO' },
                  { code: 'CL', label: '🇨🇱 CL' },
                  { code: 'PE', label: '🇵🇪 PE' },
                  { code: 'UY', label: '🇺🇾 UY' },
                  { code: 'ES', label: '🇪🇸 ES' },
                  { code: 'US', label: '🇺🇸 US' },
                  { code: 'GB', label: '🇬🇧 GB' },
                ].map(c => (
                  <button
                    key={c.code}
                    className={`demo-bar-btn ${country === c.code ? 'demo-bar-btn--active' : ''}`}
                    onClick={() => setDemoCountry(c.code)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="demo-bar-divider" />
              <div className="demo-bar-group">
                <span className="demo-bar-label">Vistas</span>
                <button className="demo-bar-btn" onClick={openUpgradeModal}>Modal upgrade</button>
                <button className="demo-bar-btn" onClick={onPricing}>Pricing</button>
                <button className="demo-bar-btn" onClick={onPaymentSuccess}>Pago exitoso</button>
                <button className="demo-bar-btn" onClick={onPaymentError}>Error de pago</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
