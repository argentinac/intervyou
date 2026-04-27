export default function MyProfile() {
  return (
    <div className="iv-page">
      <div className="db-page-header">
        <h2>Mi perfil profesional</h2>
      </div>

      <div className="iv-empty">
        <div className="myprofile-art">
          <svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#818cf8"/>
                <stop offset="100%" stopColor="#6366f1"/>
              </linearGradient>
              <linearGradient id="pg2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#c7d2fe"/>
                <stop offset="100%" stopColor="#a5b4fc"/>
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#6366f1" floodOpacity="0.2"/>
              </filter>
            </defs>
            {/* Card base */}
            <rect x="20" y="50" width="120" height="90" rx="16" fill="url(#pg1)" filter="url(#shadow)"/>
            <rect x="20" y="50" width="120" height="90" rx="16" fill="white" opacity="0.08"/>
            {/* Avatar circle */}
            <circle cx="80" cy="44" r="28" fill="url(#pg2)" filter="url(#shadow)"/>
            <circle cx="80" cy="38" r="12" fill="white" opacity="0.7"/>
            <ellipse cx="80" cy="58" rx="18" ry="10" fill="white" opacity="0.5"/>
            {/* Lines */}
            <rect x="44" y="100" width="72" height="6" rx="3" fill="white" opacity="0.4"/>
            <rect x="54" y="114" width="52" height="5" rx="2.5" fill="white" opacity="0.25"/>
            <rect x="60" y="126" width="40" height="4" rx="2" fill="white" opacity="0.18"/>
            {/* Badge */}
            <circle cx="122" cy="58" r="12" fill="#f59e0b"/>
            <text x="122" y="63" textAnchor="middle" fontSize="13">⚡</text>
          </svg>
        </div>
        <h3>Próximamente</h3>
        <p>Podrás cargar tu CV, tu perfil de LinkedIn y construir tu perfil profesional completo para entrevistas más personalizadas.</p>
      </div>
    </div>
  )
}
