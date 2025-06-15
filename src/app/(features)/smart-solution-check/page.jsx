'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera,
    Upload,
    X,
    Trash2,
    LoaderCircle,
    Play,
    FileText,
    Image as ImageIcon,
    CheckCircle,
} from 'lucide-react';
import Head from 'next/head';
import Script from 'next/script';
import { createFileData, validateFile } from '@/lib/fileUtils';
import MathKeyboard from '@/components/shared/SuperInputBox/math-keyboard';
import FilePreviews from '@/components/shared/SuperInputBox/file-previews';
import toast from 'react-hot-toast';
import { siteConfig } from "@/config/site";
import { generateMetadata as generatePageMetadata } from '@/config/seo';
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/seoUtils';

// Sample examples data
const sampleExamples = [
    {
        id: 1,
        type: 'text',
        question: 'Find the derivative of f(x) = 3x² + 2x - 1',
        solution: 'f\'(x) = 6x + 2',
        category: 'Calculus'
    },
    {
        id: 2,
        type: 'text',
        question: 'Solve: 2x + 5 = 11',
        solution: 'x = 3',
        category: 'Algebra'
    },
    {
        id: 3,
        type: 'image',
        question: '/images/examples/quadratic-question.jpg',
        solution: '/images/examples/quadratic-solution.jpg',
        category: 'Algebra'
    },
    {
        id: 4,
        type: 'text',
        question: 'Integrate: ∫(2x + 3)dx',
        solution: 'x² + 3x + C',
        category: 'Calculus'
    },
];

