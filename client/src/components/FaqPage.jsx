import { useState } from 'react'

const FAQ_DATA = [
  {
    category: 'Sobre CoachToWork',
    icon: '💡',
    items: [
      {
        q: '¿Qué es CoachToWork?',
        a: 'CoachToWork es una plataforma de entrenamiento con inteligencia artificial que te ayuda a practicar y mejorar tus habilidades de comunicación. Hoy está enfocada en la preparación para entrevistas laborales, pero la plataforma está diseñada para evolucionar hacia otros contextos de coaching, como la comunicación académica, trámites y la vida cotidiana.'
      },
      {
        q: '¿Cómo funciona?',
        a: 'Configurás el tipo de entrevista que querés practicar (puesto, empresa, idioma, dificultad), y la IA asume el rol de entrevistador. Al finalizar, recibís un análisis detallado con puntuación, fortalezas y sugerencias de mejora concretas.'
      },
      {
        q: '¿Necesito crear una cuenta para usar CoachToWork?',
        a: 'Podés probar el Servicio sin crear una cuenta. Sin embargo, para acceder al historial de sesiones, al seguimiento de progreso y a las funcionalidades del plan Premium, necesitás registrarte.'
      },
      {
        q: '¿En qué idiomas está disponible?',
        a: 'El Servicio está disponible en español, inglés, portugués, francés, alemán e italiano. Las simulaciones se adaptan al idioma y la cultura profesional del país que selecciones.'
      }
    ]
  },
  {
    category: 'Planes y pagos',
    icon: '💳',
    items: [
      {
        q: '¿Qué incluye el plan gratuito?',
        a: 'El plan gratuito te da acceso a simulaciones básicas de entrevistas de RRHH y técnicas, con feedback y puntuación al finalizar.'
      },
      {
        q: '¿Qué agrega el plan Premium?',
        a: 'El plan Premium incluye entrevistas ilimitadas, sesiones más largas, análisis de progreso detallado, recursos exclusivos y acceso a nuevas funcionalidades a medida que se lanzan.'
      },
      {
        q: '¿Cómo puedo pagar?',
        a: 'Aceptamos distintos métodos de pago a través de procesadores seguros, incluyendo tarjetas de crédito y débito internacionales, y otras opciones disponibles según tu región. Los pagos son procesados de forma segura por proveedores externos; CoachToWork no almacena los datos de tu tarjeta.'
      },
      {
        q: '¿El plan Premium se renueva automáticamente?',
        a: 'Sí. El plan Premium tiene renovación automática al vencimiento de cada período contratado. Podés cancelarlo en cualquier momento desde la configuración de tu cuenta, y la cancelación tendrá efecto al finalizar el período en curso.'
      },
      {
        q: '¿Puedo pedir un reembolso?',
        a: 'Con excepción de los casos en que la ley de tu país te otorgue este derecho (como el derecho de desistimiento en la Unión Europea), CoachToWork no ofrece reembolsos por períodos no utilizados. Si creés que corresponde una excepción, escribinos a support@coachtowork.io y lo evaluamos.'
      },
      {
        q: '¿Cómo cancelo mi suscripción?',
        a: 'Podés cancelarla desde la sección "Configuración" de tu cuenta, o enviando un mail a support@coachtowork.io. La cancelación es inmediata y no se realizarán cobros futuros, aunque seguirás teniendo acceso hasta el final del período pagado.'
      }
    ]
  },
  {
    category: 'Datos y privacidad',
    icon: '🔒',
    items: [
      {
        q: '¿Qué datos guarda CoachToWork?',
        a: 'Guardamos tu información de registro, tu historial de sesiones (incluyendo transcripciones de las entrevistas), las puntuaciones y el feedback generado, y datos de uso general de la plataforma. Podés ver la lista completa en nuestra Política de Privacidad.'
      },
      {
        q: '¿Mis respuestas en las entrevistas son privadas?',
        a: 'Sí. Tus sesiones son privadas y no se comparten con terceros sin tu consentimiento, salvo en los casos descritos en la Política de Privacidad (como el uso de proveedores de infraestructura o cumplimiento legal).'
      },
      {
        q: '¿CoachToWork usa mis datos para entrenar IA?',
        a: 'CoachToWork puede utilizar datos de sesiones para mejorar el Servicio, incluyendo los modelos de feedback. En la medida de lo posible, estos datos se tratan de forma anonimizada o pseudonimizada.'
      },
      {
        q: '¿Puedo pedir que borren mis datos?',
        a: 'Sí. Podés solicitar la eliminación de tu cuenta y tus datos en cualquier momento escribiendo a support@coachtowork.io. Procesamos la solicitud en un plazo razonable conforme a la normativa aplicable.'
      },
      {
        q: '¿CoachToWork vende mis datos?',
        a: 'No. CoachToWork no vende ni alquila datos personales de sus usuarios a terceros.'
      }
    ]
  },
  {
    category: 'Uso del Servicio',
    icon: '🎯',
    items: [
      {
        q: '¿El feedback de la IA reemplaza a un coach o profesional real?',
        a: 'No. El feedback de CoachToWork es orientativo y está basado en patrones generales de comunicación. No reemplaza el asesoramiento de un coach certificado, psicólogo laboral u otro profesional cualificado. Es una herramienta de práctica y entrenamiento.'
      },
      {
        q: '¿Puedo practicar entrevistas técnicas?',
        a: 'Sí. Podés elegir entre entrevistas de RRHH y entrevistas técnicas. En las técnicas, el entrevistador evaluará tu conocimiento del rol y tu forma de resolver problemas.'
      },
      {
        q: '¿Puedo usar CoachToWork si soy menor de edad?',
        a: 'Sí, pero necesitás el consentimiento de tu padre, madre o tutor legal, especialmente para contratar un plan pago.'
      },
      {
        q: '¿Qué pasa si tengo un problema técnico durante una sesión?',
        a: 'Si experimentás un problema durante una sesión (corte de conexión, error de audio, etc.), podés iniciar una nueva sesión. Por el momento no hay recuperación automática de sesiones interrumpidas. Si el problema persiste, escribinos a support@coachtowork.io.'
      },
      {
        q: '¿CoachToWork estará disponible para otras situaciones además de entrevistas laborales?',
        a: 'Sí. La plataforma está en constante evolución y tiene como objetivo expandirse hacia otros contextos de comunicación, como preparación para entrevistas académicas, trámites, situaciones cotidianas y coaching de vida. Los usuarios con plan activo tendrán acceso a las nuevas funcionalidades a medida que se lancen.'
      }
    ]
  }
]

