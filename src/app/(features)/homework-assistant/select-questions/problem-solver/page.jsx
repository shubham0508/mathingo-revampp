'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ChevronsLeft,
  Copy,
  ThumbsDown,
  ThumbsUp,
  ChevronRight,
  ChevronLeft,
  SquareChevronDown,
} from 'lucide-react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { useSelector } from 'react-redux';
import {
  useHaRelatedQuestionsMutation,
  useHaRelatedYoutubeVideosMutation,
} from '@/store/slices/HA';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const stepAnimation = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

const Typewriter = ({ text, speed = 5, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayedText('');
    indexRef.current = 0;
    setIsComplete(false);

    if (!text) {
      if (onComplete) onComplete();
      setIsComplete(true);
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const charsPerTick = Math.max(1, Math.floor(text.length / 50));

    intervalRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        const nextIndex = Math.min(
          indexRef.current + charsPerTick,
          text.length,
        );
        const nextChunk = text.substring(indexRef.current, nextIndex);
        setDisplayedText((prev) => prev + nextChunk);
        indexRef.current = nextIndex;

        if (indexRef.current >= text.length) {
          clearInterval(intervalRef.current);
          if (onComplete) onComplete();
          setIsComplete(true);
        }
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, speed, onComplete]);

  if (isComplete || !text) {
    return <Latex>{text || ''}</Latex>;
  }

  return <Latex>{displayedText}</Latex>;
};

const transformApiResponseToQuestionData = (questionData) => {
  if (!questionData) return null;

  // Check if there's an error in the response
  if (questionData.error) {
    return {
      id: questionData.question_id,
      text: questionData.question,
      error: questionData.error,
    };
  }

  // Check if llm_response exists and has solution
  if (!questionData.llm_response || !questionData.llm_response.solution) {
    return {
      id: questionData.question_id,
      text: questionData.question,
      error: 'Failed to generate solution for this question',
    };
  }

  const solutionData = questionData.llm_response.solution;

  const hints = solutionData.flatMap((part) => part.hints || []);
  const concepts = solutionData.flatMap((part) => part.concepts_used || []);
  const answer = solutionData
    .flatMap((part) => part.final_answer || [])
    .join(', ');

  const solution = solutionData.flatMap((part, partIndex) =>
    part.complete_solution.map((step, stepIndex) => ({
      step: partIndex + stepIndex + 1,
      title: step.concept_theorem_used || '',
      content: step.sub_steps.join('\n') || '',
      explanation: step.sub_steps_explnation || '',
    })),
  );

  return {
    id: questionData.question_id,
    text: questionData.question,
    hints,
    concepts,
    answer,
    solution,
    relatedVideos: [],
    relatedQuestions: [],
  };
};

