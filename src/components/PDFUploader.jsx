import { useCallback } from 'react'
import './PDFUploader.css'

function PDFUploader({ onFileSelect }) {
  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0]
      if (file && file.type === 'application/pdf') {
        onFileSelect(file)
      }
    },
    [onFileSelect],
  )

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.currentTarget.classList.remove('drag-over')
      const file = e.dataTransfer.files?.[0]
      if (file && file.type === 'application/pdf') {
        onFileSelect(file)
      }
    },
    [onFileSelect],
  )

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over')
  }

  return (
    <div className="uploader-wrapper">
      <div
        className="uploader-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="region"
        aria-label="PDF upload area"
      >
        <svg className="uploader-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="14,2 14,8 20,8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <polyline points="9,15 12,12 15,15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <h2 className="uploader-heading">Drop your PDF here</h2>
        <p className="uploader-sub">or click to browse from your computer</p>

        <label className="btn btn-primary uploader-btn" htmlFor="pdf-input">
          Browse PDF
          <input
            id="pdf-input"
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>

        <p className="uploader-hint">Only PDF files are supported</p>
      </div>
    </div>
  )
}

export default PDFUploader
