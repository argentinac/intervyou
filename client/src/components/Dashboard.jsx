import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import MyInterviews from './MyInterviews'
import MyProgress from './MyProgress'
import MyProfile from './MyProfile'
import SettingsPage from './SettingsPage'

const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
)
const IconList = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)
const IconTrend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
  </svg>
)
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
const IconCrown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 20h20v2H2zM3 8l4 8h10l4-8-5 3-4-6-4 6z"/>
  </svg>
)

function HomeSection({ onNewInterview, user, fullName }) {
  const firstName = fullName
    ? fullName.split(' ')[0]
    : (user?.email?.split('@')[0] ?? 'ahí')

  return (
    <div className="db-home">
      <div className="db-welcome">
        <div className="db-welcome-text">
          <h1>Hola, {firstName} 👋</h1>
          <p>Bienvenido a tu espacio de entrenamiento. ¿Listo para practicar?</p>
        </div>
      </div>

      <div className="db-quick-actions">
        <button className="db-cta-card" onClick={onNewInterview}>
          <div className="db-cta-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
            </svg>
          </div>
          <div>
            <div className="db-cta-title">Nueva entrevista</div>
            <div className="db-cta-sub">Empezá una simulación ahora</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft:'auto', opacity:0.4 }}>
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function Dashboard({ onNewInterview, onSignOut }) {
  const { user, signOut } = useAuth()
  const [section, setSection] = useState('home')
  const [profile, setProfile] = useState(null)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    if (!user || !supabase) return
    supabase.from('profiles').select('tier, full_name').eq('id', user.id).single()
      .then(({ data }) => setProfile(data))
    supabase.from('subscriptions').select('tier, current_period_end, status').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => setSubscription(data))
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    onSignOut()
  }

  const isPremium = profile?.tier === 'premium'
  const daysLeft = subscription?.current_period_end
    ? Math.max(0, Math.ceil((new Date(subscription.current_period_end) - Date.now()) / 86400000))
    : null

  const navItems = [
    { id: 'home',       label: 'Inicio',               icon: <IconHome /> },
    { id: 'new',        label: 'Nueva entrevista',      icon: <IconPlus />, primary: true },
    { id: 'interviews', label: 'Mis entrevistas',       icon: <IconList /> },
    { id: 'progress',   label: 'Mi progreso',           icon: <IconTrend /> },
    { id: 'profile',    label: 'Mi perfil profesional', icon: <IconUser /> },
    { id: 'settings',   label: 'Configuración',         icon: <IconSettings /> },
  ]

  const handleNav = (id) => {
    if (id === 'new') { onNewInterview(); return }
    setSection(id)
  }

  return (
    <div className="db-layout">
      <aside className="db-sidebar">
        <div className="db-sidebar-logo">
          <img src="/logo.png" alt="intervyou" style={{ height: 32, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
        </div>

        <nav className="db-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`db-nav-item ${item.primary ? 'db-nav-item--primary' : ''} ${section === item.id ? 'db-nav-item--active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              <span className="db-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="db-sidebar-bottom">
          <div className="db-plan-badge">
            {isPremium ? (
              <>
                <div className="db-plan-row">
                  <span className="db-plan-crown"><IconCrown /></span>
                  <span className="db-plan-name">Plan Premium</span>
                </div>
                {daysLeft !== null && (
                  <div className="db-plan-sub">{daysLeft} días restantes</div>
                )}
              </>
            ) : (
              <>
                <div className="db-plan-row">
                  <span className="db-plan-name">Plan Free</span>
                </div>
                <button className="db-plan-upgrade">Upgrade a Premium →</button>
              </>
            )}
          </div>

          <button className="db-signout" onClick={handleSignOut}>
            <IconLogout /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="db-content">
        {section === 'home'       && <HomeSection onNewInterview={onNewInterview} user={user} fullName={profile?.full_name} />}
        {section === 'interviews' && <MyInterviews onNewInterview={onNewInterview} />}
        {section === 'progress'   && <MyProgress />}
        {section === 'profile'    && <MyProfile />}
        {section === 'settings'   && <SettingsPage onSignOut={handleSignOut} />}
      </main>
    </div>
  )
}
