import { useEffect, useRef } from 'react'

const IconCheck = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconCheckCircle = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)
const IconInfinity = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z"/>
    <path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z"/>
  </svg>
)
const IconChart = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)
const IconBolt = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const IconTarget = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)

const CONFETTI_COLORS = ['#6366f1', '#a78bfa', '#f59e0b', '#22c55e', '#ec4899', '#3b82f6', '#f97316']

function useConfetti(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 80,
      r: 4 + Math.random() * 5,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 6,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
      w: 6 + Math.random() * 6,
      h: 3 + Math.random() * 4,
      opacity: 0.9 + Math.random() * 0.1,
    }))

    let frame
    let elapsed = 0
    const animate = () => {
      elapsed++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.vy += 0.04

        if (p.y > canvas.height + 20) {
          if (elapsed < 180) {
            p.y = -20
            p.x = Math.random() * canvas.width
            p.vy = 2 + Math.random() * 3
          } else {
            continue
          }
        }

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)

        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      frame = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])
}

const SUCCESS_FEATURES = [
  { icon: <IconInfinity />, color: '#d1fae5', stroke: '#059669', label: 'Entrevistas ilimitadas', sub: 'Practicá sin límites y mejorá cada día.' },
  { icon: <IconChart />,    color: '#dbeafe', stroke: '#2563eb', label: 'Feedback avanzado',      sub: 'Obtené análisis detallados y personalizados.' },
  { icon: <IconBolt />,     color: '#fef9c3', stroke: '#d97706', label: 'Recursos exclusivos',   sub: 'Accedé a plantillas, guías y mucho más.' },
  { icon: <IconTarget />,   color: '#e0e7ff', stroke: '#4f46e5', label: 'Alcanzá tus objetivos', sub: 'Seguimiento y herramientas para tu crecimiento.' },
]

export default function PaymentSuccessPage({ onStart, onHome }) {
  const canvasRef = useRef(null)
  useConfetti(canvasRef)

  return (
    <div className="psp-page">
      <canvas ref={canvasRef} className="psp-confetti" />

      <div className="psp-content">
        <div className="psp-crown-wrap">
          <div className="psp-crown">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 20h20v2H2zM3 8l4 8h10l4-8-5 3-4-6-4 6z"/>
            </svg>
          </div>
          <div className="psp-check-badge">
            <IconCheck />
          </div>
        </div>

        <div className="psp-status-badge">
          <IconCheckCircle /> Pago exitoso
        </div>

        <h1 className="psp-title">¡Bienvenido a Pro! 🎉</h1>
        <p className="psp-subtitle">
          Tu plan se activó correctamente.<br />
          Ya tenés acceso a todas las funcionalidades premium.
        </p>

        <div className="psp-features">
          {SUCCESS_FEATURES.map(f => (
            <div key={f.label} className="psp-feature">
              <div className="psp-feature-icon" style={{ background: f.color, color: f.stroke }}>
                {f.icon}
              </div>
              <div className="psp-feature-label">{f.label}</div>
              <div className="psp-feature-sub">{f.sub}</div>
            </div>
          ))}
        </div>

        <button className="psp-btn-primary" onClick={onStart}>
          Comenzar ahora →
        </button>
        <button className="psp-btn-ghost" onClick={onHome}>
          Ir al inicio
        </button>
      </div>
    </div>
  )
}
