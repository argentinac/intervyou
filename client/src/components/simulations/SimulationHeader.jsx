// Lightweight session header for non-interview simulations.
// Replaces the PhaseIndicator step-by-step bar. Shows the named interlocutor
// (e.g. "María Sánchez — Manager directo") so the conversation feels personal.

export default function SimulationHeader({ simulation, interlocutorName, interlocutorRole }) {
  if (!simulation) return null
  const role = interlocutorRole || simulation.interlocutorRole || simulation.uiCopy?.interlocutorLabel
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 12, padding: '8px 16px',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', letterSpacing: 0.1 }}>
          {interlocutorName ? `${interlocutorName} — ${role}` : (simulation.uiCopy?.sessionTitle || simulation.title)}
        </span>
        {simulation.uiCopy?.interlocutorContext && (
          <span style={{ fontSize: 11, color: '#6B7280' }}>
            {simulation.uiCopy.interlocutorContext}
          </span>
        )}
      </div>
    </div>
  )
}
