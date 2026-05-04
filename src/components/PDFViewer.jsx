import { useState, useCallback, useRef, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import AnnotationCanvas from './AnnotationCanvas'
import './PDFViewer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

function PDFViewer({
  file,
  currentPage,
  onDocumentLoad,
  scale,
  // annotation props (optional)
  annotations,
  getLiveAnnotation,
  activeTool,
  annotationsOn,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  // OCR callback
  onPageRendered,
}) {
  const [pageWidth, setPageWidth]         = useState(null)
  const [renderedSize, setRenderedSize]   = useState(null) // { w, h } in px
  const pageWrapRef                       = useRef(null)

  const containerRef = useCallback((node) => {
    if (node) setPageWidth(node.getBoundingClientRect().width - 48)
  }, [])

  /* Capture the rendered page canvas for OCR */
  const handlePageRender = useCallback(() => {
    if (!onPageRendered || !pageWrapRef.current) return
    const canvas = pageWrapRef.current.querySelector('canvas')
    if (!canvas) return
    setRenderedSize({ w: canvas.width, h: canvas.height })
    onPageRendered(canvas.toDataURL('image/png'))
  }, [onPageRendered])

  /* Re-measure rendered size on scale change */
  useEffect(() => {
    if (!pageWrapRef.current) return
    const canvas = pageWrapRef.current.querySelector('canvas')
    if (canvas) setRenderedSize({ w: canvas.width, h: canvas.height })
  }, [scale, currentPage])

  return (
    <div className="pdf-viewer" ref={containerRef}>
      {file ? (
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => onDocumentLoad(numPages)}
          loading={<div className="pdf-loading">Loading PDF…</div>}
          error={<div className="pdf-error">Failed to load PDF. Please try another file.</div>}
        >
          <div className="pdf-page-wrap" ref={pageWrapRef}>
            <Page
              pageNumber={currentPage}
              width={pageWidth ? pageWidth * scale : undefined}
              loading={<div className="pdf-loading">Rendering page…</div>}
              onRenderSuccess={handlePageRender}
            />
            {annotationsOn && renderedSize && (
              <AnnotationCanvas
                width={renderedSize.w}
                height={renderedSize.h}
                page={currentPage}
                annotations={annotations ?? []}
                getLiveAnnotation={getLiveAnnotation}
                activeTool={activeTool ?? 'none'}
                onPointerDown={onPointerDown ?? (() => {})}
                onPointerMove={onPointerMove ?? (() => {})}
                onPointerUp={onPointerUp ?? (() => {})}
              />
            )}
          </div>
        </Document>
      ) : (
        <div className="pdf-placeholder">No PDF loaded</div>
      )}
    </div>
  )
}

export default PDFViewer
