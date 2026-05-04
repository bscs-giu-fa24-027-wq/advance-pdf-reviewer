import './PDFControls.css'

function PDFControls({ currentPage, totalPages, scale, onPageChange, onScaleChange, onDownload, onPrint }) {
  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

  return (
    <div className="pdf-controls">
      {/* Page navigation */}
      <div className="controls-group">
        <button
          className="ctrl-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPrev}
          aria-label="Previous page"
          title="Previous page"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <polyline points="15,18 9,12 15,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <span className="page-indicator">
          <input
            className="page-input"
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10)
              if (val >= 1 && val <= totalPages) onPageChange(val)
            }}
            aria-label="Current page"
          />
          <span className="page-sep">/ {totalPages}</span>
        </span>

        <button
          className="ctrl-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNext}
          aria-label="Next page"
          title="Next page"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Zoom */}
      <div className="controls-group">
        <button
          className="ctrl-btn"
          onClick={() => onScaleChange(Math.max(0.5, scale - 0.1))}
          aria-label="Zoom out"
          title="Zoom out"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <span className="scale-label">{Math.round(scale * 100)}%</span>

        <button
          className="ctrl-btn"
          onClick={() => onScaleChange(Math.min(3, scale + 0.1))}
          aria-label="Zoom in"
          title="Zoom in"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <button
          className="ctrl-btn"
          onClick={() => onScaleChange(1)}
          aria-label="Reset zoom"
          title="Reset zoom"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Download / Print */}
      <div className="controls-group controls-group--right">
        {onPrint && (
          <button className="ctrl-btn" onClick={onPrint} aria-label="Print PDF" title="Print PDF">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="6,9 6,2 18,2 18,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="6" y="14" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        {onDownload && (
          <button className="ctrl-btn ctrl-btn--accent" onClick={onDownload} aria-label="Download PDF" title="Download PDF">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default PDFControls
