'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Volume2, Play, Pause as PauseIcon, Lightbulb, CheckCircle, ArrowRight,
    Copy, HelpCircle, Lock, ChevronRight as ChevronRightIcon,
    CheckCircle2, XCircle, AlertTriangle,
    ThumbsUp, ThumbsDown,
    ChevronDown, MessageCircle // For per-item explanation icon
} from 'lucide-react';
import { Switch } from '../ui/switch';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import Image from 'next/image';
import toast from 'react-hot-toast';

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

const TutorInteractionPanel = ({
    isLoading = false,
    currentButtonType = null,
    audioStatus = { isPlaying: false, isPaused: false, isMuted: false, queueLength: 0 },
    onAudioControl = { toggleMute: () => { }, pauseAudio: () => { }, resumeAudio: () => { }, stopAudio: () => { } },
    onTutorAction = () => { },
    tutorResponse = { streamingText: '', isStreamingEffect: false, structuredResponse: null, explanation: null },
    contentState = { type: null, items: [], unlockedIndices: [], currentIndex: 0, animatingUnlock: null },
    onContentItemAction = () => { },
    onExplanationAudio = () => { }, // For the main explanation audio
    isWhiteboardDirty = false,
    // setContentState is NOT passed here, MathTutorPage manages it.
    buttonIcons = {
        hints: { selected: '/images/icons/hints-selected.svg', unselected: '/images/icons/hints-unselected.svg' },
        verify: { selected: '/images/icons/check-progress-selected.svg', unselected: '/images/icons/check-progress-unselected.svg' },
        steps: { selected: '/images/icons/next-steps-selected.svg', unselected: '/images/icons/next-steps-unselected.svg' }
    }
}) => {
    const [actionStates, setActionStates] = useState({
        upvoted: false,
        downvoted: false,
        copied: false
    });
    const [globalExpandedExplanation, setGlobalExpandedExplanation] = useState(false);
    const [itemExpandedExplanations, setItemExpandedExplanations] = useState({}); // For Req 6: { [index]: boolean }

    const userName = 'Annie'; // Or from props/context

    // Req 1: Show Audio controls only if audio is playing/paused
    const showAudioControls = audioStatus.isPlaying || audioStatus.isPaused;

    const isAudioOrTextStreaming = audioStatus.isPlaying || tutorResponse.isStreamingEffect ||
        (tutorResponse.streamingText && tutorResponse.streamingText.length > 0);

    const handleCopyResponse = () => {
        if (isAudioOrTextStreaming) return;
        let textToCopy = "";
        if (tutorResponse.streamingText) {
            textToCopy = tutorResponse.streamingText;
        } else if (contentState.items.length > 0 && contentState.unlockedIndices.includes(contentState.currentIndex)) {
            const currentItem = contentState.items[contentState.currentIndex];
            textToCopy = typeof currentItem === 'object' ? currentItem.text : currentItem;
            if (itemExpandedExplanations[contentState.currentIndex] && typeof currentItem === 'object' && currentItem.explanation) {
                textToCopy += `\n\nExplanation: ${currentItem.explanation}`;
            } else if (globalExpandedExplanation && tutorResponse.explanation) {
                textToCopy += `\n\nOverall Explanation: ${tutorResponse.explanation}`;
            }
        } else if (tutorResponse.structuredResponse?.stepsData?.length > 0) {
            textToCopy = tutorResponse.structuredResponse.stepsData.map(s =>
                `Step: ${s.student_written_step || 'N/A'}\nCorrect: ${s.are_both_steps_correct}\nExplanation: ${s.explanation || 'N/A'}`
            ).join('\n\n');
        } else if (tutorResponse.explanation) {
            textToCopy = tutorResponse.explanation;
        }


        if (textToCopy && typeof textToCopy === 'string') {
            navigator.clipboard.writeText(textToCopy)
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
        if (isAudioOrTextStreaming) return;
        setActionStates(prev => ({ ...prev, upvoted: !prev.upvoted, downvoted: prev.upvoted ? prev.downvoted : false }));
        // Add API call for upvote if needed
    };

    const handleDownvote = () => {
        if (isAudioOrTextStreaming) return;
        setActionStates(prev => ({ ...prev, downvoted: !prev.downvoted, upvoted: prev.downvoted ? prev.upvoted : false }));
        // Add API call for downvote if needed
    };

    // Req 7: Unlocking an item calls onContentItemAction, which in MathTutorPage will use next_3hint/next_3step
    const handleUnlockContentItem = (index, item) => {
        // The actionType ('next_hint' or 'next_step') is just a placeholder here,
        // MathTutorPage's memoizedHandleContentItemAction will use 'next_3hint'/'next_3step'.
        const actionType = contentState.type === 'hints' ? 'next_hint' : 'next_step';
        onContentItemAction(actionType, index, item); // item can be string or object
    };

    // Req 6: Toggle per-item explanation
    const toggleItemExplanation = (index) => {
        setItemExpandedExplanations(prev => ({ ...prev, [index]: !prev[index] }));
        const currentItem = contentState.items[index];
        // If expanding and audio is desired for item explanation:
        // if (!itemExpandedExplanations[index] && typeof currentItem === 'object' && currentItem.explanation) {
        //    onTutorAction("explanation", { explanationForAudio: currentItem.explanation });
        // }
    };


    const hasDisplayableTextContent = contentState.items.length > 0 || tutorResponse.structuredResponse || tutorResponse.streamingText || tutorResponse.explanation;
    const isButtonLoading = (buttonType) => isLoading && currentButtonType === buttonType;

    // Req 4: Hint button always calls next_3hint with index 1 (handled by MathTutorPage for reset)
    // Here, if items exist, it tries to unlock next. If not, asks for initial set.
    const handleHintAction = () => {
        if (isLoading && (currentButtonType === 'next_3hint' || currentButtonType === 'next_hint')) return;
        // Request initial set of hints (typically 3)
        // MathTutorPage's proactive reset + this call will handle it
        onTutorAction('next_3hint', { current_hint_index: 1 });
        setItemExpandedExplanations({}); // Reset item explanations on new hint request
    };

    // Req 4: Step button logic
    const handleStepAction = () => {
        if (isLoading && (currentButtonType === 'next_3step' || currentButtonType === 'next_step')) return;
        if (!isWhiteboardDirty) {
            toast.error("Please draw your steps on the whiteboard first.");
            return;
        }
        onTutorAction('next_3step', { current_step_index: 1 });
        setItemExpandedExplanations({}); // Reset item explanations on new step request
    };

    const checkProgressActionKey = 'verify_step'; // Or 'verify' depending on final decision
    const handleCheckProgress = () => {
        if (isLoading && currentButtonType === checkProgressActionKey) return;
        if (!isWhiteboardDirty) { // Also check for check progress
            toast.error("Please draw your solution on the whiteboard first.");
            return;
        }
        onTutorAction(checkProgressActionKey);
        setItemExpandedExplanations({});
    };

    const getHintButtonLabel = () => "Hints"; // Simplified label
    const getStepButtonLabel = () => "Next Steps"; // Simplified label

    const isButtonSelected = (buttonType) => {
        if (isLoading) return currentButtonType === buttonType ||
            (buttonType === 'hints' && (currentButtonType === 'next_3hint' || currentButtonType === 'next_hint')) ||
            (buttonType === 'steps' && (currentButtonType === 'next_3step' || currentButtonType === 'next_step')) ||
            (buttonType === 'verify' && currentButtonType === checkProgressActionKey);
        // Non-loading state selection
        if (buttonType === 'hints' && contentState.type === 'hints') return true;
        if (buttonType === 'steps' && contentState.type === 'steps') return true;
        // For verify, it's momentary, so selection might not be persistent unless a specific response type is active
        if (buttonType === 'verify' && tutorResponse.structuredResponse?.type === 'verify_steps') return true;
        return false;
    };

    const currentItemForGlobalExplanation = contentState.items[contentState.currentIndex];
    const globalExplanationText = tutorResponse.explanation ||
        (typeof currentItemForGlobalExplanation === 'object' ? currentItemForGlobalExplanation?.explanation : null);


    return (
        <motion.div
            className="w-full bg-white flex flex-col shadow-md h-full p-4 border-2 border-gray-50"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="mb-3" variants={itemVariants}>
                <motion.h3
                    className="text-xl font-semibold text-[#1F33E8]/75"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    Hey, {userName}, Let's solve it !
                </motion.h3>
            </motion.div>

            {/* Req 1 & 2: Audio Controls */}
            <AnimatePresence>
                {showAudioControls && (
                    <motion.div
                        className="mb-3"
                        variants={itemVariants}
                        initial="hidden" animate="visible" exit="hidden"
                    >
                        <motion.div className="text-[16px] font-semibold mb-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            Voice Explanation
                        </motion.div>
                        <motion.div className="flex items-center justify-between p-3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                            <div className="flex items-center space-x-3">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Switch
                                        checked={!audioStatus.isMuted}
                                        onCheckedChange={onAudioControl.toggleMute} // Toggles mute state
                                        disabled={currentButtonType === 'toggleMute'}
                                    />
                                </motion.div>
                                <Volume2 className={`w-5 h-5 ${audioStatus.isMuted ? 'text-gray-400' : 'text-gray-700'}`} />
                            </div>
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <Button
                                    size="icon" variant="ghost"
                                    onClick={audioStatus.isPlaying ? onAudioControl.pauseAudio : onAudioControl.resumeAudio} // Toggles play/pause
                                    className="p-2 rounded-full transition-colors disabled:opacity-50"
                                    disabled={currentButtonType === 'pauseAudio' || currentButtonType === 'resumeAudio'}
                                >
                                    <motion.div variants={iconVariants} whileHover="hover" whileTap="tap">
                                        {audioStatus.isPlaying ? (
                                            <PauseIcon className="w-5 h-5 text-gray-700 fill-current" />
                                        ) : (
                                            <Play className="w-5 h-5 text-gray-700 fill-current" />
                                        )}
                                    </motion.div>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Buttons: Hints, Check Progress, Next Steps */}
            <motion.div className="mb-4 mt-4" variants={itemVariants}>
                <motion.div className="flex flex-row gap-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Hint Button */}
                    <motion.div variants={itemVariants}> <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <Button
                            onClick={handleHintAction}
                            disabled={isLoading && (currentButtonType === 'next_3hint' || currentButtonType === 'next_hint')}
                            className={`flex items-center justify-center text-[16px] transition-all duration-300 text-primary border border-primary shadow-none ${isButtonSelected('hints') ? 'bg-tabs-background' : 'bg-white'}`}
                        >
                            {isButtonLoading('next_3hint') || isButtonLoading('next_hint') ? <motion.div className="w-4 h-4 mr-1.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : (buttonIcons.hints ? <Image src={isButtonSelected('hints') ? buttonIcons.hints.selected : buttonIcons.hints.unselected} alt="hints" width={12} height={12} /> : <Lightbulb className="w-4 h-4 mr-1.5" />)}
                            {getHintButtonLabel()}
                        </Button>
                    </motion.div></motion.div>
                    {/* Check Progress Button (Req 5: Ignored for now) */}
                    <motion.div variants={itemVariants}> <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <Button
                            onClick={handleCheckProgress}
                            disabled={isLoading && currentButtonType === checkProgressActionKey}
                            className={`flex items-center justify-center text-[16px] transition-all duration-300 text-primary border border-primary shadow-none ${isButtonSelected('verify') ? 'bg-tabs-background' : 'bg-white'} ${!isWhiteboardDirty ? 'opacity-50 cursor-not-allowed bg-gray-100 hover:bg-gray-100 border-gray-300 text-gray-500' : ''}`}
                        >
                            {isButtonLoading(checkProgressActionKey) ? <motion.div className="w-4 h-4 mr-1.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : (buttonIcons.verify ? <Image src={isButtonSelected('verify') ? buttonIcons.verify.selected : buttonIcons.verify.unselected} alt="verify" width={12} height={12} /> : <CheckCircle className="w-4 h-4 mr-1.5" />)}
                            Check Progress
                        </Button>
                    </motion.div></motion.div>
                    {/* Next Step Button */}
                    <motion.div variants={itemVariants}> <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <Button
                            onClick={handleStepAction}
                            disabled={!isWhiteboardDirty || (isLoading && (currentButtonType === 'next_3step' || currentButtonType === 'next_step'))}
                            className={`flex items-center justify-center text-[16px] transition-all duration-300 text-primary border border-primary shadow-none ${isButtonSelected('steps') ? 'bg-tabs-background' : 'bg-white'} ${!isWhiteboardDirty ? 'opacity-50 cursor-not-allowed bg-gray-100 hover:bg-gray-100 border-gray-300 text-gray-500' : ''}`}
                        >
                            {isButtonLoading('next_3step') || isButtonLoading('next_step') ? <motion.div className="w-4 h-4 mr-1.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : (buttonIcons.steps ? <Image src={isButtonSelected('steps') ? buttonIcons.steps.selected : buttonIcons.steps.unselected} alt="steps" width={12} height={12} /> : <ArrowRight className="w-4 h-4 mr-1.5" />)}
                            {getStepButtonLabel()}
                        </Button>
                    </motion.div></motion.div>
                </motion.div>
            </motion.div>

            {/* Content Display Area */}
            <motion.div className="flex-grow overflow-y-auto space-y-3 mb-4" variants={itemVariants}>
                <AnimatePresence mode="wait">
                    {/* Req 3: Loading state or No Content Placeholder */}
                    {isLoading && !hasDisplayableTextContent && !tutorResponse.streamingText && contentState.items.length === 0 && !tutorResponse.structuredResponse && (
                        <motion.div key="loading-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center py-8 text-gray-500">
                            <motion.div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin mr-2" />
                            <span>Thinking...</span>
                        </motion.div>
                    )}
                    {!isLoading && !hasDisplayableTextContent && !tutorResponse.streamingText && contentState.items.length === 0 && !tutorResponse.structuredResponse && (
                        <motion.div key="no-content-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-8 text-gray-400 text-center">
                            <HelpCircle className="w-12 h-12 mb-3" />
                            <p className="text-md font-medium text-gray-600">Ready for your input!</p>
                            <p className="text-sm text-gray-500">Select an option above or start solving.</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Streaming Text Response */}
                {tutorResponse.streamingText && (
                    <motion.div key="streaming-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card className="border-l-4 border-l-blue-500 bg-blue-50/50"><CardContent className="p-3">
                            <Latex>{tutorResponse.streamingText}</Latex>
                        </CardContent></Card>
                    </motion.div>
                )}

                {/* Hints or Steps List (Req 6, 7) */}
                {(contentState.type === 'hints' || contentState.type === 'steps') && contentState.items.length > 0 && (
                    <motion.div key={`${contentState.type}-list`} initial="hidden" animate="visible" variants={containerVariants} className="space-y-1.5">
                        {contentState.items.map((item, index) => {
                            const itemData = typeof item === 'string' ? { text: item } : item; // Ensure itemData is an object
                            const isUnlocked = contentState.unlockedIndices.includes(index);
                            // isNextToUnlock: if this is the first non-unlocked item
                            const isNextToUnlock = !isUnlocked && (index === 0 || contentState.unlockedIndices.includes(index - 1));
                            const itemKey = `${contentState.type}-${index}-${itemData?.text?.substring(0, 10) || 'item'}`;

                            return (
                                <motion.div key={itemKey} layout variants={itemVariants} className="text-md">
                                    {isUnlocked ? (
                                        <div className="grid grid-cols-[auto_1fr] gap-x-2 items-start py-1">
                                            <div className="flex justify-center pt-[9px] pr-1">
                                                <span className="inline-block rounded-full w-[7px] h-[7px] bg-black opacity-70"></span>
                                            </div>
                                            <div className="min-w-0">
                                                <Latex>{String(itemData.text || "Hint/Step text missing")}</Latex>
                                                {/* Req 6: Per-item explanation toggle */}
                                                {itemData.explanation && (
                                                    <div className="mt-1">
                                                        <Button
                                                            variant="link" size="sm"
                                                            onClick={() => toggleItemExplanation(index)}
                                                            className="text-xs px-0 py-0 h-auto text-blue-600 hover:text-blue-800"
                                                        >
                                                            <MessageCircle className="w-3 h-3 mr-1" />
                                                            {itemExpandedExplanations[index] ? 'Hide' : 'Show'} Explanation
                                                            <ChevronDown className={`w-3 h-3 ml-0.5 transition-transform ${itemExpandedExplanations[index] ? 'rotate-180' : ''}`} />
                                                        </Button>
                                                        <AnimatePresence>
                                                            {itemExpandedExplanations[index] && (
                                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                                                    <Card className="mt-1 bg-gray-50 border-gray-200"><CardContent className="p-2 text-sm text-gray-700">
                                                                        <Latex>{itemData.explanation}</Latex>
                                                                    </CardContent></Card>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : isNextToUnlock && !isLoading ? ( // Show unlock button if not loading (to prevent multiple clicks)
                                        <motion.div
                                            className="flex items-center ml-1 py-1 cursor-pointer group text-blue-600 hover:text-blue-800"
                                            onClick={() => handleUnlockContentItem(index, itemData)}
                                        >
                                            <Image src="/images/icons/unlock.png" alt={`Unlock`} width={20} height={20} className="opacity-80 group-hover:opacity-100 mr-1.5" />
                                            <span className="font-medium group-hover:underline">
                                                Unlock {contentState.type === 'hints' ? 'Hint' : 'Step'} {index + 1}
                                            </span>
                                        </motion.div>
                                    ) : ( // Locked or loading this item
                                        <div className="flex items-center space-x-2 py-1 px-1 text-gray-500 h-[34px]">
                                            {isLoading && contentState.animatingUnlock === index ? (
                                                <motion.div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-1" />
                                            ) : (
                                                <Lock className="w-[16px] h-[16px] ml-0.5 text-gray-400" />
                                            )}
                                            <span className="font-medium">
                                                {contentState.type === 'hints' ? 'Hint' : 'Step'} {index + 1} {isLoading && contentState.animatingUnlock === index ? '(Unlocking...)' : '(Locked)'}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

                {/* Structured Response (e.g., from Check Progress) */}
                {tutorResponse.structuredResponse?.type === 'verify_steps' && Array.isArray(tutorResponse.structuredResponse.stepsData) && (
                    <motion.div key="verify-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                        {/* ... (existing verify_steps rendering, ensure Latex is used for math) ... */}
                        {tutorResponse.structuredResponse.message && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <Card className="border-l-4 border-l-yellow-500 bg-yellow-50/50"><CardContent className="p-3 text-sm text-yellow-700 flex items-center">
                                    <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" /> <Latex>{tutorResponse.structuredResponse.message}</Latex>
                                </CardContent></Card>
                            </motion.div>
                        )}
                        {tutorResponse.structuredResponse.stepsData.map((step, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                                <Card className={`border-l-4 ${step.are_both_steps_correct ? 'border-l-green-500 bg-green-50/50' : 'border-l-red-500 bg-red-50/50'}`}>
                                    <CardContent className="p-3 text-sm"><div className="flex items-start space-x-2.5">
                                        {step.are_both_steps_correct ? <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />}
                                        <div className="flex-1 min-w-0 space-y-1.5">
                                            {step.student_written_step && step.student_written_step !== "No corresponding step in the question." && (
                                                <div><span className="font-medium text-gray-700">Your step:</span> <div className="text-gray-600 pl-2 border-l-2 border-gray-300 ml-1 mt-0.5"><Latex>{step.student_written_step}</Latex></div></div>
                                            )}
                                            {step.explanation && (
                                                <div><span className="font-medium text-gray-700">Feedback:</span> <p className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words"><Latex>{step.explanation}</Latex></p></div>
                                            )}
                                            {!step.are_both_steps_correct && step.correct_step && step.correct_step !== "No corresponding step in the question." && (
                                                <div><span className="font-medium text-gray-700">Correct step:</span> <div className="text-gray-600 pl-2 border-l-2 border-green-300 ml-1 mt-0.5"><Latex>{step.correct_step}</Latex></div></div>
                                            )}
                                        </div></div></CardContent></Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Global Explanation Section (Req 8: onExplanationAudio for this) */}
                {globalExplanationText && (
                    <motion.div key="global-explanation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                        <Card className="border-l-4 border-l-indigo-500 bg-indigo-50/50">
                            <CardContent className="p-3">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-xs font-semibold text-indigo-700">Tutor Explanation</span>
                                    <Button variant="link" size="sm" onClick={() => setGlobalExpandedExplanation(!globalExpandedExplanation)} className="text-xs px-1 py-0 h-auto text-indigo-600">
                                        {globalExpandedExplanation ? 'Hide' : 'Show'} Details
                                        <ChevronDown className={`w-3 h-3 ml-0.5 transition-transform ${globalExpandedExplanation ? 'rotate-180' : ''}`} />
                                    </Button>
                                </div>
                                <AnimatePresence>
                                    {globalExpandedExplanation && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap pt-1">
                                                <Latex>{globalExplanationText}</Latex>
                                            </div>
                                            {/* Req 8: Play audio for this global explanation */}
                                            <Button
                                                size="sm" variant="ghost" onClick={onExplanationAudio}
                                                className="text-xs px-1.5 py-0.5 h-auto text-indigo-700 hover:text-indigo-900 mt-2"
                                                disabled={isLoading && currentButtonType === 'explanation'}>
                                                {isLoading && currentButtonType === 'explanation' ? <motion.div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" /> : <Play className="w-3 h-3 mr-1 fill-current" />}
                                                Play Audio Explanation
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

            </motion.div>

            {/* Footer: Check Solution & Feedback Buttons (Req 9: enable/disable copy etc.) */}
            <motion.div className="mt-auto pt-2 border-t border-gray-100" variants={itemVariants}>
                <motion.div className="flex justify-between items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <motion.div className="flex-grow mr-2" variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <Button
                            onClick={() => {
                                if (!isWhiteboardDirty) {
                                    toast.error("Please draw your final solution on the whiteboard first.");
                                    return;
                                }
                                onTutorAction('verify'); // Using 'verify' for final solution
                                setItemExpandedExplanations({});
                            }}
                            disabled={!isWhiteboardDirty || (isLoading && currentButtonType === 'verify') || isAudioOrTextStreaming}
                            className={`w-full text-sm transition-all duration-300 ${!isWhiteboardDirty || isAudioOrTextStreaming ? 'opacity-50 cursor-not-allowed' : ''} ${!isWhiteboardDirty ? 'bg-gray-100 hover:bg-gray-100 border-gray-300 text-gray-500' : 'bg-primary text-white hover:bg-primary/90'}`}
                        >
                            {isButtonLoading('verify') ? <><motion.div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" /> Checking... </> : <> Check my final solution <ChevronRightIcon className="w-4 h-4 ml-1 inline-block" /></>}
                        </Button>
                    </motion.div>
                    {[
                        { Icon: Copy, label: 'Copy', stateKey: 'copied', action: handleCopyResponse, color: 'blue' },
                        { Icon: ThumbsDown, label: 'Dislike', stateKey: 'downvoted', action: handleDownvote, color: 'red' },
                        { Icon: ThumbsUp, label: 'Like', stateKey: 'upvoted', action: handleUpvote, color: 'green' }
                    ].map(({ Icon, label, stateKey, action, color }) => {
                        const isDisabled = (!hasDisplayableTextContent && !tutorResponse.streamingText) || isAudioOrTextStreaming;
                        return (
                            <motion.div key={label} variants={buttonVariants} whileHover={!isDisabled ? "hover" : "idle"} whileTap={!isDisabled ? "tap" : "idle"}>
                                <Button variant="ghost" size="icon" aria-label={label} title={label} disabled={isDisabled} onClick={action}
                                    className={`transition-all duration-300 p-1.5 ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
                                    <Icon className={`h-5 w-5 transition-colors duration-200 ${actionStates[stateKey] ? `text-${color}-500` : isDisabled ? 'text-gray-300' : `text-gray-400 hover:text-${color}-500`}`} />
                                </Button>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default React.memo(TutorInteractionPanel);