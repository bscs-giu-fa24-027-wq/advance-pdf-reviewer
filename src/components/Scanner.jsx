import { useEffect } from 'react'
import './Scanner.css'

function Scanner({ videoRef, stream, onCapture, filter, onFilterChange, onClose }) {
  useEffect(() => {
    return () => {
      // cleanup handled by parent via onClose
    }
  }, [])

  return (
    <div className="scanner-overlay">
      <div className="scanner-header">
        <button className="scanner-close-btn" onClick={onClose} aria-label="Close scanner">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <span className="scanner-title">Scanner</span>
        <div className="scanner-filter-group">
          {['none', 'grayscale', 'enhance'].map(f => (
            <button
              key={f}
              className={`scanner-filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => onFilterChange(f)}
            >
              {f === 'none' ? 'Color' : f === 'grayscale' ? 'B&W' : 'Enhance'}
            </button>
          ))}
        </div>
      </div>

      <div className="scanner-viewfinder">
        <video
          ref={videoRef}
          className={`scanner-video filter-${filter}`}
          autoPlay
          playsInline
          muted
        />
        <div className="scanner-frame" />
      </div>

      <div className="scanner-footer">
        {stream ? (
          <button className="scanner-capture-btn" onClick={onCapture} aria-label="Capture page">
            <span className="scanner-capture-ring" />
          </button>
        ) : (
          <p className="scanner-no-cam">Camera not available</p>
        )}
      </div>
    </div>
  )
}

export default Scanner
