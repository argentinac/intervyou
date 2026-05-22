import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/* ─── CSS ──────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

@keyframes ob-rise {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes ob-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes ob-check-pop {
  from { opacity: 0; transform: scale(0.6); }
  to   { opacity: 1; transform: scale(1); }
}

.ob-page {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  color: #0f172a;
}

/* ── Header ── */
.ob-header {
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px 32px;
  height: 64px;
  box-sizing: border-box;
}
.ob-header-side {
  min-width: 160px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.ob-header-side--right {
  justify-content: flex-end;
}
.ob-back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  flex-shrink: 0;
  font-family: inherit;
}
.ob-back-btn:hover {
  border-color: #c7d2fe;
  color: #4f46e5;
  background: #f4f3ff;
}
.ob-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ob-logo {
  height: 28px;
  width: auto;
  display: block;
  flex-shrink: 0;
}
.ob-dots-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.ob-dots {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ob-dot {
  height: 6px;
  width: 6px;
  border-radius: 999px;
  background: #e2e8f0;
  transition: width 0.35s cubic-bezier(.22,.61,.36,1), background-color 0.35s cubic-bezier(.22,.61,.36,1), opacity 0.35s;
}
.ob-dot--active {
  width: 22px;
  background: #4f46e5;
}
.ob-dot--past {
  opacity: 0.55;
}
.ob-skip {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 13.5px;
  font-weight: 500;
  color: #94a3b8;
  padding: 8px 10px;
  border-radius: 8px;
  transition: color 0.15s, background 0.15s;
  font-family: inherit;
}
.ob-skip:hover {
  color: #1e293b;
  background: #f8f9fc;
}

/* ── Body / Stack ── */
.ob-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px 24px 56px;
}
.ob-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  width: 100%;
  max-width: 640px;
  text-align: center;
}
.ob-stack--wide {
  max-width: 720px;
}

