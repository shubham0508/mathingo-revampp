'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import QuestionItem from '@/components/features/question-selector/QuestionItem';
import QuestionSelector from '@/components/features/question-selector/QuestionSelector';
import ImagePreview from '@/components/features/question-selector/ImagePreview';
import { useSelector } from 'react-redux';
import { useHaSolutionExtractionMutation } from '@/store/slices/HA';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { setAnswer } from '@/store/reducers/HA';
import { LoaderCircle } from 'lucide-react';
import Head from 'next/head';
import Script from 'next/script';
import { siteConfig } from "@/config/site";
import { generateMetadata as generatePageMetadata } from '@/config/seo';
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/seoUtils';

export default function SelectQuestionsPage() {
  const [fileQuestions, setFileQuestions] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSolving, setIsSolving] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const dispatch = useDispatch();
  const router = useRouter();

  const questionsList = useSelector(
    (state) => state?.homeworkAssitant?.questions || [],
  );

  const [haSolutionExtraction] = useHaSolutionExtractionMutation();

  useEffect(() => {
    if (fileQuestions.length > 0) {
      const count = fileQuestions.reduce((total, file) => {
        return total + file.questions.filter((q) => q.checked).length;
      }, 0);
      setSelectedQuestionCount(count);
    }
  }, [fileQuestions]);

  useEffect(() => {
    if (questionsList.length > 0) {
      const questionsByFile = questionsList.reduce((acc, question) => {
        const fileId = question.image_id || question.file_url;
        if (!acc[fileId]) {
          acc[fileId] = {
            rawId: fileId,
            fileUrl: question.file_url,
            fileType: question.file_type,
            questions: [],
          };
        }

        acc[fileId].questions.push({
          originalId: question.question_id,
          text: question.text,
          checked: false,
          pageNo: question.page_no,
          difficulty_level: question?.question_difficulty_level
        });

        return acc;
      }, {});

      let globalId = 1;

      const transformedData = Object.values(questionsByFile).map(
        (group, index) => {
          const questionsWithIds = group.questions.map((q) => ({
            ...q,
            id: globalId++,
          }));

          return {
            ...group,
            id: index + 1,
            fileName: `Question Set ${index + 1}`,
            questions: questionsWithIds,
          };
        },
      );

      setFileQuestions(transformedData);
    }
  }, [questionsList]);

  const handleQuestionToggle = (questionId, checked) => {
    setFileQuestions((prev) =>
      prev.map((file) => ({
        ...file,
        questions: file.questions.map((q) =>
          q.id === questionId ? { ...q, checked } : q,
        ),
      })),
    );
  };

  const handleSelectAll = () => {
    const currentFile = fileQuestions[currentFileIndex];
    if (!currentFile) return;

    const areAllSelected = currentFile.questions.every((q) => q.checked);
    const updatedFiles = fileQuestions.map((file, index) => {
      if (index === currentFileIndex) {
        const updatedQuestions = file.questions.map((q) => ({
          ...q,
          checked: !areAllSelected,
        }));
        return { ...file, questions: updatedQuestions };
      }
      return file;
    });

    setFileQuestions(updatedFiles);
  };

  const goToNextFile = () => {
    if (currentFileIndex < fileQuestions.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
    }
  };

  const goToPreviousFile = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex(currentFileIndex - 1);
    }
  };

  const goToFileIndex = (index) => {
    setCurrentFileIndex(index);
  };

  const handleSolveQuestions = async () => {
    if (selectedQuestionCount === 0) return;
    setIsSolving(true);

    try {
      const inputs = fileQuestions.flatMap((file) => {
        const checkedQuestions = file.questions.filter((q) => q.checked);

        if (checkedQuestions.length === 0) return [];

        return checkedQuestions.map((question) => ({
          question_id: question.originalId,
          questions_selected: [question.text],
          question_url: file.fileUrl,
          difficulty_level: question?.difficulty_level
        }));
      });

      const payload = {
        model_name: 'alpha',
        inputs: inputs,
      };

      const solutionResponse = await haSolutionExtraction(payload).unwrap();

      if (solutionResponse?.status_code === 201) {
        const answersWithDifficulty = solutionResponse.data.map((item, index) => ({
          ...item,
          difficulty_level: inputs[index]?.difficulty_level || null,
        }));
        dispatch(setAnswer(answersWithDifficulty));
        router.push('/homework-assistant/select-questions/problem-solver');
      } else {
        throw new Error(solutionResponse?.error || 'Failed to get solutions');
      }
    } catch (error) {
      console.error('Error extracting answers:', error);
      toast.error(
        error?.data?.error || 'Failed to get solutions for the questions.',
      );
    } finally {
      setIsSolving(false);
    }
  };

  const handleOpenPreview = (fileUrl, fileType) => {
    setPreviewImage({ url: fileUrl, type: fileType });
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  const currentFile = fileQuestions[currentFileIndex];
  const hasViewableFile = currentFile && currentFile.fileType !== 'text' && currentFile.fileUrl;

  const pageUrl = `${siteConfig.url}/homework-assistant/select-questions`;
  let metadataTitle = "Select Math Questions for Homework Assistant";
  let metadataDescription = "Review and select the math questions identified by our AI for your homework. Get step-by-step solutions from MathzAI.";
  if (currentFile) {
    metadataTitle = `Select from ${currentFile.fileName} | Homework Assistant`;
    metadataDescription = `Review and choose questions from ${currentFile.fileName} to get AI-powered math solutions from MathzAI.`;
  }
  const metadata = generatePageMetadata({
    title: metadataTitle,
    description: metadataDescription,
    url: pageUrl,
  });

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": metadata.title.replace(` | ${siteConfig.name}`, ""),
    "description": metadata.description,
    "url": pageUrl,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Homework Assistant", "item": `${siteConfig.url}/homework-assistant` },
        { "@type": "ListItem", "position": 2, "name": "Select Questions" }
      ]
    },
    "publisher": createOrganizationSchema(),
    ...(currentFile && currentFile.questions.length > 0 && {
      "mainEntity": {
        "@type": "ItemList",
        "name": `Detected Math Questions from ${currentFile.fileName}`,
        "itemListElement": currentFile.questions.slice(0, 10).map((q, index) => ({ // Limit for brevity
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Question",
            "name": q.text.replace(/"/g, '\\"').substring(0, 100) // Sanitize and shorten
          }
        }))
      }
    })
  };

  if (questionsList.length === 0) {
    return (
      <>
        <Head>
          <title>No Questions Available | Homework Assistant | MathzAI</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="flex flex-col justify-center items-center min-h-screen">
          <p className="text-gray-500 text-xl mb-4">No questions available.</p>
        </div>
      </>
    );
  }

  if (fileQuestions.length === 0) {
    return (
      <>
        <Head>
          <title>Loading Questions... | Homework Assistant | MathzAI</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="flex justify-center items-center min-h-screen">
          <svg
            className="mr-3 size-12 animate-spin text-blue-500"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content="select math problems, choose homework questions, math question list, AI math analysis, mathzai homework" />

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
      </Head>
      <Script
        id="select-questions-ha-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(itemListSchema)}
      </Script>
      <Script
        id="website-schema-select-questions-ha"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(createWebsiteSchema())}
      </Script>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center w-full min-h-screen"
      >
        <div className="w-full max-w-7xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`flex flex-col ${hasViewableFile ? 'lg:flex-row' : ''} justify-between items-start gap-8 px-4 md:px-16 py-10`}
          >
            {hasViewableFile && (
              <div className="w-full lg:w-[45%]">
                <h1 className="font-bold text-3xl md:text-3xl text-action-buttons-foreground mb-8 font-roca">
                  Select Questions to get help 👇
                </h1>

                <QuestionSelector
                  file={currentFile}
                  currentIndex={currentFileIndex}
                  totalFiles={fileQuestions.length}
                  onNext={goToNextFile}
                  onPrevious={goToPreviousFile}
                  onDotClick={goToFileIndex}
                  onOpenPreview={handleOpenPreview}
                />
              </div>
            )}

            <div className={`w-full ${hasViewableFile ? 'lg:w-[55%]' : ''} h-full flex flex-col`}>
              {!hasViewableFile && (
                <h1 className="font-bold text-3xl md:text-3xl text-action-buttons-foreground mb-8 font-roca">
                  Select Questions to get help 👇
                </h1>
              )}

              <div className="flex justify-end items-end mb-8">
                <Button
                  onClick={handleSolveQuestions}
                  disabled={selectedQuestionCount === 0 || isSolving}
                  className={`bg-action-buttons-foreground hover:bg-action-buttons-foreground text-white font-medium text-lg ${selectedQuestionCount === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                    }`}
                >
                  {isSolving ? (
                    <div className="flex items-center">
                      <LoaderCircle className="size-5 mr-3 animate-spin text-white" />
                      Processing...
                    </div>
                  ) : (
                    `Solve Questions (${selectedQuestionCount})`
                  )}
                </Button>
              </div>

              <div className="max-h-[500px] md:max-h-[500px] overflow-y-auto pr-2 flex-grow">
                {currentFile && (
                  <>
                    <Button
                      onClick={handleSelectAll}
                      className="bg-action-buttons-background text-action-buttons-foreground hover:bg-blue-50 rounded-md font-semibold mb-5 text-xl"
                    >
                      {currentFile.questions.every((q) => q.checked)
                        ? 'Deselect All'
                        : 'Select All'}
                    </Button>

                    {currentFile.questions.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <QuestionItem
                          index={index}
                          question={question}
                          onToggle={(checked) =>
                            handleQuestionToggle(question.id, checked)
                          }
                        />
                      </motion.div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {previewImage && (
            <ImagePreview
              fileUrl={previewImage.url}
              fileType={previewImage.type}
              onClose={handleClosePreview}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}