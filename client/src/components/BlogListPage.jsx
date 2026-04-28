import { blogPosts } from '../data/blogPosts'

export default function BlogListPage({ onBlogPost }) {
  return (
    <div className="iv-page">
      <div className="db-page-header">
        <h2>Recursos</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
          Guías y consejos para tu carrera profesional
        </p>
      </div>

      <div className="blp-grid">
        {blogPosts.map(post => (
          <article
            key={post.slug}
            className="blp-card"
            onClick={() => onBlogPost(post.slug)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onBlogPost(post.slug)}
          >
            <div className="blp-card-img-wrap">
              <img
                src={post.image}
                alt={post.imageAlt}
                className="blp-card-img"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=220&fit=crop&auto=format' }}
              />
            </div>
            <div className="blp-card-body">
              <h3 className="blp-card-title">{post.title}</h3>
              <p className="blp-card-excerpt">{post.excerpt}</p>
              <span className="blp-card-link">Leer artículo →</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
