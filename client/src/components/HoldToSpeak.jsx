export default function HoldToSpeak({ onStart, onStop, disabled, isRecording }) {
  const handlePointerDown = (e) => {
    e.preventDefault()
    if (!disabled) onStart()
  }

  const handlePointerUp = (e) => {
    e.preventDefault()
    if (isRecording) onStop()
  }

  return (
    <button
      className={`hold-btn ${isRecording ? 'hold-btn--recording' : ''} ${disabled ? 'hold-btn--disabled' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      disabled={disabled}
    >
      <span className="hold-btn-icon">{isRecording ? '⏹' : '🎙'}</span>
      <span className="hold-btn-label">
        {isRecording ? 'Release to send' : 'Hold to speak'}
      </span>
      {isRecording && <span className="hold-btn-pulse" />}
    </button>
  )
}
