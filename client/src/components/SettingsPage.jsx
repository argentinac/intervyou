import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function SettingsPage({ onSignOut }) {
  const { user, signOut } = useAuth()
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

  return (
    <div className="iv-page">
      <div className="db-page-header">
        <h2>Configuración</h2>
      </div>

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
    </div>
  )
}
