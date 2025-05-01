import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useHaQuestionExtractionMutation } from '@/store/slices/HA';
import dynamic from 'next/dynamic';

// Components
import FilePreviews from './file-previews';
import ExpandedFileModal from './expanded-file-modal';
import Toolbar from './toolbar';
import TextEditor from './text-editor';
import MathKeyboard from './math-keyboard';

// Constants
import { FILE_TYPES, MAX_FILE_SIZE, MAX_FILES, MODES } from '@/config/constant';
import { createFileData, validateFile } from '@/lib/fileUtils';
import toast from 'react-hot-toast';

const TLDrawWhiteboard = dynamic(() => import('./tldraw'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
      />
    </div>
  ),
});

const SuperInput = ({
  initialMode = 'text',
  disabled = false,
  placeholder = 'Type a math problem or drag and drop an image here.',
  height = '100px',
}) => {
  const [mode, setMode] = useState(initialMode);
  const [text, setText] = useState('');
  const [drawingData, setDrawingData] = useState(null);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedFile, setExpandedFile] = useState(null);
  const [showMathKeyboard, setShowMathKeyboard] = useState(false);
  const [activeTab, setActiveTab] = useState('ΣΠ');
  const [activeField, setActiveField] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const editorRef = useRef(null);
  const MQRef = useRef(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [haQuestionExtraction] = useHaQuestionExtractionMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const MODEL_NAME = 'alpha';

  const placeCaretAfter = useCallback((node) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStartAfter(node);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    if (editorRef.current) editorRef.current.focus();
  }, []);

  // Submit handler
  const handleSubmit = useCallback(async () => {
    if (disabled || isProcessing) return;

    const hasContent =
      text.trim().length > 0 || drawingData || files.length > 0;
    if (!hasContent) return;

    try {
      setIsProcessing(true);

      if (files.length > 0) {
        await submitFiles();
      } else if (text.trim().length > 0) {
        await submitTextQuestion();
      } else if (drawingData) {
        await submitDrawing();
      }

      setText('');
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
      setDrawingData(null);
      setFiles([]);
      setShowMathKeyboard(false);

      router.push('/homework-assistant/results');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to process your question. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [text, drawingData, files, disabled, isProcessing]);

  const submitTextQuestion = async () => {
    try {
      const data = [{ data: text, input_type: 'text', file_url: '' }];
      const response = await haQuestionExtraction({
        model_name: MODEL_NAME,
        inputs: data,
      });

      if (response.data) {
        dispatch(setQuestion(response.data));
        toast.success('Question processed successfully!');
      } else {
        throw new Error('Failed to process question');
      }
    } catch (error) {
      console.error('Text submission error:', error);
      throw error;
    }
  };

  const submitFiles = async () => {
    try {
      const formData = new FormData();
      formData.append('type', 'ha_questions');
      files.forEach((file) => formData.append('files', file?.file));

      const response = await fetch('/api/s3/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload files');

      const result = await response.json();
      if (!result?.success)
        throw new Error(result?.message || 'Failed to upload files');

      const filesData = result?.files?.map(({ originalName, fileKey }) => ({
        input_type: originalName?.includes('pdf') ? 'pdf' : 'image',
        file_url: fileKey,
        data: '',
      }));

      const extractionResponse = await haQuestionExtraction({
        model_name: MODEL_NAME,
        inputs: filesData,
      });
      if (extractionResponse.data) {
        dispatch(setQuestion(extractionResponse.data));
        toast.success('Files processed successfully!');
      } else {
        throw new Error('Failed to process uploaded files');
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const submitDrawing = async () => {
    try {
      const response = await fetch(drawingData);
      const blob = await response.blob();
      const file = new File([blob], `drawing-${Date.now()}.png`, {
        type: 'image/png',
      });

      const formData = new FormData();
      formData.append('type', 'ha_questions');
      formData.append('files', file);

      const uploadResponse = await fetch('/api/s3/upload', {
        method: 'POST',
        body: formData,
      });
      if (!uploadResponse.ok) throw new Error('Failed to upload drawing');

      const result = await uploadResponse.json();
      if (!result?.success)
        throw new Error(result?.message || 'Failed to upload drawing');

      const filesData = result?.files?.map(({ fileKey }) => ({
        input_type: 'image',
        file_url: fileKey,
        data: '',
      }));

      const extractionResponse = await haQuestionExtraction({
        model_name: MODEL_NAME,
        inputs: filesData,
      });
      if (extractionResponse.data) {
        dispatch(setQuestion(extractionResponse.data));
        toast.success('Drawing processed successfully!');
      } else {
        throw new Error('Failed to process drawing');
      }
    } catch (error) {
      console.error('Drawing submission error:', error);
      throw error;
    }
  };

  const updateContent = useCallback(() => {
    if (!editorRef.current || !MQRef.current) return;

    let fullContent = '';
    editorRef.current.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        fullContent += node.textContent;
      } else if (node.classList?.contains('math-field')) {
        const mf = MQRef.current.MathField(node.querySelector('span'));
        fullContent += ` ${mf.latex()} `;
      } else {
        fullContent += node.textContent;
      }
    });

    setText(fullContent.trim());
  }, []);

  const insertMathFieldAtCaret = useCallback(
    (latex = '') => {
      const editor = editorRef.current;
      if (!editor || !MQRef.current) return;

      const span = document.createElement('span');
      span.className = 'math-field';
      span.setAttribute('contenteditable', 'false');

      const innerSpan = document.createElement('span');
      span.appendChild(innerSpan);

      const mathField = MQRef.current.MathField(innerSpan, {
        handlers: {
          edit: () => {
            setActiveField(mathField);
            updateContent();
          },
        },
      });

      mathField.latex(latex);
      setActiveField(mathField);

      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(span);
        placeCaretAfter(span);
      } else {
        editor.appendChild(span);
        placeCaretAfter(span);
      }

      updateContent();
    },
    [updateContent, placeCaretAfter],
  );

  const handleEditorKeyDown = (e) => {
    if (e.key === '`' || e.key === '$' || e.key === '\\') {
      e.preventDefault();
      insertMathFieldAtCaret();
    }
  };

  const insertSymbol = useCallback(
    (symbol) => {
      if (activeField && document.activeElement.closest('.math-field')) {
        if (symbol.startsWith('\\')) {
          activeField.write(symbol);
        } else {
          activeField.typedText(symbol);
        }
        activeField.focus();
      } else {
        insertMathFieldAtCaret(symbol);
      }
      updateContent();
    },
    [activeField, insertMathFieldAtCaret, updateContent],
  );

  const insertCommand = useCallback(
    (cmd) => {
      if (activeField && document.activeElement.closest('.math-field')) {
        switch (cmd) {
          case 'frac':
            activeField.cmd('\\frac');
            break;
          case 'sqrt':
            activeField.cmd('\\sqrt');
            break;
          case 'nthroot':
            activeField.cmd('\\nthroot');
            break;
          case 'times':
            activeField.cmd('\\times');
            break;
          case 'div':
            activeField.cmd('\\div');
            break;
          default:
            activeField.cmd('\\' + cmd);
        }
        activeField.focus();
      } else {
        const cmdLatex =
          cmd === 'frac'
            ? '\\frac{}{}'
            : cmd === 'sqrt'
              ? '\\sqrt{}'
              : cmd === 'nthroot'
                ? '\\sqrt[]{}'
                : cmd === 'times'
                  ? '\\times'
                  : cmd === 'div'
                    ? '\\div'
                    : `\\${cmd}`;
        insertMathFieldAtCaret(cmdLatex);
      }
      updateContent();
    },
    [activeField, insertMathFieldAtCaret, updateContent],
  );

  const insertExponent = useCallback(
    (exp) => {
      if (activeField && document.activeElement.closest('.math-field')) {
        activeField.typedText(exp === '^2' ? '^2' : '^');
        activeField.focus();
      } else {
        insertMathFieldAtCaret(exp === '^2' ? 'x^2' : 'x^{}');
      }
      updateContent();
    },
    [activeField, insertMathFieldAtCaret, updateContent],
  );

  const insertSubscript = useCallback(() => {
    if (activeField && document.activeElement.closest('.math-field')) {
      activeField.typedText('_');
      activeField.focus();
    } else {
      insertMathFieldAtCaret('x_{}');
    }
    updateContent();
  }, [activeField, insertMathFieldAtCaret, updateContent]);

  const insertComplexExpression = useCallback(
    (latexTemplate) => {
      if (activeField && document.activeElement.closest('.math-field')) {
        activeField.write(latexTemplate);
        activeField.focus();
      } else {
        insertMathFieldAtCaret(latexTemplate);
      }
      updateContent();
    },
    [activeField, insertMathFieldAtCaret, updateContent],
  );

  const handlePaste = async (e) => {
    if (e) {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      if (pastedText?.length > 2000) {
        toast.error('Maximum 2000 characters can be added as question!!');
      } else {
        if (activeField && document.activeElement.closest('.math-field')) {
          if (pastedText.includes('\\') || pastedText.includes('$')) {
            activeField.latex(pastedText);
          } else {
            activeField.write(pastedText);
          }
        } else {
          editorRef.current.textContent += pastedText;
        }
        updateContent();
      }
    }
  };

  const handleFileUpload = useCallback(
    (e) => {
      const newFiles = Array.from(e.target.files || []);
      if (newFiles.length === 0) return;

      if (files.length + newFiles.length > MAX_FILES) {
        toast.error(`Maximum ${MAX_FILES} files can be uploaded`);
        return;
      }

      const validFiles = newFiles.filter((file) => {
        const validation = validateFile(file);
        if (!validation.isValid) {
          Object.values(validation.errors).forEach((error) =>
            toast.error(error),
          );
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      const filesData = validFiles.map((file) => createFileData(file));
      setFiles((prev) => [...prev, ...filesData]);
    },
    [files, validateFile, createFileData],
  );

  const handleCameraInput = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const validation = validateFile(file);
      if (!validation.isValid) {
        Object.values(validation.errors).forEach((error) => toast.error(error));
        return;
      }

      const fileData = createFileData(file);
      setFiles((prev) => [...prev, fileData]);
    },
    [validateFile, createFileData],
  );

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const triggerCameraInput = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  const removeFile = useCallback(
    (fileId) => {
      setFiles((prev) => prev.filter((file) => file.id !== fileId));
      if (expandedFile?.id === fileId) {
        setExpandedFile(null);
      }
    },
    [expandedFile],
  );

  const expandFile = useCallback((file) => {
    setExpandedFile(file);
  }, []);

  const toggleMathKeyboard = () => {
    setShowMathKeyboard(!showMathKeyboard);
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      setText('');
    }
    setDrawingData(null);
    setFiles([]);
  };

  // Mobile detection effect
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // MathQuill initialization effect
  useEffect(() => {
    const loadMathQuill = async () => {
      if (typeof window === 'undefined' || initialized) return;

      const jqueryScript = document.createElement('script');
      jqueryScript.src =
        'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
      jqueryScript.async = true;
      jqueryScript.crossOrigin = 'anonymous';
      document.body.appendChild(jqueryScript);

      jqueryScript.onload = () => {
        const mathquillScript = document.createElement('script');
        mathquillScript.src =
          'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.js';
        mathquillScript.async = true;
        mathquillScript.crossOrigin = 'anonymous';
        document.body.appendChild(mathquillScript);

        const mathquillCSS = document.createElement('link');
        mathquillCSS.rel = 'stylesheet';
        mathquillCSS.href =
          'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.css';
        document.head.appendChild(mathquillCSS);

        mathquillScript.onload = initEditor;
      };
    };

    loadMathQuill();

    const handleClick = (e) => {
      if (!e.target.closest('.math-field')) {
        setActiveField(null);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [initialized]);

  const initEditor = useCallback(() => {
    if (typeof window !== 'undefined' && window.MathQuill) {
      MQRef.current = window.MathQuill;
      MQRef.current = window.MathQuill.getInterface(2);
      setInitialized(true);

      if (editorRef.current) {
        editorRef.current.addEventListener('input', updateContent);
      }
    }
  }, [updateContent]);

  const handleDrawingChange = useCallback((drawingDataUrl) => {
    setDrawingData(drawingDataUrl);
  }, []);

  // Drag and drop effect
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer?.files || []);
      if (droppedFiles.length === 0) return;

      if (files.length + droppedFiles.length > MAX_FILES) {
        toast.error(`Maximum ${MAX_FILES} files can be uploaded`);
        return;
      }

      const validFiles = droppedFiles.filter((file) => {
        const validation = validateFile(file);
        if (!validation.isValid) {
          Object.values(validation.errors).forEach((error) =>
            toast.error(error),
          );
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      const filesData = validFiles.map((file) => createFileData(file));
      setFiles((prev) => [...prev, ...filesData]);
    };

    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);

    return () => {
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, [files, validateFile, createFileData]);

  return (
    <div className="relative w-full">
      <div
        ref={dropAreaRef}
        className={`w-full flex flex-col rounded-lg overflow-hidden border-2 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}
        style={{ minHeight: height }}
      >
        <FilePreviews
          files={files}
          expandFile={expandFile}
          removeFile={removeFile}
        />

        <div className="flex-1">
          {mode === MODES.TEXT && (
            <TextEditor
              editorRef={editorRef}
              placeholder={placeholder}
              height={height}
              disabled={disabled}
              handleEditorKeyDown={handleEditorKeyDown}
              handlePaste={handlePaste}
              updateContent={updateContent}
            />
          )}

          {mode === MODES.DRAW && (
            <TLDrawWhiteboard
              onContentChange={handleDrawingChange}
              disabled={disabled}
              height={height}
            />
          )}
        </div>

        <Toolbar
          mode={mode}
          setMode={setMode}
          text={text}
          drawingData={drawingData}
          files={files}
          disabled={disabled}
          isMobile={isMobile}
          triggerFileInput={triggerFileInput}
          triggerCameraInput={triggerCameraInput}
          toggleMathKeyboard={toggleMathKeyboard}
          showMathKeyboard={showMathKeyboard}
          handleClear={handleClear}
          handleSubmit={handleSubmit}
        />
      </div>

      {showMathKeyboard && (
        <MathKeyboard
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          insertSymbol={insertSymbol}
          insertCommand={insertCommand}
          insertExponent={insertExponent}
          insertSubscript={insertSubscript}
          insertComplexExpression={insertComplexExpression}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={FILE_TYPES.ALL.join(',')}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      {isMobile && (
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraInput}
          className="hidden"
        />
      )}

      {expandedFile && (
        <ExpandedFileModal
          file={expandedFile}
          onClose={() => setExpandedFile(null)}
        />
      )}

      <style jsx>{`
        .math-field {
          display: inline-block;
          padding: 2px 8px;
          background: rgba(59, 130, 246, 0.08);
          border-radius: 6px;
          margin: 0 2px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          box-shadow: 0 1px 2px rgba(59, 130, 246, 0.1);
        }
        .math-field:hover {
          background: rgba(59, 130, 246, 0.12);
          cursor: pointer;
        }
        .math-field:focus-within {
          outline: 2px solid #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
          background: rgba(59, 130, 246, 0.05);
        }
        #editor:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          position: absolute;
          pointer-events: none;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default SuperInput;
