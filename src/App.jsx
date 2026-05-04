import { useState } from 'react'
import HomePage from './pages/HomePage'
import ReviewPage from './pages/ReviewPage'
import ScanPage from './pages/ScanPage'

function App() {
  const [view, setView] = useState('home') // 'home' | 'review' | 'scan'
  const [selectedFile, setSelectedFile] = useState(null)

  const openReview = (file) => {
    setSelectedFile(file)
    setView('review')
  }

  const goHome = () => {
    setSelectedFile(null)
    setView('home')
  }

  if (view === 'scan') {
    return (
      <ScanPage
        onClose={goHome}
        onPDFCreated={openReview}
      />
    )
  }

  if (view === 'review' && selectedFile) {
    return (
      <ReviewPage
        initialFile={selectedFile}
        onClose={goHome}
      />
    )
  }

  return (
    <HomePage
      onFileSelect={openReview}
      onScan={() => setView('scan')}
    />
  )
}

export default App
