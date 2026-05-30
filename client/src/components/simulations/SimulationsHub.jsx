import { useState } from 'react'
import { ALL_SIMULATIONS, CATEGORIES, getSimulationsByCategory } from '../../lib/simulations/catalog'
import { track } from '../../lib/analytics'

// Inline SVG icons. Add new ones here as the catalog grows.
const ICON_PATHS = {
  TrendingUp:           'M22 7L13.5 15.5 8.5 10.5 2 17 M16 7H22V13',
  GraduationCap:        'M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5',
  Plane:                'M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z',
  Heart:                'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  Scale:                'M16 16l3-8 3 8c-2 1-4 1-6 0z M2 16l3-8 3 8c-2 1-4 1-6 0z M7 21h10 M12 3v18 M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2',
  Rocket:               'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
  Sparkles:             'M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5.6 5.6l2.1 2.1 M16.3 16.3l2.1 2.1 M5.6 18.4l2.1-2.1 M16.3 7.7l2.1-2.1',
  Clock:                'M12 8v4l2 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  LogOut:               'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
  // Work
  Briefcase:            'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2',
  Presentation:         'M2 3h20v14H2z M8 21h8 M12 17v4',
  Award:                'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M8.21 13.89L7 23l5-3 5 3-1.21-9.12',
  ArrowRightLeft:       'M8 3L4 7l4 4 M4 7h16 M16 21l4-4-4-4 M20 17H4',
  MessageCircleWarning: 'M7.9 20A9 9 0 1 0 4 16.1L2 22z M12 8v4 M12 16h.01',
  UserMinus:            'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3z M8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3z M8 14c-3.31 0-6 1.34-6 3v1h8 M20 14h-4',
  Zap:                  'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  Handshake:            'M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z M12 5.36 8.87 8.5a2.13 2.13 0 0 0 0 3h0a2.13 2.13 0 0 0 3.02 0L12 11l.11.5a2.13 2.13 0 0 0 3.02 0h0a2.13 2.13 0 0 0 0-3z',
  Building2:            'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2 M10 6h4 M10 10h4 M10 14h4 M10 18h4',
  // Study
  ClipboardList:        'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2z M9 12h6 M9 16h6 M9 8h2',
  Scroll:               'M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4 M5 8h14',
  // Visa
  Flag:                 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7',
  BadgeCheck:           'M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z M9 12l2 2 4-4',
  Luggage:              'M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6z M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M12 12v4 M10 14h4',
  Stamp:                'M5 22h14 M19.27 13.73A2.5 2.5 0 0 0 17 13h-1a2 2 0 0 1-2-2V7l-2.45-2.45A2 2 0 0 0 10.14 4H6a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1a2.5 2.5 0 0 1 2.27 1.73L10 17h4l.73-3.27z M12 22v-5',
  // Love
  HeartHandshake:       'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08h0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66 M18 15l-2-2 M15 18l-2-2',
  Home:                 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  Gem:                  'M6 3h12l4 6-10 13L2 9Z M2 9h20 M12 22V9 M12 9 6 3 M12 9l6-6',
  HeartCrack:           'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z M12 13l-2-4-2 4 4 1-2 4',
  Users:                'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
}

function Icon({ name, size = 20 }) {
  const d = ICON_PATHS[name] || ICON_PATHS.Sparkles
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

const CATEGORY_COLORS = {
  work:  { bg: '#EEF2FF', fg: '#4338CA' },
  study: { bg: '#ECFEFF', fg: '#0E7490' },
  visa:  { bg: '#FEF3C7', fg: '#92400E' },
  love:  { bg: '#FCE7F3', fg: '#9D174D' },
  legal: { bg: '#F3F4F6', fg: '#374151' },
  other: { bg: '#F0FDF4', fg: '#166534' },
}

function CategoryBadge({ category }) {
  const label = CATEGORIES.find((c) => c.id === category)?.label || category
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.other
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: colors.bg, color: colors.fg, letterSpacing: 0.2 }}>
      {label}
    </span>
  )
}

function SimulationCard({ simulation, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16,
        padding: 20, textAlign: 'left', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 12, minHeight: 180,
        transition: 'all 0.15s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(124, 58, 237, 0.10)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)'; e.currentTarget.style.transform = 'none' }}
      data-track={`simulation_card_clicked_${simulation.id}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F5F3FF', color: '#6D28D9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={simulation.icon} />
        </div>
        <CategoryBadge category={simulation.category} />
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 4 }}>{simulation.title}</div>
        <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{simulation.shortDescription}</div>
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9CA3AF' }}>
        <Icon name="Clock" size={13} />
        <span>{simulation.durationMinutes} min</span>
      </div>
    </button>
  )
}

export default function SimulationsHub({ onStartSimulation, onStartCustomSimulation }) {
  const [filter, setFilter] = useState('all')
  const visible = filter === 'all' ? ALL_SIMULATIONS : getSimulationsByCategory(filter)

  const handleStart = (sim) => {
    track('simulation_card_clicked', { simulation_id: sim.id, category: sim.category })
    onStartCustomSimulation(sim.shortDescription)
  }

  return (
    <div className="iv-page">
      <div className="db-page-header">
        <h2>Simulaciones</h2>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>
          Practicá conversaciones difíciles antes de tenerlas en la vida real.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>Todas</FilterChip>
        {CATEGORIES.map((c) => {
          const count = getSimulationsByCategory(c.id).length
          if (count === 0) return null
          return (
            <FilterChip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
              {c.label} <span style={{ opacity: 0.6, marginLeft: 4 }}>{count}</span>
            </FilterChip>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {visible.map((sim) => (
          <SimulationCard key={sim.id} simulation={sim} onClick={() => handleStart(sim)} />
        ))}
        {visible.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
            Pronto van a aparecer simulaciones de esta categoría.
          </div>
        )}
      </div>
    </div>
  )
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px', borderRadius: 999, fontSize: 13, fontWeight: 500,
        border: '1px solid', cursor: 'pointer', fontFamily: 'inherit',
        borderColor: active ? '#7C3AED' : '#E5E7EB',
        background: active ? '#7C3AED' : '#fff',
        color: active ? '#fff' : '#374151',
        transition: 'all 0.12s ease',
      }}
    >
      {children}
    </button>
  )
}
