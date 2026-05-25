import { useState, useEffect, useRef } from 'react'
import { unlockAudio } from '../../audioContext'
import { supabase } from '../../lib/supabase'
import { generateInterlocutorName } from '../../lib/simulations/interlocutorNames'
import { COUNTRIES_ES } from '../../lib/simulations/countries'

const IntervyouIcon = () => (
  <img src="/logo.png" alt="intervyou" style={{ height: 32, width: 'auto' }} />
)

const DiffIcon = ({ bars }) => (
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <rect x="0.5"  y="9.5"  width="4" height="6"  rx="1" stroke="currentColor" strokeWidth="1.5" fill={bars >= 1 ? 'currentColor' : 'none'} fillOpacity={bars >= 1 ? 0.85 : 0} />
    <rect x="7.5"  y="5.5"  width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill={bars >= 2 ? 'currentColor' : 'none'} fillOpacity={bars >= 2 ? 0.85 : 0} />
    <rect x="14.5" y="0.5"  width="4" height="15" rx="1" stroke="currentColor" strokeWidth="1.5" fill={bars >= 3 ? 'currentColor' : 'none'} fillOpacity={bars >= 3 ? 0.85 : 0} />
  </svg>
)

// Named icons for option chips. Add more as the catalog needs them.
const OPTION_ICONS = {
  time_short: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l2 2" />
    </svg>
  ),
  time_mid: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /><path d="M7 3.5l1.5 1.5" /><path d="M17 3.5l-1.5 1.5" />
    </svg>
  ),
  time_long: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /><path d="M5.5 5.5l1.5 1.5" /><path d="M18.5 5.5l-1.5 1.5" /><path d="M3 12h2M19 12h2" />
    </svg>
  ),
  time_verylong: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /><path d="M7.5 20.5l1-1.5" /><path d="M16.5 20.5l-1-1.5" />
    </svg>
  ),
  resign_truth: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  resign_partial: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  resign_silent: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  male: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="3.2" /><path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
    </svg>
  ),
  female: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="3.2" /><path d="M7 21l1.5-6h7L17 21" /><path d="M9 14h6" />
    </svg>
  ),
  neutral: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="2.6" /><circle cx="15" cy="7" r="2.6" /><path d="M4 21v-2a3 3 0 0 1 3-3h2" /><path d="M20 21v-2a3 3 0 0 0-3-3h-2" />
    </svg>
  ),
  manager: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="3" /><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><path d="M9 11l3 2 3-2" />
    </svg>
  ),
  hr: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><path d="M16 3l2 2-2 2" /><path d="M18 5h3" />
    </svg>
  ),
  ceo: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l3-9 3 6 3-10 3 10 3-6 3 9z" /><line x1="3" y1="20" x2="21" y2="20" />
    </svg>
  ),
}

const RadioCard = ({ active, label, desc, onClick, wide, icon, flag }) => (
  <button
    type="button"
    className={`rc ${active ? 'rc--active' : ''} ${wide ? 'rc--wide' : ''}`}
    onClick={onClick}
    style={flag ? { textAlign: 'left' } : {}}
  >
    <div className="rc-dot-wrap">
      <span className={`rc-dot ${active ? 'rc-dot--active' : ''}`} />
    </div>
    <div className="rc-body">
      {flag && <span style={{ fontSize: 18, lineHeight: 1 }}>{flag}</span>}
      {icon && <span className="rc-icon">{icon}</span>}
      <span className="rc-label">{label}</span>
      {desc && <span className="rc-desc">{desc}</span>}
    </div>
  </button>
)

const DIFFICULTY_BARS = { Basic: 1, Intermediate: 2, Advanced: 3 }

