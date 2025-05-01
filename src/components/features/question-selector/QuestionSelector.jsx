import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function QuestionSelector({
  file,
  currentIndex,
  totalFiles,
  onNext,
  onPrevious,
  onDotClick,
}) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isPdfLoading, setIsPdfLoading] = useState(true);

  const handlePdfLoad = () => {
    setIsPdfLoading(false);
  };

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
                className="relative w-full h-[600px] md:h-[500px]"
              >
                {file.fileType === 'image' ? (
                  <>
                    {isImageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                    <Image
                      src={file.fileUrl}
                      alt={file.fileName}
                      fill
                      priority
                      onLoadingComplete={() => setIsImageLoading(false)}
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </>
                ) : (
                  <>
                    {isPdfLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                    <object
                      data={file.fileUrl}
                      type="application/pdf"
                      className="w-full h-full"
                      onLoad={handlePdfLoad}
                    >
                      <p>
                        Your browser does not support PDFs.
                        <a href={file.fileUrl}>Download the PDF</a>.
                      </p>
                    </object>
                  </>
                )}

                {/* Overlay text for image number */}
                <div className="absolute bottom-0 left-0 right-0 font-semibold text-white py-2 px-4 text-center text-xl">
                  Image {currentIndex + 1}/{totalFiles}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons styled according to screenshot */}
            {currentIndex > 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={onPrevious}
                className="absolute top-1/2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 shadow-md hover:bg-gray-50 border border-gray-200 flex items-center justify-center"
              >
                <ChevronLeft className="h-6 w-6 text-blue-600" />
              </Button>
            )}

            {currentIndex < totalFiles - 1 && (
              <Button
                variant="outline"
                size="icon"
                onClick={onNext}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 shadow-md hover:bg-gray-50 border border-gray-200 flex items-center justify-center"
              >
                <ChevronRight className="h-40 w-40 text-blue-600" />
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
            >
              <div
                className={`rounded-full transition-all ${
                  i === currentIndex
                    ? 'w-3 h-3 bg-black'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}