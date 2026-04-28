import { useEffect, useState } from 'react'
import { blogPosts } from '../data/blogPosts'

export default function BlogPost({ slug, onBack, onTryFree }) {
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(true)

  const post = blogPosts.find(p => p.slug === slug)

  useEffect(() => {
    setLoading(true)
    fetch(`/blog/${slug}.html`)
      .then(r => r.text())
      .then(text => {
        const match = text.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
        setHtml(match ? match[1] : text)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  return (
    <div className="bp-page">
      <header className="bp-header">
        <div className="bp-header-inner">
          <button className="bp-back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver al blog
          </button>
          <img src="/logo.png" alt="CoachToWork" className="bp-logo" />
          <button className="bp-cta-nav" onClick={onTryFree}>Practicar ahora</button>
        </div>
      </header>

      <main className="bp-main">
        {post && (
          <div className="bp-hero-img-wrap">
            <img
              src={post.image}
              alt={post.imageAlt}
              className="bp-hero-img"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=500&fit=crop&auto=format' }}
            />
          </div>
        )}

        <article className="bp-article">
          {loading ? (
            <div className="bp-loading"><div className="spinner" /></div>
          ) : (
            <div className="bp-content" dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </article>

        <div className="bp-cta-box">
          <p className="bp-cta-tag">¿Querés practicar lo que acabás de aprender?</p>
          <h3 className="bp-cta-title">Simulá una entrevista real con IA</h3>
          <p className="bp-cta-sub">CoachToWork te da feedback personalizado para que llegues preparado a tu próxima entrevista.</p>
          <button className="bp-cta-btn" onClick={onTryFree}>Empezar gratis →</button>
        </div>
      </main>

      <footer className="bp-footer">
        <span>© 2025 CoachToWork · </span>
        <button className="bp-footer-link" onClick={onBack}>Blog</button>
      </footer>
    </div>
  )
}
