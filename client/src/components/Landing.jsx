import { useEffect, useRef, useState } from 'react'
import BlogSection from './BlogSection'
import { COUNTRY_LOGOS, COUNTRY_NAMES } from '../utils/countryLogos'

// ── Hooks ───────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function useCounter(target, visible, duration = 1800) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!visible) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const pct = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - pct, 3)
      setVal(Math.floor(eased * target))
      if (pct < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [visible, target, duration])
  return val
}

// ── Icons ───────────────────────────────────────────────────

const IconMic = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="8" y1="22" x2="16" y2="22"/>
  </svg>
)
const IconChart = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
)
const IconBrain = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.76-3.21 2.49 2.49 0 0 1-.85-3.06A2.5 2.5 0 0 1 4 10.5a2.5 2.5 0 0 1 .29-1.17A3 3 0 0 1 9.5 2z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.76-3.21 2.49 2.49 0 0 0 .85-3.06A2.5 2.5 0 0 0 20 10.5a2.5 2.5 0 0 0-.29-1.17A3 3 0 0 0 14.5 2z"/>
  </svg>
)
const IconLock = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const IconUser = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconRocket = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
)
const IconStar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconPlay = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
)
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

// ── Stat counter ────────────────────────────────────────────

function StatItem({ prefix = '', suffix = '', target, label, visible }) {
  const val = useCounter(target, visible)
  return (
    <div className="ld-stat">
      <span className="ld-stat-num">{prefix}{val.toLocaleString('es-AR')}{suffix}</span>
      <span className="ld-stat-label">{label}</span>
    </div>
  )
}

// ── Animated section wrapper ────────────────────────────────

