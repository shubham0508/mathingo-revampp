import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Fullscreen,
  LoaderCircle,
} from 'lucide-react';
import { useS3Asset } from '@/hooks/useS3Asset';

export default function QuestionSelector({
  file,
  currentIndex,
  totalFiles,
  onNext,
  onPrevious,
  onDotClick,
  onOpenPreview,
}) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isPdfLoading, setIsPdfLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const {
    url: signedUrl,
    loading: s3Loading,
    error: s3Error,
  } = useS3Asset(file.fileUrl);

  useEffect(() => {
    setIsImageLoading(true);
    setImageError(false);
  }, [file.id]);

  const isLoading =
    s3Loading || (file.fileType === 'image' ? isImageLoading : isPdfLoading);

  const handleRetry = () => {
    setIsImageLoading(true);
    setImageError(false);
    const imgElement = document.getElementById(`file-image-${file.id}`);
    if (imgElement && signedUrl) {
      imgElement.src = signedUrl + '&t=' + new Date().getTime();
    }
  };

  const handlePreviewClick = () => {
    if (!imageError && signedUrl) {
      onOpenPreview(signedUrl, file.fileType);
    }
  };

  const Loader = (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
      <LoaderCircle className="animate-spin text-blue-500 w-10 h-10" />
      <span className="ml-3 text-gray-700">Processing...</span>
    </div>
  );

  const ErrorMessage = ({ message, onRetry }) => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
      <p className="text-red-500 mb-4">{message}</p>
      <Button onClick={onRetry} className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );

  return (
    <div className="w-full">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div className="p-0 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-[400px] md:h-[500px] cursor-pointer"
                onClick={handlePreviewClick}
              >
                {s3Loading && Loader}

                {s3Error && (
                  <ErrorMessage
                    message="Failed to load file from S3"
                    onRetry={() => window.location.reload()}
                  />
                )}

                {!s3Loading && !s3Error && file.fileType === 'image' && (
                  <>
                    {isImageLoading && !imageError && Loader}
                    {imageError ? (
                      <ErrorMessage
                        message="Failed to load image"
                        onRetry={handleRetry}
                      />
                    ) : (
                      signedUrl && (
                        <img
                          id={`file-image-${file.id}`}
                          src={signedUrl}
                          alt={file.fileName}
                          onLoad={() => setIsImageLoading(false)}
                          onError={() => {
                            setIsImageLoading(false);
                            setImageError(true);
                          }}
                          className="w-full h-full object-contain"
                          loading="eager"
                        />
                      )
                    )}
                  </>
                )}

                {!s3Loading && !s3Error && file.fileType === 'pdf' && (
                  <>
                    {isPdfLoading && Loader}
                    {signedUrl && (
                      <object
                        data={signedUrl}
                        type="application/pdf"
                        className="w-full h-full"
                        onLoad={() => setIsPdfLoading(false)}
                        onError={() => {
                          setIsPdfLoading(false);
                          setImageError(true);
                        }}
                      >
                        <p>
                          Your browser does not support PDFs.
                          <a href={signedUrl}>Download the PDF</a>.
                        </p>
                      </object>
                    )}
                  </>
                )}

                {!isLoading && !imageError && signedUrl && (
                  <div className="absolute top-4 right-4 bg-white bg-opacity-70 p-2 rounded-full">
                    <Fullscreen className="h-5 w-5 text-blue-600" />
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gray-600 bg-opacity-50 font-semibold text-white py-2 px-4 text-center text-xl">
                  Image {currentIndex + 1}/{totalFiles}
                </div>
              </motion.div>
            </AnimatePresence>

            {!isLoading && currentIndex > 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrevious();
                }}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 shadow-md hover:bg-gray-50 border border-gray-200"
              >
                <ChevronLeft className="h-6 w-6 text-blue-600" />
              </Button>
            )}

            {!isLoading && currentIndex < totalFiles - 1 && (
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 shadow-md hover:bg-gray-50 border border-gray-200"
              >
                <ChevronRight className="h-6 w-6 text-blue-600" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalFiles }).map((_, i) => (
            <button
              key={i}
              onClick={() => onDotClick(i)}
              className="focus:outline-none"
              disabled={isLoading}
            >
              <div
                className={`rounded-full transition-all w-3 h-3 ${
                  i === currentIndex
                    ? 'bg-black'
                    : 'bg-gray-300 hover:bg-gray-400'
                } ${isLoading ? 'opacity-50' : ''}`}
              />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
