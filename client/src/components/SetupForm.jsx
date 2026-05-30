import { useState, useEffect } from 'react'
import { unlockAudio } from '../audioContext'
import { supabase } from '../lib/supabase'

const LANG_OPTIONS = [
  { value: 'Spanish',    label: 'Español' },
  { value: 'English',    label: 'Inglés' },
  { value: 'Portuguese', label: 'Portugués' },
  { value: 'French',     label: 'Francés' },
  { value: 'German',     label: 'Alemán' },
  { value: 'Italian',    label: 'Italiano' },
]

const DIFFICULTIES = [
  { value: 'Basic',        label: 'Básico',     desc: 'Tono amigable, preguntas directas.',  bars: 1 },
  { value: 'Intermediate', label: 'Intermedio', desc: 'Profesional y balanceado.',            bars: 2 },
  { value: 'Advanced',     label: 'Avanzado',   desc: 'Exigente, te va a presionar.',         bars: 3 },
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
  { value: 'Mixed',     label: 'Integral', desc: 'Combina RRHH y técnica, como en una entrevista real.' },
  { value: 'HR',        label: 'RRHH',     desc: 'Cultura, motivación y habilidades blandas.' },
  { value: 'Technical', label: 'Técnica',  desc: 'Conocimiento técnico y resolución de problemas.' },
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
const TOTAL_STEPS = 5

const IntervyouIcon = () => (
  <img src="/logo.png" alt="intervyou" style={{ height: 32, width: 'auto' }} />
)

const IconSparkle = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.8 5.4 5.7.5-4.3 3.8 1.3 5.5L12 14.4l-4.5 2.8 1.3-5.5L4.5 7.9l5.7-.5z"/>
  </svg>
)

const DiffIcon = ({ bars }) => (
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <rect x="0.5"  y="9.5"  width="4" height="6"  rx="1" stroke="currentColor" strokeWidth="1.5" fill={bars >= 1 ? 'currentColor' : 'none'} fillOpacity={bars >= 1 ? 0.85 : 0} />
    <rect x="7.5"  y="5.5"  width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill={bars >= 2 ? 'currentColor' : 'none'} fillOpacity={bars >= 2 ? 0.85 : 0} />
    <rect x="14.5" y="0.5"  width="4" height="15" rx="1" stroke="currentColor" strokeWidth="1.5" fill={bars >= 3 ? 'currentColor' : 'none'} fillOpacity={bars >= 3 ? 0.85 : 0} />
  </svg>
)

function Chip({ active, label, desc, onClick, icon, wide }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        gap: 4, padding: wide ? '14px 16px' : '12px 16px',
        borderRadius: 12, border: '2px solid',
        borderColor: active ? '#7C3AED' : '#E5E7EB',
        background: active ? '#F5F3FF' : '#fff',
        cursor: 'pointer', fontFamily: 'inherit',
        flex: wide ? '1 1 0' : undefined,
        minWidth: wide ? 0 : undefined,
        transition: 'border-color 0.15s, background 0.15s',
        textAlign: 'left',
      }}
    >
      {icon && <span style={{ color: active ? '#7C3AED' : '#6B7280' }}>{icon}</span>}
      <span style={{ fontSize: 14, fontWeight: 600, color: active ? '#7C3AED' : '#111827' }}>{label}</span>
      {desc && <span style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.4 }}>{desc}</span>}
    </button>
  )
}

