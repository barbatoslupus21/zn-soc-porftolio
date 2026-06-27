import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { projects, filterCategories } from '../data/projects'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

const CATEGORIES = filterCategories.filter(c => c.key !== 'all')
const AUTO_MS = 60_000
const PILL_H = 72

function ProjectLoader() {
  return (
    <div className="proj-loader">
      <div className="proj-loader-ring">
        <div className="prl-outer" />
        <div className="prl-mid" />
        <div className="prl-inner" />
        <div className="prl-dot" />
      </div>
      <span className="proj-loader-text">INITIATING PROJECT...</span>
    </div>
  )
}

const getTabTitle = p => {
  const dashIdx = p.title.indexOf(' – ')
  if (dashIdx !== -1) return p.title.slice(0, dashIdx)
  return p.title.split(' ').slice(0, 2).join(' ')
}

function PdfViewer({ url, targetScrollPct, onScroll, onReady, onError }) {
  const containerRef = useRef(null)
  const settingScroll = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let cancelled = false
    while (container.firstChild) container.removeChild(container.firstChild)

    async function render() {
      const safeUrl = encodeURI(url)
      const loadingTask = pdfjsLib.getDocument({ url: safeUrl })
      const pdf = await loadingTask.promise
      if (cancelled) return
      let firstPageDone = false
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        if (cancelled) return
        const page = await pdf.getPage(pageNum)
        if (cancelled) return
        const baseViewport = page.getViewport({ scale: 1 })
        const containerWidth = (container.clientWidth || 800) - 24
        const scale = Math.max(0.5, containerWidth / baseViewport.width)
        const viewport = page.getViewport({ scale })
        const pageWrap = document.createElement('div')
        pageWrap.className = 'pdf-page-wrap'
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        canvas.style.display = 'block'
        canvas.style.width = '100%'
        canvas.style.height = 'auto'
        pageWrap.appendChild(canvas)
        container.appendChild(pageWrap)
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
        if (!firstPageDone) { firstPageDone = true; if (!cancelled) onReady?.() }
      }
    }

    render().catch(err => { if (!cancelled) { console.error('[PdfViewer] load error:', err); onError?.(err?.message || String(err)) } })
    return () => { cancelled = true }
  }, [url, onReady, onError])

  useEffect(() => {
    if (targetScrollPct === null || targetScrollPct === undefined) return
    const el = containerRef.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    if (max <= 0) return
    settingScroll.current = true
    el.scrollTop = targetScrollPct * max
    requestAnimationFrame(() => { settingScroll.current = false })
  }, [targetScrollPct])

  const handleScroll = () => {
    if (settingScroll.current) return
    const el = containerRef.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    onScroll?.(max > 0 ? el.scrollTop / max : 0)
  }

  return <div ref={containerRef} className="doc-pdf-canvas" onScroll={handleScroll} />
}

