import { useRef } from 'react'
import { track } from '../../lib/analytics'
import { getSimulationById } from '../../lib/simulations/catalog'

const DIFFICULTY_LABELS = { Basic: 'Básico', Intermediate: 'Intermedio', Advanced: 'Difícil' }
const LANGUAGE_LABELS   = { Spanish: 'Español', English: 'Inglés', Portuguese: 'Portugués' }

function FeedbackHeader() {
  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '16px 24px' }}>
      <img src="/logo.png" alt="CoachToWork" style={{ height: 32, width: 'auto', display: 'block' }} />
    </header>
  )
}

function FeedbackFooter() {
  return (
    <footer style={{ borderTop: '1px solid #E5E7EB', padding: '16px 24px', textAlign: 'center', fontSize: 12, color: '#9CA3AF' }}>
      <div style={{ marginBottom: 4 }}>CoachToWork — practicá conversaciones difíciles antes de tenerlas.</div>
      <a href="https://coachtowork.io" style={{ color: '#7C3AED', textDecoration: 'none' }}>coachtowork.io</a>
    </footer>
  )
}

const RING_SIZE = 160
const RING_RADIUS = 70
const RING_STROKE = 12

function ScoreRing({ score = 0 }) {
  const circumference = 2 * Math.PI * RING_RADIUS
  const dash = (Math.max(0, Math.min(1000, score)) / 1000) * circumference
  return (
    <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
      <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} fill="none" stroke="#F3F4F6" strokeWidth={RING_STROKE} />
      <circle
        cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS}
        fill="none" stroke="#7C3AED" strokeWidth={RING_STROKE}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 36, fontWeight: 700, fill: '#111827' }}>
        {Math.round(score)}
      </text>
      <text x="50%" y="64%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 11, fill: '#9CA3AF', letterSpacing: 1 }}>
        / 1000
      </text>
    </svg>
  )
}

function DimensionBar({ label, score, hint }) {
  const pct = Math.max(0, Math.min(1000, score || 0)) / 10
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{label}</span>
          {hint && <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 8 }}>{hint}</span>}
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#7C3AED' }}>{Math.round(score || 0)}</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: '#F3F4F6', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#7C3AED', borderRadius: 999, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 24, marginBottom: 16 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0, marginBottom: 16 }}>{title}</h2>
      {children}
    </section>
  )
}

function Chip({ children }) {
  return (
    <span style={{
      display: 'inline-block', padding: '6px 12px', borderRadius: 999,
      background: '#F5F3FF', color: '#6D28D9', fontSize: 12, fontWeight: 500,
      border: '1px solid #DDD6FE',
    }}>
      {children}
    </span>
  )
}

function ContextRow({ label, value }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#374151', padding: '6px 0' }}>
      <span style={{ minWidth: 140, color: '#9CA3AF' }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  )
}

