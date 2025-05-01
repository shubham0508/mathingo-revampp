'use client';

import React from 'react';
import { FileText, X } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const FilePreview = ({ file, onRemove }) => {
  // Animation variants for framer motion
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: { scale: 1.03 },
    tap: { scale: 0.98 }
  };

  return (
    <Dialog>
      <motion.div
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        variants={itemVariants}
        className="relative group bg-white border border-gray-300 rounded-lg overflow-hidden w-24 h-24 md:w-28 md:h-28 flex-shrink-0"
      >
        <DialogTrigger asChild>
          <div className="w-full h-full cursor-pointer flex items-center justify-center">
            {file.isImage ? (
              <Image
                src={file.preview}
                alt={file.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : file.type === 'application/pdf' ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-2">
                <FileText className="w-8 h-8 text-red-600" />
                <span className="text-xs text-center text-gray-700 mt-1 truncate w-full">
                  {file.name.split('.')[0]}
                </span>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-2">
                <FileText className="w-8 h-8 text-blue-600" />
                <span className="text-xs text-center text-gray-700 mt-1 truncate w-full">
                  {file.name.split('.')[0]}
                </span>
              </div>
            )}
          </div>
        </DialogTrigger>

        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white group-hover:opacity-100 opacity-100 transition-opacity z-10"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(file.id);
          }}
        >
          <X className="w-3 h-3" />
        </motion.button>

        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate z-10">
          {file.name.length > 10 ? `${file.name.slice(0, 7)}...` : file.name}
        </div>
      </motion.div>

      <DialogContent className="max-w-4xl w-full h-[80vh] overflow-hidden bg-white p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="truncate">{file.name}</DialogTitle>
        </DialogHeader>
        <div className="h-[calc(100%-72px)] w-full overflow-auto">
          {file.isImage ? (
            <div className="relative h-full w-full flex items-center justify-center">
              <Image
                src={file.preview}
                alt={file.name}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          ) : file.type === 'application/pdf' ? (
            <div className="h-full w-full">
              <iframe
                src={file.preview}
                title={file.name}
                className="w-full h-full"
                style={{ minHeight: '500px' }}
              />
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-center text-gray-500">
                Preview not supported for this file type
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreview;