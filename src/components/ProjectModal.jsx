import { useState, useEffect, useCallback } from 'react'

export default function ProjectModal({ project, onClose }) {
  const [current, setCurrent] = useState(0)
  const images = project.images || []

  const prev = useCallback(() => setCurrent(c => (c - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent(c => (c + 1) % images.length), [images.length])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && images.length > 1) prev()
      if (e.key === 'ArrowRight' && images.length > 1) next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next, images.length])

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {images.length > 0 ? (
          <>
            <div className="carousel-container">
              <div className="carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
                {images.map((src, i) => (
                  <div className="carousel-slide" key={i}>
                    <img src={src} alt={`${project.title} screenshot ${i + 1}`} />
                  </div>
                ))}
              </div>
              {images.length > 1 && (
                <>
                  <button className="carousel-nav carousel-prev" onClick={prev} aria-label="Previous">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button className="carousel-nav carousel-next" onClick={next} aria-label="Next">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="carousel-dots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`carousel-dot${i === current ? ' active' : ''}`}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--accent-green)', opacity: 0.4 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <p>Screenshots not available for this investigation.</p>
            {project.hasDoc && (
              <a
                href={project.docPath}
                target="_blank"
                rel="noreferrer"
                className="btn btn-cyber"
                style={{ marginTop: '1rem', display: 'inline-flex' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                View Full Report (PDF)
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
