import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function AuthForm({ onBack }) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handle = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        })
        if (error) throw error
        setSuccess('Revisá tu email — te enviamos un link para restablecer tu contraseña.')
      } else if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) throw error
      } else {
        const { error } = await signUp(email, password)
        if (error) throw error
        setSuccess('Revisá tu email para confirmar tu cuenta.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (next) => { setMode(next); setError(null); setSuccess(null) }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {onBack && (
          <button className="auth-back" onClick={onBack}>← Volver</button>
        )}
        <div className="auth-logo">
          <img src="/logo.png" alt="intervyou" style={{ height: 44, width: 'auto' }} />
        </div>

        <h1 className="auth-title">
          {mode === 'login' ? 'Iniciar sesión' : mode === 'signup' ? 'Crear cuenta' : 'Restablecer contraseña'}
        </h1>

        <form onSubmit={handle} className="auth-form">
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              autoComplete="email"
            />
          </div>

          {mode !== 'reset' && (
            <div className="auth-field">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>
          )}

          {mode === 'login' && (
            <button type="button" className="auth-forgot" onClick={() => switchMode('reset')}>
              ¿Olvidaste tu contraseña?
            </button>
          )}

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading
              ? 'Un segundo…'
              : mode === 'login' ? 'Entrar'
              : mode === 'signup' ? 'Crear cuenta'
              : 'Enviar link de recuperación'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? (
            <>¿No tenés cuenta? <button onClick={() => switchMode('signup')}>Registrate</button></>
          ) : mode === 'signup' ? (
            <>¿Ya tenés cuenta? <button onClick={() => switchMode('login')}>Iniciá sesión</button></>
          ) : (
            <><button onClick={() => switchMode('login')}>← Volver al inicio de sesión</button></>
          )}
        </p>
      </div>
    </div>
  )
}
