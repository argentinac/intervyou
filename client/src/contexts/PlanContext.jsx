import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

const PlanContext = createContext(null)

const API = import.meta.env.VITE_API_URL || ''

export function PlanProvider({ children }) {
  const [plan, setPlan] = useState('free')
  const [planStatus, setPlanStatus] = useState('active')
  const [planPeriod, setPlanPeriod] = useState('monthly')
  const [planExpiresAt, setPlanExpiresAt] = useState(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState(null)

  const isPro = plan === 'pro'

  const loadSubscription = useCallback(async () => {
    const { data } = await supabase.auth.getSession()
    const token = data?.session?.access_token
    if (!token) return
    try {
      const res = await fetch(`${API}/api/payments/subscription`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      const json = await res.json()
      setPlan(json.plan || 'free')
      setPlanStatus(json.planStatus || 'active')
      setPlanPeriod(json.planPeriod || 'monthly')
      setPlanExpiresAt(json.planExpiresAt || null)
    } catch { /* ignorar errores de red */ }
  }, [])

  // Cargar al montar y cuando cambia la sesión
  useEffect(() => {
    loadSubscription()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') loadSubscription()
      if (event === 'SIGNED_OUT') {
        setPlan('free'); setPlanStatus('active'); setPlanPeriod('monthly'); setPlanExpiresAt(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [loadSubscription])

  const startCheckout = useCallback(async (period) => {
    setCheckoutLoading(true)
    setCheckoutError(null)
    try {
      const { data } = await supabase.auth.getSession()
      const token = data?.session?.access_token
      if (!token) { setCheckoutError('Necesitás iniciar sesión'); setCheckoutLoading(false); return }

      const res = await fetch(`${API}/api/payments/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ period }),
      })
      const json = await res.json()
      if (!res.ok || !json.url) { setCheckoutError(json.error || 'Error al iniciar el pago'); setCheckoutLoading(false); return }
      window.location.href = json.url
    } catch {
      setCheckoutError('Error de conexión. Intentá de nuevo.')
      setCheckoutLoading(false)
    }
  }, [])

  const openUpgradeModal = () => setShowUpgradeModal(true)
  const closeUpgradeModal = () => { setShowUpgradeModal(false); setCheckoutError(null) }

  // Solo para demo bar
  const setDemoPlan = ({ plan: p, status: s, period: per } = {}) => {
    if (p !== undefined) setPlan(p)
    if (s !== undefined) setPlanStatus(s)
    if (per !== undefined) setPlanPeriod(per)
  }

  return (
    <PlanContext.Provider value={{
      plan, planStatus, planPeriod, planExpiresAt,
      isPro,
      showUpgradeModal, openUpgradeModal, closeUpgradeModal,
      startCheckout, checkoutLoading, checkoutError,
      setDemoPlan,
      refreshSubscription: loadSubscription,
    }}>
      {children}
    </PlanContext.Provider>
  )
}

export const usePlan = () => useContext(PlanContext)
