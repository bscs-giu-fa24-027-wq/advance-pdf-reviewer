import { useState, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import './PDFViewer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

function PDFViewer({ file, currentPage, onDocumentLoad, onPageRender, scale }) {
  const [pageWidth, setPageWidth] = useState(null)

  const containerRef = useCallback((node) => {
    if (node) {
      setPageWidth(node.getBoundingClientRect().width - 48)
    }
  }, [])

  return (
    <div className="pdf-viewer" ref={containerRef}>
      {file ? (
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => onDocumentLoad(numPages)}
          loading={<div className="pdf-loading">Loading PDF…</div>}
          error={<div className="pdf-error">Failed to load PDF. Please try another file.</div>}
        >
          <Page
            pageNumber={currentPage}
            width={pageWidth ? pageWidth * scale : undefined}
            loading={<div className="pdf-loading">Rendering page…</div>}
            onRenderSuccess={onPageRender}
          />
        </Document>
      ) : (
        <div className="pdf-placeholder">No PDF loaded</div>
      )}
    </div>
  )
}

export default PDFViewer
