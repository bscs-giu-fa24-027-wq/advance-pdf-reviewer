import Header from '../components/Header'
import PDFUploader from '../components/PDFUploader'
import './HomePage.css'

function HomePage({ onFileSelect, onScan }) {
  return (
    <div className="home-page">
      <Header />
      <main className="home-main">
        <div className="home-intro">
          <h1 className="home-heading">Advanced PDF Reviewer</h1>
          <p className="home-sub">
            Upload a PDF to review and annotate, or scan a physical document with your camera.
          </p>
        </div>

        <div className="home-actions">
          <button className="home-scan-fab" onClick={onScan} aria-label="Scan document">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Scan Document
          </button>
        </div>

        <PDFUploader onFileSelect={onFileSelect} />
      </main>
    </div>
  )
}

export default HomePage
