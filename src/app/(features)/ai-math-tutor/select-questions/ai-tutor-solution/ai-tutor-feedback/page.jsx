"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Trophy, Zap, BookOpen, RotateCcw, Upload } from 'lucide-react';
import Image from 'next/image';
import Head from 'next/head';

const mockFeedbackStates = {
    almostThere: {
        title: "You are almost there, Annie !",
        titleIcon: "💪",
        timeTaken: "3 mins",
        timeSubtext: "1 mins extra than the usual time",
        helpCount: "4",
        helpSubtext: "2 more helps than usual",
        complexity: "High",
        complexitySubtext: "Challenge ! You are improving !",
        mainMessage: "You tackled a challenging problem and made real progress. That takes courage!",
        subMessage: "Great work on step 1 and 2 🎉 You correctly got to 2x = 8. What's the final step to isolate x? Read here to know how to solve this.",
        buttonText: "See where I slipped & how to fix it",
        questionText: "What feels right for you ?",
        options: [
            {
                id: 'tryAgain',
                icon: <Image
                    src="/images/icons/try-again.png"
                    width={28}
                    height={28}
                    className='w-7 h-7 object-contain'
                    alt="Try again icon - Retry math problem"
                    loading="eager"
                    quality={100}
                />,
                title: 'Try Again',
                subtitle: "Let's go back and get you that victory.",
                recommended: true
            },
            {
                id: 'buildConfidence',
                icon: <Image
                    src="/images/icons/build-confidence.png"
                    width={28}
                    height={28}
                    className='w-7 h-7 object-contain'
                    alt="Build confidence icon - Practice easier problems"
                    loading="lazy"
                    quality={100}
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
                    alt="Practice icon - Writing hand for similar questions"
                    loading="lazy"
                    quality={100}
                />,
                title: 'Practice Similar Questions',
                subtitle: 'Practice similar problems to reinforce what you just learned'
            },
            {
                id: 'goBack',
                icon: <Image
                    src="/images/icons/submit-new-question.png"
                    width={28}
                    height={28}
                    className='w-7 h-7 object-contain'
                    alt="Go back icon - Return to submitted problems"
                    loading="lazy"
                    quality={100}
                />,
                title: 'Go back to submitted problems',
                subtitle: 'Pick another from set of submitted question'
            }
        ]
    },
    solvedPro: {
        title: "Solved like a pro, Annie!",
        titleIcon: "💪🎉",
        timeTaken: "3 mins",
        timeSubtext: "usual time",
        helpCount: "0",
        helpSubtext: "That's Awesome !",
        complexity: "High",
        complexitySubtext: "Bravo ! You solved it",
        mainMessage: "Confidence, speed, accuracy—today, you brought it all. 👏",
        subMessage: "Let's build on this win—your next challenge is ready!",
        buttonText: "See an optimised approach",
        questionText: "Ready for your next challenge ?",
        options: [
            {
                id: 'practiceSimilar',
                icon: <Image
                    src="/images/icons/writing-hand.png"
                    width={28}
                    height={28}
                    className='w-7 h-7 object-contain'
                    alt="Practice similar questions icon"
                    loading="eager"
                    quality={100}
                />,
                title: 'Practice Similar Questions',
                subtitle: 'Practice similar problems to reinforce what you just learned',
                recommended: true
            },
            {
                id: 'levelUp',
                icon: <Image
                    src="/images/icons/bolt.png"
                    width={28}
                    height={28}
                    className='w-7 h-7 object-contain'
                    alt="Level up icon - Lightning bolt for harder problems"
                    loading="lazy"
                    quality={100}
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
                    alt="Go back icon - Return to previous problems"
                    loading="lazy"
                    quality={100}
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
                    alt="Submit new questions icon"
                    loading="lazy"
                    quality={100}
                />,
                title: 'Submit new Questions',
                subtitle: 'Type, upload or snap a new set of questions and start solving'
            }
        ]
    },
    wellDone: {
        title: "Well done reaching the answer, Annie !",
        titleIcon: "🎉",
        timeTaken: "3 mins",
        timeSubtext: "1 mins extra than the usual time",
        helpCount: "4",
        helpSubtext: "2 more helps than usual",
        complexity: "High",
        complexitySubtext: "Bravo ! You solved it",
        mainMessage: "You gave it a solid try — and that's what real learning is all about.",
        subMessage: "With a quick concept refresh on Splitting the middle term, you'll be ready to tackle this confidently next time. 💪",
        buttonText: "Deep dive into your solution",
        questionText: "Ready for your next challenge ?",
        options: [
            {
                id: 'levelUp',
                icon: <Image
                    src="/images/icons/bolt.png"
                    width={28}
                    height={28}
                    className='w-7 h-7 object-contain'
                    alt="Level up icon - Challenge yourself with harder problems"
                    loading="eager"
                    quality={100}
                />,
                title: 'Level Up',
                subtitle: 'Practice similar but harder problems to push your skills further.',
                recommended: true
            },
            {
                id: 'practiceSimilar',
                icon: <Image
                    src="/images/icons/writing-hand.png"
                    width={28}
                    height={28}
                    className='w-7 h-7 object-contain'
                    alt="Practice similar questions icon"
                    loading="lazy"
                    quality={100}
                />,
                title: 'Practice Similar Questions',
                subtitle: 'Practice similar problems to reinforce what you just learned'
            },
            {
                id: 'goBack',
                icon: <Image
                    src="/images/icons/back.png"
                    width={28}
                    height={28}
                    className='w-7 h-7 object-contain'
                    alt="Go back to previous problems icon"
                    loading="lazy"
                    quality={100}
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
                    alt="Submit new questions icon"
                    loading="lazy"
                    quality={100}
                />,
                title: 'Submit new Questions',
                subtitle: 'Type, upload or snap a new set of questions and start solving'
            }
        ]
    }
};

