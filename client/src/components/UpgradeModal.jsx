import { usePlan } from '../contexts/PlanContext'

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconBolt = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const IconTarget = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)
const IconTrophy = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="11"/>
    <path d="M7 4H4a2 2 0 0 0-2 2v2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V6a2 2 0 0 0-2-2h-3"/>
    <rect x="7" y="2" width="10" height="9" rx="1"/>
  </svg>
)
const IconStar = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconLock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const FEATURES = [
  'Todo lo del plan gratis',
  'Entrevistas ilimitadas',
  'Entrevistas más largas',
  'Preguntas basadas en tu perfil',
  'Historial de entrevistas',
  'Descarga de feedback',
  'Entrevistas en varios idiomas',
  'Y mucho más',
]

export function PlanCards({ onSelectPlan }) {
  return (
    <div className="up-plans">
      {/* 3 meses — dominante */}
      <div className="up-plan-card up-plan-card--featured">
        <div className="up-plan-badge-top"><IconStar /> MÁS ELEGIDO</div>
        <div className="up-plan-name">3 meses</div>
        <div className="up-plan-price">
          <span className="up-price-amount">USD 14,99</span>
          <span className="up-price-label">total</span>
        </div>
        <div className="up-plan-savings">
          <span className="up-savings-badge">50% DE AHORRO</span>
          <span className="up-savings-note">Equivale a USD 5,00/mes</span>
        </div>
        <button className="up-plan-btn up-plan-btn--filled" onClick={() => onSelectPlan?.('quarterly')}>
          Elegir plan de 3 meses
        </button>
      </div>

      {/* Mensual — secundario */}
      <div className="up-plan-card up-plan-card--secondary">
        <div className="up-plan-name up-plan-name--muted">Mensual</div>
        <div className="up-plan-price">
          <span className="up-price-amount up-price-amount--muted">USD 9,99</span>
          <span className="up-price-label">/mes</span>
        </div>
        <button className="up-plan-btn up-plan-btn--ghost" onClick={() => onSelectPlan?.('monthly')}>
          Elegir mensual
        </button>
      </div>
    </div>
  )
}

export function ProFeatureList() {
  return (
    <div className="up-features">
      {FEATURES.map(f => (
        <div key={f} className="up-feature-item">
          <IconCheck />
          <span>{f}</span>
        </div>
      ))}
    </div>
  )
}

export default function UpgradeModal() {
  const { closeUpgradeModal } = usePlan()

  return (
    <div className="up-overlay" onClick={closeUpgradeModal}>
      <div className="up-modal" onClick={e => e.stopPropagation()}>
        <button className="up-close" onClick={closeUpgradeModal}><IconClose /></button>

        <div className="up-modal-inner">
          {/* Izquierda */}
          <div className="up-left">
            <h2 className="up-headline">
              Entrená hoy.<br />
              Llegá mejor<br />
              <span className="up-headline-accent">preparado.</span>
            </h2>
            <p className="up-subtext">
              Desbloqueá entrevistas completas, feedback detallado y práctica sin límites.
            </p>

            <div className="up-benefits">
              <div className="up-benefit">
                <div className="up-benefit-icon"><IconBolt /></div>
                <span className="up-benefit-label">Respondé con más confianza</span>
              </div>
              <div className="up-benefit">
                <div className="up-benefit-icon"><IconTarget /></div>
                <span className="up-benefit-label">Feedback detallado en cada intento</span>
              </div>
              <div className="up-benefit">
                <div className="up-benefit-icon"><IconTrophy /></div>
                <span className="up-benefit-label">Llegá mejor preparado que el resto</span>
              </div>
            </div>

            <div className="up-free-box">
              <div className="up-free-box-title">Probaste 3 preguntas gratis</div>
              <div className="up-free-box-sub">Continuá con entrevistas completas y feedback avanzado.</div>
            </div>
          </div>

          {/* Derecha */}
          <div className="up-right">
            <PlanCards onSelectPlan={() => {}} />

            <div className="up-features-section">
              <div className="up-features-title">Incluye todo esto:</div>
              <ProFeatureList />
            </div>

            <div className="up-trust-line">
              <IconLock /> Pago seguro con Mercado Pago y Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
