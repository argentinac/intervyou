import { useState } from 'react'
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

// Códigos de cupón válidos (se validan también en backend al hacer checkout)
const VALID_COUPONS = {
  'COACH50':     { pct: 50, label: '50% OFF' },
  'BIENVENIDO':  { pct: 20, label: '20% OFF' },
  'LAUNCH30':    { pct: 30, label: '30% OFF' },
}

// Logos de empresas top por país
const COUNTRY_LOGOS = {
  AR: [
    { name: 'Mercado Libre', domain: 'mercadolibre.com' },
    { name: 'Galicia',       domain: 'galicia.com.ar'   },
    { name: 'Ualá',          domain: 'uala.com.ar'      },
    { name: 'Naranja X',     domain: 'naranjax.com'     },
    { name: 'Despegar',      domain: 'despegar.com'     },
  ],
  BR: [
    { name: 'Nubank',          domain: 'nubank.com.br'      },
    { name: 'iFood',           domain: 'ifood.com.br'       },
    { name: 'Itaú',            domain: 'itau.com.br'        },
    { name: 'Magazine Luiza',  domain: 'magazineluiza.com.br'},
  ],
  MX: [
    { name: 'Bimbo',     domain: 'grupobimbo.com' },
    { name: 'Cemex',     domain: 'cemex.com'      },
    { name: 'Televisa',  domain: 'televisa.com'   },
    { name: 'Soriana',   domain: 'soriana.com'    },
  ],
  CO: [
    { name: 'Bancolombia', domain: 'bancolombia.com'    },
    { name: 'Rappi',       domain: 'rappi.com'          },
    { name: 'Ecopetrol',   domain: 'ecopetrol.com.co'   },
    { name: 'Falabella',   domain: 'falabella.com.co'   },
  ],
  CL: [
    { name: 'Falabella',    domain: 'falabella.com'   },
    { name: 'Ripley',       domain: 'ripley.com'      },
    { name: 'LATAM',        domain: 'latam.com'       },
    { name: 'BancoEstado',  domain: 'bancoestado.cl'  },
  ],
  PE: [
    { name: 'BCP',       domain: 'viabcp.com'       },
    { name: 'Interbank', domain: 'interbank.com.pe'  },
    { name: 'Backus',    domain: 'backus.com.pe'     },
    { name: 'Gloria',    domain: 'grupogloria.com'   },
  ],
  UY: [
    { name: 'Antel',   domain: 'antel.com.uy'   },
    { name: 'ANCAP',   domain: 'ancap.com.uy'   },
    { name: 'Abitab',  domain: 'abitab.com.uy'  },
    { name: 'OCA',     domain: 'oca.com.uy'     },
  ],
  ES: [
    { name: 'Santander', domain: 'santander.com' },
    { name: 'BBVA',      domain: 'bbva.com'      },
    { name: 'Telefónica',domain: 'telefonica.com'},
    { name: 'Inditex',   domain: 'inditex.com'  },
  ],
  US: [
    { name: 'Google',    domain: 'google.com'    },
    { name: 'Amazon',    domain: 'amazon.com'    },
    { name: 'Microsoft', domain: 'microsoft.com' },
    { name: 'Apple',     domain: 'apple.com'     },
    { name: 'Meta',      domain: 'meta.com'      },
  ],
  GB: [
    { name: 'HSBC',        domain: 'hsbc.com'        },
    { name: 'BP',          domain: 'bp.com'          },
    { name: 'Unilever',    domain: 'unilever.com'    },
    { name: 'Vodafone',    domain: 'vodafone.com'    },
  ],
  DEFAULT: [
    { name: 'Google',    domain: 'google.com'    },
    { name: 'Amazon',    domain: 'amazon.com'    },
    { name: 'Microsoft', domain: 'microsoft.com' },
    { name: 'Apple',     domain: 'apple.com'     },
  ],
}

const MP_COUNTRIES = new Set(['AR', 'BR', 'MX', 'CO', 'CL', 'PE', 'UY'])

const FEATURES_LEFT = [
  'Plan completo',
  'Entrevistas ilimitadas',
  'Feedback detallado',
  'Preguntas por rol',
]
const FEATURES_RIGHT = [
  'Historial',
  'Descargas',
]

function applyDiscount(price, pct) {
  // price is like "ARS 14.900" or "USD 14,99"
  return price // we handle display separately
}

