import { useState, useEffect } from 'react'
import { unlockAudio } from '../audioContext'

const LANG_OPTIONS = [
  { value: 'Spanish',    label: 'Español' },
  { value: 'English',    label: 'Inglés' },
  { value: 'Portuguese', label: 'Portugués' },
  { value: 'French',     label: 'Francés' },
  { value: 'German',     label: 'Alemán' },
  { value: 'Italian',    label: 'Italiano' },
]

const DiffIcon = ({ bars }) => (
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:'block' }}>
    <rect x="0.5"  y="9.5"  width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill={bars >= 1 ? 'currentColor' : 'none'} fillOpacity={bars >= 1 ? 0.85 : 0}/>
    <rect x="7.5"  y="5.5"  width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill={bars >= 2 ? 'currentColor' : 'none'} fillOpacity={bars >= 2 ? 0.85 : 0}/>
    <rect x="14.5" y="0.5"  width="4" height="15" rx="1" stroke="currentColor" strokeWidth="1.5" fill={bars >= 3 ? 'currentColor' : 'none'} fillOpacity={bars >= 3 ? 0.85 : 0}/>
  </svg>
)

const DIFFICULTIES = [
  { value: 'Basic',        label: 'Básico',     desc: 'Tono amigable, preguntas directas.',  icon: <DiffIcon bars={1} /> },
  { value: 'Intermediate', label: 'Intermedio', desc: 'Profesional y balanceado.',            icon: <DiffIcon bars={2} /> },
  { value: 'Advanced',     label: 'Avanzado',   desc: 'Exigente, te va a presionar.',         icon: <DiffIcon bars={3} /> },
]

const COUNTRIES = [
  'Argentina','Australia','Austria','Belgium','Bolivia','Brazil','Canada','Chile',
  'China','Colombia','Costa Rica','Czech Republic','Denmark','Dominican Republic',
  'Ecuador','Egypt','El Salvador','Finland','France','Germany','Greece','Guatemala',
  'Honduras','Hungary','India','Indonesia','Ireland','Israel','Italy','Japan',
  'Malaysia','Mexico','Netherlands','New Zealand','Nicaragua','Nigeria','Norway',
  'Panama','Paraguay','Peru','Philippines','Poland','Portugal','Romania','Russia',
  'Saudi Arabia','Singapore','South Africa','South Korea','Spain','Sweden',
  'Switzerland','Thailand','Turkey','Ukraine','United Arab Emirates',
  'United Kingdom','United States','Uruguay','Venezuela','Vietnam',
]

const INTERVIEW_TYPES = [
  { value: 'HR',        label: 'RRHH',    desc: 'Cultura, motivación y habilidades blandas.' },
  { value: 'Technical', label: 'Técnica', desc: 'Conocimiento técnico y resolución de problemas.' },
]

const TEST_DATA = {
  country: 'Argentina',
  language: 'Spanish',
  interviewType: 'HR',
  difficulty: 'Intermediate',
  companyName: 'Tiendanube',
  jobTitle: 'Senior Product Manager',
  jobDescription: `Nuestro equipo de Producto es responsable de desarrollar, crear y lanzar nuevas funcionalidades que impulsan el ecosistema de Tiendanube, en colaboración con los equipos de Diseño e Ingeniería. En el equipo de Catalog tu misión será gestionar el núcleo de nuestra plataforma, asegurando que la estructura de datos y los servicios de catálogo sean escalables, robustos y estén preparados para respaldar el crecimiento de miles de comerciantes en Latinoamérica.

Responsabilidades:
- Liderar la estrategia y el roadmap del producto Catalog
- Actuar como socio técnico del equipo de Ingeniería
- Identificar fricciones y oportunidades, priorizando entregas de mayor valor

Requisitos:
- Sólida experiencia en gestión de productos para plataformas SaaS
- Familiaridad con arquitecturas de microservicios, API y modelado de datos`,
}

const MAX_CHARS = 2000

// ── Logo ───────────────────────────────────────────────────

const IntervyouIcon = () => (
  <img src="/logo.png" alt="intervyou" style={{height:48,width:'auto'}} />
)

