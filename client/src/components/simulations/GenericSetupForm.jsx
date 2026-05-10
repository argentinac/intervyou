import { useState } from 'react'
import { unlockAudio } from '../../audioContext'
import { generateInterlocutorName } from '../../lib/simulations/interlocutorNames'

const IntervyouIcon = () => (
  <img src="/logo.png" alt="intervyou" style={{ height: 48, width: 'auto' }} />
)

const DiffIcon = ({ bars }) => (
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <rect x="0.5"  y="9.5"  width="4" height="6"  rx="1" stroke="currentColor" strokeWidth="1.5" fill={bars >= 1 ? 'currentColor' : 'none'} fillOpacity={bars >= 1 ? 0.85 : 0} />
    <rect x="7.5"  y="5.5"  width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill={bars >= 2 ? 'currentColor' : 'none'} fillOpacity={bars >= 2 ? 0.85 : 0} />
    <rect x="14.5" y="0.5"  width="4" height="15" rx="1" stroke="currentColor" strokeWidth="1.5" fill={bars >= 3 ? 'currentColor' : 'none'} fillOpacity={bars >= 3 ? 0.85 : 0} />
  </svg>
)

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
              icon={isDifficulty ? <DiffIcon bars={DIFFICULTY_BARS[o.value] || 2} /> : undefined}
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
  return !!v
}

function buildInitialAnswers(simulation) {
  const initial = { difficulty: 'Intermediate' }
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

  const setAnswer = (id, value) => setAnswers((a) => ({ ...a, [id]: value }))

  const screen = step === 1 ? simulation.onboarding.screen1 : simulation.onboarding.screen2
  const screen1Valid = simulation.onboarding.screen1.questions.every((q) => isAnswerValid(q, answers))
  const screen2Valid = simulation.onboarding.screen2.questions.every((q) => isAnswerValid(q, answers))

  const handleSubmit = async (e) => {
    e.preventDefault()
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
    })
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
                  disabled={!screen2Valid}
                  data-track={`simulation_started_${simulation.id}`}
                >
                  Empezar →
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
