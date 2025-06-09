"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useAiExtractQuestionMutation, useAiMathTutorRelatedQuestionsMutation } from '@/store/slices/AMT';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { setAnswer, setQuestion } from '@/store/reducers/AMT';

const MathTutorFeedback = () => {
    const router = useRouter();
    const studentFeedbackReport = useSelector(
        (state) => state?.aiMathTutor?.solutionFeedback || {}
    );

    const [currentState, setCurrentState] = useState('almostThere');
    const [feedbackData, setFeedbackData] = useState(null);
    const [relatedQuestions, setRelatedQuestions] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const dispatch = useDispatch();

    const [
        getRelatedQuestions,
        { data: questionsApiData, isLoading: questionsLoading },
    ] = useAiMathTutorRelatedQuestionsMutation();

    const [extractQuestionAndAnswers,
        { data: promptList, isLoading: isExtractingApi, error: extractionApiError }
    ] = useAiExtractQuestionMutation();

    useEffect(() => {
        if (studentFeedbackReport) {
            const { help_count, total_time_minutes, difficulty_level, student_feedback_report } = studentFeedbackReport;

            let newState = 'almostThere';

            if (help_count <= 2 && total_time_minutes < 300 && difficulty_level === 'easy') {
                newState = 'solvedPro';
            } else if (student_feedback_report?.is_solution_complete) {
                newState = 'wellDone';
            } else {
                newState = 'almostThere';
            }

            setCurrentState(newState);

            let timeDisplay = '';
            let timeSubtext = '';

            if (total_time_minutes < 60) {
                timeDisplay = `${total_time_minutes} secs`;
                timeSubtext = total_time_minutes < 30 ? "That was quick!" : "Good pace!";
            } else {
                const minutes = Math.floor(total_time_minutes / 60);
                const seconds = total_time_minutes % 60;
                timeDisplay = `${minutes}:${seconds < 10 ? '0' + seconds : seconds} mins`;
                timeSubtext = minutes < 5 ? "Good pace!" : "Take your time to understand each step";
            }

            const newFeedbackData = {
                title: getTitle(newState),
                titleIcon: getTitleIcon(newState),
                timeTaken: timeDisplay,
                timeSubtext: timeSubtext,
                helpCount: help_count.toString(),
                helpSubtext: getHelpSubtext(help_count),
                complexity: capitalizeFirstLetter(difficulty_level),
                complexitySubtext: getComplexitySubtext(difficulty_level, newState),
                mainMessage: student_feedback_report?.feedback || "Great effort on tackling this problem!",
                subMessage: getSubMessage(newState, difficulty_level),
                buttonText: getButtonText(newState),
                questionText: "What feels right for you?",
                options: getOptions(newState, difficulty_level)
            };

            setFeedbackData(newFeedbackData);
        }
    }, [studentFeedbackReport]);

    useEffect(() => {
        if (questionsApiData) {
            setRelatedQuestions(questionsApiData.data);
            toast.success('Found related questions!');
        }
    }, [questionsApiData]);

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

    const capitalizeFirstLetter = (string) => {
        return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
    };

    const getTitle = (state) => {
        switch (state) {
            case 'solvedPro':
                return "Solved like a pro!";
            case 'wellDone':
                return "Well done reaching the answer!";
            default:
                return "You are almost there!";
        }
    };

    const getTitleIcon = (state) => {
        switch (state) {
            case 'solvedPro':
                return "💪🎉";
            case 'wellDone':
                return "🎉";
            default:
                return "💪";
        }
    };

    const getHelpSubtext = (helpCount) => {
        if (helpCount === 0) return "That's Awesome!";
        if (helpCount <= 2) return "Good job working through it!";
        return "Keep practicing and you'll need less help";
    };

    const getComplexitySubtext = (difficulty, state) => {
        if (state === 'solvedPro') return "Bravo! You solved it with ease";
        if (difficulty === 'easy') return "Great for building confidence";
        if (difficulty === 'medium') return "Challenge! You're improving!";
        return "Tough problem - great effort!";
    };

    const getSubMessage = (state, difficulty) => {
        if (state === 'solvedPro') {
            return "Let's build on this win—your next challenge is ready!";
        } else if (state === 'wellDone') {
            return "With a bit more practice, you'll master these concepts in no time!";
        } else {
            return "Review the steps and try again - you're getting closer!";
        }
    };

    const getButtonText = (state) => {
        switch (state) {
            case 'solvedPro':
                return "See an optimised approach";
            case 'wellDone':
                return "Deep dive into your solution";
            default:
                return "See where I slipped & how to fix it";
        }
    };

    const getOptions = (state, difficulty) => {
        const baseOptions = [
            {
                id: 'tryAgain',
                icon: <Image
                    src="/images/icons/try-again.png"
                    width={28}
                    height={28}
                    className='w-7 h-7 object-contain'
                    alt="Try again"
                    loading="eager"
                />,
                title: 'Try Again',
                subtitle: "Let's go back and get you that victory."
            },
            {
                id: 'buildConfidence',
                icon: <Image
                    src="/images/icons/build-confidence.png"
                    width={28}
                    height={28}
                    className='w-7 h-7 object-contain'
                    alt="Build confidence"
                    loading="lazy"
                />,
                title: 'Build Confidence First',
                subtitle: 'Practice similar concepts with easier problems first.'
            },
            {
                id: 'practiceSimilar',
                icon: <Image
                    src="/images/icons/writing-hand.png"
                    width={28}
                    height={28}
                    className='w-7 h-7 object-contain'
                    alt="Practice similar"
                    loading="lazy"
                />,
                title: 'Practice Similar Questions',
                subtitle: 'Practice similar problems to reinforce what you just learned'
            },
            {
                id: 'levelUp',
                icon: <Image
                    src="/images/icons/bolt.png"
                    width={28}
                    height={28}
                    className='w-7 h-7 object-contain'
                    alt="Level up"
                    loading="lazy"
                />,
                title: 'Level Up',
                subtitle: 'Practice similar but harder problems to push your skills further.'
            },
            {
                id: 'goBack',
                icon: <Image
                    src="/images/icons/back.png"
                    width={28}
                    height={28}
                    className='w-7 h-7 object-contain'
                    alt="Go back"
                    loading="lazy"
                />,
                title: 'Go back to submitted problems',
                subtitle: 'Pick another from set of submitted question'
            },
            {
                id: 'submitNew',
                icon: <Image
                    src="/images/icons/submit-new-question.png"
                    width={28}
                    height={28}
                    className='w-7 h-7 object-contain'
                    alt="Submit new"
                    loading="lazy"
                />,
                title: 'Submit new Questions',
                subtitle: 'Type, upload or snap a new set of questions and start solving'
            }
        ];

        let filteredOptions = [];
        let recommendedId = '';

        if (state === 'solvedPro') {
            filteredOptions = baseOptions.filter(opt =>
                ['practiceSimilar', 'levelUp', 'goBack', 'submitNew'].includes(opt.id)
            );
            recommendedId = 'practiceSimilar';
        } else if (state === 'wellDone') {
            filteredOptions = baseOptions.filter(opt =>
                ['levelUp', 'practiceSimilar', 'goBack', 'submitNew'].includes(opt.id)
            );
            recommendedId = difficulty === 'easy' ? 'levelUp' : 'practiceSimilar';
        } else {
            filteredOptions = baseOptions.filter(opt =>
                ['tryAgain', 'buildConfidence', 'practiceSimilar', 'goBack'].includes(opt.id)
            );
            recommendedId = 'tryAgain';
        }

        return filteredOptions.map(opt => ({
            ...opt,
            recommended: opt.id === recommendedId
        }));
    };

    const getHeaderColor = () => {
        switch (currentState) {
            case 'solvedPro':
            case 'wellDone':
                return 'text-[#0FB004]/75';
            default:
                return 'text-[#EA9C02]/75';
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const statCardVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const optionCardVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.02,
            y: -2,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        tap: {
            scale: 0.98,
            transition: {
                duration: 0.1
            }
        }
    };

    const titleVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const questionItemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        }),
        hover: {
            scale: 1.02,
            backgroundColor: "#f0f4ff",
            transition: {
                duration: 0.2
            }
        }
    };

    const StatCard = ({ title, value, subtitle, valueColor = "text-black", index }) => (
        <motion.article
            className=""
            variants={statCardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
            }}
            role="region"
            aria-label={`${title}: ${value}, ${subtitle}`}
        >
            <div className='flex flex-row gap-2 align-middle items-center mb-2'>
                <motion.h3
                    className="text-[16px] font-bold mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                >
                    {title}
                </motion.h3>
                <motion.div
                    className={`text-[16px] font-bold bg-[#FFF0F0] p-1 ${valueColor}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        delay: 0.4 + index * 0.1,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 200
                    }}
                    aria-label={`Value: ${value}`}
                >
                    {value}
                </motion.div>
            </div>
            <motion.p
                className="text-[14px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
            >
                {subtitle}
            </motion.p>
        </motion.article>
    );

    const OptionCard = ({ option, onClick, index }) => (
        <motion.div
            variants={optionCardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            transition={{ delay: index * 0.1 }}
        >
            <Card
                className={`cursor-pointer transition-all border-none shadow-none rounded-sm focus-within:ring-2 focus-within:ring-blue-500 ${option.recommended ? 'bg-[#E0F1F3]' : 'bg-[#F5F7FF]'
                    }`}
                onClick={() => onClick(option.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClick(option.id);
                    }
                }}
                aria-label={`${option.title}: ${option.subtitle}`}
            >
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <motion.div
                            whileHover={{
                                rotate: 10,
                                scale: 1.1,
                                transition: { duration: 0.2 }
                            }}
                        >
                            {option.icon}
                        </motion.div>
                        <div className="flex-1">
                            <div className="flex gap-2">
                                <motion.h3
                                    className="font-bold text-lg"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + index * 0.05 }}
                                >
                                    {option.title}
                                </motion.h3>
                                {option.recommended && (
                                    <motion.span
                                        className="text-xs bg-[#F9FFF6] text-[#7D807B] px-2 py-1 rounded-sm"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            delay: 0.3 + index * 0.05,
                                            type: "spring",
                                            stiffness: 200
                                        }}
                                        aria-label="Recommended option"
                                    >
                                        Recommended
                                    </motion.span>
                                )}
                            </div>
                            <motion.p
                                className="text-[17px] text-gray-500 mt-1"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.25 + index * 0.05 }}
                            >
                                {option.subtitle}
                            </motion.p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    const handleOptionClick = async (optionId) => {
        setSelectedOption(optionId);

        if (optionId === 'tryAgain' || optionId === 'goBack') {
            router.back();
            return;
        }

        if (optionId === 'submitNew') {
            router.push('/ai-math-tutor');
            return;
        }

        if (optionId === 'practiceSimilar' || optionId === 'levelUp' || optionId === 'buildConfidence') {
            const level = optionId === 'levelUp' ? 'LEVEL_UP' :
                optionId === 'buildConfidence' ? 'LEVEL_DOWN' : 'SAME';

            const relatedQuestionsToastId = toast.loading(
                optionId === 'levelUp' ? 'Finding challenging questions...' :
                    optionId === 'buildConfidence' ? 'Finding easier questions...' :
                        'Finding similar questions...',
                { id: 'related-questions-toast' }
            );

            try {
                await getRelatedQuestions({
                    query: studentFeedbackReport?.question[0],
                    limit: 10,
                    level: level,
                    difficulty_level: studentFeedbackReport.difficulty_level,
                    feature: "AMT"
                });
            } catch (error) {
                toast.error('Failed to fetch related questions', { id: relatedQuestionsToastId });
                console.error('Error fetching related questions:', error);
            } finally {
                 toast.dismiss('related-questions-toast');
            }
        }
    };

    const handleQuestionClick = async (question) => {
        const extractionToastId = toast.loading('Processing your question...', { id: 'extraction-toast' });

        try {
            const filesDataForApi = [{
                data: question,
                input_type: 'text',
                file_url: 'no_file_text_input',
            }];

            await extractQuestionAndAnswers({
                model_name: 'alpha',
                inputs: filesDataForApi
            });

        } catch (error) {
            console.error('Question processing error:', error);
            toast.error('Failed to process question. Please try again.', { id: extractionToastId });
        } finally {
            toast.dismiss('extraction-toast')
        }
    };


    const handleButtonClick = () => {
        console.log('Main button clicked');
    };

    if (!feedbackData) {
        return <div className="min-h-screen p-8 flex items-center justify-center">Loading feedback...</div>;
    }

    return (
        <main className="min-h-screen p-8" role="main">
            <div className="border border-gray-100 shadow-md p-14">
                <AnimatePresence mode="wait">
                    <motion.section
                        key={currentState}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={containerVariants}
                        className="mb-8"
                        role="region"
                        aria-label="Math problem feedback summary"
                    >
                        <motion.h1
                            className={`text-[25px] font-bold mb-6 ${getHeaderColor()}`}
                            variants={titleVariants}
                        >
                            {feedbackData.title} {feedbackData.titleIcon}
                        </motion.h1>

                        <motion.article
                            key={currentState}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={containerVariants}
                            className="p-4 shadow-md bg-[#FFF0F0]/30 rounded-md"
                            role="region"
                            aria-label="Performance statistics and feedback"
                        >
                            <motion.div
                                className="flex flex-row justify-between mb-6"
                                variants={itemVariants}
                                role="group"
                                aria-label="Problem solving statistics"
                            >
                                <StatCard
                                    title="Time Taken :"
                                    value={feedbackData.timeTaken}
                                    subtitle={feedbackData.timeSubtext}
                                    index={0}
                                />
                                <StatCard
                                    title="Help Count :"
                                    value={feedbackData.helpCount}
                                    subtitle={feedbackData.helpSubtext}
                                    valueColor={feedbackData.helpCount === "0" ? "text-green-600" : "text-black"}
                                    index={1}
                                />
                                <StatCard
                                    title="Complexity level of Question :"
                                    value={feedbackData.complexity}
                                    subtitle={feedbackData.complexitySubtext}
                                    index={2}
                                />
                            </motion.div>

                            <motion.div
                                className="mb-4"
                                variants={itemVariants}
                            >
                                <motion.p
                                    className="text-[16px] leading-relaxed font-medium"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <Latex>{feedbackData.mainMessage}</Latex>
                                </motion.p>
                                {feedbackData.subMessage && (
                                    <motion.p
                                        className="text-[16px] leading-relaxed mt-2 font-medium"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <Latex>{feedbackData.subMessage}</Latex>
                                    </motion.p>
                                )}
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant="outline"
                                    className="border-gray-700 text-gray-700 hover:bg-gray-100 shadow-none focus:ring-2 focus:ring-blue-500"
                                    onClick={handleButtonClick}
                                    aria-label={`${feedbackData.buttonText} - View detailed solution analysis`}
                                >
                                    {feedbackData.buttonText}
                                    <motion.div
                                        animate={{ x: [0, 3, 0] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.5,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </motion.div>
                                </Button>
                            </motion.div>
                        </motion.article>
                    </motion.section>
                </AnimatePresence>

                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    role="region"
                    aria-label="Next steps and learning options"
                >
                    <motion.h2
                        className="text-[25px] font-bold text-[#1F33E8] mb-6"
                        variants={itemVariants}
                    >
                        <Latex>{feedbackData.questionText}</Latex>
                    </motion.h2>

                    <motion.div
                        className="grid grid-cols-2 gap-4"
                        variants={containerVariants}
                        role="group"
                        aria-label="Available learning options"
                    >
                        {feedbackData.options.map((option, index) => (
                            <OptionCard
                                key={`${currentState}-${option.id}`}
                                option={option}
                                onClick={handleOptionClick}
                                index={index}
                            />
                        ))}
                    </motion.div>
                </motion.section>

                {relatedQuestions && (
                    <motion.section
                        className="mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.h3
                            className="text-2xl font-bold mb-6 text-gray-800 text-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {selectedOption === 'levelUp' ? '🚀 Challenge Yourself' :
                                selectedOption === 'buildConfidence' ? '💪 Build Your Confidence' :
                                    '📚 Practice Similar Questions'}
                        </motion.h3>

                        <motion.div
                            className="space-y-8"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                        >
                            {relatedQuestions.map((category, catIndex) => (
                                <motion.div
                                    key={`cat-${catIndex}`}
                                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg"
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                duration: 0.5
                                            }
                                        }
                                    }}
                                >
                                    <motion.div
                                        className="flex items-center justify-center mb-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 + catIndex * 0.05 }}
                                    >
                                        <div className={`px-6 py-2 rounded-full text-white font-semibold text-lg ${category.difficulty === 'easy' ? 'bg-green-500' :
                                                category.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}>
                                            {category.difficulty === 'easy' ? '🟢 Easy Level' :
                                                category.difficulty === 'medium' ? '🟡 Medium Level' : '🔴 Hard Level'}
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                        variants={{
                                            hidden: { opacity: 0 },
                                            visible: {
                                                opacity: 1,
                                                transition: {
                                                    staggerChildren: 0.05
                                                }
                                            }
                                        }}
                                    >
                                        {category.questions.map((question, qIndex) => (
                                            <motion.div
                                                key={`q-${catIndex}-${qIndex}`}
                                                custom={qIndex}
                                                initial="hidden"
                                                animate="visible"
                                                variants={{
                                                    hidden: { opacity: 0, y: 20, scale: 0.9 },
                                                    visible: (i) => ({
                                                        opacity: 1,
                                                        y: 0,
                                                        scale: 1,
                                                        transition: {
                                                            delay: i * 0.05,
                                                            duration: 0.4,
                                                            ease: "easeOut"
                                                        }
                                                    })
                                                }}
                                                whileHover={{
                                                    scale: 1.03,
                                                    y: -5,
                                                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                                                    transition: { duration: 0.2 }
                                                }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleQuestionClick(question)}
                                                className="bg-white rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:shadow-xl border border-gray-100 h-32 flex flex-col justify-between"
                                            >
                                                <div className="p-4 flex-1 flex flex-col justify-center">
                                                    <div className="flex items-start mb-2">
                                                        <div className="flex-shrink-0 mr-3">
                                                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                                                <span className="text-white text-sm font-bold">
                                                                    {qIndex + 1}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-gray-800 font-medium text-sm leading-tight line-clamp-3">
                                                                <Latex>{question}</Latex>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="px-4 pb-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-500 font-medium">
                                                            Click to solve
                                                        </span>
                                                        <motion.div
                                                            animate={{ x: [0, 3, 0] }}
                                                            transition={{
                                                                repeat: Infinity,
                                                                duration: 2,
                                                                ease: "easeInOut"
                                                            }}
                                                        >
                                                            <ChevronRight className="w-4 h-4 text-blue-500" />
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.section>
                )}
            </div>
        </main>
    );
};

export default MathTutorFeedback;