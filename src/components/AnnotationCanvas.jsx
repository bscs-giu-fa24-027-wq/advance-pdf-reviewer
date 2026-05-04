import { useRef, useEffect, useCallback } from 'react'
import './AnnotationCanvas.css'

/** Render a single annotation into a 2D canvas context (coords are normalised 0–1). */
function drawAnnotation(ctx, ann, w, h, alpha = 1) {
  ctx.save()
  ctx.globalAlpha = alpha

  if (ann.type === 'draw') {
    ctx.beginPath()
    ctx.strokeStyle = ann.color
    ctx.lineWidth   = ann.strokeWidth ?? 3
    ctx.lineCap     = 'round'
    ctx.lineJoin    = 'round'
    ann.points.forEach((p, i) => {
      i === 0
        ? ctx.moveTo(p.x * w, p.y * h)
        : ctx.lineTo(p.x * w, p.y * h)
    })
    ctx.stroke()
  }

  if (ann.type === 'highlight') {
    const { x, y, w: rw, h: rh } = ann.rect
    ctx.fillStyle = ann.color + '55' // 33% opacity
    ctx.fillRect(x * w, y * h, rw * w, rh * h)
    ctx.strokeStyle = ann.color + 'aa'
    ctx.lineWidth   = 1.5
    ctx.strokeRect(x * w, y * h, rw * w, rh * h)
  }

  if (ann.type === 'text') {
    const px = ann.x * w
    const py = ann.y * h
    ctx.font         = 'bold 14px system-ui'
    ctx.fillStyle    = ann.color
    ctx.strokeStyle  = 'rgba(255,255,255,0.8)'
    ctx.lineWidth    = 3
    ctx.strokeText(ann.label, px + 4, py + 14)
    ctx.fillText(ann.label, px + 4, py + 14)
    // small anchor dot
    ctx.beginPath()
    ctx.arc(px, py, 4, 0, Math.PI * 2)
    ctx.fillStyle = ann.color
    ctx.fill()
  }

  ctx.restore()
}

function AnnotationCanvas({
  width,
  height,
  page,
  annotations,
  getLiveAnnotation,
  activeTool,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) {
  const canvasRef = useRef(null)

  /* normalise pointer position to 0-1 coords */
  const normalise = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      nx: (e.clientX - rect.left) / rect.width,
      ny: (e.clientY - rect.top)  / rect.height,
    }
  }, [])

  /* re-render canvas whenever annotations / live stroke change */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const pageAnns = annotations.filter((a) => a.page === page)
    pageAnns.forEach((ann) => drawAnnotation(ctx, ann, canvas.width, canvas.height))

    const live = getLiveAnnotation?.()
    if (live) drawAnnotation(ctx, live, canvas.width, canvas.height, 0.8)
  })

  const isInteractive = activeTool !== 'none'
  const cursor =
    activeTool === 'eraser'    ? 'cell'
    : activeTool === 'text'    ? 'text'
    : activeTool === 'highlight' ? 'crosshair'
    : 'crosshair'

  return (
    <canvas
      ref={canvasRef}
      className="annotation-canvas"
      width={width}
      height={height}
      style={{
        cursor: isInteractive ? cursor : 'default',
        pointerEvents: isInteractive ? 'all' : 'none',
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        const { nx, ny } = normalise(e)
        onPointerDown(page, nx, ny)
      }}
      onPointerMove={(e) => {
        if (e.buttons === 0) return
        const { nx, ny } = normalise(e)
        onPointerMove(page, nx, ny)
      }}
      onPointerUp={(e) => {
        const { nx, ny } = normalise(e)
        onPointerUp(page, nx, ny)
      }}
    />
  )
}

export default AnnotationCanvas
