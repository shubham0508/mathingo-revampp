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
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  useHaQuestionExtractionMutation,
  useHaSolutionExtractionMutation,
} from '@/store/slices/HA';
import { resetAnswer, resetQuestion, setAnswer, setQuestion } from '@/store/reducers/HA';
import { createFileData, validateFile } from '@/lib/fileUtils';
import MathKeyboard from '@/components/shared/SuperInputBox/math-keyboard';
import FilePreviews from '@/components/shared/SuperInputBox/file-previews';
import { useGuestUserAuth } from '@/hooks/useGuestUserAuth';
import { getErrorMessage } from '@/lib/utils';
import toast from 'react-hot-toast';
import { satExamples } from '@/config/constant';
import { siteConfig } from "@/config/site";
import { generateMetadata as generatePageMetadata } from '@/config/seo';
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/seoUtils';

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
  const [hasContentState, setHasContentState] = useState(false); // Renamed from hasContent to avoid conflict
  const [disabled, setDisabled] = useState(true);
  const [showExamplesModal, setShowExamplesModal] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const editorRef = useRef(null);
  const MQRef = useRef(null);

  const [haQuestionExtraction] = useHaQuestionExtractionMutation();
  const [haSolutionExtraction] = useHaSolutionExtractionMutation();
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

  useEffect(() => {
    dispatch(resetAnswer())
    dispatch(resetQuestion())
  }, [dispatch])

  useEffect(() => {
    const contentExists = text.trim().length > 0 || files.length > 0;
    setHasContentState(contentExists);
    setDisabled(!contentExists);
  }, [text, files]);

  const initEditor = useCallback(() => {
    if (typeof window !== 'undefined' && window.MathQuill) {
      MQRef.current = window.MathQuill;
      MQRef.current = window.MathQuill.getInterface(2);
      setInitialized(true);

      if (editorRef.current) {
        editorRef.current.addEventListener('input', handleEditorInput);
      }
    }
  }, []);

  const handleEditorInput = useCallback(() => {
    updateContent();
    if (editorRef.current && editorRef.current.textContent.trim().length > 0) {
      setShowMathKeyboard(true);
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
        toast.error('Maximum 5 files can be uploaded');
        return;
      }

      const validFiles = newFiles.filter((file) => {
        const validation = validateFile(file);
        if (!validation.isValid) {
          Object.values(validation.errors).forEach((error) =>
            toast.error(String(error)),
          );
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
    },
    [files, text],
  );

  const handleCameraInput = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

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
    },
    [text],
  );

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
    setHasContentState(false);
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
        toast.error('Maximum 5 files can be uploaded');
        return;
      }

      const validFiles = droppedFiles.filter((file) => {
        const validation = validateFile(file);
        if (!validation.isValid) {
          Object.values(validation.errors).forEach((error) =>
            toast.error(String(error)),
          );
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
  }, [files, text]);

  const handlePaste = useCallback(
    async (e) => {
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
                  toast.error(String(error)),
                );
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
        toast.error('Maximum 2000 characters can be added as question!!');
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
        updateContent();
        setShowMathKeyboard(true);
      }
    },
    [activeField, files.length, text, updateContent],
  );

  const submitFiles = async () => {
    try {
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
      throw error;
    }
  };

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
            difficulty_level: firstPage?.question_difficulty_level || 'easy'
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

  const handleSubmit = async () => {
    if (isProcessing || disabled) return;

    const currentHasContent = text.trim().length > 0 || files.length > 0;
    if (!currentHasContent) {
      toast.error('Please enter a question or upload files');
      return;
    }

    try {
      const isReady = await ensureAuthenticated();
      if (!isReady) {
        toast.error('Something went wrong! Please try again later');
        return;
      }

      setIsProcessing(true);

      if (files.length > 0) {
        await submitFiles();
      } else if (text.trim().length > 0) {
        await submitTextQuestion();
      }

      setText('');
      if (editorRef.current) editorRef.current.innerHTML = '';
      setFiles([]);
      setShowMathKeyboard(false);
      setHasContentState(false);
    } catch (error) {
      console.error('Submission error:', error);
      setIsProcessing(false);
    }
  };

  const handleExampleClick = (example) => {
    if (example === 'More Examples') {
      setShowExamplesModal(true);
      return;
    }

    if (files.length > 0) {
      toast.error('Please remove uploaded files first to use examples');
      return;
    }

    if (editorRef.current) {
      editorRef.current.textContent = example;
      updateContent();
      setShowMathKeyboard(true);
      editorRef.current.focus();
    }
  };

  const handleModalExampleClick = (example) => {
    if (files.length > 0) {
      toast.error('Please remove uploaded files first to use examples');
      return;
    }

    if (editorRef.current) {
      editorRef.current.textContent = example;
      updateContent();
      setShowMathKeyboard(true);
      editorRef.current.focus();
    }
    setShowExamplesModal(false);
  };

  useEffect(() => {
    if (editorRef.current) {
      const shouldDisableEditor = files.length > 0 || isProcessing;
      editorRef.current.setAttribute(
        'contenteditable',
        shouldDisableEditor ? 'false' : 'true',
      );

      if (shouldDisableEditor) {
        editorRef.current.style.pointerEvents = 'none';
        editorRef.current.style.opacity = '0.7';
      } else {
        editorRef.current.style.pointerEvents = 'auto';
        editorRef.current.style.opacity = '1';
      }
    }
  }, [files.length, isProcessing]);

  const pageUrl = `${siteConfig.url}/homework-assistant`;
  const metadata = generatePageMetadata({
    title: "Math Homework Assistant - Instant AI Math Problem Solver",
    description: "Get instant solutions to all your math problems with our AI-powered Math Homework Assistant by MathzAI. Upload images or type your problems for step-by-step solutions.",
    url: pageUrl,
    image: `${siteConfig.url}/images/homework-assistant-og.jpg`
  });

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Math Homework Assistant by MathzAI",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "description": "AI-powered math problem solver. Upload images, type problems, and get step-by-step solutions.",
    "url": pageUrl,
    "publisher": createOrganizationSchema(),
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Text input for math problems",
      "Image/PDF upload for math problems (OCR)",
      "Step-by-step math solutions",
      "AI-powered problem analysis",
      "Math keyboard for easy input"
    ]
  };

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content="math solver, homework help, AI math tutor, calculus solver, algebra help, math problem solver, mathzai, instant math answers" />

        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:locale" content={metadata.openGraph.locale} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta property="og:image:width" content={String(metadata.openGraph.images[0].width)} />
        <meta property="og:image:height" content={String(metadata.openGraph.images[0].height)} />
        <meta property="og:image:alt" content={metadata.openGraph.images[0].alt} />

        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.images[0]} />
        <meta name="twitter:creator" content={metadata.twitter.creator} />

        <link rel="canonical" href={metadata.alternates.canonical} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script
        id="homework-assistant-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(softwareAppSchema)}
      </Script>
      <Script
        id="website-schema-hw"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(createWebsiteSchema())}
      </Script>


      <div className="flex flex-row justify-center w-full min-h-screen">
        <div className="relative w-full">
          <div className="flex flex-col items-center">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-gradient-secondary bg-clip-text text-transparent font-black text-4xl font-roca"
            >
              Homework Assistant
            </motion.h1>

            <motion.h2
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mt-4 text-heading-ha text-xl font-semibold"
            >
              Instant AI Math Solver
            </motion.h2>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mt-8 w-2/3 rounded-lg bg-white"
              style={{ boxShadow: '0 1px 5px rgba(66, 85, 255, 1)' }}
            >
              <div className="p-6">
                <motion.div
                  ref={dropAreaRef}
                  transition={{ duration: 0.3 }}
                  className={`w-full min-h-[250px] rounded-md border-2 border-dashed ${isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300'
                    } flex flex-col justify-between p-6 relative`}
                >
                  {hasContentState && (
                    <motion.div
                      variants={buttonHover}
                      initial="rest"
                      whileHover="hover"
                      className="absolute top-2 right-2 flex items-center justify-center p-2 bg-gray-200 hover:bg-red-100 text-red-600 rounded-full cursor-pointer"
                      onClick={handleClear}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.div>
                  )}

                  <FilePreviews files={files} removeFile={removeFile} />

                  <div className="flex flex-col flex-1">
                    <div
                      ref={editorRef}
                      className="flex-1 outline-none relative"
                      contentEditable={files.length === 0 && !isProcessing}
                      onKeyDown={handleEditorKeyDown}
                      onPaste={handlePaste}
                      style={{
                        minHeight: '60px',
                        pointerEvents: (files.length > 0 || isProcessing) ? 'none' : 'auto',
                        opacity: (files.length > 0 || isProcessing) ? 0.7 : 1,
                      }}
                    />
                    {text?.length === 0 && files?.length === 0 && (
                      <div className="flex flex-row absolute text-gray-700 text-sm w-full">
                        <span>Type a math problem....</span>
                        <span className="absolute mt-10">
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
                        className={`flex items-center gap-2 h-9 bg-action-buttons-background text-action-buttons-foreground font-medium rounded-md border-none px-3 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        onClick={triggerFileInput}
                        disabled={isProcessing}
                      >
                        <Upload className="w-4 h-4" />
                        Upload Files
                      </motion.button>

                      <motion.button
                        variants={buttonHover}
                        initial="rest"
                        whileHover="hover"
                        className={`flex items-center gap-2 h-9 bg-action-buttons-background text-action-buttons-foreground font-medium rounded-md border-none px-3 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        onClick={triggerCameraInput}
                        disabled={isProcessing}
                      >
                        <Camera className="w-4 h-4" />
                        Take a snap
                      </motion.button>
                    </div>

                    <motion.button
                      variants={buttonHover}
                      initial="rest"
                      whileHover="hover"
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-1 
    ${isProcessing || disabled ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-action-buttons-foreground'} 
    text-white font-medium rounded-md h-9 px-4`}
                      onClick={handleSubmit}
                      disabled={isProcessing || disabled}
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <LoaderCircle className="size-5 mr-3 animate-spin text-white" />
                          Processing...
                        </div>
                      ) : (
                        <>
                          Submit Questions
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
                {showMathKeyboard && files.length === 0 && text.trim().length > 0 && (
                  <div className="relative">
                    <button
                      className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1"
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
                      disabled={disabled}
                    />
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
              className="mt-6 flex flex-col items-center w-full"
            >
              <motion.div
                variants={fadeIn}
                className="font-medium text-gray-600 text-base mb-3"
              >
                ✨ Jump in with one of these examples
              </motion.div>

              <motion.div
                variants={staggerChildren}
                className="flex flex-wrap gap-2 justify-center"
              >
                {examples.map((example, index) => (
                  <motion.button
                    key={index}
                    variants={fadeIn}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: example === 'More Examples' ? '#f3f4f6' : '#dddff8',
                      transition: { duration: 0.2 },
                    }}
                    onClick={() => handleExampleClick(example)}
                    className={`bg-button-background-question font-semibold text-black text-sm shadow-sm rounded-md border-none py-2 cursor-pointer px-4 ${(hasContentState && example !== 'More Examples')
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                      }`}
                    disabled={hasContentState && example !== 'More Examples'}
                  >
                    {example}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {showExamplesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  SAT Math Examples
                </h2>
                <button
                  onClick={() => setShowExamplesModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-green-700">
                      Beginner
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {satExamples.beginner.map((question, index) => (
                      <motion.button
                        key={`beginner-${index}`}
                        whileHover={{ scale: 1.02, backgroundColor: '#f0fdf4' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleModalExampleClick(question)}
                        className="w-full text-left p-3 rounded-lg border border-green-200 hover:border-green-300 transition-all duration-200 text-sm text-gray-700 hover:text-green-800"
                        disabled={hasContentState}
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-yellow-700">
                      Intermediate
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {satExamples.intermediate.map((question, index) => (
                      <motion.button
                        key={`intermediate-${index}`}
                        whileHover={{ scale: 1.02, backgroundColor: '#fffbeb' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleModalExampleClick(question)}
                        className="w-full text-left p-3 rounded-lg border border-yellow-200 hover:border-yellow-300 transition-all duration-200 text-sm text-gray-700 hover:text-yellow-800"
                        disabled={hasContentState}
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-red-700">
                      Hard
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {satExamples.hard.map((question, index) => (
                      <motion.button
                        key={`hard-${index}`}
                        whileHover={{ scale: 1.02, backgroundColor: '#fef2f2' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleModalExampleClick(question)}
                        className="w-full text-left p-3 rounded-lg border border-red-200 hover:border-red-300 transition-all duration-200 text-sm text-gray-700 hover:text-red-800"
                        disabled={hasContentState}
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {hasContentState && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 text-sm text-center">
                    Clear your current input to select an example question
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

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