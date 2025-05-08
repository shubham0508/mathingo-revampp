import React, { useEffect } from 'react';

const TextEditor = ({
  editorRef,
  placeholder,
  height,
  disabled,
  handleEditorKeyDown,
  handlePaste,
  isProcessing,
}) => {
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setAttribute('data-placeholder', placeholder);
    }
  }, [editorRef, placeholder]);

  return (
    <div
      className="relative w-full h-full bg-white"
      style={{ minHeight: height }}
    >
      <div
        id="editor"
        ref={editorRef}
        contentEditable={!disabled}
        className="w-full h-full p-4 outline-none"
        data-placeholder={disabled ? "" : placeholder}
        onKeyDown={handleEditorKeyDown}
        onPaste={handlePaste}
        style={{ minHeight: height }}
      />

      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        </div>
      )}

      <style jsx>{`
        #editor:empty:before {
          content: attr(data-placeholder);
          color: #000000b2;
          position: absolute;
          top: 1rem;
          left: 1rem;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default TextEditor;
