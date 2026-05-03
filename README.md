# Advance PDF Reviewer

A web application for uploading and reviewing PDF documents with page-by-page navigation and timestamped review notes.

## Features

- 📄 **PDF Upload** — drag-and-drop or browse to upload any PDF file
- 🔢 **Page Navigation** — jump to any page with prev / next controls and a direct page input
- 🔍 **Zoom Controls** — zoom in / out and reset to 100%
- 📝 **Review Notes** — add timestamped notes per page; filter by current page or view all

## Tech Stack

- [React 19](https://react.dev/)
- [Vite 8](https://vite.dev/)
- [react-pdf](https://github.com/wojtekmaj/react-pdf) (powered by PDF.js)
- [react-router-dom 7](https://reactrouter.com/)

## Getting Started

### Prerequisites

- Node.js ≥ 18

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # App header with branding and "Open New PDF" button
│   ├── PDFUploader.jsx     # Drag-and-drop / file-browse upload component
│   ├── PDFViewer.jsx       # PDF renderer (react-pdf Document + Page)
│   ├── PDFControls.jsx     # Page navigation and zoom controls toolbar
│   └── ReviewPanel.jsx     # Sidebar for adding and managing review notes
├── hooks/
│   ├── usePDF.js           # PDF state (file, page, scale, load events)
│   └── useReviews.js       # Review notes state (add, delete, list)
├── pages/
│   ├── HomePage.jsx        # Landing page with upload prompt
│   └── ReviewPage.jsx      # Full-screen review layout (viewer + panel)
├── App.jsx                 # Root component — switches between Home and Review
├── App.css                 # Shared utility classes (buttons, sr-only)
├── index.css               # Global CSS design tokens (light & dark themes)
└── main.jsx                # React entry point
```

## License

MIT