function discountedPrices(prices, pct) {
  const factor = 1 - pct / 100
  const isARS = prices.quarterly.startsWith('ARS')
  if (isARS) {
    const qRaw = parseFloat(prices.quarterly.replace('ARS ', '').replace('.', '').replace(',', '.'))
    const mRaw = parseFloat(prices.monthly.replace('ARS ', '').replace('.', '').replace(',', '.'))
    const fmt = n => 'ARS ' + Math.round(n).toLocaleString('es-AR')
    const qNew = Math.ceil((qRaw * factor) / 100) * 100
    const mNew = Math.ceil((mRaw * factor) / 100) * 100
    return {
      quarterly: fmt(qNew),
      monthly: fmt(mNew),
      quarterlyNote: `Aprox. ${fmt(Math.round(qNew / 3))}/mes`,
    }
  } else {
    const qRaw = parseFloat(prices.quarterly.replace('USD ', '').replace(',', '.'))
    const mRaw = parseFloat(prices.monthly.replace('USD ', '').replace(',', '.'))
    const fmt = n => 'USD ' + n.toFixed(2).replace('.', ',')
    return {
      quarterly: fmt(qRaw * factor),
      monthly: fmt(mRaw * factor),
      quarterlyNote: `Equivale a USD ${(qRaw * factor / 3).toFixed(2).replace('.', ',')}/mes`,
    }
  }
}

export function PlanCards({ onSelectPlan, loadingPeriod, processor, coupon }) {
  const isMP = processor === 'mercadopago'
  const basePrices = isMP
    ? { quarterly: 'ARS 14.900', quarterlyNote: 'Aprox. ARS 4.967/mes', monthly: 'ARS 9.900' }
    : { quarterly: 'USD 14,99',  quarterlyNote: 'Equivale a USD 5,00/mes', monthly: 'USD 9,99' }

  const discount = coupon ? VALID_COUPONS[coupon] : null
  const prices = discount ? { ...basePrices, ...discountedPrices(basePrices, discount.pct) } : basePrices

  return (
    <div className="up-plans">
      {/* 3 meses — dominante */}
      <div className="up-plan-card up-plan-card--featured">
        <div className="up-plan-card-header">
          <div className="up-plan-badge-top"><IconStar /> MÁS ELEGIDO</div>
          <div className="up-plan-radio up-plan-radio--active" />
        </div>
        <div className="up-plan-name">3 meses</div>
        <div className="up-plan-price">
          {discount && (
            <span className="up-price-original">{basePrices.quarterly}</span>
          )}
          <span className="up-price-amount">{prices.quarterly}</span>
          <span className="up-price-label">cada 3 meses</span>
        </div>
        <div className="up-plan-savings">
          {discount
            ? <><span className="up-savings-badge">{discount.label}</span><span className="up-savings-note">con tu cupón · {prices.quarterlyNote}</span></>
            : <><span className="up-savings-badge">50% OFF</span><span className="up-savings-note">{prices.quarterlyNote}</span></>
          }
        </div>
        <button className="up-plan-btn up-plan-btn--filled" disabled={!!loadingPeriod} onClick={() => onSelectPlan?.('quarterly', coupon)}>
          {loadingPeriod === 'quarterly' ? 'Procesando...' : 'Elegir plan de 3 meses'}
        </button>
      </div>

      {/* Mensual — secundario */}
      <div className="up-plan-card up-plan-card--secondary">
        <div style={{ flex: 1 }}>
          <div className="up-plan-name up-plan-name--muted">Mensual</div>
          <div className="up-plan-price">
            {discount && (
              <span className="up-price-original up-price-original--sm">{basePrices.monthly}</span>
            )}
            <span className="up-price-amount up-price-amount--muted">{prices.monthly}</span>
            <span className="up-price-label">/mes</span>
          </div>
        </div>
        <button className="up-plan-btn up-plan-btn--ghost" disabled={!!loadingPeriod} onClick={() => onSelectPlan?.('monthly', coupon)}>
          {loadingPeriod === 'monthly' ? 'Procesando...' : 'Elegir mensual'}
        </button>
        <div className="up-plan-radio" />
      </div>
    </div>
  )
}

function LogoImg({ name, domain }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="up-logo-pill">
        <span className="up-logo-pill-letter">{name[0]}</span>
        <span className="up-logo-pill-name">{name}</span>
      </div>
    )
  }
  return (
    <img
      src={`https://logo.clearbit.com/${domain}?size=80`}
      alt={name}
      className="up-logo-img"
      onError={() => setFailed(true)}
    />
  )
}

