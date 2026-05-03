import { useState, useCallback } from 'react'

function usePDF() {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1)

  const loadFile = useCallback((selectedFile) => {
    setFile(selectedFile)
    setFileName(selectedFile.name)
    setTotalPages(0)
    setCurrentPage(1)
    setScale(1)
  }, [])

  const handleDocumentLoad = useCallback((numPages) => {
    setTotalPages(numPages)
  }, [])

  const goToPage = useCallback((page) => {
    setCurrentPage(page)
  }, [])

  const changeScale = useCallback((newScale) => {
    setScale(parseFloat(newScale.toFixed(2)))
  }, [])

  const reset = useCallback(() => {
    setFile(null)
    setFileName('')
    setTotalPages(0)
    setCurrentPage(1)
    setScale(1)
  }, [])

  return {
    file,
    fileName,
    totalPages,
    currentPage,
    scale,
    loadFile,
    handleDocumentLoad,
    goToPage,
    changeScale,
    reset,
  }
}

export default usePDF
