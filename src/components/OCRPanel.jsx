import { useState, useCallback } from 'react'
import { createWorker } from 'tesseract.js'
import './OCRPanel.css'

function OCRPanel({ pageDataUrl, pageNumber, onClose }) {
  const [status, setStatus]     = useState('idle') // idle | running | done | error
  const [progress, setProgress] = useState(0)
  const [text, setText]         = useState('')
  const [error, setError]       = useState('')

  const runOCR = useCallback(async () => {
    if (!pageDataUrl) return
    setStatus('running')
    setProgress(0)
    setText('')
    setError('')
    let worker
    try {
      worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
          }
        },
      })
      const { data } = await worker.recognize(pageDataUrl)
      setText(data.text || '(No readable text found)')
      setStatus('done')
    } catch (err) {
      setError(err.message || 'OCR failed')
      setStatus('error')
    } finally {
      if (worker) await worker.terminate()
    }
  }, [pageDataUrl])

  const copyText = useCallback(() => {
    if (text) navigator.clipboard.writeText(text).catch(() => {})
  }, [text])

  return (
    <div className="ocr-panel">
      <div className="ocr-panel-header">
        <div className="ocr-panel-title-row">
          <svg className="ocr-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
            <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="7" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="ocr-panel-title">OCR — Page {pageNumber}</span>
        </div>
        <button className="btn btn-icon" onClick={onClose} aria-label="Close OCR panel" title="Close">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="ocr-panel-body">
        {status === 'idle' && (
          <div className="ocr-idle">
            <p className="ocr-hint">
              Extract text from the current page using OCR (Optical Character Recognition).
            </p>
            <button className="btn btn-primary" onClick={runOCR} disabled={!pageDataUrl}>
              {pageDataUrl ? 'Extract Text' : 'Rendering page…'}
            </button>
          </div>
        )}

        {status === 'running' && (
          <div className="ocr-running">
            <div className="spinner" />
            <p className="ocr-progress-label">Analysing… {progress}%</p>
            <div className="ocr-progress-bar">
              <div className="ocr-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="ocr-error">
            <p>{error}</p>
            <button className="btn btn-outline btn-sm" onClick={runOCR}>Retry</button>
          </div>
        )}

        {status === 'done' && (
          <div className="ocr-result">
            <div className="ocr-result-header">
              <span className="ocr-result-label">Extracted Text</span>
              <button className="btn btn-sm btn-outline" onClick={copyText}>Copy</button>
            </div>
            <pre className="ocr-text">{text}</pre>
            <button className="btn btn-sm btn-ghost ocr-rerun" onClick={runOCR}>
              Re-run OCR
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OCRPanel
