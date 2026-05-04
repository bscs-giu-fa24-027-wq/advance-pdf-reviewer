import { useEffect, useState } from 'react'
import Scanner from '../components/Scanner'
import useScanner from '../hooks/useScanner'
import './ScanPage.css'

function ScanPage({ onClose, onPDFReady }) {
  const {
    videoRef, stream, capturedPages, filter,
    setFilter, startCamera, stopCamera,
    capturePage, removePage, clearPages, generatePDF,
  } = useScanner()

  const [showCamera, setShowCamera] = useState(false)
  const [generating, setGenerating] = useState(false)

  const handleOpenCamera = async () => {
    const ok = await startCamera()
    setShowCamera(ok)
    if (!ok) alert('Could not access camera. Please grant camera permission.')
  }

  const handleCloseCamera = () => {
    stopCamera()
    setShowCamera(false)
  }

  const handleCapture = () => {
    capturePage()
  }

  const handleGeneratePDF = async () => {
    setGenerating(true)
    try {
      const blob = await generatePDF()
      if (blob) {
        const file = new File([blob], `scan-${Date.now()}.pdf`, { type: 'application/pdf' })
        onPDFReady(file)
      }
    } finally {
      setGenerating(false)
    }
  }

  useEffect(() => {
    return () => stopCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="scan-page">
      <div className="scan-topbar">
        <button className="scan-back-btn" onClick={onClose} aria-label="Back">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <polyline points="15,18 9,12 15,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className="scan-title">Document Scanner</h2>
        {capturedPages.length > 0 && (
          <button className="scan-clear-btn" onClick={clearPages}>Clear all</button>
        )}
      </div>

      <div className="scan-body">
        {capturedPages.length === 0 ? (
          <div className="scan-empty">
            <svg className="scan-empty-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="2"/>
              <circle cx="32" cy="32" r="10" stroke="currentColor" strokeWidth="2"/>
              <circle cx="32" cy="32" r="4" fill="currentColor"/>
            </svg>
            <p className="scan-empty-text">No pages captured yet</p>
            <p className="scan-empty-sub">Press the camera button to start scanning</p>
          </div>
        ) : (
          <div className="scan-gallery">
            {capturedPages.map((src, i) => (
              <div className="scan-thumb" key={i}>
                <img src={src} alt={`Page ${i + 1}`} className="scan-thumb-img" />
                <span className="scan-thumb-num">Page {i + 1}</span>
                <button
                  className="scan-thumb-remove"
                  onClick={() => removePage(i)}
                  aria-label={`Remove page ${i + 1}`}
                >×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="scan-footer">
        <button className="scan-cam-btn" onClick={handleOpenCamera} aria-label="Open camera">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
          </svg>
          {capturedPages.length === 0 ? 'Start Scanning' : 'Add Page'}
        </button>

        {capturedPages.length > 0 && (
          <button
            className="scan-pdf-btn"
            onClick={handleGeneratePDF}
            disabled={generating}
          >
            {generating ? 'Generating…' : `Save as PDF (${capturedPages.length} page${capturedPages.length > 1 ? 's' : ''})`}
          </button>
        )}
      </div>

      {showCamera && (
        <Scanner
          videoRef={videoRef}
          stream={stream}
          onCapture={handleCapture}
          filter={filter}
          onFilterChange={setFilter}
          onClose={handleCloseCamera}
        />
      )}
    </div>
  )
}

export default ScanPage
