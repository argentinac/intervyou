import { useRef, useState } from 'react'
import { blogPosts } from '../data/blogPosts'

const VISIBLE = 4

export default function BlogSection({ onBlogPost }) {
  const [index, setIndex] = useState(0)
  const maxIndex = blogPosts.length - VISIBLE

  const prev = () => setIndex(i => Math.max(0, i - 1))
  const next = () => setIndex(i => Math.min(maxIndex, i + 1))

  const visible = blogPosts.slice(index, index + VISIBLE)

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
            <article key={post.slug} className="blog-card">
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
                <button className="blog-card-link" onClick={() => onBlogPost(post.slug)}>
                  Leer artículo <span>→</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="blog-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
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
