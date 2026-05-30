import { useState, useEffect, useRef } from 'react'
import { unlockAudio } from '../../audioContext'
import { generateInterlocutorName } from '../../lib/simulations/interlocutorNames'

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const CSS = `
@keyframes cs-fade-up {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes cs-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes cs-slide-left {
  from { opacity: 0; transform: translateX(32px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes cs-slide-right {
  from { opacity: 0; transform: translateX(-32px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes cs-dot-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40%           { transform: translateY(-8px); opacity: 1; }
}
@keyframes cs-pulse-ring {
  0%   { transform: scale(0.95); opacity: 0.6; }
  50%  { transform: scale(1.05); opacity: 0.2; }
  100% { transform: scale(0.95); opacity: 0.6; }
}
@keyframes cs-shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
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
.cs-logo {
  cursor: pointer;
  opacity: 0.9;
  transition: opacity 0.15s;
}
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

/* ── Step: input ── */
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

.cs-textarea-wrap {
  position: relative;
}
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
.cs-textarea:focus {
  border-color: #7C3AED;
  background: #fff;
}
.cs-textarea::placeholder { color: #C4C8D0; }
.cs-char-count {
  position: absolute;
  bottom: 10px;
  right: 14px;
  font-size: 11px;
  color: #D1D5DB;
}

.cs-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}
.cs-example-chip {
  background: #F3F0FF;
  color: #6D28D9;
  border: none;
  border-radius: 99px;
  padding: 6px 14px;
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, transform 0.12s;
  font-weight: 500;
}
.cs-example-chip:hover {
  background: #EDE9FE;
  transform: translateY(-1px);
}

/* ── Loading ── */
.cs-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
  gap: 28px;
  animation: cs-fade-in 0.4s ease both;
}
.cs-loading-icon {
  width: 72px;
  height: 72px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cs-loading-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%);
  animation: cs-pulse-ring 1.8s ease-in-out infinite;
}
.cs-loading-inner {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #7C3AED, #A78BFA);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}
.cs-loading-text {
  text-align: center;
}
.cs-loading-title {
  font-size: 17px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
}
.cs-loading-sub {
  font-size: 13px;
  color: #9CA3AF;
  margin: 0;
}
.cs-dots {
  display: flex;
  gap: 6px;
  margin-top: 20px;
  justify-content: center;
}
.cs-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7C3AED;
  animation: cs-dot-bounce 1.2s infinite ease-in-out;
}
.cs-dot:nth-child(2) { animation-delay: 0.2s; }
.cs-dot:nth-child(3) { animation-delay: 0.4s; }

/* ── Questions ── */
.cs-q-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
  display: block;
}
.cs-q-wrap { margin-bottom: 24px; }

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
.cs-option:hover {
  border-color: #C4B5FD;
  background: #F5F3FF;
  transform: translateY(-1px);
}
.cs-option--active {
  border-color: #7C3AED;
  background: #F5F3FF;
  color: #5B21B6;
}
.cs-option-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #D1D5DB;
  flex-shrink: 0;
  margin-top: 1px;
  transition: border-color 0.15s, background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cs-option--active .cs-option-dot {
  border-color: #7C3AED;
  background: #7C3AED;
}
.cs-option-dot-inner {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
}
.cs-option-check {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 2px solid #D1D5DB;
  flex-shrink: 0;
  margin-top: 1px;
  transition: border-color 0.15s, background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cs-option--active .cs-option-check {
  border-color: #7C3AED;
  background: #7C3AED;
}

.cs-other-input {
  margin-top: 8px;
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #E5E7EB;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.cs-other-input:focus { border-color: #7C3AED; }

/* ── Gender ── */
.cs-gender-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.cs-gender-card {
  border: 1.5px solid #E5E7EB;
  border-radius: 14px;
  padding: 20px 12px 16px;
  background: #FAFAFA;
  cursor: pointer;
  text-align: center;
  font-family: inherit;
  transition: border-color 0.15s, background 0.15s, transform 0.12s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.cs-gender-card:hover {
  border-color: #C4B5FD;
  background: #F5F3FF;
  transform: translateY(-2px);
}
.cs-gender-card--active {
  border-color: #7C3AED;
  background: #F5F3FF;
}
.cs-gender-icon {
  color: #9CA3AF;
  transition: color 0.15s;
}
.cs-gender-card--active .cs-gender-icon { color: #7C3AED; }
.cs-gender-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  display: block;
}
.cs-gender-card--active .cs-gender-label { color: #5B21B6; }
.cs-gender-desc {
  font-size: 11px;
  color: #9CA3AF;
  line-height: 1.4;
  display: block;
}

/* ── Difficulty ── */
.cs-diff-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
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
.cs-diff-card:hover {
  border-color: #C4B5FD;
  background: #F5F3FF;
  transform: translateY(-2px);
}
.cs-diff-card--active {
  border-color: #7C3AED;
  background: #F5F3FF;
}
.cs-diff-bars {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  margin-bottom: 10px;
  height: 20px;
}
.cs-diff-bar {
  width: 6px;
  border-radius: 3px;
  background: #D1D5DB;
  transition: background 0.15s;
}
.cs-diff-card--active .cs-diff-bar { background: #7C3AED; }
.cs-diff-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  display: block;
  margin-bottom: 4px;
}
.cs-diff-card--active .cs-diff-label { color: #5B21B6; }
.cs-diff-desc {
  font-size: 11px;
  color: #9CA3AF;
  line-height: 1.4;
  display: block;
}

/* ── Footer ── */
.cs-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;
}
.cs-btn-back {
  background: none;
  border: none;
  font-family: inherit;
  font-size: 14px;
  color: #9CA3AF;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.15s;
}
.cs-btn-back:hover { color: #6B7280; }
.cs-btn-next {
  background: linear-gradient(135deg, #7C3AED, #6D28D9);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.12s;
  box-shadow: 0 4px 14px rgba(109,40,217,0.25);
}
.cs-btn-next:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.cs-btn-next:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
`

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const DiffBars = ({ count, active }) => (
  <div className="cs-diff-bars">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="cs-diff-bar"
        style={{
          height: i === 1 ? 8 : i === 2 ? 14 : 20,
          background: active && i <= count ? '#7C3AED' : '#D1D5DB',
        }}
      />
    ))}
  </div>
)

