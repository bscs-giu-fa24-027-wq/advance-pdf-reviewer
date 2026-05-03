import { useState } from 'react'
import './ReviewPanel.css'

function ReviewPanel({ reviews, currentPage, onAddReview, onDeleteReview }) {
  const [noteText, setNoteText] = useState('')
  const [filter, setFilter] = useState('all')

  const pageReviews = reviews.filter((r) =>
    filter === 'all' ? true : r.page === currentPage,
  )

  const handleAdd = () => {
    const text = noteText.trim()
    if (!text) return
    onAddReview({ text, page: currentPage })
    setNoteText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAdd()
  }

  return (
    <aside className="review-panel">
      <div className="review-panel-header">
        <h2 className="review-panel-title">Review Notes</h2>
        <div className="review-filter">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({reviews.length})
          </button>
          <button
            className={`filter-btn ${filter === 'page' ? 'active' : ''}`}
            onClick={() => setFilter('page')}
          >
            Page {currentPage} ({reviews.filter((r) => r.page === currentPage).length})
          </button>
        </div>
      </div>

      <div className="review-add">
        <textarea
          className="review-textarea"
          placeholder={`Add a note for page ${currentPage}… (Ctrl+Enter to save)`}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
        />
        <button className="btn btn-primary review-add-btn" onClick={handleAdd} disabled={!noteText.trim()}>
          Add Note
        </button>
      </div>

      <div className="review-list">
        {pageReviews.length === 0 ? (
          <p className="review-empty">No notes yet{filter === 'page' ? ' for this page' : ''}.</p>
        ) : (
          pageReviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-card-meta">
                <span className="review-page-badge">Page {review.page}</span>
                <span className="review-date">{review.createdAt}</span>
              </div>
              <p className="review-text">{review.text}</p>
              <button
                className="review-delete"
                onClick={() => onDeleteReview(review.id)}
                aria-label="Delete note"
                title="Delete note"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 6V4h6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}

export default ReviewPanel
