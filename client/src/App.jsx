import { useState, useEffect, Component } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthForm from './components/AuthForm'
import Landing from './components/Landing'
import SetupForm from './components/SetupForm'
import InterviewSession from './components/InterviewSession'
import Dashboard from './components/Dashboard'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#fafafa', fontFamily:'Inter,system-ui,sans-serif', gap:16, padding:24 }}>
          <p style={{ fontSize:16, color:'#374151', textAlign:'center' }}>Algo salió mal. Recargá la página para continuar.</p>
          <button onClick={() => window.location.reload()} style={{ padding:'10px 24px', background:'#111827', color:'#fff', border:'none', borderRadius:10, fontSize:14, cursor:'pointer' }}>
            Recargar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function AppInner() {
  const { user } = useAuth()
  const [view, setView] = useState('landing') // 'landing' | 'auth' | 'dashboard' | 'interview'
  const [interviewConfig, setInterviewConfig] = useState(null)
  const [interviewReturn, setInterviewReturn] = useState('landing')

  useEffect(() => {
    if (user && view === 'auth') setView('dashboard')
  }, [user])

  if (user === undefined) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#fafafa' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (view === 'landing') {
    return (
      <Landing
        user={user}
        onLogin={() => setView('auth')}
        onTryFree={() => { setInterviewReturn('landing'); setView('interview') }}
        onDashboard={() => setView('dashboard')}
      />
    )
  }

  if (view === 'auth') {
    return <AuthForm onBack={() => setView('landing')} />
  }

  if (view === 'interview') {
    if (!interviewConfig) {
      return (
        <SetupForm
          onSubmit={(cfg) => setInterviewConfig(cfg)}
          onBack={() => setView(interviewReturn)}
        />
      )
    }
    return (
      <InterviewSession
        config={interviewConfig}
        onEnd={() => { setInterviewConfig(null); setView(interviewReturn) }}
        onDashboard={user ? () => { setInterviewConfig(null); setView('dashboard') } : undefined}
      />
    )
  }

  if (view === 'dashboard') {
    if (!user) { setView('auth'); return null }
    return (
      <Dashboard
        onNewInterview={() => { setInterviewReturn('dashboard'); setView('interview') }}
        onSignOut={() => setView('landing')}
      />
    )
  }

  return null
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ErrorBoundary>
  )
}
