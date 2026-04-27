import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthForm({ onBack }) {
  const [step, setStep] = useState('email') // 'email' | 'otp'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendOtp = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
      if (error) throw error
      setStep('otp')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token: otp.trim(), type: 'email' })
      if (error) throw error
      // AuthContext onAuthStateChange will pick up the new session automatically
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {onBack && (
          <button className="auth-back" onClick={onBack}>← Volver</button>
        )}
        <div className="auth-logo">
          <img src="/logo.png" alt="intervyou" style={{ height: 44, width: 'auto' }} />
        </div>

        {step === 'email' ? (
          <>
            <h1 className="auth-title">Ingresá tu email</h1>
            <p className="auth-subtitle">Te enviamos un código de 6 dígitos para acceder.</p>

            <form onSubmit={sendOtp} className="auth-form">
              <div className="auth-field">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Enviando…' : 'Enviar código →'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="auth-title">Revisá tu email</h1>
            <p className="auth-subtitle">
              Enviamos un código de 6 dígitos a <strong>{email}</strong>.
            </p>

            <form onSubmit={verifyOtp} className="auth-form">
              <div className="auth-field">
                <label>Código</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  required
                  autoComplete="one-time-code"
                  autoFocus
                  className="auth-otp-input"
                />
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" className="auth-submit" disabled={loading || otp.length < 6}>
                {loading ? 'Verificando…' : 'Ingresar'}
              </button>
            </form>

            <p className="auth-switch">
              <button onClick={() => { setStep('email'); setOtp(''); setError(null) }}>
                ← Cambiar email
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