export default function FaqPage({ onBack, onTryFree, onPrivacy, onTerms }) {
  const [openKey, setOpenKey] = useState(null)

  const toggle = (key) => setOpenKey(prev => prev === key ? null : key)

  return (
    <div className="faq-page">
      <header className="lp-header">
        <div className="lp-header-inner">
          <button className="lp-back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Inicio
          </button>
          <img src="/logo.png" alt="CoachToWork" className="lp-logo" />
          <button className="ld-btn-primary" onClick={onTryFree}>Probar gratis</button>
        </div>
      </header>

      <main className="faq-main">
        <div className="faq-hero">
          <div className="faq-hero-badge">Centro de ayuda</div>
          <h1 className="faq-hero-title">Preguntas frecuentes</h1>
          <p className="faq-hero-sub">Todo lo que necesitás saber sobre CoachToWork.</p>
        </div>

        <div className="faq-body">
          {FAQ_DATA.map((section, si) => (
            <div key={si} className="faq-section">
              <div className="faq-section-header">
                <span className="faq-section-icon">{section.icon}</span>
                <h2 className="faq-section-title">{section.category}</h2>
              </div>
              <div className="faq-items">
                {section.items.map((item, ii) => {
                  const key = `${si}-${ii}`
                  const isOpen = openKey === key
                  return (
                    <div key={ii} className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
                      <button className="faq-q" onClick={() => toggle(key)}>
                        <span>{item.q}</span>
                        <svg
                          className="faq-chevron"
                          width="18" height="18" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="2.5"
                          strokeLinecap="round" strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      <div className="faq-a">
                        <p>{item.a}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-contact">
          <p className="faq-contact-text">¿No encontraste lo que buscabas?</p>
          <a href="mailto:support@coachtowork.io" className="faq-contact-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            support@coachtowork.io
          </a>
        </div>
      </main>

      <footer className="ld-footer">
        <div className="ld-footer-inner">
          <div className="ld-footer-logo">
            <img src="/logo.png" alt="CoachToWork" style={{ height: 28, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
          </div>
          <div className="ld-footer-links">
            <a onClick={onBack} style={{ cursor: 'pointer' }}>Inicio</a>
            {onPrivacy && <a onClick={onPrivacy} style={{ cursor: 'pointer' }}>Privacidad</a>}
            {onTerms && <a onClick={onTerms} style={{ cursor: 'pointer' }}>Términos</a>}
            <a href="mailto:support@coachtowork.io">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
