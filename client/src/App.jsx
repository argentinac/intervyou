import { useState, Component } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthForm from './components/AuthForm'
import Landing from './components/Landing'
import SetupForm from './components/SetupForm'
import InterviewSession from './components/InterviewSession'

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
  const [view, setView] = useState('landing')
  const [config, setConfig] = useState(null)

  // Loading auth state
  if (user === undefined) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#fafafa' }}>
        <div className="spinner" />
      </div>
    )
  }

  // Not logged in
  if (user === null) return <AuthForm />

  if (view === 'landing') {
    return <Landing onStart={() => setView('setup')} />
  }

  if (view === 'setup') {
    return (
      <SetupForm
        onSubmit={(cfg) => { setConfig(cfg); setView('interview') }}
        onBack={() => setView('landing')}
      />
    )
  }

  return (
    <InterviewSession
      config={config}
      onEnd={() => { setConfig(null); setView('landing') }}
    />
  )
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
