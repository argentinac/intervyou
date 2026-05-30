import { useState, useEffect, useRef } from 'react'
import { unlockAudio } from '../audioContext'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

/* ─── CSS idéntico al de CustomSituationSetup ─────────────────────────────── */
const CSS = `
@keyframes cs-fade-up {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes cs-slide-left {
  from { opacity: 0; transform: translateX(32px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes cs-slide-right {
  from { opacity: 0; transform: translateX(-32px); }
  to   { opacity: 1; transform: translateX(0); }
}
.cs-page {
  min-height: 100vh;
  background: #F7F9FD;
  display: flex;
  flex-direction: column;
}
.cs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
  gap: 16px;
}
.cs-logo { cursor: pointer; opacity: 0.9; transition: opacity 0.15s; }
.cs-logo:hover { opacity: 1; }
.cs-progress-wrap {
  flex: 1;
  height: 4px;
  background: #E5E7EB;
  border-radius: 99px;
  overflow: hidden;
}
.cs-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #7C3AED, #A78BFA);
  border-radius: 99px;
  transition: width 0.5s cubic-bezier(.4,0,.2,1);
}
.cs-step-label {
  font-size: 12px;
  color: #9CA3AF;
  font-weight: 500;
  min-width: 32px;
  text-align: right;
}
.cs-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px 48px;
}
.cs-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  padding: 40px 36px;
  width: 100%;
  max-width: 540px;
}
.cs-step { animation: cs-fade-up 0.4s ease both; }
.cs-step--slide-left  { animation: cs-slide-left 0.35s ease both; }
.cs-step--slide-right { animation: cs-slide-right 0.35s ease both; }
.cs-heading {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 6px;
  line-height: 1.3;
}
.cs-subheading {
  font-size: 14px;
  color: #6B7280;
  margin: 0 0 28px;
}
.cs-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cs-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid #E5E7EB;
  background: #FAFAFA;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  font-size: 14px;
  color: #374151;
  transition: border-color 0.15s, background 0.15s, transform 0.1s;
  width: 100%;
}
.cs-option:hover { border-color: #C4B5FD; background: #F5F3FF; transform: translateY(-1px); }
.cs-option--active { border-color: #7C3AED; background: #F5F3FF; color: #5B21B6; }
.cs-option-dot {
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 2px solid #D1D5DB;
  flex-shrink: 0; margin-top: 1px;
  transition: border-color 0.15s, background 0.15s;
  display: flex; align-items: center; justify-content: center;
}
.cs-option--active .cs-option-dot { border-color: #7C3AED; background: #7C3AED; }
.cs-option-dot-inner { width: 6px; height: 6px; border-radius: 50%; background: #fff; }
.cs-option-body { display: flex; flex-direction: column; gap: 2px; }
.cs-option-label { font-size: 14px; font-weight: 600; }
.cs-option-desc  { font-size: 12px; color: #9CA3AF; }
.cs-diff-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.cs-diff-card {
  border: 1.5px solid #E5E7EB;
  border-radius: 14px;
  padding: 16px 12px;
  background: #FAFAFA;
  cursor: pointer;
  text-align: center;
  font-family: inherit;
  transition: border-color 0.15s, background 0.15s, transform 0.12s;
}
.cs-diff-card:hover { border-color: #C4B5FD; background: #F5F3FF; transform: translateY(-2px); }
.cs-diff-card--active { border-color: #7C3AED; background: #F5F3FF; }
.cs-diff-bars { display: flex; align-items: flex-end; justify-content: center; gap: 3px; margin-bottom: 10px; height: 20px; }
.cs-diff-bar { width: 6px; border-radius: 3px; background: #D1D5DB; transition: background 0.15s; }
.cs-diff-card--active .cs-diff-bar { background: #7C3AED; }
.cs-diff-label { font-size: 13px; font-weight: 600; color: #374151; display: block; margin-bottom: 4px; }
.cs-diff-card--active .cs-diff-label { color: #5B21B6; }
.cs-diff-desc { font-size: 11px; color: #9CA3AF; line-height: 1.4; display: block; }
.cs-input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1.5px solid #E5E7EB;
  font-size: 15px;
  font-family: inherit;
  color: #111827;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  background: #FAFAFA;
}
.cs-input:focus { border-color: #7C3AED; background: #fff; }
.cs-input::placeholder { color: #C4C8D0; }
.cs-select {
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1.5px solid #E5E7EB;
  font-size: 15px;
  font-family: inherit;
  color: #111827;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  background: #FAFAFA;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  cursor: pointer;
}
.cs-select:focus { border-color: #7C3AED; background-color: #fff; }
.cs-textarea-wrap { position: relative; }
.cs-textarea {
  width: 100%;
  min-height: 110px;
  padding: 16px;
  border-radius: 14px;
  border: 1.5px solid #E5E7EB;
  font-size: 15px;
  font-family: inherit;
  color: #111827;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  line-height: 1.5;
  background: #FAFAFA;
}
.cs-textarea:focus { border-color: #7C3AED; background: #fff; }
.cs-textarea::placeholder { color: #C4C8D0; }
.cs-char-count { position: absolute; bottom: 10px; right: 14px; font-size: 11px; color: #D1D5DB; }
.cs-ai-row { display: flex; justify-content: flex-end; margin-bottom: 8px; }
.cs-ai-btn {
  display: flex; align-items: center; gap: 5px;
  background: #F5F3FF; color: #7C3AED;
  border: 1px solid #DDD6FE; border-radius: 8px;
  padding: 6px 12px; font-size: 12px; font-weight: 600;
  font-family: inherit; cursor: pointer;
  transition: background 0.15s;
}
.cs-ai-btn:hover:not(:disabled) { background: #EDE9FE; }
.cs-ai-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.cs-ai-spinner {
  width: 10px; height: 10px;
  border: 2px solid #C4B5FD; border-top-color: #7C3AED;
  border-radius: 50%; animation: sf-spin 0.7s linear infinite; display: inline-block;
}
@keyframes sf-spin { to { transform: rotate(360deg) } }
.cs-field-error { font-size: 12px; color: #DC2626; margin-top: 6px; display: block; }
.cs-field-label { font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 8px; display: block; }
.cs-field-opt { font-size: 11px; color: #9CA3AF; font-weight: 400; margin-left: 4px; }
.cs-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;
}
.cs-btn-back {
  background: none; border: none;
  font-family: inherit; font-size: 14px;
  color: #9CA3AF; cursor: pointer;
  padding: 8px 0; transition: color 0.15s;
}
.cs-btn-back:hover { color: #6B7280; }
.cs-btn-next {
  background: linear-gradient(135deg, #7C3AED, #6D28D9);
  color: #fff; border: none;
  border-radius: 12px; padding: 12px 28px;
  font-size: 15px; font-weight: 600;
  font-family: inherit; cursor: pointer;
  transition: opacity 0.15s, transform 0.12s;
  box-shadow: 0 4px 14px rgba(109,40,217,0.25);
}
.cs-btn-next:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.cs-btn-next:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
.cs-err-banner {
  background: #FEF2F2; border: 1px solid #FECACA;
  border-radius: 10px; padding: 12px 16px;
  margin: 16px 24px 0; font-size: 13px; color: #DC2626;
  display: flex; align-items: center; gap: 8px;
}
.cs-err-mic {
  background: #FFFBEB; border: 1px solid #FDE68A;
  border-radius: 12px; padding: 14px 16px;
  margin-top: 20px; font-size: 13px; color: #92400E;
  display: flex; gap: 10px;
}
.cs-err-mic-hint { font-size: 12px; color: #B45309; margin: 4px 0 0; }
`

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
  { value: 'Mixed',     label: 'Integral',  desc: 'Combina RRHH y técnica, como en una entrevista real.' },
  { value: 'HR',        label: 'RRHH',      desc: 'Cultura, motivación y habilidades blandas.' },
  { value: 'Technical', label: 'Técnica',   desc: 'Conocimiento técnico y resolución de problemas.' },
]

