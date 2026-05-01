import { PlanCards, ProFeatureList } from './UpgradeModal'

const IconBolt = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const IconTarget = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)
const IconTrophy = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="11"/>
    <path d="M7 4H4a2 2 0 0 0-2 2v2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V6a2 2 0 0 0-2-2h-3"/>
    <rect x="7" y="2" width="10" height="9" rx="1"/>
  </svg>
)
const IconLock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

export default function PricingPage({ onSelectPlan }) {
  return (
    <div className="pricing-page">
      <div className="pricing-inner">

        {/* Izquierda */}
        <div className="pricing-left">
          <h1 className="pricing-headline">
            Entrená hoy.<br />
            Llegá mejor<br />
            <span className="pricing-headline-accent">preparado.</span>
          </h1>
          <p className="pricing-subtext">
            Desbloqueá entrevistas completas, feedback detallado y práctica sin límites.
          </p>

          <div className="pricing-benefits">
            <div className="pricing-benefit">
              <div className="pricing-benefit-icon"><IconBolt /></div>
              <span className="pricing-benefit-label">Respondé con más confianza</span>
            </div>
            <div className="pricing-benefit">
              <div className="pricing-benefit-icon"><IconTarget /></div>
              <span className="pricing-benefit-label">Feedback detallado en cada intento</span>
            </div>
            <div className="pricing-benefit">
              <div className="pricing-benefit-icon"><IconTrophy /></div>
              <span className="pricing-benefit-label">Llegá mejor preparado que el resto</span>
            </div>
          </div>

          <div className="pricing-free-box">
            <div className="pricing-free-box-title">Probaste 3 preguntas gratis</div>
            <div className="pricing-free-box-sub">Continuá con entrevistas completas y feedback avanzado.</div>
          </div>
        </div>

        {/* Derecha */}
        <div className="pricing-right">
          <PlanCards onSelectPlan={onSelectPlan} />

          <div className="pricing-features-section">
            <div className="pricing-features-title">Incluye todo esto:</div>
            <ProFeatureList />
          </div>

          <div className="pricing-trust-line">
            <IconLock /> Pago seguro con Mercado Pago y Stripe
          </div>
        </div>

      </div>
    </div>
  )
}
