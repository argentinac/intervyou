import { useState, useEffect, Component } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { PlanProvider, usePlan } from './contexts/PlanContext'
import { identifyUser, resetAnalyticsUser, track, deriveEventName } from './lib/analytics'
import AuthForm from './components/AuthForm'
import Landing from './components/Landing'
import SetupForm from './components/SetupForm'
import InterviewSession from './components/InterviewSession'
import Dashboard from './components/Dashboard'
import BlogPost from './components/BlogPost'
import PricingPage from './components/PricingPage'
import PaymentSuccessPage from './components/PaymentSuccessPage'
import PaymentErrorPage from './components/PaymentErrorPage'
import TermsPage from './components/TermsPage'
import PrivacyPage from './components/PrivacyPage'
import FaqPage from './components/FaqPage'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#fafafa', fontFamily:'Inter,system-ui,sans-serif', gap:16, padding:24 }}>
          <p style={{ fontSize:16, color:'#374151', textAlign:'center' }}>Algo salió mal. Recargá la página para continuar.</p>
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
  return 'landing'
}

function getBlogSlugFromUrl() {
  return window.location.pathname.replace('/blog/', '').replace(/\/$/, '')
}

function AppInner() {
  const { user } = useAuth()
  const { plan, planStatus, isPro } = usePlan()
  const [view, setView] = useState(getInitialView) // 'landing' | 'auth' | 'dashboard' | 'interview' | 'blog' | 'pricing' | 'payment-success' | 'payment-error' | 'terms' | 'privacy' | 'faq'
  const [interviewConfig, setInterviewConfig] = useState(null)
  const [interviewReturn, setInterviewReturn] = useState('landing')
  const [blogSlug, setBlogSlug] = useState(getBlogSlugFromUrl)

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
    if (user && view !== 'interview' && view !== 'blog' && view !== 'terms' && view !== 'privacy' && view !== 'faq') setView('dashboard')
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
    return <AuthForm onBack={() => setView('landing')} />
  }

  if (view === 'interview') {
    if (!interviewConfig) {
      return (
        <SetupForm
          onSubmit={(cfg) => setInterviewConfig(cfg)}
          onBack={() => { setInterviewConfig(null); setView(interviewReturn) }}
          initialConfig={interviewConfig}
        />
      )
    }
    return (
      <InterviewSession
        config={interviewConfig}
        onEnd={() => { setInterviewConfig(null); setView(interviewReturn) }}
        onDashboard={user ? () => { setInterviewConfig(null); setView('dashboard') } : undefined}
      />
    )
  }

  if (view === 'dashboard') {
    if (!user) { setView('auth'); return null }
    return (
      <Dashboard
        onNewInterview={() => { setInterviewReturn('dashboard'); setView('interview') }}
        onSignOut={() => setView('landing')}
        onBlogPost={goToBlog}
        onRepeatInterview={repeatInterview}
        onPricing={() => setView('pricing')}
        onPaymentSuccess={() => setView('payment-success')}
        onPaymentError={() => setView('payment-error')}
      />
    )
  }

  if (view === 'pricing') {
    return (
      <PricingPage
        onSelectPlan={(period) => {
          // TODO: integrar con Stripe/MP — por ahora simula éxito
          setView('payment-success')
        }}
        onBack={() => setView(user ? 'dashboard' : 'landing')}
      />
    )
  }

  if (view === 'payment-success') {
    return (
      <PaymentSuccessPage
        onStart={() => { setInterviewReturn('dashboard'); setView('interview') }}
        onHome={() => setView('dashboard')}
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
