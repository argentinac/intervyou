import { useRef, useState } from 'react'

function shuffleWithPinInFirst4(arr) {
  const pinId = 'entrevista_laboral'
  const pinned = arr.find(c => c.id === pinId)
  const rest = arr.filter(c => c.id !== pinId)
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]]
  }
  const pos = Math.floor(Math.random() * 4)
  rest.splice(pos, 0, pinned)
  return rest
}

const CARDS = [
  {
    id: 'entrevista_laboral',
    label: 'Entrevista laboral',
    img: '/carousel/01_visual_entrevista_laboral.png',
    bg: '#ECEBFF',
    situation: 'Practicar una entrevista de trabajo',
  },
  {
    id: 'primera_cita',
    label: 'Primera cita',
    img: '/carousel/02_visual_primera_cita.png',
    bg: '#EEF6EA',
    situation: 'Practicar una primera cita romántica',
  },
  {
    id: 'visa_usa',
    label: 'Visa a Estados Unidos',
    img: '/carousel/03_visual_visa_estados_unidos.png',
    bg: '#F0F1F5',
    situation: 'Prepararme para la entrevista consular de visa a Estados Unidos',
  },
  {
    id: 'confrontacion_pareja',
    label: 'Confrontación a pareja',
    img: '/carousel/04_visual_confrontacion_pareja.png',
    bg: '#EDF4EE',
    situation: 'Tener una conversación difícil con mi pareja sobre algo que me preocupa',
  },
  {
    id: 'pedir_aumento',
    label: 'Pedido de aumento de sueldo',
    img: '/carousel/05_visual_aumento_sueldo.png',
    bg: '#F1EEF7',
    situation: 'Pedir un aumento de sueldo a mi jefe',
  },
  {
    id: 'pedir_ascenso',
    label: 'Pedido de ascenso',
    img: '/carousel/06_visual_ascenso.png',
    bg: '#F3F4EA',
    situation: 'Pedir un ascenso o promoción en mi trabajo',
  },
]

function NavButton({ direction, onClick }) {
  return (
    <button onClick={onClick} className="sc-nav-btn" aria-label={direction === 'prev' ? 'Anterior' : 'Siguiente'}>
      {direction === 'prev' ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </button>
  )
}

function CarouselCard({ card, onAction, onNewInterview }) {
  function handleClick() {
    if (card.id === 'entrevista_laboral') {
      onNewInterview?.()
    } else {
      onAction(card.situation)
    }
  }
  return (
    <button
      className="sc-card"
      style={{ background: card.bg }}
      onClick={handleClick}
      aria-label={card.label}
    >
      <div className="sc-card-img-wrap">
        <img src={card.img} alt="" className="sc-card-img" draggable={false} />
      </div>

      <div className="sc-card-text">
        <h3 className="sc-card-label">{card.label}</h3>
      </div>

      <div className="sc-card-arrow" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </button>
  )
}

export default function SimulationCarousel({ onStartCustomSimulation, onNewInterview }) {
  const trackRef = useRef(null)
  const [cards] = useState(() => shuffleWithPinInFirst4(CARDS))

  function scroll(dir) {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: dir === 'next' ? 316 : -316, behavior: 'smooth' })
  }

  return (
    <div className="sc-section">
      <div className="sc-header">
        <h2 className="sc-title">Simulaciones a ejercitar</h2>
        <div className="sc-nav">
          <NavButton direction="prev" onClick={() => scroll('prev')} />
          <NavButton direction="next" onClick={() => scroll('next')} />
        </div>
      </div>
      <div className="sc-track" ref={trackRef}>
        {cards.map((card) => (
          <CarouselCard key={card.id} card={card} onAction={onStartCustomSimulation} onNewInterview={onNewInterview} />
        ))}
      </div>
    </div>
  )
}
