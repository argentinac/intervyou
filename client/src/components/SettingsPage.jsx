import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const CHECKOUT_URL = import.meta.env.VITE_STRIPE_CHECKOUT_URL || null

function PlanSection({ userId }) {
  const [profile, setProfile] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || !supabase) { setLoading(false); return }
    Promise.all([
      supabase.from('profiles').select('tier').eq('id', userId).single(),
      supabase.from('subscriptions').select('tier, current_period_end, status').eq('user_id', userId).maybeSingle(),
    ]).then(([{ data: p }, { data: s }]) => {
      setProfile(p)
      setSubscription(s)
      setLoading(false)
    })
  }, [userId])

  if (loading) return <div className="settings-plan-loading" />

  const isPremium = profile?.tier === 'premium'
  const daysLeft = subscription?.current_period_end
    ? Math.max(0, Math.ceil((new Date(subscription.current_period_end) - Date.now()) / 86400000))
    : null
  const renewDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null

  if (isPremium) {
    return (
      <div className="settings-plan-premium">
        <div className="settings-plan-crown">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 20h20v2H2zM3 8l4 8h10l4-8-5 3-4-6-4 6z"/>
          </svg>
        </div>
        <div className="settings-plan-info">
          <div className="settings-plan-name">Plan Premium</div>
          {daysLeft !== null && (
            <div className="settings-plan-sub">
              {daysLeft > 0
                ? `Vence en ${daysLeft} días · ${renewDate}`
                : `Venció el ${renewDate}`}
            </div>
          )}
        </div>
        {CHECKOUT_URL && (
          <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="settings-plan-manage-btn">
            Gestionar suscripción →
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="settings-plan-free">
      <div className="settings-plan-free-top">
        <div>
          <div className="settings-plan-name">Plan Free</div>
          <div className="settings-plan-sub">Acceso limitado a funciones básicas</div>
        </div>
      </div>

      <div className="settings-plan-features">
        <div className="settings-plan-feature settings-plan-feature--free">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Entrevistas básicas (RRHH y técnica)
        </div>
        <div className="settings-plan-feature settings-plan-feature--free">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Feedback con puntaje
        </div>
        <div className="settings-plan-feature settings-plan-feature--locked">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Simulación real y modo Coach
        </div>
        <div className="settings-plan-feature settings-plan-feature--locked">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Análisis de progreso detallado
        </div>
        <div className="settings-plan-feature settings-plan-feature--locked">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Entrevistas ilimitadas
        </div>
      </div>

      {CHECKOUT_URL ? (
        <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="settings-upgrade-btn">
          Upgradear a Premium →
        </a>
      ) : (
        <button className="settings-upgrade-btn settings-upgrade-btn--soon" disabled>
          Upgrade a Premium — Próximamente
        </button>
      )}
    </div>
  )
}

export default function SettingsPage({ onSignOut }) {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('account')
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user || !supabase) return
    supabase.from('profiles').select('full_name').eq('id', user.id).single()
      .then(({ data }) => { if (data?.full_name) setFullName(data.full_name) })
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!supabase) return
    setSaving(true)
    await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSignOut = async () => {
    await signOut()
    onSignOut()
  }

  const tabs = [
    { id: 'account', label: 'Mi cuenta' },
    { id: 'plan',    label: 'Mi plan' },
  ]

  return (
    <div className="iv-page">
      <div className="db-page-header">
        <h2>Configuración</h2>
      </div>

      <div className="settings-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`settings-tab ${activeTab === t.id ? 'settings-tab--active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'account' && (
        <>
          <div className="settings-card">
            <h3>Tu cuenta</h3>
            <form onSubmit={handleSave} className="settings-form">
              <div className="auth-field">
                <label>Email</label>
                <input type="email" value={user?.email ?? ''} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              </div>
              <div className="auth-field">
                <label>Nombre completo</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Tu nombre"
                />
              </div>
              <button type="submit" className="db-btn-primary" disabled={saving} style={{ alignSelf: 'flex-start' }}>
                {saving ? 'Guardando…' : saved ? 'Guardado ✓' : 'Guardar cambios'}
              </button>
            </form>
          </div>

          <div className="settings-card settings-card--danger">
            <h3>Sesión</h3>
            <p>Al cerrar sesión vas a tener que volver a iniciar sesión para acceder a tu cuenta.</p>
            <button className="settings-signout-btn" onClick={handleSignOut}>Cerrar sesión</button>
          </div>
        </>
      )}

      {activeTab === 'plan' && (
        <div className="settings-card">
          <h3>Mi plan</h3>
          <PlanSection userId={user?.id} />
        </div>
      )}
    </div>
  )
}