function FadeIn({ children, delay = 0, className = '' }) {
  const [ref, visible] = useInView()
  return (
    <div
      ref={ref}
      className={`ld-fadein ${visible ? 'ld-fadein--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ── Companies strip ─────────────────────────────────────────

const DEMO_COUNTRIES = [
  { code: 'AR', flag: '🇦🇷', label: 'Argentina' },
  { code: 'BR', flag: '🇧🇷', label: 'Brasil' },
  { code: 'MX', flag: '🇲🇽', label: 'México' },
  { code: 'CO', flag: '🇨🇴', label: 'Colombia' },
  { code: 'CL', flag: '🇨🇱', label: 'Chile' },
  { code: 'PE', flag: '🇵🇪', label: 'Perú' },
  { code: 'ES', flag: '🇪🇸', label: 'España' },
  { code: 'US', flag: '🇺🇸', label: 'EE.UU.' },
]

function CompaniesStrip() {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    fetch('/api/payments/country')
      .then(r => r.json())
      .then(d => setCountry(d.country || 'US'))
      .catch(() => setCountry('US'))
  }, [])

  const active = country || 'US'
  const logos = COUNTRY_LOGOS[active] || COUNTRY_LOGOS.DEFAULT
  const countryName = COUNTRY_NAMES[active] || COUNTRY_NAMES.US
  const doubled = [...logos, ...logos, ...logos, ...logos]

  return (
    <section className="ld-companies">
      <FadeIn>
        <div className="ld-section-badge">TU PRÓXIMO PASO</div>
        <h2 className="ld-section-title">
          Preparate para llegar a las <span className="ld-accent">mejores empresas</span>.
        </h2>
        <p className="ld-section-sub">
          Entrená tus respuestas y aplicá con más confianza
          {` a compañías líderes de ${countryName}`}.
        </p>
      </FadeIn>
      <div className="ld-companies-wrap">
        <div key={active} className="ld-companies-track">
          {doubled.map((l, i) => (
            <div key={i} className="ld-company-chip">
              <img src={l.logo} alt={l.name} className="ld-company-chip-img" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Component ───────────────────────────────────────────────

export default function Landing({ user, onLogin, onTryFree, onDashboard, onBlogPost, onTerms, onPrivacy, onFaq }) {
  const [statsRef, statsVisible] = useInView()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="ld-page">

      {/* NAV */}
      <nav className="ld-nav">
        <div className="ld-nav-inner">
          <div className="ld-nav-logo">
            <img src="/logo.png" alt="FeelReady" style={{ height: 36, width: 'auto' }} />
          </div>
          <div className={`ld-nav-links ${menuOpen ? 'ld-nav-links--open' : ''}`}>
            <a href="#features">Cómo funciona</a>
            <a href="#features">Características</a>
            <a href="#pricing">Precios</a>
            <a href="#testimonials">Testimonios</a>
            <a href="#features">Recursos</a>
          </div>
          <div className="ld-nav-actions">
            {user
              ? <button className="ld-btn-ghost" onClick={onDashboard}>Mi cuenta</button>
              : <button className="ld-btn-ghost" onClick={onLogin} data-track="login_clicked">Iniciar sesión</button>
            }
            <button className="ld-btn-primary" onClick={onTryFree} data-track="try_free_clicked">Probar gratis</button>
          </div>
          <button className="ld-hamburger" onClick={() => setMenuOpen(v => !v)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="ld-hero">
        <div className="ld-hero-left">
          <div className="ld-badge">
            <span className="ld-badge-dot" />
            Entrenó. Mejoró. Consiguió el trabajo.
          </div>
          <h1 className="ld-hero-title">
            Entrená entrevistas<br />hasta que{' '}
            <span className="ld-accent">consigas<br />el trabajo.</span>
          </h1>
          <p className="ld-hero-sub">
            Simulaciones realistas que te ayudan a responder mejor, comunicarte con confianza y destacarte en cualquier conversación.
          </p>
          <div className="ld-hero-ctas">
            <button className="ld-btn-primary ld-btn-lg" onClick={onTryFree} data-track="try_free_clicked">
              Empezar gratis <IconArrow />
            </button>
            <button className="ld-btn-video">
              <span className="ld-play-btn"><IconPlay /></span>
              Ver cómo funciona <span className="ld-video-duration">2 min</span>
            </button>
          </div>
          <div className="ld-hero-checks">
            <span><IconCheck /> Gratis para empezar</span>
            <span><IconCheck /> Sin tarjeta de crédito</span>
            <span><IconCheck /> Resultados reales</span>
          </div>
        </div>

        <div className="ld-hero-right">
          <div className="ld-mock-card">
            <div className="ld-mock-header">
              <span className="ld-mock-dot ld-mock-dot--red" />
              <span className="ld-mock-dot ld-mock-dot--yellow" />
              <span className="ld-mock-dot ld-mock-dot--green" />
              <span className="ld-mock-title">Sesión en progreso</span>
              <span className="ld-mock-time">⏱ 12:45</span>
            </div>
            <div className="ld-mock-video">
              <div className="ld-mock-avatar">
                <div className="ld-mock-avatar-ring" />
                <div className="ld-mock-face">
                  <div className="ld-mock-face-inner" />
                </div>
              </div>
              <span className="ld-mock-speaking">La persona está hablando…</span>
              <div className="ld-waveform">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="ld-waveform-bar" style={{ animationDelay: `${i * 80}ms` }} />
                ))}
              </div>
            </div>
            <div className="ld-mock-panel">
              <div className="ld-mock-panel-title">Tu desempeño</div>
              <div className="ld-mock-score">
                <span className="ld-mock-score-pill">Muy bien</span>
                <span className="ld-mock-score-num">8.6<span>/10</span></span>
                <span className="ld-mock-score-delta">+12% vs anterior</span>
              </div>
              <div className="ld-mock-section-title">Fortalezas</div>
              <ul className="ld-mock-list ld-mock-list--good">
                <li>Comunicación clara</li>
                <li>Estructura de respuesta</li>
                <li>Confianza</li>
              </ul>
              <div className="ld-mock-section-title">A mejorar</div>
              <ul className="ld-mock-list ld-mock-list--warn">
                <li>Profundizar ejemplos</li>
                <li>Mencionar métricas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* COMPANIES */}
      <CompaniesStrip />


      {/* FEATURES */}
      <section className="ld-features" id="features">
        <FadeIn>
          <div className="ld-section-badge">CARACTERÍSTICAS</div>
          <h2 className="ld-section-title">
            Preparación real para<br />situaciones <span className="ld-accent">reales</span>
          </h2>
          <p className="ld-section-sub">Todo lo que necesitás para llegar confiado y preparado.</p>
        </FadeIn>
        <div className="ld-features-grid">
          {[
            { icon: <IconMic />, title: 'Simulaciones realistas', desc: 'Practicá con simulaciones adaptadas a tu rol, nivel y la empresa que buscás.' },
            { icon: <IconChart />, title: 'Feedback inteligente y personalizado', desc: 'Recibí sugerencias claras para mejorar tu forma de comunicarte y responder.' },
            { icon: <IconBrain />, title: 'Mejorá tus habilidades blandas', desc: 'Comunicación, storytelling, seguridad y pensamiento estructurado.' },
            { icon: <IconLock />, title: 'Privado y seguro', desc: 'Tu información está protegida y no será compartida con ninguna empresa.' },
          ].map((f, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="ld-feature-card">
                <div className="ld-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="ld-how" id="how">
        <FadeIn>
          <div className="ld-section-badge">CÓMO FUNCIONA</div>
          <h2 className="ld-section-title">
            Simple, práctico y <span className="ld-accent">efectivo</span>
          </h2>
        </FadeIn>
        <div className="ld-steps">
          {[
            { icon: <IconUser />, title: 'Contanos sobre vos', desc: 'Contanos tu rol, experiencia y el tipo de trabajo que buscás.' },
            { icon: <IconMic />, title: 'Practicá', desc: 'Practicá simulaciones realistas a tu ritmo.' },
            { icon: <IconChart />, title: 'Recibí feedback', desc: 'Obtené un análisis detallado con fortalezas y puntos de mejora.' },
            { icon: <IconRocket />, title: 'Mejorá y destacate', desc: 'Aplicá lo aprendido, repetí y llegá a tu próxima instancia con confianza.' },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 120} className="ld-step-wrap">
              <div className="ld-step">
                <div className="ld-step-num">{i + 1}</div>
                <div className="ld-step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
              {i < 3 && <div className="ld-step-arrow">→</div>}
            </FadeIn>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="ld-testimonials" id="testimonials">
        <FadeIn>
          <div className="ld-section-badge">HISTORIAS REALES</div>
          <h2 className="ld-section-title">
            Ellos ya <span className="ld-accent">consiguieron</span> su trabajo
          </h2>
        </FadeIn>
        <div className="ld-testimonials-grid">
          {[
            { quote: '"Practicar con FeelReady me ayudó a ordenar mis ideas y ganar confianza. Conseguí el trabajo que quería 🙌"', name: 'Martina López', role: 'Product Manager', initials: 'ML' },
            { quote: '"Los feedbacks son súper claros y accionables. Mejoré mucho mis respuestas y mi seguridad."', name: 'Juan Pablo Gómez', role: 'Data Analyst', initials: 'JG' },
            { quote: '"Me encantó lo realista que se siente. Es como estar en la situación real, pero sin los nervios."', name: 'Camila Torres', role: 'UX Designer', initials: 'CT' },
          ].map((t, i) => (
            <FadeIn key={i} delay={i * 120}>
              <div className="ld-testimonial-card">
                <div className="ld-testimonial-stars">{[...Array(5)].map((_, j) => <IconStar key={j} />)}</div>
                <p className="ld-testimonial-quote">{t.quote}</p>
                <div className="ld-testimonial-author">
                  <div className="ld-testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="ld-testimonial-name">{t.name}</div>
                    <div className="ld-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA DARK */}
      <section className="ld-cta-dark">
        <div className="ld-cta-dark-left">
          <h2>Tu próxima oportunidad<br />empieza con preparación.</h2>
          <p>Unite a miles de profesionales que ya están entrenando y alcanzando sus metas.</p>
          <ul className="ld-cta-checks">
            <li><IconCheck /> Probalo gratis</li>
            <li><IconCheck /> Sin tarjeta de crédito</li>
            <li><IconCheck /> Cancelá cuando quieras</li>
          </ul>
        </div>
        <div className="ld-cta-dark-right">
          <div className="ld-cta-card">
            <h3>Empieza gratis hoy</h3>
            <p className="ld-cta-card-sub">Accedé a 3 sesiones de prueba.</p>
            <button className="ld-btn-primary ld-btn-full" onClick={onDashboard} data-track="signup_cta_clicked">Crear mi cuenta gratis</button>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <BlogSection onBlogPost={onBlogPost} />

      {/* FOOTER */}
      <footer className="ld-footer">
        <div className="ld-footer-inner">
          <div className="ld-footer-logo">
            <img src="/logo.png" alt="FeelReady" style={{ height: 28, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
          </div>
          <div className="ld-footer-links">
            <a href="#features">Cómo funciona</a>
            <a href="#pricing">Precios</a>
            {onFaq && <a onClick={onFaq} style={{ cursor: 'pointer' }}>FAQ</a>}
            {onPrivacy && <a onClick={onPrivacy} style={{ cursor: 'pointer' }}>Política de privacidad</a>}
            {onTerms && <a onClick={onTerms} style={{ cursor: 'pointer' }}>Términos y condiciones</a>}
          </div>
        </div>
      </footer>
    </div>
  )
}
