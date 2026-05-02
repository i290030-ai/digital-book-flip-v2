import { useState, useRef, useEffect } from 'react'
import './FlipBook.css'

const LAYOUTS = [
  'imageTop',
  'imageRight',
  'imageBottom',
  'imageLeft',
]

function getLayout(index) {
  return LAYOUTS[index % LAYOUTS.length]
}

function PageContent({ chapter, layout }) {
  const hasImages = chapter.images && chapter.images.length > 0
  const multiImages = hasImages && chapter.images.length >= 2

  // Two or more images → always gallery, regardless of layout
  if (multiImages) {
    return (
      <div className="content-column">
        <div className="gallery">
          {chapter.images.map((src, i) => (
            <div key={i} className="image-container">
              <img src={src} alt={`תמונה ${i + 1}`} className="gallery-img" />
            </div>
          ))}
        </div>
        <p className="chapter-body">{chapter.body}</p>
      </div>
    )
  }

  // No images → plain text column
  if (!hasImages) {
    return (
      <div className="content-column">
        <p className="chapter-body">{chapter.body}</p>
      </div>
    )
  }

  const src = chapter.images[0]

  switch (layout) {
    case 'imageTop':
      return (
        <div className="content-column">
          <div className="image-container">
            <img src={src} alt="תמונה" className="img-top" />
          </div>
          <p className="chapter-body">{chapter.body}</p>
        </div>
      )

    case 'imageBottom':
      return (
        <div className="content-column">
          <p className="chapter-body">{chapter.body}</p>
          <div className="image-container">
            <img src={src} alt="תמונה" className="img-bottom" />
          </div>
        </div>
      )

    // float-based: text flows around image, then continues full-width
    case 'imageRight':
      return (
        <div className="v2-float-wrap">
          <img src={src} alt="תמונה" className="v2-float-img v2-float-img--right" />
          <div className="v2-float-text">{chapter.body}</div>
        </div>
      )

    case 'imageLeft':
      return (
        <div className="v2-float-wrap">
          <img src={src} alt="תמונה" className="v2-float-img v2-float-img--left" />
          <div className="v2-float-text">{chapter.body}</div>
        </div>
      )

    default:
      return (
        <div className="content-column">
          <p className="chapter-body">{chapter.body}</p>
          <div className="image-container">
            <img src={src} alt="תמונה" className="img-bottom" />
          </div>
        </div>
      )
  }
}

export default function FlipBook({ chapters }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState(null)
  const [displayPage, setDisplayPage] = useState(0)
  const timeoutRef = useRef(null)
  const bodyRef = useRef(null)

  const ANIM_DURATION = 500

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }

  function handleNext() {
    if (animating || currentPage >= chapters.length - 1) return
    setDirection('next')
    setAnimating(true)
    timeoutRef.current = setTimeout(() => {
      setCurrentPage(prev => prev + 1)
      setDisplayPage(prev => prev + 1)
      setAnimating(false)
      setDirection(null)
      scrollToTop()
    }, ANIM_DURATION)
  }

  function handlePrev() {
    if (animating || currentPage <= 0) return
    setDirection('prev')
    setAnimating(true)
    timeoutRef.current = setTimeout(() => {
      setCurrentPage(prev => prev - 1)
      setDisplayPage(prev => prev - 1)
      setAnimating(false)
      setDirection(null)
      scrollToTop()
    }, ANIM_DURATION)
  }

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  const chapter = chapters[displayPage]
  const layout = getLayout(displayPage)

  let pageClass = 'page'
  if (animating) pageClass += ' animating'
  if (animating && direction === 'next') pageClass += ' flip-out-next'
  if (animating && direction === 'prev') pageClass += ' flip-out-prev'

  return (
    <div className="flipbook-wrapper" dir="rtl">
      <div className="book-container">
        <div className={pageClass} key={displayPage}>
          <div className="page-inner">
            <div className="page-header">
              <div className="chapter-number">פרק {chapter.id}</div>
              <h1 className="chapter-title">{chapter.title}</h1>
              <h2 className="chapter-subtitle">{chapter.subtitle}</h2>
              <div className="page-divider" />
            </div>

            <div className="page-body" ref={bodyRef}>
              <div className="v2-layout-debug">Layout: {layout}</div>
              <PageContent chapter={chapter} layout={layout} />
            </div>

            <div className="page-footer">
              <span className="page-number">{currentPage + 1} / {chapters.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="nav-buttons">
        <button
          className="nav-btn prev-btn"
          onClick={handlePrev}
          disabled={currentPage === 0 || animating}
        >
          ← קודם
        </button>
        <button
          className="nav-btn next-btn"
          onClick={handleNext}
          disabled={currentPage === chapters.length - 1 || animating}
        >
          הבא →
        </button>
      </div>

      <div className="debug-bar">
        currentPage: <strong>{currentPage}</strong> | layout: <strong>{layout}</strong> | direction: <strong>{direction ?? '—'}</strong>
      </div>
    </div>
  )
}
