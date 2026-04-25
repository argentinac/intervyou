import { useState, useEffect } from 'react'

const LANG_OPTIONS = [
  { value: 'Spanish',    label: 'Español' },
  { value: 'English',    label: 'Inglés' },
  { value: 'Portuguese', label: 'Portugués' },
  { value: 'French',     label: 'Francés' },
  { value: 'German',     label: 'Alemán' },
  { value: 'Italian',    label: 'Italiano' },
]

const DIFFICULTIES = [
  { value: 'Basic',        label: 'Básico',     desc: 'Tono amigable, preguntas directas.' },
  { value: 'Intermediate', label: 'Intermedio', desc: 'Profesional y balanceado.' },
  { value: 'Advanced',     label: 'Avanzado',   desc: 'Exigente, te va a presionar.' },
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
  <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="10" fill="#4f46e5"/>
    <circle cx="13.5" cy="11" r="3.5" fill="white"/>
    <rect x="10" y="16" width="7" height="11" rx="3.5" fill="white"/>
    <rect x="21" y="11" width="2.5" height="15" rx="1.25" fill="rgba(255,255,255,0.55)"/>
    <rect x="25" y="8"  width="2.5" height="18" rx="1.25" fill="rgba(255,255,255,0.35)"/>
  </svg>
)

const IconSparkle = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.8 5.4 5.7.5-4.3 3.8 1.3 5.5L12 14.4l-4.5 2.8 1.3-5.5L4.5 7.9l5.7-.5z"/>
  </svg>
)

// ── Radio card ─────────────────────────────────────────────

const RadioCard = ({ active, label, desc, onClick, wide }) => (
  <button
    type="button"
    className={`rc ${active ? 'rc--active' : ''} ${wide ? 'rc--wide' : ''}`}
    onClick={onClick}
  >
    <div className="rc-dot-wrap">
      <span className={`rc-dot ${active ? 'rc-dot--active' : ''}`} />
    </div>
    <div className="rc-body">
      <span className="rc-label">{label}</span>
      <span className="rc-desc">{desc}</span>
    </div>
  </button>
)

// ── Main ───────────────────────────────────────────────────

export default function SetupForm({ onSubmit }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    country: '',
    language: 'Spanish',
    interviewType: 'HR',
    difficulty: 'Intermediate',
    jobTitle: '',
    jobDescription: '',
    companyName: '',
  })
  const [micError, setMicError] = useState(null)
  const [requesting, setRequesting] = useState(false)
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
          system: `You are a helpful assistant. Respond only with the job description text in ${form.language}, no preamble, no titles, no markdown.`,
          messages: [{
            role: 'user',
            content: `Write a concise job description (3-5 sentences, plain text) in ${form.language} for the role of "${form.jobTitle}"${form.companyName ? ` at ${form.companyName}` : ''}. Cover main responsibilities and key requirements. Be specific and realistic.`,
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMicError(null)
    setRequesting(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((t) => t.stop())
    } catch {
      setMicError('Necesitamos acceso al micrófono. Habilitalo en tu navegador y volvé a intentar.')
      setRequesting(false)
      return
    }
    setRequesting(false)
    onSubmit(form)
  }

  return (
    <div className="sf-page">
      {/* Header */}
      <header className="sf-header">
        <div className="sf-logo">
          <IntervyouIcon />
          <span className="sf-logo-name">intervyou</span>
        </div>
        <div className="sf-progress">
          <div className="sf-progress-bar" style={{ width: step === 1 ? '50%' : '100%' }} />
        </div>
        <span className="sf-step-label">{step} / 2</span>
      </header>

      {/* Content */}
      <main className="sf-main">
        <div className="sf-card">

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

              <div className="sf-fields">
                <div className="sf-field">
                  <label>Tipo</label>
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
                        onClick={() => setForm((f) => ({ ...f, difficulty: d.value }))}
                        wide
                      />
                    ))}
                  </div>
                </div>

                {micError && <p className="sf-error">{micError}</p>}
              </div>

              <div className="sf-footer">
                <button type="button" className="sf-back" onClick={() => setStep(1)}>
                  ← Volver
                </button>
                <button type="submit" className="sf-next" disabled={requesting}>
                  {requesting ? 'Un segundo…' : 'Empezar entrevista →'}
                </button>
              </div>
            </form>
          )}

        </div>
      </main>
    </div>
  )
}
