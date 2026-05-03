import { useState } from 'react'
import Header from '../components/Header'
import PDFControls from '../components/PDFControls'
import PDFViewer from '../components/PDFViewer'
import ReviewPanel from '../components/ReviewPanel'
import usePDF from '../hooks/usePDF'
import useReviews from '../hooks/useReviews'
import './ReviewPage.css'

function ReviewPage({ initialFile, onClose }) {
  const { totalPages, currentPage, scale, handleDocumentLoad, goToPage, changeScale } = usePDF()
  const { reviews, addReview, deleteReview } = useReviews()
  const [pdfFile] = useState(initialFile)

  return (
    <div className="review-page">
      <Header onUploadNew={onClose} />

      {totalPages > 0 && (
        <PDFControls
          currentPage={currentPage}
          totalPages={totalPages}
          scale={scale}
          onPageChange={goToPage}
          onScaleChange={changeScale}
        />
      )}

      <div className="review-body">
        <PDFViewer
          file={pdfFile}
          currentPage={currentPage}
          onDocumentLoad={handleDocumentLoad}
          scale={scale}
        />
        <ReviewPanel
          reviews={reviews}
          currentPage={currentPage}
          onAddReview={addReview}
          onDeleteReview={deleteReview}
        />
      </div>
    </div>
  )
}

export default ReviewPage
