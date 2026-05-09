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

// URLs directas (Wikipedia Wikimedia — muy estables)
const W = 'https://upload.wikimedia.org/wikipedia/commons/thumb'
const LOGOS = {
  mercadolibre: `${W}/f/f3/Mercado_Libre_Logo.svg/200px-Mercado_Libre_Logo.svg.png`,
  amazon:        `${W}/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png`,
  google:        `${W}/2/2f/Google_2015_logo.svg/272px-Google_2015_logo.svg.png`,
  microsoft:     `${W}/4/44/Microsoft_logo.svg/200px-Microsoft_logo.svg.png`,
  apple:         `${W}/f/fa/Apple_logo_black.svg/100px-Apple_logo_black.svg.png`,
  meta:          `${W}/7/7b/Meta_Platforms_Inc._logo.svg/200px-Meta_Platforms_Inc._logo.svg.png`,
  nubank:        `${W}/1/17/Nubank_logo_2021.svg/200px-Nubank_logo_2021.svg.png`,
  latam:         `${W}/6/62/LATAM_Airlines_logo_2015.svg/200px-LATAM_Airlines_logo_2015.svg.png`,
  santander:     `${W}/b/b8/Banco_Santander_Logotipo.svg/200px-Banco_Santander_Logotipo.svg.png`,
  bbva:          `${W}/a/ae/BBVA_2019.svg/200px-BBVA_2019.svg.png`,
  rappi:         `${W}/c/c9/Rappi_logo.svg/200px-Rappi_logo.svg.png`,
  falabella:     `${W}/2/25/Falabella.svg/200px-Falabella.svg.png`,
  pedidosya:     `${W}/6/67/PedidosYa_logo.svg/200px-PedidosYa_logo.svg.png`,
  despegar:      `${W}/3/3e/Despegar_logo.svg/200px-Despegar_logo.svg.png`,
  uala:          `${W}/4/43/Ual%C3%A1_logo.svg/200px-Ual%C3%A1_logo.svg.png`,
  galicia:       `${W}/4/4e/Logo_Banco_Galicia.svg/200px-Logo_Banco_Galicia.svg.png`,
  vodafone:      `${W}/a/a6/Vodafone_icon.svg/100px-Vodafone_icon.svg.png`,
  bancolombia:   `${W}/6/6e/Bancolombia_logo.svg/200px-Bancolombia_logo.svg.png`,
  itau:          `${W}/8/8b/Banco_Ita%C3%BA_logo.svg/200px-Banco_Ita%C3%BA_logo.svg.png`,
  ifood:         `${W}/9/9e/IFood_logo.svg/200px-IFood_logo.svg.png`,
  bimbo:         `${W}/5/56/Bimbo-logo.svg/200px-Bimbo-logo.svg.png`,
  cemex:         `${W}/7/72/Cemex-logo-new.svg/200px-Cemex-logo-new.svg.png`,
  telefonica:    `${W}/8/87/Telef%C3%B3nica_logo.svg/200px-Telef%C3%B3nica_logo.svg.png`,
  inditex:       `${W}/b/b7/Inditex_logo.svg/200px-Inditex_logo.svg.png`,
  hsbc:          `${W}/a/aa/HSBC_logo_%282018%29.svg/200px-HSBC_logo_%282018%29.svg.png`,
}

