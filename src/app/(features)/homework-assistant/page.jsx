'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  ChevronRight,
  Upload,
  X,
  Maximize2,
  Minimize2,
  Keyboard,
  Trash2,
} from 'lucide-react';
import Head from 'next/head';
import { createFileData, validateFile } from '@/lib/fileUtils';
import MathKeyboard from '@/components/shared/SuperInputBox/math-keyboard';
import FilePreviews from '@/components/shared/SuperInputBox/file-previews';

export default function HWAssistant() {
  const examples = [
    'Find the integral of sin(x)',
    'Factor: x² - 5x + 6',
    'Derivative of 2x³ + 4x',
    'More Examples',
  ];

  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showMathKeyboard, setShowMathKeyboard] = useState(false);
  const [activeTab, setActiveTab] = useState('ΣΠ');
  const [activeField, setActiveField] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const editorRef = useRef(null);
  const MQRef = useRef(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const buttonHover = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

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
  }, []);

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

  const placeCaretAfter = useCallback((node) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStartAfter(node);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    if (editorRef.current) editorRef.current.focus();
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

  const handleFileUpload = useCallback(
    (e) => {
      const newFiles = Array.from(e.target.files || []);
      if (newFiles.length === 0) return;

      if (files.length + newFiles.length > 5) {
        // MAX_FILES = 5
        alert('Maximum 5 files can be uploaded');
        return;
      }

      const validFiles = newFiles.filter((file) => {
        const validation = validateFile(file);
        if (!validation.isValid) {
          Object.values(validation.errors).forEach((error) => alert(error));
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      const filesData = validFiles.map((file) => createFileData(file));
      setFiles((prev) => [...prev, ...filesData]);
    },
    [files],
  );

  const handleCameraInput = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      Object.values(validation.errors).forEach((error) => alert(error));
      return;
    }

    const fileData = createFileData(file);
    setFiles((prev) => [...prev, fileData]);
  }, []);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const triggerCameraInput = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  const removeFile = useCallback((fileId) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  }, []);

  const toggleMathKeyboard = () => {
    setShowMathKeyboard(!showMathKeyboard);
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      setText('');
    }
    setFiles([]);
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

      if (files.length + droppedFiles.length > 5) {
        alert('Maximum 5 files can be uploaded');
        return;
      }

      const validFiles = droppedFiles.filter((file) => {
        const validation = validateFile(file);
        if (!validation.isValid) {
          Object.values(validation.errors).forEach((error) => alert(error));
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
  }, [files]);

  const handlePaste = async (e) => {
    if (e) {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      if (pastedText?.length > 2000) {
        alert('Maximum 2000 characters can be added as question!!');
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

  const handleSubmit = async () => {
    if (isProcessing) return;

    const hasContent = text.trim().length > 0 || files.length > 0;
    if (!hasContent) return;

    try {
      setIsProcessing(true);
      // Here you would typically call your API to process the question
      console.log('Submitting:', { text, files });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset after submission
      setText('');
      if (editorRef.current) editorRef.current.innerHTML = '';
      setFiles([]);
      setShowMathKeyboard(false);

      alert('Question submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to process your question. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Head>
        <title>Math Homework Assistant - Instant AI Math Problem Solver</title>
        <meta
          name="description"
          content="Get instant solutions to all your math problems with our AI-powered Math Homework Assistant. Upload images or type your problems for step-by-step solutions."
        />
        <meta
          name="keywords"
          content="math solver, homework help, AI math tutor, calculus solver, algebra help"
        />
        <meta property="og:title" content="Math Homework Assistant" />
        <meta
          property="og:description"
          content="AI-powered math problem solver with step-by-step solutions"
        />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex flex-row justify-center w-full min-h-screen">
        <div className="relative">
          <div className="flex flex-col items-center">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-gradient-secondary bg-clip-text text-transparent font-black text-4xl"
            >
              Homework Assistant
            </motion.h1>

            <motion.h2
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mt-8 text-heading-ha text-xl font-semibold"
            >
              Instant AI Math Solver
            </motion.h2>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mt-10 shadow-xl rounded-lg bg-white"
            >
              <div className="p-8">
                <motion.div
                  ref={dropAreaRef}
                  whileHover={{
                    boxShadow: '0px 0px 15px rgba(66, 85, 255, 0.3)',
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-full min-h-[298px] rounded-md border border-dashed ${
                    isDragging
                      ? 'border-blue-500 bg-action-buttons-background'
                      : 'border-gray-400'
                  } flex flex-col justify-between p-10 relative`}
                >
                  {/* Trash button moved to top-right corner */}
                  <motion.div
                    variants={buttonHover}
                    initial="rest"
                    whileHover="hover"
                    className="absolute top-2 right-2 flex items-center justify-center p-2 bg-gray-200 hover:bg-red-100 text-red-600 rounded-full cursor-pointer"
                    onClick={handleClear}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.div>

                  <FilePreviews files={files} removeFile={removeFile} />

                  <div
                    ref={editorRef}
                    className="flex-1 outline-none"
                    contentEditable
                    onKeyDown={handleEditorKeyDown}
                    onPaste={handlePaste}
                    data-placeholder="Type a math problem.... or drag and drop/ paste an image here"
                    style={{ minHeight: '100px' }}
                  />

                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <motion.button
                        variants={buttonHover}
                        initial="rest"
                        whileHover="hover"
                        className="flex items-center gap-2 h-9 bg-action-buttons-background text-action-buttons-foreground font-medium rounded-md border-none px-4"
                        onClick={triggerFileInput}
                      >
                        <Upload className="w-6 h-6" />
                        Upload Files
                      </motion.button>

                      <motion.button
                        variants={buttonHover}
                        initial="rest"
                        whileHover="hover"
                        className="flex items-center gap-2 h-9 bg-action-buttons-background text-action-buttons-foreground font-medium rounded-md border-none px-4"
                        onClick={triggerCameraInput}
                      >
                        <Camera className="w-6 h-6" />
                        Take a snap
                      </motion.button>

                      <motion.button
                        variants={buttonHover}
                        initial="rest"
                        whileHover="hover"
                        className="flex items-center gap-2 h-9 bg-action-buttons-background text-action-buttons-foreground font-medium rounded-md border-none px-4"
                        onClick={toggleMathKeyboard}
                      >
                        <Keyboard className="w-6 h-6" />
                        Math Keyboard
                      </motion.button>
                    </div>

                    <motion.button
                      variants={buttonHover}
                      initial="rest"
                      whileHover="hover"
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 bg-action-buttons-foreground text-white font-medium rounded-md shadow-sm h-9 px-4 ml-10"
                      onClick={handleSubmit}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        'Processing...'
                      ) : (
                        <>
                          Submit&nbsp;&nbsp;Questions
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
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
              </div>
            </motion.div>

            {/* Examples Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
              className="mt-10 flex flex-col items-center"
            >
              <motion.div
                variants={fadeIn}
                className="font-medium text-gray-500 text-lg mb-4"
              >
                ✨ Jump in with one of these examples
              </motion.div>

              <motion.div variants={staggerChildren} className="flex gap-2">
                {examples.map((example, index) => (
                  <motion.button
                    key={index}
                    variants={fadeIn}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: '#dddff8',
                      transition: { duration: 0.2 },
                    }}
                    className="bg-button-background-question font-semibold text-black text-lg shadow-sm rounded-md border-none py-2 px-4"
                  >
                    {example}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,application/pdf"
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraInput}
        className="hidden"
      />

      <style jsx global>{`
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
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          font-style: italic;
        }
      `}</style>
    </>
  );
}
