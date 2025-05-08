import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  useHaQuestionExtractionMutation,
  useHaSolutionExtractionMutation,
} from '@/store/slices/HA';
import dynamic from 'next/dynamic';

// Components
import FilePreviews from './file-previews';
import ExpandedFileModal from './expanded-file-modal';
import Toolbar from './toolbar';
import TextEditor from './text-editor';
import MathKeyboard from './math-keyboard';

// Constants
import { FILE_TYPES, MAX_FILES, MODES } from '@/config/constant';
import { createFileData, validateFile } from '@/lib/fileUtils';
import toast from 'react-hot-toast';
import { setAnswer, setQuestion } from '@/store/reducers/HA';
import { getErrorMessage } from '@/lib/utils';
import { useGuestUserAuth } from '@/hooks/useGuestUserAuth';

const TLDrawWhiteboard = dynamic(() => import('./tldraw'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[200px] bg-white">
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
  const [haSolutionExtraction] = useHaSolutionExtractionMutation();
  const { ensureAuthenticated, isEnsuring } = useGuestUserAuth();

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

  const handleSubmit = useCallback(async () => {
    if (disabled || isProcessing) return;

    const hasContent =
      text.trim().length > 0 || drawingData || files.length > 0;
    if (!hasContent) return;

    try {
      const isReady = await ensureAuthenticated();
      if (!isReady) {
        toast.error('Something Went Wrong!!! Please try again Later');
        return;
      }

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

    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to process your question. Please try again.');
      setIsProcessing(false);
    }
  }, [text, drawingData, files, disabled, isProcessing]);

  const submitTextQuestion = async () => {
    try {
      if (text.trim().length === 0) {
        toast.error('Please enter a question');
        return;
      }

      const data = [{ data: text, input_type: 'text', file_url: '' }];
      const response = await haQuestionExtraction({
        model_name: MODEL_NAME,
        inputs: data,
      }).unwrap();

      handleQuestionExtractionResponse(response);
    } catch (error) {
      console.error('Text submission error:', error);
      const errorMessage = getErrorMessage(error?.data?.error);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error('Failed to process your question. Please try again.');
      }

      console.error('API Error Details:', {
        endpoint: 'haQuestionExtraction',
        errorData: error?.data,
        originalError: error,
      });

      throw error;
    }
  };

  const submitFiles = async () => {
    try {
      if (files.length === 0) {
        toast.error('Please upload at least one file');
        return;
      }

      toast.loading('Uploading files...', { id: 'file-upload' });

      const formData = new FormData();
      formData.append('type', 'ha_questions');
      files.forEach((file) => formData.append('files', file?.file));

      const response = await fetch('/api/s3/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        toast.error('Upload failed', { id: 'file-upload' });
        console.error(
          'Upload response error:',
          response.status,
          response.statusText,
        );
        throw new Error(
          `Failed to upload files: ${response.status} ${response.statusText}`,
        );
      }

      const result = await response.json();
      if (!result?.success) {
        toast.error(result?.message || 'Failed to upload files', {
          id: 'file-upload',
        });
        throw new Error(result?.message || 'Failed to upload files');
      }

      toast.success('Files uploaded successfully', { id: 'file-upload' });

      const filesData = result?.files?.map(({ originalName, fileKey }) => ({
        input_type: originalName?.includes('pdf') ? 'pdf' : 'image',
        file_url: fileKey,
        data: '',
      }));

      toast.loading('Analyzing files...', { id: 'extraction' });
      const extractionResponse = await haQuestionExtraction({
        model_name: MODEL_NAME,
        inputs: filesData,
      }).unwrap();

      toast.success('Analysis complete', { id: 'extraction' });
      handleQuestionExtractionResponse(extractionResponse);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = getErrorMessage(error?.data?.error);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error('Failed to upload files. Please try again.');
      }

      // Log detailed error for developers
      console.error('File Upload Error Details:', {
        filesCount: files.length,
        errorData: error?.data,
        originalError: error,
      });

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
      }).unwrap();

      handleQuestionExtractionResponse(extractionResponse);
    } catch (error) {
      console.error('Drawing submission error:', error);
      const errorMessage = getErrorMessage(error?.data?.error);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error('Failed to process drawing. Please try again.');
      }
      throw error;
    }
  };

  const handleQuestionExtractionResponse = (response) => {
    if (response?.status_code === 201) {
      const questions = extractAllQuestions(response.data);
  
      if (questions.length > 1) {
        dispatch(setQuestion(response.data));
        router.push('/homework-assistant/select-questions');
      } else if (questions.length === 1) {
        handleSingleQuestion(response);
      } else {
        toast.error('No questions were found in the input.');
        setIsProcessing(false);
      }
    } else {
      setIsProcessing(false);
      throw new Error(response?.error || 'Failed to process question');
    }
  };

  const extractAllQuestions = (data) => {
    if (!data?.files) return [];

    return data.files.flatMap((file) =>
      file.pages.flatMap((page) =>
        page.questions.map((question) => ({
          question_id: page.question_id,
          question,
          file_url: file.file_url,
          file_type: file.file_type,
        })),
      ),
    );
  };

  const handleSingleQuestion = async (response) => {
    try {
      const firstFile = response.data.files[0];
      const firstPage = firstFile.pages[0];
  
      const solutionResponse = await haSolutionExtraction({
        model_name: MODEL_NAME,
        inputs: [
          {
            question_id: firstPage.question_id,
            questions_selected: firstPage.questions,
            question_url: firstFile.file_url || 'no_input',
          },
        ],
      }).unwrap();
  
      if (solutionResponse?.status_code === 201) {
        dispatch(setQuestion(response.data));
        dispatch(setAnswer(solutionResponse.data));
        router.push('/homework-assistant/select-questions/problem-solver');
      } else {
        setIsProcessing(false);
        throw new Error(solutionResponse?.error || 'Failed to get solutions');
      }
    } catch (error) {
      setIsProcessing(false);
      console.error('Error extracting answers:', error);
      const errorMessage = getErrorMessage(error?.data?.error);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error('Failed to get solutions for the question.');
      }
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
      
      // Handle pasted images
      if (e.clipboardData.items) {
        for (const item of e.clipboardData.items) {
          if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            if (file) {
              if (files.length >= MAX_FILES) {
                toast.error(`Maximum ${MAX_FILES} files can be uploaded`);
                return;
              }
              
              const validation = validateFile(file);
              if (!validation.isValid) {
                Object.values(validation.errors).forEach((error) => toast.error(error));
                return;
              }
              
              const fileData = createFileData(file);
              setFiles((prev) => [...prev, fileData]);
              return; // Exit after handling image
            }
          }
        }
      }
      
      // Handle pasted text (existing logic)
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
  
    // Add global paste event handler for images
    const handleGlobalPaste = (e) => {
      if (mode === MODES.TEXT && !disabled && files.length === 0) {
        handlePaste(e);
      }
    };
  
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);
    document.addEventListener('paste', handleGlobalPaste);
  
    return () => {
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('drop', handleDrop);
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, [files, validateFile, createFileData, mode, disabled, handlePaste]);

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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  useEffect(() => {
    if (isProcessing) {
      if (dropAreaRef.current) {
        dropAreaRef.current.classList.add('pulse-animation');
      }

      if (editorRef.current) {
        editorRef.current.setAttribute('contenteditable', 'false');
      }
    } else {
      if (dropAreaRef.current) {
        dropAreaRef.current.classList.remove('pulse-animation');
      }

      if (editorRef.current && files.length === 0 && !disabled) {
        editorRef.current.setAttribute('contenteditable', 'true');
      }
    }
  }, [isProcessing, files.length, disabled]);

  useEffect(() => {
    if (editorRef.current) {
      const shouldDisableEditor = files.length > 0 || isProcessing || disabled;
      editorRef.current.setAttribute(
        'contenteditable',
        shouldDisableEditor ? 'false' : 'true',
      );

      if (files.length > 0 && text.trim().length > 0) {
        setText('');
        editorRef.current.innerHTML = '';
        toast.info('Text input has been cleared as files have been uploaded.');
      }
    }
  }, [files.length, isProcessing, disabled]);

  return (
    <div className="relative w-full">
      <div
        ref={dropAreaRef}
        className={`w-full flex flex-col rounded-lg overflow-hidden border shadow-lg shadow-custom-shadow ${
          isDragging ? 'border-blue-500' : 'border-black'
        } transition-shadow duration-200`}
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
              placeholder={
                isProcessing ? 'Processing your request...' : placeholder
              }
              height={height}
              disabled={disabled || isProcessing || files.length > 0}
              handleEditorKeyDown={handleEditorKeyDown}
              handlePaste={handlePaste}
              updateContent={updateContent}
              isProcessing={isProcessing} // Add this line
            />
          )}

          {/* {mode === MODES.DRAW && (
            <TLDrawWhiteboard
              onContentChange={handleDrawingChange}
              disabled={disabled}
              height={height}
            />
          )} */}
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
          isProcessing={isProcessing}
        />
      </div>

      {showMathKeyboard && files.length === 0 && (
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
        .pulse-animation {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

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
      `}</style>
    </div>
  );
};

export default SuperInput;