export default function HWAssistantPage() {
  const answerList = useSelector(
    (state) => state?.homeworkAssitant?.answers || [],
  );

  console.log('answerList', answerList);

  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Hints');
  const [expandedSteps, setExpandedSteps] = useState([]);
  const [videoCarouselIndex, setVideoCarouselIndex] = useState(0);
  const [questionCarouselIndex, setQuestionCarouselIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [expandedExplanation, setExpandedExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [videoQueryMade, setVideoQueryMade] = useState({});
  const [questionQueryMade, setQuestionQueryMade] = useState({});

  const transformYouTubeResponse = (data) => {
    if (!data || !Array.isArray(data)) return [];

    return data.map((url, index) => {
      const videoId = url.split('v=')[1]?.split('&')[0] || '';

      const title = `Video ${index + 1}: Math Concept Explanation`;

      const thumbnailUrl = videoId
        ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
        : '/api/placeholder/400/225';

      return {
        id: videoId || `video-${index}`,
        url: url,
        title: title,
        thumbnailUrl: thumbnailUrl,
      };
    });
  };

  const transformRelatedQuestionsResponse = (data) => {
    if (!data || !data.response || !data.response.similar_questions) return [];

    const {
      hard = [],
      medium = [],
      easy = [],
    } = data.response.similar_questions;

    const allQuestions = [
      ...hard.map((q) => ({
        id: `hard-${hashString(q)}`,
        text: q,
        difficulty: 'Hard',
      })),
      ...medium.map((q) => ({
        id: `medium-${hashString(q)}`,
        text: q,
        difficulty: 'Medium',
      })),
      ...easy.map((q) => ({
        id: `easy-${hashString(q)}`,
        text: q,
        difficulty: 'Easy',
      })),
    ];

    return allQuestions;
  };

  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).substring(0, 8);
  };

  useEffect(() => {
    if (answerList && answerList.length > 0) {
      const generatedQuestions = answerList.map((item, index) => ({
        number: `Q${index + 1}.`,
        text: item.question,
        active: index === 0,
      }));

      setQuestions(generatedQuestions);

      if (answerList[0]) {
        const formattedData = transformApiResponseToQuestionData(answerList[0]);
        if (formattedData) {
          setSelectedQuestion(formattedData);
          setCurrentQuestionId(formattedData.id);

          if (formattedData.solution && formattedData.solution.length > 0) {
            setExpandedSteps(formattedData.solution.map((step) => step.step));
          }
        }
      }

      setIsLoading(false);
    }
  }, [answerList]);

  const [getRelatedVideos, { data: videosApiData, isLoading: videosLoading }] =
    useHaRelatedYoutubeVideosMutation();

  const [
    getRelatedQuestions,
    { data: questionsApiData, isLoading: questionsLoading },
  ] = useHaRelatedQuestionsMutation();

  useEffect(() => {
    if (
      selectedQuestion &&
      selectedQuestion.concepts &&
      selectedQuestion.concepts.length > 0
    ) {
      const conceptsQuery = selectedQuestion.concepts.join(',');
      const questionId = selectedQuestion.id;

      if (!videoQueryMade[questionId]) {
        getRelatedVideos({ query: conceptsQuery, limit: 10 });
        setVideoQueryMade((prev) => ({ ...prev, [questionId]: true }));
      }

      if (!questionQueryMade[questionId]) {
        getRelatedQuestions({ query: conceptsQuery, limit: 10 });
        setQuestionQueryMade((prev) => ({ ...prev, [questionId]: true }));
      }
    }
  }, [selectedQuestion?.id, selectedQuestion?.concepts]);

  useEffect(() => {
    if (selectedQuestion && videosApiData && videosApiData.data) {
      const formattedVideos = transformYouTubeResponse(videosApiData.data);
      setSelectedQuestion((prev) => ({
        ...prev,
        relatedVideos: formattedVideos || [],
      }));
    }
  }, [videosApiData, selectedQuestion?.id]);

  useEffect(() => {
    if (selectedQuestion && questionsApiData && questionsApiData.data) {
      const formattedQuestions = transformRelatedQuestionsResponse(
        questionsApiData.data,
      );
      setSelectedQuestion((prev) => ({
        ...prev,
        relatedQuestions: formattedQuestions || [],
      }));
    }
  }, [questionsApiData, selectedQuestion?.id]);

  const handleQuestionClick = (index) => {
    if (questions[index]?.active) return;

    const updatedQuestions = questions.map((q, i) => ({
      ...q,
      active: i === index,
    }));

    setQuestions(updatedQuestions);
    setIsLoading(true);

    if (answerList && answerList.length > index) {
      const questionData = answerList[index];
      if (questionData) {
        const formattedData = transformApiResponseToQuestionData(questionData);

        if (formattedData) {
          setSelectedQuestion({
            ...formattedData,
            relatedVideos: [],
            relatedQuestions: [],
          });

          setCurrentQuestionId(formattedData.id);

          setVideoQueryMade((prev) => ({ ...prev, [formattedData.id]: false }));
          setQuestionQueryMade((prev) => ({
            ...prev,
            [formattedData.id]: false,
          }));

          if (formattedData.solution && formattedData.solution.length > 0) {
            setExpandedSteps(formattedData.solution.map((step) => step.step));
          }
        }
      }
    }

    setExpandedExplanation(null);
    setIsLoading(false);
  };

  const toggleExplanation = (step) => {
    if (expandedExplanation === step) {
      setExpandedExplanation(null);
    } else {
      setExpandedExplanation(step);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedTab(option);
    setExpandedExplanation(null);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(selectedQuestion?.answer || '');
    console.log('Answer copied to clipboard');
  };

  const handleFeedback = (isPositive) => {
    console.log(`User gave ${isPositive ? 'positive' : 'negative'} feedback`);
  };

  const nextVideoCarousel = () => {
    if (
      selectedQuestion &&
      selectedQuestion.relatedVideos &&
      selectedQuestion.relatedVideos.length > 0
    ) {
      setVideoCarouselIndex(
        (prevIndex) => (prevIndex + 3) % selectedQuestion.relatedVideos.length,
      );
    }
  };

  const prevVideoCarousel = () => {
    if (
      selectedQuestion &&
      selectedQuestion.relatedVideos &&
      selectedQuestion.relatedVideos.length > 0
    ) {
      setVideoCarouselIndex(
        (prevIndex) =>
          (prevIndex - 3 + selectedQuestion.relatedVideos.length) %
          selectedQuestion.relatedVideos.length,
      );
    }
  };

  const nextQuestionCarousel = () => {
    if (
      selectedQuestion &&
      selectedQuestion.relatedQuestions &&
      selectedQuestion.relatedQuestions.length > 0
    ) {
      setQuestionCarouselIndex(
        (prevIndex) =>
          (prevIndex + 3) % selectedQuestion.relatedQuestions.length,
      );
    }
  };

  const prevQuestionCarousel = () => {
    if (
      selectedQuestion &&
      selectedQuestion.relatedQuestions &&
      selectedQuestion.relatedQuestions.length > 0
    ) {
      setQuestionCarouselIndex(
        (prevIndex) =>
          (prevIndex - 3 + selectedQuestion.relatedQuestions.length) %
          selectedQuestion.relatedQuestions.length,
      );
    }
  };

  const iconMap = {
    Hints: {
      selected: (
        <Image
          src="/images/icons/hints-selected.svg"
          alt="Hints selected"
          width={16}
          height={16}
        />
      ),
      unselected: (
        <Image
          src="/images/icons/hints-unselected.svg"
          alt="Hints unselected"
          width={16}
          height={16}
        />
      ),
    },
    Concepts: {
      selected: (
        <Image
          src="/images/icons/concepts-selected.svg"
          alt="Concepts selected"
          width={16}
          height={16}
        />
      ),
      unselected: (
        <Image
          src="/images/icons/concepts-unselected.svg"
          alt="Concepts unselected"
          width={16}
          height={16}
        />
      ),
    },
    Answer: {
      selected: (
        <Image
          src="/images/icons/answer-selected.svg"
          alt="Answer selected"
          width={16}
          height={16}
        />
      ),
      unselected: (
        <Image
          src="/images/icons/answer-unselected.svg"
          alt="Answer unselected"
          width={16}
          height={16}
        />
      ),
    },
    Solution: {
      selected: (
        <Image
          src="/images/icons/solution-selected.svg"
          alt="Solution selected"
          width={16}
          height={16}
        />
      ),
      unselected: (
        <Image
          src="/images/icons/solution-unselected.svg"
          alt="Solution unselected"
          width={16}
          height={16}
        />
      ),
    },
  };

  const options = ['Hints', 'Concepts', 'Answer', 'Solution'];

  return (
    <motion.div
      className="flex flex-col p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="font-black text-2xl font-roca"
      >
        <span className="bg-gradient-secondary bg-clip-text text-transparent">
          Unlock Your Problem-Solving Superpowers
        </span>{' '}
        🎯
      </motion.h1>

      <div className="flex flex-col gap-8 lg:flex-row mt-10">
        <HomeworkQuestionsSection
          questions={questions}
          onQuestionClick={handleQuestionClick}
        />

        {selectedQuestion && !isLoading && (
          <HomeworkAssistantSection
            question={selectedQuestion}
            selectedTab={selectedTab}
            expandedSteps={expandedSteps}
            onTabChange={handleOptionClick}
            onToggleExplanation={toggleExplanation}
            onCopy={handleCopyClick}
            onFeedback={handleFeedback}
            videoCarouselIndex={videoCarouselIndex}
            questionCarouselIndex={questionCarouselIndex}
            nextVideoCarousel={nextVideoCarousel}
            prevVideoCarousel={prevVideoCarousel}
            nextQuestionCarousel={nextQuestionCarousel}
            prevQuestionCarousel={prevQuestionCarousel}
            isCarouselHovered={isCarouselHovered}
            setIsCarouselHovered={setIsCarouselHovered}
            iconMap={iconMap}
            options={options}
            expandedExplanation={expandedExplanation}
            videosLoading={videosLoading}
            questionsLoading={questionsLoading}
          />
        )}

        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-xl font-medium text-gray-600">Loading...</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function HomeworkAssistantSection({
  question,
  selectedTab,
  expandedSteps,
  onTabChange,
  onToggleExplanation,
  onCopy,
  onFeedback,
  videoCarouselIndex,
  questionCarouselIndex,
  nextVideoCarousel,
  prevVideoCarousel,
  nextQuestionCarousel,
  prevQuestionCarousel,
  isCarouselHovered,
  setIsCarouselHovered,
  iconMap,
  options,
  expandedExplanation,
  videosLoading,
  questionsLoading,
}) {
  const displayedVideos =
    question.relatedVideos?.slice(videoCarouselIndex, videoCarouselIndex + 3) ||
    [];
  const displayedQuestions =
    question.relatedQuestions?.slice(
      questionCarouselIndex,
      questionCarouselIndex + 3,
    ) || [];

  const [typedContent, setTypedContent] = useState({});

  const handleTypingComplete = (contentKey) => {
    setTypedContent((prev) => ({
      ...prev,
      [contentKey]: true,
    }));
  };

  const [actionStates, setActionStates] = useState({
    copied: false,
    upvoted: false,
    downvoted: false,
  });

  const handleCopyClick = () => {
    navigator.clipboard.writeText(question?.answer || '');
    setActionStates((prev) => ({ ...prev, copied: true }));
    setTimeout(
      () => setActionStates((prev) => ({ ...prev, copied: false })),
      1500,
    );
  };

  const handleFeedback = (isPositive) => {
    console.log(`User gave ${isPositive ? 'positive' : 'negative'} feedback`);
    if (isPositive) {
      setActionStates({ copied: false, upvoted: true, downvoted: false });
    } else {
      setActionStates({ copied: false, upvoted: false, downvoted: true });
    }
  };

  if (question.error) {
    return (
      <ErrorDisplay
        questionText={question.text}
        errorMessage={question.error}
      />
    );
  }

  return (
    <motion.div
      className="flex-1 rounded-lg bg-white p-6 shadow-md"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="space-y-8">
        <div className="flex justify-end items-end">
          <Button className="bg-primary hover:bg-action-buttons-hover text-white">
            <Image
              src="/images/icons/math_tutor.png"
              width={24}
              height={24}
              alt="Math Tutor"
              className="mr-2"
            />{' '}
            Try it Live with Buddy
          </Button>
        </div>
        <div className="space-y-6">
          <motion.h1
            className="text-xl font-extrabold text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Question: <Latex>{question.text || ''}</Latex>
          </motion.h1>

          <motion.div
            className="flex flex-wrap gap-2"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {options.map((option) => (
              <motion.div key={option} variants={fadeIn}>
                <Button
                  variant="outline"
                  onClick={() => onTabChange(option)}
                  className={`text-sm px-3 py-1 flex items-center ${selectedTab === option ? 'bg-tabs-background' : ''}`}
                >
                  {selectedTab === option
                    ? iconMap[option].selected
                    : iconMap[option].unselected}
                  <span className="">{option}</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {selectedTab === 'Hints' &&
                question.hints &&
                question.hints.length > 0 && (
                  <motion.div
                    className="space-y-3"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {question.hints.map((hint, idx) => (
                      <motion.p
                        key={idx}
                        variants={stepAnimation}
                        className="text-base font-medium text-gray-800"
                      >
                        <span className="mr-2">👉</span>
                        {typedContent[`hint-${idx}`] ? (
                          <Latex>{hint}</Latex>
                        ) : (
                          <Typewriter
                            text={hint}
                            speed={20}
                            onComplete={() =>
                              handleTypingComplete(`hint-${idx}`)
                            }
                          />
                        )}
                      </motion.p>
                    ))}
                  </motion.div>
                )}

              {selectedTab === 'Concepts' &&
                question.concepts &&
                question.concepts.length > 0 && (
                  <motion.div
                    className="space-y-3"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {question.concepts.map((concept, idx) => (
                      <motion.p
                        key={idx}
                        variants={stepAnimation}
                        className="text-base font-medium text-gray-800"
                      >
                        <span className="mr-2">👉</span>
                        {typedContent[`concept-${idx}`] ? (
                          <Latex>{concept}</Latex>
                        ) : (
                          <Typewriter
                            text={concept}
                            speed={20}
                            onComplete={() =>
                              handleTypingComplete(`concept-${idx}`)
                            }
                          />
                        )}
                      </motion.p>
                    ))}
                  </motion.div>
                )}

              {selectedTab === 'Answer' && (
                <motion.div
                  className="space-y-3"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <p className="text-base font-medium text-gray-800">
                    <span className="mr-2">👉</span>
                    {typedContent['answer'] ? (
                      <Latex>{question.answer}</Latex>
                    ) : (
                      <Typewriter
                        text={question.answer}
                        speed={20}
                        onComplete={() => handleTypingComplete('answer')}
                      />
                    )}
                  </p>
                </motion.div>
              )}

              {selectedTab === 'Solution' &&
                question.solution &&
                question.solution.length > 0 && (
                  <motion.div
                    className="space-y-2"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {question.solution.map((step, idx) => (
                      <div key={idx}>
                        <motion.div
                          className="flex items-start gap-4"
                          variants={stepAnimation}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-background text-lg font-bold text-solution-steps">
                            {step.step}.
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Latex className="text-lg font-extrabold text-solution-steps">
                                {step.title}
                              </Latex>
                              <SquareChevronDown
                                className={`h-7 w-7 transition-transform fill-primary text-white cursor-pointer ${
                                  expandedExplanation === step.step
                                    ? 'rotate-180'
                                    : ''
                                }`}
                                onClick={() => onToggleExplanation(step.step)}
                              />
                            </div>

                            <motion.div
                              className="mt-2 flex gap-4"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Separator
                                orientation="vertical"
                                className="w-0.5 bg-secondary-background"
                              />
                              <div className="flex-1">
                                <p className="text-sm whitespace-pre-wrap">
                                  {typedContent[`step-${step.step}`] ? (
                                    <Latex>{step.content || ''}</Latex>
                                  ) : (
                                    <Typewriter
                                      text={step.content}
                                      speed={10}
                                      onComplete={() =>
                                        handleTypingComplete(
                                          `step-${step.step}`,
                                        )
                                      }
                                    />
                                  )}
                                </p>

                                {expandedExplanation === step.step &&
                                  step.explanation && (
                                    <motion.div
                                      className="mt-3 p-3 bg-secondary-background rounded-lg border border-gray-200"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.2 }}
                                    >
                                      <p className="text-sm">
                                        {typedContent[
                                          `explanation-${step.step}`
                                        ] ? (
                                          <Latex>{step.explanation}</Latex>
                                        ) : (
                                          <Typewriter
                                            text={step.explanation}
                                            speed={10}
                                            onComplete={() =>
                                              handleTypingComplete(
                                                `explanation-${step.step}`,
                                              )
                                            }
                                          />
                                        )}
                                      </p>
                                    </motion.div>
                                  )}
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                    ))}
                  </motion.div>
                )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Copy answer"
              title="Copy"
            >
              <motion.div
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95, y: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={handleCopyClick}
                className="rounded-full cursor-pointer"
              >
                <Copy
                  className={`h-7 w-7 transition-colors duration-200 ${
                    actionStates.copied
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                />
              </motion.div>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Dislike"
              title="Dislike"
            >
              <motion.div
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95, y: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => handleFeedback(false)}
                className="rounded-full cursor-pointer"
              >
                <ThumbsDown
                  className={`h-7 w-7 transition-colors duration-200 ${
                    actionStates.downvoted
                      ? 'text-red-600'
                      : 'text-gray-500 hover:text-red-600'
                  }`}
                />
              </motion.div>
            </Button>

            <Button variant="ghost" size="icon" aria-label="Like" title="Like">
              <motion.div
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95, y: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => handleFeedback(true)}
                className="rounded-full cursor-pointer"
              >
                <ThumbsUp
                  className={`h-7 w-7 transition-colors duration-200 ${
                    actionStates.upvoted
                      ? 'text-green-600'
                      : 'text-gray-500 hover:text-green-600'
                  }`}
                />
              </motion.div>
            </Button>
          </div>
        </div>

        {videosLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={`video-skeleton-${i}`}
                className="aspect-video rounded-lg overflow-hidden bg-gray-100 animate-pulse"
              >
                <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
              </div>
            ))}
          </div>
        ) : (
          question.relatedVideos &&
          question.relatedVideos.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-primary">
                Related Videos
              </h4>

              <div
                className="relative"
                onMouseEnter={() => setIsCarouselHovered(true)}
                onMouseLeave={() => setIsCarouselHovered(false)}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {displayedVideos.map((video, index) => (
                    <motion.a
                      key={`video-${video.id}`}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-video rounded-lg overflow-hidden cursor-pointer relative block"
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Image
                        src={video.thumbnailUrl || '/api/placeholder/400/225'}
                        width={400}
                        height={225}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <p className="text-white font-medium text-sm">
                          {video.title}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>

                <AnimatePresence>
                  {isCarouselHovered && question.relatedVideos.length > 3 && (
                    <>
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white rounded-full shadow-lg p-2"
                        onClick={prevVideoCarousel}
                        aria-label="Previous videos"
                      >
                        <ChevronLeft className="h-5 w-5 text-primary" />
                      </motion.button>
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white rounded-full shadow-lg p-2"
                        onClick={nextVideoCarousel}
                        aria-label="Next videos"
                      >
                        <ChevronRight className="h-5 w-5 text-primary" />
                      </motion.button>
                    </>
                  )}
                </AnimatePresence>

                {question.relatedVideos.length > 3 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({
                      length: Math.ceil(question.relatedVideos.length / 3),
                    }).map((_, index) => (
                      <button
                        key={`video-dot-${index}`}
                        className={`w-2 h-2 rounded-full ${index === Math.floor(videoCarouselIndex / 3) ? 'bg-primary' : 'bg-gray-300'}`}
                        onClick={() => setVideoCarouselIndex(index * 3)}
                        aria-label={`Go to video set ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {questionsLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={`question-skeleton-${i}`}
                className="p-4 bg-gray-100 rounded-lg animate-pulse h-32"
              >
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-3 mx-auto"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6 mb-2 mx-auto"></div>
                <div className="h-3 bg-gray-300 rounded w-4/5 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          question.relatedQuestions &&
          question.relatedQuestions.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-primary mt-8">
                Related Questions
              </h4>
              <div className="relative">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {displayedQuestions.map((relatedQ) => (
                    <motion.div
                      key={`related-q-${relatedQ.id}`}
                      className="p-4 bg-secondary-background rounded-lg border border-gray-200 hover:accent-action-buttons-hover cursor-pointer"
                      whileHover={{ scale: 1.02, backgroundColor: '#EEF2FF' }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <div className="flex flex-col items-center text-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            relatedQ.difficulty === 'Hard'
                              ? 'bg-red-100 text-red-800'
                              : relatedQ.difficulty === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {relatedQ.difficulty}
                        </span>
                        <Latex className="font-medium">
                          {relatedQ.text || ''}
                        </Latex>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <AnimatePresence>
                  {question.relatedQuestions.length > 3 && (
                    <>
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white rounded-full shadow-lg p-2"
                        onClick={prevQuestionCarousel}
                        aria-label="Previous questions"
                      >
                        <ChevronLeft className="h-5 w-5 text-primary" />
                      </motion.button>
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white rounded-full shadow-lg p-2"
                        onClick={nextQuestionCarousel}
                        aria-label="Next questions"
                      >
                        <ChevronRight className="h-5 w-5 text-primary" />
                      </motion.button>
                    </>
                  )}
                </AnimatePresence>

                {question.relatedQuestions.length > 3 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({
                      length: Math.ceil(question.relatedQuestions.length / 3),
                    }).map((_, index) => (
                      <button
                        key={`question-dot-${index}`}
                        className={`w-2 h-2 rounded-full ${index === Math.floor(questionCarouselIndex / 3) ? 'bg-primary' : 'bg-gray-300'}`}
                        onClick={() => setQuestionCarouselIndex(index * 3)}
                        aria-label={`Go to question set ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}

function HomeworkQuestionsSection({ questions, onQuestionClick }) {
  return (
    <motion.div
      className="w-full lg:w-1/4"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex flex-col gap-2"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {questions.map((question, index) => (
          <motion.div
            key={`question-${index}`}
            className={`flex items-start gap-2 cursor-pointer p-3 rounded-lg relative ${
              question.active ? 'text-primary' : 'hover:bg-gray-50'
            }`}
            onClick={() => onQuestionClick(index)}
            whileHover={{ scale: question.active ? 1 : 1.02 }}
            variants={stepAnimation}
          >
            <div className="flex items-start gap-2 w-full bg-secondary-background rounded-md p-2">
              <p
                className={`text-base font-medium ${question.active ? 'text-primary' : 'text-gray-700'}`}
              >
                {question.number}
              </p>
              <Latex
                className={`text-base font-medium ${question.active ? 'text-primary' : 'text-gray-700'}`}
              >
                {question.text || ''}
              </Latex>
            </div>
            {question.active && <ChevronsLeft className="w-7 h-7 text-black" />}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

const ErrorDisplay = ({ questionText, errorMessage }) => {
  return (
    <motion.div
      className="mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center text-center justify-center gap-5">
        <div className="p-3 rounded-full">
          <Image
            src="/images/logos/ai_tutor.png"
            alt="AI Tutor"
            width={40}
            height={40}
            className="object-contain w-full h-full"
            priority
          />
        </div>
        <h3 className="text-lg font-bold text-red-800">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-700">
          We're facing some difficulty while fetching the solution for:
        </p>
        <div className="bg-gray-100 p-3 rounded-lg w-full">
          <Latex>{questionText || 'This question'}</Latex>
        </div>
        {errorMessage && (
          <p className="text-sm text-gray-600 mt-2">
            Error:{' '}
            {errorMessage.split(':').slice(1).join(':').trim() ||
              'Unknown error'}
          </p>
        )}
        <Button
          variant="outline"
          className="mt-4 border-red-300 text-red-700 hover:bg-red-100"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    </motion.div>
  );
};
