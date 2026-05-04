import { useState, useCallback } from 'react'

// Each annotation: { id, page, tool, data }
// tool 'draw': data = { points: [{x,y}], color, width }
// tool 'highlight': data = { x, y, w, h, color }
// tool 'text': data = { x, y, text, color, fontSize }

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `ann-${Date.now()}-${Math.random().toString(36).slice(2)}`

export default function useAnnotations() {
  const [annotations, setAnnotations] = useState([])
  const [activeTool, setActiveTool] = useState('draw') // 'draw' | 'highlight' | 'text' | null
  const [activeColor, setActiveColor] = useState('#ef4444')
  const [activeWidth, setActiveWidth] = useState(3)

  const addAnnotation = useCallback((annotation) => {
    setAnnotations(prev => [...prev, { ...annotation, id: generateId() }])
  }, [])

  const removeAnnotation = useCallback((id) => {
    setAnnotations(prev => prev.filter(a => a.id !== id))
  }, [])

  const getPageAnnotations = useCallback((page) => {
    return annotations.filter(a => a.page === page)
  }, [annotations])

  const clearPageAnnotations = useCallback((page) => {
    setAnnotations(prev => prev.filter(a => a.page !== page))
  }, [])

  return {
    annotations,
    activeTool,
    setActiveTool,
    activeColor,
    setActiveColor,
    activeWidth,
    setActiveWidth,
    addAnnotation,
    removeAnnotation,
    getPageAnnotations,
    clearPageAnnotations,
  }
}
