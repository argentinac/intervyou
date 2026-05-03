export default function PrivacyPage({ onBack, onTryFree }) {
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
          <h1 className="lp-doc-title">Política de Privacidad</h1>
          <p className="lp-doc-subtitle">Cómo recopilamos, usamos y protegemos tu información.</p>
        </div>

        <div className="lp-layout">
          <nav className="lp-toc">
            <p className="lp-toc-label">Contenido</p>
            <a href="#p1">1. Introducción</a>
            <a href="#p2">2. Información que recopilamos</a>
            <a href="#p3">3. Cómo usamos la información</a>
            <a href="#p4">4. Base legal del tratamiento</a>
            <a href="#p5">5. Compartición con terceros</a>
            <a href="#p6">6. Transferencias internacionales</a>
            <a href="#p7">7. Retención de datos</a>
            <a href="#p8">8. Derechos del usuario</a>
            <a href="#p9">9. Seguridad</a>
            <a href="#p10">10. Cookies</a>
            <a href="#p11">11. Menores de edad</a>
            <a href="#p12">12. Cambios en esta política</a>
            <a href="#p13">13. Contacto</a>
          </nav>

          <article className="lp-content">
            <section id="p1" className="lp-section">
              <h2>1. Introducción</h2>
              <p>Esta Política de Privacidad describe cómo CoachToWork recopila, utiliza, almacena y protege la información personal de sus usuarios. Al utilizar el Servicio, el usuario acepta las prácticas descritas en este documento.</p>
              <p>CoachToWork está comprometida con la protección de la privacidad de sus usuarios y con el cumplimiento de las legislaciones aplicables, incluyendo el Reglamento General de Protección de Datos (RGPD) de la Unión Europea, la Ley N.° 25.326 de Protección de Datos Personales de Argentina, la Ley Federal de Protección de Datos Personales en Posesión de los Particulares de México, la Ley N.° 19.030 de Uruguay y demás normativas aplicables según la jurisdicción del usuario.</p>
            </section>

            <section id="p2" className="lp-section">
              <h2>2. Información que recopilamos</h2>

              <h3>2.1 Información proporcionada directamente por el usuario</h3>
              <ul>
                <li><strong>Datos de registro:</strong> nombre, dirección de correo electrónico, contraseña</li>
                <li><strong>Información de perfil profesional:</strong> rol buscado, industria, experiencia, descripción de puestos</li>
                <li><strong>Contenido de las sesiones:</strong> respuestas a preguntas de entrevista, grabaciones de voz procesadas para transcripción, conversaciones con la IA</li>
                <li><strong>Información de pago:</strong> datos necesarios para procesar transacciones (procesados por proveedores externos; CoachToWork no almacena datos de tarjetas de crédito)</li>
                <li>Comunicaciones con el equipo de soporte</li>
              </ul>

              <h3>2.2 Información recopilada automáticamente</h3>
              <ul>
                <li><strong>Datos de uso:</strong> funcionalidades utilizadas, frecuencia de acceso, tipo de simulaciones realizadas</li>
                <li><strong>Datos técnicos:</strong> dirección IP, tipo de dispositivo y navegador, sistema operativo, identificadores de sesión</li>
                <li><strong>Datos de rendimiento:</strong> puntuaciones, métricas de feedback y progreso a lo largo del tiempo</li>
                <li><strong>Ubicación aproximada:</strong> derivada de la dirección IP; no se recopila ubicación precisa</li>
              </ul>
            </section>

            <section id="p3" className="lp-section">
              <h2>3. Cómo usamos la información</h2>
              <p>CoachToWork utiliza la información recopilada para los siguientes fines:</p>
              <ul>
                <li><strong>Prestación del Servicio:</strong> operar, mantener y mejorar las funcionalidades de la Plataforma</li>
                <li><strong>Personalización:</strong> adaptar las simulaciones, el feedback y el contenido a las necesidades del usuario</li>
                <li><strong>Mejora de la IA:</strong> utilizar datos de sesiones (de forma anonimizada o pseudonimizada donde sea posible) para mejorar los modelos y algoritmos del Servicio</li>
                <li><strong>Comunicaciones:</strong> enviar notificaciones relacionadas con el Servicio, actualizaciones, confirmaciones de pago y, con el consentimiento del usuario cuando sea requerido, comunicaciones de marketing</li>
                <li><strong>Seguridad:</strong> detectar, investigar y prevenir actividades fraudulentas o que infrinjan los Términos</li>
                <li><strong>Cumplimiento legal:</strong> cumplir con obligaciones legales aplicables</li>
              </ul>
            </section>

            <section id="p4" className="lp-section">
              <h2>4. Base legal del tratamiento</h2>
              <p>El tratamiento de datos personales se realiza sobre las siguientes bases legales (aplica a usuarios en la Unión Europea y jurisdicciones con normativa equivalente):</p>
              <ul>
                <li><strong>Ejecución de un contrato:</strong> para prestar el Servicio contratado por el usuario</li>
                <li><strong>Interés legítimo:</strong> para mejorar el Servicio, detectar fraudes y garantizar la seguridad</li>
                <li><strong>Consentimiento:</strong> para el envío de comunicaciones de marketing y para el uso de cookies no esenciales (cuando corresponda)</li>
                <li><strong>Obligación legal:</strong> cuando el tratamiento sea necesario para cumplir con requerimientos legales</li>
              </ul>
            </section>

            <section id="p5" className="lp-section">
              <h2>5. Compartición de datos con terceros</h2>
              <p>CoachToWork no vende ni alquila los datos personales de sus usuarios a terceros. Sin embargo, puede compartir información en los siguientes casos:</p>
              <ul>
                <li><strong>Proveedores de servicios:</strong> empresas que prestan servicios en nombre de CoachToWork, incluyendo proveedores de infraestructura en la nube, servicios de inteligencia artificial (como Anthropic), servicios de síntesis de voz, procesadores de pago y herramientas de análisis. Dichos proveedores únicamente pueden tratar los datos en la medida necesaria para prestar sus servicios y están sujetos a obligaciones de confidencialidad</li>
                <li><strong>Cumplimiento legal:</strong> cuando sea requerido por ley, orden judicial o autoridad competente</li>
                <li><strong>Protección de derechos:</strong> cuando sea necesario para proteger los derechos, la propiedad o la seguridad de CoachToWork, sus usuarios u terceros</li>
                <li><strong>Operaciones corporativas:</strong> en caso de fusión, adquisición, escisión u operación similar, los datos podrán ser transferidos al nuevo titular, quien quedará sujeto a esta Política</li>
              </ul>
            </section>

            <section id="p6" className="lp-section">
              <h2>6. Transferencias internacionales de datos</h2>
              <p>Los servicios de CoachToWork pueden involucrar transferencias de datos a servidores ubicados fuera del país de residencia del usuario, incluyendo países que pueden no contar con un nivel de protección equivalente al de la Unión Europea u otras jurisdicciones. En tales casos, CoachToWork adopta las salvaguardias adecuadas conforme a la normativa aplicable, tales como cláusulas contractuales tipo u otros mecanismos reconocidos.</p>
            </section>

            <section id="p7" className="lp-section">
              <h2>7. Retención de datos</h2>
              <p>CoachToWork almacena los datos personales de los usuarios de forma indefinida mientras la cuenta esté activa, con el propósito de mantener el historial de sesiones y permitir la mejora continua del Servicio. El usuario puede solicitar la eliminación de sus datos en cualquier momento conforme a lo establecido en la sección de derechos del usuario.</p>
              <p>Tras la eliminación de la cuenta o la solicitud de borrado, CoachToWork eliminará o anonimizará los datos del usuario en un plazo razonable, salvo que exista una obligación legal de conservarlos.</p>
            </section>

            <section id="p8" className="lp-section">
              <h2>8. Derechos del usuario</h2>
              <p>De acuerdo con la legislación aplicable, el usuario tiene derecho a:</p>
              <ul>
                <li><strong>Acceso:</strong> conocer qué datos personales trata CoachToWork sobre él</li>
                <li><strong>Rectificación:</strong> solicitar la corrección de datos inexactos o incompletos</li>
                <li><strong>Supresión:</strong> solicitar la eliminación de sus datos ("derecho al olvido")</li>
                <li><strong>Portabilidad:</strong> recibir sus datos en un formato estructurado y de uso común</li>
                <li><strong>Oposición:</strong> oponerse al tratamiento basado en interés legítimo</li>
                <li><strong>Limitación:</strong> solicitar la restricción del tratamiento en determinadas circunstancias</li>
                <li><strong>Revocación del consentimiento:</strong> retirar el consentimiento en cualquier momento, sin que ello afecte la licitud del tratamiento anterior</li>
              </ul>
              <p>Para ejercer cualquiera de estos derechos, el usuario puede escribir a: <a href="mailto:support@coachtowork.io">support@coachtowork.io</a></p>
              <p>CoachToWork responderá en los plazos establecidos por la legislación aplicable (en general, dentro de los 30 días siguientes a la recepción de la solicitud). Si el usuario considera que sus derechos no han sido atendidos, puede presentar una reclamación ante la autoridad de protección de datos competente en su jurisdicción.</p>
            </section>

            <section id="p9" className="lp-section">
              <h2>9. Seguridad de los datos</h2>
              <p>CoachToWork implementa medidas técnicas y organizativas apropiadas para proteger los datos personales contra acceso no autorizado, pérdida, alteración o divulgación, incluyendo el cifrado de datos en tránsito y en reposo, controles de acceso y monitoreo de seguridad.</p>
              <p>Sin embargo, ningún sistema es completamente infalible. En caso de una brecha de seguridad que afecte los datos del usuario, CoachToWork notificará a los afectados y a las autoridades competentes conforme a lo exigido por la ley.</p>
            </section>

            <section id="p10" className="lp-section">
              <h2>10. Cookies y tecnologías similares</h2>
              <p>CoachToWork puede utilizar cookies y tecnologías similares para mejorar la experiencia del usuario, analizar el uso del Servicio y personalizar el contenido. El usuario puede gestionar sus preferencias de cookies desde la configuración de su navegador.</p>
            </section>

            <section id="p11" className="lp-section">
              <h2>11. Menores de edad</h2>
              <p>Los menores de 18 años pueden utilizar el Servicio con el consentimiento de su padre, madre o tutor legal. CoachToWork no recopila conscientemente información de menores sin dicho consentimiento. Si un padre, madre o tutor detecta que su hijo ha proporcionado datos sin autorización, puede contactarnos en <a href="mailto:support@coachtowork.io">support@coachtowork.io</a> para solicitar su eliminación.</p>
              <p>En jurisdicciones donde la legislación establezca una edad mínima de consentimiento digital distinta (como los 16 años en algunos países de la Unión Europea o los 13 años bajo la COPPA en Estados Unidos), CoachToWork cumplirá con los requisitos locales aplicables.</p>
            </section>

            <section id="p12" className="lp-section">
              <h2>12. Cambios en esta Política</h2>
              <p>CoachToWork puede actualizar esta Política periódicamente. Los cambios serán publicados en la Plataforma e indicarán la fecha de la última actualización. Se recomienda al usuario revisar esta Política de forma regular.</p>
            </section>

            <section id="p13" className="lp-section">
              <h2>13. Contacto</h2>
              <p>Para consultas relacionadas con privacidad y protección de datos: <a href="mailto:support@coachtowork.io">support@coachtowork.io</a></p>
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
