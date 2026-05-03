import { useState } from 'react'
import HomePage from './pages/HomePage'
import ReviewPage from './pages/ReviewPage'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)

  return selectedFile ? (
    <ReviewPage initialFile={selectedFile} onClose={() => setSelectedFile(null)} />
  ) : (
    <HomePage onFileSelect={setSelectedFile} />
  )
}

export default App
