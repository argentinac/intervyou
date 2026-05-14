// Aggregates all simulation definitions and exposes lookup helpers.
// Adding a new simulation = create a new object in the right category file
// and append it to that file's exported array. No other code changes needed.

import { WORK_SIMULATIONS } from './work'
import { STUDY_SIMULATIONS } from './study'
import { VISA_SIMULATIONS } from './visa'
import { LOVE_SIMULATIONS } from './love'
import { LEGAL_SIMULATIONS } from './legal'
import { OTHER_SIMULATIONS } from './other'
import { CUSTOM_SIMULATIONS } from './custom'

export const ALL_SIMULATIONS = [
  ...WORK_SIMULATIONS,
  ...STUDY_SIMULATIONS,
  ...VISA_SIMULATIONS,
  ...LOVE_SIMULATIONS,
  ...LEGAL_SIMULATIONS,
  ...OTHER_SIMULATIONS,
  ...CUSTOM_SIMULATIONS,
].filter((s) => s && s.id)

export const CATEGORIES = [
  { id: 'work', label: 'Trabajo' },
  { id: 'study', label: 'Estudio' },
  { id: 'visa', label: 'Visa' },
  { id: 'love', label: 'Vínculos' },
  { id: 'legal', label: 'Trámites legales' },
  { id: 'other', label: 'Otros' },
]

export function getSimulationById(id) {
  return ALL_SIMULATIONS.find((s) => s.id === id) || null
}

export function getSimulationsByCategory(categoryId) {
  return ALL_SIMULATIONS.filter((s) => s.category === categoryId)
}

export function getCategoryLabel(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId)?.label || categoryId
}