export default function SimulationFeedback({ feedback, config, onRestart, onDashboard }) {
  const containerRef = useRef(null)
  const simulation = getSimulationById(config?.simulationId) || null

  const fb = feedback?.simulationFeedback || feedback || {}
  const generalScore = fb.general_score ?? fb.generalScore ?? 0
  const summary = fb.summary || ''
  const clarityScore = fb.clarity_score ?? fb.clarityScore ?? 0
  const emotionalScore = fb.emotional_score ?? fb.emotionalScore ?? 0
  const listeningScore = fb.listening_score ?? fb.listeningScore ?? 0
  const objectiveScore = fb.objective_score ?? fb.objectiveScore ?? 0
  const patterns = Array.isArray(fb.patterns) ? fb.patterns : []
  const strengths = Array.isArray(fb.strengths) ? fb.strengths : []
  const opportunities = Array.isArray(fb.opportunities) ? fb.opportunities : []
  const nextSteps = Array.isArray(fb.next_steps || fb.nextSteps) ? (fb.next_steps || fb.nextSteps) : []

  const handleDownload = async () => {
    track('simulation_feedback_pdf_downloaded', { simulation_id: simulation?.id })
    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')
      const canvas = await html2canvas(containerRef.current, {
        scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#F7F9FD', logging: false,
      })
      const imgData = canvas.toDataURL('image/png')
      const imgW = canvas.width
      const imgH = canvas.height
      const pdf = new jsPDF({
        orientation: imgW > imgH ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgW / 2, imgH / 2],
      })
      pdf.addImage(imgData, 'PNG', 0, 0, imgW / 2, imgH / 2)
      pdf.save(`simulacion-${simulation?.id || 'feedback'}.pdf`)
    } catch {
      window.print()
    }
  }

  // Empty / not-enough-data state
  void onRestart
  const notEnough = !!(fb.notEnoughData || fb.parseError)
  if (notEnough) {
    return (
      <div style={{ minHeight: '100vh', background: '#F7F9FD', display: 'flex', flexDirection: 'column', fontFamily: 'inherit' }}>
        <FeedbackHeader />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 32, maxWidth: 480, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏱</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0, marginBottom: 8 }}>
              Tu simulación fue muy corta
            </h2>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6, margin: 0, marginBottom: 24 }}>
              No tenemos suficiente conversación para evaluar tu desempeño. Para recibir feedback útil, intentá una sesión un poco más extendida — al menos 4 o 5 intercambios.
            </p>
            <button
              onClick={() => onDashboard && onDashboard()}
              style={{ padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: '#7C3AED', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Ir a inicio
            </button>
          </div>
        </main>
        <FeedbackFooter />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FD', display: 'flex', flexDirection: 'column', fontFamily: 'inherit' }}>
      <FeedbackHeader />
      <div ref={containerRef} style={{ maxWidth: 720, margin: '0 auto', width: '100%', padding: '24px 16px', flex: 1 }}>
        {/* Contexto */}
        <Section title="Contexto">
          <ContextRow label="Simulación" value={simulation?.title} />
          <ContextRow label="Categoría" value={simulation?.uiCopy?.interlocutorContext} />
          <ContextRow label="Dificultad" value={DIFFICULTY_LABELS[config?.difficulty] || config?.difficulty} />
          <ContextRow label="Idioma" value={LANGUAGE_LABELS[config?.language] || config?.language} />
        </Section>

        {/* Score general */}
        <Section title="Resultado general">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <ScoreRing score={generalScore} />
            <div style={{ flex: 1, minWidth: 240 }}>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: '#111827', margin: 0, fontWeight: 500 }}>
                {summary || 'Sesión completada.'}
              </p>
            </div>
          </div>
        </Section>

        {/* 4 dimensiones */}
        <Section title="Dimensiones evaluadas">
          <DimensionBar label="Claridad" score={clarityScore} hint="¿Se entiende lo que decís?" />
          <DimensionBar label="Manejo emocional" score={emotionalScore} hint="¿Sostenés la presión?" />
          <DimensionBar label="Escucha y adaptación" score={listeningScore} hint="¿Respondés lo preguntado?" />
          <DimensionBar label="Objetivo logrado" score={objectiveScore} hint="¿Llegaste a lo que querías?" />
        </Section>

        {/* Patrones */}
        {patterns.length > 0 && (
          <Section title="Patrones detectados">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {patterns.slice(0, 6).map((p, i) => <Chip key={i}>{p}</Chip>)}
            </div>
          </Section>
        )}

        {/* Fortalezas */}
        {strengths.length > 0 && (
          <Section title="Fortalezas destacadas">
            {strengths.slice(0, 3).map((s, i) => (
              <div key={i} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: i < Math.min(strengths.length, 3) - 1 ? '1px solid #F3F4F6' : 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#065F46', marginBottom: 4 }}>✓ {s.title}</div>
                <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{s.description}</div>
              </div>
            ))}
          </Section>
        )}

        {/* Oportunidades */}
        {opportunities.length > 0 && (
          <Section title="Oportunidades de mejora">
            {opportunities.slice(0, 3).map((o, i) => (
              <div key={i} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: i < Math.min(opportunities.length, 3) - 1 ? '1px solid #F3F4F6' : 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#92400E', marginBottom: 4 }}>→ {o.title}</div>
                <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{o.description}</div>
              </div>
            ))}
          </Section>
        )}

        {/* Qué hacer ahora */}
        {nextSteps.length > 0 && (
          <Section title="Qué hacer ahora">
            <ol style={{ paddingLeft: 20, margin: 0 }}>
              {nextSteps.slice(0, 4).map((step, i) => (
                <li key={i} style={{ fontSize: 14, color: '#111827', lineHeight: 1.6, marginBottom: 6 }}>{step}</li>
              ))}
            </ol>
          </Section>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
          <button
            onClick={handleDownload}
            style={{
              padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              background: '#7C3AED', color: '#fff', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            data-track="simulation_feedback_pdf_button_clicked"
          >
            Descargar PDF
          </button>
          {onDashboard && (
            <button
              onClick={() => onDashboard()}
              style={{
                padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                background: '#fff', color: '#374151', border: '1px solid #E5E7EB', cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Volver al inicio
            </button>
          )}
        </div>
      </div>
      <FeedbackFooter />
    </div>
  )
}