const IconSparkle = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.8 5.4 5.7.5-4.3 3.8 1.3 5.5L12 14.4l-4.5 2.8 1.3-5.5L4.5 7.9l5.7-.5z"/>
  </svg>
)

// ── Radio card ─────────────────────────────────────────────

const RadioCard = ({ active, label, desc, onClick, wide, icon }) => (
  <button
    type="button"
    className={`rc ${active ? 'rc--active' : ''} ${wide ? 'rc--wide' : ''}`}
    onClick={onClick}
  >
    <div className="rc-dot-wrap">
      <span className={`rc-dot ${active ? 'rc-dot--active' : ''}`} />
    </div>
    <div className="rc-body">
      {icon && <span className="rc-icon">{icon}</span>}
      <span className="rc-label">{label}</span>
      <span className="rc-desc">{desc}</span>
    </div>
  </button>
)

// ── Main ───────────────────────────────────────────────────

const PASSWORD = 'matias'

export default function SetupForm({ onSubmit, onBack, initialConfig }) {
  const [step, setStep] = useState(() => sessionStorage.getItem('sf_auth') === '1' ? 1 : 0)
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState(false)
  const [form, setForm] = useState({
    country: initialConfig?.country ?? '',
    language: initialConfig?.language ?? 'Spanish',
    interviewType: initialConfig?.interviewType ?? 'HR',
    difficulty: initialConfig?.difficulty ?? 'Intermediate',
    jobTitle: initialConfig?.jobTitle ?? '',
    jobDescription: initialConfig?.jobDescription ?? '',
    companyName: initialConfig?.companyName ?? '',
  })
  const [generatingDesc, setGeneratingDesc] = useState(false)

  const generateDescription = async () => {
    if (!form.jobTitle) return
    setGeneratingDesc(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          max_tokens: 512,
          model: 'claude-haiku-4-5-20251001',
          system: `You are a helpful assistant that writes job descriptions. Always generate a job description regardless of the company or job title provided — never ask for clarification or refuse. Respond only with the job description text in ${form.language}, no preamble, no titles, no markdown.`,
          messages: [{
            role: 'user',
            content: `Write a concise job description (3-5 sentences, plain text) in ${form.language} for the role of "${form.jobTitle}"${form.companyName ? ` at ${form.companyName}` : ''}. Cover main responsibilities and key requirements.`,
          }],
        }),
      })
      const { text } = await res.json()
      setForm((f) => ({ ...f, jobDescription: text.trim().slice(0, MAX_CHARS) }))
    } catch {
      // fail silently — user can type manually
    } finally {
      setGeneratingDesc(false)
    }
  }

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        const detected = data.country_name
        if (detected && COUNTRIES.includes(detected)) {
          setForm((f) => f.country ? f : { ...f, country: detected })
        }
      })
      .catch(() => {})
  }, [])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const step1Valid = form.country && form.jobTitle && form.jobDescription.trim()

  const handleSubmit = (e) => {
    e.preventDefault()
    unlockAudio()
    onSubmit(form)
  }

  return (
    <div className="sf-page">
      {/* Header */}
      <header className="sf-header">
        <div className="sf-logo" style={{cursor: onBack ? 'pointer' : 'default'}} onClick={onBack}>
          <IntervyouIcon />
        </div>
        <div className="sf-progress">
          <div className="sf-progress-bar" style={{ width: step === 0 ? '0%' : step === 1 ? '50%' : '100%' }} />
        </div>
        {step > 0 && <span className="sf-step-label">{step} / 2</span>}
      </header>

      {/* Content */}
      <main className="sf-main">
        <div className="sf-card">

          {/* ── Step 0: Password ── */}
          {step === 0 && (
            <form onSubmit={(e) => {
              e.preventDefault()
              if (pwInput === PASSWORD) {
                sessionStorage.setItem('sf_auth', '1')
                setStep(1)
              } else {
                setPwError(true)
                setPwInput('')
              }
            }}>
              <div className="sf-heading">
                <h1>Acceso</h1>
              </div>
              <div className="sf-fields">
                <div className="sf-field">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    value={pwInput}
                    onChange={(e) => { setPwInput(e.target.value); setPwError(false) }}
                    placeholder="Ingresá la contraseña"
                    autoFocus
                  />
                  {pwError && <span style={{ color: '#ef4444', fontSize: 13 }}>Contraseña incorrecta</span>}
                </div>
              </div>
              <div className="sf-footer">
                <span />
                <button type="submit" className="sf-next" disabled={!pwInput}>
                  Continuar →
                </button>
              </div>
            </form>
          )}

          {/* ── Step 1 ── */}
          {step === 1 && (
            <>
              <div className="sf-heading">
                <h1>¿Para qué puesto<br/>querés practicar?</h1>
              </div>

              <div className="sf-fields">
                <div className="sf-row">
                  <div className="sf-field">
                    <label>País</label>
                    <select value={form.country} onChange={set('country')}>
                      <option value="">Seleccioná…</option>
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="sf-field">
                    <label>Idioma</label>
                    <select value={form.language} onChange={set('language')}>
                      {LANG_OPTIONS.map((l) => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sf-row">
                  <div className="sf-field">
                    <label>Empresa <span className="sf-opt">opcional</span></label>
                    <input value={form.companyName} onChange={set('companyName')} placeholder="Ej: Mercado Libre" />
                  </div>
                  <div className="sf-field">
                    <label>Rol / Puesto</label>
                    <input value={form.jobTitle} onChange={set('jobTitle')} placeholder="Ej: Product Manager" />
                  </div>
                </div>

                <div className="sf-field">
                  <div className="sf-label-row">
                    <label>Descripción del puesto</label>
                    <button
                      type="button"
                      className="sf-ai-gen"
                      onClick={generateDescription}
                      disabled={!form.jobTitle || generatingDesc}
                    >
                      {generatingDesc
                        ? <><span className="sf-ai-spinner" /> Generando…</>
                        : <><IconSparkle /> Generar con IA</>
                      }
                    </button>
                  </div>
                  <div className="sf-textarea-wrap">
                    <textarea
                      value={form.jobDescription}
                      onChange={(e) => {
                        const val = e.target.value.slice(0, MAX_CHARS)
                        setForm((f) => ({ ...f, jobDescription: val }))
                      }}
                      placeholder="Pegá la descripción o resumí las responsabilidades principales…"
                      rows={5}
                    />
                    <span className="sf-counter">{form.jobDescription.length}/{MAX_CHARS}</span>
                  </div>
                </div>
              </div>

              <div className="sf-footer">
                <button
                  type="button"
                  className="sf-autofill"
                  onClick={() => { setForm(TEST_DATA); setStep(1) }}
                >
                  <IconSparkle /> Autocompletar con ejemplo
                </button>
                <button
                  type="button"
                  className="sf-next"
                  onClick={() => setStep(2)}
                  disabled={!step1Valid}
                >
                  Continuar →
                </button>
              </div>
            </>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="sf-heading">
                <h1>¿Cómo querés que<br/>sea la entrevista?</h1>
              </div>

              <div className="sf-fields sf-fields--step2">
                <div className="sf-field">
                  <label>Tipo de entrevista</label>
                  <div className="sf-cards-row">
                    {INTERVIEW_TYPES.map((t) => (
                      <RadioCard
                        key={t.value}
                        active={form.interviewType === t.value}
                        label={t.label}
                        desc={t.desc}
                        onClick={() => setForm((f) => ({ ...f, interviewType: t.value }))}
                      />
                    ))}
                  </div>
                </div>

                <div className="sf-field">
                  <label>Dificultad</label>
                  <div className="sf-cards-row">
                    {DIFFICULTIES.map((d) => (
                      <RadioCard
                        key={d.value}
                        active={form.difficulty === d.value}
                        label={d.label}
                        desc={d.desc}
                        icon={d.icon}
                        onClick={() => setForm((f) => ({ ...f, difficulty: d.value }))}
                        wide
                      />
                    ))}
                  </div>
                </div>

              </div>

              <div className="sf-footer">
                <button type="button" className="sf-back" onClick={() => setStep(1)}>
                  ← Volver
                </button>
                <button type="submit" className="sf-next">
                  Empezar entrevista →
                </button>
              </div>
            </form>
          )}

        </div>
      </main>
    </div>
  )
}
