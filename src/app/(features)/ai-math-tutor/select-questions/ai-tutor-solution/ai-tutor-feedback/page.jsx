"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2, CheckCircle2, XCircle, ChevronUp, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useAiExtractQuestionMutation, useAiMathTutorRelatedQuestionsMutation, useStudentSolutionReportMutation } from '@/store/slices/AMT';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { setAnswer, setQuestion } from '@/store/reducers/AMT';
import Head from 'next/head';

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
        { data: questionsApiData, isLoading: questionsLoading, error: relatedQuestionsError },
    ] = useAiMathTutorRelatedQuestionsMutation();

    const [
        extractQuestionAndAnswers,
        { data: promptList, isLoading: isExtractingApi, error: extractionApiError }
    ] = useAiExtractQuestionMutation();

    const [
        sendSolutionReport,
        { isLoading: isSendingReport, error: studentSolutionReportErrorApi } // Renamed to avoid conflict
    ] = useStudentSolutionReportMutation();

    // State for solution report display
    const [solutionReportData, setSolutionReportData] = useState(null);
    const [showSolutionReport, setShowSolutionReport] = useState(false);
    const [activeAccordionTab, setActiveAccordionTab] = useState(null);
    const [openExplanationStepIndex, setOpenExplanationStepIndex] = useState(-1);


    useEffect(() => {
        if (studentFeedbackReport && Object.keys(studentFeedbackReport).length > 0) {
            const {
                help_count,
                total_time_minutes: total_time_seconds,
                difficulty_level,
                student_feedback_report: sfr
            } = studentFeedbackReport;

            let newState = 'almostThere';

            if (sfr?.is_solution_complete === false) {
                newState = 'almostThere';
            } else if (typeof help_count === 'number' && help_count <= 2 && typeof total_time_seconds === 'number' && total_time_seconds < 300 && difficulty_level === 'easy') {
                newState = 'solvedPro';
            } else {
                newState = 'wellDone';
            }
            setCurrentState(newState);

            let timeDisplay = '';
            let timeSubtext = '';
            const timeInSeconds = total_time_seconds || 0;

            if (timeInSeconds < 60) {
                timeDisplay = `${timeInSeconds} secs`;
                timeSubtext = timeInSeconds < 30 ? "That was quick!" : "Good pace!";
            } else {
                const minutes = Math.floor(timeInSeconds / 60);
                const seconds = timeInSeconds % 60;
                timeDisplay = `${minutes}:${seconds < 10 ? '0' + seconds : seconds} mins`;
                timeSubtext = minutes < 5 ? "Good pace!" : "Take your time to understand each step";
            }

            const currentHelpCount = typeof help_count === 'number' ? help_count : 0;

            const newFeedbackData = {
                title: getTitle(newState),
                titleIcon: getTitleIcon(newState),
                timeTaken: timeDisplay,
                timeSubtext: timeSubtext,
                helpCount: currentHelpCount.toString(),
                helpSubtext: getHelpSubtext(currentHelpCount),
                complexity: capitalizeFirstLetter(difficulty_level || 'unknown'),
                complexitySubtext: getComplexitySubtext(difficulty_level || 'unknown', newState),
                mainMessage: sfr?.feedback || "Great effort on tackling this problem!",
                subMessage: getSubMessage(newState, difficulty_level || 'unknown'),
                buttonText: getButtonText(newState),
                questionText: "What feels right for you ?",
                options: getOptions(newState, difficulty_level || 'unknown', sfr?.recommend_flag)
            };
            setFeedbackData(newFeedbackData);
        }
    }, [studentFeedbackReport]);

    useEffect(() => {
        if (questionsApiData) {
            setRelatedQuestions(questionsApiData.data);
            toast.success('Found related questions!');
        }
        if (relatedQuestionsError) {
            toast.error('Failed to fetch related questions. Please try again.');
        }
    }, [questionsApiData, relatedQuestionsError]);

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
        if (extractionApiError) {
            toast.dismiss('extraction-toast');
            toast.error("Failed to process question. Please try again.");
        }
    }, [promptList, extractionApiError, dispatch, router]);

    const capitalizeFirstLetter = (string) => {
        return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
    };

    const getTitle = (state) => {
        switch (state) {
            case 'solvedPro': return "Solved like a pro, Annie!";
            case 'wellDone': return "Well done reaching the answer, Annie !";
            default: return "You are almost there, Annie !";
        }
    };

    const getTitleIcon = (state) => {
        switch (state) {
            case 'solvedPro': return "💪🎉";
            case 'wellDone': return "🎉";
            default: return "💪";
        }
    };

    const getHelpSubtext = (helpCount) => {
        if (helpCount === 0) return "That's Awesome!";
        if (helpCount <= 2) return "Good job working through it!";
        return "Keep practicing and you'll need less help";
    };

    const getComplexitySubtext = (difficulty, state) => {
        if (state === 'solvedPro') return "Bravo ! You solved it";
        if (difficulty === 'easy') return "Great for building confidence";
        if (difficulty === 'medium') return "Challenge ! You are improving !";
        if (difficulty === 'high') return "Tough problem - great effort!";
        return "Great effort tackling this problem!";
    };

    const getSubMessage = (state, difficulty) => {
        if (state === 'solvedPro') {
            return "Confidence, speed, accuracy—today, you brought it all. 💪 Let's build on this win—your next challenge is ready!";
        } else if (state === 'wellDone') {
            return `You gave it a solid try — and that's what real learning is all about. With a quick concept refresh on ${studentFeedbackReport?.student_feedback_report?.concept_to_refresh || 'the key concept'}, you'll be ready to tackle this confidently next time. 💡`;
        } else {
            return `You tackled a challenging problem and made real progress. That takes courage! ${studentFeedbackReport?.student_feedback_report?.specific_feedback || "Review the steps and try again - you're getting closer!"}`;
        }
    };

    const getButtonText = (state) => {
        switch (state) {
            case 'solvedPro': return "See an optimised approach";
            case 'wellDone': return "Deep dive into your solution";
            default: return "See where I slipped & how to fix it";
        }
    };

    const getOptions = (state, difficulty, recommendFlag) => {
        const baseOptions = [
            { id: 'tryAgain', icon: <Image src="/images/icons/try-again.png" width={28} height={28} className='w-7 h-7 object-contain' alt="Try again" loading="eager" />, title: 'Try Again', subtitle: "Let's go back and get you that victory." },
            { id: 'buildConfidence', icon: <Image src="/images/icons/build-confidence.png" width={28} height={28} className='w-7 h-7 object-contain' alt="Build confidence" loading="lazy" />, title: 'Build Confidence First', subtitle: 'Practice similar concepts with easier problems first.' },
            { id: 'practiceSimilar', icon: <Image src="/images/icons/writing-hand.png" width={28} height={28} className='w-7 h-7 object-contain' alt="Practice similar" loading="lazy" />, title: 'Practice Similar Questions', subtitle: 'Practice similar problems to reinforce what you just learned' },
            { id: 'levelUp', icon: <Image src="/images/icons/bolt.png" width={28} height={28} className='w-7 h-7 object-contain' alt="Level up" loading="lazy" />, title: 'Level Up', subtitle: 'Practice similar but harder problems to push your skills further.' },
            { id: 'goBack', icon: <Image src="/images/icons/back.png" width={28} height={28} className='w-7 h-7 object-contain' alt="Go back" loading="lazy" />, title: 'Go back to submitted problems', subtitle: 'Pick another from set of submitted question' },
            { id: 'submitNew', icon: <Image src="/images/icons/submit-new-question.png" width={28} height={28} className='w-7 h-7 object-contain' alt="Submit new" loading="lazy" />, title: 'Submit new Questions', subtitle: 'Type, upload or snap a new set of questions and start solving' }
        ];
        let filteredOptionIds = [];
        if (state === 'solvedPro') filteredOptionIds = ['practiceSimilar', 'levelUp', 'goBack', 'submitNew'];
        else if (state === 'wellDone') filteredOptionIds = ['levelUp', 'practiceSimilar', 'goBack', 'submitNew'];
        else filteredOptionIds = ['tryAgain', 'buildConfidence', 'practiceSimilar', 'goBack'];

        let recommendedOptionId = '';
        if (recommendFlag === 'try_again') recommendedOptionId = 'tryAgain';
        else if (recommendFlag === 'similar_questions') recommendedOptionId = 'practiceSimilar';
        else if (recommendFlag === 'level_up') recommendedOptionId = 'levelUp';

        if (!recommendedOptionId || !filteredOptionIds.includes(recommendedOptionId)) {
            if (state === 'solvedPro') recommendedOptionId = 'practiceSimilar';
            else if (state === 'wellDone') recommendedOptionId = (difficulty === 'easy' ? 'levelUp' : 'practiceSimilar');
            else recommendedOptionId = 'tryAgain';
        }
        return baseOptions.filter(opt => filteredOptionIds.includes(opt.id)).map(opt => ({ ...opt, recommended: opt.id === recommendedOptionId }));
    };

    const getHeaderColor = () => {
        switch (currentState) {
            case 'solvedPro': case 'wellDone': return 'text-[#0FB004]/75';
            default: return 'text-[#EA9C02]/75';
        }
    };

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
    const statCardVariants = { hidden: { opacity: 0, scale: 0.8, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
    const optionCardVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }, hover: { scale: 1.02, y: -2, transition: { duration: 0.2, ease: "easeInOut" } }, tap: { scale: 0.98, transition: { duration: 0.1 } } };
    const titleVariants = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } };

    const StatCard = ({ title, value, subtitle, valueColor = "text-black", index }) => (
        <motion.article variants={statCardVariants} initial="hidden" animate="visible" transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05, transition: { duration: 0.2 } }} role="region" aria-label={`${title}: ${value}, ${subtitle}`}>
            <div className='flex flex-row gap-2 align-middle items-center mb-2'>
                <motion.h3 className="text-[16px] font-bold mb-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + index * 0.1 }}>{title}</motion.h3>
                <motion.div className={`text-[16px] font-bold bg-[#FFF0F0] p-1 ${valueColor}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + index * 0.1, duration: 0.5, type: "spring", stiffness: 200 }} aria-label={`Value: ${value}`}>{value}</motion.div>
            </div>
            <motion.p className="text-[14px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + index * 0.1 }}>{subtitle}</motion.p>
        </motion.article>
    );

    const OptionCard = ({ option, onClick, index }) => (
        <motion.div variants={optionCardVariants} initial="hidden" animate="visible" whileHover="hover" whileTap="tap" transition={{ delay: index * 0.1 }}>
            <Card className={`cursor-pointer transition-all border-none shadow-none rounded-sm focus-within:ring-2 focus-within:ring-blue-500 ${option.recommended ? 'bg-[#E0F1F3]' : 'bg-[#F5F7FF]'}`} onClick={() => onClick(option.id)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(option.id); } }} aria-label={`${option.title}: ${option.subtitle}`}>
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <motion.div whileHover={{ rotate: 10, scale: 1.1, transition: { duration: 0.2 } }}>{option.icon}</motion.div>
                        <div className="flex-1">
                            <div className="flex gap-2 items-center">
                                <motion.h3 className="font-bold text-lg" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.05 }}>{option.title}</motion.h3>
                                {option.recommended && (<motion.span className="text-xs bg-[#F9FFF6] text-[#7D807B] px-2 py-1 rounded-sm" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + index * 0.05, type: "spring", stiffness: 200 }} aria-label="Recommended option">Recommended</motion.span>)}
                            </div>
                            <motion.p className="text-[17px] text-gray-500 mt-1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + index * 0.05 }}>{option.subtitle}</motion.p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    const handleOptionClick = async (optionId) => {
        setSelectedOption(optionId);
        if (optionId === 'tryAgain' || optionId === 'goBack') { router.back(); return; }
        if (optionId === 'submitNew') { router.push('/ai-math-tutor'); return; }
        if (['practiceSimilar', 'levelUp', 'buildConfidence'].includes(optionId)) {
            const level = optionId === 'levelUp' ? 'LEVEL_UP' : optionId === 'buildConfidence' ? 'LEVEL_DOWN' : 'SAME';
            const toastId = toast.loading(optionId === 'levelUp' ? 'Finding challenging questions...' : optionId === 'buildConfidence' ? 'Finding easier questions...' : 'Finding similar questions...');
            try {
                await getRelatedQuestions({ query: studentFeedbackReport?.question?.[0] || "", limit: 10, level: level, difficulty_level: studentFeedbackReport?.difficulty_level || "medium", feature: "AMT" }).unwrap();
            } catch (error) { console.error('Error fetching related questions:', error); /* Toast handled by useEffect */ }
            finally { toast.dismiss(toastId); }
        }
    };

    const handleQuestionClick = async (question) => {
        const toastId = toast.loading('Processing your question...');
        try {
            await extractQuestionAndAnswers({ model_name: 'alpha', inputs: [{ data: question, input_type: 'text', file_url: 'no_file_text_input' }] }).unwrap();
        } catch (error) { console.error('Question processing error:', error); /* Toast handled by useEffect */ }
        // finally { toast.dismiss(toastId); } // Toast dismissal handled by useEffect for promptList
    };

    const handleMainButtonClick = async () => {
        if (!studentFeedbackReport || !studentFeedbackReport.question_id) {
            toast.error("Cannot proceed: Missing question data.");
            return;
        }
        const payload = {
            question_id: studentFeedbackReport.question_id,
            question: studentFeedbackReport.question?.[0] || "N/A",
            question_url: studentFeedbackReport.question_url || "N/A",
            solution_url: studentFeedbackReport.solution_url || window.location.href, // Placeholder if not available
        };
        const reportToastId = toast.loading("Fetching solution analysis...");
        try {
            const response = await sendSolutionReport(payload).unwrap();
            if (response && response.status_code === 200 && response.data && response.data.response) {
                setSolutionReportData(response.data.response);
                setShowSolutionReport(true);
                setActiveAccordionTab('yourSolution'); // Default open
                toast.success("Solution analysis loaded!", { id: reportToastId });
            } else {
                toast.error(response?.data?.error?.[0] || "Failed to load solution analysis. Invalid response.", { id: reportToastId });
            }
        } catch (error) {
            toast.error(error?.data?.message || "Failed to fetch solution analysis. Please try again.", { id: reportToastId });
            console.error('Error fetching solution report:', error);
        }
    };

    const SolutionReportDisplay = () => {
        if (!showSolutionReport || !solutionReportData) return null;

        const toggleAccordionTab = (tabName) => {
            setActiveAccordionTab(activeAccordionTab === tabName ? null : tabName);
            setOpenExplanationStepIndex(-1);
        };
        const toggleExplanation = (index) => {
            setOpenExplanationStepIndex(openExplanationStepIndex === index ? -1 : index);
        };

        return (
            <motion.section className="mt-8 mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} aria-labelledby="solution-report-heading">
                <h2 id="solution-report-heading" className="text-2xl font-bold mb-6">Solution Analysis</h2>
                <div className="space-y-4">
                    <div>
                        <button onClick={() => toggleAccordionTab('yourSolution')} className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" aria-expanded={activeAccordionTab === 'yourSolution'} aria-controls="your-solution-content">
                            <span className="text-lg font-semibold">Your Solution</span>
                            {activeAccordionTab === 'yourSolution' ? <ChevronUp className="w-6 h-6 text-gray-600" /> : <ChevronDown className="w-6 h-6 text-gray-600" />}
                        </button>
                        <AnimatePresence>
                            {activeAccordionTab === 'yourSolution' && (
                                <motion.div id="your-solution-content" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="border border-t-0 border-gray-200 rounded-b-md p-4 bg-white">
                                    {(solutionReportData.steps && solutionReportData.steps.length > 0) ? (
                                        solutionReportData.steps.map((step, index) => (
                                            <div key={index} className="py-3 border-b border-gray-100 last:border-b-0">
                                                <div className="flex items-start space-x-3">
                                                    {step.are_both_steps_correct ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" /> : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />}
                                                    <div className="flex-grow">
                                                        <div className={`text-lg ${step.are_both_steps_correct ? 'text-gray-700' : 'text-red-600 line-through'}`}>
                                                            <Latex>{step.original_step || "N/A"}</Latex>
                                                        </div>
                                                        {!step.are_both_steps_correct && step.correct_step && (
                                                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                                                                <p className="text-sm font-semibold text-green-700 mb-1">Corrected Step:</p>
                                                                <div className="text-lg text-green-800"><Latex>{step.correct_step}</Latex></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {!step.are_both_steps_correct && step.explanation && (
                                                    <div className="mt-2 pl-8">
                                                        <div className="flex flex-row cursor-pointer align-middle items-center ml-1" onClick={() => toggleExplanation(index)}>
                                                            <span className="rounded-full w-1 h-1 bg-[#A3A6C1]/40"></span>
                                                            <span className="text-sm ml-0.5 text-[#192065]/40">Explanation</span>
                                                            {openExplanationStepIndex === index ? <ChevronUp className="w-4 h-4 ml-1 text-[#192065]/40" /> : <ChevronDown className="w-4 h-4 ml-1 text-[#192065]/40" />}
                                                        </div>
                                                        <AnimatePresence>
                                                            {openExplanationStepIndex === index && (
                                                                <motion.div id={`explanation-${index}`} initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded text-[16px]">
                                                                    <Latex>{step.explanation}</Latex>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : <p className="text-gray-500">No steps available for your solution.</p>}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div>
                        <button onClick={() => toggleAccordionTab('optimizedSolution')} className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" aria-expanded={activeAccordionTab === 'optimizedSolution'} aria-controls="optimized-solution-content">
                            <span className="text-lg font-semibold">Optimized Solution</span>
                            {activeAccordionTab === 'optimizedSolution' ? <ChevronUp className="w-6 h-6 text-gray-600" /> : <ChevronDown className="w-6 h-6 text-gray-600" />}
                        </button>
                        <AnimatePresence>
                            {activeAccordionTab === 'optimizedSolution' && (
                                <motion.div id="optimized-solution-content" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="border border-t-0 border-gray-200 rounded-b-md p-4 bg-white">
                                    {solutionReportData.optimized_solution_steps ? (
                                        <div className="prose prose-sm max-w-none"><Latex>{solutionReportData.optimized_solution_steps}</Latex></div>
                                    ) : <p className="text-gray-500">No optimized solution available.</p>}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.section>
        );
    };


    if (!feedbackData) {
        return (
            <><Head><title>Loading Feedback... | AI Math Tutor | MathzAI</title><meta name="robots" content="noindex" /></Head>
                <div className="min-h-screen p-8 flex items-center justify-center"><Loader2 className="mr-2 h-8 w-8 animate-spin" /> Loading feedback...</div></>
        );
    }
    const pageTitle = `${feedbackData.title || "Math Solution Feedback"} | AI Math Tutor | MathzAI`;
    const pageDescription = `Review your performance for the math problem: ${studentFeedbackReport?.question?.[0]?.substring(0, 100) + '...' || 'your recent problem'}. See stats and get suggestions for next steps with MathzAI.`;

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content="math feedback, math solution review, practice math, math performance, ai math tutor, mathzai" />
                <link rel="canonical" href="https://www.mathzai.com/ai-math-tutor/select-questions/ai-tutor-solution/ai-tutor-feedback" />
                <script type="application/ld+json">{`{ "@context": "https://schema.org", "@type": "WebPage", "name": "${pageTitle.replace(" | AI Math Tutor | MathzAI", "")}", "description": "${pageDescription}", "url": "https://www.mathzai.com/ai-math-tutor/select-questions/ai-tutor-solution/ai-tutor-feedback", "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [ { "@type": "ListItem", "position": 1, "name": "AI Math Tutor", "item": "https://www.mathzai.com/ai-math-tutor" }, { "@type": "ListItem", "position": 2, "name": "Select Questions", "item": "https://www.mathzai.com/ai-math-tutor/select-questions" }, { "@type": "ListItem", "position": 3, "name": "AI Tutor Solution", "item": "https://www.mathzai.com/ai-math-tutor/select-questions/ai-tutor-solution" }, { "@type": "ListItem", "position": 4, "name": "Solution Feedback" } ] }, "publisher": { "@type": "Organization", "name": "MathzAI" } ${feedbackData.options && feedbackData.options.length > 0 ? `, "mainEntity": { "@type": "ItemList", "name": "Recommended Next Steps", "itemListElement": [ ${feedbackData.options.map((opt, index) => `{ "@type": "ListItem", "position": ${index + 1}, "name": "${opt.title.replace(/"/g, '\\"')}", "description": "${opt.subtitle.replace(/"/g, '\\"')}" }`).join(',')} ] }` : ''} }`}</script>
            </Head>
            <main className="min-h-screen p-8" role="main">
                <div className="border border-gray-100 shadow-md p-14">
                    <AnimatePresence mode="wait">
                        <motion.section key={currentState} initial="hidden" animate="visible" exit="hidden" variants={containerVariants} className="mb-8" role="region" aria-label="Math problem feedback summary">
                            <motion.h1 className={`text-[25px] font-bold mb-6 ${getHeaderColor()}`} variants={titleVariants}>{feedbackData.title} {feedbackData.titleIcon}</motion.h1>
                            <motion.article key={`${currentState}-feedback`} initial="hidden" animate="visible" exit="hidden" variants={containerVariants} className="p-4 shadow-md bg-[#FFF0F0]/30 rounded-md" role="region" aria-label="Performance statistics and feedback">
                                <motion.div className="flex flex-row justify-between mb-6" variants={itemVariants} role="group" aria-label="Problem solving statistics">
                                    <StatCard title="Time Taken :" value={feedbackData.timeTaken} subtitle={feedbackData.timeSubtext} index={0} />
                                    <StatCard title="Help Count :" value={feedbackData.helpCount} subtitle={feedbackData.helpSubtext} valueColor={feedbackData.helpCount === "0" ? "text-green-600" : "text-black"} index={1} />
                                    <StatCard title="Complexity level of Question :" value={feedbackData.complexity} subtitle={feedbackData.complexitySubtext} index={2} />
                                </motion.div>
                                <motion.div className="mb-4" variants={itemVariants}>
                                    <motion.p className="text-[16px] leading-relaxed font-medium" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}><Latex>{feedbackData.mainMessage}</Latex></motion.p>
                                    {feedbackData.subMessage && (<motion.p className="text-[16px] leading-relaxed mt-2 font-medium" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}><Latex>{feedbackData.subMessage}</Latex></motion.p>)}
                                </motion.div>
                                <motion.div variants={itemVariants} className={showSolutionReport ? 'hidden' : ''}>
                                    <Button variant="outline" className="border-gray-700 text-gray-700 hover:bg-gray-100 shadow-none focus:ring-2 focus:ring-blue-500" onClick={handleMainButtonClick} disabled={isSendingReport} aria-label={`${feedbackData.buttonText} - View detailed solution analysis`}>
                                        {isSendingReport && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {feedbackData.buttonText}
                                        {!isSendingReport && (<motion.div animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}><ChevronRight className="w-4 h-4 ml-2" /></motion.div>)}
                                    </Button>
                                </motion.div>
                            </motion.article>
                        </motion.section>
                    </AnimatePresence>

                    <SolutionReportDisplay />

                    <motion.section
                        initial="hidden" animate="visible" variants={containerVariants} role="region" aria-label="Next steps and learning options">
                        <motion.h2 className="text-[25px] font-bold text-[#1F33E8] mb-6" variants={itemVariants}><Latex>{feedbackData.questionText}</Latex></motion.h2>
                        <motion.div className="grid grid-cols-2 gap-4" variants={containerVariants} role="group" aria-label="Available learning options">
                            {feedbackData.options.map((option, index) => (<OptionCard key={`${currentState}-${option.id}`} option={option} onClick={handleOptionClick} index={index} />))}
                        </motion.div>
                    </motion.section>

                    {(questionsLoading || (relatedQuestions && relatedQuestions.length > 0)) && (
                        <motion.section className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <motion.h3 className="text-2xl font-bold mb-6 text-gray-800 text-center" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                {questionsLoading ? <Loader2 className="inline mr-2 h-6 w-6 animate-spin" /> : ''}
                                {selectedOption === 'levelUp' ? '🚀 Challenge Yourself' : selectedOption === 'buildConfidence' ? '💪 Build Your Confidence' : '📚 Practice Similar Questions'}
                            </motion.h3>
                            {!questionsLoading && relatedQuestions && relatedQuestions.length > 0 && (
                                <motion.div className="space-y-8" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
                                    {relatedQuestions.map((category, catIndex) => (
                                        <motion.div key={`cat-${catIndex}`} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                                            <motion.div className="flex items-center justify-center mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + catIndex * 0.05 }}>
                                                <div className={`px-6 py-2 rounded-full text-white font-semibold text-lg ${category.difficulty === 'easy' ? 'bg-green-500' : category.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                                    {category.difficulty === 'easy' ? '🟢 Easy Level' : category.difficulty === 'medium' ? '🟡 Medium Level' : '🔴 Hard Level'}
                                                </div>
                                            </motion.div>
                                            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}>
                                                {category.questions.map((question, qIndex) => (
                                                    <motion.div key={`q-${catIndex}-${qIndex}`} custom={qIndex} initial="hidden" animate="visible" variants={{ hidden: { opacity: 0, y: 20, scale: 0.9 }, visible: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" } }) }} whileHover={{ scale: 1.03, y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)", transition: { duration: 0.2 } }} whileTap={{ scale: 0.98 }} onClick={() => handleQuestionClick(question)} className="bg-white rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:shadow-xl border border-gray-100 h-32 flex flex-col justify-between">
                                                        <div className="p-4 flex-1 flex flex-col justify-center">
                                                            <div className="flex items-start mb-2">
                                                                <div className="flex-shrink-0 mr-3"><div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"><span className="text-white text-sm font-bold">{qIndex + 1}</span></div></div>
                                                                <div className="flex-1"><p className="text-gray-800 font-medium text-sm leading-tight line-clamp-3"><Latex>{question}</Latex></p></div>
                                                            </div>
                                                        </div>
                                                        <div className="px-4 pb-3"><div className="flex items-center justify-between"><span className="text-xs text-gray-500 font-medium">Click to solve</span><motion.div animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} ><ChevronRight className="w-4 h-4 text-blue-500" /></motion.div></div></div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                            {!questionsLoading && relatedQuestions && relatedQuestions.length === 0 && (<p className="text-center text-gray-600">No related questions found for this selection.</p>)}
                        </motion.section>
                    )}
                </div>
            </main>
        </>
    );
};

export default MathTutorFeedback;