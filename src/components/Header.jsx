import './Header.css'

function Header({ onUploadNew, onDownload, onPrint, onToggleOCR, showOCRButton }) {
  return (
    <header className="header">
      <div className="header-brand">
        <svg className="header-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span className="header-title">Advance PDF Reviewer</span>
      </div>

      <div className="header-actions">
        {showOCRButton && onToggleOCR && (
          <button className="btn btn-outline header-action-btn" onClick={onToggleOCR} title="Toggle OCR panel">
            OCR
          </button>
        )}
        {onPrint && (
          <button className="btn btn-outline header-action-btn" onClick={onPrint} title="Print PDF" aria-label="Print">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="6,9 6,2 18,2 18,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="6" y="14" width="12" height="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        {onDownload && (
          <button className="btn btn-outline header-action-btn" onClick={onDownload} title="Download PDF" aria-label="Download">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        {onUploadNew && (
          <button className="btn btn-outline" onClick={onUploadNew}>
            Open New PDF
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
