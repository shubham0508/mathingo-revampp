'use client';

import React from 'react';
import FilePreview from './file-preview';

const FilePreviews = ({ files, expandFile, removeFile }) => {
  if (!files?.length) return null;

  return (
    <div className="p-2 flex flex-wrap gap-4 bg-white">
      {files.map((file) => (
        <FilePreview
          key={file.id}
          file={file}
          onRemove={removeFile}
        />
      ))}
    </div>
  );
};

export default FilePreviews;