export default function SmartSolutionCheck() {
    // State management
    const [solutionText, setSolutionText] = useState('');
    const [solutionFiles, setSolutionFiles] = useState([]);
    const [questionText, setQuestionText] = useState('');
    const [questionFiles, setQuestionFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [showMathKeyboard, setShowMathKeyboard] = useState(false);
    const [activeTab, setActiveTab] = useState('ΣΠ');
    const [activeField, setActiveField] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [currentInputType, setCurrentInputType] = useState('solution'); // 'solution' or 'question'

    // Refs
    const solutionFileInputRef = useRef(null);
    const solutionCameraInputRef = useRef(null);
    const questionFileInputRef = useRef(null);
    const questionCameraInputRef = useRef(null);
    const solutionDropAreaRef = useRef(null);
    const questionDropAreaRef = useRef(null);
    const solutionEditorRef = useRef(null);
    const questionEditorRef = useRef(null);
    const MQRef = useRef(null);

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const buttonHover = {
        rest: { scale: 1 },
        hover: { scale: 1.05, transition: { duration: 0.2 } },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
    };

    // MathQuill initialization
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

    const initEditor = useCallback(() => {
        if (typeof window !== 'undefined' && window.MathQuill) {
            MQRef.current = window.MathQuill.getInterface(2);
            setInitialized(true);
        }
    }, []);

    // Utility functions
    const getCurrentText = () => currentInputType === 'solution' ? solutionText : questionText;
    const getCurrentFiles = () => currentInputType === 'solution' ? solutionFiles : questionFiles;
    const getCurrentEditorRef = () => currentInputType === 'solution' ? solutionEditorRef : questionEditorRef;
    const setCurrentText = (text) => currentInputType === 'solution' ? setSolutionText(text) : setQuestionText(text);
    const setCurrentFiles = (files) => currentInputType === 'solution' ? setSolutionFiles(files) : setQuestionFiles(files);

    const updateContent = useCallback((inputType = currentInputType) => {
        const editorRef = inputType === 'solution' ? solutionEditorRef : questionEditorRef;
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

        const trimmedContent = fullContent.trim();
        if (inputType === 'solution') {
            setSolutionText(trimmedContent);
        } else {
            setQuestionText(trimmedContent);
        }
    }, [currentInputType]);

    // File handling
    const handleFileUpload = useCallback((e, inputType) => {
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length === 0) return;

        const currentFiles = inputType === 'solution' ? solutionFiles : questionFiles;
        const setFiles = inputType === 'solution' ? setSolutionFiles : setQuestionFiles;
        const setText = inputType === 'solution' ? setSolutionText : setQuestionText;
        const editorRef = inputType === 'solution' ? solutionEditorRef : questionEditorRef;
        const currentText = inputType === 'solution' ? solutionText : questionText;

        if (currentFiles.length + newFiles.length > 5) {
            toast.error('Maximum 5 files can be uploaded');
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

        if (currentText.trim().length > 0) {
            setText('');
            if (editorRef.current) editorRef.current.innerHTML = '';
        }
    }, [solutionFiles, questionFiles, solutionText, questionText]);

    const handleCameraInput = useCallback((e, inputType) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validation = validateFile(file);
        if (!validation.isValid) {
            Object.values(validation.errors).forEach((error) => toast.error(String(error)));
            return;
        }

        const fileData = createFileData(file);
        const setFiles = inputType === 'solution' ? setSolutionFiles : setQuestionFiles;
        const setText = inputType === 'solution' ? setSolutionText : setQuestionText;
        const editorRef = inputType === 'solution' ? solutionEditorRef : questionEditorRef;
        const currentText = inputType === 'solution' ? solutionText : questionText;

        setFiles((prev) => [...prev, fileData]);

        if (currentText.trim().length > 0) {
            setText('');
            if (editorRef.current) editorRef.current.innerHTML = '';
        }
    }, [solutionText, questionText]);

    const removeFile = useCallback((fileId, inputType) => {
        const setFiles = inputType === 'solution' ? setSolutionFiles : setQuestionFiles;
        setFiles((prev) => prev.filter((file) => file.id !== fileId));
    }, []);

    const handleClear = (inputType) => {
        const editorRef = inputType === 'solution' ? solutionEditorRef : questionEditorRef;
        const setText = inputType === 'solution' ? setSolutionText : setQuestionText;
        const setFiles = inputType === 'solution' ? setSolutionFiles : setQuestionFiles;

        if (editorRef.current) {
            editorRef.current.innerHTML = '';
            setText('');
        }
        setFiles([]);
    };

    // Math keyboard functions
    const insertSymbol = useCallback((symbol) => {
        if (activeField && document.activeElement.closest('.math-field')) {
            if (symbol.startsWith('\\')) {
                activeField.write(symbol);
            } else {
                activeField.typedText(symbol);
            }
            activeField.focus();
        }
        updateContent();
    }, [activeField, updateContent]);

    const insertCommand = useCallback((cmd) => {
        if (activeField && document.activeElement.closest('.math-field')) {
            switch (cmd) {
                case 'frac': activeField.cmd('\\frac'); break;
                case 'sqrt': activeField.cmd('\\sqrt'); break;
                case 'nthroot': activeField.cmd('\\nthroot'); break;
                case 'times': activeField.cmd('\\times'); break;
                case 'div': activeField.cmd('\\div'); break;
                default: activeField.cmd('\\' + cmd);
            }
            activeField.focus();
        }
        updateContent();
    }, [activeField, updateContent]);

    const insertExponent = useCallback((exp) => {
        if (activeField && document.activeElement.closest('.math-field')) {
            activeField.typedText(exp === '^2' ? '^2' : '^');
            activeField.focus();
        }
        updateContent();
    }, [activeField, updateContent]);

    const insertSubscript = useCallback(() => {
        if (activeField && document.activeElement.closest('.math-field')) {
            activeField.typedText('_');
            activeField.focus();
        }
        updateContent();
    }, [activeField, updateContent]);

    const insertComplexExpression = useCallback((latexTemplate) => {
        if (activeField && document.activeElement.closest('.math-field')) {
            activeField.write(latexTemplate);
            activeField.focus();
        }
        updateContent();
    }, [activeField, updateContent]);

    // Example handling
    const handleExampleClick = (example) => {
        if (example.type === 'text') {
            // Set solution
            setSolutionText(example.solution);
            if (solutionEditorRef.current) {
                solutionEditorRef.current.textContent = example.solution;
            }

            // Set question
            setQuestionText(example.question);
            if (questionEditorRef.current) {
                questionEditorRef.current.textContent = example.question;
            }
        }
        // For image examples, you would handle file loading here
        toast.success('Example loaded successfully!');
    };

    // Submit handlers
    const handleSolutionSubmit = () => {
        const hasSolution = solutionText.trim().length > 0 || solutionFiles.length > 0;

        if (!hasSolution) {
            toast.error('Please enter a solution or upload solution files');
            return;
        }

        setShowQuestionModal(true);
    };

    const handleQuestionSubmit = () => {
        const hasQuestion = questionText.trim().length > 0 || questionFiles.length > 0;

        if (!hasQuestion) {
            toast.error('Please enter a question or upload question files');
            return;
        }

        setShowQuestionModal(false);
        handleFinalSubmit();
    };

    const handleFinalSubmit = async () => {
        setIsProcessing(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.success('Solution check completed successfully!');

            // Reset form
            setSolutionText('');
            setSolutionFiles([]);
            setQuestionText('');
            setQuestionFiles([]);
            if (solutionEditorRef.current) solutionEditorRef.current.innerHTML = '';
            if (questionEditorRef.current) questionEditorRef.current.innerHTML = '';

        } catch (error) {
            toast.error('Failed to process. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Drag and drop setup
    useEffect(() => {
        const setupDragAndDrop = (dropAreaRef, inputType) => {
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

                const currentFiles = inputType === 'solution' ? solutionFiles : questionFiles;
                if (currentFiles.length + droppedFiles.length > 5) {
                    toast.error('Maximum 5 files can be uploaded');
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
                const setFiles = inputType === 'solution' ? setSolutionFiles : setQuestionFiles;
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
        };

        const cleanupSolution = setupDragAndDrop(solutionDropAreaRef, 'solution');
        const cleanupQuestion = setupDragAndDrop(questionDropAreaRef, 'question');

        return () => {
            cleanupSolution?.();
            cleanupQuestion?.();
        };
    }, [solutionFiles, questionFiles]);

    // SEO metadata
    const pageUrl = `${siteConfig.url}/smart-solution-check`;
    const metadata = generatePageMetadata({
        title: "Smart Solution Check - AI-Powered Math Solution Validator",
        description: "Check your math solutions instantly with AI. Upload handwritten solutions or type them in. Get feedback on correctness and step-by-step verification.",
        url: pageUrl,
        image: `${siteConfig.url}/images/solution-check-og.jpg`
    });

    const softwareAppSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Smart Solution Check by MathzAI",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "Web",
        "description": "AI-powered math solution checker. Upload or type solutions and questions for instant verification.",
        "url": pageUrl,
        "publisher": createOrganizationSchema(),
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Solution verification",
            "Handwritten solution recognition",
            "Step-by-step validation",
            "Math keyboard support",
            "Image and text input"
        ]
    };

    const hasSolution = solutionText.trim().length > 0 || solutionFiles.length > 0;
    const hasQuestion = questionText.trim().length > 0 || questionFiles.length > 0;

    return (
        <>
            <Head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                <meta name="keywords" content="math solution checker, homework verification, AI math validator, solution grading, mathzai" />

                <meta property="og:type" content={metadata.openGraph.type} />
                <meta property="og:locale" content={metadata.openGraph.locale} />
                <meta property="og:url" content={metadata.openGraph.url} />
                <meta property="og:title" content={metadata.openGraph.title} />
                <meta property="og:description" content={metadata.openGraph.description} />
                <meta property="og:site_name" content={metadata.openGraph.siteName} />
                <meta property="og:image" content={metadata.openGraph.images[0].url} />

                <meta name="twitter:card" content={metadata.twitter.card} />
                <meta name="twitter:title" content={metadata.twitter.title} />
                <meta name="twitter:description" content={metadata.twitter.description} />
                <meta name="twitter:image" content={metadata.twitter.images[0]} />

                <link rel="canonical" href={metadata.alternates.canonical} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <Script
                id="solution-check-schema"
                type="application/ld+json"
                strategy="afterInteractive"
            >
                {JSON.stringify(softwareAppSchema)}
            </Script>

            <Script
                id="website-schema-sc"
                type="application/ld+json"
                strategy="afterInteractive"
            >
                {JSON.stringify(createWebsiteSchema())}
            </Script>

            <div className="flex flex-col items-center min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Smart Solution Check
                    </h1>
                    <p className="text-xl text-gray-600">
                        Get even your handwritten answers checked here
                    </p>
                </motion.div>

                {/* Solution Input Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="w-full max-w-4xl mb-8"
                >
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        Submit Question(s) for the provided Solution(s)
                    </h2>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-dashed border-gray-300">
                        <div
                            ref={solutionDropAreaRef}
                            className={`min-h-[200px] rounded-lg border-2 border-dashed ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                } flex flex-col justify-between p-4 relative`}
                        >
                            {hasSolution && (
                                <button
                                    onClick={() => handleClear('solution')}
                                    className="absolute top-2 right-2 p-2 bg-gray-200 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}

                            <FilePreviews
                                files={solutionFiles}
                                removeFile={(fileId) => removeFile(fileId, 'solution')}
                            />

                            <div className="flex-1">
                                <div
                                    ref={solutionEditorRef}
                                    className="w-full min-h-[60px] outline-none"
                                    contentEditable={solutionFiles.length === 0 && !isProcessing}
                                    onInput={() => updateContent('solution')}
                                    style={{
                                        pointerEvents: (solutionFiles.length > 0 || isProcessing) ? 'none' : 'auto',
                                        opacity: (solutionFiles.length > 0 || isProcessing) ? 0.7 : 1,
                                    }}
                                />
                                {solutionText.length === 0 && solutionFiles.length === 0 && (
                                    <div className="absolute top-4 left-4 text-gray-500 pointer-events-none">
                                        <p>Upload file(s) having your question(s) here...</p>
                                        <p className="mt-2">or click on <span className="font-mono bg-gray-100 px-1 rounded">T</span> to type</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => solutionFileInputRef.current?.click()}
                                        className={`flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        disabled={isProcessing}
                                    >
                                        <Upload className="w-4 h-4" />
                                        Upload
                                    </button>

                                    <button
                                        onClick={() => solutionCameraInputRef.current?.click()}
                                        className={`flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        disabled={isProcessing}
                                    >
                                        <Camera className="w-4 h-4" />
                                        Camera
                                    </button>

                                    <button
                                        onClick={() => {
                                            setCurrentInputType('solution');
                                            setShowMathKeyboard(!showMathKeyboard);
                                        }}
                                        className={`flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        disabled={isProcessing}
                                    >
                                        <span className="font-mono">T</span>
                                        Math
                                    </button>
                                </div>

                                <button
                                    onClick={handleSolutionSubmit}
                                    disabled={!hasSolution || isProcessing}
                                    className={`px-6 py-2 rounded-lg font-medium transition-all ${hasSolution && !isProcessing
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Proceed →
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Uploaded Solutions Preview */}
                {hasSolution && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="w-full max-w-4xl mb-8"
                    >
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            Uploaded Solution(s) for getting checked.
                        </h2>

                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                            {solutionFiles.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {solutionFiles.map((file) => (
                                        <div key={file.id} className="relative">
                                            <img
                                                src={file.preview}
                                                alt={file.name}
                                                className="w-full h-32 object-cover rounded-lg border"
                                            />
                                            <button
                                                onClick={() => removeFile(file.id, 'solution')}
                                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-wrap">{solutionText}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Examples Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="w-full max-w-4xl"
                >
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        Explore a few solved examples ✨
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {sampleExamples.map((example) => (
                            <motion.div
                                key={example.id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-xl shadow-md p-4 border border-gray-200 cursor-pointer"
                                onClick={() => handleExampleClick(example)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                        {example.category}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {example.type === 'text' ? (
                                            <FileText className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <ImageIcon className="w-4 h-4 text-gray-500" />
                                        )}
                                        <Play className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-1">Question:</p>
                                        {example.type === 'text' ? (
                                            <p className="text-sm text-gray-600">{example.question}</p>
                                        ) : (
                                            <div className="w-full h-20 bg-gray-100 rounded border flex items-center justify-center">
                                                <ImageIcon className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-1">Solution:</p>
                                        {example.type === 'text' ? (
                                            <p className="text-sm text-green-600 font-mono">{example.solution}</p>
                                        ) : (
                                            <div className="w-full h-20 bg-gray-100 rounded border flex items-center justify-center">
                                                <CheckCircle className="w-6 h-6 text-green-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-3 text-center">
                                    <span className="text-xs text-blue-600 font-medium">Try this solved problem →</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </>
    )
}