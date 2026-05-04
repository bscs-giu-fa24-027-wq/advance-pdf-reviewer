import { useState, useRef, useCallback } from 'react'
import { jsPDF } from 'jspdf'

export const FILTER_OPTIONS = [
  { id: 'color',     label: 'Color' },
  { id: 'grayscale', label: 'Gray' },
  { id: 'enhanced',  label: 'Enhanced' },
  { id: 'bw',        label: 'B&W' },
]

/** Apply a visual filter to a canvas and return a new canvas with the result. */
function applyFilter(srcCanvas, filter) {
  const out = document.createElement('canvas')
  out.width  = srcCanvas.width
  out.height = srcCanvas.height
  const ctx  = out.getContext('2d')
  ctx.drawImage(srcCanvas, 0, 0)

  if (filter === 'color') return out

  const imgData = ctx.getImageData(0, 0, out.width, out.height)
  const d = imgData.data
  const len = d.length

  if (filter === 'grayscale') {
    for (let i = 0; i < len; i += 4) {
      const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
      d[i] = d[i + 1] = d[i + 2] = g
    }
  } else if (filter === 'enhanced') {
    // grayscale + strong contrast boost
    const factor = 2.2
    for (let i = 0; i < len; i += 4) {
      const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
      const c = Math.min(255, Math.max(0, (g - 128) * factor + 128))
      d[i] = d[i + 1] = d[i + 2] = c
    }
  } else if (filter === 'bw') {
    // hard black-and-white threshold
    for (let i = 0; i < len; i += 4) {
      const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
      d[i] = d[i + 1] = d[i + 2] = g > 145 ? 255 : 0
    }
  }

  ctx.putImageData(imgData, 0, 0)
  return out
}

function useScanner(videoRef) {
  const streamRef = useRef(null)

  const [cameraActive, setCameraActive]     = useState(false)
  const [cameraError, setCameraError]       = useState(null)
  const [facingMode, setFacingMode]         = useState('environment')
  const [activeFilter, setActiveFilter]     = useState('enhanced')
  const [capturedPages, setCapturedPages]   = useState([])   // [{ dataUrl, filter }]
  const [previewCanvas, setPreviewCanvas]   = useState(null) // raw canvas before filter
  const [isGenerating, setIsGenerating]     = useState(false)

  /* ─── Camera ─────────────────────────────────────── */

  const startCamera = useCallback(async (mode) => {
    const facing = mode ?? facingMode
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width:  { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraActive(true)
      setCameraError(null)
    } catch (err) {
      setCameraError(err.message || 'Camera access denied')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraActive(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const flipCamera = useCallback(() => {
    const next = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(next)
    startCamera(next)
  }, [facingMode, startCamera])

  /* ─── Capture ─────────────────────────────────────── */

  const capturePhoto = useCallback(() => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return
    const canvas    = document.createElement('canvas')
    canvas.width    = video.videoWidth
    canvas.height   = video.videoHeight
    const ctx       = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    setPreviewCanvas(canvas)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Keep the current preview (applying the selected filter) */
  const confirmCapture = useCallback(() => {
    if (!previewCanvas) return
    const filtered = applyFilter(previewCanvas, activeFilter)
    const dataUrl  = filtered.toDataURL('image/jpeg', 0.92)
    setCapturedPages((prev) => [...prev, { dataUrl, filter: activeFilter }])
    setPreviewCanvas(null)
  }, [previewCanvas, activeFilter])

  const retake = useCallback(() => setPreviewCanvas(null), [])

  /* ─── Gallery actions ─────────────────────────────── */

  const deletePage = useCallback((idx) => {
    setCapturedPages((prev) => prev.filter((_, i) => i !== idx))
  }, [])

  const movePage = useCallback((from, to) => {
    setCapturedPages((prev) => {
      const arr = [...prev]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return arr
    })
  }, [])

  /* ─── PDF generation ──────────────────────────────── */

  const generatePDF = useCallback(async () => {
    if (capturedPages.length === 0) return null
    setIsGenerating(true)
    try {
      const pdf   = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = 210
      const pageH = 297

      for (let i = 0; i < capturedPages.length; i++) {
        if (i > 0) pdf.addPage()
        const img = new Image()
        await new Promise((res) => {
          img.onload = res
          img.src    = capturedPages[i].dataUrl
        })
        // Fit image proportionally on the A4 page
        const ratio   = img.width / img.height
        const pageRatio = pageW / pageH
        let drawW = pageW, drawH = pageH, offX = 0, offY = 0
        if (ratio > pageRatio) {
          drawH = pageW / ratio
          offY  = (pageH - drawH) / 2
        } else {
          drawW = pageH * ratio
          offX  = (pageW - drawW) / 2
        }
        pdf.setFillColor(255, 255, 255)
        pdf.rect(0, 0, pageW, pageH, 'F')
        pdf.addImage(capturedPages[i].dataUrl, 'JPEG', offX, offY, drawW, drawH)
      }

      const blob = pdf.output('blob')
      return new File([blob], `Scan_${Date.now()}.pdf`, { type: 'application/pdf' })
    } finally {
      setIsGenerating(false)
    }
  }, [capturedPages])

  /* ─── Reset ───────────────────────────────────────── */

  const reset = useCallback(() => {
    setCapturedPages([])
    setPreviewCanvas(null)
  }, [])

  /* ─── Preview data URL ────────────────────────────── */
  const previewDataUrl = previewCanvas
    ? applyFilter(previewCanvas, activeFilter).toDataURL('image/jpeg', 0.85)
    : null

  return {
    cameraActive,
    cameraError,
    facingMode,
    activeFilter,
    capturedPages,
    previewCanvas,
    previewDataUrl,
    isGenerating,
    FILTER_OPTIONS,
    startCamera,
    stopCamera,
    flipCamera,
    capturePhoto,
    confirmCapture,
    retake,
    deletePage,
    movePage,
    generatePDF,
    reset,
    setActiveFilter,
  }
}

export default useScanner
