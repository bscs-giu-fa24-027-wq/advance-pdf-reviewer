import { useState, useCallback } from 'react'

let nextId = 1

function formatDate(date) {
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function useReviews() {
  const [reviews, setReviews] = useState([])

  const addReview = useCallback(({ text, page }) => {
    const review = {
      id: nextId++,
      text,
      page,
      createdAt: formatDate(new Date()),
    }
    setReviews((prev) => [...prev, review])
  }, [])

  const deleteReview = useCallback((id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const clearReviews = useCallback(() => {
    setReviews([])
  }, [])

  return { reviews, addReview, deleteReview, clearReviews }
}

export default useReviews
