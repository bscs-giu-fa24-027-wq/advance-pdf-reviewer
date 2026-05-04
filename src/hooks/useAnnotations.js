import { useState, useCallback, useRef, useEffect } from 'react'

let nextId = 1

function loadAnnotationsFromStorage(storageKey) {
  if (!storageKey) return []
  try {
    const raw = localStorage.getItem(`annotations:${storageKey}`)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return []
}

export const TOOLS = [
  { id: 'draw',      label: 'Draw',      icon: 'pencil' },
  { id: 'highlight', label: 'Highlight', icon: 'highlight' },
  { id: 'text',      label: 'Text',      icon: 'text' },
  { id: 'eraser',    label: 'Eraser',    icon: 'eraser' },
]

export const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#000000', // black
]

/**
 * Manages annotations per PDF page.
 * Each annotation: { id, type, page, color, strokeWidth, points | rect | label }
 * Optionally persists to localStorage when storageKey is provided.
 */
function useAnnotations(storageKey) {
  const [annotations, setAnnotations]   = useState(() => {
    const saved = loadAnnotationsFromStorage(storageKey)
    if (saved.length > 0) {
      nextId = Math.max(...saved.map((a) => a.id)) + 1
    }
    return saved
  })
  const [activeTool, setActiveTool]     = useState('draw')
  const [activeColor, setActiveColor]   = useState('#3b82f6')
  const [strokeWidth, setStrokeWidth]   = useState(3)
  const [isDrawing, setIsDrawing]       = useState(false)
  const currentPoints                   = useRef([])      // live points for 'draw'
  const currentRect                     = useRef(null)    // live rect for 'highlight'
  const dragStart                       = useRef(null)

  /* ─── Persist annotations to localStorage ────────── */

  useEffect(() => {
    if (!storageKey) return
    try {
      localStorage.setItem(`annotations:${storageKey}`, JSON.stringify(annotations))
    } catch {
      // ignore quota errors
    }
  }, [annotations, storageKey])

  /* ─── Save a completed annotation ───────────────── */

  const saveAnnotation = useCallback((ann) => {
    setAnnotations((prev) => [...prev, { id: nextId++, ...ann }])
  }, [])

  /* ─── Erase annotations at a point ──────────────── */

  const eraseAt = useCallback((page, nx, ny, radius = 0.02) => {
    setAnnotations((prev) =>
      prev.filter((ann) => {
        if (ann.page !== page) return true
        if (ann.type === 'draw') {
          return !ann.points.some(
            (p) => Math.hypot(p.x - nx, p.y - ny) < radius,
          )
        }
        if (ann.type === 'highlight') {
          const { x, y, w, h } = ann.rect
          return !(nx >= x && nx <= x + w && ny >= y && ny <= y + h)
        }
        if (ann.type === 'text') {
          return Math.hypot(ann.x - nx, ann.y - ny) > radius * 3
        }
        return true
      }),
    )
  }, [])

  /* ─── Delete single annotation ───────────────────── */

  const deleteAnnotation = useCallback((id) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id))
  }, [])

  /* ─── Clear all annotations on a page ────────────── */

  const clearPage = useCallback((page) => {
    setAnnotations((prev) => prev.filter((a) => a.page !== page))
  }, [])

  /* ─── Clear all annotations ──────────────────────── */

  const clearAll = useCallback(() => {
    if (storageKey) {
      try { localStorage.removeItem(`annotations:${storageKey}`) } catch { /* ignore */ }
    }
    setAnnotations([])
  }, [storageKey])

  /* ─── Pointer event helpers ──────────────────────── */

  const onPointerDown = useCallback(
    (page, nx, ny) => {
      setIsDrawing(true)
      if (activeTool === 'draw') {
        currentPoints.current = [{ x: nx, y: ny }]
      } else if (activeTool === 'highlight') {
        dragStart.current  = { x: nx, y: ny }
        currentRect.current = { x: nx, y: ny, w: 0, h: 0 }
      } else if (activeTool === 'eraser') {
        eraseAt(page, nx, ny)
      }
    },
    [activeTool, eraseAt],
  )

  const onPointerMove = useCallback(
    (page, nx, ny) => {
      if (!isDrawing) return
      if (activeTool === 'draw') {
        currentPoints.current = [...currentPoints.current, { x: nx, y: ny }]
      } else if (activeTool === 'highlight' && dragStart.current) {
        const ds = dragStart.current
        currentRect.current = {
          x: Math.min(ds.x, nx),
          y: Math.min(ds.y, ny),
          w: Math.abs(nx - ds.x),
          h: Math.abs(ny - ds.y),
        }
      } else if (activeTool === 'eraser') {
        eraseAt(page, nx, ny)
      }
    },
    [activeTool, isDrawing, eraseAt],
  )

  const onPointerUp = useCallback(
    (page, nx, ny) => {
      if (!isDrawing) return
      setIsDrawing(false)
      if (activeTool === 'draw' && currentPoints.current.length > 1) {
        saveAnnotation({
          type: 'draw',
          page,
          color: activeColor,
          strokeWidth,
          points: currentPoints.current,
        })
        currentPoints.current = []
      } else if (activeTool === 'highlight' && currentRect.current?.w > 0.005) {
        saveAnnotation({
          type: 'highlight',
          page,
          color: activeColor,
          rect: currentRect.current,
        })
        currentRect.current = null
        dragStart.current   = null
      } else if (activeTool === 'text') {
        const label = window.prompt('Enter annotation text:')
        if (label?.trim()) {
          saveAnnotation({ type: 'text', page, color: activeColor, x: nx, y: ny, label: label.trim() })
        }
      }
    },
    [activeTool, isDrawing, activeColor, strokeWidth, saveAnnotation],
  )

  /* ─── Live preview data (for rendering mid-stroke) ── */

  const getLiveAnnotation = useCallback(() => {
    if (!isDrawing) return null
    if (activeTool === 'draw' && currentPoints.current.length > 1) {
      return { type: 'draw', color: activeColor, strokeWidth, points: currentPoints.current }
    }
    if (activeTool === 'highlight' && currentRect.current?.w > 0) {
      return { type: 'highlight', color: activeColor, rect: currentRect.current }
    }
    return null
  }, [activeTool, activeColor, strokeWidth, isDrawing])

  return {
    annotations,
    activeTool,
    activeColor,
    strokeWidth,
    isDrawing,
    TOOLS,
    COLORS,
    setActiveTool,
    setActiveColor,
    setStrokeWidth,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    getLiveAnnotation,
    deleteAnnotation,
    clearPage,
    clearAll,
  }
}

export default useAnnotations