function Question({ q, value, onChange }) {
  if (q.type === 'shortText') {
    return (
      <div className="sf-field">
        <label>{q.label}</label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder || ''}
          maxLength={60}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }}
        />
      </div>
    )
  }

  if (q.type === 'tile') {
    return (
      <div className="sf-field">
        <label>{q.label}</label>
        <div className="sf-cards-row">
          {q.options.map((o) => (
            <RadioCard
              key={o.value}
              active={value === o.value}
              label={o.label}
              desc={o.desc}
              icon={o.icon ? OPTION_ICONS[o.icon] : undefined}
              onClick={() => onChange(o.value)}
              wide
            />
          ))}
        </div>
      </div>
    )
  }

  if (q.type === 'select' || q.type === 'difficulty') {
    const isDifficulty = q.type === 'difficulty'
    const useGrid = !isDifficulty && (q.options.length <= 8)
    return (
      <div className="sf-field">
        <label>{q.label}</label>
        <div
          className={isDifficulty ? 'sf-cards-row' : ''}
          style={isDifficulty ? {} : useGrid
            ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }
            : { display: 'flex', flexDirection: 'column', gap: 8 }
          }
        >
          {q.options.map((o) => (
            <RadioCard
              key={o.value}
              active={value === o.value}
              label={o.label}
              desc={o.desc}
              flag={o.flag}
              icon={
                isDifficulty
                  ? <DiffIcon bars={DIFFICULTY_BARS[o.value] || 2} />
                  : (o.icon && OPTION_ICONS[o.icon]) || undefined
              }
              onClick={() => onChange(o.value)}
              wide
            />
          ))}
        </div>
      </div>
    )
  }

  if (q.type === 'country') {
    return (
      <div className="sf-field">
        <label>{q.label}</label>
        <select
          value={value || q.defaultValue || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 14, fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box' }}
        >
          <option value="">Seleccioná un país…</option>
          {(q.options || []).map((o) => (
            <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
              {typeof o === 'string' ? o : o.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (q.type === 'multiselect') {
    const arr = Array.isArray(value) ? value : []
    const toggle = (v) => {
      if (arr.includes(v)) { onChange(arr.filter((x) => x !== v)); return }
      if (q.max && arr.length >= q.max) return
      onChange([...arr, v])
    }
    return (
      <div className="sf-field">
        <label>{q.label}{q.max ? ` (máx ${q.max})` : ''}</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {q.options.map((o) => {
            const active = arr.includes(o.value)
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => toggle(o.value)}
                style={{
                  padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 500,
                  border: '1px solid', cursor: 'pointer', fontFamily: 'inherit',
                  borderColor: active ? '#7C3AED' : '#E5E7EB',
                  background: active ? '#7C3AED' : '#fff',
                  color: active ? '#fff' : '#374151',
                }}
              >
                {o.label}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return null
}

function isAnswerValid(q, answers) {
  const v = answers[q.id]
  if (!q.required) return true
  if (q.type === 'shortText') return typeof v === 'string' && v.trim().length > 0
  if (q.type === 'multiselect') return Array.isArray(v) && v.length > 0
  if (q.type === 'tile') return !!v
  return !!v
}

function buildInitialAnswers(simulation) {
  const initial = {}
  const all = [
    ...(simulation.onboarding?.screen1?.questions || []),
    ...(simulation.onboarding?.screen2?.questions || []),
  ]
  for (const q of all) {
    if (q.defaultValue !== undefined) initial[q.id] = q.defaultValue
  }
  return initial
}

export default function GenericSetupForm({ simulation, onSubmit, onBack }) {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState(() => buildInitialAnswers(simulation))
  const detectedCountryRef = useRef(null)
  const [dailyLimitReached, setDailyLimitReached] = useState(false)
  const [checkingLimit, setCheckingLimit] = useState(false)

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        if (data.country_name && COUNTRIES_ES.includes(data.country_name)) {
          detectedCountryRef.current = data.country_name
        }
      })
      .catch(() => {})
  }, [])

  const setAnswer = (id, value) => setAnswers((a) => ({ ...a, [id]: value }))

  const screen = step === 1 ? simulation.onboarding.screen1 : simulation.onboarding.screen2
  const screen1Valid = simulation.onboarding.screen1.questions.every((q) => isAnswerValid(q, answers))
  const screen2Valid = simulation.onboarding.screen2.questions.every((q) => isAnswerValid(q, answers))

  const handleSubmit = async (e) => {
    e.preventDefault()
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
    } catch {
      // si falla el check, dejamos pasar
    }
    setCheckingLimit(false)
    unlockAudio()
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      // SpeechRecognition handles the error
    }
    const interlocutorGender = answers.interlocutorGender || simulation.interlocutorDefaultGender || 'male'
    const language = answers.language || simulation.defaultLanguage || 'Spanish'
    const interlocutorName = generateInterlocutorName(interlocutorGender, language)
    onSubmit({
      ...answers,
      simulationId: simulation.id,
      simulationCategory: simulation.category,
      interviewType: 'Simulation',
      language,
      interlocutorGender,
      interlocutorName,
      interlocutorRole: simulation.interlocutorRole || simulation.uiCopy?.interlocutorLabel,
      country: answers.country || detectedCountryRef.current || '',
    })
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
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
              Límite diario alcanzado
            </h2>
            <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
              Hiciste 10 sesiones hoy. ¡Excelente trabajo!<br />
              Volvé mañana para seguir practicando.
            </p>
            {onBack && (
              <button className="sf-next" onClick={onBack} style={{ display: 'inline-block' }}>
                ← Volver al inicio
              </button>
            )}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="sf-page">
      <header className="sf-header">
        <div className="sf-logo" style={{ cursor: onBack ? 'pointer' : 'default' }} onClick={onBack}>
          <IntervyouIcon />
        </div>
        <div className="sf-progress">
          <div className="sf-progress-bar" style={{ width: step === 1 ? '50%' : '100%' }} />
        </div>
        <span className="sf-step-label">{step} / 2</span>
      </header>

      <main className="sf-main">
        <div className="sf-card">
          <div className="sf-heading">
            <h1>{screen.heading}</h1>
            {screen.subheading && (
              <p style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>{screen.subheading}</p>
            )}
          </div>

          <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()}>
            <div className="sf-fields">
              {screen.questions.map((q) => (
                <Question key={q.id} q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />
              ))}
            </div>

            <div className="sf-footer">
              {step === 1 ? <div /> : (
                <button type="button" className="sf-back" onClick={() => setStep(1)}>← Volver</button>
              )}
              {step === 1 ? (
                <button
                  type="button"
                  className="sf-next"
                  onClick={() => setStep(2)}
                  disabled={!screen1Valid}
                  data-track={`simulation_setup_step1_${simulation.id}`}
                >
                  Continuar →
                </button>
              ) : (
                <button
                  type="submit"
                  className="sf-next"
                  disabled={!screen2Valid || checkingLimit}
                  data-track={`simulation_started_${simulation.id}`}
                >
                  {checkingLimit ? 'Verificando...' : 'Empezar →'}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
