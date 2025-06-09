'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Camera,
    Upload,
    X,
    Trash2,
    LoaderCircle,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import Head from 'next/head';
import { createFileData, validateFile } from '@/lib/fileUtils';
import MathKeyboard from '@/components/shared/SuperInputBox/math-keyboard';
import FilePreviews from '@/components/shared/SuperInputBox/file-previews';
import toast from 'react-hot-toast';

export default function SmartSolutionCheckPage() {
    const examples = [
        {
            question: 'Find the integral of 2x + 4',
            answer: 'x² + 4x + C'
        },
        {
            question: 'Factor: x² - 5x + 6',
            answer: '(x - 2)(x - 3)'
        },
        {
            question: 'Derivative of 2x³ + 4x',
            answer: '6x² + 4'
        },
        {
            question: 'Solve: 2x + 8 = 16',
            answer: 'x = 4'
        }
    ];

    const [questionText, setQuestionText] = useState('');
    const [answerText, setAnswerText] = useState('');
    const [questionFiles, setQuestionFiles] = useState([]);
    const [answerFiles, setAnswerFiles] = useState([]);
    const [questionIsDragging, setQuestionIsDragging] = useState(false);
    const [answerIsDragging, setAnswerIsDragging] = useState(false);
    const [showQuestionMathKeyboard, setShowQuestionMathKeyboard] = useState(false);
    const [showAnswerMathKeyboard, setShowAnswerMathKeyboard] = useState(false);
    const [activeTab, setActiveTab] = useState('ΣΠ');
    const [activeField, setActiveField] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [containsAnswers, setContainsAnswers] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const questionFileInputRef = useRef(null);
    const answerFileInputRef = useRef(null);
    const questionCameraInputRef = useRef(null);
    const answerCameraInputRef = useRef(null);
    const questionDropAreaRef = useRef(null);
    const answerDropAreaRef = useRef(null);
    const questionEditorRef = useRef(null);
    const answerEditorRef = useRef(null);
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

            if (questionEditorRef.current) {
                questionEditorRef.current.addEventListener('input', () => handleEditorInput('question'));
            }
            if (answerEditorRef.current) {
                answerEditorRef.current.addEventListener('input', () => handleEditorInput('answer'));
            }
        }
    }, []);

    const handleEditorInput = useCallback((type) => {
        updateContent(type);
        const editorRef = type === 'question' ? questionEditorRef : answerEditorRef;
        const setShowKeyboard = type === 'question' ? setShowQuestionMathKeyboard : setShowAnswerMathKeyboard;

        if (editorRef.current && editorRef.current.textContent.trim().length > 0) {
            setShowKeyboard(true);
        }
    }, []);

    const updateContent = useCallback((type) => {
        const editorRef = type === 'question' ? questionEditorRef : answerEditorRef;
        const setText = type === 'question' ? setQuestionText : setAnswerText;

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

    const placeCaretAfter = useCallback((node, editorRef) => {
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStartAfter(node);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        if (editorRef.current) editorRef.current.focus();
    }, []);

    const insertMathFieldAtCaret = useCallback(
        (latex = '', type) => {
            const editorRef = type === 'question' ? questionEditorRef : answerEditorRef;
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
                        updateContent(type);
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
                placeCaretAfter(span, editorRef);
            } else {
                editor.appendChild(span);
                placeCaretAfter(span, editorRef);
            }

            updateContent(type);
        },
        [updateContent, placeCaretAfter],
    );

    const handleEditorKeyDown = (e, type) => {
        if (e.key === '`' || e.key === '$' || e.key === '\\') {
            e.preventDefault();
            insertMathFieldAtCaret('', type);
        }
    };

    const insertSymbol = useCallback(
        (symbol, type) => {
            if (activeField && document.activeElement.closest('.math-field')) {
                if (symbol.startsWith('\\')) {
                    activeField.write(symbol);
                } else {
                    activeField.typedText(symbol);
                }
                activeField.focus();
            } else {
                insertMathFieldAtCaret(symbol, type);
            }
            updateContent(type);
        },
        [activeField, insertMathFieldAtCaret, updateContent],
    );

    const insertCommand = useCallback(
        (cmd, type) => {
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
                insertMathFieldAtCaret(cmdLatex, type);
            }
            updateContent(type);
        },
        [activeField, insertMathFieldAtCaret, updateContent],
    );

    const insertExponent = useCallback(
        (exp, type) => {
            if (activeField && document.activeElement.closest('.math-field')) {
                activeField.typedText(exp === '^2' ? '^2' : '^');
                activeField.focus();
            } else {
                insertMathFieldAtCaret(exp === '^2' ? 'x^2' : 'x^{}', type);
            }
            updateContent(type);
        },
        [activeField, insertMathFieldAtCaret, updateContent],
    );

    const insertSubscript = useCallback((type) => {
        if (activeField && document.activeElement.closest('.math-field')) {
            activeField.typedText('_');
            activeField.focus();
        } else {
            insertMathFieldAtCaret('x_{}', type);
        }
        updateContent(type);
    }, [activeField, insertMathFieldAtCaret, updateContent]);

    const insertComplexExpression = useCallback(
        (latexTemplate, type) => {
            if (activeField && document.activeElement.closest('.math-field')) {
                activeField.write(latexTemplate);
                activeField.focus();
            } else {
                insertMathFieldAtCaret(latexTemplate, type);
            }
            updateContent(type);
        },
        [activeField, insertMathFieldAtCaret, updateContent],
    );

    const handleFileUpload = useCallback(
        (e, type) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const validation = validateFile(file);
            if (!validation.isValid) {
                Object.values(validation.errors).forEach((error) => toast.error(error));
                return;
            }

            if (!file.type.startsWith('image/')) {
                toast.error('Only image files are allowed');
                return;
            }

            const fileData = createFileData(file);
            const setFiles = type === 'question' ? setQuestionFiles : setAnswerFiles;
            const setText = type === 'question' ? setQuestionText : setAnswerText;
            const editorRef = type === 'question' ? questionEditorRef : answerEditorRef;

            setFiles([fileData]);

            if ((type === 'question' ? questionText : answerText).trim().length > 0) {
                setText('');
                if (editorRef.current) editorRef.current.innerHTML = '';
            }
        },
        [questionText, answerText],
    );

    const handleCameraInput = useCallback(
        (e, type) => {
            handleFileUpload(e, type);
        },
        [handleFileUpload],
    );

    const triggerFileInput = useCallback((type) => {
        const inputRef = type === 'question' ? questionFileInputRef : answerFileInputRef;
        inputRef.current?.click();
    }, []);

    const triggerCameraInput = useCallback((type) => {
        const inputRef = type === 'question' ? questionCameraInputRef : answerCameraInputRef;
        inputRef.current?.click();
    }, []);

    const removeFile = useCallback((fileId, type) => {
        const setFiles = type === 'question' ? setQuestionFiles : setAnswerFiles;
        setFiles([]);
    }, []);

    const toggleMathKeyboard = (type) => {
        const setShowKeyboard = type === 'question' ? setShowQuestionMathKeyboard : setShowAnswerMathKeyboard;
        const showKeyboard = type === 'question' ? showQuestionMathKeyboard : showAnswerMathKeyboard;
        setShowKeyboard(!showKeyboard);
    };

    const handleClear = (type) => {
        const editorRef = type === 'question' ? questionEditorRef : answerEditorRef;
        const setText = type === 'question' ? setQuestionText : setAnswerText;
        const setFiles = type === 'question' ? setQuestionFiles : setAnswerFiles;

        if (editorRef.current) {
            editorRef.current.innerHTML = '';
            setText('');
        }
        setFiles([]);
    };

    const setupDragAndDrop = useCallback((type) => {
        const dropAreaRef = type === 'question' ? questionDropAreaRef : answerDropAreaRef;
        const setIsDragging = type === 'question' ? setQuestionIsDragging : setAnswerIsDragging;
        const files = type === 'question' ? questionFiles : answerFiles;
        const text = type === 'question' ? questionText : answerText;
        const setText = type === 'question' ? setQuestionText : setAnswerText;
        const setFiles = type === 'question' ? setQuestionFiles : setAnswerFiles;
        const editorRef = type === 'question' ? questionEditorRef : answerEditorRef;

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

            const file = droppedFiles[0];
            if (!file.type.startsWith('image/')) {
                toast.error('Only image files are allowed');
                return;
            }

            const validation = validateFile(file);
            if (!validation.isValid) {
                Object.values(validation.errors).forEach((error) => toast.error(error));
                return;
            }

            const fileData = createFileData(file);
            setFiles([fileData]);

            if (text.trim().length > 0) {
                setText('');
                if (editorRef.current) editorRef.current.innerHTML = '';
            }
        };

        dropArea.addEventListener('dragover', handleDragOver);
        dropArea.addEventListener('dragleave', handleDragLeave);
        dropArea.addEventListener('drop', handleDrop);

        return () => {
            dropArea.removeEventListener('dragover', handleDragOver);
            dropArea.removeEventListener('dragleave', handleDragLeave);
            dropArea.removeEventListener('drop', handleDrop);
        };
    }, [questionFiles, answerFiles, questionText, answerText]);

    useEffect(() => {
        const cleanupQuestion = setupDragAndDrop('question');
        const cleanupAnswer = setupDragAndDrop('answer');

        return () => {
            cleanupQuestion?.();
            cleanupAnswer?.();
        };
    }, [setupDragAndDrop]);

    const handlePaste = useCallback(
        async (e, type) => {
            e.preventDefault();

            const clipboardItems = e.clipboardData?.items;
            if (clipboardItems) {
                for (let i = 0; i < clipboardItems.length; i++) {
                    if (clipboardItems[i].type.indexOf('image') !== -1) {
                        const blob = clipboardItems[i].getAsFile();
                        if (blob) {
                            const fileName = `pasted-image-${Date.now()}.png`;
                            const file = new File([blob], fileName, { type: 'image/png' });

                            const validation = validateFile(file);
                            if (!validation.isValid) {
                                Object.values(validation.errors).forEach((error) =>
                                    toast.error(error),
                                );
                                return;
                            }

                            const fileData = createFileData(file);
                            const setFiles = type === 'question' ? setQuestionFiles : setAnswerFiles;
                            const setText = type === 'question' ? setQuestionText : setAnswerText;
                            const editorRef = type === 'question' ? questionEditorRef : answerEditorRef;
                            const text = type === 'question' ? questionText : answerText;

                            setFiles([fileData]);

                            if (text.trim().length > 0) {
                                setText('');
                                if (editorRef.current) editorRef.current.innerHTML = '';
                            }
                            return;
                        }
                    }
                }
            }

            const pastedText = e.clipboardData.getData('text');
            if (pastedText?.length > 2000) {
                toast.error('Maximum 2000 characters can be added!!');
            } else {
                const files = type === 'question' ? questionFiles : answerFiles;
                const editorRef = type === 'question' ? questionEditorRef : answerEditorRef;
                const setShowKeyboard = type === 'question' ? setShowQuestionMathKeyboard : setShowAnswerMathKeyboard;

                if (files.length === 0) {
                    if (activeField && document.activeElement.closest('.math-field')) {
                        if (pastedText.includes('\\') || pastedText.includes('$')) {
                            activeField.latex(pastedText);
                        } else {
                            activeField.write(pastedText);
                        }
                    } else {
                        editorRef.current.textContent += pastedText;
                    }
                    updateContent(type);
                    setShowKeyboard(true);
                }
            }
        },
        [activeField, questionFiles, answerFiles, questionText, answerText, updateContent],
    );

    const hasQuestion = questionText.trim().length > 0 || questionFiles.length > 0;
    const hasAnswer = answerText.trim().length > 0 || answerFiles.length > 0;
    const canSubmit = hasQuestion && (containsAnswers && questionFiles.length > 0 ? true : hasAnswer);

    const questionInputType = questionFiles.length > 0 ? 'image' : 'text';
    const answerInputType = answerFiles.length > 0 ? 'image' : 'text';
    const answerDisabled = !hasQuestion || (questionInputType !== answerInputType);

    const handleSubmit = async () => {
        if (isProcessing || !canSubmit) return;

        setIsProcessing(true);

        setTimeout(() => {
            const isCorrect = Math.random() > 0.5;
            toast.success(isCorrect ? 'Solution is correct!' : 'Solution needs review', {
                icon: isCorrect ? '✅' : '❌',
            });
            setIsProcessing(false);
        }, 2000);
    };

    const handleExampleClick = (example, field) => {
        if (field === 'question') {
            if (questionFiles.length > 0) {
                toast.error('Please remove uploaded files first to use examples');
                return;
            }
            if (questionEditorRef.current) {
                questionEditorRef.current.textContent = example.question;
                updateContent('question');
                setShowQuestionMathKeyboard(true);
                questionEditorRef.current.focus();
            }
        } else {
            if (answerFiles.length > 0) {
                toast.error('Please remove uploaded files first to use examples');
                return;
            }
            if (answerEditorRef.current) {
                answerEditorRef.current.textContent = example.answer;
                updateContent('answer');
                setShowAnswerMathKeyboard(true);
                answerEditorRef.current.focus();
            }
        }
    };

    return (
        <>
            <Head>
                <title>Smart Solution Check - Verify Your Math Solutions</title>
                <meta
                    name="description"
                    content="Verify the correctness of your math solutions with our AI-powered Smart Solution Check. Upload questions and answers for instant verification."
                />
                <meta
                    name="keywords"
                    content="solution checker, math verification, homework checker, AI math validator"
                />
                <meta property="og:title" content="Smart Solution Check" />
                <meta
                    property="og:description"
                    content="AI-powered solution verification for math problems"
                />
                <meta property="og:type" content="website" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="flex flex-row justify-center w-full min-h-screen">
                <div className="relative w-full">
                    <div className="flex flex-col items-center">
                        <motion.h1
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent font-black text-4xl font-roca"
                        >
                            Smart Solution Check
                        </motion.h1>

                        <motion.h2
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="mt-4 text-blue-600 text-xl font-semibold"
                        >
                            Get even your handwritten answers checked here
                        </motion.h2>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="mt-8 w-full max-w-6xl"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <motion.div
                                    variants={fadeIn}
                                    className="rounded-lg bg-white shadow-lg border border-blue-200"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <h3 className="text-lg font-semibold text-blue-600">Question 💡</h3>
                                        </div>

                                        <motion.div
                                            ref={questionDropAreaRef}
                                            transition={{ duration: 0.3 }}
                                            className={`w-full min-h-[250px] rounded-md border-2 border-dashed ${questionIsDragging
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-300'
                                                } flex flex-col justify-between p-6 relative`}
                                        >
                                            {(questionText.trim().length > 0 || questionFiles.length > 0) && (
                                                <motion.div
                                                    variants={buttonHover}
                                                    initial="rest"
                                                    whileHover="hover"
                                                    className="absolute top-2 right-2 flex items-center justify-center p-2 bg-gray-200 hover:bg-red-100 text-red-600 rounded-full cursor-pointer z-10"
                                                    onClick={() => handleClear('question')}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </motion.div>
                                            )}

                                            <FilePreviews files={questionFiles} removeFile={(id) => removeFile(id, 'question')} />

                                            <div className="flex flex-col flex-1">
                                                <div
                                                    ref={questionEditorRef}
                                                    className="flex-1 outline-none relative"
                                                    contentEditable={questionFiles.length === 0 && !isProcessing}
                                                    onKeyDown={(e) => handleEditorKeyDown(e, 'question')}
                                                    onPaste={(e) => handlePaste(e, 'question')}
                                                    style={{
                                                        minHeight: '60px',
                                                        pointerEvents: (questionFiles.length > 0 || isProcessing) ? 'none' : 'auto',
                                                        opacity: (questionFiles.length > 0 || isProcessing) ? 0.7 : 1,
                                                    }}
                                                />
                                                {questionText?.length === 0 && questionFiles?.length === 0 && (
                                                    <div className="flex flex-col absolute text-gray-700 text-sm w-full">
                                                        <span>Type a math problem....</span>
                                                        <span className="mt-2">or drag and drop/ paste an image here</span>
                                                    </div>
                                                )}
                                            </div>

                                            {questionFiles.length > 0 && (
                                                <div className="mt-4 flex items-center">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={containsAnswers}
                                                            onChange={(e) => setContainsAnswers(e.target.checked)}
                                                            className="rounded border-gray-300"
                                                        />
                                                        <span className="text-sm text-gray-700">Contains answers as well</span>
                                                    </label>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center mt-4">
                                                <div className="flex gap-2">
                                                    <motion.button
                                                        variants={buttonHover}
                                                        initial="rest"
                                                        whileHover="hover"
                                                        className={`flex items-center gap-2 h-9 bg-blue-100 text-blue-700 font-medium rounded-md border-none px-3 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                        onClick={() => triggerFileInput('question')}
                                                        disabled={isProcessing}
                                                    >
                                                        <Upload className="w-4 h-4" />
                                                        Upload Files
                                                    </motion.button>

                                                    <motion.button
                                                        variants={buttonHover}
                                                        initial="rest"
                                                        whileHover="hover"
                                                        className={`flex items-center gap-2 h-9 bg-blue-100 text-blue-700 font-medium rounded-md border-none px-3 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                        onClick={() => triggerCameraInput('question')}
                                                        disabled={isProcessing}
                                                    >
                                                        <Camera className="w-4 h-4" />
                                                        Take a snap
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {showQuestionMathKeyboard && questionFiles.length === 0 && questionText.trim().length > 0 && (
                                            <div className="relative mt-4">
                                                <button
                                                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1 z-10"
                                                    onClick={() => toggleMathKeyboard('question')}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <MathKeyboard
                                                    activeTab={activeTab}
                                                    setActiveTab={setActiveTab}
                                                    insertSymbol={(symbol) => insertSymbol(symbol, 'question')}
                                                    insertCommand={(cmd) => insertCommand(cmd, 'question')}
                                                    insertExponent={(exp) => insertExponent(exp, 'question')}
                                                    insertSubscript={() => insertSubscript('question')}
                                                    insertComplexExpression={(expr) => insertComplexExpression(expr, 'question')}
                                                    disabled={false}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                <motion.div
                                    variants={fadeIn}
                                    className="rounded-lg bg-white shadow-lg border border-cyan-200 relative"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <h3 className="text-lg font-semibold text-cyan-600">Answer 💡</h3>
                                        </div>

                                        <motion.div
                                            ref={answerDropAreaRef}
                                            transition={{ duration: 0.3 }}
                                            className={`w-full min-h-[250px] rounded-md border-2 border-dashed ${answerIsDragging
                                                ? 'border-cyan-500 bg-cyan-50'
                                                : answerDisabled
                                                    ? 'border-gray-200 bg-gray-50'
                                                    : 'border-gray-300'
                                                } flex flex-col justify-between p-6 relative`}
                                            style={{
                                                pointerEvents: answerDisabled ? 'none' : 'auto',
                                                opacity: answerDisabled ? 0.5 : 1,
                                            }}
                                        >
                                            {answerDisabled && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90 z-10">
                                                    <div className="bg-white p-3 rounded-lg shadow-md border">
                                                        <p className="text-sm text-gray-600">Complete adding your question first!</p>
                                                    </div>
                                                </div>
                                            )}

                                            {(answerText.trim().length > 0 || answerFiles.length > 0) && !answerDisabled && (
                                                <motion.div
                                                    variants={buttonHover}
                                                    initial="rest"
                                                    whileHover="hover"
                                                    className="absolute top-2 right-2 flex items-center justify-center p-2 bg-gray-200 hover:bg-red-100 text-red-600 rounded-full cursor-pointer z-10"
                                                    onClick={() => handleClear('answer')}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </motion.div>
                                            )}

                                            <FilePreviews files={answerFiles} removeFile={(id) => removeFile(id, 'answer')} />

                                            <div className="flex flex-col flex-1">
                                                <div
                                                    ref={answerEditorRef}
                                                    className="flex-1 outline-none relative"
                                                    contentEditable={answerFiles.length === 0 && !answerDisabled && !isProcessing}
                                                    onKeyDown={(e) => handleEditorKeyDown(e, 'answer')}
                                                    onPaste={(e) => handlePaste(e, 'answer')}
                                                    style={{
                                                        minHeight: '60px',
                                                        pointerEvents: (answerFiles.length > 0 || answerDisabled || isProcessing) ? 'none' : 'auto',
                                                        opacity: (answerFiles.length > 0 || answerDisabled || isProcessing) ? 0.7 : 1,
                                                    }}
                                                />
                                                {answerText?.length === 0 && answerFiles?.length === 0 && !answerDisabled && (
                                                    <div className="flex flex-col absolute text-gray-700 text-sm w-full">
                                                        <span>Start Solving here or give me a</span>
                                                        <span className="mt-2">photo of your solution</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center mt-4">
                                                <div className="flex gap-2">
                                                    <motion.button
                                                        variants={buttonHover}
                                                        initial="rest"
                                                        whileHover="hover"
                                                        className={`flex items-center gap-2 h-9 bg-cyan-100 text-cyan-700 font-medium rounded-md border-none px-3 ${answerDisabled || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                        onClick={() => triggerFileInput('answer')}
                                                        disabled={answerDisabled || isProcessing}
                                                    >
                                                        <Upload className="w-4 h-4" />
                                                        Upload Files
                                                    </motion.button>

                                                    <motion.button
                                                        variants={buttonHover}
                                                        initial="rest"
                                                        whileHover="hover"
                                                        className={`flex items-center gap-2 h-9 bg-cyan-100 text-cyan-700 font-medium rounded-md border-none px-3 ${answerDisabled || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                        onClick={() => triggerCameraInput('answer')}
                                                        disabled={answerDisabled || isProcessing}
                                                    >
                                                        <Camera className="w-4 h-4" />
                                                        Take a snap
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {showAnswerMathKeyboard && answerFiles.length === 0 && answerText.trim().length > 0 && !answerDisabled && (
                                            <div className="relative mt-4">
                                                <button
                                                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1 z-10"
                                                    onClick={() => toggleMathKeyboard('answer')}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <MathKeyboard
                                                    activeTab={activeTab}
                                                    setActiveTab={setActiveTab}
                                                    insertSymbol={(symbol) => insertSymbol(symbol, 'answer')}
                                                    insertCommand={(cmd) => insertCommand(cmd, 'answer')}
                                                    insertExponent={(exp) => insertExponent(exp, 'answer')}
                                                    insertSubscript={() => insertSubscript('answer')}
                                                    insertComplexExpression={(expr) => insertComplexExpression(expr, 'answer')}
                                                    disabled={false}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeIn}
                                className="mt-6 flex justify-center"
                            >
                                <motion.button
                                    variants={buttonHover}
                                    initial="rest"
                                    whileHover={canSubmit && !isProcessing ? "hover" : "rest"}
                                    className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${canSubmit && !isProcessing
                                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 cursor-pointer shadow-lg hover:shadow-xl'
                                        : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                    onClick={handleSubmit}
                                    disabled={!canSubmit || isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <LoaderCircle className="w-5 h-5 animate-spin" />
                                            Checking Solution...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Check My Solution
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>

                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeIn}
                                className="mt-12"
                            >
                                <h3 className="text-center text-xl font-semibold text-gray-800 mb-8">
                                    Explore a few solved examples ✨
                                </h3>

                                <motion.div
                                    variants={staggerChildren}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    {examples.map((example, index) => (
                                        <motion.div
                                            key={index}
                                            variants={fadeIn}
                                            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="p-4">
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-600 mb-2">Question:</h4>
                                                    <motion.div
                                                        variants={buttonHover}
                                                        initial="rest"
                                                        whileHover="hover"
                                                        className="bg-blue-50 p-3 rounded-md cursor-pointer border border-blue-200 hover:border-blue-300 transition-colors"
                                                        onClick={() => handleExampleClick(example, 'question')}
                                                    >
                                                        <p className="text-gray-800 font-mono text-sm">{example.question}</p>
                                                    </motion.div>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-600 mb-2">Answer:</h4>
                                                    <motion.div
                                                        variants={buttonHover}
                                                        initial="rest"
                                                        whileHover="hover"
                                                        className="bg-cyan-50 p-3 rounded-md cursor-pointer border border-cyan-200 hover:border-cyan-300 transition-colors"
                                                        onClick={() => handleExampleClick(example, 'answer')}
                                                    >
                                                        <p className="text-gray-800 font-mono text-sm">{example.answer}</p>
                                                    </motion.div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                                                <motion.button
                                                    variants={buttonHover}
                                                    initial="rest"
                                                    whileHover="hover"
                                                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-4 rounded-md font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                                                    onClick={() => {
                                                        handleExampleClick(example, 'question');
                                                        setTimeout(() => handleExampleClick(example, 'answer'), 100);
                                                    }}
                                                >
                                                    Try this solved problem
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                <input
                    ref={questionFileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, 'question')}
                />
                <input
                    ref={answerFileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, 'answer')}
                />
                <input
                    ref={questionCameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={(e) => handleCameraInput(e, 'question')}
                />
                <input
                    ref={answerCameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={(e) => handleCameraInput(e, 'answer')}
                />
            </div>
        </>
    );
}