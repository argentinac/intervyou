import { useState } from 'react'
import { blogPosts } from '../data/blogPosts'

const VISIBLE = 4
const MAX_DOTS = 4

export default function BlogSection({ onBlogPost }) {
  const [index, setIndex] = useState(0)
  const maxIndex = blogPosts.length - VISIBLE

  const prev = () => setIndex(i => Math.max(0, i - 1))
  const next = () => setIndex(i => Math.min(maxIndex, i + 1))

  const visible = blogPosts.slice(index, index + VISIBLE)

  // Sliding window of MAX_DOTS dots
  const windowStart = Math.max(0, Math.min(index - Math.floor(MAX_DOTS / 2), maxIndex + 1 - MAX_DOTS))
  const dots = Array.from({ length: Math.min(MAX_DOTS, maxIndex + 1) }, (_, i) => windowStart + i)

  return (
    <section className="blog-section">
      <div className="blog-section-inner">
        <div className="blog-section-header">
          <h2 className="blog-section-title">Nuestro Blog</h2>
          <div className="blog-nav-arrows">
            <button className="blog-arrow" onClick={prev} disabled={index === 0} aria-label="Anterior">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button className="blog-arrow" onClick={next} disabled={index >= maxIndex} aria-label="Siguiente">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="blog-cards-grid">
          {visible.map(post => (
            <article key={post.slug} className="blog-card" onClick={() => onBlogPost(post.slug)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onBlogPost(post.slug)}>
              <div className="blog-card-img-wrap">
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  className="blog-card-img"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=450&fit=crop&auto=format' }}
                />
              </div>
              <div className="blog-card-body">
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <span className="blog-card-link">Leer artículo <span>→</span></span>
              </div>
            </article>
          ))}
        </div>

        <div className="blog-dots">
          {dots.map(i => (
            <button
              key={i}
              className={`blog-dot${i === index ? ' blog-dot--active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
