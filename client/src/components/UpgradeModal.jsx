import { usePlan } from '../contexts/PlanContext'

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const IconBolt = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const IconTarget = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)
const IconTrophy = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="11"/>
    <path d="M7 4H4a2 2 0 0 0-2 2v2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V6a2 2 0 0 0-2-2h-3"/>
    <rect x="7" y="2" width="10" height="9" rx="1"/>
  </svg>
)
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconStar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconGift = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
)

const PRO_FEATURES = [
  'Todo lo del plan gratis',
  'Historial de entrevistas',
  'Entrevistas ilimitadas',
  'Descarga de feedback',
  'Entrevistas más largas',
  'Entrevistas en varios idiomas',
  'Preguntas basadas en tu perfil',
  'Y mucho más',
]

export function PlanCards({ onSelectPlan, selectedPlan, setSelectedPlan }) {
  const plan = selectedPlan || 'quarterly'
  const set = setSelectedPlan || (() => {})

  return (
    <div className="up-plans">
      {/* Mensual */}
      <div className={`up-plan-card ${plan === 'monthly' ? 'up-plan-card--selected' : ''}`}>
        <div className="up-plan-name">Mensual</div>
        <div className="up-plan-cancel">Cancelá cuando quieras.</div>
        <div className="up-plan-price">
          <span className="up-price-amount">USD 9,99</span>
          <span className="up-price-per">/mes</span>
        </div>
        <button
          className="up-plan-btn up-plan-btn--outline"
          onClick={() => { set('monthly'); onSelectPlan?.('monthly') }}
        >
          Elegir plan mensual
        </button>
      </div>

      {/* 3 meses */}
      <div className={`up-plan-card up-plan-card--featured ${plan === 'quarterly' ? 'up-plan-card--selected' : ''}`}>
        <div className="up-plan-badge-top">
          <IconStar /> MÁS ELEGIDO
        </div>
        <div className="up-plan-name">3 meses</div>
        <div className="up-plan-cancel">Preparate en serio y ahorrá.</div>
        <div className="up-plan-price">
          <span className="up-price-amount">USD 14,99</span>
          <span className="up-price-total">total</span>
        </div>
        <div className="up-plan-savings">
          <span className="up-savings-badge">50% DE AHORRO</span>
          <span className="up-savings-note">Equivale a USD 5,00/mes</span>
        </div>
        <button
          className="up-plan-btn up-plan-btn--filled"
          onClick={() => { set('quarterly'); onSelectPlan?.('quarterly') }}
        >
          Elegir plan de 3 meses
        </button>
      </div>
    </div>
  )
}

export function ProFeatureList() {
  return (
    <div className="up-features">
      {PRO_FEATURES.map(f => (
        <div key={f} className="up-feature-item">
          <IconCheck /> <span>{f}</span>
        </div>
      ))}
    </div>
  )
}

export function PaymentTrust() {
  return (
    <div className="up-trust">
      <div className="up-trust-item">
        <IconShield />
        <div>
          <div className="up-trust-title">Pago seguro y protegido</div>
          <div className="up-trust-sub">Tus datos y pagos están protegidos con encriptación de nivel bancario.</div>
        </div>
      </div>
      <div className="up-trust-logos">
        <span className="up-trust-label">Procesamos pagos a través de:</span>
        <div className="up-trust-providers">
          <span className="up-provider-mp">mercado<strong>pago</strong></span>
          <span className="up-provider-stripe">stripe</span>
        </div>
      </div>
    </div>
  )
}

export default function UpgradeModal() {
  const { closeUpgradeModal } = usePlan()

  const handleSelectPlan = (period) => {
    // TODO: integrar con Stripe/MP
    console.log('Plan seleccionado:', period)
  }

  return (
    <div className="up-overlay" onClick={closeUpgradeModal}>
      <div className="up-modal" onClick={e => e.stopPropagation()}>
        <button className="up-close" onClick={closeUpgradeModal}><IconClose /></button>

        <div className="up-modal-inner">
          {/* Columna izquierda: value prop */}
          <div className="up-left">
            <div className="up-eyebrow">
              <IconLock /> Desbloqueá tu potencial
            </div>
            <h2 className="up-headline">
              Entrená hoy.<br />
              Conseguí tu próximo<br />
              <span className="up-headline-accent">gran trabajo.</span>
            </h2>
            <p className="up-subtext">
              Practicá entrevistas reales, recibí feedback personalizado y llegá más preparado que nunca.
            </p>

            <div className="up-benefits">
              <div className="up-benefit">
                <div className="up-benefit-icon"><IconBolt /></div>
                <div>
                  <div className="up-benefit-title">Más confianza</div>
                  <div className="up-benefit-sub">Respondé con seguridad y claridad.</div>
                </div>
              </div>
              <div className="up-benefit">
                <div className="up-benefit-icon"><IconTarget /></div>
                <div>
                  <div className="up-benefit-title">Mejor rendimiento</div>
                  <div className="up-benefit-sub">Feedback detallado para mejorar en cada intento.</div>
                </div>
              </div>
              <div className="up-benefit">
                <div className="up-benefit-icon"><IconTrophy /></div>
                <div>
                  <div className="up-benefit-title">Más oportunidades</div>
                  <div className="up-benefit-sub">Estás más preparado para tu próximo trabajo.</div>
                </div>
              </div>
            </div>

            <div className="up-free-box">
              <div className="up-free-box-icon"><IconGift /></div>
              <div>
                <div className="up-free-box-title">Probaste 3 preguntas gratis</div>
                <div className="up-free-box-sub">Desbloqueá entrevistas completas y feedback detallado.</div>
                <button className="up-free-box-link">Ver qué incluye el plan Free →</button>
              </div>
            </div>
          </div>

          {/* Columna derecha: planes */}
          <div className="up-right">
            <PlanCards onSelectPlan={handleSelectPlan} />

            <div className="up-features-section">
              <div className="up-features-title">Todo lo que incluye el plan Free, y además:</div>
              <ProFeatureList />
            </div>

            <PaymentTrust />
          </div>
        </div>
      </div>
    </div>
  )
}
