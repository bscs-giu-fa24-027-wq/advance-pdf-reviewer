import { useState } from 'react'
import HomePage from './pages/HomePage'
import ReviewPage from './pages/ReviewPage'
import ScanPage from './pages/ScanPage'

function App() {
  const [mode, setMode] = useState('home') // 'home' | 'scan' | 'review'
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setMode('review')
  }

  const handleScanPDF = (file) => {
    setSelectedFile(file)
    setMode('review')
  }

  if (mode === 'review' && selectedFile) {
    return (
      <ReviewPage
        initialFile={selectedFile}
        onClose={() => { setSelectedFile(null); setMode('home') }}
      />
    )
  }

  if (mode === 'scan') {
    return (
      <ScanPage
        onClose={() => setMode('home')}
        onPDFReady={handleScanPDF}
      />
    )
  }

  return <HomePage onFileSelect={handleFileSelect} onScan={() => setMode('scan')} />
}

export default App
