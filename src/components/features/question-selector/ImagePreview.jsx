import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function ImagePreview({ fileUrl, fileType, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  useEffect(() => {
    setIsLoading(true);
    setError(false);
  }, [fileUrl]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-50 bg-white bg-opacity-70 p-2 rounded-full"
      >
        <X className="h-6 w-6" />
      </button>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative max-w-5xl max-h-[90vh] w-full overflow-hidden rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[90vh] flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="mr-3 size-12 animate-spin text-blue-500"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}

          {error ? (
            <div className="flex flex-col items-center justify-center text-center p-6">
              <p className="text-red-500 text-xl mb-3">
                Failed to load preview
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Download file instead
              </a>
            </div>
          ) : (
            <div className="h-full">
              {fileType === 'image' ? (
                <img
                  src={fileUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                  onLoad={handleLoad}
                  onError={handleError}
                  loading="eager"
                />
              ) : (
                <object
                  data={fileUrl}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  onLoad={handleLoad}
                  onError={handleError}
                >
                  <p>
                    Your browser does not support PDFs.
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                      Download the PDF
                    </a>
                    .
                  </p>
                </object>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
