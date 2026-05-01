const IconXCircle = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
)
const IconCard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
)
const IconBank = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22"/>
    <line x1="6" y1="18" x2="6" y2="11"/>
    <line x1="10" y1="18" x2="10" y2="11"/>
    <line x1="14" y1="18" x2="14" y2="11"/>
    <line x1="18" y1="18" x2="18" y2="11"/>
    <polygon points="12 2 20 7 4 7"/>
  </svg>
)
const IconHelp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

const STEPS = [
  {
    icon: <IconCard />,
    color: '#eff6ff',
    stroke: '#3b82f6',
    title: 'Verificá tus datos',
    desc: 'Revisá que los datos de tu tarjeta sean correctos y que tenga fondos suficientes.',
  },
  {
    icon: <IconBank />,
    color: '#fffbeb',
    stroke: '#d97706',
    title: 'Probá con otro método de pago',
    desc: 'Podés intentar con otra tarjeta o método de pago disponible.',
  },
  {
    icon: <IconHelp />,
    color: '#f0fdf4',
    stroke: '#16a34a',
    title: '¿Sigue sin funcionar?',
    desc: 'Contactanos y te ayudaremos a resolverlo.',
  },
]

export default function PaymentErrorPage({ onRetry, onHome }) {
  return (
    <div className="per-page">
      <div className="per-content">

        {/* Icono */}
        <div className="per-icon-wrap">
          <IconXCircle />
        </div>

        {/* Títulos */}
        <h1 className="per-title">No pudimos procesar tu pago</h1>
        <p className="per-subtitle">
          Hubo un problema al procesar tu pago.<br />
          No se realizó ningún cobro.
        </p>

        {/* Card de pasos */}
        <div className="per-card">
          <div className="per-card-title">Qué podés hacer ahora</div>
          <div className="per-steps">
            {STEPS.map(s => (
              <div key={s.title} className="per-step">
                <div className="per-step-icon" style={{ background: s.color, color: s.stroke }}>
                  {s.icon}
                </div>
                <div>
                  <div className="per-step-title">{s.title}</div>
                  <div className="per-step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <button className="per-btn-primary" onClick={onRetry}>
          Intentar nuevamente
        </button>
        <button className="per-btn-outline" onClick={onHome}>
          Volver al inicio
        </button>

        {/* Ayuda */}
        <div className="per-help">
          <span>¿Necesitás ayuda?</span>
          <a href="mailto:soporte@coachtowork.com" className="per-help-link">
            Escribinos a soporte@coachtowork.com
          </a>
        </div>

        {/* Logos */}
        <div className="per-logos">
          <div className="per-logos-item">
            <span className="per-logos-label">Pago seguro con</span>
            <span className="per-logo-stripe">stripe</span>
          </div>
          <div className="per-logos-divider" />
          <div className="per-logos-item">
            <span className="per-logo-mp">mercado<strong>pago</strong></span>
          </div>
        </div>

      </div>
    </div>
  )
}
