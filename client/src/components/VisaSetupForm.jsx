import { useState } from 'react'
import { unlockAudio } from '../audioContext'

const VISA_TYPES = [
  {
    value: 'B1/B2',
    label: 'B1/B2 — Turista / Negocios',
    desc: 'Visita temporal para turismo, visitas familiares o negocios.',
    flag: '🇺🇸',
  },
  {
    value: 'F1',
    label: 'F1 — Estudiante',
    desc: 'Estudios académicos en una institución aprobada por el SEVP.',
    flag: '🎓',
  },
  {
    value: 'H1B',
    label: 'H1B — Trabajador especializado',
    desc: 'Empleo en ocupaciones de especialidad. Requiere patrocinador.',
    flag: '💼',
  },
  {
    value: 'O1',
    label: 'O1 — Habilidad extraordinaria',
    desc: 'Para personas con logros extraordinarios en su campo.',
    flag: '⭐',
  },
  {
    value: 'L1',
    label: 'L1 — Transferencia intracompañía',
    desc: 'Empleados transferidos dentro de una misma empresa multinacional.',
    flag: '🏢',
  },
  {
    value: 'Green Card',
    label: 'Green Card — Residencia permanente',
    desc: 'Entrevista consular para residencia permanente en EE.UU.',
    flag: '🟢',
  },
  {
    value: 'J1',
    label: 'J1 — Intercambio',
    desc: 'Programas de intercambio cultural, investigación o enseñanza.',
    flag: '🌍',
  },
  {
    value: 'K1',
    label: 'K1 — Prometido/a',
    desc: 'Para comprometidos/as de ciudadanos estadounidenses.',
    flag: '💍',
  },
]

const NATIONALITIES = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba',
  'Ecuador', 'El Salvador', 'España', 'Guatemala', 'Honduras', 'México',
  'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'República Dominicana', 'Uruguay',
  'Venezuela', 'Otro',
]

const DIFFICULTIES = [
  {
    value: 'Basic',
    label: 'Básico',
    desc: 'Oficial cordial, preguntas estándar y directas.',
    bars: 1,
  },
  {
    value: 'Intermediate',
    label: 'Intermedio',
    desc: 'Profesional y detallado, pide más evidencia.',
    bars: 2,
  },
  {
    value: 'Advanced',
    label: 'Avanzado',
    desc: 'Escéptico y exigente, presiona con preguntas difíciles.',
    bars: 3,
  },
]

const DiffIcon = ({ bars }) => (
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <rect x="0.5"  y="9.5"  width="4" height="6"  rx="1" stroke="currentColor" strokeWidth="1.5" fill={bars >= 1 ? 'currentColor' : 'none'} fillOpacity={bars >= 1 ? 0.85 : 0} />
    <rect x="7.5"  y="5.5"  width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill={bars >= 2 ? 'currentColor' : 'none'} fillOpacity={bars >= 2 ? 0.85 : 0} />
    <rect x="14.5" y="0.5"  width="4" height="15" rx="1" stroke="currentColor" strokeWidth="1.5" fill={bars >= 3 ? 'currentColor' : 'none'} fillOpacity={bars >= 3 ? 0.85 : 0} />
  </svg>
)

const IntervyouIcon = () => (
  <img src="/logo.png" alt="intervyou" style={{ height: 48, width: 'auto' }} />
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
      <span className="rc-desc">{desc}</span>
    </div>
  </button>
)

export default function VisaSetupForm({ onSubmit, onBack }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    visaType: '',
    nationality: '',
    difficulty: 'Intermediate',
  })

  const step1Valid = form.visaType && form.nationality

  const handleSubmit = async (e) => {
    e.preventDefault()
    unlockAudio()
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      // SpeechRecognition maneja el error
    }
    onSubmit({ ...form, interviewType: 'Visa', language: 'Spanish' })
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

          {/* ── Paso 1 ── */}
          {step === 1 && (
            <>
              <div className="sf-heading">
                <h1>¿Qué visa querés<br />practicar?</h1>
                <p style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>
                  Simulá una entrevista consular real para ingresar a Estados Unidos.
                </p>
              </div>

              <div className="sf-fields">
                <div className="sf-field">
                  <label>Tipo de visa</label>
                  <div className="sf-cards-row" style={{ flexDirection: 'column', gap: 8 }}>
                    {VISA_TYPES.map((v) => (
                      <RadioCard
                        key={v.value}
                        active={form.visaType === v.value}
                        label={v.label}
                        desc={v.desc}
                        flag={v.flag}
                        onClick={() => setForm((f) => ({ ...f, visaType: v.value }))}
                        wide
                      />
                    ))}
                  </div>
                </div>

                <div className="sf-field" style={{ marginTop: 8 }}>
                  <label>Tu nacionalidad</label>
                  <select
                    value={form.nationality}
                    onChange={(e) => setForm((f) => ({ ...f, nationality: e.target.value }))}
                  >
                    <option value="">Seleccioná…</option>
                    {NATIONALITIES.map((n) => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <div className="sf-footer">
                <div />
                <button
                  type="button"
                  className="sf-next"
                  onClick={() => setStep(2)}
                  disabled={!step1Valid}
                  data-track="visa_setup_step1_continued"
                >
                  Continuar →
                </button>
              </div>
            </>
          )}

          {/* ── Paso 2 ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="sf-heading">
                <h1>¿Cómo querés que<br />sea el oficial?</h1>
                <p style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>
                  El oficial de visa adoptará el tono según la dificultad elegida.
                </p>
              </div>

              <div className="sf-fields sf-fields--step2">
                <div className="sf-field">
                  <label>Visa seleccionada</label>
                  <div style={{
                    padding: '12px 16px',
                    background: '#f3f4f6',
                    borderRadius: 10,
                    fontSize: 14,
                    color: '#374151',
                    fontWeight: 500,
                  }}>
                    {VISA_TYPES.find((v) => v.value === form.visaType)?.label}
                  </div>
                </div>

                <div className="sf-field">
                  <label>Dificultad del oficial</label>
                  <div className="sf-cards-row">
                    {DIFFICULTIES.map((d) => (
                      <RadioCard
                        key={d.value}
                        active={form.difficulty === d.value}
                        label={d.label}
                        desc={d.desc}
                        icon={<DiffIcon bars={d.bars} />}
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
                <button type="submit" className="sf-next" data-track="visa_interview_started">
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
