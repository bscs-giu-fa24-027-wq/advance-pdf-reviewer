import Header from '../components/Header'
import PDFUploader from '../components/PDFUploader'
import './HomePage.css'

function HomePage({ onFileSelect }) {
  return (
    <div className="home-page">
      <Header />
      <main className="home-main">
        <div className="home-intro">
          <h1 className="home-heading">Review PDFs with ease</h1>
          <p className="home-sub">
            Upload any PDF to read it page by page and add timestamped review notes.
          </p>
        </div>
        <PDFUploader onFileSelect={onFileSelect} />
      </main>
    </div>
  )
}

export default HomePage
