import './Header.css'

function Header({ onUploadNew, fileName, onOCR, ocrActive }) {
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
        <span className="header-title">PDF Scanner</span>
      </div>

      {fileName && <span className="header-filename" title={fileName}>{fileName}</span>}

      <div className="header-actions">
        {onOCR && (
          <button
            className={`btn btn-sm ${ocrActive ? 'btn-primary' : 'btn-outline'}`}
            onClick={onOCR}
            title="Extract text with OCR"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
              <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="7" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            OCR
          </button>
        )}

        {onUploadNew && (
          <button className="btn btn-outline btn-sm" onClick={onUploadNew}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="15,18 9,12 15,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
