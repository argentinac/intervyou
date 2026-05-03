import * as amplitude from '@amplitude/unified'

let initialized = false

const AMPLITUDE_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY || '90ca61a726e35ec9caeea27f6abbf78f'

export function initAnalytics() {
  amplitude.initAll(AMPLITUDE_KEY, {
    analytics: { autocapture: false },
    sessionReplay: { sampleRate: 1 },
  })
  initialized = true
}

export function identifyUser(user, { plan, planStatus, isPro } = {}) {
  if (!initialized || !user || user.id === 'guest') return
  amplitude.setUserId(user.id)
  const identify = new amplitude.Identify()
  identify.set('email', user.email)
  identify.set('plan', plan ?? 'free')
  identify.set('plan_status', planStatus ?? 'active')
  identify.set('is_pro', isPro ?? false)
  amplitude.identify(identify)
}

export function resetAnalyticsUser() {
  if (!initialized) return
  amplitude.reset()
}

export function track(eventName, properties) {
  if (!initialized) return
  amplitude.track(eventName, properties)
}

// Derives a snake_case event name from a clicked element.
// Priority: data-track > aria-label > visible text > null (skip)
export function deriveEventName(el) {
  if (el.dataset.track) return el.dataset.track

  const ariaLabel = el.getAttribute('aria-label')
  if (ariaLabel) return toSnakeCase(ariaLabel)

  // innerText includes only rendered text, ignores hidden nodes
  const raw = (el.innerText || el.textContent || '').trim()
  // Strip arrows, symbols and collapse whitespace
  const cleaned = raw.replace(/[←→↑↓✓×•·…↗\-]+/g, ' ').replace(/\s+/g, ' ').trim()
  if (cleaned && cleaned.length >= 2 && cleaned.length <= 60) return toSnakeCase(cleaned)

  return null
}

function toSnakeCase(str) {
  return str
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // remove accents
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 50)
}
