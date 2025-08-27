import React, { useState } from 'react';
import PDFViewer from './PDFViewer';
import './styles.css';

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState('');

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfName(file.name);
    }
  };

  return (
    <div className="app-container">
      <div className="header">PDFer</div>
      <div className="upload-section">
        <label htmlFor="pdf-upload" className="upload-btn">
          Upload PDF
        </label>
        <input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
        {pdfName && (
          <div style={{ color: '#52639b', fontSize: '1rem' }}>
            {pdfName}
          </div>
        )}
      </div>
      <div className="viewer-section">
        {pdfFile ? (
          <PDFViewer file={pdfFile} fileName={pdfName} />
        ) : (
          <div style={{ textAlign: 'center', color: '#b3c2e2' }}>
            Upload a PDF to start reading.<br /><br />
            <span style={{ fontSize: '2.5rem' }}>📖</span>
          </div>
        )}
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#b3c2e2' }}>
        Your bookmarks and progress are saved automatically.
      </div>
    </div>
  );
}

export default App;