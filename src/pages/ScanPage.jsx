import { useEffect, useRef, useState } from 'react'
import useScanner from '../hooks/useScanner'
import './ScanPage.css'

/* ── Tiny sub-components ─────────────────────────────────────── */

function FilterStrip({ options, active, onChange }) {
  return (
    <div className="filter-strip">
      {options.map((f) => (
        <button
          key={f.id}
          className={`filter-pill ${active === f.id ? 'active' : ''}`}
          onClick={() => onChange(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

function PageThumbnail({ page, index, onDelete, onMoveUp, onMoveDown, total }) {
  return (
    <div className="thumb-card">
      <img src={page.dataUrl} alt={`Page ${index + 1}`} className="thumb-img" />
      <div className="thumb-overlay">
        <span className="thumb-num">{index + 1}</span>
        <div className="thumb-actions">
          {index > 0 && (
            <button className="thumb-action-btn" onClick={() => onMoveUp(index)} title="Move up">↑</button>
          )}
          {index < total - 1 && (
            <button className="thumb-action-btn" onClick={() => onMoveDown(index)} title="Move down">↓</button>
          )}
          <button className="thumb-action-btn thumb-action-btn--delete" onClick={() => onDelete(index)} title="Delete">✕</button>
        </div>
      </div>
      <div className={`thumb-filter-badge thumb-filter-badge--${page.filter}`}>{page.filter}</div>
    </div>
  )
}

/* ── Main ScanPage ───────────────────────────────────────────── */

function ScanPage({ onClose, onPDFCreated }) {
  const videoRef = useRef(null)
  const sc = useScanner(videoRef)

  // stage: 'camera' | 'preview' | 'gallery'
  const [stage, setStage] = useState('camera')
  const [genError, setGenError] = useState('')

  /* Start camera on mount */
  useEffect(() => {
    sc.startCamera()
    return () => sc.stopCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* After capture, go to preview */
  const handleCapture = () => {
    sc.capturePhoto()
    setStage('preview')
  }

  /* Keep the preview → go back to camera */
  const handleKeep = () => {
    sc.confirmCapture()
    setStage('camera')
  }

  /* Retake → back to camera */
  const handleRetake = () => {
    sc.retake()
    setStage('camera')
  }

  /* Generate PDF */
  const handleGeneratePDF = async () => {
    setGenError('')
    try {
      const file = await sc.generatePDF()
      if (file) {
        sc.stopCamera()
        onPDFCreated(file)
      }
    } catch (err) {
      setGenError(err.message || 'PDF generation failed')
    }
  }

  /* Move page up = swap with previous */
  const handleMoveUp   = (i) => sc.movePage(i, i - 1)
  const handleMoveDown = (i) => sc.movePage(i, i + 1)

  return (
    <div className="scan-page">
      {/* ── Top bar ── */}
      <div className="scan-topbar">
        <button className="scan-topbar-btn" onClick={onClose} aria-label="Close scanner">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <span className="scan-topbar-title">
          {stage === 'gallery' ? `${sc.capturedPages.length} page${sc.capturedPages.length !== 1 ? 's' : ''}` : 'Scan Document'}
        </span>

        <div className="scan-topbar-right">
          {stage === 'camera' && (
            <>
              <button className="scan-topbar-btn" onClick={sc.flipCamera} aria-label="Flip camera" title="Flip camera">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20 7H9a3 3 0 0 0-3 3v1M4 17h11a3 3 0 0 0 3-3v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="17,4 20,7 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="7,14 4,17 7,20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {sc.capturedPages.length > 0 && (
                <button
                  className="scan-topbar-btn scan-gallery-btn"
                  onClick={() => { sc.stopCamera(); setStage('gallery') }}
                  title="View captured pages"
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span className="scan-gallery-count">{sc.capturedPages.length}</span>
                </button>
              )}
            </>
          )}
          {stage === 'gallery' && (
            <button
              className="scan-topbar-btn"
              onClick={() => { sc.startCamera(); setStage('camera') }}
              title="Add more pages"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Camera stage ── */}
      {stage === 'camera' && (
        <div className="scan-camera-stage">
          <div className="scan-viewfinder">
            {sc.cameraError ? (
              <div className="scan-camera-error">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="16" r="1" fill="currentColor"/>
                </svg>
                <p>{sc.cameraError}</p>
                <button className="btn btn-outline btn-sm" onClick={() => sc.startCamera()}>
                  Retry
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="scan-video"
                  autoPlay
                  playsInline
                  muted
                />
                <div className="scan-corner scan-corner--tl" aria-hidden="true" />
                <div className="scan-corner scan-corner--tr" aria-hidden="true" />
                <div className="scan-corner scan-corner--bl" aria-hidden="true" />
                <div className="scan-corner scan-corner--br" aria-hidden="true" />
              </>
            )}
          </div>

          {/* Filter strip */}
          <FilterStrip
            options={sc.FILTER_OPTIONS}
            active={sc.activeFilter}
            onChange={sc.setActiveFilter}
          />

          {/* Capture bar */}
          <div className="scan-capture-bar">
            {/* Last captured thumbnail */}
            {sc.capturedPages.length > 0 ? (
              <img
                src={sc.capturedPages[sc.capturedPages.length - 1].dataUrl}
                alt="Last captured"
                className="scan-last-thumb"
                onClick={() => { sc.stopCamera(); setStage('gallery') }}
              />
            ) : (
              <div className="scan-last-thumb scan-last-thumb--empty" />
            )}

            <button
              className="scan-capture-btn"
              onClick={handleCapture}
              disabled={!sc.cameraActive}
              aria-label="Capture photo"
            >
              <span className="scan-capture-btn-ring" />
              <span className="scan-capture-btn-dot" />
            </button>

            {/* Page count */}
            <div className="scan-page-count">
              {sc.capturedPages.length > 0
                ? `${sc.capturedPages.length} page${sc.capturedPages.length !== 1 ? 's' : ''}`
                : 'Tap to capture'}
            </div>
          </div>
        </div>
      )}

      {/* ── Preview stage ── */}
      {stage === 'preview' && sc.previewDataUrl && (
        <div className="scan-preview-stage">
          <div className="scan-preview-wrap">
            <img src={sc.previewDataUrl} alt="Captured preview" className="scan-preview-img" />
          </div>

          <FilterStrip
            options={sc.FILTER_OPTIONS}
            active={sc.activeFilter}
            onChange={sc.setActiveFilter}
          />

          <div className="scan-preview-actions">
            <button className="btn btn-outline btn-lg" onClick={handleRetake}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <polyline points="15,18 9,12 15,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Retake
            </button>
            <button className="btn btn-primary btn-lg" onClick={handleKeep}>
              Keep Page
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Gallery stage ── */}
      {stage === 'gallery' && (
        <div className="scan-gallery-stage">
          {sc.capturedPages.length === 0 ? (
            <div className="scan-gallery-empty">
              <p>No pages captured yet.</p>
              <button className="btn btn-primary" onClick={() => { sc.startCamera(); setStage('camera') }}>
                Start Scanning
              </button>
            </div>
          ) : (
            <>
              <div className="scan-gallery-grid">
                {sc.capturedPages.map((page, i) => (
                  <PageThumbnail
                    key={i}
                    page={page}
                    index={i}
                    total={sc.capturedPages.length}
                    onDelete={sc.deletePage}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                  />
                ))}
              </div>

              {genError && <p className="scan-gen-error">{genError}</p>}

              <div className="scan-gallery-footer">
                <button
                  className="btn btn-outline"
                  onClick={() => { sc.startCamera(); setStage('camera') }}
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Add More
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleGeneratePDF}
                  disabled={sc.isGenerating}
                >
                  {sc.isGenerating ? (
                    <><span className="spinner" />Generating…</>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Create PDF ({sc.capturedPages.length} {sc.capturedPages.length === 1 ? 'page' : 'pages'})
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ScanPage
