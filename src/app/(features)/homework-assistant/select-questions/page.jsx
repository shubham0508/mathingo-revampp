'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import QuestionItem from '@/components/features/question-selector/QuestionItem';
import QuestionSelector from '@/components/features/question-selector/QuestionSelector';
import { fetchQuestions } from '@/service/questionService';

export default function SelectQuestionsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [fileQuestions, setFileQuestions] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const data = await fetchQuestions();
        setFileQuestions(data);

        const initialSelectedCount = data.reduce((count, file) => {
          return count + file.questions.filter((q) => q.checked).length;
        }, 0);
        setSelectedQuestionCount(initialSelectedCount);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleQuestionToggle = (questionId, checked) => {
    setFileQuestions((prev) =>
      prev.map((file) => ({
        ...file,
        questions: file.questions.map((q) =>
          q.id === questionId ? { ...q, checked } : q,
        ),
      })),
    );

    setSelectedQuestionCount((prev) => (checked ? prev + 1 : prev - 1));
  };

  const handleSelectAll = () => {
    const currentFile = fileQuestions[currentFileIndex];
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

    const newCount =
      selectedQuestionCount +
      (areAllSelected
        ? -currentFile.questions.length
        : currentFile.questions.filter((q) => !q.checked).length);

    setSelectedQuestionCount(newCount);
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

  const handleSolveQuestions = () => {
    const selectedQuestions = fileQuestions.flatMap((file) =>
      file.questions.filter((q) => q.checked),
    );

    console.log('Solving questions:', selectedQuestions);
    // Here you would navigate to the next page or submit the selected questions
  };

  const currentFile = fileQuestions[currentFileIndex];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
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
          className="flex flex-col lg:flex-row justify-between items-start gap-8 px-16 py-10"
        >
          <div className="w-full lg:w-auto">
            <h1 className="font-bold text-3xl md:text-3xl text-action-buttons-foreground mb-8">
              Select Questions to get help 👇
            </h1>

            {fileQuestions.length > 0 && (
              <QuestionSelector
                file={currentFile}
                currentIndex={currentFileIndex}
                totalFiles={fileQuestions.length}
                onNext={goToNextFile}
                onPrevious={goToPreviousFile}
                onDotClick={goToFileIndex}
              />
            )}
          </div>

          <div className="w-full lg:w-1/2">
            <div className="flex justify-end items-end mb-8">
              <Button
                onClick={handleSolveQuestions}
                disabled={selectedQuestionCount === 0}
                className={`bg-action-buttons-foreground text-white font-medium ${
                  selectedQuestionCount === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                Solve Questions ({selectedQuestionCount})
              </Button>
            </div>

            <div>
              <Button
                onClick={handleSelectAll}
                className="bg-action-buttons-background text-action-buttons-foreground hover:bg-blue-50 rounded-md font-semibold mb-5 text-xl"
              >
                {currentFile?.questions.every((q) => q.checked)
                  ? 'Deselect All'
                  : 'Select All'}
              </Button>
              {currentFile?.questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <QuestionItem
                    question={question}
                    onToggle={(checked) =>
                      handleQuestionToggle(question.id, checked)
                    }
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
