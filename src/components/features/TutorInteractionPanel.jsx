'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Volume2, Play, Pause as PauseIcon, Lightbulb, CheckCircle, ArrowRight,
    Copy, HelpCircle, Lock, ChevronRight as ChevronRightIcon,
    CheckCircle2, XCircle, AlertTriangle,
    ThumbsUp, ThumbsDown,
    ChevronDown, MessageCircle,
    LockOpen, VolumeX,
    Unlock as UnlockIcon
} from 'lucide-react';
import { Switch } from '../ui/switch';
import { Card, CardContent } from '../ui/card';
import { Button as UIButton } from '../ui/button';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { AuthFlow } from '@/components/auth';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, staggerChildren: 0.05 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
};
const iconVariants = {
    idle: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.2 } },
    tap: { scale: 0.9, rotate: -5, transition: { duration: 0.1 } },
};

const GuestLockOverlayContent = ({ onUnlock }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-4 space-y-6"
    >
        <Lock className="w-16 h-16 text-yellow-400" />
        <div className="bg-white backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl p-8 max-w-sm mx-4 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Feature Locked
            </h3>
            <p className="text-gray-700 text-[14px] mb-6 leading-relaxed">
                Sign in to access this feature and view the content.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <UIButton
                    onClick={onUnlock}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                    <span className="flex items-center gap-2">
                        <UnlockIcon className="w-4 h-4" />
                        Sign In to Unlock
                    </span>
                </UIButton>
            </motion.div>
        </div>
    </motion.div>
);


