import { useState } from 'react'
import SetupForm from './components/SetupForm'
import InterviewSession from './components/InterviewSession'

export default function App() {
  const [config, setConfig] = useState(null)

  return (
    <div className="app">
      {config === null ? (
        <SetupForm onSubmit={setConfig} />
      ) : (
        <InterviewSession config={config} onEnd={() => setConfig(null)} />
      )}
    </div>
  )
}
