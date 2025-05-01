import React from 'react';

const TextEditor = ({
  editorRef,
  placeholder,
  height,
  disabled,
  handleEditorKeyDown,
  handlePaste,
  updateContent,
}) => (
  <div className={`w-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
    <div
      className="w-full bg-white p-4 relative overflow-auto"
      style={{ minHeight: height }}
    >
      <div
        ref={editorRef}
        id="editor"
        contentEditable
        className="w-full h-full focus:outline-none text-gray-800"
        style={{
          minHeight: height,
          fontSize: '18px',
          whiteSpace: 'normal',
          overflowWrap: 'break-word',
          wordWrap: 'break-word',
          lineHeight: '1.6',
        }}
        onKeyDown={handleEditorKeyDown}
        onPaste={handlePaste}
        onInput={updateContent}
        data-placeholder={placeholder}
      />
    </div>
  </div>
);

export default TextEditor;