// SEO Metadata component
const SEOMeta = ({ currentState, feedbackData }) => {
    const getMetaData = () => {
        switch (currentState) {
            case 'solvedPro':
                return {
                    title: "Math Problem Solved Successfully - Math Tutor Feedback",
                    description: "Congratulations on solving your math problem like a pro! Get personalized feedback and choose your next challenge to continue improving your math skills.",
                    keywords: "math tutor, problem solving, mathematics learning, educational feedback, student success"
                };
            case 'wellDone':
                return {
                    title: "Great Progress in Math Learning - Personalized Feedback",
                    description: "Well done on completing your math problem! Get detailed feedback on your performance and discover the best next steps for your learning journey.",
                    keywords: "math learning, educational progress, personalized tutoring, math feedback, student improvement"
                };
            default:
                return {
                    title: "Almost There - Math Problem Feedback and Next Steps",
                    description: "You're making great progress! Get encouraging feedback on your math problem attempt and discover the best strategies to achieve success.",
                    keywords: "math help, problem solving strategies, educational support, math tutoring, learning encouragement"
                };
        }
    };

    const meta = getMetaData();

    return (
        <Head>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description} />
            <meta name="keywords" content={meta.keywords} />
            <meta name="author" content="Math Tutor Platform" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={meta.title} />
            <meta property="og:description" content={meta.description} />
            <meta property="og:site_name" content="Math Tutor Platform" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={meta.title} />
            <meta name="twitter:description" content={meta.description} />

            {/* Additional SEO tags */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />
            <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />

            {/* Structured Data for Educational Content */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "EducationalOrganization",
                        "name": "Math Tutor Platform",
                        "description": "Personalized math tutoring with instant feedback and adaptive learning paths",
                        "educationalCredentialAwarded": "Math Problem Solving Skills",
                        "hasCredential": {
                            "@type": "EducationalOccupationalCredential",
                            "name": "Math Problem Solving",
                            "description": feedbackData.mainMessage
                        }
                    })
                }}
            />
        </Head>
    );
};

const MathTutorFeedback = () => {
    const [currentState, setCurrentState] = useState('almostThere');
    const feedbackData = mockFeedbackStates[currentState];

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

    const handleOptionClick = (optionId) => {
        console.log('Option clicked:', optionId);
        // Add analytics tracking here
        if (typeof gtag !== 'undefined') {
            gtag('event', 'option_selected', {
                event_category: 'math_feedback',
                event_label: optionId,
                custom_parameter: currentState
            });
        }
    };

    const handleButtonClick = () => {
        console.log('Main button clicked');
        // Add analytics tracking here
        if (typeof gtag !== 'undefined') {
            gtag('event', 'feedback_button_clicked', {
                event_category: 'math_feedback',
                event_label: feedbackData.buttonText,
                custom_parameter: currentState
            });
        }
    };

    return (
        <>
            <SEOMeta currentState={currentState} feedbackData={feedbackData} />
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
                                        {feedbackData.mainMessage}
                                    </motion.p>
                                    {feedbackData.subMessage && (
                                        <motion.p
                                            className="text-[16px] leading-relaxed mt-2 font-medium"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7 }}
                                        >
                                            {feedbackData.subMessage}
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
                            {feedbackData.questionText}
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

                    <motion.div
                        className="mt-8 p-4 bg-gray-100 rounded-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <h3 className="text-lg font-bold mb-2">Demo States:</h3>
                        <div className="flex gap-2">
                            {Object.keys(mockFeedbackStates).map((state) => (
                                <Button
                                    key={state}
                                    variant={currentState === state ? "default" : "outline"}
                                    onClick={() => setCurrentState(state)}
                                    className="text-sm"
                                >
                                    {state.charAt(0).toUpperCase() + state.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
        </>
    );
};

export default MathTutorFeedback;