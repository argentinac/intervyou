// Lightweight session header for non-interview simulations.
// Replaces the PhaseIndicator step-by-step bar. Shows just the simulation
// title + interlocutor context.

export default function SimulationHeader({ simulation }) {
  if (!simulation) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 12, padding: '8px 16px',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', letterSpacing: 0.1 }}>
          {simulation.uiCopy?.sessionTitle || simulation.title}
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
