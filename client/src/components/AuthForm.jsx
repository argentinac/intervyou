import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function AuthForm() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
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
      if (mode === 'login') {
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

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo.png" alt="intervyou" style={{ height: 44, width: 'auto' }} />
        </div>

        <h1 className="auth-title">
          {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
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

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Un segundo…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? (
            <>¿No tenés cuenta? <button onClick={() => { setMode('signup'); setError(null) }}>Registrate</button></>
          ) : (
            <>¿Ya tenés cuenta? <button onClick={() => { setMode('login'); setError(null) }}>Iniciá sesión</button></>
          )}
        </p>
      </div>
    </div>
  )
}
