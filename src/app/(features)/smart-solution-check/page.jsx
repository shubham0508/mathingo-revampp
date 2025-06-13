'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Camera,
    ChevronRight,
    Upload,
    X,
    Trash2,
    LoaderCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
    useSscQNAExtractionMutation,
    useSscExtractTextMutation,
} from '@/store/slices/SSC';
import { createFileData, validateFile } from '@/lib/fileUtils';
import MathKeyboard from '@/components/shared/SuperInputBox/math-keyboard';
import FilePreviews from '@/components/shared/SuperInputBox/file-previews';
import { useGuestUserAuth } from '@/hooks/useGuestUserAuth';
import { getErrorMessage } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function SmartSolutionCheck() {
    const [questionText, setQuestionText] = useState('');
    const [answerText, setAnswerText] = useState('');
    const [questionFiles, setQuestionFiles] = useState([]);
    const [answerFiles, setAnswerFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [activeDropArea, setActiveDropArea] = useState(null);
    const [showMathKeyboard, setShowMathKeyboard] = useState(false);
    const [activeTab, setActiveTab] = useState('ΣΠ');
    const [activeField, setActiveField] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAnswerInput, setShowAnswerInput] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogShownForSession, setDialogShownForSession] = useState(false);
    const [currentInputType, setCurrentInputType] = useState('question');

    const questionFileInputRef = useRef(null);
    const answerFileInputRef = useRef(null);
    const questionCameraInputRef = useRef(null);
    const answerCameraInputRef = useRef(null);
    const questionDropAreaRef = useRef(null);
    const answerDropAreaRef = useRef(null);
    const questionEditorRef = useRef(null);
    const answerEditorRef = useRef(null);
    const MQRef = useRef(null);

    const [sscQNAExtraction] = useSscQNAExtractionMutation();
    const [sscExtractText] = useSscExtractTextMutation();
    const { ensureAuthenticated } = useGuestUserAuth();
    const router = useRouter();
    const dispatch = useDispatch();
    const MODEL_NAME = 'alpha';

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

    const hasQuestionContent = questionText.trim().length > 0 || questionFiles.length > 0;
    const hasAnswerContent = answerText.trim().length > 0 || answerFiles.length > 0;
    const canProceed = hasQuestionContent && (showAnswerInput ? hasAnswerContent : true);

    useEffect(() => {
        const loadMathQuill = async () => {
            if (typeof window === 'undefined' || initialized) return;

            const jqueryScript = document.createElement('script');
            jqueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
            jqueryScript.async = true;
            jqueryScript.crossOrigin = 'anonymous';
            document.body.appendChild(jqueryScript);

            jqueryScript.onload = () => {
                const mathquillScript = document.createElement('script');
                mathquillScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.js';
                mathquillScript.async = true;
                mathquillScript.crossOrigin = 'anonymous';
                document.body.appendChild(mathquillScript);

                const mathquillCSS = document.createElement('link');
                mathquillCSS.rel = 'stylesheet';
                mathquillCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.css';
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

    useEffect(() => {
        if (hasQuestionContent && !showAnswerInput && !showDialog && !dialogShownForSession) {
            setShowDialog(true);
        }
    }, [hasQuestionContent, showAnswerInput, showDialog, dialogShownForSession]);

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
        if (editorRef.current && editorRef.current.textContent.trim().length > 0) {
            setShowMathKeyboard(true);
            setCurrentInputType(type);
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

    const placeCaretAfter = useCallback((node, type) => {
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStartAfter(node);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        const editorRef = type === 'question' ? questionEditorRef : answerEditorRef;
        if (editorRef.current) editorRef.current.focus();
    }, []);

    const insertMathFieldAtCaret = useCallback((latex = '', type) => {
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
            placeCaretAfter(span, type);
        } else {
            editor.appendChild(span);
            placeCaretAfter(span, type);
        }

        updateContent(type);
    }, [updateContent, placeCaretAfter]);

    const handleEditorKeyDown = (e, type) => {
        if (e.key === '`' || e.key === '$' || e.key === '\\') {
            e.preventDefault();
            insertMathFieldAtCaret('', type);
        }
    };

    const insertSymbol = useCallback((symbol) => {
        if (activeField && document.activeElement.closest('.math-field')) {
            if (symbol.startsWith('\\')) {
                activeField.write(symbol);
            } else {
                activeField.typedText(symbol);
            }
            activeField.focus();
        } else {
            insertMathFieldAtCaret(symbol, currentInputType);
        }
        updateContent(currentInputType);
    }, [activeField, insertMathFieldAtCaret, updateContent, currentInputType]);

    const insertCommand = useCallback((cmd) => {
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
            const cmdLatex = cmd === 'frac' ? '\\frac{}{}' : cmd === 'sqrt' ? '\\sqrt{}' : cmd === 'nthroot' ? '\\sqrt[]{}' : cmd === 'times' ? '\\times' : cmd === 'div' ? '\\div' : `\\${cmd}`;
            insertMathFieldAtCaret(cmdLatex, currentInputType);
        }
        updateContent(currentInputType);
    }, [activeField, insertMathFieldAtCaret, updateContent, currentInputType]);

    const insertExponent = useCallback((exp) => {
        if (activeField && document.activeElement.closest('.math-field')) {
            activeField.typedText(exp === '^2' ? '^2' : '^');
            activeField.focus();
        } else {
            insertMathFieldAtCaret(exp === '^2' ? 'x^2' : 'x^{}', currentInputType);
        }
        updateContent(currentInputType);
    }, [activeField, insertMathFieldAtCaret, updateContent, currentInputType]);

    const insertSubscript = useCallback(() => {
        if (activeField && document.activeElement.closest('.math-field')) {
            activeField.typedText('_');
            activeField.focus();
        } else {
            insertMathFieldAtCaret('x_{}', currentInputType);
        }
        updateContent(currentInputType);
    }, [activeField, insertMathFieldAtCaret, updateContent, currentInputType]);

    const insertComplexExpression = useCallback((latexTemplate) => {
        if (activeField && document.activeElement.closest('.math-field')) {
            activeField.write(latexTemplate);
            activeField.focus();
        } else {
            insertMathFieldAtCaret(latexTemplate, currentInputType);
        }
        updateContent(currentInputType);
    }, [activeField, insertMathFieldAtCaret, updateContent, currentInputType]);

    const handleFileUpload = useCallback((e, type) => {
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length === 0) return;

        const setFiles = type === 'question' ? setQuestionFiles : setAnswerFiles;
        const files = type === 'question' ? questionFiles : answerFiles;
        const text = type === 'question' ? questionText : answerText;
        const setText = type === 'question' ? setQuestionText : setAnswerText;
        const editorRef = type === 'question' ? questionEditorRef : answerEditorRef;

        if (files.length + newFiles.length > 1) {
            toast.error('Maximum 1 file can be uploaded');
            return;
        }

        const validFiles = newFiles.filter((file) => {
            const validation = validateFile(file);
            if (!validation.isValid) {
                Object.values(validation.errors).forEach((error) => toast.error(String(error)));
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        const filesData = validFiles.map((file) => createFileData(file));
        setFiles((prev) => [...prev, ...filesData]);

        if (text.trim().length > 0) {
            setText('');
            if (editorRef.current) editorRef.current.innerHTML = '';
        }
    }, [questionFiles, answerFiles, questionText, answerText]);

    const handleCameraInput = useCallback((e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const setFiles = type === 'question' ? setQuestionFiles : setAnswerFiles;
        const text = type === 'question' ? questionText : answerText;
        const setText = type === 'question' ? setQuestionText : setAnswerText;
        const editorRef = type === 'question' ? questionEditorRef : answerEditorRef;

        const validation = validateFile(file);
        if (!validation.isValid) {
            Object.values(validation.errors).forEach((error) => toast.error(String(error)));
            return;
        }

        const fileData = createFileData(file);
        setFiles((prev) => [...prev, fileData]);

        if (text.trim().length > 0) {
            setText('');
            if (editorRef.current) editorRef.current.innerHTML = '';
        }
    }, [questionText, answerText]);

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
        setFiles((prev) => prev.filter((file) => file.id !== fileId));
    }, []);

    const toggleMathKeyboard = () => {
        setShowMathKeyboard(!showMathKeyboard);
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

    const setupDropHandlers = useCallback((type) => {
        const dropAreaRef = type === 'question' ? questionDropAreaRef : answerDropAreaRef;
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
            setActiveDropArea(type);
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            setActiveDropArea(null);
        };

        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            setActiveDropArea(null);

            const droppedFiles = Array.from(e.dataTransfer?.files || []);
            if (droppedFiles.length === 0) return;

            if (files.length + droppedFiles.length > 1) {
                toast.error('Maximum 1 file can be uploaded');
                return;
            }

            const validFiles = droppedFiles.filter((file) => {
                const validation = validateFile(file);
                if (!validation.isValid) {
                    Object.values(validation.errors).forEach((error) => toast.error(String(error)));
                    return false;
                }
                return true;
            });

            if (validFiles.length === 0) return;

            const filesData = validFiles.map((file) => createFileData(file));
            setFiles((prev) => [...prev, ...filesData]);

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
        const questionCleanup = setupDropHandlers('question');
        const answerCleanup = showAnswerInput ? setupDropHandlers('answer') : null;

        return () => {
            questionCleanup?.();
            answerCleanup?.();
        };
    }, [setupDropHandlers, showAnswerInput]);

    const handlePaste = useCallback(async (e, type) => {
        e.preventDefault();

        const files = type === 'question' ? questionFiles : answerFiles;
        const text = type === 'question' ? questionText : answerText;
        const setText = type === 'question' ? setQuestionText : setAnswerText;
        const setFiles = type === 'question' ? setQuestionFiles : setAnswerFiles;
        const editorRef = type === 'question' ? questionEditorRef : answerEditorRef;

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
                            Object.values(validation.errors).forEach((error) => toast.error(String(error)));
                            return;
                        }

                        const fileData = createFileData(file);
                        setFiles((prev) => [...prev, fileData]);

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
            toast.error('Maximum 2000 characters can be added!');
        } else if (files.length === 0) {
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
            setShowMathKeyboard(true);
            setCurrentInputType(type);
        }
    }, [activeField, questionFiles, answerFiles, questionText, answerText, updateContent]);

    const submitFiles = async () => {
        try {
            toast.loading('Uploading files...', { id: 'file-upload' });

            const formData = new FormData();
            formData.append('type', 'ssc_files');

            if (questionFiles.length > 0) {
                formData.append('files', questionFiles[0]?.file, `question_${questionFiles[0]?.file.name}`);
            }
            if (answerFiles.length > 0) {
                formData.append('files', answerFiles[0]?.file, `answer_${answerFiles[0]?.file.name}`);
            }

            const response = await fetch('/api/s3/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                toast.error('Upload failed', { id: 'file-upload' });
                throw new Error(`Failed to upload files: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            if (!result?.success) {
                toast.error(result?.message || 'Failed to upload files', { id: 'file-upload' });
                throw new Error(result?.message || 'Failed to upload files');
            }

            toast.success('Files uploaded successfully', { id: 'file-upload' });

            const questionUrl = result?.files?.find(f => f.originalName.startsWith('question_'))?.fileKey || 'no_input';
            const answerUrl = result?.files?.find(f => f.originalName.startsWith('answer_'))?.fileKey || 'no_input';

            toast.loading('Checking your solution...', { id: 'extraction' });
            const extractionResponse = await sscQNAExtraction({
                model_name: MODEL_NAME,
                scc_question_url: questionUrl,
                scc_solution_url: answerUrl,
                input_type: 'image'
            }).unwrap();

            toast.success('Check complete!', { id: 'extraction' });
            handleExtractionResponse(extractionResponse);
        } catch (error) {
            console.error('Upload error:', error);
            toast.dismiss();
            const errorMessage = getErrorMessage(error?.data?.error);
            if (errorMessage) {
                toast.error(errorMessage);
            } else {
                toast.error('Failed to process files. Please try again.');
            }
            throw error;
        }
    };

    const submitTextData = async () => {
        try {
            toast.loading('Checking your solution...', { id: 'extraction' });
            const response = await sscExtractText({
                model_name: MODEL_NAME,
                input_type: 'text',
                grade: 'high_school',
                text_question: questionText,
                text_answer: answerText,
                question_url: 'no_input',
                solution_url: 'no_input'
            }).unwrap();
            toast.success('Check complete!', { id: 'extraction' });
            handleExtractionResponse(response);
        } catch (error) {
            console.error('Text submission error:', error);
            toast.dismiss();
            const errorMessage = getErrorMessage(error?.data?.error);
            if (errorMessage) {
                toast.error(errorMessage);
            } else {
                toast.error('Failed to process your input. Please try again.');
            }
            throw error;
        }
    };

    const handleExtractionResponse = (response) => {
        if (response?.status_code === 201) {
            // dispatch(setSscResult(response.data)); // Example of storing result in redux
            router.push('/smart-solution-check/results'); // Navigate to results page
        } else {
            setIsProcessing(false);
            throw new Error(response?.error || 'Failed to process input');
        }
    };

    const handleSubmit = async () => {
        if (isProcessing || !canProceed || !hasAnswerContent) {
            if (!hasAnswerContent) {
                toast.error("Please provide a solution to check.");
            }
            return;
        };

        try {
            setIsProcessing(true);

            const isReady = await ensureAuthenticated();
            if (!isReady) {
                toast.error('Something went wrong! Please try again later');
                setIsProcessing(false);
                return;
            }

            const hasFiles = questionFiles.length > 0 || answerFiles.length > 0;

            if (hasFiles) {
                await submitFiles();
            } else {
                await submitTextData();
            }

            setQuestionText('');
            setAnswerText('');
            if (questionEditorRef.current) questionEditorRef.current.innerHTML = '';
            if (answerEditorRef.current) answerEditorRef.current.innerHTML = '';
            setQuestionFiles([]);
            setAnswerFiles([]);
            setShowMathKeyboard(false);
            setShowAnswerInput(false);
            setDialogShownForSession(false);
        } catch (error) {
            console.error('Submission error:', error);
            setIsProcessing(false);
        }
    };

    const handleDialogResponse = (hasAnswer) => {
        setShowDialog(false);
        setDialogShownForSession(true);
        if (hasAnswer) {
            setShowAnswerInput(true);
        }
    };

    const renderInputBox = (type, title, placeholder) => {
        const text = type === 'question' ? questionText : answerText;
        const files = type === 'question' ? questionFiles : answerFiles;
        const editorRef = type === 'question' ? questionEditorRef : answerEditorRef;
        const dropAreaRef = type === 'question' ? questionDropAreaRef : answerDropAreaRef;
        const hasContent = text.trim().length > 0 || files.length > 0;

        const isCurrentDropArea = activeDropArea === type;

        return (
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="w-full rounded-lg bg-white mb-6"
                style={{ boxShadow: '0 1px 5px rgba(66, 85, 255, 1)' }}
            >
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
                    <motion.div
                        ref={dropAreaRef}
                        transition={{ duration: 0.3 }}
                        className={`w-full min-h-[200px] rounded-md border-2 border-dashed ${isDragging && isCurrentDropArea
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300'
                            } flex flex-col justify-between p-6 relative`}
                    >
                        {hasContent && (
                            <motion.div
                                variants={buttonHover}
                                initial="rest"
                                whileHover="hover"
                                className="absolute top-2 right-2 flex items-center justify-center p-2 bg-gray-200 hover:bg-red-100 text-red-600 rounded-full cursor-pointer"
                                onClick={() => handleClear(type)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </motion.div>
                        )}

                        <FilePreviews files={files} removeFile={(fileId) => removeFile(fileId, type)} />

                        <div className="flex flex-col flex-1">
                            <div
                                ref={editorRef}
                                className="flex-1 outline-none relative"
                                contentEditable={files.length === 0 && !isProcessing}
                                onKeyDown={(e) => handleEditorKeyDown(e, type)}
                                onPaste={(e) => handlePaste(e, type)}
                                onFocus={() => setCurrentInputType(type)}
                                style={{
                                    minHeight: '60px',
                                    pointerEvents: (files.length > 0 || isProcessing) ? 'none' : 'auto',
                                    opacity: (files.length > 0 || isProcessing) ? 0.7 : 1,
                                }}
                            />
                            {text?.length === 0 && files?.length === 0 && (
                                <div className="flex flex-col absolute text-gray-500 text-sm w-full pointer-events-none">
                                    <span>{placeholder}</span>
                                    <span className="mt-2 text-xs">
                                        or drag and drop/ paste an image here
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <div className="flex gap-2">
                                <motion.button
                                    variants={buttonHover}
                                    initial="rest"
                                    whileHover="hover"
                                    className={`flex items-center gap-2 h-9 bg-action-buttons-background text-action-buttons-foreground font-medium rounded-md border-none px-3 ${(isProcessing || files.length > 0) ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    onClick={() => triggerFileInput(type)}
                                    disabled={isProcessing || files.length > 0}
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload File
                                </motion.button>

                                <motion.button
                                    variants={buttonHover}
                                    initial="rest"
                                    whileHover="hover"
                                    className={`flex items-center gap-2 h-9 bg-action-buttons-background text-action-buttons-foreground font-medium rounded-md border-none px-3 ${(isProcessing || files.length > 0) ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    onClick={() => triggerCameraInput(type)}
                                    disabled={isProcessing || files.length > 0}
                                >
                                    <Camera className="w-4 h-4" />
                                    Take a snap
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        );
    };

    return (
        <>
            <div className="flex flex-row justify-center w-full min-h-screen px-4">
                <div className="relative w-full max-w-4xl py-10">
                    <div className="flex flex-col items-center">
                        <motion.h1
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="bg-gradient-secondary bg-clip-text text-transparent font-black text-4xl font-roca text-center"
                        >
                            Smart Solution Check
                        </motion.h1>
                        <motion.h2
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="mt-4 text-heading-ha text-xl font-semibold text-center mb-8"
                        >
                            Get even your handwritten answers checked here
                        </motion.h2>

                        {renderInputBox('question', 'Submit Question(s)', 'Type a math problem....')}

                        {showAnswerInput && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full">
                                {renderInputBox('answer', 'Upload Solution(s) for getting checked.', 'Type your solution here....')}
                            </motion.div>
                        )}

                        {showAnswerInput && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeIn}
                                className="w-full flex justify-end mt-4"
                            >
                                <motion.button
                                    variants={buttonHover}
                                    initial="rest"
                                    whileHover="hover"
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex items-center gap-1 ${isProcessing || !canProceed || !hasAnswerContent ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-action-buttons-foreground'
                                        } text-white font-medium rounded-md h-11 px-6`}
                                    onClick={handleSubmit}
                                    disabled={isProcessing || !canProceed || !hasAnswerContent}
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center">
                                            <LoaderCircle className="size-5 mr-3 animate-spin text-white" />
                                            Processing...
                                        </div>
                                    ) : (
                                        <>
                                            Proceed
                                            <ChevronRight className="w-5 h-5" />
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        )}

                        {(showMathKeyboard && (hasQuestionContent || hasAnswerContent)) && (
                            <div className="relative w-full mt-6">
                                <button
                                    className="absolute right-2 -top-2 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1 z-10"
                                    onClick={toggleMathKeyboard}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <MathKeyboard
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    insertSymbol={insertSymbol}
                                    insertCommand={insertCommand}
                                    insertExponent={insertExponent}
                                    insertSubscript={insertSubscript}
                                    insertComplexExpression={insertComplexExpression}
                                    disabled={isProcessing}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
                    >
                        <h3 className="text-lg font-bold text-gray-900">Have you submitted all the solutions along with the corresponding Questions</h3>
                        <div className="mt-6 flex justify-end gap-3">
                            <motion.button
                                variants={buttonHover} whileHover="hover"
                                onClick={() => handleDialogResponse(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold"
                            >
                                Yes, verify now
                            </motion.button>
                            <motion.button
                                variants={buttonHover} whileHover="hover"
                                onClick={() => handleDialogResponse(true)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold"
                            >
                                No, I will add Questions separately
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}

            <input ref={questionFileInputRef} type="file" accept="image/jpeg,image/png,image/gif" onChange={(e) => handleFileUpload(e, 'question')} className="hidden" />
            <input ref={answerFileInputRef} type="file" accept="image/jpeg,image/png,image/gif" onChange={(e) => handleFileUpload(e, 'answer')} className="hidden" />
            <input ref={questionCameraInputRef} type="file" accept="image/*" capture="environment" onChange={(e) => handleCameraInput(e, 'question')} className="hidden" />
            <input ref={answerCameraInputRef} type="file" accept="image/*" capture="environment" onChange={(e) => handleCameraInput(e, 'answer')} className="hidden" />

            <style jsx global>{`
        .math-field {
          display: inline-block;
          padding: 1px;
          background: rgba(59, 130, 246, 0.08);
        }
        .mq-editable-field {
          border: none;
        }
      `}</style>
        </>
    );
}