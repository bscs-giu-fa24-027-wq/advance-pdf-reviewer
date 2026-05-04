import { useRef, useEffect, useCallback } from 'react'
import './AnnotationCanvas.css'

function AnnotationCanvas({ width, height, page, annotations, activeTool, activeColor, activeWidth, onAdd }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })
  const currentPath = useRef([])

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    annotations.forEach(ann => {
      if (ann.tool === 'draw') {
        const pts = ann.data.points
        if (pts.length < 2) return
        ctx.save()
        ctx.strokeStyle = ann.data.color
        ctx.lineWidth = ann.data.width
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y))
        ctx.stroke()
        ctx.restore()
      } else if (ann.tool === 'highlight') {
        const { x, y, w, h, color } = ann.data
        ctx.save()
        ctx.globalAlpha = 0.35
        ctx.fillStyle = color
        ctx.fillRect(x, y, w, h)
        ctx.restore()
      } else if (ann.tool === 'text') {
        ctx.save()
        ctx.fillStyle = ann.data.color
        ctx.font = `${ann.data.fontSize}px sans-serif`
        ctx.fillText(ann.data.text, ann.data.x, ann.data.y)
        ctx.restore()
      }
    })
  }, [annotations])

  useEffect(() => {
    redraw()
  }, [redraw])

  const getPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  const handlePointerDown = (e) => {
    if (!activeTool) return
    e.preventDefault()
    const pos = getPos(e)

    if (activeTool === 'draw') {
      drawing.current = true
      currentPath.current = [pos]
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
    } else if (activeTool === 'highlight') {
      drawing.current = true
      startPos.current = pos
    } else if (activeTool === 'text') {
      const text = prompt('Enter text:')
      if (text) {
        onAdd({ tool: 'text', page, data: { x: pos.x, y: pos.y, text, color: activeColor, fontSize: 16 } })
      }
    }
  }

  const handlePointerMove = (e) => {
    if (!drawing.current) return
    e.preventDefault()
    const pos = getPos(e)

    if (activeTool === 'draw') {
      currentPath.current.push(pos)
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.strokeStyle = activeColor
      ctx.lineWidth = activeWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      const pts = currentPath.current
      if (pts.length < 2) return
      ctx.beginPath()
      ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    } else if (activeTool === 'highlight') {
      const { x, y } = startPos.current
      redraw()
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.save()
      ctx.globalAlpha = 0.35
      ctx.fillStyle = activeColor
      ctx.fillRect(x, y, pos.x - x, pos.y - y)
      ctx.restore()
    }
  }

  const handlePointerUp = (e) => {
    if (!drawing.current) return
    drawing.current = false
    const pos = getPos(e.changedTouches ? { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY } : e)

    if (activeTool === 'draw') {
      if (currentPath.current.length >= 2) {
        onAdd({ tool: 'draw', page, data: { points: [...currentPath.current], color: activeColor, width: activeWidth } })
      }
      currentPath.current = []
    } else if (activeTool === 'highlight') {
      const { x, y } = startPos.current
      const w = pos.x - x
      const h = pos.y - y
      if (Math.abs(w) > 4 && Math.abs(h) > 4) {
        onAdd({ tool: 'highlight', page, data: { x, y, w, h, color: activeColor } })
      }
    }
  }

  return (
    <canvas
      ref={canvasRef}
      className={`annotation-canvas${activeTool ? ' active' : ''}`}
      width={width}
      height={height}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    />
  )
}

export default AnnotationCanvas
