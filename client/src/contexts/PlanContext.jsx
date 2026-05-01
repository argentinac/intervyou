import { createContext, useContext, useState } from 'react'

const PlanContext = createContext(null)

export function PlanProvider({ children }) {
  const [plan, setPlan] = useState('free')       // 'free' | 'pro'
  const [planStatus, setPlanStatus] = useState('active') // 'active' | 'past_due' | 'canceled'
  const [planPeriod, setPlanPeriod] = useState('monthly') // 'monthly' | 'quarterly'
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const isPro = plan === 'pro'

  const openUpgradeModal = () => setShowUpgradeModal(true)
  const closeUpgradeModal = () => setShowUpgradeModal(false)

  const setDemoPlan = ({ plan: p, status: s, period: per } = {}) => {
    if (p !== undefined) setPlan(p)
    if (s !== undefined) setPlanStatus(s)
    if (per !== undefined) setPlanPeriod(per)
  }

  return (
    <PlanContext.Provider value={{
      plan,
      planStatus,
      planPeriod,
      isPro,
      showUpgradeModal,
      openUpgradeModal,
      closeUpgradeModal,
      setDemoPlan,
    }}>
      {children}
    </PlanContext.Provider>
  )
}

export const usePlan = () => useContext(PlanContext)
