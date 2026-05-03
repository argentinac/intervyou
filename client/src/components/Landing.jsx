import { useEffect, useRef, useState } from 'react'
import BlogSection from './BlogSection'

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
            <img src="/logo.png" alt="CoachToWork" style={{ height: 36, width: 'auto' }} />
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
              : <button className="ld-btn-ghost" onClick={onLogin}>Iniciar sesión</button>
            }
            <button className="ld-btn-primary" onClick={onTryFree}>Probar gratis</button>
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
            Simulaciones realistas con IA que te ayudan a responder mejor, comunicarte con confianza y destacarte en tus entrevistas.
          </p>
          <div className="ld-hero-ctas">
            <button className="ld-btn-primary ld-btn-lg" onClick={onTryFree}>
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
              <span className="ld-mock-title">Entrevista en progreso</span>
              <span className="ld-mock-time">⏱ 12:45</span>
            </div>
            <div className="ld-mock-video">
              <div className="ld-mock-avatar">
                <div className="ld-mock-avatar-ring" />
                <div className="ld-mock-face">
                  <div className="ld-mock-face-inner" />
                </div>
              </div>
              <span className="ld-mock-speaking">La entrevistadora está hablando…</span>
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

      {/* STATS */}
      <section className="ld-stats" ref={statsRef}>
        <p className="ld-stats-label">Personas como vos ya están logrando sus objetivos</p>
        <div className="ld-stats-row">
          <StatItem prefix="+" target={15000} suffix="" label="Usuarios activos" visible={statsVisible} />
          <StatItem prefix="+" target={50000} label="Entrevistas realizadas" visible={statsVisible} />
          <div className="ld-stat">
            <span className="ld-stat-num ld-stat-num--stars">
              4.9/5 <span className="ld-stars">{[...Array(5)].map((_, i) => <IconStar key={i} />)}</span>
            </span>
            <span className="ld-stat-label">Calificación promedio</span>
          </div>
          <StatItem prefix="+" target={85} suffix="%" label="Mejoró su desempeño" visible={statsVisible} />
        </div>
      </section>

      {/* FEATURES */}
      <section className="ld-features" id="features">
        <FadeIn>
          <div className="ld-section-badge">CARACTERÍSTICAS</div>
          <h2 className="ld-section-title">
            Preparación real para<br />entrevistas <span className="ld-accent">reales</span>
          </h2>
          <p className="ld-section-sub">Todo lo que necesitás para llegar confiado y preparado.</p>
        </FadeIn>
        <div className="ld-features-grid">
          {[
            { icon: <IconMic />, title: 'Simulaciones realistas con IA', desc: 'Practicá con entrevistas adaptadas a tu rol, nivel y la empresa que buscás.' },
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
            { icon: <IconMic />, title: 'Practicá entrevistas', desc: 'Realizá simulaciones con IA como si fuera una entrevista real.' },
            { icon: <IconChart />, title: 'Recibí feedback', desc: 'Obtené un análisis detallado con fortalezas y puntos de mejora.' },
            { icon: <IconRocket />, title: 'Mejorá y destacate', desc: 'Aplicá lo aprendido, repetí y llegá a tu próxima entrevista con confianza.' },
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
            { quote: '"Practicar con CoachToWork me ayudó a ordenar mis ideas y ganar confianza. Conseguí el trabajo que quería 🙌"', name: 'Martina López', role: 'Product Manager', initials: 'ML' },
            { quote: '"Los feedbacks son súper claros y accionables. Mejoré mucho mis respuestas y mi seguridad."', name: 'Juan Pablo Gómez', role: 'Data Analyst', initials: 'JG' },
            { quote: '"Me encantó lo realista que se siente. Es como estar en la entrevista posta, pero sin los nervios."', name: 'Camila Torres', role: 'UX Designer', initials: 'CT' },
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
        <FadeIn>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button className="ld-btn-ghost ld-btn-more">Ver más historias <IconArrow /></button>
          </div>
        </FadeIn>
      </section>

      {/* CTA DARK */}
      <section className="ld-cta-dark">
        <div className="ld-cta-dark-left">
          <h2>Tu próxima oportunidad<br />empieza con preparación.</h2>
          <p>Unite a miles de profesionales que ya están entrenando entrevistas y alcanzando sus metas.</p>
          <ul className="ld-cta-checks">
            <li><IconCheck /> Probalo gratis</li>
            <li><IconCheck /> Sin tarjeta de crédito</li>
            <li><IconCheck /> Cancelá cuando quieras</li>
          </ul>
        </div>
        <div className="ld-cta-dark-right">
          <div className="ld-cta-card">
            <h3>Empieza gratis hoy</h3>
            <p className="ld-cta-card-sub">Accedé a 3 entrevistas de prueba.</p>
            <button className="ld-btn-primary ld-btn-full" onClick={onTryFree}>Crear mi cuenta gratis</button>
            <div className="ld-cta-divider">o continuá con</div>
            <div className="ld-cta-oauth">
              <button className="ld-oauth-btn">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </button>
              <button className="ld-oauth-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0077B5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </button>
              <button className="ld-oauth-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <BlogSection onBlogPost={onBlogPost} />

      {/* FOOTER */}
      <footer className="ld-footer">
        <div className="ld-footer-inner">
          <div className="ld-footer-logo">
            <img src="/logo.png" alt="CoachToWork" style={{ height: 28, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
          </div>
          <div className="ld-footer-links">
            <a href="#features">Cómo funciona</a>
            <a href="#pricing">Precios</a>
            {onFaq && <a onClick={onFaq} style={{ cursor: 'pointer' }}>FAQ</a>}
            {onPrivacy && <a onClick={onPrivacy} style={{ cursor: 'pointer' }}>Política de privacidad</a>}
            {onTerms && <a onClick={onTerms} style={{ cursor: 'pointer' }}>Términos y condiciones</a>}
          </div>
          <div className="ld-footer-social">
            <a href="#" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
