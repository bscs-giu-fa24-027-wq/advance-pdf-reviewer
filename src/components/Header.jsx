import './Header.css'

function Header({ onUploadNew }) {
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

      {onUploadNew && (
        <button className="btn btn-outline" onClick={onUploadNew}>
          Open New PDF
        </button>
      )}
    </header>
  )
}

export default Header
