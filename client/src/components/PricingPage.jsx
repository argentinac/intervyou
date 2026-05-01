import { useState } from 'react'
import { PlanCards, PaymentTrust } from './UpgradeModal'

const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const IconBolt = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const IconTarget = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)
const IconTrophy = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="11"/>
    <path d="M7 4H4a2 2 0 0 0-2 2v2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V6a2 2 0 0 0-2-2h-3"/>
    <rect x="7" y="2" width="10" height="9" rx="1"/>
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
const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconInfinity = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z"/>
    <path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z"/>
  </svg>
)
const IconDownload = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconGlobe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)
const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconSparkle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.5 5h5l-4 3 1.5 5-4-3-4 3 1.5-5-4-3h5z"/>
  </svg>
)
const IconHistory = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
  </svg>
)
const IconCheckCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)
const IconCancelAnytime = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
)

const DETAILED_FEATURES = [
  { icon: <IconInfinity />, title: 'Entrevistas ilimitadas', desc: 'Practicá todo lo que necesites.' },
  { icon: <IconDownload />, title: 'Descarga de feedback', desc: 'Guardá tu feedback detallado en PDF.' },
  { icon: <IconClock />, title: 'Entrevistas más largas', desc: 'Simulaciones completas como en la vida real.' },
  { icon: <IconGlobe />, title: 'Entrevistas en varios idiomas', desc: 'Practicá en el idioma que necesites.' },
  { icon: <IconUser />, title: 'Preguntas basadas en tu perfil', desc: 'Más relevantes para tu experiencia y objetivos.' },
  { icon: <IconSparkle />, title: 'Y mucho más', desc: 'Nuevas funcionalidades pensadas para tu éxito.' },
  { icon: <IconHistory />, title: 'Historial de entrevistas', desc: 'Revisá tu progreso y volvé sobre tus respuestas.' },
]

export default function PricingPage({ onSelectPlan }) {
  const [selectedPlan, setSelectedPlan] = useState('quarterly')

  const handleSelectPlan = (period) => {
    setSelectedPlan(period)
    onSelectPlan?.(period)
  }

  return (
    <div className="pricing-page">
      <div className="pricing-inner">
        {/* Columna izquierda */}
        <div className="pricing-left">
          <div className="pricing-eyebrow">
            <IconLock /> Desbloqueá tu potencial
          </div>

          <h1 className="pricing-headline">
            Entrená hoy.<br />
            Conseguí tu próximo<br />
            <span className="pricing-headline-accent">gran trabajo.</span>
          </h1>

          <p className="pricing-subtext">
            Practicá entrevistas reales, recibí feedback personalizado y llegá más preparado que nunca.
          </p>

          <div className="pricing-benefits">
            <div className="pricing-benefit">
              <div className="pricing-benefit-icon"><IconBolt /></div>
              <div>
                <div className="pricing-benefit-title">Más confianza</div>
                <div className="pricing-benefit-sub">Respondé con seguridad y claridad.</div>
              </div>
            </div>
            <div className="pricing-benefit">
              <div className="pricing-benefit-icon"><IconTarget /></div>
              <div>
                <div className="pricing-benefit-title">Mejor rendimiento</div>
                <div className="pricing-benefit-sub">Feedback detallado para mejorar en cada intento.</div>
              </div>
            </div>
            <div className="pricing-benefit">
              <div className="pricing-benefit-icon"><IconTrophy /></div>
              <div>
                <div className="pricing-benefit-title">Mejores oportunidades</div>
                <div className="pricing-benefit-sub">Destacá y conseguí tu próximo trabajo.</div>
              </div>
            </div>
          </div>

          <div className="pricing-free-box">
            <div className="pricing-free-box-icon"><IconGift /></div>
            <div>
              <div className="pricing-free-box-title">Probaste 3 preguntas gratis</div>
              <div className="pricing-free-box-sub">Desbloqueá entrevistas completas y feedback detallado.</div>
              <button className="pricing-free-box-link">Ver qué incluye el plan Free →</button>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="pricing-right">
          <PlanCards onSelectPlan={handleSelectPlan} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} />

          <div className="pricing-features-section">
            <div className="pricing-features-title">Todo lo que incluye el plan Free, y además:</div>
            <div className="pricing-features-grid">
              {DETAILED_FEATURES.map(f => (
                <div key={f.title} className="pricing-feature-item">
                  <div className="pricing-feature-icon">{f.icon}</div>
                  <div>
                    <div className="pricing-feature-name">
                      {f.title} <IconCheckCircle />
                    </div>
                    <div className="pricing-feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer de confianza */}
      <div className="pricing-footer">
        <div className="pricing-footer-item">
          <div className="pricing-footer-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div>
            <div className="pricing-footer-title">Pago seguro y protegido</div>
            <div className="pricing-footer-sub">Tus datos y pagos están protegidos con encriptación de nivel bancario.</div>
          </div>
        </div>

        <div className="pricing-footer-item">
          <span className="pricing-footer-label">Procesamos pagos a través de:</span>
          <div className="up-trust-providers">
            <span className="up-provider-mp">mercado<strong>pago</strong></span>
            <span className="up-provider-stripe">stripe</span>
          </div>
        </div>

        <div className="pricing-footer-item">
          <div className="pricing-footer-icon">
            <IconCancelAnytime />
          </div>
          <div>
            <div className="pricing-footer-title">Cancelá cuando quieras</div>
            <div className="pricing-footer-sub">Sin cargos ocultos. Sin permanencia. Cancelá en cualquier momento.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