const GENDER_OPTIONS = [
  {
    value: 'indistinto',
    label: 'Indistinto',
    desc: 'Aleatorio según el contexto',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" strokeDasharray="3 2" />
      </svg>
    ),
  },
  {
    value: 'hombre',
    label: 'Hombre',
    desc: 'Interlocutor masculino',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="14" r="5" />
        <path d="M19 5l-4.5 4.5M19 5h-5M19 5v5" />
      </svg>
    ),
  },
  {
    value: 'mujer',
    label: 'Mujer',
    desc: 'Interlocutora femenina',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="5" />
        <path d="M12 14v6M9 17h6" />
      </svg>
    ),
  },
]

const DIFFICULTY_OPTIONS = [
  { value: 'Basic', label: 'Básico', desc: 'Tono receptivo y abierto', bars: 1 },
  { value: 'Intermediate', label: 'Intermedio', desc: 'Profesional y analítico', bars: 2 },
  { value: 'Advanced', label: 'Difícil', desc: 'Escéptico y exigente', bars: 3 },
]

const EXAMPLES = [
  'Pedir un aumento de sueldo',
  'Dar una mala noticia a un cliente',
  'Hablar con mi jefe sobre un conflicto',
  'Presentar una idea al equipo',
  'Negociar un contrato',
]

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function CustomSituationSetup({ simulation, onSubmit, onBack, initialSituation, hideHeader }) {
  const [step, setStep] = useState('input') // 'input' | 'loading' | 'questions' | 'difficulty' | 'gender'
  const [direction, setDirection] = useState('left')
  const [situation, setSituation] = useState(initialSituation || '')
  const [generated, setGenerated] = useState(null) // { persona, questions }
  const [qAnswers, setQAnswers] = useState({})
  const [otherText, setOtherText] = useState({})
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [gender, setGender] = useState('indistinto')
  const [qIndex, setQIndex] = useState(0)
  const [error, setError] = useState(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (step === 'input') textareaRef.current?.focus()
  }, [step])

  // If initialSituation provided, auto-submit on mount (skip input screen)
  useEffect(() => {
    if (initialSituation) {
      handleSituationSubmit()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = (next, dir = 'left') => {
    setDirection(dir)
    setStep(next)
  }

  const handleSituationSubmit = async () => {
    if (!situation.trim()) return
    goTo('loading')
    setError(null)
    try {
      const res = await fetch('/api/generate-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation: situation.trim() }),
      })
      if (!res.ok) throw new Error('api_error')
      const data = await res.json()
      if (!data.persona || !Array.isArray(data.questions)) throw new Error('bad_response')
      setGenerated({ ...data, situationTitle: data.situationTitle || situation.trim().slice(0, 50) })
      setQIndex(0)
      goTo('questions', 'left')
    } catch {
      setError('Hubo un problema generando tu simulación. Intentá de nuevo.')
      goTo('input', 'right')
    }
  }

  const allQuestionsAnswered = () => {
    if (!generated) return false
    return generated.questions.every((q) => {
      const v = qAnswers[q.id]
      if (!v) return false
      if (q.type === 'multiselect') return Array.isArray(v) && v.length > 0
      return true
    })
  }

  const handleSubmit = async () => {
    unlockAudio()
    try { await navigator.mediaDevices.getUserMedia({ audio: true }) } catch { /* handled by SpeechRecognition */ }

    const persona = generated?.persona || {}
    const resolvedGender =
      gender === 'hombre' ? 'male' :
      gender === 'mujer' ? 'female' :
      (persona.gender || 'male')
    const voiceTone = persona.voiceTone || 'neutral'
    const interlocutorName = generateInterlocutorName(resolvedGender, 'Spanish')

    const resolvedAnswers = {}
    for (const [id, val] of Object.entries(qAnswers)) {
      if (val === 'other') {
        resolvedAnswers[id] = otherText[id] || 'otra situación'
      } else if (Array.isArray(val)) {
        resolvedAnswers[id] = val.map((v) => (v === 'other' ? otherText[id] || 'otra' : v))
      } else {
        resolvedAnswers[id] = val
      }
    }

    onSubmit({
      simulationId: simulation.id,
      simulationCategory: simulation.category,
      interviewType: 'Simulation',
      language: 'Spanish',
      difficulty,
      interlocutorGender: resolvedGender,
      interlocutorName,
      interlocutorRole: persona.role || 'Tu interlocutor',
      voiceTone,
      simulationTitle: generated?.situationTitle || situation.trim().slice(0, 50),
      dynamicSituation: situation.trim(),
      dynamicPersonaCore: persona.systemPromptCore || '',
      dynamicAnswers: resolvedAnswers,
    })
  }

  const totalSteps = 3 + (generated?.questions?.length || 0)
  const stepIndex = step === 'input' ? 1
    : step === 'loading' ? 2
    : step === 'questions' ? 2 + qIndex + 1
    : step === 'difficulty' ? totalSteps - 1
    : totalSteps
  const progressPct = `${Math.round((stepIndex / totalSteps) * 100)}%`
  const stepNumMap = {
    input: `1 / ${totalSteps}`,
    questions: `${2 + qIndex} / ${totalSteps}`,
    difficulty: `${totalSteps - 1} / ${totalSteps}`,
    gender: `${totalSteps} / ${totalSteps}`,
  }

  const animClass =
    step === 'loading' ? '' : direction === 'left' ? 'cs-step--slide-left' : 'cs-step--slide-right'

  return (
    <>
      <style>{CSS}</style>
      <div className="cs-page">
        {!hideHeader && (
          <header className="cs-header">
            <div className="cs-logo" onClick={onBack}>
              <img src="/logo.png" alt="FeelReady" style={{ height: 32, width: 'auto' }} />
            </div>
            <div className="cs-progress-wrap">
              <div className="cs-progress-bar" style={{ width: progressPct }} />
            </div>
            <span className="cs-step-label">{stepNumMap[step] || ''}</span>
          </header>
        )}
        {hideHeader && (
          <div className="cs-header" style={{ paddingTop: 16 }}>
            <div className="cs-progress-wrap">
              <div className="cs-progress-bar" style={{ width: progressPct }} />
            </div>
            <span className="cs-step-label">{stepNumMap[step] || ''}</span>
          </div>
        )}

        <main className="cs-main">
          <div className="cs-card">

            {/* ── STEP: INPUT ── */}
            {step === 'input' && (
              <div className={`cs-step ${animClass}`} key="input">
                <h1 className="cs-heading">¿Qué situación querés trabajar hoy?</h1>
                <p className="cs-subheading">
                  Describí con tus palabras. Puede ser algo del trabajo, personal o cualquier conversación difícil.
                </p>

                {error && (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#DC2626' }}>
                    {error}
                  </div>
                )}

                <div className="cs-textarea-wrap">
                  <textarea
                    ref={textareaRef}
                    className="cs-textarea"
                    placeholder="Ej: Quiero practicar cómo pedirle un aumento a mi jefe..."
                    value={situation}
                    onChange={(e) => setSituation(e.target.value.slice(0, 200))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && situation.trim().length >= 5) {
                        e.preventDefault()
                        handleSituationSubmit()
                      }
                    }}
                  />
                  <span className="cs-char-count">{situation.length}/200</span>
                </div>

                <div className="cs-examples">
                  {EXAMPLES.map((ex) => (
                    <button key={ex} className="cs-example-chip" onClick={() => setSituation(ex)}>
                      {ex}
                    </button>
                  ))}
                </div>

                <div className="cs-footer">
                  <button className="cs-btn-back" onClick={onBack}>← Volver</button>
                  <button
                    className="cs-btn-next"
                    onClick={handleSituationSubmit}
                    disabled={situation.trim().length < 5}
                  >
                    Continuar →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP: LOADING ── */}
            {step === 'loading' && (
              <div className="cs-loading" key="loading">
                <div className="cs-loading-icon">
                  <div className="cs-loading-ring" />
                  <div className="cs-loading-inner">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                </div>
                <div className="cs-loading-text">
                  <p className="cs-loading-title">Personalizando tu experiencia</p>
                  <p className="cs-loading-sub">Preparando preguntas para tu situación específica...</p>
                  <div className="cs-dots">
                    <div className="cs-dot" />
                    <div className="cs-dot" />
                    <div className="cs-dot" />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP: QUESTIONS ── */}
            {step === 'questions' && generated && (() => {
              const q = generated.questions[qIndex]
              const val = qAnswers[q.id]
              const isMulti = q.type === 'multiselect'
              const isLast = qIndex === generated.questions.length - 1
              const currentAnswered = isMulti ? (Array.isArray(val) && val.length > 0) : !!val

              const toggleMulti = (v) => {
                const arr = Array.isArray(val) ? val : []
                if (arr.includes(v)) {
                  setQAnswers((a) => ({ ...a, [q.id]: arr.filter((x) => x !== v) }))
                } else {
                  const max = q.max || 99
                  if (arr.length < max) setQAnswers((a) => ({ ...a, [q.id]: [...arr, v] }))
                }
              }

              return (
                <div className={`cs-step ${animClass}`} key={`q-${qIndex}`}>
                  <h1 className="cs-heading">Contanos un poco más</h1>
                  <p className="cs-subheading">
                    Esto nos ayuda a crear un interlocutor que se ajuste a tu situación.
                  </p>

                  <div className="cs-q-wrap">
                    <span className="cs-q-label">{q.label}</span>
                    <div className="cs-options">
                      {q.options.map((opt) => {
                        const isActive = isMulti
                          ? Array.isArray(val) && val.includes(opt.value)
                          : val === opt.value
                        return (
                          <button
                            key={opt.value}
                            className={`cs-option ${isActive ? 'cs-option--active' : ''}`}
                            onClick={() =>
                              isMulti ? toggleMulti(opt.value) : setQAnswers((a) => ({ ...a, [q.id]: opt.value }))
                            }
                          >
                            {isMulti ? (
                              <div className="cs-option-check">
                                {isActive && (
                                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                            ) : (
                              <div className="cs-option-dot">
                                {isActive && <div className="cs-option-dot-inner" />}
                              </div>
                            )}
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>

                    {(val === 'other' || (Array.isArray(val) && val.includes('other'))) && (
                      <input
                        className="cs-other-input"
                        placeholder="Contanos más..."
                        value={otherText[q.id] || ''}
                        onChange={(e) => setOtherText((t) => ({ ...t, [q.id]: e.target.value }))}
                        maxLength={100}
                        autoFocus
                      />
                    )}
                  </div>

                  <div className="cs-footer">
                    <button
                      className="cs-btn-back"
                      onClick={() => {
                        if (qIndex === 0) goTo('input', 'right')
                        else { setDirection('right'); setQIndex(i => i - 1) }
                      }}
                    >
                      ← Volver
                    </button>
                    <button
                      className="cs-btn-next"
                      onClick={() => {
                        if (isLast) goTo('difficulty', 'left')
                        else { setDirection('left'); setQIndex(i => i + 1) }
                      }}
                      disabled={!currentAnswered}
                    >
                      Continuar →
                    </button>
                  </div>
                </div>
              )
            })()}

            {/* ── STEP: DIFFICULTY ── */}
            {step === 'difficulty' && (
              <div className={`cs-step ${animClass}`} key="difficulty">
                <h1 className="cs-heading">¿Qué nivel de dificultad?</h1>
                <p className="cs-subheading">
                  Elegí cuán exigente querés que sea tu interlocutor.
                </p>

                <div className="cs-diff-grid">
                  {DIFFICULTY_OPTIONS.map((opt, i) => (
                    <button
                      key={opt.value}
                      className={`cs-diff-card ${difficulty === opt.value ? 'cs-diff-card--active' : ''}`}
                      onClick={() => setDifficulty(opt.value)}
                      style={{ animation: `cs-fade-up 0.3s ease ${i * 0.07}s both` }}
                    >
                      <DiffBars count={opt.bars} active={difficulty === opt.value} />
                      <span className="cs-diff-label">{opt.label}</span>
                      <span className="cs-diff-desc">{opt.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="cs-footer">
                  <button className="cs-btn-back" onClick={() => goTo('questions', 'right')}>← Volver</button>
                  <button className="cs-btn-next" onClick={() => goTo('gender', 'left')}>
                    Continuar →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP: GENDER ── */}
            {step === 'gender' && (
              <div className={`cs-step ${animClass}`} key="gender">
                <h1 className="cs-heading">¿Género del interlocutor?</h1>
                <p className="cs-subheading">
                  Elegí el género de la persona con quien vas a practicar.
                </p>

                <div className="cs-gender-grid">
                  {GENDER_OPTIONS.map((opt, i) => (
                    <button
                      key={opt.value}
                      className={`cs-gender-card ${gender === opt.value ? 'cs-gender-card--active' : ''}`}
                      onClick={() => setGender(opt.value)}
                      style={{ animation: `cs-fade-up 0.3s ease ${i * 0.07}s both` }}
                    >
                      <span className="cs-gender-icon">{opt.icon}</span>
                      <span className="cs-gender-label">{opt.label}</span>
                      <span className="cs-gender-desc">{opt.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="cs-footer">
                  <button className="cs-btn-back" onClick={() => goTo('difficulty', 'right')}>← Volver</button>
                  <button className="cs-btn-next" onClick={handleSubmit}>
                    Empezar →
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