export default function SetupForm({ onSubmit, onBack, initialConfig, hideHeader }) {
  const { user } = useAuth()
  const isAdmin = import.meta.env.DEV || user?.email === 'matiasabas@gmail.com'
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    country: initialConfig?.country ?? '',
    language: initialConfig?.language ?? 'Spanish',
    interviewType: initialConfig?.interviewType ?? 'Mixed',
    difficulty: initialConfig?.difficulty ?? 'Intermediate',
    jobTitle: initialConfig?.jobTitle ?? '',
    jobDescription: initialConfig?.jobDescription ?? '',
    companyName: initialConfig?.companyName ?? '',
  })
  const [generatingDesc, setGeneratingDesc] = useState(false)
  const [dailyLimitReached, setDailyLimitReached] = useState(false)
  const [checkingLimit, setCheckingLimit] = useState(false)
  const [micBlocked, setMicBlocked] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const sttSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition)

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
      // fail silently
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

  const canAdvance = () => {
    if (step === 1) return !!form.country
    if (step === 2) return !!form.language
    if (step === 3) return !!form.jobTitle.trim()
    if (step === 4) return !!form.jobDescription.trim()
    if (step === 5) return !!form.interviewType && !!form.difficulty
    return false
  }

  const handleNext = () => {
    if (step === 3 && !form.jobTitle.trim()) {
      setFieldErrors({ jobTitle: 'Ingresá el nombre del puesto.' })
      return
    }
    if (step === 4 && !form.jobDescription.trim()) {
      setFieldErrors({ jobDescription: 'Agregá una descripción del puesto.' })
      return
    }
    setFieldErrors({})
    if (step < TOTAL_STEPS) { setStep(s => s + 1); return }
    handleSubmit()
  }

  const handleSubmit = async () => {
    setCheckingLimit(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (token) {
        const res = await fetch('/api/interviews/daily-count', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const { count } = await res.json()
          if (count >= 10) {
            setDailyLimitReached(true)
            setCheckingLimit(false)
            return
          }
        }
      }
    } catch { /* si falla el check, dejamos pasar */ }
    setCheckingLimit(false)
    unlockAudio()
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setMicBlocked(false)
    } catch {
      setMicBlocked(true)
      return
    }
    onSubmit(form)
  }

  if (dailyLimitReached) {
    return (
      <div className="sf-page">
        <header className="sf-header">
          <div className="sf-logo" style={{ cursor: onBack ? 'pointer' : 'default' }} onClick={onBack}>
            <IntervyouIcon />
          </div>
        </header>
        <main className="sf-main">
          <div className="sf-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Límite diario alcanzado</h2>
            <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
              Hiciste 10 sesiones hoy. ¡Excelente trabajo!<br />Volvé mañana para seguir practicando.
            </p>
            {onBack && (
              <button className="sf-next" onClick={onBack} style={{ display: 'inline-block' }}>← Volver al inicio</button>
            )}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="sf-page">
      {!sttSupported && (
        <div className="err-banner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Este navegador no soporta reconocimiento de voz. Usá <strong>Chrome</strong> o <strong>Edge</strong>.
        </div>
      )}

      <header className="sf-header">
        {!hideHeader && (
          <div className="sf-logo" style={{ cursor: onBack ? 'pointer' : 'default' }} onClick={onBack}>
            <IntervyouIcon />
          </div>
        )}
        <div className="sf-progress">
          <div className="sf-progress-bar" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>
        <span className="sf-step-label">{step} / {TOTAL_STEPS}</span>
      </header>

      <main className="sf-main">
        <div className="sf-card">

          {/* ── Step 1: País ── */}
          {step === 1 && (
            <>
              <div className="sf-heading">
                <h1>¿En qué país es<br/>la entrevista?</h1>
              </div>
              <div className="sf-fields">
                <div className="sf-field">
                  <label>País</label>
                  <select
                    value={form.country}
                    onChange={(e) => { setForm(f => ({ ...f, country: e.target.value })); setFieldErrors({}) }}
                    autoFocus
                  >
                    <option value="">Seleccioná un país…</option>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  {fieldErrors.country && <span className="err-field">{fieldErrors.country}</span>}
                </div>
              </div>
              <div className="sf-footer">
                {onBack ? (
                  <button type="button" className="sf-back" onClick={onBack}>← Volver</button>
                ) : <div />}
                <button
                  type="button"
                  className="sf-next"
                  disabled={!form.country}
                  onClick={handleNext}
                  data-track="setup_step1_continued"
                >
                  Continuar →
                </button>
              </div>
            </>
          )}

          {/* ── Step 2: Idioma ── */}
          {step === 2 && (
            <>
              <div className="sf-heading">
                <h1>¿En qué idioma<br/>será la entrevista?</h1>
              </div>
              <div className="sf-fields">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {LANG_OPTIONS.map((l) => (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, language: l.value }))}
                      style={{
                        padding: '10px 20px', borderRadius: 999, fontSize: 14, fontWeight: 500,
                        border: '2px solid', cursor: 'pointer', fontFamily: 'inherit',
                        borderColor: form.language === l.value ? '#7C3AED' : '#E5E7EB',
                        background: form.language === l.value ? '#F5F3FF' : '#fff',
                        color: form.language === l.value ? '#7C3AED' : '#374151',
                        transition: 'border-color 0.15s, background 0.15s',
                      }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sf-footer">
                <button type="button" className="sf-back" onClick={() => setStep(1)}>← Volver</button>
                <button
                  type="button"
                  className="sf-next"
                  disabled={!form.language}
                  onClick={handleNext}
                >
                  Continuar →
                </button>
              </div>
            </>
          )}

          {/* ── Step 3: Empresa + Rol ── */}
          {step === 3 && (
            <>
              <div className="sf-heading">
                <h1>¿Para qué empresa<br/>y puesto practicás?</h1>
              </div>
              <div className="sf-fields">
                <div className="sf-field">
                  <label>Empresa <span className="sf-opt">opcional</span></label>
                  <input
                    value={form.companyName}
                    onChange={(e) => setForm(f => ({ ...f, companyName: e.target.value }))}
                    placeholder="Ej: Mercado Libre"
                    autoFocus
                  />
                </div>
                <div className="sf-field">
                  <label>Rol / Puesto</label>
                  <input
                    value={form.jobTitle}
                    onChange={(e) => { setForm(f => ({ ...f, jobTitle: e.target.value })); setFieldErrors({}) }}
                    placeholder="Ej: Product Manager"
                  />
                  {fieldErrors.jobTitle && <span className="err-field">{fieldErrors.jobTitle}</span>}
                </div>
              </div>
              <div className="sf-footer">
                <button type="button" className="sf-back" onClick={() => setStep(2)}>← Volver</button>
                <button
                  type="button"
                  className="sf-next"
                  disabled={!form.jobTitle.trim()}
                  onClick={handleNext}
                  data-track="setup_step3_continued"
                >
                  Continuar →
                </button>
              </div>
            </>
          )}

          {/* ── Step 4: Descripción del puesto ── */}
          {step === 4 && (
            <>
              <div className="sf-heading">
                <h1>Descripción<br/>del puesto</h1>
              </div>
              <div className="sf-fields">
                <div className="sf-field">
                  <div className="sf-label-row">
                    <label>Descripción</label>
                    <button
                      type="button"
                      className="sf-ai-gen"
                      onClick={generateDescription}
                      disabled={!form.jobTitle || generatingDesc}
                      data-track="setup_description_generated"
                    >
                      {generatingDesc
                        ? <><span className="sf-ai-spinner" /> Generando…</>
                        : <><IconSparkle /> Generar</>
                      }
                    </button>
                  </div>
                  <div className="sf-textarea-wrap">
                    <textarea
                      value={form.jobDescription}
                      onChange={(e) => {
                        const val = e.target.value.slice(0, MAX_CHARS)
                        setForm((f) => ({ ...f, jobDescription: val }))
                        setFieldErrors(fe => ({ ...fe, jobDescription: '' }))
                      }}
                      placeholder="Pegá la descripción o resumí las responsabilidades principales…"
                      rows={5}
                      autoFocus
                    />
                    <span className="sf-counter">{form.jobDescription.length}/{MAX_CHARS}</span>
                  </div>
                  {fieldErrors.jobDescription && <span className="err-field">{fieldErrors.jobDescription}</span>}
                </div>
              </div>
              <div className="sf-footer">
                <button type="button" className="sf-back" onClick={() => setStep(3)}>← Volver</button>
                <button
                  type="button"
                  className="sf-next"
                  disabled={!form.jobDescription.trim()}
                  onClick={handleNext}
                  data-track="setup_step4_continued"
                >
                  Continuar →
                </button>
              </div>
            </>
          )}

          {/* ── Step 5: Tipo + Dificultad ── */}
          {step === 5 && (
            <>
              <div className="sf-heading">
                <h1>¿Cómo querés<br/>la sesión?</h1>
              </div>
              <div className="sf-fields sf-fields--step2">
                <div className="sf-field">
                  <label>Tipo de entrevista</label>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {INTERVIEW_TYPES.map((t) => (
                      <Chip
                        key={t.value}
                        active={form.interviewType === t.value}
                        label={t.label}
                        desc={t.desc}
                        wide
                        onClick={() => setForm(f => ({ ...f, interviewType: t.value }))}
                      />
                    ))}
                  </div>
                </div>
                <div className="sf-field">
                  <label>Dificultad</label>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {DIFFICULTIES.map((d) => (
                      <Chip
                        key={d.value}
                        active={form.difficulty === d.value}
                        label={d.label}
                        desc={d.desc}
                        icon={<DiffIcon bars={d.bars} />}
                        wide
                        onClick={() => setForm(f => ({ ...f, difficulty: d.value }))}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {micBlocked && (
                <div className="err-mic-block">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
                  <div>
                    <strong>Tu micrófono no está disponible.</strong> Revisá los permisos del navegador.
                    <p className="err-mic-hint">En Chrome: hacé clic en el candado 🔒 de la barra de direcciones → Micrófono → Permitir, y luego recargá la página.</p>
                  </div>
                </div>
              )}

              <div className="sf-footer">
                <button type="button" className="sf-back" onClick={() => setStep(4)}>← Volver</button>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button
                    type="button"
                    className="sf-autofill"
                    onClick={() => { setForm(TEST_DATA) }}
                    data-track="setup_autofill_used"
                    style={{ fontSize: 12 }}
                  >
                    <IconSparkle /> Ejemplo
                  </button>
                  <button
                    type="button"
                    className="sf-next"
                    onClick={handleNext}
                    data-track="interview_started"
                    disabled={checkingLimit || micBlocked || !sttSupported}
                  >
                    {checkingLimit ? 'Verificando...' : 'Empezar →'}
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  )
}