/* ── Typography ── */
.ob-title {
  font-size: 44px;
  line-height: 1.05;
  letter-spacing: -0.028em;
  font-weight: 700;
  margin: 0;
  text-wrap: balance;
  max-width: 620px;
}
.ob-accent {
  background: linear-gradient(135deg, #7C3AED 0%, #4F8FFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.ob-sub {
  font-size: 17px;
  line-height: 1.55;
  color: #64748b;
  max-width: 520px;
  margin: 0;
  text-wrap: pretty;
}

/* ── Rise animation helpers ── */
.ob-rise { animation: ob-rise 0.7s cubic-bezier(.22,.61,.36,1) both; }
.ob-d-1  { animation-delay: 60ms; }
.ob-d-2  { animation-delay: 140ms; }
.ob-d-3  { animation-delay: 220ms; }
.ob-d-4  { animation-delay: 300ms; }
.ob-d-5  { animation-delay: 400ms; }
.ob-d-6  { animation-delay: 500ms; }
.ob-d-7  { animation-delay: 620ms; }

/* ── S1: Purpose cards ── */
.ob-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-width: 580px;
  width: 100%;
}
.ob-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 16px 18px 18px;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s, background 0.15s;
  font-family: inherit;
}
.ob-card:hover {
  border-color: #c7d2fe;
  transform: translateY(-1px);
}
.ob-card--active {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79,70,229,.08);
  background: linear-gradient(180deg, #fff 0%, #f4f3ff 220%);
}
.ob-card-span-2 {
  grid-column: span 2;
  flex-direction: row;
  align-items: center;
  gap: 14px;
}
.ob-card-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ob-card-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #f4f3ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}
.ob-card--active .ob-card-icon {
  background: linear-gradient(135deg, #7C3AED 0%, #4F8FFF 100%);
  color: #fff;
}
.ob-card-label {
  display: block;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.005em;
  color: #0f172a;
}
.ob-card-desc {
  display: block;
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
}
.ob-card-check {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7C3AED 0%, #4F8FFF 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 0.2s, transform 0.25s cubic-bezier(.22,1.4,.36,1);
}
.ob-card--active .ob-card-check {
  opacity: 1;
  transform: scale(1);
}

/* ── S2: Report preview ── */
.fb-prev {
  width: 100%;
  max-width: 680px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  box-shadow: 0 8px 24px -10px rgba(15,23,42,.14), 0 2px 6px -2px rgba(15,23,42,.06);
  padding: 22px 24px 20px;
  box-sizing: border-box;
  background: #fff;
  text-align: left;
}
.fb-prev-headline {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.005em;
  color: #0f172a;
  margin: 0 0 16px;
  line-height: 1.4;
}
.fb-prev-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 24px;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #eef0f6;
  margin-bottom: 16px;
}
.fb-prev-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.fb-prev-score-label {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.fb-prev-radar {
  display: flex;
  align-items: center;
  justify-content: center;
}
.fb-prev-sections {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}
.fb-prev-section {
  background: #f8f9fc;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.fb-prev-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #334155;
}
.fb-prev-pip {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.fb-prev-pip--g { background: #16a34a; }
.fb-prev-pip--w { background: #d97706; }
.fb-prev-pip--a { background: #4f46e5; }
.fb-prev-section-it {
  font-size: 12.5px;
  line-height: 1.35;
  color: #334155;
}

/* ── S3: Chips ── */
.ob-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
.ob-chip {
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.ob-chip--on {
  color: #4f46e5;
  background: #f4f3ff;
  border-color: transparent;
}

/* ── S3: Scenario list ── */
.ob-scen-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 580px;
  width: 100%;
}
.ob-scen {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 14px;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
}
.ob-scen:hover {
  border-color: #c7d2fe;
}
.ob-scen--active {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79,70,229,.08);
  background: linear-gradient(180deg, #fff 0%, #fbfaff 100%);
}
.ob-scen--custom {
  border-style: dashed;
  border-color: #eef0f6;
}
.ob-scen-pic {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  background: #f4f3ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
  line-height: 1;
}
.ob-scen--active .ob-scen-pic {
  background: linear-gradient(135deg, #7C3AED 0%, #4F8FFF 100%);
  color: #fff;
}
.ob-scen--custom .ob-scen-pic {
  background: #fff;
  border: 1.5px dashed #eef0f6;
  color: #64748b;
  font-size: 18px;
}
.ob-scen--custom.ob-scen--active .ob-scen-pic {
  background: linear-gradient(135deg, #7C3AED 0%, #4F8FFF 100%);
  border: none;
  color: #fff;
}
.ob-scen-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ob-scen-title {
  font-size: 15.5px;
  font-weight: 600;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ob-scen-badge {
  font-size: 11px;
  font-weight: 700;
  color: #4f46e5;
  background: #f4f3ff;
  padding: 2px 8px;
  border-radius: 999px;
}
.ob-scen-meta {
  font-size: 13px;
  color: #64748b;
}
.ob-scen-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, background 0.15s;
  position: relative;
}
.ob-scen--active .ob-scen-dot {
  border-color: #4f46e5;
  background: #4f46e5;
}
.ob-scen--active .ob-scen-dot::after {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
}

/* ── Footer ── */
.ob-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.ob-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s, opacity 0.15s;
  font-family: inherit;
  min-width: 220px;
  justify-content: center;
}
.ob-btn--primary {
  background: #111827;
  color: #fff;
}
.ob-btn--primary:hover:not(:disabled) {
  background: #0f172a;
  transform: translateY(-1px);
}
.ob-btn--primary:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
  transform: none;
}
.ob-btn--ghost {
  background: transparent;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  min-width: 0;
  padding: 10px 20px;
}
.ob-btn--ghost:hover {
  color: #1e293b;
  background: #f8f9fc;
}
.ob-footer-meta {
  font-size: 12.5px;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 0.02em;
}
`

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const IconBrief = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)
const IconHeart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)
const IconMega = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 22 22 3 13 3 11" /><path d="M11 11v6" /><path d="M7 12v4a2 2 0 0 0 4 0" />
  </svg>
)
const IconDoc = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" />
  </svg>
)
const IconDots = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
  </svg>
)
const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)
const IconArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
)
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

/* ─── Purpose options ───────────────────────────────────────────────────── */
const PURPOSE_OPTIONS = [
  { id: 'work',  label: 'Trabajo',           desc: 'Entrevistas, aumento, feedback al equipo.', icon: <IconBrief /> },
  { id: 'life',  label: 'Vida personal',     desc: 'Pareja, familia, conversaciones difíciles.', icon: <IconHeart /> },
  { id: 'speak', label: 'Hablar en público', desc: 'Pitch, defensa de tesis, discurso.',          icon: <IconMega /> },
  { id: 'paper', label: 'Trámites',          desc: 'Visa, universidad, asilo, master.',           icon: <IconDoc /> },
]
const PURPOSE_OTHER = { id: 'other', label: 'Otro', desc: 'Algo diferente. Lo configuramos juntos.', icon: <IconDots /> }

/* ─── Scenarios by purpose ──────────────────────────────────────────────── */
// icon: emoji string, type: 'interview' | 'custom'
const SCENARIOS = {
  work: [
    { id: 'w1', icon: '🤝', title: 'Entrevista de trabajo',  hot: true,  type: 'interview' },
    { id: 'w2', icon: '💰', title: 'Pedir un aumento',       hot: false, type: 'custom' },
    { id: 'w3', icon: '⭐', title: 'Pedir un ascenso',       hot: false, type: 'custom' },
  ],
  life: [
    { id: 'l1', icon: '💬', title: 'Conversación difícil con pareja', hot: true,  type: 'custom' },
    { id: 'l2', icon: '👨‍👩‍👧', title: 'Hablar con un familiar',          hot: false, type: 'custom' },
    { id: 'l3', icon: '🛑', title: 'Poner un límite',                  hot: false, type: 'custom' },
  ],
  speak: [
    { id: 's1', icon: '🎤', title: 'Discurso en público',    hot: true,  type: 'custom' },
    { id: 's2', icon: '📊', title: 'Pitch a inversores',     hot: false, type: 'custom' },
    { id: 's3', icon: '🎓', title: 'Defensa de tesis',        hot: false, type: 'custom' },
  ],
  paper: [
    { id: 'p1', icon: '🎓', title: 'Entrevista para universidad', hot: true,  type: 'custom' },
    { id: 'p2', icon: '🇺🇸', title: 'Entrevista de visa EE.UU.',  hot: false, type: 'custom' },
    { id: 'p3', icon: '🏠', title: 'Solicitud de residencia',     hot: false, type: 'custom' },
  ],
  other: [
    { id: 'o1', icon: '😬', title: 'Dar malas noticias',          hot: true,  type: 'custom' },
    { id: 'o2', icon: '🤝', title: 'Negociar algo importante',    hot: false, type: 'custom' },
    { id: 'o3', icon: '😤', title: 'Hablar con alguien difícil',  hot: false, type: 'custom' },
  ],
}

const PURPOSE_LABELS = { work: 'Trabajo', life: 'Vida personal', speak: 'Hablar en público', paper: 'Trámites', other: 'Otro' }

/* ─── Radar + Gauge ─────────────────────────────────────────────────────── */
const FB_AXES = ['Claridad', 'Estructura', 'Relevancia', 'Consistencia', 'Profundidad', 'Evidencia']

function FbRadar({ values, size = 200 }) {
  const cx = size / 2, cy = size / 2, R = size * 0.34, n = 6
  const pt = (i, v) => {
    const a = (i * Math.PI * 2 / n) - Math.PI / 2
    return [cx + (v / 100) * R * Math.cos(a), cy + (v / 100) * R * Math.sin(a)]
  }
  const grid = (pct) => FB_AXES.map((_, i) => pt(i, pct).join(',')).join(' ')
  const data = values.map((v, i) => pt(i, v).join(',')).join(' ')
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {[25, 50, 75, 100].map(p => (
        <polygon key={p} points={grid(p)} fill="none" stroke="#e5e7eb" strokeWidth={p === 100 ? 1.5 : 1} />
      ))}
      {FB_AXES.map((_, i) => {
        const [x, y] = pt(i, 100)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e5e7eb" strokeWidth="1" />
      })}
      <polygon points={data} fill="rgba(99,102,241,0.18)" stroke="#6366f1" strokeWidth="2" />
      {values.map((v, i) => {
        const [x, y] = pt(i, v)
        return <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke={v < 55 ? '#ef4444' : '#6366f1'} strokeWidth="2" />
      })}
      {FB_AXES.map((label, i) => {
        const a = (i * Math.PI * 2 / n) - Math.PI / 2
        const lx = cx + (R + 22) * Math.cos(a)
        const ly = cy + (R + 22) * Math.sin(a)
        return (
          <text key={i} x={lx} y={ly} fontSize="10" fontWeight="600" fill="#64748b"
            textAnchor="middle" dominantBaseline="middle"
            style={{ fontFamily: 'Inter, sans-serif' }}>{label}</text>
        )
      })}
    </svg>
  )
}

function FbScoreGauge({ value = 760, size = 130 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.42
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(Math.max(value / 1000, 0), 1))
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#4f46e5" strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize={size * 0.22} fontWeight="800" fill="#0f172a"
        style={{ fontFamily: 'Inter, sans-serif' }}>{value}</text>
      <text x={cx} y={cy + size * 0.16} textAnchor="middle" fontSize={size * 0.10} fill="#94a3b8"
        style={{ fontFamily: 'Inter, sans-serif' }}>/ 1000</text>
    </svg>
  )
}

/* ─── Header ────────────────────────────────────────────────────────────── */
function ObHeader({ step, onSkip, onBack }) {
  return (
    <header className="ob-header">
      <div className="ob-header-side">
        {onBack && (
          <button className="ob-back-btn" onClick={onBack} aria-label="Volver">
            <IconArrowLeft />
          </button>
        )}
        <div className="ob-brand">
          <img src="/logo.png" alt="FeelReady" className="ob-logo" />
        </div>
      </div>
      <div className="ob-dots-wrap">
        <div className="ob-dots">
          {[0, 1, 2].map(i => (
            <span key={i} className={`ob-dot${i === step ? ' ob-dot--active' : ''}${i < step ? ' ob-dot--past' : ''}`} />
          ))}
        </div>
      </div>
      <div className="ob-header-side ob-header-side--right">
        <button className="ob-skip" onClick={onSkip}>Saltar</button>
      </div>
    </header>
  )
}

/* ─── Screen 1 ───────────────────────────────────────────────────────────── */
function Step1({ onContinue, onSkip, initialPicked }) {
  const [picked, setPicked] = useState(initialPicked || [])

  const toggle = (id) => {
    setPicked(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const allOptions = [...PURPOSE_OPTIONS, PURPOSE_OTHER]

  return (
    <div className="ob-page">
      <ObHeader step={0} onSkip={onSkip} />
      <div className="ob-body">
        <div className="ob-stack">
          <h1 className="ob-title ob-rise">
            ¿Para qué vas a usar{' '}
            <span className="ob-accent">FeelReady?</span>
          </h1>

          <div className="ob-cards ob-rise ob-d-2">
            {PURPOSE_OPTIONS.map(opt => (
              <button
                key={opt.id}
                className={`ob-card${picked.includes(opt.id) ? ' ob-card--active' : ''}`}
                onClick={() => toggle(opt.id)}
              >
                <span className="ob-card-icon">{opt.icon}</span>
                <span className="ob-card-label">{opt.label}</span>
                <span className="ob-card-desc">{opt.desc}</span>
                <span className="ob-card-check"><IconCheck /></span>
              </button>
            ))}
            <button
              className={`ob-card ob-card-span-2${picked.includes(PURPOSE_OTHER.id) ? ' ob-card--active' : ''}`}
              onClick={() => toggle(PURPOSE_OTHER.id)}
            >
              <span className="ob-card-icon">{PURPOSE_OTHER.icon}</span>
              <span className="ob-card-body">
                <span className="ob-card-label">{PURPOSE_OTHER.label}</span>
                <span className="ob-card-desc">{PURPOSE_OTHER.desc}</span>
              </span>
              <span className="ob-card-check"><IconCheck /></span>
            </button>
          </div>

          <div className="ob-footer ob-rise ob-d-3">
            <button
              className="ob-btn ob-btn--primary"
              disabled={picked.length === 0}
              onClick={() => onContinue(picked)}
            >
              Continuar <IconArrow />
            </button>
            <span className="ob-footer-meta">Paso 1 de 3</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Screen 2 ───────────────────────────────────────────────────────────── */
function Step2({ onContinue, onBack, onSkip }) {
  return (
    <div className="ob-page">
      <ObHeader step={1} onSkip={onSkip} onBack={onBack} />
      <div className="ob-body">
        <div className="ob-stack ob-stack--wide">
          <h1 className="ob-title ob-rise">
            Esto es lo que vas a{' '}
            <span className="ob-accent">recibir.</span>
          </h1>

          <div className="fb-prev ob-rise ob-d-2">
            <h3 className="fb-prev-headline">
              Mostraste claridad y ejemplos concretos. Trabajá en la estructura de tus respuestas.
            </h3>
            <div className="fb-prev-grid">
              <div className="fb-prev-score">
                <FbScoreGauge value={760} size={130} />
                <span className="fb-prev-score-label">Puntaje global</span>
              </div>
              <div className="fb-prev-radar">
                <FbRadar values={[78, 56, 82, 70, 64, 80]} size={200} />
              </div>
            </div>
            <div className="fb-prev-sections">
              <div className="fb-prev-section">
                <span className="fb-prev-section-title"><span className="fb-prev-pip fb-prev-pip--g" />Puntos fuertes</span>
                <span className="fb-prev-section-it">Ejemplos concretos sobre tu rol pasado.</span>
                <span className="fb-prev-section-it">Tono firme y propio.</span>
              </div>
              <div className="fb-prev-section">
                <span className="fb-prev-section-title"><span className="fb-prev-pip fb-prev-pip--w" />A mejorar</span>
                <span className="fb-prev-section-it">Tendencia a "irte por las ramas" tras 30 seg.</span>
                <span className="fb-prev-section-it">Pocas pruebas medibles.</span>
              </div>
              <div className="fb-prev-section">
                <span className="fb-prev-section-title"><span className="fb-prev-pip fb-prev-pip--a" />Accionables</span>
                <span className="fb-prev-section-it">Usá STAR en preguntas situacionales.</span>
                <span className="fb-prev-section-it">Cerrá con un dato medible.</span>
              </div>
            </div>
          </div>

          <div className="ob-footer ob-rise ob-d-4">
            <button className="ob-btn ob-btn--primary" onClick={onContinue}>
              Continuar <IconArrow />
            </button>
            <span className="ob-footer-meta">Paso 2 de 3</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Screen 3 ───────────────────────────────────────────────────────────── */
function Step3({ purposes, onFinish, onBack, onSkip }) {
  // Mostrar la primera categoría seleccionada, o 'work' como fallback
  const defaultPurpose = (purposes && purposes.length > 0) ? purposes[0] : 'work'
  const [activePurpose, setActivePurpose] = useState(defaultPurpose)

  const currentScenarios = SCENARIOS[activePurpose] || SCENARIOS.work
  const [active, setActive] = useState(currentScenarios[0].id)

  const handleChipClick = (p) => {
    setActivePurpose(p)
    setActive((SCENARIOS[p] || SCENARIOS.work)[0].id)
  }

  const handleStart = () => {
    if (active === 'custom') {
      onFinish({ type: 'custom', scenario: null })
      return
    }
    const allScenarios = SCENARIOS[activePurpose] || []
    const selected = allScenarios.find(s => s.id === active)
    if (!selected) return
    onFinish({ type: selected.type, scenario: selected })
  }

  const allPurposes = [...PURPOSE_OPTIONS, PURPOSE_OTHER]

  return (
    <div className="ob-page">
      <ObHeader step={2} onSkip={onSkip} onBack={onBack} />
      <div className="ob-body">
        <div className="ob-stack ob-stack--wide">
          <h1 className="ob-title ob-rise">
            ¿Por dónde{' '}
            <span className="ob-accent">querés empezar?</span>
          </h1>

          <div className="ob-chips ob-rise ob-d-2">
            {allPurposes.map(p => (
              <button
                key={p.id}
                className={`ob-chip${activePurpose === p.id ? ' ob-chip--on' : ''}`}
                onClick={() => handleChipClick(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="ob-scen-list">
            {currentScenarios.map((s, i) => (
              <button
                key={s.id}
                className={`ob-scen${active === s.id ? ' ob-scen--active' : ''} ob-rise ob-d-${3 + i}`}
                onClick={() => setActive(s.id)}
              >
                <span className="ob-scen-pic">{s.icon}</span>
                <span className="ob-scen-text">
                  <span className="ob-scen-title">
                    {s.title}
                    {s.hot && <span className="ob-scen-badge">Recomendado</span>}
                  </span>
                </span>
                <span className="ob-scen-dot" />
              </button>
            ))}

            <button
              className={`ob-scen ob-scen--custom${active === 'custom' ? ' ob-scen--active' : ''} ob-rise ob-d-6`}
              onClick={() => setActive('custom')}
            >
              <span className="ob-scen-pic"><IconPlus /></span>
              <span className="ob-scen-text">
                <span className="ob-scen-title">Tu situación</span>
                <span className="ob-scen-meta">Contanos qué necesitás practicar · Configuración rápida</span>
              </span>
              <span className="ob-scen-dot" />
            </button>
          </div>

          <div className="ob-footer ob-rise ob-d-7">
            <button className="ob-btn ob-btn--primary" onClick={handleStart}>
              Empezar mi práctica <IconArrow />
            </button>
            <button className="ob-btn ob-btn--ghost" onClick={() => onFinish({ type: 'skip' })}>
              Prefiero elegir más tarde
            </button>
            <span className="ob-footer-meta">Paso 3 de 3 · Casi listo</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function OnboardingFlow({ user, onComplete, initialStep = 0, initialPurpose = null }) {
  const [step, setStep] = useState(initialStep)
  // purposes ahora es array (multi-select)
  const [purposes, setPurposes] = useState(
    initialPurpose
      ? Array.isArray(initialPurpose) ? initialPurpose : [initialPurpose]
      : []
  )

  const saveToDB = async (data) => {
    if (!supabase || !user) return
    try {
      await supabase.auth.updateUser({ data })
    } catch { /* non-critical */ }
  }

  const handleSkip = async () => {
    await saveToDB({ onboarding_skipped_at: new Date().toISOString() })
    onComplete({ type: 'skip' })
  }

  const handleStep1Continue = (pickedPurposes) => {
    setPurposes(pickedPurposes)
    // Guardar propósitos inmediatamente (no esperar al final)
    saveToDB({ onboarding_purposes: pickedPurposes })
    setStep(1)
  }

  const handleStep2Continue = () => {
    setStep(2)
  }

  const handleFinish = async ({ type, scenario }) => {
    await saveToDB({
      onboarding_completed_at: new Date().toISOString(),
      onboarding_purposes: purposes,
      onboarding_scenario: scenario ? scenario.id : null,
      onboarding_scenario_title: scenario ? scenario.title : null,
    })
    onComplete({ type, scenario, purpose: purposes[0] || null, purposes })
  }

  return (
    <>
      <style>{CSS}</style>
      {step === 0 && (
        <Step1
          onContinue={handleStep1Continue}
          onSkip={handleSkip}
          initialPicked={purposes}
        />
      )}
      {step === 1 && (
        <Step2
          onContinue={handleStep2Continue}
          onBack={() => setStep(0)}
          onSkip={handleSkip}
        />
      )}
      {step === 2 && (
        <Step3
          purposes={purposes}
          onFinish={handleFinish}
          onBack={() => setStep(1)}
          onSkip={handleSkip}
        />
      )}
    </>
  )
}
