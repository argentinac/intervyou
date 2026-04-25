import { useState } from 'react'
import Landing from './components/Landing'
import SetupForm from './components/SetupForm'
import InterviewSession from './components/InterviewSession'

export default function App() {
  const [view, setView] = useState('landing') // 'landing' | 'setup' | 'interview'
  const [config, setConfig] = useState(null)

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
