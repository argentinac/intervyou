import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { unlockAudio } from '../audioContext'

const DOMAINS = [
  'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com',
  'live.com', 'me.com', 'protonmail.com', 'hotmail.com.ar', 'yahoo.com.ar',
  'live.com.ar', 'outlook.com.ar', 'fastmail.com', 'zoho.com', 'msn.com',
  'aol.com', 'mail.com', 'gmx.com', 'yandex.com', 'proton.me',
]

const GoogleIcon = () => (
  <svg width="26" height="26" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
)

const EmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="3" stroke="#0F172A" strokeWidth="1.8"/>
    <path d="M2 8l10 6 10-6" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const StarIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4l4.6 9.9 10.8 1.6-7.7 7.5 1.8 10.7L20 28.8l-9.5 4.9 1.8-10.7L4.6 15.5l10.8-1.6L20 4z" stroke="#6366F1" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
)

function EmailInput({ value, onChange }) {
  const [suggestions, setSuggestions] = useState([])
  const [active, setActive] = useState(-1)
  const wrapRef = useRef(null)

  const handleChange = (e) => {
    const val = e.target.value
    onChange(val)
    const atIdx = val.indexOf('@')
    if (atIdx === -1) { setSuggestions([]); return }
    const typed = val.slice(atIdx + 1).toLowerCase()
    const local = val.slice(0, atIdx)
    if (!local) { setSuggestions([]); return }
    const matches = DOMAINS.filter(d => d.startsWith(typed) && d !== typed)
    setSuggestions(matches.slice(0, 6).map(d => `${local}@${d}`))
    setActive(-1)
  }

  const pick = (suggestion) => { onChange(suggestion); setSuggestions([]); setActive(-1) }

  const handleKeyDown = (e) => {
    if (!suggestions.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, suggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, -1)) }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); pick(suggestions[active]) }
    else if (e.key === 'Escape') { setSuggestions([]) }
    else if (e.key === 'Tab' && suggestions.length) { e.preventDefault(); pick(suggestions[active >= 0 ? active : 0]) }
  }

  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setSuggestions([]) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="auth-email-wrap" ref={wrapRef}>
      <input
        type="email"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="tu@email.com"
        required
        autoComplete="email"
        autoFocus
      />
      {suggestions.length > 0 && (
        <ul className="auth-suggestions">
          {suggestions.map((s, i) => (
            <li
              key={s}
              className={`auth-suggestion ${i === active ? 'auth-suggestion--active' : ''}`}
              onMouseDown={() => pick(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function RightPanel() {
  return (
    <div className="auth-right">
      <div className="auth-right-stairs" />
      <div className="auth-right-circle-blue" />
      <div className="auth-right-dots" />

      <div className="auth-right-content">
        <h2 className="auth-right-title">Tu próximo paso<br />empieza hoy.</h2>
        <p className="auth-right-subtitle">
          Practicá, recibí feedback personalizado y preparate mejor para tu próxima oportunidad.
        </p>
        <div className="auth-right-card">
          <div className="auth-right-card-icon">
            <StarIcon />
          </div>
          <div className="auth-right-card-body">
            <p className="auth-right-card-label">Con FeelReady podés</p>
            <ul className="auth-right-card-list">
              <li>Simular entrevistas</li>
              <li>Recibir feedback al instante</li>
              <li>Detectar qué mejorar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthForm({ onBack, context }) {
  const [step, setStep] = useState('main')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGoogle = async () => {
    unlockAudio()
    setError(null)
    setGoogleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      })
      if (error) throw error
    } catch (err) {
      setError(err.message)
      setGoogleLoading(false)
    }
  }

  const sendOtp = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: window.location.origin } })
      if (error) throw error
      setStep('otp-code')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (e) => {
    e.preventDefault()
    unlockAudio()
    setError(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token: otp.trim(), type: 'email' })
      if (error) throw error
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        {onBack && (
          <button className="auth-back" onClick={onBack}>← Volver</button>
        )}

        <div className="auth-left-content">
          {step === 'main' && (
            <>
              <div className="auth-logo">
                <img src="/logo.png" alt="FeelReady" />
              </div>

              <h1 className="auth-title">{context === 'interview' ? 'Guardá tu sesión' : 'Ingresá a tu cuenta'}</h1>
              <p className="auth-subtitle">{context === 'interview' ? 'Creá tu cuenta gratis para empezar y guardar tus resultados.' : 'Usá Google o tu email para acceder.'}</p>

              <div className="auth-card">
                <button
                  className="auth-google-btn"
                  onClick={handleGoogle}
                  disabled={googleLoading}
                  data-track="auth_google_clicked"
                >
                  <GoogleIcon />
                  {googleLoading ? 'Redirigiendo…' : 'Continuar con Google'}
                </button>

                <div className="auth-divider">
                  <span>o continuá con email</span>
                </div>

                <button
                  className="auth-email-btn"
                  onClick={() => { setError(null); setStep('otp-email') }}
                  data-track="auth_email_clicked"
                >
                  <EmailIcon />
                  Continuar con email
                </button>

                {error && <p className="auth-error">{error}</p>}
              </div>

              <p className="auth-legal">
                Al continuar, aceptás nuestros{' '}
                <a href="/terminos" target="_blank" rel="noopener noreferrer">Términos y condiciones</a>
                {' '}y{' '}
                <a href="/privacidad" target="_blank" rel="noopener noreferrer">Política de privacidad</a>.
              </p>
            </>
          )}

          {step === 'otp-email' && (
            <>
              <div className="auth-logo">
                <img src="/logo.png" alt="FeelReady" />
              </div>

              <h1 className="auth-steps-title">Ingresá tu email</h1>
              <p className="auth-steps-subtitle">Te enviamos un código de 6 dígitos para acceder.</p>

              <div className="auth-steps-form">
                <form onSubmit={sendOtp} className="auth-form">
                  <div className="auth-field">
                    <label>Email</label>
                    <EmailInput value={email} onChange={setEmail} />
                  </div>
                  {error && <p className="auth-error">{error}</p>}
                  <button type="submit" className="auth-submit" disabled={loading} data-track="auth_otp_sent">
                    {loading ? 'Enviando…' : 'Enviar código →'}
                  </button>
                </form>
                <p className="auth-switch">
                  <button onClick={() => { setStep('main'); setError(null) }}>← Volver</button>
                </p>
              </div>
            </>
          )}

          {step === 'otp-code' && (
            <>
              <div className="auth-logo">
                <img src="/logo.png" alt="FeelReady" />
              </div>

              <h1 className="auth-steps-title">Revisá tu email</h1>
              <p className="auth-steps-subtitle">
                Enviamos un código de 6 dígitos a <strong>{email}</strong>.
              </p>

              <div className="auth-steps-form">
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
                  <button type="submit" className="auth-submit" disabled={loading || otp.length < 6} data-track="auth_otp_verified">
                    {loading ? 'Verificando…' : 'Ingresar'}
                  </button>
                </form>
                <p className="auth-switch">
                  <button onClick={() => { setStep('otp-email'); setOtp(''); setError(null) }}>
                    ← Cambiar email
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <RightPanel />
    </div>
  )
}
