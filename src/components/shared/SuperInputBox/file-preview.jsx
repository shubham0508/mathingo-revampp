import React, { useState, useEffect } from 'react';
import { FileText, X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const FilePreview = ({ file, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileType, setFileType] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setFileType(file.isImage ? 'image' : 'pdf');
      setFileUrl(file.isImage ? file.preview : URL.createObjectURL(file.file));
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, file]);

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    hover: { scale: 1.04 },
    tap: { scale: 0.98 },
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        variants={itemVariants}
        onClick={() => setIsOpen(true)}
        className="relative group bg-white border rounded-xl shadow-md overflow-hidden w-28 h-28 flex-shrink-0 cursor-pointer"
      >
        <div className="w-full h-full flex items-center justify-center">
          {file.isImage ? (
            <Image
              src={file.preview}
              alt={file.name}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 px-2 py-3">
              <FileText
                className={`w-8 h-8 ${
                  file.type === 'application/pdf'
                    ? 'text-red-600'
                    : 'text-blue-600'
                }`}
              />
              <span className="text-xs text-center text-gray-700 mt-1 truncate w-full">
                {file.name.split('.')[0]}
              </span>
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white z-10 shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(file.id);
          }}
        >
          <X className="w-4 h-4" />
        </motion.button>

        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center truncate">
          {file.name.length > 12 ? `${file.name.slice(0, 9)}...` : file.name}
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 z-50 bg-white bg-opacity-70 p-2 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl bg-transparent max-h-[90vh] w-full overflow-hidden rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[90vh] bg-transparent">
                <div className="h-full flex items-center justify-center">
                  {fileType === 'image' ? (
                    <img
                      src={fileUrl}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                      loading="eager"
                    />
                  ) : (
                    <embed
                      src={fileUrl}
                      type="application/pdf"
                      width="100%"
                      height="600px"
                      style={{ border: '1px solid #ccc', marginTop: '20px' }}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilePreview;
