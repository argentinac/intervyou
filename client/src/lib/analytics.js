import * as amplitude from '@amplitude/analytics-browser'

let initialized = false

export function initAnalytics() {
  const key = import.meta.env.VITE_AMPLITUDE_API_KEY
  if (!key) return
  amplitude.init(key, {
    autocapture: false,
    defaultTracking: false,
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
