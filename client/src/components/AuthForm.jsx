import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const DOMAINS = [
  'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com',
  'live.com', 'me.com', 'protonmail.com', 'hotmail.com.ar', 'yahoo.com.ar',
  'live.com.ar', 'outlook.com.ar', 'fastmail.com', 'zoho.com', 'msn.com',
  'aol.com', 'mail.com', 'gmx.com', 'yandex.com', 'proton.me',
]

function EmailInput({ value, onChange }) {
  const [suggestions, setSuggestions] = useState([])
  const [active, setActive] = useState(-1)
  const wrapRef = useRef(null)

  const handleChange = (e) => {
    const val = e.target.value
    onChange(val)
    const atIdx = val.indexOf('@')
    if (atIdx === -1) {
      setSuggestions([])
      return
    }
    const typed = val.slice(atIdx + 1).toLowerCase()
    const local = val.slice(0, atIdx)
    if (!local) { setSuggestions([]); return }
    const matches = DOMAINS.filter(d => d.startsWith(typed) && d !== typed)
    setSuggestions(matches.slice(0, 6).map(d => `${local}@${d}`))
    setActive(-1)
  }

  const pick = (suggestion) => {
    onChange(suggestion)
    setSuggestions([])
    setActive(-1)
  }

  const handleKeyDown = (e) => {
    if (!suggestions.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, suggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, -1)) }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); pick(suggestions[active]) }
    else if (e.key === 'Escape') { setSuggestions([]) }
    else if (e.key === 'Tab' && suggestions.length) { e.preventDefault(); pick(suggestions[active >= 0 ? active : 0]) }
  }

  // Close on outside click
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
                <EmailInput value={email} onChange={setEmail} />
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