const TutorInteractionPanel = ({
    isLoading = false,
    currentButtonType = null,
    audioStatus = { isPlaying: false, isPaused: false, isMuted: false, queueLength: 0 },
    onAudioControl = { toggleMute: () => { }, pauseAudio: () => { }, resumeAudio: () => { }, stopAudio: () => { } },
    onTutorAction = () => { },
    tutorResponse = { streamingText: '', isStreamingEffect: false, structuredResponse: null, explanation: null, activeItemDetail: null },
    contentState = { type: null, items: [], unlockedIndices: [], currentIndex: 0, animatingUnlock: null },
    onContentItemAction = () => { },
    onExplanationAudio = (text, key) => { },
    isWhiteboardDirty = false,
    buttonIcons = {
        hints: { selected: '/images/icons/hints-selected.svg', unselected: '/images/icons/hints-unselected.svg' },
        verify: { selected: '/images/icons/check-progress-selected.svg', unselected: '/images/icons/check-progress-unselected.svg' },
        steps: { selected: '/images/icons/next-steps-selected.svg', unselected: '/images/icons/next-steps-unselected.svg' }
    },
    formatTime,
    timer,
    isGuestUser = false
}) => {

    const [actionStates, setActionStates] = useState({
        upvoted: false,
        downvoted: false,
        copied: false
    });
    const [itemExpandedExplanations, setItemExpandedExplanations] = useState({});
    const [structuredStepExpandedExplanations, setStructuredStepExpandedExplanations] = useState({});
    const [isDetailedExplanationExpanded, setIsDetailedExplanationExpanded] = useState(false);
    const [, setGlobalExpandedExplanation] = useState(false);
    const [activeExplanationKey, setActiveExplanationKey] = useState(null);
    const [showSigninModal, setShowSigninModal] = useState(false);
    const [activeGuestLockAction, setActiveGuestLockAction] = useState(null);


    const userName = 'Annie';
    const isAnyTextStreaming = tutorResponse.isStreamingEffect || (tutorResponse.streamingText && tutorResponse.streamingText.length > 0);
    const isProcessingAudioForExplanation = isLoading && currentButtonType === 'explanation';
    const checkProgressActionKey = 'verify_step';

    useEffect(() => {
        if (!isProcessingAudioForExplanation) {
            setActiveExplanationKey(null);
        }
    }, [isProcessingAudioForExplanation]);

    useEffect(() => {
        if (!isGuestUser && activeGuestLockAction) {
            setActiveGuestLockAction(null);
        }
    }, [isGuestUser, activeGuestLockAction]);


    let displayableGlobalExplanationText = null;
    if (tutorResponse.explanation &&
        !tutorResponse.activeItemDetail &&
        (!contentState.items || contentState.items.length === 0) &&
        (!tutorResponse.structuredResponse || tutorResponse.structuredResponse.type !== 'verify_steps')
    ) {
        displayableGlobalExplanationText = tutorResponse.explanation;
    }


    const hasAnyDisplayableContent = tutorResponse.activeItemDetail ||
        (contentState.items && contentState.items.length > 0) ||
        tutorResponse.structuredResponse ||
        tutorResponse.streamingText ||
        displayableGlobalExplanationText;

    useEffect(() => {
        if (tutorResponse.activeItemDetail) {
            setIsDetailedExplanationExpanded(false);
            setGlobalExpandedExplanation(false);
            setItemExpandedExplanations({});
            setStructuredStepExpandedExplanations({});
        } else if (contentState.items.length > 0) {
            setIsDetailedExplanationExpanded(false);
            setStructuredStepExpandedExplanations({});
        } else if (tutorResponse.structuredResponse) {
            setIsDetailedExplanationExpanded(false);
            setItemExpandedExplanations({});
        }
    }, [tutorResponse.activeItemDetail, contentState.items, tutorResponse.structuredResponse]);


    const handleCopyResponse = () => {
        if (isAnyTextStreaming && currentButtonType !== null) return;
        let textToCopy = "";

        if (tutorResponse.activeItemDetail) {
            textToCopy = tutorResponse.activeItemDetail.mainText;
            if (isDetailedExplanationExpanded && tutorResponse.activeItemDetail.explanationText) {
                textToCopy += `\n\nExplanation: ${tutorResponse.activeItemDetail.explanationText}`;
            }
        } else if (contentState.items.length > 0) {
            const unlockedTexts = contentState.items
                .filter((_, index) => contentState.unlockedIndices.includes(index))
                .map((item, idx) => {
                    const actualItemIndex = contentState.items.findIndex(it => it === item);
                    let currentItemText = typeof item === 'object' ? item.text : item;
                    if (itemExpandedExplanations[actualItemIndex] && typeof item === 'object' && item.explanation) {
                        currentItemText += `\n\nExplanation: ${item.explanation}`;
                    }
                    return currentItemText;
                }).join('\n\n---\n\n');
            textToCopy = unlockedTexts;
        } else if (tutorResponse.structuredResponse?.type === 'fix_errors_hint' || tutorResponse.structuredResponse?.type === 'fix_errors_step') {
            if (tutorResponse.structuredResponse.message) {
                textToCopy += tutorResponse.structuredResponse.message + "\n\n";
            }
            textToCopy += tutorResponse.structuredResponse.stepsData.map((step, index) => {
                let stepText = `Step ${index + 1}:\n`;
                if (step.student_written_step) stepText += `Your step: ${step.student_written_step}\n`;
                if (step.correct_step) stepText += `Correct step: ${step.correct_step}\n`;
                if (structuredStepExpandedExplanations[index] && step.explanation) {
                    stepText += `Explanation: ${step.explanation}`;
                } else if (step.explanation && !structuredStepExpandedExplanations[index]) {
                    stepText += `Explanation (hidden): ${step.explanation}`;
                }
                return stepText;
            }).join('\n\n---\n\n');
        } else if (tutorResponse.streamingText) {
            textToCopy = tutorResponse.streamingText;
        } else if (tutorResponse.structuredResponse?.type === 'verify_steps' && tutorResponse.structuredResponse?.stepsData?.length > 0) {
            if (tutorResponse.structuredResponse.message) {
                textToCopy += tutorResponse.structuredResponse.message + "\n\n";
            }
            textToCopy += tutorResponse.structuredResponse.stepsData.map(s =>
                `Step: ${s.student_written_step || 'N/A'}\nCorrect: ${s.are_both_steps_correct}\nFeedback: ${s.explanation || 'N/A'}`
            ).join('\n\n');
        }

        if (textToCopy && typeof textToCopy === 'string' && textToCopy.trim()) {
            navigator.clipboard.writeText(textToCopy.trim())
                .then(() => {
                    setActionStates(prev => ({ ...prev, copied: true }));
                    toast.success("Copied to clipboard!");
                    setTimeout(() => setActionStates(prev => ({ ...prev, copied: false })), 2000);
                })
                .catch((err) => {
                    console.error('Failed to copy text: ', err);
                    toast.error("Failed to copy.");
                });
        } else {
            toast.error("Nothing to copy.");
        }
    };

    const handleUpvote = () => {
        if ((isAnyTextStreaming && currentButtonType !== null) || isProcessingAudioForExplanation) return;
        setActionStates(prev => ({ ...prev, upvoted: !prev.upvoted, downvoted: prev.upvoted ? prev.downvoted : false }));
    };

    const handleDownvote = () => {
        if ((isAnyTextStreaming && currentButtonType !== null) || isProcessingAudioForExplanation) return;
        setActionStates(prev => ({ ...prev, downvoted: !prev.downvoted, upvoted: prev.downvoted ? prev.upvoted : false }));
    };

    const handleUnlockContentItem = (index, item) => {
        if (contentState.type === 'hints') {
            onTutorAction('next_3hint', {
                current_hint_index: index,
                hint_text: item?.text
            });
        } else if (contentState.type === 'steps') {
            if (isGuestUser) {
                setActiveGuestLockAction('next_step');
                return;
            }
            onTutorAction('next_3step', {
                current_step_index: index,
                step_text: item?.text
            });
        }
    };

    const createToggleExplanationHandler = (keyPrefix, index, explanationText, currentExpandedMap, setExpandedMap) => {
        const uniqueKey = `${keyPrefix}_${index}`;
        const willExpand = !currentExpandedMap[index];

        if (isProcessingAudioForExplanation && activeExplanationKey && activeExplanationKey !== uniqueKey) {
            toast.info("Another explanation is currently playing or loading.");
            return;
        }

        setExpandedMap(prev => ({ ...prev, [index]: willExpand }));

        if (willExpand && explanationText) {
            setActiveExplanationKey(uniqueKey);
            onExplanationAudio(explanationText, uniqueKey);
        } else if (!willExpand) {
            if (audioStatus.queueLength > 0 && activeExplanationKey === uniqueKey) {
                onAudioControl.stopAudio();
            }
            if (activeExplanationKey === uniqueKey) setActiveExplanationKey(null);
        }
    };

    const toggleItemExplanation = (index, explanationText) => {
        createToggleExplanationHandler('contentItem', index, explanationText, itemExpandedExplanations, setItemExpandedExplanations);
    };

    const toggleStructuredStepExplanation = (index, explanationText) => {
        createToggleExplanationHandler('structuredStep', index, explanationText, structuredStepExpandedExplanations, setStructuredStepExpandedExplanations);
    };

    const handleToggleDetailedExplanation = () => {
        if (tutorResponse.activeItemDetail?.explanationText) {
            const uniqueKey = 'activeItemDetailExplanation';
            const willExpand = !isDetailedExplanationExpanded;

            if (isProcessingAudioForExplanation && activeExplanationKey && activeExplanationKey !== uniqueKey) {
                toast.info("Another explanation is currently playing or loading.");
                return;
            }

            setIsDetailedExplanationExpanded(willExpand);
            if (willExpand) {
                setActiveExplanationKey(uniqueKey);
                onExplanationAudio(tutorResponse.activeItemDetail.explanationText, uniqueKey);
            } else {
                if (audioStatus.queueLength > 0 && activeExplanationKey === uniqueKey) {
                    onAudioControl.stopAudio();
                }
                if (activeExplanationKey === uniqueKey) setActiveExplanationKey(null);
            }
        } else {
            toast.info("No explanation available for this item.");
        }
    };

    const handleToggleGlobalExplanationAudio = () => {
        if (displayableGlobalExplanationText) {
            const uniqueKey = 'globalTutorExplanation';
            if (isProcessingAudioForExplanation && activeExplanationKey && activeExplanationKey !== uniqueKey) {
                toast.info("Another explanation is currently playing or loading.");
                return;
            }
            setActiveExplanationKey(uniqueKey);
            onExplanationAudio(displayableGlobalExplanationText, uniqueKey);
        }
    };


    const isButtonLoading = (buttonType) => isLoading && currentButtonType === buttonType;

    const handleHintAction = () => {
        if (isLoading && (currentButtonType === 'next_hint' || currentButtonType === 'next_3hint')) return;
        setActiveGuestLockAction(null);
        onTutorAction('next_hint');
    };

    const handleStepAction = () => {
        if (isGuestUser) {
            setActiveGuestLockAction('next_step');
            return;
        }
        if (isLoading && (currentButtonType === 'next_step' || currentButtonType === 'next_3step')) return;
        onTutorAction('next_step');
    };


    const handleCheckProgress = () => {
        if (!isWhiteboardDirty) {
            toast.error("Please draw your solution on the whiteboard first.");
            return;
        }
        if (isGuestUser) {
            setActiveGuestLockAction(checkProgressActionKey);
            return;
        }
        if (isLoading && currentButtonType === checkProgressActionKey) return;
        onTutorAction(checkProgressActionKey);
    };

    const getHintButtonLabel = () => "Hints";
    const getStepButtonLabel = () => "Next Steps";

    const isButtonEffectivelySelected = (buttonTypeStr) => {
        if (isGuestUser && activeGuestLockAction) {
            if (buttonTypeStr === 'verify') return activeGuestLockAction === checkProgressActionKey;
            if (buttonTypeStr === 'steps') return activeGuestLockAction === 'next_step';
            if (buttonTypeStr === 'hints') return false;
        }

        if (isLoading) {
            return currentButtonType === buttonTypeStr ||
                (buttonTypeStr === 'hints' && (currentButtonType === 'next_hint' || currentButtonType === 'next_3hint')) ||
                (buttonTypeStr === 'steps' && (currentButtonType === 'next_step' || currentButtonType === 'next_3step')) ||
                (buttonTypeStr === 'verify' && currentButtonType === checkProgressActionKey);
        }

        if (activeGuestLockAction) return false;

        if (tutorResponse.activeItemDetail) {
            if (buttonTypeStr === 'hints' && tutorResponse.activeItemDetail.type === 'hint') return true;
            if (buttonTypeStr === 'steps' && tutorResponse.activeItemDetail.type === 'step') return true;
        } else if (contentState.type) {
            if (buttonTypeStr === 'hints' && contentState.type === 'hints') return true;
            if (buttonTypeStr === 'steps' && contentState.type === 'steps') return true;
        }
        if (buttonTypeStr === 'verify' &&
            (tutorResponse.structuredResponse?.type === 'verify_steps' ||
                tutorResponse.structuredResponse?.type === 'fix_errors_hint' ||
                tutorResponse.structuredResponse?.type === 'fix_errors_step')) {
            return true;
        }
        return false;
    };


    const isExplanationButtonDisabled = (uniqueKey) => {
        return isProcessingAudioForExplanation && activeExplanationKey !== null && activeExplanationKey !== uniqueKey;
    };

    const isPassiveLockActive = isGuestUser && !activeGuestLockAction && (
        (contentState.type === 'steps' && isButtonEffectivelySelected('steps')) ||
        (tutorResponse.activeItemDetail?.type === 'step' && isButtonEffectivelySelected('steps')) ||
        ((
            tutorResponse.structuredResponse?.type === 'verify_steps' ||
            tutorResponse.structuredResponse?.type === 'fix_errors_step' ||
            tutorResponse.structuredResponse?.type === 'fix_errors_hint'
        ) && isButtonEffectivelySelected('verify')
        )
    );

    const showLockOverlay = isGuestUser && (
        activeGuestLockAction === checkProgressActionKey ||
        activeGuestLockAction === 'next_step' ||
        isPassiveLockActive
    );

    return (
        <motion.div
            className="w-full bg-white flex flex-col shadow-md h-full p-4 border-2 border-gray-50"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            aria-label="Tutor Interaction Area"
        >
            <motion.div className="text-xl font-semibold text-[#1F33E8]/75 flex justify-between items-center mb-3" variants={itemVariants}>
                <motion.h3
                    className="text-xl font-semibold text-[#1F33E8]/75"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    Hey, {userName}, Let's solve it !
                </motion.h3>
                <motion.div>
                    <span className="text-sm bg-blue-100 px-2 py-1 rounded-full" aria-label={`Timer: ${formatTime(timer)}`}>{formatTime(timer)}</span>
                </motion.div>
            </motion.div>

            {
                audioStatus?.queueLength > 0 && (<motion.div className="mb-3" variants={itemVariants} aria-label="Voice Explanation Controls">
                    <motion.h4 className="text-[16px] font-semibold mb-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        Voice Explanation
                    </motion.h4>
                    <motion.div className="flex items-center justify-between p-3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <div className="flex items-center space-x-3">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Switch
                                    id="audio-mute-switch"
                                    checked={!audioStatus.isMuted}
                                    onCheckedChange={onAudioControl.toggleMute}
                                    disabled={isLoading && currentButtonType === 'toggleMute'}
                                    aria-label={audioStatus.isMuted ? "Unmute audio" : "Mute audio"}
                                />
                            </motion.div>
                            <label htmlFor="audio-mute-switch" className="cursor-pointer">
                                {audioStatus.isMuted ?
                                    <VolumeX className="w-5 h-5 text-gray-400" aria-hidden="true" /> :
                                    <Volume2 className="w-5 h-5 text-gray-700" aria-hidden="true" />
                                }
                            </label>
                        </div>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                            <UIButton
                                size="icon" variant="ghost"
                                onClick={audioStatus.queueLength > 0 ? onAudioControl.pauseAudio : onAudioControl.resumeAudio}
                                className="p-2 rounded-full transition-colors disabled:opacity-50"
                                disabled={(!audioStatus.queueLength === 0 && !audioStatus.isPaused) || (isLoading && (currentButtonType === 'pauseAudio' || currentButtonType === 'resumeAudio'))}
                                aria-label={audioStatus.queueLength > 0 ? "Pause audio" : "Play audio"}
                            >
                                <motion.div variants={iconVariants} whileHover="hover" whileTap="tap">
                                    {audioStatus.queueLength > 0 ? (
                                        <PauseIcon className="w-5 h-5 text-gray-700 fill-current" aria-hidden="true" />
                                    ) : (
                                        <Play className="w-5 h-5 text-gray-700 fill-current" aria-hidden="true" />
                                    )}
                                </motion.div>
                            </UIButton>
                        </motion.div>
                    </motion.div>
                </motion.div>)
            }


            <motion.div className="mb-4 mt-2" variants={itemVariants} role="toolbar" aria-label="Tutor Actions">
                <motion.div className="flex flex-row gap-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <motion.div variants={itemVariants}> <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <UIButton
                            onClick={handleHintAction}
                            disabled={(isLoading && (currentButtonType === 'next_hint' || currentButtonType === 'next_3hint')) || isProcessingAudioForExplanation || (audioStatus.queueLength > 0 || audioStatus.isPaused)}
                            className={`flex items-center justify-center text-[16px] transition-all duration-300 text-primary border border-primary shadow-none ${isButtonEffectivelySelected('hints') ? 'bg-tabs-background' : 'bg-white'} ${(isProcessingAudioForExplanation) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            aria-pressed={isButtonEffectivelySelected('hints')}
                        >
                            {isButtonLoading('next_hint') || isButtonLoading('next_3hint') ? <motion.div className="w-4 h-4 mr-1.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : (buttonIcons.hints ? <Image src={isButtonEffectivelySelected('hints') ? buttonIcons.hints.selected : buttonIcons.hints.unselected} alt="" width={12} height={12} aria-hidden="true" /> : <Lightbulb className="w-4 h-4 mr-1.5" aria-hidden="true" />)}
                            {getHintButtonLabel()}
                        </UIButton>
                    </motion.div></motion.div>
                    <motion.div variants={itemVariants}> <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <UIButton
                            onClick={handleCheckProgress}
                            disabled={
                                (!isGuestUser && ((isLoading && currentButtonType === checkProgressActionKey) || isProcessingAudioForExplanation || (audioStatus.queueLength > 0 || audioStatus.isPaused))) ||
                                !isWhiteboardDirty
                            }
                            className={`flex items-center justify-center text-[16px] transition-all duration-300 text-primary border border-primary shadow-none ${isButtonEffectivelySelected('verify') ? 'bg-tabs-background' : 'bg-white'} ${(!isWhiteboardDirty || (isProcessingAudioForExplanation && !isGuestUser)) ? 'opacity-50 cursor-not-allowed bg-gray-100 hover:bg-gray-100 border-gray-300 text-gray-500' : ''}`}
                            aria-pressed={isButtonEffectivelySelected('verify')}
                        >
                            {isGuestUser && activeGuestLockAction !== checkProgressActionKey && isButtonEffectivelySelected('verify') && <Lock className="w-3 h-3 mr-1 text-gray-500" />}
                            {isButtonLoading(checkProgressActionKey) && !isGuestUser ? <motion.div className="w-4 h-4 mr-1.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : (buttonIcons.verify ? <Image src={isButtonEffectivelySelected('verify') ? buttonIcons.verify.selected : buttonIcons.verify.unselected} alt="" width={12} height={12} aria-hidden="true" /> : <CheckCircle className="w-4 h-4 mr-1.5" aria-hidden="true" />)}
                            Check Progress
                        </UIButton>
                    </motion.div></motion.div>
                    <motion.div variants={itemVariants}> <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <UIButton
                            onClick={handleStepAction}
                            disabled={
                                !isGuestUser && ((isLoading && (currentButtonType === 'next_step' || currentButtonType === 'next_3step')) || isProcessingAudioForExplanation || (audioStatus.queueLength > 0 || audioStatus.isPaused))
                            }
                            className={`flex items-center justify-center text-[16px] transition-all duration-300 text-primary border border-primary shadow-none ${isButtonEffectivelySelected('steps') ? 'bg-tabs-background' : 'bg-white'} ${(isProcessingAudioForExplanation && !isGuestUser) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            aria-pressed={isButtonEffectivelySelected('steps')}
                        >
                            {isGuestUser && activeGuestLockAction !== 'next_step' && isButtonEffectivelySelected('steps') && <Lock className="w-3 h-3 mr-1 text-gray-500" />}
                            {(isButtonLoading('next_step') || isButtonLoading('next_3step')) && !isGuestUser ? <motion.div className="w-4 h-4 mr-1.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : (buttonIcons.steps ? <Image src={isButtonEffectivelySelected('steps') ? buttonIcons.steps.selected : buttonIcons.steps.unselected} alt="" width={12} height={12} aria-hidden="true" /> : <ArrowRight className="w-4 h-4 mr-1.5" aria-hidden="true" />)}
                            {getStepButtonLabel()}
                        </UIButton>
                    </motion.div></motion.div>
                </motion.div>
            </motion.div>

            <motion.div className="relative flex-grow overflow-y-auto space-y-3 mb-4" variants={itemVariants} role="log" aria-live="polite" aria-atomic="false" aria-relevant="additions text">
                {showLockOverlay && <GuestLockOverlayContent onUnlock={() => setShowSigninModal(true)} />}
                <div className={showLockOverlay ? 'blur-sm pointer-events-none' : ''}>
                    <AnimatePresence mode="wait">
                        {isLoading && !hasAnyDisplayableContent && !isProcessingAudioForExplanation && (
                            <motion.div
                                key="loading-panel"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center py-8 text-gray-600 mt-20 text-lg"
                                role="status"
                            >
                                <motion.div
                                    className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin mr-2"
                                    aria-hidden="true"
                                />
                                <span>Thinking...</span>
                            </motion.div>
                        )}
                        {!isLoading && !hasAnyDisplayableContent && (
                            <motion.div
                                key="no-content-panel"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-8 text-gray-600 text-center"
                            >
                                <HelpCircle className="w-12 h-12 mt-20" aria-hidden="true" />
                                <p className="text-lg font-medium text-gray-600">Ready for your input!</p>
                                <p className="text-md text-gray-600">Select an option above or start solving.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {tutorResponse.activeItemDetail && (
                        <motion.div
                            key={`active-${tutorResponse.activeItemDetail.type}-detail`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-2 mb-3"
                            role="article"
                        >
                            <div className="">
                                <div className="p-3">
                                    <div className="flex items-start space-x-2">
                                        <span className="mt-1 text-lg text-black flex-shrink-0" aria-hidden="true">•</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-lg text-black">
                                                <Latex>{tutorResponse.activeItemDetail.mainText || "Loading..."}</Latex>
                                            </div>
                                            {tutorResponse.activeItemDetail.explanationText && (
                                                <div className="mt-2 text-[16px]">
                                                    <UIButton
                                                        variant="link"
                                                        onClick={handleToggleDetailedExplanation}
                                                        className="px-0 py-0 h-auto font-semibold text-[#192065]/40 flex items-end justify-end align-middle cursor-pointer w-full"
                                                        aria-expanded={isDetailedExplanationExpanded}
                                                        aria-controls="detailed-explanation-content"
                                                        aria-disabled={isExplanationButtonDisabled('activeItemDetailExplanation')}
                                                    >
                                                        Explanation
                                                        <ChevronDown className={`w-5 h-5 ml-1 text-[#192065]/40 transition-transform ${isDetailedExplanationExpanded ? 'rotate-180' : ''}`} aria-hidden="true" />
                                                    </UIButton>
                                                    <AnimatePresence>
                                                        {isDetailedExplanationExpanded && (
                                                            <motion.div
                                                                id="detailed-explanation-content"
                                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                                animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem' }}
                                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                                className="overflow-hidden"
                                                                role="region"
                                                            >
                                                                <div className="p-2 text-[14px] text-black bg-secondary-background rounded-lg border border-gray-200">
                                                                    <Latex>{tutorResponse.activeItemDetail.explanationText}</Latex>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {!tutorResponse.activeItemDetail && (!contentState.items || contentState.items.length === 0) && tutorResponse.streamingText && (
                        <motion.div key="streaming-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="status">
                            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50"><CardContent className="p-3">
                                <Latex>{tutorResponse.streamingText}</Latex>
                            </CardContent></Card>
                        </motion.div>
                    )}

                    {!tutorResponse.activeItemDetail && (contentState.type === 'hints' || contentState.type === 'steps') && contentState.items.length > 0 && (
                        <motion.div key={`${contentState.type}-list`} initial="hidden" animate="visible" variants={containerVariants} className="space-y-2" role="list">
                            {contentState.items.map((item, index) => {
                                const itemData = typeof item === 'string' ? { text: item, explanation: null } : item;
                                const isUnlocked = contentState.unlockedIndices.includes(index);
                                const isNextToUnlock = !isUnlocked && (contentState.unlockedIndices.length === 0 ? index === 0 : index <= Math.max(...contentState.unlockedIndices) + 1);

                                return (
                                    <motion.div key={`${contentState.type}-item-${index}`} layout variants={itemVariants} className="text-md" role="listitem">
                                        {isUnlocked ? (
                                            <div className="px-2 mt-2">
                                                <div className="flex items-start space-x-2 align-middle">
                                                    <span className="text-lg text-black flex-shrink-0" aria-hidden="true">•</span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-lg">
                                                            <Latex>{String(itemData.text || "...")}</Latex>
                                                        </div>
                                                        {itemData.explanation && (
                                                            <div className="text-[14px]">
                                                                <UIButton
                                                                    variant="link"
                                                                    onClick={() => toggleItemExplanation(index, itemData.explanation)}
                                                                    className="px-0 py-0 h-auto font-semibold text-[#192065]/40 flex items-end justify-end align-middle cursor-pointer w-full"
                                                                    aria-expanded={!!itemExpandedExplanations[index]}
                                                                    aria-controls={`item-explanation-${index}`}
                                                                    disabled={isExplanationButtonDisabled(`contentItem_${index}`)}
                                                                >
                                                                    Explanation
                                                                    <ChevronDown className={`w-5 h-5 ml-1 text-[#192065]/40 transition-transform ${itemExpandedExplanations[index] ? 'rotate-180' : ''}`} aria-hidden="true" />
                                                                </UIButton>
                                                                <AnimatePresence>
                                                                    {itemExpandedExplanations[index] && (
                                                                        <motion.div id={`item-explanation-${index}`} initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="overflow-hidden" role="region">
                                                                            <div className="p-2 text-[14px] text-black bg-secondary-background rounded-lg border border-gray-200">
                                                                                <Latex>{itemData.explanation}</Latex>
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : isNextToUnlock ? (
                                            <div className="px-2 mb-2">
                                                <div className="flex items-center space-x-2 align-middle">
                                                    {(isGuestUser && contentState.type === 'steps') ? <Lock className="w-5 h-5 text-gray-700 fill-gray-500" aria-hidden="true" /> : <UnlockIcon className="w-5 h-5 text-gray-700 fill-gray-500" aria-hidden="true" />}
                                                    <UIButton
                                                        variant="link"
                                                        onClick={() => handleUnlockContentItem(index, item)}
                                                        disabled={isLoading || (audioStatus.queueLength > 0 || audioStatus.isPaused)}
                                                        className="text-lg p-0 h-auto underline"
                                                    >
                                                        Unlock {contentState.type === 'hints' ? 'Hint' : 'Step'} {index + 1}
                                                    </UIButton>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="px-2 pt-2">
                                                <div className="flex items-center space-x-2 text-gray-400">
                                                    <Lock className="w-5 h-5 text-gray-700 fill-gray-500" aria-hidden="true" />
                                                    <span className="text-lg text-black">
                                                        {contentState.type === 'hints' ? 'Hint' : 'Step'} {index + 1} (Locked)
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                    {!tutorResponse.activeItemDetail && (!contentState.items || contentState.items.length === 0) &&
                        (tutorResponse.structuredResponse?.type === 'fix_errors_hint' || tutorResponse.structuredResponse?.type === 'fix_errors_step') &&
                        Array.isArray(tutorResponse.structuredResponse.stepsData) && (
                            <motion.div key="fix-errors-steps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 text-[14px]" role="region" aria-label="Error Fixes">
                                {tutorResponse.structuredResponse.message && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <Card className={`border-l-4 border-l-orange-500 bg-orange-50/50`}>
                                            <CardContent className="p-3 text-[14px] flex items-center font-medium">
                                                <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 text-orange-700" aria-hidden="true" />
                                                <Latex>{tutorResponse.structuredResponse.message}</Latex>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                                {tutorResponse.structuredResponse.stepsData.map((step, index) => {
                                    const explanationUniqueKey = `structuredStep_${index}`;
                                    return (
                                        <motion.div key={`fix-error-${index}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} role="article">
                                            <Card className={`border-l-4 ${step.are_both_steps_correct ? 'border-l-green-500 bg-green-50/50' : 'border-l-red-500 bg-red-50/50'}`}>
                                                <CardContent className="p-3">
                                                    <div className="flex items-start space-x-2.5">
                                                        {step.are_both_steps_correct ? <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" /> : <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" aria-hidden="true" />}
                                                        <div className="flex-1 min-w-0 space-y-1.5">
                                                            {step.student_written_step && step.student_written_step !== "No corresponding step in the question." && (
                                                                <div className='text-lg'><span className="font-semibold text-black">Your attempt:</span> <div className="pl-2 border-l-2 border-gray-300 ml-1 mt-0.5"><Latex>{step.student_written_step}</Latex></div></div>
                                                            )}
                                                            {step.correct_step && (step.student_written_step !== step.correct_step || !step.are_both_steps_correct) && (
                                                                <div className='text-lg'><span className="font-semibold text-black">Corrected/Expected:</span> <div className="pl-2 border-l-2 border-green-300 ml-1 mt-0.5"><Latex>{step.correct_step}</Latex></div></div>
                                                            )}
                                                            {step.explanation && (
                                                                <div className="mt-1">
                                                                    <UIButton
                                                                        variant="link"
                                                                        onClick={() => toggleStructuredStepExplanation(index, step.explanation)}
                                                                        className="px-0 py-0 h-auto font-semibold text-[#192065]/40 flex items-end justify-end align-middle cursor-pointer w-full"
                                                                        aria-expanded={!!structuredStepExpandedExplanations[index]}
                                                                        aria-controls={`structured-step-explanation-${index}`}
                                                                        disabled={isExplanationButtonDisabled(explanationUniqueKey)}
                                                                    >
                                                                        Explanation
                                                                        <ChevronDown className={`w-5 h-5 ml-1 text-[#192065]/40 transition-transform ${structuredStepExpandedExplanations[index] ? 'rotate-180' : ''}`} aria-hidden="true" />
                                                                    </UIButton>
                                                                    <AnimatePresence>
                                                                        {structuredStepExpandedExplanations[index] && (
                                                                            <motion.div id={`structured-step-explanation-${index}`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-1" role="region">
                                                                                <div className="p-2 text-lg text-black bg-secondary-background rounded-lg border border-gray-200">
                                                                                    <Latex>{step.explanation}</Latex>
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}


                    {!tutorResponse.activeItemDetail && (!contentState.items || contentState.items.length === 0) && tutorResponse.structuredResponse?.type === 'verify_steps' && Array.isArray(tutorResponse.structuredResponse.stepsData) && (
                        <motion.div key="verify-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 text-[14px]" role="region" aria-label="Verification Results">
                            {tutorResponse.structuredResponse.message && (
                                (tutorResponse.structuredResponse.stepsData.length > 0 && tutorResponse.structuredResponse.stepsData.some(s => !s.are_both_steps_correct)) ||
                                (tutorResponse.structuredResponse.isCompleteFlag === true) ||
                                (tutorResponse.structuredResponse.message && (!tutorResponse.structuredResponse.message.toLowerCase().includes("verify correct step") || !tutorResponse.structuredResponse.stepsData.every(s => s.are_both_steps_correct)))
                            ) && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <Card className={`border-l-4 ${tutorResponse.structuredResponse.isCompleteFlag && tutorResponse.structuredResponse.stepsData.every(s => s.are_both_steps_correct) ? 'border-l-green-500 bg-green-50/50' : (tutorResponse.structuredResponse.stepsData.some(s => !s.are_both_steps_correct) ? 'border-l-yellow-500 bg-yellow-50/50' : 'border-l-blue-500 bg-blue-50/50')}`}>
                                            <CardContent className="p-3 text-lg flex items-center font-medium">
                                                {tutorResponse.structuredResponse.isCompleteFlag && tutorResponse.structuredResponse.stepsData.every(s => s.are_both_steps_correct) ? <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0 text-green-600" aria-hidden="true" /> : (tutorResponse.structuredResponse.stepsData.some(s => !s.are_both_steps_correct) ? <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 text-yellow-700" aria-hidden="true" /> : <Lightbulb className="w-4 h-4 mr-2 flex-shrink-0 text-blue-700" aria-hidden="true" />)}
                                                <Latex>{tutorResponse.structuredResponse.message}</Latex>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                            {tutorResponse.structuredResponse.stepsData.map((step, index) => (
                                <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} role="article">
                                    <Card className={`border-l-4 ${step.are_both_steps_correct ? 'border-l-green-500 bg-green-50/50' : 'border-l-red-500 bg-red-50/50'}`}>
                                        <CardContent className="p-3 text-lg"><div className="flex items-start space-x-2.5">
                                            {step.are_both_steps_correct ? <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" /> : <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" aria-hidden="true" />}
                                            <div className="flex-1 min-w-0 space-y-1.5">
                                                {step.student_written_step && step.student_written_step !== "No corresponding step in the question." && (
                                                    <div><span className="font-semibold text-black">Your step:</span> <div className="pl-2 border-l-2 border-gray-300 ml-1 mt-0.5"><Latex>{step.student_written_step}</Latex></div></div>
                                                )}
                                                {step.explanation && (
                                                    <div><span className="font-semibold text-black">Feedback:</span> <p className="leading-relaxed whitespace-pre-wrap break-words"><Latex>{step.explanation}</Latex></p></div>
                                                )}
                                                {!step.are_both_steps_correct && step.correct_step && step.correct_step !== "No corresponding step in the question." && (
                                                    <div><span className="font-medium text-black">Correct step:</span> <div className="pl-2 border-l-2 border-green-300 ml-1 mt-0.5"><Latex>{step.correct_step}</Latex></div></div>
                                                )}
                                            </div></div></CardContent></Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </motion.div>

            <motion.div className="mt-auto pt-2" variants={itemVariants}>
                <motion.div className="flex justify-between items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} role="toolbar" aria-label="Final Actions">
                    <motion.div className="flex-grow mr-2" variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <UIButton
                            onClick={() => {
                                if (!isWhiteboardDirty) {
                                    toast.error("Please draw your final solution on the whiteboard first.");
                                    return;
                                }
                                if (isGuestUser) {
                                    setActiveGuestLockAction('verify');
                                    return;
                                }
                                onTutorAction('verify');
                            }}
                            disabled={
                                activeGuestLockAction === 'verify' || showLockOverlay ||
                                (!isGuestUser && ((isLoading && currentButtonType === 'verify') || (isAnyTextStreaming && currentButtonType !== null) || isProcessingAudioForExplanation || (audioStatus.queueLength > 0 || audioStatus.isPaused))) ||
                                !isWhiteboardDirty
                            }
                            className={`w-full text-sm transition-all duration-300 ${!isWhiteboardDirty || ((!isGuestUser && ((isAnyTextStreaming && currentButtonType !== null)) || isProcessingAudioForExplanation)) || showLockOverlay ? 'opacity-50 cursor-not-allowed' : ''} ${!isWhiteboardDirty ? 'bg-gray-100 hover:bg-gray-100 border-gray-300 text-gray-500' : 'bg-primary text-white hover:bg-blue-700'}`}
                        >
                            {isGuestUser && isButtonEffectivelySelected('verify') && <Lock className="w-3 h-3 mr-1 text-gray-500" />}
                            {isButtonLoading('verify') && !isGuestUser ? <><motion.div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" /> Checking... </> : <> Check my final solution <ChevronRightIcon className="w-4 h-4 ml-1 inline-block" aria-hidden="true" /></>}
                        </UIButton>
                    </motion.div>
                    {[
                        { Icon: Copy, label: 'Copy response', stateKey: 'copied', action: handleCopyResponse, color: 'blue' },
                        { Icon: ThumbsDown, label: 'Dislike response', stateKey: 'downvoted', action: handleDownvote, color: 'red' },
                        { Icon: ThumbsUp, label: 'Like response', stateKey: 'upvoted', action: handleUpvote, color: 'green' }
                    ].map(({ Icon, label, stateKey, action, color }) => {
                        const isDisabled = showLockOverlay || (!hasAnyDisplayableContent && !tutorResponse.streamingText) || (isAnyTextStreaming && currentButtonType !== null) || isProcessingAudioForExplanation || (audioStatus.queueLength > 0 || audioStatus.isPaused);
                        return (
                            <motion.div key={label} variants={buttonVariants} whileHover={!isDisabled ? "hover" : "idle"} whileTap={!isDisabled ? "tap" : "idle"}>
                                <UIButton variant="ghost" size="icon" aria-label={label} title={label} disabled={isDisabled} onClick={action}
                                    className={`transition-all duration-300 p-1.5 ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    aria-pressed={actionStates[stateKey]}
                                >
                                    <Icon className={`h-5 w-5 transition-colors duration-200 ${actionStates[stateKey] ? `text-${color}-500` : isDisabled ? 'text-gray-300' : `text-gray-400 hover:text-${color}-500`}`} aria-hidden="true" />
                                </UIButton>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.div>
            {showSigninModal && (
                <AuthFlow
                    initialStep="signIn"
                    isPopup={true}
                    onClose={() => setShowSigninModal(false)}
                    defaultCallbackUrl="/ai-math-tutor/select-questions/ai-tutor-solution"
                />
            )}
        </motion.div>
    )
};
export default React.memo(TutorInteractionPanel);