const COUNTRY_LOGOS = {
  AR: [
    { name: 'Mercado Libre', src: LOGOS.mercadolibre },
    { name: 'Amazon',        src: LOGOS.amazon       },
    { name: 'Galicia',       src: LOGOS.galicia      },
    { name: 'Ualá',          src: LOGOS.uala         },
    { name: 'Despegar',      src: LOGOS.despegar     },
  ],
  BR: [
    { name: 'Nubank',  src: LOGOS.nubank  },
    { name: 'iFood',   src: LOGOS.ifood   },
    { name: 'Itaú',    src: LOGOS.itau    },
    { name: 'Amazon',  src: LOGOS.amazon  },
  ],
  MX: [
    { name: 'Bimbo',     src: LOGOS.bimbo     },
    { name: 'Cemex',     src: LOGOS.cemex     },
    { name: 'Amazon',    src: LOGOS.amazon    },
    { name: 'Microsoft', src: LOGOS.microsoft },
  ],
  CO: [
    { name: 'Bancolombia', src: LOGOS.bancolombia },
    { name: 'Rappi',       src: LOGOS.rappi       },
    { name: 'Falabella',   src: LOGOS.falabella   },
    { name: 'Amazon',      src: LOGOS.amazon      },
  ],
  CL: [
    { name: 'Falabella', src: LOGOS.falabella },
    { name: 'LATAM',     src: LOGOS.latam     },
    { name: 'Rappi',     src: LOGOS.rappi     },
    { name: 'Amazon',    src: LOGOS.amazon    },
  ],
  PE: [
    { name: 'LATAM',     src: LOGOS.latam     },
    { name: 'Falabella', src: LOGOS.falabella },
    { name: 'Rappi',     src: LOGOS.rappi     },
    { name: 'Amazon',    src: LOGOS.amazon    },
  ],
  UY: [
    { name: 'Mercado Libre', src: LOGOS.mercadolibre },
    { name: 'LATAM',         src: LOGOS.latam        },
    { name: 'Pedidos Ya',    src: LOGOS.pedidosya    },
    { name: 'Amazon',        src: LOGOS.amazon       },
  ],
  ES: [
    { name: 'Santander',  src: LOGOS.santander  },
    { name: 'BBVA',       src: LOGOS.bbva       },
    { name: 'Telefónica', src: LOGOS.telefonica },
    { name: 'Inditex',    src: LOGOS.inditex    },
  ],
  US: [
    { name: 'Google',    src: LOGOS.google    },
    { name: 'Amazon',    src: LOGOS.amazon    },
    { name: 'Microsoft', src: LOGOS.microsoft },
    { name: 'Apple',     src: LOGOS.apple     },
    { name: 'Meta',      src: LOGOS.meta      },
  ],
  GB: [
    { name: 'HSBC',      src: LOGOS.hsbc      },
    { name: 'Vodafone',  src: LOGOS.vodafone  },
    { name: 'Amazon',    src: LOGOS.amazon    },
    { name: 'Microsoft', src: LOGOS.microsoft },
  ],
  DEFAULT: [
    { name: 'Google',    src: LOGOS.google    },
    { name: 'Amazon',    src: LOGOS.amazon    },
    { name: 'Microsoft', src: LOGOS.microsoft },
    { name: 'Meta',      src: LOGOS.meta      },
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
        <div className="up-plan-badge-top" style={{ marginBottom: 10 }}><IconStar /> MÁS ELEGIDO</div>
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
      </div>
    </div>
  )
}

function LogoImg({ name, src }) {
  const [failed, setFailed] = useState(false)
  if (failed || !src) {
    return (
      <div className="up-logo-pill">
        <span className="up-logo-pill-letter">{name[0]}</span>
        <span className="up-logo-pill-name">{name}</span>
      </div>
    )
  }
  return (
    <img
      src={src}
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
          <div key={l.name} className="up-logo-item">
            <LogoImg name={l.name} src={l.src} />
          </div>
        ))}
      </div>
    </div>
  )
}

const IconCoupon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)

function CouponField({ onApply, onDismiss, appliedCoupon, couponError }) {
  const [value, setValue] = useState('')

  const handleApply = () => {
    onApply(value.trim().toUpperCase())
  }

  if (appliedCoupon) {
    const info = VALID_COUPONS[appliedCoupon]
    return (
      <div className="up-coupon-applied">
        <button className="up-coupon-dismiss" onClick={onDismiss} aria-label="Quitar cupón">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <IconCoupon />
        <span>Cupón <strong>{appliedCoupon}</strong> aplicado — {info.label}</span>
      </div>
    )
  }

  return (
    <div className="up-coupon-row">
      <div className="up-coupon-input-wrap">
        <IconCoupon />
        <input
          className={`up-coupon-input${couponError ? ' up-coupon-input--error' : ''}`}
          placeholder="Código de cupón"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleApply()}
          maxLength={20}
        />
      </div>
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
              onDismiss={() => { setAppliedCoupon(null); setCouponError(null) }}
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
