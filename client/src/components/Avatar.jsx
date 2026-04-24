export default function Avatar({ name, isSpeaking, isYou }) {
  const initials = name
    .split(' ')
    .filter((w) => /^[a-zA-ZÀ-ÿ]/.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className={`avatar-wrap ${isSpeaking ? 'avatar-wrap--speaking' : ''}`}>
      <div className="avatar-ring avatar-ring--3" />
      <div className="avatar-ring avatar-ring--2" />
      <div className="avatar-ring avatar-ring--1" />
      <div className={`avatar-circle ${isYou ? 'avatar-circle--you' : 'avatar-circle--interviewer'}`}>
        <span className="avatar-initials">{initials}</span>
      </div>
      <span className="avatar-name">{isYou ? `${name} (You)` : name}</span>
    </div>
  )
}
