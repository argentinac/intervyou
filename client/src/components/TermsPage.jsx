export default function TermsPage({ onBack, onTryFree }) {
  return (
    <div className="lp-page">
      <header className="lp-header">
        <div className="lp-header-inner">
          <button className="lp-back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Inicio
          </button>
          <img src="/logo.png" alt="CoachToWork" className="lp-logo" />
          <button className="lp-cta-nav" onClick={onTryFree}>Practicar gratis</button>
        </div>
      </header>

      <main className="lp-main">
        <div className="lp-doc-header">
          <span className="lp-doc-badge">Última actualización: Mayo 2026</span>
          <h1 className="lp-doc-title">Términos y Condiciones de Uso</h1>
          <p className="lp-doc-subtitle">Leé con atención antes de usar CoachToWork.</p>
        </div>

        <div className="lp-layout">
          <nav className="lp-toc">
            <p className="lp-toc-label">Contenido</p>
            <a href="#s1">1. Aceptación</a>
            <a href="#s2">2. Descripción</a>
            <a href="#s3">3. Elegibilidad</a>
            <a href="#s4">4. Cuenta</a>
            <a href="#s5">5. Planes y pagos</a>
            <a href="#s6">6. Uso aceptable</a>
            <a href="#s7">7. Propiedad intelectual</a>
            <a href="#s8">8. Inteligencia artificial</a>
            <a href="#s9">9. Limitación de responsabilidad</a>
            <a href="#s10">10. Modificaciones</a>
            <a href="#s11">11. Cancelación</a>
            <a href="#s12">12. Legislación aplicable</a>
            <a href="#s13">13. Contacto</a>
          </nav>

          <article className="lp-content">
            <section id="s1" className="lp-section">
              <h2>1. Aceptación de los términos</h2>
              <p>Al acceder o utilizar CoachToWork (en adelante, "el Servicio", "la Plataforma" o "CoachToWork"), disponible en coachtowork.io, usted ("Usuario") acepta quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar el Servicio.</p>
            </section>

            <section id="s2" className="lp-section">
              <h2>2. Descripción del Servicio</h2>
              <p>CoachToWork es una plataforma de entrenamiento basada en inteligencia artificial que permite a los usuarios practicar y mejorar sus habilidades de comunicación, preparación para entrevistas laborales y, en versiones futuras, otras situaciones que requieran comunicación efectiva, incluyendo coaching académico, personal y de vida.</p>
              <p>El Servicio incluye actualmente, entre otras funcionalidades:</p>
              <ul>
                <li>Simulaciones de entrevistas laborales con IA conversacional</li>
                <li>Feedback personalizado basado en el desempeño del usuario</li>
                <li>Análisis del progreso a lo largo del tiempo</li>
                <li>Recursos y contenido educativo relacionado</li>
              </ul>
              <p>Las funcionalidades del Servicio pueden evolucionar, ampliarse o modificarse en cualquier momento a discreción de CoachToWork, con la finalidad de ofrecer experiencias de coaching más completas.</p>
            </section>

            <section id="s3" className="lp-section">
              <h2>3. Elegibilidad</h2>
              <p>El Servicio está disponible para personas de todas las edades. Los usuarios menores de 18 años deben contar con el consentimiento de su padre, madre o tutor legal para utilizar el Servicio y, en particular, para contratar cualquier plan de pago.</p>
              <p>Al registrarse o contratar un plan pago, el usuario declara tener la capacidad legal necesaria para celebrar contratos en su jurisdicción, o bien contar con la autorización de su representante legal.</p>
            </section>

            <section id="s4" className="lp-section">
              <h2>4. Cuenta de usuario</h2>
              <p>Para acceder a determinadas funcionalidades, el usuario puede crear una cuenta personal. El usuario es responsable de:</p>
              <ul>
                <li>Proporcionar información veraz y actualizada al momento del registro</li>
                <li>Mantener la confidencialidad de sus credenciales de acceso</li>
                <li>Todas las actividades que ocurran bajo su cuenta</li>
                <li>Notificar a CoachToWork ante cualquier uso no autorizado de su cuenta</li>
              </ul>
              <p>CoachToWork no será responsable por pérdidas derivadas del uso no autorizado de la cuenta del usuario cuando éste no haya cumplido con las obligaciones de seguridad anteriores.</p>
            </section>

            <section id="s5" className="lp-section">
              <h2>5. Planes y pagos</h2>
              <p>CoachToWork ofrece un plan gratuito con funcionalidades limitadas y planes de pago ("Plan Premium") que otorgan acceso a funcionalidades adicionales.</p>

              <h3>5.1 Precios</h3>
              <p>Los precios de los planes de pago están disponibles en la sección de precios de la Plataforma y pueden variar según la periodicidad elegida (mensual, trimestral u otras opciones disponibles). Todos los precios se muestran en dólares estadounidenses (USD) salvo indicación contraria.</p>

              <h3>5.2 Renovación automática</h3>
              <p>Los planes de pago se renuevan automáticamente al finalizar cada período contratado, salvo que el usuario los cancele antes de la fecha de renovación. Al contratar un plan pago, el usuario autoriza expresamente el cobro recurrente por el importe correspondiente.</p>

              <h3>5.3 Procesadores de pago</h3>
              <p>Los pagos son procesados por proveedores externos de confianza. CoachToWork puede utilizar uno o varios procesadores de pago, incluyendo pero no limitándose a Stripe, Mercado Pago u otros proveedores equivalentes. El uso de dichos servicios está sujeto a los términos y condiciones propios de cada proveedor.</p>

              <h3>5.4 Política de reembolsos</h3>
              <p>Salvo que la legislación aplicable en la jurisdicción del usuario establezca lo contrario, CoachToWork no otorga reembolsos por períodos no utilizados ni por cancelaciones anticipadas de suscripciones activas.</p>
              <p>En jurisdicciones donde la normativa de protección al consumidor reconozca un derecho de desistimiento (como la Unión Europea, que establece 14 días naturales, o legislaciones similares), el usuario podrá ejercer dicho derecho contactando a <a href="mailto:support@coachtowork.io">support@coachtowork.io</a> dentro del plazo legal correspondiente, siempre que no haya hecho uso efectivo del servicio contratado.</p>

              <h3>5.5 Cancelación</h3>
              <p>El usuario puede cancelar su suscripción en cualquier momento desde la configuración de su cuenta o contactando a <a href="mailto:support@coachtowork.io">support@coachtowork.io</a>. La cancelación tendrá efecto al finalizar el período de facturación en curso.</p>
            </section>

            <section id="s6" className="lp-section">
              <h2>6. Uso aceptable</h2>
              <p>El usuario se compromete a utilizar el Servicio únicamente para fines lícitos y de acuerdo con estos Términos. Queda expresamente prohibido:</p>
              <ul>
                <li>Utilizar el Servicio para fines ilegales, fraudulentos o contrarios a la moral y el orden público</li>
                <li>Intentar acceder de forma no autorizada a los sistemas o datos de la Plataforma</li>
                <li>Realizar ingeniería inversa, descompilar o intentar obtener el código fuente del Servicio</li>
                <li>Suplantar la identidad de otros usuarios o de CoachToWork</li>
                <li>Publicar, transmitir o facilitar contenido que sea difamatorio, discriminatorio, obsceno o que incite a la violencia</li>
                <li>Utilizar sistemas automatizados (bots, scrapers u otros) para interactuar con el Servicio sin autorización escrita previa</li>
                <li>Interferir con el funcionamiento normal de la Plataforma</li>
              </ul>
            </section>

            <section id="s7" className="lp-section">
              <h2>7. Propiedad intelectual</h2>
              <p>Todo el contenido de CoachToWork, incluyendo pero no limitándose a textos, gráficos, logotipos, iconos, imágenes, audio, código fuente y software, es propiedad de CoachToWork o de sus licenciantes y está protegido por las leyes de propiedad intelectual aplicables.</p>
              <p>Se otorga al usuario una licencia limitada, no exclusiva, no transferible y revocable para acceder y utilizar el Servicio únicamente para los fines previstos. Esta licencia no incluye el derecho a reproducir, distribuir, modificar o crear obras derivadas del contenido del Servicio.</p>
              <p>Los usuarios conservan la titularidad de los contenidos que generen o proporcionen en la Plataforma (como respuestas en entrevistas o información de perfil), pero otorgan a CoachToWork una licencia no exclusiva, mundial y libre de regalías para utilizar dicho contenido con el fin de operar, mejorar y desarrollar el Servicio, en los términos descritos en la Política de Privacidad.</p>
            </section>

            <section id="s8" className="lp-section">
              <h2>8. Uso de inteligencia artificial y terceros proveedores</h2>
              <p>El Servicio utiliza tecnologías de inteligencia artificial y servicios de terceros para brindar sus funcionalidades. El contenido generado por la IA tiene carácter orientativo y no reemplaza el asesoramiento profesional de un orientador laboral, psicólogo, coach certificado u otro profesional cualificado.</p>
              <p>CoachToWork no garantiza que el feedback o los resultados generados por la IA sean exactos, completos o aplicables a la situación particular de cada usuario.</p>
            </section>

            <section id="s9" className="lp-section">
              <h2>9. Limitación de responsabilidad</h2>
              <p>En la máxima medida permitida por la ley aplicable, CoachToWork no será responsable por:</p>
              <ul>
                <li>Daños indirectos, incidentales, especiales, consecuentes o punitivos</li>
                <li>Pérdida de beneficios, oportunidades laborales u otros perjuicios económicos derivados del uso o la imposibilidad de uso del Servicio</li>
                <li>La exactitud, integridad o adecuación del feedback generado por la IA</li>
                <li>Interrupciones del servicio debidas a causas de fuerza mayor o a fallas de proveedores externos</li>
              </ul>
              <p>En ningún caso la responsabilidad total de CoachToWork frente a un usuario excederá el importe efectivamente pagado por dicho usuario en los seis (6) meses anteriores al evento que originó la reclamación.</p>
              <p>Nada en estos Términos excluye o limita la responsabilidad de CoachToWork en los casos en que la legislación aplicable no permita dicha exclusión o limitación, incluyendo la responsabilidad por dolo o culpa grave.</p>
            </section>

            <section id="s10" className="lp-section">
              <h2>10. Modificaciones del Servicio y de los Términos</h2>
              <p>CoachToWork se reserva el derecho de modificar, suspender o discontinuar el Servicio, o cualquier parte del mismo, en cualquier momento y por cualquier motivo, con o sin previo aviso.</p>
              <p>Asimismo, CoachToWork puede modificar estos Términos periódicamente. Las modificaciones serán notificadas al usuario mediante publicación en la Plataforma y/o por correo electrónico. El uso continuado del Servicio tras la publicación de los cambios constituye la aceptación de los nuevos Términos.</p>
            </section>

            <section id="s11" className="lp-section">
              <h2>11. Cancelación y suspensión de cuenta</h2>
              <p>CoachToWork puede suspender o eliminar la cuenta de un usuario, sin previo aviso ni responsabilidad, en caso de incumplimiento de estos Términos o por cualquier otro motivo que a su criterio justifique tal medida.</p>
            </section>

            <section id="s12" className="lp-section">
              <h2>12. Legislación aplicable y resolución de conflictos</h2>
              <p>Estos Términos se regirán e interpretarán de acuerdo con las leyes aplicables en la jurisdicción del usuario en lo que respecta a derechos del consumidor. Para usuarios en la Argentina, se aplicará la Ley N.° 24.240 de Defensa del Consumidor y sus modificatorias. Para usuarios en la Unión Europea, se aplica la normativa comunitaria de protección al consumidor. Para usuarios en México, se aplica la Ley Federal de Protección al Consumidor.</p>
              <p>Cualquier controversia que no pueda resolverse amigablemente podrá ser sometida a los tribunales competentes de la jurisdicción del consumidor, conforme a la normativa local vigente.</p>
            </section>

            <section id="s13" className="lp-section">
              <h2>13. Contacto</h2>
              <p>Para cualquier consulta relacionada con estos Términos, puede contactarnos en: <a href="mailto:support@coachtowork.io">support@coachtowork.io</a></p>
            </section>
          </article>
        </div>
      </main>

      <footer className="ld-footer">
        <div className="ld-footer-inner">
          <div className="ld-footer-logo">
            <img src="/logo.png" alt="CoachToWork" style={{ height: 28, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
          </div>
          <div className="ld-footer-links">
            <a onClick={onBack} style={{ cursor: 'pointer' }}>Inicio</a>
            <a href="mailto:support@coachtowork.io">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
