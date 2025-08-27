import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/web/pdf_viewer.css';
import BookmarkManager from './BookmarkManager';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.1.392/pdf.worker.min.js';

function PDFViewer({ file, fileName }) {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(BookmarkManager.getLastPage(fileName));
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState(BookmarkManager.getBookmarks(fileName));

  useEffect(() => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = function () {
      const typedarray = new Uint8Array(this.result);
      pdfjsLib.getDocument(typedarray).promise.then(doc => {
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setLoading(false);
        renderPage(pageNum || 1, doc);
      });
    };
    reader.readAsArrayBuffer(file);

    // Load bookmarks and last page
    setBookmarks(BookmarkManager.getBookmarks(fileName));
    setPageNum(BookmarkManager.getLastPage(fileName));
    // eslint-disable-next-line
  }, [file, fileName]);

  useEffect(() => {
    // Save last page when changed
    if (pdfDoc && pageNum) {
      BookmarkManager.saveLastPage(fileName, pageNum);
      renderPage(pageNum, pdfDoc);
    }
    // eslint-disable-next-line
  }, [pageNum, pdfDoc]);

  function renderPage(pageNumber, doc) {
    if (!doc) return;
    doc.getPage(pageNumber).then(page => {
      const viewport = page.getViewport({ scale: 1.2 });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext);
    });
  }

  const handlePrev = () => setPageNum(p => Math.max(1, p - 1));
  const handleNext = () => setPageNum(p => Math.min(numPages, p + 1));

  const handleBookmark = () => {
    if (!bookmarks.includes(pageNum)) {
      const updated = BookmarkManager.addBookmark(fileName, pageNum);
      setBookmarks(updated);
    }
  };

  const jumpToBookmark = (page) => setPageNum(page);

  const handleRemoveBookmark = (page) => {
    const updated = BookmarkManager.removeBookmark(fileName, page);
    setBookmarks(updated);
  };

  return (
    <div>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#b3c2e2' }}>Loading PDF...</div>
      ) : (
        <>
          <canvas ref={canvasRef} style={{ width: '100%', borderRadius: '16px', boxShadow: '0 2px 8px #b3c2e2' }} />
          <div className="controls">
            <button className="page-btn" onClick={handlePrev} disabled={pageNum <= 1}>
              ← Prev
            </button>
            <span style={{ fontWeight: 'bold', color: '#52639b' }}>
              Page {pageNum} / {numPages}
            </span>
            <button className="page-btn" onClick={handleNext} disabled={pageNum >= numPages}>
              Next →
            </button>
            <button className="bookmark-btn" onClick={handleBookmark}>
              Add Bookmark
            </button>
          </div>
          <div className="bookmark-list">
            <div style={{ marginBottom: "8px", fontWeight: 500 }}>Bookmarks:</div>
            {bookmarks.length === 0 ? (
              <span style={{ color: '#b3c2e2' }}>No bookmarks yet.</span>
            ) : (
              bookmarks.map(page => (
                <span key={page} onClick={() => jumpToBookmark(page)}>
                  Page {page}
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#e05d5d',
                      marginLeft: 6,
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                    title="Remove"
                    onClick={e => {
                      e.stopPropagation();
                      handleRemoveBookmark(page);
                    }}
                  >✕</button>
                </span>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default PDFViewer;