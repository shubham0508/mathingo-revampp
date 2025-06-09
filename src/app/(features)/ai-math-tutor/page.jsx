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
    FileText,
    Pencil,
} from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { createFileData, validateFile, dataURLtoFile } from '@/lib/fileUtils';
import MathKeyboard from '@/components/shared/SuperInputBox/math-keyboard';
import FilePreviews from '@/components/shared/SuperInputBox/file-previews';
import { useGuestUserAuth } from '@/hooks/useGuestUserAuth';
import { getErrorMessage } from '@/lib/utils';
import toast from 'react-hot-toast';
import { satExamples } from '@/config/constant';
// import TLDrawWhiteboard from '@/components/shared/SuperInputBox/tldraw'; // Replaced by StylusDrawComponent
import Image from 'next/image';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAiExtractQuestionMutation } from '@/store/slices/AMT';
import { resetAnswer, resetQuestion, setAnswer, setQuestion } from '@/store/reducers/AMT';
import StylusDrawComponentImport from '@/components/shared/SuperInputBox/StylusComponent';

export default function AIMathTutorPage() {
    const examples = [
        'Find the integral of sin(x)',
        'Factor: x² - 5x + 6',
        'Derivative of 2x³ + 4x',
        'More Examples',
    ];

    const [text, setText] = useState('');
    const [files, setFiles] = useState([]);
    const [stylusDrawingDataHasContent, setStylusDrawingDataHasContent] = useState(false); // Stores boolean for stylus content
    const [activeInputMode, setActiveInputMode] = useState('buttons');

    const [isTextDragging, setIsTextDragging] = useState(false);
    const [showMathKeyboard, setShowMathKeyboard] = useState(false);
    const [mathQuillActiveTab, setMathQuillActiveTab] = useState('ΣΠ');
    const [activeField, setActiveField] = useState(null);
    const [mathQuillInitialized, setMathQuillInitialized] = useState(false);
    const [showExamplesModal, setShowExamplesModal] = useState(false);
    const [actionAfterModeSwitch, setActionAfterModeSwitch] = useState(null);
    const [isUploadingS3, setIsUploadingS3] = useState(false);

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const dropAreaRef = useRef(null);
    const editorRef = useRef(null);
    const MQRef = useRef(null);
    const stylusDrawRef = useRef(null); // Renamed from tldrawEditorRef

    const [extractQuestionAndAnswers, { data: promptList, isLoading: isExtractingApi, error: extractionApiError }] = useAiExtractQuestionMutation();
    const { ensureAuthenticated } = useGuestUserAuth();
    const router = useRouter();
    const dispatch = useDispatch();
    const MODEL_NAME = 'alpha';

    const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
    const buttonHover = { rest: { scale: 1 }, hover: { scale: 1.05, transition: { duration: 0.2 } } };
    const staggerChildren = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

    const hasTextContent = text.trim().length > 0;
    const hasFileContent = files.length > 0;
    const hasStylusContent = stylusDrawingDataHasContent; // Directly use the boolean state

    const overallIsProcessing = isUploadingS3 || isExtractingApi;

    let currentModeHasContentForSubmission = false;
    if (activeInputMode === 'buttons') {
        currentModeHasContentForSubmission = hasTextContent || hasFileContent;
    } else if (activeInputMode === 'stylus') {
        currentModeHasContentForSubmission = hasStylusContent;
    }

    const submitButtonDisabled = overallIsProcessing || !currentModeHasContentForSubmission;

    const canClearCurrentModeContent = !overallIsProcessing && (
        (activeInputMode === 'buttons' && (hasTextContent || hasFileContent)) ||
        (activeInputMode === 'stylus' && hasStylusContent)
    );

    const updateContent = useCallback(() => {
        if (!editorRef.current || !MQRef.current) return;
        let fullContent = '';
        editorRef.current.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                fullContent += node.textContent;
            } else if (node.classList?.contains('math-field')) {
                const mathFieldInstance = MQRef.current.MathField(node.querySelector('span'));
                if (mathFieldInstance) {
                    fullContent += ` ${mathFieldInstance.latex()} `;
                }
            } else {
                fullContent += node.textContent;
            }
        });
        setText(fullContent.trim());
    }, []);

    const handleEditorInput = useCallback(() => {
        updateContent();
        if (editorRef.current && editorRef.current.textContent.trim().length > 0 && !hasFileContent) {
            setShowMathKeyboard(true);
        } else if (editorRef.current && editorRef.current.textContent.trim().length === 0) {
            setShowMathKeyboard(false);
        }
    }, [hasFileContent, updateContent]);

    const initEditor = useCallback(() => {
        if (typeof window !== 'undefined' && window.MathQuill && editorRef.current && !mathQuillInitialized) {
            try {
                MQRef.current = window.MathQuill.getInterface(2);
                setMathQuillInitialized(true);
                editorRef.current.addEventListener('input', handleEditorInput);
            } catch (error) {
                console.error("Failed to initialize MathQuill editor:", error);
                toast.error("Math editor could not be loaded.");
            }
        }
    }, [mathQuillInitialized, handleEditorInput]);


    useEffect(() => {
        if (isExtractingApi) {
            toast.loading('Analyzing your input...', { id: 'extraction-toast' });
        } else {
            toast.dismiss('extraction-toast');
        }
    }, [isExtractingApi]);

    useEffect(()=>{
        dispatch(resetAnswer())
        dispatch(resetQuestion())
    },[])

    useEffect(() => {
        if (extractionApiError) {
            toast.error(getErrorMessage(extractionApiError.data?.error || extractionApiError.data) || "Analysis failed. Please try again.", { id: 'extraction-toast' });
        }
    }, [extractionApiError]);

    useEffect(() => {
        if (promptList) {
            toast.dismiss('extraction-toast');
            if (promptList?.status_code === 201) {
                dispatch(setQuestion(promptList?.data));
                if (
                    promptList?.data?.files?.length === 1 &&
                    promptList?.data?.files[0]?.pages[0]?.questions?.length === 1
                ) {
                    dispatch(
                        setAnswer({
                            fileId: promptList?.data?.files[0]?.file_id,
                            question: promptList?.data?.files[0]?.pages[0]?.questions,
                            question_url: promptList?.data?.files[0]?.file_url || 'no_input',
                            question_difficulty_level: promptList?.data?.files[0]?.pages[0]?.question_difficulty_level,
                            question_id: promptList?.data?.files[0]?.pages[0]?.question_id
                        })
                    );
                    router.push("/ai-math-tutor/select-questions/ai-tutor-solution");
                } else {
                    router.push("/ai-math-tutor/select-questions");
                }
                toast.success('Analysis complete! Redirecting...', { duration: 2000 });
            } else if (promptList?.status_code === 200 && promptList?.error_code === "E001") {
                const errorMsg = promptList.error?.[0] || "Please provide valid math questions only";
                toast.error(errorMsg);
            } else if (promptList?.status_code === 200 && promptList?.error_code === "E002") {
                const errorMsg = promptList.error?.[0] || "An issue occurred with your input.";
                toast.error(errorMsg);
            } else {
                toast.error(promptList?.message || "Something went wrong! Please try again later");
            }
        }
    }, [promptList, dispatch, router]);

    useEffect(() => {
        if (activeInputMode === 'buttons' && actionAfterModeSwitch) {
            if (actionAfterModeSwitch === 'upload' && fileInputRef.current) {
                fileInputRef.current.click();
            } else if (actionAfterModeSwitch === 'camera' && cameraInputRef.current) {
                cameraInputRef.current.click();
            }
            setActionAfterModeSwitch(null);
        }
    }, [activeInputMode, actionAfterModeSwitch]);

    useEffect(() => {
        const loadMathQuill = async () => {
            if (typeof window === 'undefined' || mathQuillInitialized || activeInputMode !== 'buttons' || hasFileContent) return;

            if (!window.jQuery) {
                const jqueryScript = document.createElement('script');
                jqueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
                jqueryScript.async = true;
                jqueryScript.onload = () => { loadMathQuillScripts(); };
                jqueryScript.onerror = () => { console.error("Failed to load jQuery."); toast.error("Math editor dependency failed (jQuery)."); };
                document.body.appendChild(jqueryScript);
            } else {
                loadMathQuillScripts();
            }
        };

        const loadMathQuillScripts = () => {
            const mathquillScript = document.createElement('script');
            mathquillScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.js';
            mathquillScript.async = true;
            document.body.appendChild(mathquillScript);

            const mathquillCSS = document.createElement('link');
            mathquillCSS.rel = 'stylesheet';
            mathquillCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.css';
            document.head.appendChild(mathquillCSS);

            mathquillScript.onload = initEditor;
            mathquillScript.onerror = () => { console.error("Failed to load MathQuill JS."); toast.error("Math editor failed to load."); };
        }

        if (activeInputMode === 'buttons' && !hasFileContent && !mathQuillInitialized) {
            loadMathQuill();
        }

        const handleClick = (e) => {
            if (editorRef.current && !editorRef.current.contains(e.target) && !e.target.closest('.math-keyboard-container')) {
                const activeMathField = document.querySelector('.mq-focused');
                if (activeMathField && MQRef.current) {
                    const mqInstance = MQRef.current.MathField(activeMathField);
                    if (mqInstance) mqInstance.blur();
                }
                setActiveField(null);
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [mathQuillInitialized, activeInputMode, hasFileContent, initEditor]);


    const placeCaretAfter = useCallback((node) => {
        if (!window.getSelection) return;
        const range = document.createRange();
        const sel = window.getSelection();
        if (!sel) return;
        range.setStartAfter(node);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        if (editorRef.current) editorRef.current.focus();
    }, []);

    const insertMathFieldAtCaret = useCallback((latex = '') => {
        const editor = editorRef.current;
        if (!editor || !MQRef.current || activeInputMode !== 'buttons' || hasFileContent) return;

        const span = document.createElement('span');
        span.className = 'math-field';
        span.setAttribute('contenteditable', 'false');
        const innerSpan = document.createElement('span');
        span.appendChild(innerSpan);

        let mathField;
        try {
            mathField = MQRef.current.MathField(innerSpan, {
                handlers: {
                    edit: () => { if (mathField) setActiveField(mathField); updateContent(); },
                },
            });
            mathField.latex(latex);
            setActiveField(mathField);
        } catch (error) {
            console.error("Error creating MathField:", error);
            toast.error("Could not create math input field.");
            return;
        }

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (editor.contains(range.commonAncestorContainer)) {
                range.deleteContents();
                range.insertNode(span);
                const space = document.createTextNode('\u200B');
                range.insertNode(space);
                placeCaretAfter(space);
            } else {
                editor.appendChild(span);
                const space = document.createTextNode('\u200B');
                editor.appendChild(space);
                placeCaretAfter(space);
            }
        } else {
            editor.appendChild(span);
            const space = document.createTextNode('\u200B');
            editor.appendChild(space);
            placeCaretAfter(space);
        }
        updateContent();
        if (mathField) mathField.focus();
    }, [updateContent, placeCaretAfter, activeInputMode, hasFileContent]);

    const handleEditorKeyDown = (e) => {
        if (activeInputMode !== 'buttons' || hasFileContent || overallIsProcessing) return;
        if (e.key === '`' || e.key === '$' || e.key === '\\') {
            if (!MQRef.current) {
                toast.error("Math editor is not ready. Please wait.", { id: 'mq-not-ready' });
                e.preventDefault();
                return;
            }
            e.preventDefault();
            insertMathFieldAtCaret();
        }
    };
    const sharedKeyboardActionGuard = () => activeInputMode !== 'buttons' || hasFileContent || overallIsProcessing || !MQRef.current;

    const insertSymbol = useCallback((symbol) => {
        if (sharedKeyboardActionGuard()) {
            if (!MQRef.current) toast.error("Math editor is not ready.", { id: 'mq-not-ready-symbol' });
            return;
        }
        if (activeField && typeof activeField.write === 'function') {
            if (symbol.startsWith('\\')) activeField.write(symbol);
            else activeField.typedText(symbol);
            activeField.focus();
        } else {
            insertMathFieldAtCaret(symbol);
        }
        updateContent();
    }, [activeField, insertMathFieldAtCaret, updateContent, activeInputMode, hasFileContent, overallIsProcessing]);

    const insertCommand = useCallback((cmd) => {
        if (sharedKeyboardActionGuard()) {
            if (!MQRef.current) toast.error("Math editor is not ready.", { id: 'mq-not-ready-cmd' });
            return;
        }
        if (activeField && typeof activeField.cmd === 'function') {
            activeField.cmd(cmd.startsWith('\\') ? cmd : `\\${cmd}`);
            activeField.focus();
        } else {
            const cmdLatex = cmd === 'frac' ? '\\frac{}{}' : cmd === 'sqrt' ? '\\sqrt{}' : cmd === 'nthroot' ? '\\sqrt[]{}' : `\\${cmd}{}`;
            insertMathFieldAtCaret(cmdLatex);
        }
        updateContent();
    }, [activeField, insertMathFieldAtCaret, updateContent, activeInputMode, hasFileContent, overallIsProcessing]);

    const insertExponent = useCallback((exp) => {
        if (sharedKeyboardActionGuard()) {
            if (!MQRef.current) toast.error("Math editor is not ready.", { id: 'mq-not-ready-exp' });
            return;
        }
        if (activeField && typeof activeField.typedText === 'function') {
            activeField.typedText(exp === '^2' ? '^2' : '^');
            activeField.focus();
        } else {
            insertMathFieldAtCaret(exp === '^2' ? 'x^2' : 'x^{}');
        }
        updateContent();
    }, [activeField, insertMathFieldAtCaret, updateContent, activeInputMode, hasFileContent, overallIsProcessing]);

    const insertSubscript = useCallback(() => {
        if (sharedKeyboardActionGuard()) {
            if (!MQRef.current) toast.error("Math editor is not ready.", { id: 'mq-not-ready-sub' });
            return;
        }
        if (activeField && typeof activeField.typedText === 'function') {
            activeField.typedText('_');
            activeField.focus();
        } else {
            insertMathFieldAtCaret('x_{}');
        }
        updateContent();
    }, [activeField, insertMathFieldAtCaret, updateContent, activeInputMode, hasFileContent, overallIsProcessing]);

    const insertComplexExpression = useCallback((latexTemplate) => {
        if (sharedKeyboardActionGuard()) {
            if (!MQRef.current) toast.error("Math editor is not ready.", { id: 'mq-not-ready-complex' });
            return;
        }
        if (activeField && typeof activeField.write === 'function') {
            activeField.write(latexTemplate);
            activeField.focus();
        } else {
            insertMathFieldAtCaret(latexTemplate);
        }
        updateContent();
    }, [activeField, insertMathFieldAtCaret, updateContent, activeInputMode, hasFileContent, overallIsProcessing]);

    const handleFileUpload = useCallback((e) => {
        const newRawFiles = Array.from(e.target.files || []);
        if (newRawFiles.length === 0) return;

        if (files.length + newRawFiles.length > 5) {
            toast.error('Maximum 5 files can be uploaded');
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        const validFiles = newRawFiles.filter(file => {
            const validation = validateFile(file);
            if (!validation.isValid) {
                Object.values(validation.errors).forEach(errorMsg => toast.error(String(errorMsg)));
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) {
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        const filesData = validFiles.map(file => createFileData(file));
        setFiles(prev => [...prev, ...filesData]);
        setText('');
        if (editorRef.current) editorRef.current.innerHTML = '';
        setShowMathKeyboard(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [files]);

    const handleCameraInput = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) {
            if (cameraInputRef.current) cameraInputRef.current.value = "";
            return;
        }
        const validation = validateFile(file);
        if (!validation.isValid) {
            Object.values(validation.errors).forEach(errorMsg => toast.error(String(errorMsg)));
            if (cameraInputRef.current) cameraInputRef.current.value = "";
            return;
        }
        const fileData = createFileData(file);
        setFiles(prev => [...prev, fileData]);
        setText('');
        if (editorRef.current) editorRef.current.innerHTML = '';
        setShowMathKeyboard(false);
        if (cameraInputRef.current) cameraInputRef.current.value = "";
    }, []);

    const handleActualUploadClick = useCallback(() => {
        if (overallIsProcessing) return;
        if (activeInputMode === 'buttons') {
            if (hasTextContent) {
                toast.error('Please clear your typed text before uploading a file.');
                return;
            }
            fileInputRef.current?.click();
        } else if (activeInputMode === 'stylus') {
            if (hasStylusContent) {
                toast.error('Please clear stylus drawing first to upload a file.');
                return;
            }
            setActiveInputMode('buttons');
            setActionAfterModeSwitch('upload');
        }
    }, [overallIsProcessing, activeInputMode, hasTextContent, hasStylusContent]);

    const handleActualCameraClick = useCallback(() => {
        if (overallIsProcessing) return;
        if (activeInputMode === 'buttons') {
            if (hasTextContent) {
                toast.error('Please clear your typed text before using the camera.');
                return;
            }
            cameraInputRef.current?.click();
        } else if (activeInputMode === 'stylus') {
            if (hasStylusContent) {
                toast.error('Please clear stylus drawing first to use the camera.');
                return;
            }
            setActiveInputMode('buttons');
            setActionAfterModeSwitch('camera');
        }
    }, [overallIsProcessing, activeInputMode, hasTextContent, hasStylusContent]);

    const removeFile = useCallback((fileIdToRemove) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileIdToRemove));
    }, []);

    const toggleMathKeyboard = () => setShowMathKeyboard(!showMathKeyboard);

    const handleClearContent = () => {
        if (overallIsProcessing) return;
        if (activeInputMode === 'buttons') {
            setText('');
            if (editorRef.current) editorRef.current.innerHTML = '';
            setFiles([]);
            setActiveField(null);
            setShowMathKeyboard(false);
        } else if (activeInputMode === 'stylus') {
            stylusDrawRef.current?.resetDocument(); // This will trigger onContentChange in StylusDrawComponent
            // setStylusDrawingDataHasContent(false); // Handled by onContentChange
        }
    };

    const switchToTextMode = () => {
        if (overallIsProcessing || activeInputMode === 'buttons') return;
        if (hasStylusContent) {
            toast.error('Please clear stylus drawing first to switch to Text/File input.');
            return;
        }
        setActiveInputMode('buttons');
        setStylusDrawingDataHasContent(false); // Explicitly clear if stylus was active but no content
    };

    const switchToStylusMode = () => {
        if (overallIsProcessing || activeInputMode === 'stylus') return;
        if (hasTextContent || hasFileContent) {
            toast.error('Please clear text or remove files first to use stylus.');
            return;
        }
        setActiveInputMode('stylus');
        // Clear text/file states
        setText('');
        setFiles([]);
        if (editorRef.current) editorRef.current.innerHTML = '';
        setShowMathKeyboard(false);
    };

    useEffect(() => {
        const dropArea = dropAreaRef.current;
        if (!dropArea || activeInputMode !== 'buttons' || hasTextContent || overallIsProcessing) {
            if (isTextDragging) setIsTextDragging(false);
            return;
        }
        const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsTextDragging(true); };
        const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsTextDragging(false); };
        const handleDrop = (e) => {
            e.preventDefault(); e.stopPropagation(); setIsTextDragging(false);
            if (overallIsProcessing) {
                toast.error("Cannot drop files while processing.");
                return;
            }
            if (hasTextContent) {
                toast.error('Please clear text input before dropping files.');
                return;
            }
            const droppedFiles = Array.from(e.dataTransfer?.files || []);
            if (droppedFiles.length > 0) {
                const eventLike = { target: { files: droppedFiles } };
                handleFileUpload(eventLike);
            }
        };
        dropArea.addEventListener('dragover', handleDragOver);
        dropArea.addEventListener('dragleave', handleDragLeave);
        dropArea.addEventListener('drop', handleDrop);
        return () => {
            if (dropArea) {
                dropArea.removeEventListener('dragover', handleDragOver);
                dropArea.removeEventListener('dragleave', handleDragLeave);
                dropArea.removeEventListener('drop', handleDrop);
            }
        };
    }, [activeInputMode, handleFileUpload, hasTextContent, overallIsProcessing, isTextDragging]);

    const handlePaste = useCallback(async (e) => {
        if (activeInputMode !== 'buttons' || hasFileContent || overallIsProcessing) {
            if (hasFileContent) toast.error("Pasting text is disabled when files are present. Clear files to paste text.");
            e.preventDefault();
            return;
        }
        e.preventDefault();
        const clipboardData = e.clipboardData;
        if (!clipboardData) return;

        const items = clipboardData.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    toast.error("Pasting images directly is not supported. Please use the Upload or Snap feature for images.");
                    return;
                }
            }
        }
        const pastedText = clipboardData.getData('text/plain');
        if (!pastedText) return;

        if (pastedText.length > 2000) {
            toast.error("Pasted text is too long. Maximum 2000 characters.");
            return;
        }
        if (editorRef.current) {
            if (activeField && typeof activeField.write === 'function' && document.activeElement?.closest('.math-field')) {
                if (pastedText.includes('\\') || pastedText.includes('$') || pastedText.includes('^') || pastedText.includes('_')) {
                    activeField.write(pastedText);
                } else {
                    activeField.typedText(pastedText);
                }
                activeField.focus();
            } else {
                document.execCommand('insertText', false, pastedText);
            }
            updateContent();
            if (editorRef.current.textContent.trim().length > 0) setShowMathKeyboard(true);
        }
    }, [activeInputMode, overallIsProcessing, hasFileContent, activeField, updateContent]);

    const handleStylusHasContentChange = useCallback((currentHasContent) => {
        setStylusDrawingDataHasContent(currentHasContent);

        if (currentHasContent) {
            // If stylus drawing gets content, clear other input modes
            setText('');
            setFiles([]);
            if (editorRef.current) editorRef.current.innerHTML = '';
            setShowMathKeyboard(false);
        }
    }, []);

    const performS3Upload = async (filesToUpload, s3UploadType = 'RTT') => {
        const formData = new FormData();
        formData.append('type', s3UploadType);
        filesToUpload.forEach(fileItem => formData.append('files', fileItem.file ? fileItem.file : fileItem));

        try {
            const response = await fetch('/api/s3/upload', { method: 'POST', body: formData });
            const result = await response.json();
            if (!response.ok || !result?.success) {
                return { success: false, message: result?.message || `Upload failed with status ${response.status}` };
            }
            return { success: true, files: result.files, message: 'Upload successful' };
        } catch (err) {
            console.error("S3 Upload API error:", err);
            return { success: false, message: getErrorMessage(err) || 'Network error during upload.' };
        }
    };

    const handleSubmit = async () => {
        if (overallIsProcessing || submitButtonDisabled) return;

        let authToastId;
        try {
            authToastId = toast.loading("Authenticating...");
            const isReady = await ensureAuthenticated();
            if (!isReady) {
                toast.error('Authentication failed. Please try again.', { id: authToastId });
                return;
            }
            toast.success('Authenticated!', { id: authToastId });

            let filesDataForApi = [];
            let s3UploadPerformed = false;

            if (activeInputMode === 'buttons') {
                if (hasFileContent) {
                    setIsUploadingS3(true);
                    const s3ToastId = toast.loading('Uploading files...');
                    const uploadResult = await performS3Upload(files);
                    setIsUploadingS3(false);

                    if (!uploadResult.success) {
                        toast.error(uploadResult.message || 'File upload failed.', { id: s3ToastId });
                        return;
                    }
                    toast.success('Files uploaded successfully!', { id: s3ToastId });
                    filesDataForApi = uploadResult.files.map(({ originalName, fileKey }) => ({
                        input_type: originalName?.toLowerCase().includes('.pdf') ? 'pdf' : 'image',
                        file_url: fileKey,
                        data: '',
                    }));
                    s3UploadPerformed = true;
                } else if (hasTextContent) {
                    filesDataForApi = [{
                        data: text,
                        input_type: 'text',
                        file_url: 'no_file_text_input',
                    }];
                }
            } else if (activeInputMode === 'stylus' && hasStylusContent) {
                const drawingDataUrl = await stylusDrawRef.current?.exportDrawing();
                if (!drawingDataUrl) {
                    toast.error("Could not process drawing data. Please try again.");
                    return;
                }

                const drawingFile = dataURLtoFile(drawingDataUrl, `stylus_drawing_${Date.now()}.png`);
                if (!drawingFile) {
                    toast.error("Could not process drawing data. Please try again.");
                    return;
                }

                setIsUploadingS3(true);
                const s3ToastId = toast.loading('Uploading drawing...');
                const uploadResult = await performS3Upload([drawingFile]);
                setIsUploadingS3(false);

                if (!uploadResult.success) {
                    toast.error(uploadResult.message || 'Drawing upload failed.', { id: s3ToastId });
                    return;
                }
                toast.success('Drawing uploaded successfully!', { id: s3ToastId });
                filesDataForApi = uploadResult.files.map(({ fileKey }) => ({
                    input_type: 'image',
                    file_url: fileKey,
                    data: '',
                }));
                s3UploadPerformed = true;
            }

            if (filesDataForApi.length > 0) {
                extractQuestionAndAnswers({ model_name: MODEL_NAME, inputs: filesDataForApi });
                setText('');
                if (editorRef.current) editorRef.current.innerHTML = '';
                setFiles([]);
                // setStylusDrawingDataHasContent(false); // This will be handled by resetDocument -> onContentChange
                if (stylusDrawRef.current?.resetDocument) {
                    stylusDrawRef.current.resetDocument();
                }
                setShowMathKeyboard(false);
                setActiveField(null);

            } else if (!s3UploadPerformed) { // Only show this if no upload attempt was made and no text.
                toast.error('No content to submit.');
            }

        } catch (error) {
            console.error('Submission error:', error);
            toast.error(getErrorMessage(error) || 'An unexpected error occurred during submission.');
            if (authToastId) toast.dismiss(authToastId);
            setIsUploadingS3(false);
        }
    };

    const handleExampleClick = (example) => {
        if (overallIsProcessing) { toast.error("Cannot select example while processing."); return; }
        if (hasTextContent || hasFileContent || hasStylusContent) {
            toast.error("Please clear your current input to use an example.");
            return;
        }
        if (example === 'More Examples') {
            setShowExamplesModal(true);
            return;
        }
        setActiveInputMode('buttons'); // Examples are text-based
        setFiles([]);
        // setStylusDrawingDataHasContent(false); // Will be false due to above checks, or handle explicitly if needed
        if (stylusDrawRef.current?.hasContent && stylusDrawRef.current?.resetDocument) { // Check if stylus had content
            stylusDrawRef.current.resetDocument(); // This will also trigger onContentChange
        } else {
            setStylusDrawingDataHasContent(false); // Ensure it's false
        }


        if (editorRef.current) {
            editorRef.current.innerHTML = '';
            editorRef.current.textContent = example;
            updateContent();
            if (example.trim().length > 0) setShowMathKeyboard(true);
            editorRef.current.focus();
        }
    };

    const handleModalExampleClick = (example) => {
        if (overallIsProcessing) { toast.error("Cannot select example while processing."); setShowExamplesModal(false); return; }
        if (hasTextContent || hasFileContent || hasStylusContent) {
            toast.error("Please clear your current input to use an example.");
            setShowExamplesModal(false);
            return;
        }
        setActiveInputMode('buttons');
        setFiles([]);
        if (stylusDrawRef.current?.hasContent && stylusDrawRef.current?.resetDocument) {
            stylusDrawRef.current.resetDocument();
        } else {
            setStylusDrawingDataHasContent(false);
        }

        if (editorRef.current) {
            editorRef.current.innerHTML = '';
            editorRef.current.textContent = example;
            updateContent();
            if (example.trim().length > 0) setShowMathKeyboard(true);
            editorRef.current.focus();
        }
        setShowExamplesModal(false);
    };

    useEffect(() => {
        if (editorRef.current) {
            const editorDisabled = activeInputMode !== 'buttons' || hasFileContent || overallIsProcessing;
            editorRef.current.setAttribute('contenteditable', String(!editorDisabled));
            editorRef.current.style.pointerEvents = editorDisabled ? 'none' : 'auto';
            editorRef.current.style.opacity = editorDisabled ? '0.7' : '1';
            if (editorDisabled && document.activeElement === editorRef.current) {
                editorRef.current.blur();
            }
        }
    }, [activeInputMode, hasFileContent, overallIsProcessing]);

    const exampleButtonsDisabled = overallIsProcessing || hasTextContent || hasFileContent || hasStylusContent;

    return (
        <>
            <Head>
                <title>AI Math Tutor - Solve Math Problems with AI</title>
                <meta name="description" content="Our AI Math Tutor helps you solve complex math problems. Type, upload, or draw your problem for step-by-step solutions and guidance." />
                <meta name="keywords" content="ai math tutor, math problem solver, stylus math input, online math help, homework assistance, algebra, calculus, geometry, math OCR" />
                <link rel="canonical" href="https://www.mathzai.com/ai-math-tutor" />
            </Head>

            <div className="flex flex-row justify-center w-full min-h-screen">
                <div className="w-full flex flex-col items-center p-4 sm:p-8">
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="bg-gradient-secondary bg-clip-text text-transparent font-black text-3xl sm:text-4xl font-roca text-center"
                    >
                        AI Math Tutor
                    </motion.h1>

                    <motion.h2
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="relative mt-4 text-heading-ha text-lg sm:text-xl font-semibold text-center"
                    >
                        You solve, I'll jump in when needed!
                    </motion.h2>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="mt-8 w-2/3 rounded-lg bg-white"
                        style={{ boxShadow: '0 1px 5px rgba(66, 85, 255, 1)' }}
                    >
                        <motion.div
                            className="absolute left-64 top-2"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <Image
                                src="/images/icons/ai_tutor-right.png"
                                alt="MathzAI Tutor"
                                width={150}
                                height={150}
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                        <div className="p-4 sm:p-6">
                            <TooltipProvider delayDuration={100}>
                                <div
                                    ref={activeInputMode === 'buttons' ? dropAreaRef : null}
                                    className={`w-full min-h-[250px] rounded-md border-2 border-dashed ${isTextDragging && activeInputMode === 'buttons' && !hasTextContent && !overallIsProcessing ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} flex flex-col justify-between p-4 sm:p-6 relative`}
                                >
                                    {canClearCurrentModeContent && (
                                        <motion.div
                                            variants={buttonHover} initial="rest" whileHover="hover"
                                            className="absolute top-2 right-2 z-20 flex items-center justify-center p-2 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-full cursor-pointer transition-colors"
                                            onClick={handleClearContent}
                                            title="Clear current input"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.div>
                                    )}

                                    {activeInputMode === 'buttons' && (
                                        <motion.div key="buttons-input-area" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col flex-1 h-full">
                                            <FilePreviews files={files} removeFile={removeFile} disabled={overallIsProcessing} />
                                            <div className="flex flex-col flex-1">
                                                <div
                                                    ref={editorRef}
                                                    className="flex-1 outline-none relative p-2"
                                                    onKeyDown={handleEditorKeyDown}
                                                    onPaste={handlePaste}
                                                    style={{ minHeight: files.length > 0 ? '20px' : '60px' }}
                                                    aria-label="Math problem input area"
                                                    role="textbox"
                                                    aria-multiline="true"
                                                />
                                                {!hasTextContent && !hasFileContent && !overallIsProcessing && (
                                                    <div className="absolute inset-0 text-gray-500 text-sm pointer-events-none p-8">
                                                        <span>Try writing '2x + 5 = 15' or give me a photo of your problem.</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeInputMode === 'stylus' && (
                                        <motion.div key="stylus-input-area" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full">
                                            <StylusDrawComponentImport
                                                ref={stylusDrawRef}
                                                onContentChange={handleStylusHasContentChange}
                                                height="200px" // Matches the default, can be adjusted
                                            />
                                        </motion.div>
                                    )}
                                    <div className="flex flex-wrap gap-2 justify-between items-center mt-4">
                                        <div className="flex gap-2 flex-wrap">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <motion.button
                                                        aria-label="Upload file"
                                                        variants={buttonHover} initial="rest" whileHover="hover"
                                                        className={`flex items-center justify-center w-9 h-9 rounded-md border-none 
                                                            ${(overallIsProcessing || (activeInputMode === 'buttons' && hasTextContent) || (activeInputMode === 'stylus' && hasStylusContent && !actionAfterModeSwitch))
                                                                ? 'bg-gray-300 text-gray-500 opacity-60 cursor-not-allowed'
                                                                : 'bg-[#F0F2FF] text-primary hover:bg-indigo-100'}`}
                                                        onClick={handleActualUploadClick}
                                                        disabled={overallIsProcessing || (activeInputMode === 'buttons' && hasTextContent) || (activeInputMode === 'stylus' && hasStylusContent && !actionAfterModeSwitch)}
                                                    > <Upload className="w-4 h-4" /> </motion.button>
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-black text-white"><p>Upload file</p></TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <motion.button
                                                        aria-label="Snap with camera"
                                                        variants={buttonHover} initial="rest" whileHover="hover"
                                                        className={`flex items-center justify-center w-9 h-9 rounded-md border-none
                                                            ${(overallIsProcessing || (activeInputMode === 'buttons' && hasTextContent) || (activeInputMode === 'stylus' && hasStylusContent && !actionAfterModeSwitch))
                                                                ? 'bg-gray-300 text-gray-500 opacity-60 cursor-not-allowed'
                                                                : 'bg-[#F0F2FF] text-primary hover:bg-indigo-100'}`}
                                                        onClick={handleActualCameraClick}
                                                        disabled={overallIsProcessing || (activeInputMode === 'buttons' && hasTextContent) || (activeInputMode === 'stylus' && hasStylusContent && !actionAfterModeSwitch)}
                                                    > <Camera className="w-4 h-4" /> </motion.button>
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-black text-white"><p>Snap with camera</p></TooltipContent>
                                            </Tooltip>

                                            {activeInputMode === 'stylus' && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <motion.button
                                                            aria-label="Switch to text or file input"
                                                            variants={buttonHover} initial="rest" whileHover="hover"
                                                            className={`flex items-center gap-2 h-9 font-medium rounded-md border-none px-3
                                                                ${(overallIsProcessing || (activeInputMode === 'stylus' && hasStylusContent))
                                                                    ? 'bg-gray-300 text-gray-500 opacity-60 cursor-not-allowed'
                                                                    : 'bg-[#F0F2FF] text-primary hover:bg-indigo-100'}`}
                                                            onClick={switchToTextMode}
                                                            disabled={overallIsProcessing || (activeInputMode === 'stylus' && hasStylusContent)}
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                        </motion.button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-black text-white"><p>Text</p></TooltipContent>
                                                </Tooltip>
                                            )}
                                            {activeInputMode === 'buttons' && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <motion.button
                                                            aria-label="Write with stylus"
                                                            variants={buttonHover} initial="rest" whileHover="hover"
                                                            className={`flex items-center gap-2 h-9 font-medium rounded-md border-none px-3
                                                                ${(overallIsProcessing || (activeInputMode === 'buttons' && (hasTextContent || hasFileContent)))
                                                                    ? 'bg-gray-300 text-gray-500 opacity-60 cursor-not-allowed'
                                                                    : 'bg-[#F0F2FF] text-primary hover:bg-indigo-100'
                                                                }`}
                                                            onClick={switchToStylusMode}
                                                            disabled={overallIsProcessing || (activeInputMode === 'buttons' && (hasTextContent || hasFileContent))}
                                                        > <Pencil className="w-4 h-4" />Write with stylus</motion.button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-black text-white"><p>Write with stylus</p></TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                        <motion.button
                                            aria-label="Submit problem"
                                            variants={buttonHover} initial="rest" whileHover="hover" whileTap={{ scale: 0.95 }}
                                            className={`flex items-center gap-1 
                                                ${submitButtonDisabled ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-primary hover:bg-blue-700'} 
                                                text-white font-medium rounded-md h-10 px-4 sm:px-6 shadow-md transition-all`}
                                            onClick={handleSubmit}
                                            disabled={submitButtonDisabled}
                                        >
                                            {overallIsProcessing ? (
                                                <><LoaderCircle className="size-5 mr-2 animate-spin" /> Processing...</>
                                            ) : (
                                                <>Submit <span className="hidden sm:inline">and Learn</span> <ChevronRight className="w-5 h-5" /></>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </TooltipProvider>

                            {activeInputMode === 'buttons' && showMathKeyboard && !hasFileContent && hasTextContent && !overallIsProcessing && (
                                <div className="relative mt-4 border-t border-gray-200 pt-4 math-keyboard-container">
                                    <button
                                        aria-label="Close math keyboard"
                                        className="absolute right-0 -top-3 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1 z-10 transition-colors"
                                        onClick={toggleMathKeyboard} title="Close Math Keyboard"
                                    > <X className="w-4 h-4" /> </button>
                                    <MathKeyboard
                                        activeTab={mathQuillActiveTab}
                                        setActiveTab={setMathQuillActiveTab}
                                        insertSymbol={insertSymbol}
                                        insertCommand={insertCommand}
                                        insertExponent={insertExponent}
                                        insertSubscript={insertSubscript}
                                        insertComplexExpression={insertComplexExpression}
                                        disabled={overallIsProcessing || hasFileContent || !mathQuillInitialized}
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div initial="hidden" animate="visible" variants={staggerChildren} className="mt-10 flex flex-col items-center w-full px-4">
                        <motion.div variants={fadeIn} className="font-medium text-gray-700 text-base mb-4 text-center">
                            ✨ Ready to solve? Try these popular examples with me
                        </motion.div>
                        <motion.div variants={staggerChildren} className="flex flex-wrap gap-3 justify-center">
                            {examples.map((example, index) => (
                                <motion.button
                                    key={index} variants={fadeIn}
                                    whileHover={{ scale: 1.05, backgroundColor: example === 'More Examples' ? '#e5e7eb' : '#ddeeff', transition: { duration: 0.2 } }}
                                    onClick={() => handleExampleClick(example)}
                                    className={`bg-gray-100 hover:bg-gray-200 font-semibold text-gray-800 text-sm shadow rounded-md border border-gray-300 py-2 px-4 transition-colors
                                        ${exampleButtonsDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} `}
                                    disabled={exampleButtonsDisabled}
                                >
                                    {example}
                                </motion.button>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {showExamplesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4" role="dialog" aria-modal="true" aria-labelledby="examples-modal-title">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 id="examples-modal-title" className="text-2xl font-bold text-gray-800">SAT Math Examples</h2>
                                <button aria-label="Close examples modal" onClick={() => setShowExamplesModal(false)} className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                {['beginner', 'intermediate', 'hard'].map(level => (
                                    <div key={level} className="space-y-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className={`w-3 h-3 rounded-full ${level === 'beginner' ? 'bg-green-500' : level === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                            <h3 className={`text-lg font-semibold ${level === 'beginner' ? 'text-green-700' : level === 'intermediate' ? 'text-yellow-700' : 'text-red-700'}`}>
                                                {level.charAt(0).toUpperCase() + level.slice(1)}
                                            </h3>
                                        </div>
                                        <div className="space-y-2">
                                            {satExamples[level].map((question, index) => (
                                                <motion.button
                                                    key={`${level}-${index}`}
                                                    whileHover={{ scale: 1.02, backgroundColor: level === 'beginner' ? '#f0fdf4' : level === 'intermediate' ? '#fffbeb' : '#fef2f2' }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleModalExampleClick(question)}
                                                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 text-sm text-gray-700
                                                        ${level === 'beginner' ? 'border-green-200 hover:border-green-300 hover:text-green-800' : level === 'intermediate' ? 'border-yellow-200 hover:border-yellow-300 hover:text-yellow-800' : 'border-red-200 hover:border-red-300 hover:text-red-800'}
                                                        ${exampleButtonsDisabled ? 'opacity-60 cursor-not-allowed' : ''} `}
                                                    disabled={exampleButtonsDisabled}
                                                >
                                                    {question}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {(exampleButtonsDisabled || overallIsProcessing) && (
                                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-amber-800 text-sm text-center">
                                        {overallIsProcessing ? "Processing your request. Please wait to select an example." : "Please clear your current input to select an example."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,application/pdf" onChange={handleFileUpload} className="hidden" multiple aria-hidden="true" />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleCameraInput} className="hidden" aria-hidden="true" />

            <style jsx global>{`
                .math-field { 
                    display: inline-block; 
                    padding: 1px 3px;
                    margin: 1px 0;
                    background: rgba(59, 130, 246, 0.08); 
                    border-radius: 3px;
                    font-family: 'Computer Modern', 'Latin Modern Math', serif;
                    min-width: 1ch; 
                }
                .mq-editable-field {
                    border: none !important; 
                    box-shadow: none !important;
                }
                .mq-focused, .math-field.mq-focused .mq-editable-field { 
                    background: rgba(59, 130, 246, 0.15) !important;
                }
                [contenteditable="true"]:focus {
                    outline: none;
                }
            `}</style>
        </>
    );
}