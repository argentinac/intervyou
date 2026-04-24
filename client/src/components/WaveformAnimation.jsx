export default function WaveformAnimation({ active }) {
  return (
    <div className={`waveform ${active ? 'waveform--active' : ''}`}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="waveform-bar" style={{ animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  )
}
