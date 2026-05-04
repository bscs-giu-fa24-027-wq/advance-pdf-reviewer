import { useRef, useState, useCallback } from 'react'
import { jsPDF } from 'jspdf'

export default function useScanner() {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [capturedPages, setCapturedPages] = useState([]) // array of dataURL strings
  const [filter, setFilter] = useState('none') // 'none' | 'grayscale' | 'enhance'

  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = s
      }
      setStream(s)
      return true
    } catch {
      return false
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [stream])

  const capturePage = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')

    if (filter === 'grayscale') {
      ctx.filter = 'grayscale(100%)'
    } else if (filter === 'enhance') {
      ctx.filter = 'grayscale(100%) contrast(150%) brightness(110%)'
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setCapturedPages(prev => [...prev, dataUrl])
    return dataUrl
  }, [filter])

  const removePage = useCallback((index) => {
    setCapturedPages(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearPages = useCallback(() => {
    setCapturedPages([])
  }, [])

  const generatePDF = useCallback(async () => {
    if (capturedPages.length === 0) return null
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()

    capturedPages.forEach((dataUrl, idx) => {
      if (idx > 0) doc.addPage()
      // fit image inside page with 5mm margin
      const margin = 5
      doc.addImage(dataUrl, 'JPEG', margin, margin, pageW - margin * 2, pageH - margin * 2)
    })

    return doc.output('blob')
  }, [capturedPages])

  return {
    videoRef,
    stream,
    capturedPages,
    filter,
    setFilter,
    startCamera,
    stopCamera,
    capturePage,
    removePage,
    clearPages,
    generatePDF,
  }
}
