"use client";

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer({ fileUrl, fileName }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  }

  function onDocumentLoadError(err) {
    console.error('PDF loading error:', err);
    setError('Failed to load PDF document');
    setIsLoading(false);
  }

  const nextPage = () => {
    if (pageNumber < (numPages || 1)) {
      setPageNumber(pageNumber + 1);
    }
  };

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100">
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-700">Loading PDF...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        className="max-h-full"
      >
        <Page 
          pageNumber={pageNumber} 
          renderTextLayer={false}
          renderAnnotationLayer={false}
          scale={1.0}
          className="shadow-md"
        />
      </Document>

      {numPages && numPages > 1 && (
        <div className="absolute bottom-14 w-full flex justify-center items-center bg-black bg-opacity-50 py-2 text-white">
          <button 
            onClick={prevPage} 
            disabled={pageNumber <= 1}
            className={`px-3 py-1 rounded-lg mr-4 ${pageNumber <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
          >
            Prev
          </button>
          <span>
            Page {pageNumber} of {numPages}
          </span>
          <button 
            onClick={nextPage} 
            disabled={pageNumber >= (numPages || 1)}
            className={`px-3 py-1 rounded-lg ml-4 ${pageNumber >= (numPages || 1) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}