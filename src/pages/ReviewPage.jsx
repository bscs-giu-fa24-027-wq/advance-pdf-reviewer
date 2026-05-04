import { useState } from 'react'
import Header from '../components/Header'
import PDFControls from '../components/PDFControls'
import PDFViewer from '../components/PDFViewer'
import ReviewPanel from '../components/ReviewPanel'
import AnnotationToolbar from '../components/AnnotationToolbar'
import AnnotationCanvas from '../components/AnnotationCanvas'
import OCRPanel from '../components/OCRPanel'
import usePDF from '../hooks/usePDF'
import useReviews from '../hooks/useReviews'
import useAnnotations from '../hooks/useAnnotations'
import './ReviewPage.css'

function ReviewPage({ initialFile, onClose }) {
  const { totalPages, currentPage, scale, handleDocumentLoad, goToPage, changeScale } = usePDF()
  const { reviews, addReview, deleteReview } = useReviews()
  const [pdfFile] = useState(initialFile)
  const [showOCR, setShowOCR] = useState(false)
  const [pdfDims, setPdfDims] = useState({ width: 0, height: 0 })

  const {
    activeTool, setActiveTool,
    activeColor, setActiveColor,
    activeWidth, setActiveWidth,
    addAnnotation, getPageAnnotations, clearPageAnnotations,
  } = useAnnotations()

  const pageAnnotations = getPageAnnotations(currentPage)

  const handlePageRender = (page) => {
    // page is the react-pdf page proxy; get viewport dims at current scale
    const viewport = page.getViewport({ scale })
    setPdfDims({ width: viewport.width, height: viewport.height })
  }

  const handleDownload = () => {
    const url = URL.createObjectURL(pdfFile)
    const a = document.createElement('a')
    a.href = url
    a.download = pdfFile.name || 'document.pdf'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    const url = URL.createObjectURL(pdfFile)
    const win = window.open(url)
    if (win) win.onload = () => { win.print(); URL.revokeObjectURL(url) }
  }

  return (
    <div className="review-page">
      <Header
        onUploadNew={onClose}
        onDownload={handleDownload}
        onPrint={handlePrint}
        onToggleOCR={() => setShowOCR(v => !v)}
        showOCRButton
      />

      {totalPages > 0 && (
        <>
          <PDFControls
            currentPage={currentPage}
            totalPages={totalPages}
            scale={scale}
            onPageChange={goToPage}
            onScaleChange={changeScale}
            onDownload={handleDownload}
            onPrint={handlePrint}
          />
          <AnnotationToolbar
            activeTool={activeTool}
            activeColor={activeColor}
            activeWidth={activeWidth}
            onToolChange={setActiveTool}
            onColorChange={setActiveColor}
            onWidthChange={setActiveWidth}
            onClear={() => clearPageAnnotations(currentPage)}
          />
        </>
      )}

      <div className="review-body">
        <div className="review-viewer-wrap">
          <PDFViewer
            file={pdfFile}
            currentPage={currentPage}
            onDocumentLoad={handleDocumentLoad}
            onPageRender={handlePageRender}
            scale={scale}
          />
          {pdfDims.width > 0 && (
            <AnnotationCanvas
              width={pdfDims.width}
              height={pdfDims.height}
              page={currentPage}
              annotations={pageAnnotations}
              activeTool={activeTool}
              activeColor={activeColor}
              activeWidth={activeWidth}
              onAdd={addAnnotation}
            />
          )}
        </div>

        <ReviewPanel
          reviews={reviews}
          currentPage={currentPage}
          onAddReview={addReview}
          onDeleteReview={deleteReview}
        />

        {showOCR && (
          <OCRPanel onClose={() => setShowOCR(false)} />
        )}
      </div>
    </div>
  )
}

export default ReviewPage
