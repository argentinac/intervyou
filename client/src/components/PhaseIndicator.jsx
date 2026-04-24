const DEFAULT_PHASES = ['Intro', 'Background', 'Role Questions', 'Behavioral', 'Closing']

export default function PhaseIndicator({ phase, labels }) {
  const PHASES = labels || DEFAULT_PHASES
  return (
    <div className="phase-indicator">
      {PHASES.map((name, i) => (
        <div key={name} className={`phase-item ${i === phase ? 'active' : ''} ${i < phase ? 'done' : ''}`}>
          <div className="phase-dot" />
          <span className="phase-label">{name}</span>
          {i < PHASES.length - 1 && <div className="phase-line" />}
        </div>
      ))}
    </div>
  )
}
