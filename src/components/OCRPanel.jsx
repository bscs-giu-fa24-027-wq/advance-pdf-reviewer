import { useState, useCallback } from 'react'
import './OCRPanel.css'

function OCRPanel({ pdfPageCanvas, onClose }) {
  const [text, setText] = useState('')
  const [running, setRunning] = useState(false)
  const [error, setError] = useState(null)

  const runOCR = useCallback(async () => {
    setRunning(true)
    setError(null)
    setText('')
    try {
      const { createWorker } = await import('tesseract.js')
      const worker = await createWorker('eng')
      let imageSource = pdfPageCanvas
      if (!imageSource) {
        // fallback: try to find the react-pdf canvas on the page
        imageSource = document.querySelector('.react-pdf__Page__canvas') || document.querySelector('canvas')
      }
      if (!imageSource) {
        setError('No page canvas found. Please wait for the PDF page to load.')
        return
      }
      const { data } = await worker.recognize(imageSource)
      setText(data.text || '(No text detected)')
      await worker.terminate()
    } catch (err) {
      setError(err.message || 'OCR failed')
    } finally {
      setRunning(false)
    }
  }, [pdfPageCanvas])

  const copyText = () => {
    if (text) navigator.clipboard.writeText(text).catch(() => {})
  }

  return (
    <div className="ocr-panel">
      <div className="ocr-header">
        <h3 className="ocr-title">OCR — Extract Text</h3>
        <button className="ocr-close-btn" onClick={onClose} aria-label="Close OCR panel">×</button>
      </div>

      <div className="ocr-body">
        {text ? (
          <>
            <pre className="ocr-text">{text}</pre>
            <button className="ocr-copy-btn" onClick={copyText}>Copy text</button>
          </>
        ) : error ? (
          <p className="ocr-error">{error}</p>
        ) : (
          <p className="ocr-hint">Click &quot;Run OCR&quot; to extract text from the current page.</p>
        )}
      </div>

      <div className="ocr-footer">
        <button
          className="ocr-run-btn"
          onClick={runOCR}
          disabled={running}
        >
          {running ? 'Running OCR…' : 'Run OCR'}
        </button>
      </div>
    </div>
  )
}

export default OCRPanel