const MAX_CHARS = 2000
const TOTAL_STEPS = 5

const IconSparkle = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.8 5.4 5.7.5-4.3 3.8 1.3 5.5L12 14.4l-4.5 2.8 1.3-5.5L4.5 7.9l5.7-.5z"/>
  </svg>
)

const DiffBars = ({ count, active }) => (
  <div className="cs-diff-bars">
    {[1, 2, 3].map((i) => (
      <div key={i} className="cs-diff-bar" style={{ height: i === 1 ? 8 : i === 2 ? 14 : 20, background: active && i <= count ? '#7C3AED' : '#D1D5DB' }} />
    ))}
  </div>
)

export default function SetupForm({ onSubmit, onBack, initialConfig, hideHeader }) {
  const { getToken } = useAuth()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState('left')
  const [form, setForm] = useState({
    country: initialConfig?.country ?? 'Argentina',
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
  const companyRef = useRef(null)
  const jobTitleRef = useRef(null)
  const sttSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition)

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

  useEffect(() => {
    if (step === 3) setTimeout(() => companyRef.current?.focus(), 50)
  }, [step])

  const goTo = (next, dir = 'left') => {
    setDirection(dir)
    setStep(next)
    setFieldErrors({})
  }

  const generateDescription = async () => {
    if (!form.jobTitle) return
    setGeneratingDesc(true)
    try {
      const token = await getToken().catch(() => null)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          max_tokens: 512,
          model: 'claude-haiku-4-5-20251001',
          system: `You are a helpful assistant that writes job descriptions. Always generate a job description regardless of the company or job title provided — never ask for clarification or refuse. Respond only with the job description text in ${form.language}, no preamble, no titles, no markdown.`,
          messages: [{ role: 'user', content: `Write a concise job description (3-5 sentences, plain text) in ${form.language} for the role of "${form.jobTitle}"${form.companyName ? ` at ${form.companyName}` : ''}. Cover main responsibilities and key requirements.` }],
        }),
      })
      const data = await res.json()
      const text = data.text || data.content || ''
      if (text) setForm((f) => ({ ...f, jobDescription: text.trim().slice(0, MAX_CHARS) }))
    } catch { /* fail silently */ }
    finally { setGeneratingDesc(false) }
  }

  const handleNext = () => {
    if (step === 1 && !form.country) { setFieldErrors({ country: 'Seleccioná un país.' }); return }
    if (step === 3 && !form.jobTitle.trim()) { setFieldErrors({ jobTitle: 'Ingresá el nombre del puesto.' }); return }
    if (step === 4 && !form.jobDescription.trim()) { setFieldErrors({ jobDescription: 'Agregá una descripción del puesto.' }); return }
    if (step < TOTAL_STEPS) { goTo(step + 1, 'left'); return }
    handleSubmit()
  }

  const handleSubmit = async () => {
    setCheckingLimit(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (token) {
        const res = await fetch('/api/interviews/daily-count', { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const { count } = await res.json()
          if (count >= 10) { setDailyLimitReached(true); setCheckingLimit(false); return }
        }
      }
    } catch { /* dejamos pasar */ }
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

  const animClass = direction === 'left' ? 'cs-step--slide-left' : 'cs-step--slide-right'

  if (dailyLimitReached) {
    return (
      <>
        <style>{CSS}</style>
        <div className="cs-page">
          <header className="cs-header">
            <div className="cs-logo" onClick={onBack}>
              <img src="/logo.png" alt="FeelReady" style={{ height: 32, width: 'auto' }} />
            </div>
          </header>
          <main className="cs-main">
            <div className="cs-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Límite diario alcanzado</h2>
              <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
                Hiciste 10 sesiones hoy. ¡Excelente trabajo!<br/>Volvé mañana para seguir practicando.
              </p>
              {onBack && <button className="cs-btn-next" onClick={onBack}>← Volver al inicio</button>}
            </div>
          </main>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="cs-page">
        {!sttSupported && (
          <div className="cs-err-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Este navegador no soporta reconocimiento de voz. Usá <strong>Chrome</strong> o <strong>Edge</strong>.
          </div>
        )}
        {!hideHeader && (
          <header className="cs-header">
            <div className="cs-logo" onClick={onBack}>
              <img src="/logo.png" alt="FeelReady" style={{ height: 32, width: 'auto' }} />
            </div>
            <div className="cs-progress-wrap">
              <div className="cs-progress-bar" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
            </div>
            <span className="cs-step-label">{step} / {TOTAL_STEPS}</span>
          </header>
        )}

        <main className="cs-main">
          <div className="cs-card">

            {/* ── Paso 1: País ── */}
            {step === 1 && (
              <div className={`cs-step ${animClass}`} key="step1">
                <h1 className="cs-heading">¿En qué país es<br/>la entrevista?</h1>
                <p className="cs-subheading">Adaptamos el tono y las convenciones locales según el país.</p>
                <select
                  className="cs-select"
                  value={form.country}
                  onChange={(e) => { setForm(f => ({ ...f, country: e.target.value })); setFieldErrors({}) }}
                  autoFocus
                >
                  <option value="">Seleccioná un país…</option>
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                {fieldErrors.country && <span className="cs-field-error">{fieldErrors.country}</span>}
                <div className="cs-footer">
                  {onBack ? <button className="cs-btn-back" onClick={onBack}>← Volver</button> : <div />}
                  <button className="cs-btn-next" onClick={handleNext} disabled={!form.country}>Continuar →</button>
                </div>
              </div>
            )}

            {/* ── Paso 2: Idioma ── */}
            {step === 2 && (
              <div className={`cs-step ${animClass}`} key="step2">
                <h1 className="cs-heading">¿En qué idioma<br/>será la entrevista?</h1>
                <p className="cs-subheading">Todas las preguntas y respuestas serán en ese idioma.</p>
                <div className="cs-options">
                  {LANG_OPTIONS.map((l) => (
                    <button
                      key={l.value}
                      className={`cs-option ${form.language === l.value ? 'cs-option--active' : ''}`}
                      onClick={() => setForm(f => ({ ...f, language: l.value }))}
                    >
                      <div className="cs-option-dot">{form.language === l.value && <div className="cs-option-dot-inner" />}</div>
                      {l.label}
                    </button>
                  ))}
                </div>
                <div className="cs-footer">
                  <button className="cs-btn-back" onClick={() => goTo(1, 'right')}>← Volver</button>
                  <button className="cs-btn-next" onClick={handleNext}>Continuar →</button>
                </div>
              </div>
            )}

            {/* ── Paso 3: Empresa + Puesto ── */}
            {step === 3 && (
              <div className={`cs-step ${animClass}`} key="step3">
                <h1 className="cs-heading">¿Para qué empresa<br/>y puesto practicás?</h1>
                <p className="cs-subheading">Cuanto más detalle, más realista será la simulación.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <span className="cs-field-label">Empresa <span className="cs-field-opt">opcional</span></span>
                    <input
                      ref={companyRef}
                      className="cs-input"
                      value={form.companyName}
                      onChange={(e) => setForm(f => ({ ...f, companyName: e.target.value }))}
                      placeholder="Ej: Mercado Libre"
                    />
                  </div>
                  <div>
                    <span className="cs-field-label">Rol / Puesto</span>
                    <input
                      ref={jobTitleRef}
                      className="cs-input"
                      value={form.jobTitle}
                      onChange={(e) => { setForm(f => ({ ...f, jobTitle: e.target.value })); setFieldErrors({}) }}
                      placeholder="Ej: Product Manager"
                      onKeyDown={(e) => { if (e.key === 'Enter' && form.jobTitle.trim()) handleNext() }}
                    />
                    {fieldErrors.jobTitle && <span className="cs-field-error">{fieldErrors.jobTitle}</span>}
                  </div>
                </div>
                <div className="cs-footer">
                  <button className="cs-btn-back" onClick={() => goTo(2, 'right')}>← Volver</button>
                  <button className="cs-btn-next" onClick={handleNext} disabled={!form.jobTitle.trim()}>Continuar →</button>
                </div>
              </div>
            )}

            {/* ── Paso 4: Descripción ── */}
            {step === 4 && (
              <div className={`cs-step ${animClass}`} key="step4">
                <h1 className="cs-heading">Descripción<br/>del puesto</h1>
                <p className="cs-subheading">El entrevistador la usará para hacerte preguntas más específicas.</p>
                <div className="cs-ai-row">
                  <button className="cs-ai-btn" onClick={generateDescription} disabled={!form.jobTitle || generatingDesc}>
                    {generatingDesc ? <><span className="cs-ai-spinner" /> Generando…</> : <><IconSparkle /> Generar con IA</>}
                  </button>
                </div>
                <div className="cs-textarea-wrap">
                  <textarea
                    className="cs-textarea"
                    value={form.jobDescription}
                    onChange={(e) => { setForm(f => ({ ...f, jobDescription: e.target.value.slice(0, MAX_CHARS) })); setFieldErrors({}) }}
                    placeholder="Pegá la descripción o resumí las responsabilidades principales…"
                    rows={5}
                    autoFocus
                  />
                  <span className="cs-char-count">{form.jobDescription.length}/{MAX_CHARS}</span>
                </div>
                {fieldErrors.jobDescription && <span className="cs-field-error">{fieldErrors.jobDescription}</span>}
                <div className="cs-footer">
                  <button className="cs-btn-back" onClick={() => goTo(3, 'right')}>← Volver</button>
                  <button className="cs-btn-next" onClick={handleNext} disabled={!form.jobDescription.trim()}>Continuar →</button>
                </div>
              </div>
            )}

            {/* ── Paso 5: Tipo + Dificultad ── */}
            {step === 5 && (
              <div className={`cs-step ${animClass}`} key="step5">
                <h1 className="cs-heading">¿Cómo querés<br/>la entrevista?</h1>
                <p className="cs-subheading">Elegí el tipo y el nivel de exigencia.</p>

                <div style={{ marginBottom: 24 }}>
                  <span className="cs-field-label">Tipo de entrevista</span>
                  <div className="cs-options">
                    {INTERVIEW_TYPES.map((t) => (
                      <button
                        key={t.value}
                        className={`cs-option ${form.interviewType === t.value ? 'cs-option--active' : ''}`}
                        onClick={() => setForm(f => ({ ...f, interviewType: t.value }))}
                        style={{ alignItems: 'center' }}
                      >
                        <div className="cs-option-dot">{form.interviewType === t.value && <div className="cs-option-dot-inner" />}</div>
                        <div className="cs-option-body">
                          <span className="cs-option-label">{t.label}</span>
                          <span className="cs-option-desc">{t.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="cs-field-label">Dificultad</span>
                  <div className="cs-diff-grid">
                    {DIFFICULTIES.map((d, i) => (
                      <button
                        key={d.value}
                        className={`cs-diff-card ${form.difficulty === d.value ? 'cs-diff-card--active' : ''}`}
                        onClick={() => setForm(f => ({ ...f, difficulty: d.value }))}
                        style={{ animation: `cs-fade-up 0.3s ease ${i * 0.07}s both` }}
                      >
                        <DiffBars count={d.bars} active={form.difficulty === d.value} />
                        <span className="cs-diff-label">{d.label}</span>
                        <span className="cs-diff-desc">{d.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {micBlocked && (
                  <div className="cs-err-mic">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
                    <div>
                      <strong>Tu micrófono no está disponible.</strong> Revisá los permisos del navegador.
                      <p className="cs-err-mic-hint">En Chrome: hacé clic en el candado 🔒 → Micrófono → Permitir, y recargá la página.</p>
                    </div>
                  </div>
                )}

                <div className="cs-footer">
                  <button className="cs-btn-back" onClick={() => goTo(4, 'right')}>← Volver</button>
                  <button className="cs-btn-next" onClick={handleNext} disabled={checkingLimit || micBlocked || !sttSupported}>
                    {checkingLimit ? 'Verificando...' : 'Empezar →'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  )
}
