import { useCallback } from 'react'
import './HomePage.css'

function HomePage({ onFileSelect, onScan }) {
  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0]
      if (file && file.type === 'application/pdf') onFileSelect(file)
    },
    [onFileSelect],
  )

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.currentTarget.classList.remove('drag-over')
      const file = e.dataTransfer.files?.[0]
      if (file && file.type === 'application/pdf') onFileSelect(file)
    },
    [onFileSelect],
  )

  return (
    <div className="home-page">
      {/* ── Header ── */}
      <header className="home-header">
        <div className="home-brand">
          <div className="home-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="home-brand-name">PDF Scanner</span>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="home-main">
        <div className="home-hero">
          <div className="home-hero-badge">Advanced • OCR • Annotations</div>
          <h1 className="home-hero-title">
            Scan, Review &amp;<br />Annotate PDFs
          </h1>
          <p className="home-hero-sub">
            Capture documents with your camera, extract text with AI-powered OCR,
            and annotate PDFs — all in one sleek app.
          </p>

          {/* Primary CTA: Scan */}
          <button className="home-scan-btn" onClick={onScan}>
            <span className="home-scan-btn-inner">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 3V2M18 3V2M2 9h1M21 9h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Scan Document
            </span>
          </button>

          <div className="home-divider">
            <span>or open a PDF file</span>
          </div>

          {/* Upload zone */}
          <div
            className="home-upload-zone"
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over') }}
            onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
            role="region"
            aria-label="PDF upload area"
          >
            <svg className="home-upload-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <polyline points="9,15 12,12 15,15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="home-upload-label">Drop a PDF here</p>
            <label className="btn btn-outline home-upload-btn" htmlFor="pdf-input">
              Browse file
              <input id="pdf-input" type="file" accept="application/pdf" className="sr-only" onChange={handleFileChange}/>
            </label>
          </div>
        </div>

        {/* ── Feature cards ── */}
        <div className="home-features">
          <div className="home-feature-card">
            <div className="feature-icon feature-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="feature-title">Smart Scanning</h3>
            <p className="feature-desc">Capture multi-page documents with your camera. Applies image enhancement filters automatically.</p>
          </div>

          <div className="home-feature-card">
            <div className="feature-icon feature-icon--violet">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
                <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="7" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="feature-title">OCR Text Extraction</h3>
            <p className="feature-desc">Extract and copy text from any PDF page or scanned image using AI-powered OCR.</p>
          </div>

          <div className="home-feature-card">
            <div className="feature-icon feature-icon--indigo">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 19l7-7 3 3-7 7-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-title">Rich Annotations</h3>
            <p className="feature-desc">Draw, highlight, and add text annotations directly on your PDF pages. Review and comment with ease.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
