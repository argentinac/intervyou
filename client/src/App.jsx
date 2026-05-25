import { useState, useEffect, useRef, Component } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { supabase } from './lib/supabase'
import { PlanProvider, usePlan } from './contexts/PlanContext'
import { identifyUser, resetAnalyticsUser, track, deriveEventName } from './lib/analytics'
import AuthForm from './components/AuthForm'
import Landing from './components/Landing'
import SetupForm from './components/SetupForm'
import VisaSetupForm from './components/VisaSetupForm'
import GenericSetupForm from './components/simulations/GenericSetupForm'
import CustomSituationSetup from './components/simulations/CustomSituationSetup'
import { getSimulationById } from './lib/simulations/catalog'
import { getSkillById, getSkillSystemPrompt } from './lib/skills/catalog'
import InterviewSession from './components/InterviewSession'
import Dashboard from './components/Dashboard'
import BlogPost from './components/BlogPost'
import PricingPage from './components/PricingPage'
import PaymentSuccessPage from './components/PaymentSuccessPage'
import PaymentErrorPage from './components/PaymentErrorPage'
import TermsPage from './components/TermsPage'
import PrivacyPage from './components/PrivacyPage'
import FaqPage from './components/FaqPage'
import OnboardingFlow from './components/OnboardingFlow'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    console.error('ErrorBoundary caught:', error)
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary detail:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#fafafa', fontFamily:'Inter,system-ui,sans-serif', gap:16, padding:24 }}>
          <p style={{ fontSize:16, color:'#374151', textAlign:'center' }}>Algo salió mal. Recargá la página para continuar.</p>
          {this.state.error && <pre style={{ fontSize:11, color:'#ef4444', maxWidth:600, whiteSpace:'pre-wrap', textAlign:'left' }}>{this.state.error.toString()}{'\n'}{this.state.error.stack}</pre>}
          <button onClick={() => window.location.reload()} style={{ padding:'10px 24px', background:'#111827', color:'#fff', border:'none', borderRadius:10, fontSize:14, cursor:'pointer' }}>
            Recargar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function getInitialView() {
  const path = window.location.pathname
  if (path.startsWith('/blog/')) return 'blog'
  if (path === '/terminos') return 'terms'
  if (path === '/privacidad') return 'privacy'
  if (path === '/faq') return 'faq'
  if (path === '/payment-success') return 'payment-success'
  if (path === '/payment-error') return 'payment-error'
  if (path === '/nueva-entrevista') return 'dashboard'
  return 'landing'
}

function getInitialDashboardSection() {
  return window.location.pathname === '/nueva-entrevista' ? 'new' : 'home'
}

function getBlogSlugFromUrl() {
  return window.location.pathname.replace('/blog/', '').replace(/\/$/, '')
}