function CarouselModal({ project, onClose }) {
  const [current, setCurrent] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)
  const total = project.images.length

  const prev = useCallback(() => { setCurrent(i => (i - 1 + total) % total); setImgLoaded(false) }, [total])
  const next = useCallback(() => { setCurrent(i => (i + 1) % total); setImgLoaded(false) }, [total])

  useEffect(() => {
    const h = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose, next, prev])

  return createPortal(
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="carousel-modal">
        <div className="carousel-modal-bar">
          <span className="carousel-modal-name">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            {project.title}
          </span>
          <div className="carousel-modal-right">
            {total > 1 && <span className="carousel-counter">{current + 1} / {total}</span>}
            <button className="carousel-close" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
        <div className="carousel-body">
          {total > 1 && (
            <button className="carousel-arrow carousel-prev" onClick={prev} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
          <div className="carousel-img-wrap">
            {!imgLoaded && <ProjectLoader />}
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={project.images[current]}
                alt={`${project.title} screenshot ${current + 1}`}
                className="carousel-img"
                style={{ opacity: imgLoaded ? 1 : 0 }}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: imgLoaded ? 1 : 0, scale: imgLoaded ? 1 : 0.97 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onLoad={() => setImgLoaded(true)}
              />
            </AnimatePresence>
          </div>
          {total > 1 && (
            <button className="carousel-arrow carousel-next" onClick={next} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
        {total > 1 && (
          <div className="carousel-dots">
            {project.images.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot${i === current ? ' active' : ''}`}
                onClick={() => { setCurrent(i); setImgLoaded(false) }}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

function DocModal({ project, onClose }) {
  const [pdfLoaded, setPdfLoaded] = useState(false)
  const [pdfError, setPdfError] = useState(null)
  const [pillPct, setPillPct] = useState(0)
  const [targetPct, setTargetPct] = useState(null)
  const pillPctRef = useRef(0)
  const railRef = useRef(null)
  const dragging = useRef(false)

  useEffect(() => { pillPctRef.current = pillPct }, [pillPct])
  useEffect(() => { setPdfLoaded(false); setPdfError(null); setPillPct(0); setTargetPct(null) }, [project.id])

  useEffect(() => {
    const h = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose])

  const onReady = useCallback(() => setPdfLoaded(true), [])
  const onError = useCallback(msg => setPdfError(msg), [])
  const onPdfScroll = useCallback(pct => { if (dragging.current) return; setPillPct(pct); pillPctRef.current = pct }, [])

  const applyPct = useCallback(pct => {
    const c = Math.max(0, Math.min(1, pct))
    setPillPct(c); pillPctRef.current = c; setTargetPct(c)
  }, [])

  const onPillMouseDown = useCallback(e => {
    e.preventDefault(); e.stopPropagation()
    dragging.current = true
    const startY = e.clientY
    const startPct = pillPctRef.current
    const onMove = mv => {
      const rail = railRef.current
      if (!rail) return
      const railH = rail.getBoundingClientRect().height - PILL_H
      if (railH <= 0) return
      applyPct(startPct + (mv.clientY - startY) / railH)
    }
    const onUp = () => { dragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [applyPct])

  const onRailClick = useCallback(e => {
    if (e.target !== e.currentTarget) return
    const rail = e.currentTarget
    const railH = rail.getBoundingClientRect().height - PILL_H
    if (railH <= 0) return
    applyPct((e.nativeEvent.offsetY - PILL_H / 2) / railH)
  }, [applyPct])

  const pillTop = `calc(${pillPct} * (100% - ${PILL_H}px))`

  return createPortal(
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="doc-modal">
        <div className="doc-modal-bar">
          <span className="doc-modal-name">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            {project.title}
          </span>
          <button className="carousel-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="doc-modal-body">
          {!pdfLoaded && !pdfError && <ProjectLoader />}
          {pdfError && (
            <div className="pdf-error">
              <span style={{ fontSize: '1.4rem' }}>⚠</span>
              <span>Failed to load document</span>
              <code style={{ fontSize: '0.65rem', opacity: 0.6, wordBreak: 'break-all' }}>{pdfError}</code>
            </div>
          )}
          <PdfViewer url={project.docPath} targetScrollPct={targetPct} onScroll={onPdfScroll} onReady={onReady} onError={onError} />
          <div className="doc-scrollbar-rail" ref={railRef} onClick={onRailClick}>
            <div className="doc-scrollbar-pill" style={{ top: pillTop, height: PILL_H }} onMouseDown={onPillMouseDown} />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function Projects() {
  const [cat, setCat] = useState('cyber')
  const [idx, setIdx] = useState(0)
  const [openId, setOpenId] = useState(null)
  const [docModal, setDocModal] = useState(null)
  const [carouselModal, setCarouselModal] = useState(null)
  const [scrollState, setScrollState] = useState({ up: false, down: false })
  const [tabsScroll, setTabsScroll] = useState({ left: false, right: false })
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 640)

  const intervalRef = useRef(null)
  const panelRef = useRef(null)
  const tabsRef = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const catProjects = projects.filter(p => p.category === cat)
  const active = catProjects[Math.min(idx, catProjects.length - 1)]

  const restartTimer = useCallback((len) => {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => setIdx(i => (i + 1) % len), AUTO_MS)
  }, [])

  useEffect(() => {
    setIdx(0)
    setOpenId(null)
    if (!isMobile) restartTimer(catProjects.length)
    return () => clearInterval(intervalRef.current)
  }, [cat, isMobile]) // eslint-disable-line

  useEffect(() => {
    if (isMobile) clearInterval(intervalRef.current)
    else restartTimer(catProjects.length)
  }, [isMobile]) // eslint-disable-line

  // Tab scroll arrows
  const updateTabsScroll = useCallback(() => {
    const el = tabsRef.current
    if (!el) return
    setTabsScroll({
      left: el.scrollLeft > 4,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 4,
    })
  }, [])

  useEffect(() => {
    const el = tabsRef.current
    if (!el) return
    updateTabsScroll()
    el.addEventListener('scroll', updateTabsScroll)
    window.addEventListener('resize', updateTabsScroll)
    return () => {
      el.removeEventListener('scroll', updateTabsScroll)
      window.removeEventListener('resize', updateTabsScroll)
    }
  }, [updateTabsScroll])

  useEffect(() => {
    requestAnimationFrame(updateTabsScroll)
  }, [cat, updateTabsScroll])

  // Desktop panel scroll state
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const tabs = el.querySelectorAll('.proj-tab')
    const panelEl = el.closest('.project-panel')
    if (tabs.length >= 8) {
      let h = 0
      for (let i = 0; i < 8; i++) h += tabs[i].getBoundingClientRect().height
      const px = Math.round(h) + 'px'
      el.style.maxHeight = px
      if (panelEl) panelEl.style.height = px
    } else {
      el.style.maxHeight = ''
      if (panelEl) panelEl.style.height = ''
    }
    el.scrollTop = 0
    const update = () => setScrollState({
      up: el.scrollTop > 4,
      down: el.scrollTop < el.scrollHeight - el.clientHeight - 4,
    })
    update()
    el.addEventListener('scroll', update)
    return () => el.removeEventListener('scroll', update)
  }, [catProjects.length])

  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const activeTab = el.querySelector('.proj-tab.active')
    if (!activeTab) return
    const tabTop = activeTab.offsetTop
    const tabBottom = tabTop + activeTab.offsetHeight
    const panelTop = el.scrollTop
    const panelBottom = panelTop + el.clientHeight
    if (tabBottom > panelBottom) el.scrollTo({ top: tabBottom - el.clientHeight, behavior: 'smooth' })
    else if (tabTop < panelTop) el.scrollTo({ top: tabTop, behavior: 'smooth' })
  }, [idx])

  const pick = i => {
    setIdx(i)
    if (!isMobile) restartTimer(catProjects.length)
  }

  const nudgePanel = dir => {
    const el = panelRef.current
    if (!el) return
    el.scrollBy({ top: dir * 64, behavior: 'smooth' })
  }

  const nudgeTabs = dir => {
    const el = tabsRef.current
    if (!el) return
    el.scrollBy({ left: dir * 130, behavior: 'smooth' })
  }

  const toggleAccordion = id => setOpenId(prev => prev === id ? null : id)

  if (!active) return null

  const catLabel = cat === 'cyber' ? 'INVESTIGATION' : cat === 'ai' ? 'AI AUTOMATION' : cat === 'web' ? 'WEB APP' : cat.toUpperCase()

  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">03</span>
          <h2 className="section-title" data-text="Featured Projects">Featured Projects</h2>
        </div>

        {/* Category tabs with horizontal scroll + arrows */}
        <div className="proj-tabs-wrap">
          {tabsScroll.left && (
            <button className="proj-tab-arrow proj-tab-arrow-left" onClick={() => nudgeTabs(-1)} aria-label="Scroll tabs left">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
          <div className="skills-tabs proj-tabs-scroll" ref={tabsRef}>
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                className={`skills-tab${cat === c.key ? ' active' : ''}`}
                onClick={() => setCat(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
          {tabsScroll.right && (
            <button className="proj-tab-arrow proj-tab-arrow-right" onClick={() => nudgeTabs(1)} aria-label="Scroll tabs right">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>

        {/* MOBILE: Accordion */}
        {isMobile ? (
          <div className="mob-proj-list">
            {catProjects.map((p, i) => (
              <div key={p.id} className={`mob-proj-item${openId === p.id ? ' open' : ''}`}>
                <button className="mob-proj-header" onClick={() => toggleAccordion(p.id)}>
                  <div className="mob-proj-header-left">
                    <span className="mob-proj-num">{String(i + 1).padStart(2, '0')}</span>
                    <div className="mob-proj-header-text">
                      <span className="mob-proj-cat">{catLabel}</span>
                      <span className="mob-proj-name">{getTabTitle(p)}</span>
                    </div>
                  </div>
                  <svg
                    className={`mob-proj-chevron${openId === p.id ? ' rotated' : ''}`}
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <AnimatePresence initial={false}>
                  {openId === p.id && (
                    <motion.div
                      className="mob-proj-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="mob-proj-content">
                        <p className="proj-desc">{p.description}</p>

                        {p.highlights?.length > 0 && (
                          <div className="proj-highlights">
                            {p.highlights.map((h, hi) => (
                              <div key={hi} className="proj-hl-item">
                                <span className="proj-hl-dot" />
                                {h}
                              </div>
                            ))}
                          </div>
                        )}

                        {p.tools?.length > 0 && (
                          <div className="proj-tools">
                            {p.tools.map(t => <span key={t} className="tool-tag">{t}</span>)}
                          </div>
                        )}

                        <div className="proj-tags">
                          {p.tags.map(tag => <span key={tag} className="project-tag">{tag}</span>)}
                        </div>

                        {(p.hasDoc || p.images?.length > 0) && (
                          <div className="mob-proj-actions">
                            {p.hasDoc && (
                              <button className="btn btn-primary btn-sm" onClick={() => setDocModal(p)}>
                                READ DOCS →
                              </button>
                            )}
                            {p.images?.length > 0 && (
                              <button className="btn btn-primary btn-sm" onClick={() => setCarouselModal(p)}>
                                MORE DETAILS →
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ) : (
          /* DESKTOP/TABLET: Panel layout */
          <motion.div
            className="project-panel"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Left: project list tabs */}
            <div className="proj-panel-left-wrap">
              {scrollState.up && (
                <div className="proj-scroll-arrow proj-scroll-up" onClick={() => nudgePanel(-1)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </div>
              )}
              <div className="project-panel-left" ref={panelRef}>
                {catProjects.map((p, i) => (
                  <div
                    key={p.id}
                    className={`proj-tab${idx === i ? ' active' : ''}`}
                    onClick={() => pick(i)}
                  >
                    <div className="proj-tab-row">
                      <span className="proj-tab-label">{catLabel}</span>
                      <span className="proj-tab-num">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="proj-tab-title">{getTabTitle(p)}</div>
                    {idx === i && <div className="proj-tab-accent" />}
                  </div>
                ))}
              </div>
              {scrollState.down && (
                <div className="proj-scroll-arrow proj-scroll-down" onClick={() => nudgePanel(1)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              )}
            </div>

            {/* Middle: project details */}
            <div className="project-panel-mid">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${cat}-${idx}`}
                  className="proj-mid-content"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="proj-desc">{active.description}</p>

                  {active.highlights?.length > 0 && (
                    <div className="proj-highlights">
                      {active.highlights.map((h, i) => (
                        <div key={i} className="proj-hl-item">
                          <span className="proj-hl-dot" />
                          {h}
                        </div>
                      ))}
                    </div>
                  )}

                  {active.tools?.length > 0 && (
                    <div className="proj-tools">
                      {active.tools.map(t => <span key={t} className="tool-tag">{t}</span>)}
                    </div>
                  )}

                  <div className="proj-tags">
                    {active.tags.map(tag => <span key={tag} className="project-tag">{tag}</span>)}
                  </div>

                  <div className="proj-actions">
                    {active.hasDoc && (
                      <button className="btn btn-primary" onClick={() => setDocModal(active)}>READ DOCS →</button>
                    )}
                    {active.images?.length > 0 && (
                      <button className="btn btn-primary" onClick={() => setCarouselModal(active)}>MORE DETAILS →</button>
                    )}
                  </div>

                  <div className="proj-step-count">
                    PROJECT {String(idx + 1).padStart(2, '0')} OF {String(catProjects.length).padStart(2, '0')}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      {docModal && <DocModal project={docModal} onClose={() => setDocModal(null)} />}
      {carouselModal && <CarouselModal project={carouselModal} onClose={() => setCarouselModal(null)} />}
    </section>
  )
}
