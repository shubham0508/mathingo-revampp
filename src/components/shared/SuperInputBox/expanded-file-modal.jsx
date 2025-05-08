import React from 'react';
import { FileText, File, X } from 'lucide-react';

const ExpandedFileModal = ({ file, onClose }) => {
  if (!file) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col">
        <div className="p-3 border-b flex justify-between items-center">
          <h3 className="font-medium truncate pr-4">{file.name}</h3>
          <button className="p-1 hover:bg-gray-100 rounded" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50">
          {file.isImage ? (
            <img
              src={file.preview}
              alt={file.name}
              className="max-w-full max-h-[70vh] object-contain"
              loading="eager"
            />
          ) : file.isPdf ? (
            <div className="text-center">
              <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">PDF preview not available</p>
              <a
                href={URL.createObjectURL(file.file)}
                download={file.name}
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Download PDF
              </a>
            </div>
          ) : (
            <div className="text-center">
              <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Preview not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpandedFileModal;
