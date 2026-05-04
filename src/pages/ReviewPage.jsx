import { useState, useCallback } from 'react'
import Header from '../components/Header'
import PDFControls from '../components/PDFControls'
import PDFViewer from '../components/PDFViewer'
import ReviewPanel from '../components/ReviewPanel'
import AnnotationToolbar from '../components/AnnotationToolbar'
import OCRPanel from '../components/OCRPanel'
import usePDF from '../hooks/usePDF'
import useReviews from '../hooks/useReviews'
import useAnnotations from '../hooks/useAnnotations'
import './ReviewPage.css'

function ReviewPage({ initialFile, onClose }) {
  const { totalPages, currentPage, scale, handleDocumentLoad, goToPage, changeScale } = usePDF()
  const { reviews, addReview, deleteReview }                                          = useReviews(fileName)
  const ann = useAnnotations(fileName)

  const [pdfFile]        = useState(initialFile)
  const [fileName]       = useState(initialFile?.name ?? 'document.pdf')
  const [annotationsOn, setAnnotationsOn] = useState(false)
  const [pageDataUrl, setPageDataUrl]     = useState(null)
  const [activePanel, setActivePanel]     = useState('notes') // 'notes' | 'ocr'

  const handleDownload = useCallback(() => {
    const url = URL.createObjectURL(pdfFile)
    const a   = document.createElement('a')
    a.href     = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }, [pdfFile, fileName])

  const handlePrint = useCallback(() => {
    const url = URL.createObjectURL(pdfFile)
    const win = window.open(url, '_blank')
    if (win) {
      win.onload = () => {
        win.focus()
        win.print()
      }
    }
  }, [pdfFile])

  const toggleOCR = useCallback(() => {
    setActivePanel((p) => (p === 'ocr' ? 'notes' : 'ocr'))
  }, [])

  const toggleAnnotations = useCallback(() => {
    setAnnotationsOn((v) => !v)
  }, [])

  return (
    <div className="review-page">
      <Header
        onUploadNew={onClose}
        fileName={fileName}
        onOCR={toggleOCR}
        ocrActive={activePanel === 'ocr'}
      />

      {totalPages > 0 && (
        <PDFControls
          currentPage={currentPage}
          totalPages={totalPages}
          scale={scale}
          onPageChange={goToPage}
          onScaleChange={changeScale}
          onDownload={handleDownload}
          onPrint={handlePrint}
        />
      )}

      <AnnotationToolbar
        activeTool={ann.activeTool}
        activeColor={ann.activeColor}
        strokeWidth={ann.strokeWidth}
        annotationsOn={annotationsOn}
        TOOLS={ann.TOOLS}
        COLORS={ann.COLORS}
        onToolChange={ann.setActiveTool}
        onColorChange={ann.setActiveColor}
        onStrokeChange={ann.setStrokeWidth}
        onToggle={toggleAnnotations}
        onClear={() => ann.clearPage(currentPage)}
      />

      <div className="review-body">
        <PDFViewer
          file={pdfFile}
          currentPage={currentPage}
          onDocumentLoad={handleDocumentLoad}
          scale={scale}
          annotations={ann.annotations}
          getLiveAnnotation={ann.getLiveAnnotation}
          activeTool={annotationsOn ? ann.activeTool : 'none'}
          annotationsOn={annotationsOn}
          onPointerDown={ann.onPointerDown}
          onPointerMove={ann.onPointerMove}
          onPointerUp={ann.onPointerUp}
          onPageRendered={setPageDataUrl}
        />

        {activePanel === 'ocr' ? (
          <OCRPanel
            pageDataUrl={pageDataUrl}
            pageNumber={currentPage}
            onClose={() => setActivePanel('notes')}
          />
        ) : (
          <ReviewPanel
            reviews={reviews}
            currentPage={currentPage}
            onAddReview={addReview}
            onDeleteReview={deleteReview}
          />
        )}
      </div>
    </div>
  )
}

export default ReviewPage
