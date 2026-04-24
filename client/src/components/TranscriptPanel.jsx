import { useEffect, useRef } from 'react'

export default function TranscriptPanel({ transcript }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcript])

  if (transcript.length === 0) {
    return (
      <div className="transcript-panel transcript-panel--empty">
        <p>The conversation will appear here…</p>
      </div>
    )
  }

  return (
    <div className="transcript-panel">
      {transcript.map((entry, i) => (
        <div key={i} className={`transcript-entry transcript-entry--${entry.role}`}>
          <span className="transcript-role">
            {entry.role === 'interviewer' ? 'Interviewer' : 'You'}
          </span>
          <p className="transcript-text">{entry.text}</p>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