function AppInner() {
  const { user } = useAuth()
  const { plan, planStatus, isPro, startCheckout, checkoutLoading, refreshSubscription, processor } = usePlan()
  const [view, setView] = useState(getInitialView) // 'landing' | 'auth' | 'dashboard' | 'interview' | 'visa-interview' | 'simulation' | 'blog' | 'pricing' | 'payment-success' | 'payment-error' | 'terms' | 'privacy' | 'faq'
  const [dashboardInitialSection, setDashboardInitialSection] = useState(getInitialDashboardSection)
  const [interviewConfig, setInterviewConfig] = useState(null)
  const [interviewReturn, setInterviewReturn] = useState('landing')
  const [visaConfig, setVisaConfig] = useState(null)
  const [simulationId, setSimulationId] = useState(null)
  const [simulationConfig, setSimulationConfig] = useState(null)
  const [skillId, setSkillId] = useState(null)
  const [blogSlug, setBlogSlug] = useState(getBlogSlugFromUrl)
  const [pendingInterviewId, setPendingInterviewId] = useState(null)
  const [pendingFeedback, setPendingFeedback] = useState(null)
  const [pendingFeedbackConfig, setPendingFeedbackConfig] = useState(null)
  const [onboardingInitialSituation, setOnboardingInitialSituation] = useState(null)
  const [onboardingReturnStep, setOnboardingReturnStep] = useState(null) // null = fresh, 2 = volver al paso de escenarios
  const [onboardingReturnPurpose, setOnboardingReturnPurpose] = useState(null)
  const pendingGuestConfigRef = useRef(null)
  const detectedCountryRef = useRef('')

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => { if (data.country_name) detectedCountryRef.current = data.country_name })
      .catch(() => {})
  }, [])

  // Auto-track every screen change
  useEffect(() => {
    track(`${view}_viewed`)
  }, [view])

  // Identify user on login/logout and when plan changes
  useEffect(() => {
    if (user) {
      identifyUser(user, { plan, planStatus, isPro })
    } else if (user === null) {
      resetAnalyticsUser()
    }
  }, [user, plan, planStatus, isPro])

  // Global click delegation: auto-tracks any button/link click.
  // Uses data-track as explicit override, otherwise derives name from text/aria-label.
  useEffect(() => {
    const handler = (e) => {
      const el = e.target.closest('button, a, [role="button"]')
      if (!el) return
      const name = deriveEventName(el)
      if (name) track(name)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  useEffect(() => {
    if (user && !user.is_anonymous && user.id !== 'guest') {
      if (pendingGuestConfigRef.current) {
        setInterviewConfig(pendingGuestConfigRef.current)
        setInterviewReturn('dashboard')
        pendingGuestConfigRef.current = null
        setView('interview')
      } else if (view !== 'interview' && view !== 'visa-interview' && view !== 'simulation' && view !== 'skill' && view !== 'blog' && view !== 'terms' && view !== 'privacy' && view !== 'faq' && view !== 'payment-success' && view !== 'payment-error') {
        const meta = user.user_metadata || {}
        const needsOnboarding = !meta.onboarding_completed_at && !meta.onboarding_skipped_at
        setView(needsOnboarding ? 'onboarding' : 'dashboard')
      }
    }
  }, [user])

  const goToBlog = (slug) => {
    setBlogSlug(slug)
    setView('blog')
    window.history.pushState({}, '', `/blog/${slug}`)
    window.scrollTo(0, 0)
  }

  const goToTerms = () => {
    setView('terms')
    window.history.pushState({}, '', '/terminos')
    window.scrollTo(0, 0)
  }

  const goToPrivacy = () => {
    setView('privacy')
    window.history.pushState({}, '', '/privacidad')
    window.scrollTo(0, 0)
  }

  const goToFaq = () => {
    setView('faq')
    window.history.pushState({}, '', '/faq')
    window.scrollTo(0, 0)
  }

  const goToLanding = () => {
    setView('landing')
    window.history.pushState({}, '', '/')
    window.scrollTo(0, 0)
  }

  const repeatInterview = (config) => {
    setInterviewConfig(config)
    setInterviewReturn('dashboard')
    setView('interview')
  }

  const leaveBlog = () => {
    goToLanding()
  }

  if (user === undefined) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#fafafa' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (view === 'blog') {
    return (
      <BlogPost
        slug={blogSlug}
        onBack={leaveBlog}
        onTryFree={() => { setInterviewReturn('landing'); setView('interview'); window.history.pushState({}, '', '/') }}
      />
    )
  }

  if (view === 'terms') {
    return (
      <TermsPage
        onBack={goToLanding}
        onTryFree={() => { setInterviewReturn('landing'); setView('interview'); window.history.pushState({}, '', '/') }}
      />
    )
  }

  if (view === 'privacy') {
    return (
      <PrivacyPage
        onBack={goToLanding}
        onTryFree={() => { setInterviewReturn('landing'); setView('interview'); window.history.pushState({}, '', '/') }}
      />
    )
  }

  if (view === 'faq') {
    return (
      <FaqPage
        onBack={goToLanding}
        onTryFree={() => { setInterviewReturn('landing'); setView('interview'); window.history.pushState({}, '', '/') }}
        onPrivacy={goToPrivacy}
        onTerms={goToTerms}
      />
    )
  }

  if (view === 'landing') {
    return (
      <Landing
        user={user}
        onLogin={() => setView('auth')}
        onTryFree={() => { setInterviewReturn('landing'); setView('interview') }}
        onDashboard={() => setView('dashboard')}
        onBlogPost={goToBlog}
        onTerms={goToTerms}
        onPrivacy={goToPrivacy}
        onFaq={goToFaq}
      />
    )
  }

  if (view === 'auth') {
    const fromGuestFlow = !!pendingGuestConfigRef.current
    return (
      <AuthForm
        context={fromGuestFlow ? 'interview' : undefined}
        onBack={() => {
          if (fromGuestFlow) {
            pendingGuestConfigRef.current = null
            setView('interview')
          } else {
            setView('landing')
          }
        }}
      />
    )
  }

  if (view === 'interview') {
    if (!interviewConfig) {
      return (
        <SetupForm
          onSubmit={(cfg) => {
            if (supabase && (!user || user.is_anonymous)) {
              pendingGuestConfigRef.current = cfg
              setInterviewReturn('dashboard')
              setView('auth')
            } else {
              setInterviewConfig(cfg)
            }
          }}
          onBack={() => { setInterviewConfig(null); setView(interviewReturn) }}
          initialConfig={interviewConfig}
        />
      )
    }
    return (
      <InterviewSession
        config={interviewConfig}
        onEnd={() => { setInterviewConfig(null); setView(interviewReturn) }}
        onDashboard={user && !user.is_anonymous ? (id) => { setInterviewConfig(null); if (id) setPendingInterviewId(id); setView('dashboard') } : undefined}
        onFeedbackReady={user && !user.is_anonymous ? (fb, cfg) => { setPendingFeedback(fb); setPendingFeedbackConfig(cfg); setView('dashboard') } : undefined}
      />
    )
  }

  if (view === 'simulation') {
    const simulation = simulationId ? getSimulationById(simulationId) : null
    if (!simulation) { setView('dashboard'); return null }
    if (!simulationConfig) {
      if (simulation.type === 'custom') {
        const initSit = onboardingInitialSituation
        return (
          <CustomSituationSetup
            simulation={simulation}
            initialSituation={initSit || undefined}
            onSubmit={(cfg) => { setOnboardingInitialSituation(null); setSimulationConfig({ ...cfg, simulationTitle: simulation.title }) }}
            onBack={() => {
              const returnToOnboarding = onboardingReturnStep !== null
              setOnboardingInitialSituation(null)
              setSimulationConfig(null)
              setSimulationId(null)
              setView(returnToOnboarding ? 'onboarding' : 'dashboard')
            }}
          />
        )
      }
      return (
        <GenericSetupForm
          simulation={simulation}
          onSubmit={(cfg) => setSimulationConfig({ ...cfg, simulationTitle: simulation.title })}
          onBack={() => { setSimulationConfig(null); setSimulationId(null); setView('dashboard') }}
        />
      )
    }
    return (
      <InterviewSession
        config={simulationConfig}
        onEnd={() => { setSimulationConfig(null); setSimulationId(null); setView('dashboard') }}
        onDashboard={user ? (id) => { setSimulationConfig(null); setSimulationId(null); if (id) setPendingInterviewId(id); setView('dashboard') } : undefined}
        onFeedbackReady={user ? (fb, cfg) => { setPendingFeedback(fb); setPendingFeedbackConfig(cfg); setView('dashboard') } : undefined}
      />
    )
  }

  if (view === 'skill') {
    const skill = skillId ? getSkillById(skillId) : null
    if (!skill) { setView('dashboard'); return null }
    const { systemPrompt, techniqueIdx } = getSkillSystemPrompt(skill)
    const skillConfig = {
      isSkill: true,
      skillId: skill.id,
      skillName: skill.name,
      skillEje: skill.eje,
      techniqueIdx,
      systemPrompt,
      language: 'Spanish',
      country: detectedCountryRef.current || 'Argentina',
    }
    const handleSkillComplete = async (sid, tidx) => {
      if (!user) return
      await supabase.from('skill_progress').upsert(
        { user_id: user.id, skill_id: sid, technique_idx: tidx },
        { onConflict: 'user_id,skill_id,technique_idx' }
      )
    }
    return (
      <InterviewSession
        config={skillConfig}
        onEnd={() => { setSkillId(null); setView('dashboard') }}
        onDashboard={() => { setSkillId(null); setView('dashboard') }}
        onSkillComplete={handleSkillComplete}
      />
    )
  }

  if (view === 'visa-interview') {
    if (!visaConfig) {
      return (
        <VisaSetupForm
          onSubmit={(cfg) => setVisaConfig(cfg)}
          onBack={() => { setVisaConfig(null); setView('dashboard') }}
        />
      )
    }
    return (
      <InterviewSession
        config={visaConfig}
        onEnd={() => { setVisaConfig(null); setView('dashboard') }}
        onDashboard={user ? (id) => { setVisaConfig(null); if (id) setPendingInterviewId(id); setView('dashboard') } : undefined}
        onFeedbackReady={user ? (fb, cfg) => { setPendingFeedback(fb); setPendingFeedbackConfig(cfg); setView('dashboard') } : undefined}
      />
    )
  }

  if (view === 'onboarding') {
    if (!user) { setView('auth'); return null }
    return (
      <OnboardingFlow
        user={user}
        initialStep={onboardingReturnStep ?? 0}
        initialPurpose={onboardingReturnPurpose}
        onComplete={({ type, scenario, purpose, purposes }) => {
          setOnboardingReturnStep(null)
          setOnboardingReturnPurpose(null)
          if (type === 'skip') {
            setView('dashboard')
          } else if (type === 'interview') {
            setInterviewReturn('dashboard')
            setView('interview')
          } else if (type === 'custom' && scenario) {
            setOnboardingInitialSituation(scenario.title)
            setSimulationId('custom_situation')
            setSimulationConfig(null)
            setView('simulation')
          } else {
            // "Tu situación" — CustomSituationSetup desde cero, volver vuelve aquí
            setOnboardingInitialSituation(null)
            setOnboardingReturnStep(2)
            setOnboardingReturnPurpose(purposes || (purpose ? [purpose] : null))
            setSimulationId('custom_situation')
            setSimulationConfig(null)
            setView('simulation')
          }
        }}
      />
    )
  }

  if (view === 'dashboard') {
    if (!user) { setView('auth'); return null }
    return (
      <Dashboard
        initialSection={dashboardInitialSection}
        onNewInterview={() => { setInterviewReturn('dashboard'); setView('interview') }}
        onStartInterview={(cfg) => { setInterviewConfig(cfg); setInterviewReturn('dashboard'); setView('interview') }}
        onSignOut={() => setView('landing')}
        onRepeatInterview={repeatInterview}
        onPricing={() => setView('pricing')}
        onPaymentSuccess={() => setView('payment-success')}
        onPaymentError={() => setView('payment-error')}
        pendingInterviewId={pendingInterviewId}
        onPendingInterviewIdConsumed={() => setPendingInterviewId(null)}
        onVisaInterview={() => { setVisaConfig(null); setView('visa-interview') }}
        onStartSimulation={(id) => { setSimulationId(id); setSimulationConfig(null); setView('simulation') }}
        onStartSkill={(id) => { setSkillId(id); setView('skill') }}
        pendingFeedback={pendingFeedback}
        pendingFeedbackConfig={pendingFeedbackConfig}
        onPendingFeedbackConsumed={() => { setPendingFeedback(null); setPendingFeedbackConfig(null) }}
      />
    )
  }

  if (view === 'pricing') {
    return (
      <PricingPage
        onSelectPlan={startCheckout}
        loadingPeriod={checkoutLoading}
        processor={processor}
        onBack={() => setView(user ? 'dashboard' : 'landing')}
      />
    )
  }

  if (view === 'payment-success') {
    return (
      <PaymentSuccessPage
        onStart={() => { refreshSubscription(); setInterviewReturn('dashboard'); setView('interview') }}
        onHome={() => { refreshSubscription(); setView('dashboard') }}
      />
    )
  }

  if (view === 'payment-error') {
    return (
      <PaymentErrorPage
        onRetry={() => setView('pricing')}
        onHome={() => setView('dashboard')}
      />
    )
  }

  return null
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PlanProvider>
          <AppInner />
        </PlanProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
