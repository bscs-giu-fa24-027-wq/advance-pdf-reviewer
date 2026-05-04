import { useState, useCallback, useEffect } from 'react'

let nextId = 1

function formatDate(date) {
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function loadFromStorage(storageKey) {
  if (!storageKey) return []
  try {
    const raw = localStorage.getItem(`reviews:${storageKey}`)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore parse / quota errors
  }
  return []
}

function useReviews(storageKey) {
  const [reviews, setReviews] = useState(() => {
    const saved = loadFromStorage(storageKey)
    if (saved.length > 0) {
      nextId = Math.max(...saved.map((r) => r.id)) + 1
    }
    return saved
  })

  // Persist to localStorage whenever reviews change
  useEffect(() => {
    if (!storageKey) return
    try {
      localStorage.setItem(`reviews:${storageKey}`, JSON.stringify(reviews))
    } catch {
      // ignore quota errors
    }
  }, [reviews, storageKey])

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
    if (storageKey) {
      try { localStorage.removeItem(`reviews:${storageKey}`) } catch { /* ignore */ }
    }
    setReviews([])
  }, [storageKey])

  return { reviews, addReview, deleteReview, clearReviews }
}

export default useReviews