function CompanyLogos({ country }) {
  const logos = COUNTRY_LOGOS[country] || COUNTRY_LOGOS.DEFAULT
  return (
    <div className="up-logos-section">
      <div className="up-logos-title">Preparación para empresas líderes</div>
      <div className="up-logos-grid">
        {logos.map(l => (
          <div key={l.domain} className="up-logo-item">
            <LogoImg name={l.name} domain={l.domain} />
          </div>
        ))}
      </div>
    </div>
  )
}

function CouponField({ onApply, appliedCoupon, couponError }) {
  const [value, setValue] = useState('')

  const handleApply = () => {
    onApply(value.trim().toUpperCase())
  }

  if (appliedCoupon) {
    const info = VALID_COUPONS[appliedCoupon]
    return (
      <div className="up-coupon-applied">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Cupón <strong>{appliedCoupon}</strong> aplicado — {info.label}</span>
      </div>
    )
  }

  return (
    <div className="up-coupon-row">
      <input
        className={`up-coupon-input${couponError ? ' up-coupon-input--error' : ''}`}
        placeholder="Código de cupón"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleApply()}
        maxLength={20}
      />
      <button className="up-coupon-btn" onClick={handleApply} disabled={!value.trim()}>
        Aplicar
      </button>
      {couponError && <div className="up-coupon-error">{couponError}</div>}
    </div>
  )
}

export function ProFeatureList() {
  return (
    <div className="up-features">
      {[...FEATURES_LEFT, ...FEATURES_RIGHT].map(f => (
        <div key={f} className="up-feature-item">
          <IconCheck />
          <span>{f}</span>
        </div>
      ))}
    </div>
  )
}

export default function UpgradeModal() {
  const { closeUpgradeModal, startCheckout, checkoutLoading, checkoutError, processor, country } = usePlan()
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState(null)

  const isMP = MP_COUNTRIES.has(country)

  const handleApplyCoupon = (code) => {
    if (!code) return
    if (VALID_COUPONS[code]) {
      setAppliedCoupon(code)
      setCouponError(null)
    } else {
      setCouponError('Código inválido o expirado')
      setAppliedCoupon(null)
    }
  }

  const handleSelectPlan = (period) => {
    startCheckout(period, appliedCoupon)
  }

  return (
    <div className="up-overlay" onClick={closeUpgradeModal}>
      <div className="up-modal" onClick={e => e.stopPropagation()}>
        <button className="up-close" onClick={closeUpgradeModal}><IconClose /></button>

        <div className="up-modal-inner">
          {/* Izquierda */}
          <div className="up-left">
            <h2 className="up-headline">
              Entrená hoy.<br />
              Llegá <span className="up-headline-accent">mejor preparado.</span>
            </h2>
            <p className="up-subtext">
              Practicá entrevistas. Recibí feedback. Mejorá cada día.
            </p>

            <div className="up-benefits">
              <div className="up-benefit">
                <div className="up-benefit-icon"><IconBolt /></div>
                <span className="up-benefit-label">Más confianza</span>
              </div>
              <div className="up-benefit">
                <div className="up-benefit-icon"><IconTarget /></div>
                <span className="up-benefit-label">Feedback preciso</span>
              </div>
              <div className="up-benefit">
                <div className="up-benefit-icon"><IconTrophy /></div>
                <span className="up-benefit-label">Mejor preparado</span>
              </div>
            </div>

            <CompanyLogos country={country} />
          </div>

          {/* Derecha */}
          <div className="up-right">
            <PlanCards
              onSelectPlan={handleSelectPlan}
              loadingPeriod={checkoutLoading}
              processor={processor}
              coupon={appliedCoupon}
            />

            {checkoutError && (
              <div className="up-checkout-error">{checkoutError}</div>
            )}

            <div className="up-features-section">
              <div className="up-features-title">INCLUYE TODO ESTO</div>
              <ProFeatureList />
            </div>

            <CouponField
              onApply={handleApplyCoupon}
              appliedCoupon={appliedCoupon}
              couponError={couponError}
            />

            <div className="up-trust-line">
              <IconLock />
              {isMP
                ? 'Pago seguro con Mercado Pago'
                : 'Pago seguro con Stripe'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
