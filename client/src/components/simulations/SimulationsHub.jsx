import { useState } from 'react'
import { ALL_SIMULATIONS, CATEGORIES, getSimulationsByCategory } from '../../lib/simulations/catalog'
import { track } from '../../lib/analytics'

// Inline SVG icons. Add new ones here as the catalog grows.
const ICON_PATHS = {
  TrendingUp:    'M22 7L13.5 15.5 8.5 10.5 2 17 M16 7H22V13',
  GraduationCap: 'M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5',
  Plane:         'M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z',
  Heart:         'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  Scale:         'M16 16l3-8 3 8c-2 1-4 1-6 0z M2 16l3-8 3 8c-2 1-4 1-6 0z M7 21h10 M12 3v18 M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2',
  Rocket:        'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
  Sparkles:      'M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5.6 5.6l2.1 2.1 M16.3 16.3l2.1 2.1 M5.6 18.4l2.1-2.1 M16.3 7.7l2.1-2.1',
  Clock:         'M12 8v4l2 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  LogOut:        'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
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
