'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import toast from 'react-hot-toast';
import { useTutorWebSocket } from '@/hooks/useTutorWebSocket';
import WebSocketServiceInstance from '@/lib/WebSocketService';
import TutorInteractionPanel from '@/components/features/TutorInteractionPanel';
import { dataURLtoFile } from '@/lib/fileUtils';
import { useSelector } from 'react-redux';
import StylusDrawComponent from '@/components/shared/SuperInputBox/StylusComponent';

const createVerifyStepResponseStructure = (steps, allStepsCorrect, response) => {
    return {
        type: 'verify_steps',
        stepsData: Array.isArray(steps) ? steps : (steps ? [steps] : []),
        allStepsCorrect,
        isCompleteFlag: response?.is_complete_flag,
        message: response?.message,
    };
};
const MathTutorPage = () => {
    const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
    const [isWhiteboardDirty, setIsWhiteboardDirty] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentButtonType, setCurrentButtonType] = useState(null);
    const currentActionParamsRef = useRef(null);
    const stylusDrawRef = useRef(null);

    const [tutorResponse, setTutorResponse] = useState({
        streamingText: "",
        isStreamingEffect: false,
        structuredResponse: null,
        explanation: null,
    });

    const selectedQuestionFromStore = useSelector(
        (state) => state?.aiMathTutor?.answers || {},
    );

    const currentQuestion = useMemo(() => {
        if (selectedQuestionFromStore && typeof selectedQuestionFromStore === 'object' && !Array.isArray(selectedQuestionFromStore) && selectedQuestionFromStore.question) {
            const questionTextArray = Array.isArray(selectedQuestionFromStore.question)
                ? selectedQuestionFromStore.question
                : [String(selectedQuestionFromStore.question)];

            const questionDisplayString = Array.isArray(selectedQuestionFromStore.question)
                ? selectedQuestionFromStore.question.join(' ')
                : String(selectedQuestionFromStore.question);

            return {
                fileId: selectedQuestionFromStore.fileId,
                question: questionTextArray,
                displayQuestion: `Question: ${questionDisplayString}`,
                question_url: selectedQuestionFromStore.question_url,
            };
        }
        return { question: ["Loading question..."], displayQuestion: "Loading question...", question_url: "" };
    }, [selectedQuestionFromStore]);

    const [contentState, setContentState] = useState({
        type: null,
        items: [],
        unlockedIndices: [],
        currentIndex: 0,
        animatingUnlock: null,
    });
    const [pageAudioStatus, setPageAudioStatus] = useState(() => WebSocketServiceInstance.getAudioStatus());

    const handleDrawingChange = useCallback((hasContent) => {
        setIsWhiteboardDirty(hasContent);
    }, []);

    const resetProcessingState = useCallback(() => {
        setIsLoading(false);
        setCurrentButtonType(null);
        currentActionParamsRef.current = null;
    }, []);

    const memoizedHandleWebSocketError = useCallback((error) => {
        console.error("Page WebSocket error:", error);
        const errorMessage = String(error?.message || "An unknown WebSocket error occurred.").toLowerCase();
        if (["you exceeded your current quota", "received 1011", "audio quota"].some(msg => errorMessage.includes(msg))) {
            toast.error("You have exhausted your audio quota. Please try again later.");
        } else if (errorMessage.includes("websocket not connected") || errorMessage.includes("connection error")) {
            toast.error("Connection issue. Please check your internet or try reconnecting.");
        } else {
            toast.error(error?.message || "WebSocket error occurred.");
        }
        resetProcessingState();
    }, [resetProcessingState]);

    const memoizedHandleWebSocketMessage = useCallback((data) => {
        setIsLoading(false);
        const requestedActionParams = currentActionParamsRef.current || {};
        const feature = requestedActionParams.feature;
        console.log("Page WebSocket data:", data, "for feature:", feature);

        if (data.status === "error") {
            const errorMessage = data?.message?.toLowerCase() || "";
            if (["you exceeded your current quota", "received 1011", "audio quota"].some(msg => errorMessage.includes(msg))) {
                toast.error("You have exhausted your audio quota.");
            } else {
                toast.error(data?.message || "Tutor service error.");
            }
            setTutorResponse(prev => ({ ...prev, structuredResponse: { type: 'error', message: data.message } }));
            resetProcessingState();
            return;
        }

        if (data.status === "success" && data.data_type === "audio" && data.data) return;
        if (data.type === "audio_stream_complete") return;

        if (data.status === "success" && !data.data_type) {
            let responsePayload = { structuredResponse: null, streamingText: "", explanation: null, isStreamingEffect: false };
            let newContentStateUpdate = {};

            const isHintFeature = feature === "next_hint" || feature === "next_3hint";
            const isStepFeature = feature === "next_step" || feature === "next_3step";

            setTutorResponse(prev => ({
                ...prev,
                streamingText: "",
                isStreamingEffect: false,
                structuredResponse: (isHintFeature || isStepFeature) ? prev.structuredResponse : null,
                explanation: (feature === "explanation" || isHintFeature || isStepFeature) ? prev.explanation : null
            }));


            if (data.steps && data.steps.length > 0 && !isHintFeature && !isStepFeature) {
                const steps = data.steps;
                const allStepsCorrect = steps.every(s => s.are_both_steps_correct !== false);
                responsePayload.structuredResponse = createVerifyStepResponseStructure(steps, allStepsCorrect, data);
                responsePayload.explanation = steps[0]?.explanation || (data.message || null);
                if (data.message && !(steps[0]?.explanation)) toast.info(data.message);
                setContentState({ type: null, items: [], unlockedIndices: [], currentIndex: 0, animatingUnlock: null });
            } else if (isHintFeature && data.hint) {
                const incomingHintData = data.hint.next_hint;
                const backendExplanation = data.hint.explanation_of_hint || data.hint.explaination_of_hint || null;
                const requestedHintIndex = requestedActionParams.current_hint_index || 1;

                let finalItems;
                let newUnlockedIndices;
                let newCurrentIndex = requestedHintIndex - 1;

                responsePayload.explanation = backendExplanation;

                if ((feature === "next_3hint" && requestedHintIndex === 1)) {
                    if (Array.isArray(incomingHintData)) {
                        finalItems = incomingHintData.map(h => (typeof h === 'string' ? { text: h, explanation: null } : { ...h, explanation: h.explanation || null }));
                    } else if (incomingHintData) {
                        finalItems = [typeof incomingHintData === 'string' ? { text: incomingHintData, explanation: null } : { ...incomingHintData, explanation: incomingHintData.explanation || null }];
                    } else {
                        finalItems = [];
                    }
                    if (finalItems.length > 0 && backendExplanation && !finalItems[0].explanation) {
                        finalItems[0].explanation = backendExplanation;
                    }
                    newUnlockedIndices = finalItems.length > 0 ? [0] : [];
                    newCurrentIndex = 0;
                } else if (feature === "next_3hint" && contentState.type === 'hints' && requestedHintIndex > 0) {
                    finalItems = [...contentState.items];
                    newUnlockedIndices = [...contentState.unlockedIndices];
                    const itemToUpdateIndex = requestedHintIndex - 1;

                    let unlockedItemData = {};
                    if (typeof incomingHintData === 'string') {
                        unlockedItemData = { text: incomingHintData, explanation: backendExplanation };
                    } else if (typeof incomingHintData === 'object' && incomingHintData !== null) {
                        unlockedItemData = { ...incomingHintData, explanation: incomingHintData.explanation || backendExplanation };
                    } else {
                        unlockedItemData = finalItems[itemToUpdateIndex] || { text: "Error loading hint", explanation: backendExplanation };
                        if (typeof unlockedItemData === 'string') unlockedItemData = { text: unlockedItemData, explanation: backendExplanation };
                    }

                    if (itemToUpdateIndex >= 0 && itemToUpdateIndex < finalItems.length) {
                        finalItems[itemToUpdateIndex] = unlockedItemData;
                    } else {
                        finalItems.push(unlockedItemData);
                    }

                    if (!newUnlockedIndices.includes(itemToUpdateIndex)) {
                        newUnlockedIndices.push(itemToUpdateIndex);
                        newUnlockedIndices.sort((a, b) => a - b);
                    }
                    newCurrentIndex = itemToUpdateIndex;
                } else {
                    finalItems = contentState.items;
                    newUnlockedIndices = contentState.unlockedIndices;
                    newCurrentIndex = contentState.currentIndex;
                }
                if (newCurrentIndex < 0 || newCurrentIndex >= finalItems.length) newCurrentIndex = finalItems.length > 0 ? (newUnlockedIndices.length > 0 ? newUnlockedIndices[newUnlockedIndices.length - 1] : 0) : 0;
                if (finalItems.length === 0) newCurrentIndex = 0;

                newContentStateUpdate = { type: 'hints', items: finalItems, unlockedIndices: newUnlockedIndices, currentIndex: newCurrentIndex, animatingUnlock: null };
            } else if (isStepFeature && data.hint) {
                const incomingStepData = data.hint.next_step;
                const backendExplanation = data.hint.explanation_of_hint || data.hint.explaination_of_hint || null;
                const requestedStepIndex = requestedActionParams.current_step_index || 1;

                let finalItems;
                let newUnlockedIndices;
                let newCurrentIndex = requestedStepIndex - 1;
                responsePayload.explanation = backendExplanation;

                if ((feature === "next_3step" && requestedStepIndex === 1)) {
                    if (Array.isArray(incomingStepData)) {
                        finalItems = incomingStepData.map(s => (typeof s === 'string' ? { text: s, explanation: null } : { ...s, explanation: s.explanation || null }));
                    } else if (incomingStepData) {
                        finalItems = [typeof incomingStepData === 'string' ? { text: incomingStepData, explanation: null } : { ...incomingStepData, explanation: incomingStepData.explanation || null }];
                    } else {
                        finalItems = [];
                    }
                    if (finalItems.length > 0 && backendExplanation && !finalItems[0].explanation) {
                        finalItems[0].explanation = backendExplanation;
                    }
                    newUnlockedIndices = finalItems.length > 0 ? [0] : [];
                    newCurrentIndex = 0;
                } else if (feature === "next_3step" && contentState.type === 'steps' && requestedStepIndex > 0) {
                    finalItems = [...contentState.items];
                    newUnlockedIndices = [...contentState.unlockedIndices];
                    const itemToUpdateIndex = requestedStepIndex - 1;
                    let unlockedItemData = {};
                    if (typeof incomingStepData === 'string') {
                        unlockedItemData = { text: incomingStepData, explanation: backendExplanation };
                    } else if (typeof incomingStepData === 'object' && incomingStepData !== null) {
                        unlockedItemData = { ...incomingStepData, explanation: incomingStepData.explanation || backendExplanation };
                    } else {
                        unlockedItemData = finalItems[itemToUpdateIndex] || { text: "Error loading step", explanation: backendExplanation };
                        if (typeof unlockedItemData === 'string') unlockedItemData = { text: unlockedItemData, explanation: backendExplanation };
                    }

                    if (itemToUpdateIndex >= 0 && itemToUpdateIndex < finalItems.length) {
                        finalItems[itemToUpdateIndex] = unlockedItemData;
                    } else {
                        finalItems.push(unlockedItemData);
                    }
                    if (!newUnlockedIndices.includes(itemToUpdateIndex)) {
                        newUnlockedIndices.push(itemToUpdateIndex);
                        newUnlockedIndices.sort((a, b) => a - b);
                    }
                    newCurrentIndex = itemToUpdateIndex;
                } else {
                    finalItems = contentState.items;
                    newUnlockedIndices = contentState.unlockedIndices;
                    newCurrentIndex = contentState.currentIndex;
                }

                if (newCurrentIndex < 0 || newCurrentIndex >= finalItems.length) newCurrentIndex = finalItems.length > 0 ? (newUnlockedIndices.length > 0 ? newUnlockedIndices[newUnlockedIndices.length - 1] : 0) : 0;
                if (finalItems.length === 0) newCurrentIndex = 0;
                newContentStateUpdate = { type: 'steps', items: finalItems, unlockedIndices: newUnlockedIndices, currentIndex: newCurrentIndex, animatingUnlock: null };
            } else if (feature === "explanation") {
                if (data.data && typeof data.data === 'string') {
                    responsePayload.explanation = data.data;
                }
            } else if (data.data && typeof data.data === 'string') {
                responsePayload.streamingText = data.data;
                responsePayload.isStreamingEffect = true;
                if (!isHintFeature && !isStepFeature) {
                    setContentState({ type: null, items: [], unlockedIndices: [], currentIndex: 0, animatingUnlock: null });
                }
            }


            if (Object.keys(newContentStateUpdate).length > 0) {
                setContentState(prev => ({ ...prev, ...newContentStateUpdate }));
            }

            setTutorResponse(prev => ({
                ...prev,
                streamingText: responsePayload.streamingText || "",
                isStreamingEffect: responsePayload.isStreamingEffect,
                structuredResponse: responsePayload.structuredResponse !== undefined ? responsePayload.structuredResponse : prev.structuredResponse,
                explanation: responsePayload.explanation !== undefined ? responsePayload.explanation : prev.explanation,
            }));
            if (!responsePayload.streamingText && !responsePayload.structuredResponse && (!newContentStateUpdate.items || newContentStateUpdate.items.length === 0) && !(data.steps && data.steps.length > 0) && feature !== "explanation") {
                console.warn("Received an empty or unhandled successful response for feature:", feature);
            }
        }
        currentActionParamsRef.current = null;
    }, [resetProcessingState, contentState.type, contentState.items, contentState.unlockedIndices, contentState.currentIndex]);


    const memoizedHandleWebSocketConnection = useCallback((isConnected) => {
        if (isConnected) {
            toast.success("Connected to AI Tutor");
        } else {
            toast.error("Disconnected from AI Tutor. Attempting to reconnect...");
        }
        resetProcessingState();
    }, [resetProcessingState]);

    const handleAudioStatusChange = useCallback((newStatus) => {
        setPageAudioStatus(prevStatus => {
            if (JSON.stringify(prevStatus) === JSON.stringify(newStatus)) {
                return prevStatus;
            }
            return newStatus;
        });
    }, []);

    const memoizedHeartbeat = useCallback((_data) => { }, []);

    const {
        connected: wsConnected,
        sendMessage: wsSendMessage,
        pauseAudio,
        resumeAudio,
        stopAudio,
        toggleMute,
        audioStatus: hookAudioStatus,
        connect: wsConnect,
    } = useTutorWebSocket({
        message: memoizedHandleWebSocketMessage,
        error: memoizedHandleWebSocketError,
        connectionChange: memoizedHandleWebSocketConnection,
        audioStatusChange: handleAudioStatusChange,
        heartbeat: memoizedHeartbeat,
    });

    useEffect(() => {
        setPageAudioStatus(hookAudioStatus);
    }, [hookAudioStatus]);

    const onAudioControlObj = useMemo(() => ({
        toggleMute, pauseAudio, resumeAudio, stopAudio,
    }), [toggleMute, pauseAudio, resumeAudio, stopAudio]);

    const memoizedHandleTutorAction = useCallback(async (actionType, additionalParams = {}) => {
        if (!wsConnected) {
            toast.error("Not connected. Please wait or try reconnecting.");
            wsConnect();
            return;
        }

        const needsDrawingForAction = ["verify_step", "verify", "next_3step"].includes(actionType);
        if (needsDrawingForAction && !isWhiteboardDirty) {
            const message = (actionType === "next_3step")
                ? "Please draw your steps on the whiteboard before requesting next steps."
                : "Please draw your solution on the whiteboard first.";
            toast.error(message);
            return;
        }

        setIsLoading(true);
        setCurrentButtonType(actionType);
        currentActionParamsRef.current = { feature: actionType, ...additionalParams };

        const isMainButtonAction = ['next_3hint', 'next_3step', 'verify_step', 'verify'].includes(actionType) &&
            (additionalParams.current_hint_index === 1 || additionalParams.current_step_index === 1 || actionType.includes('verify'));

        if (isMainButtonAction) {
            console.log("Proactively resetting state for main action:", actionType);
            stopAudio();
            setTutorResponse(prev => ({
                ...prev,
                streamingText: "",
                isStreamingEffect: false,
                structuredResponse: null,
                explanation: null,
            }));
            setContentState({
                type: actionType.includes('hint') ? 'hints' : (actionType.includes('step') ? 'steps' : null),
                items: [],
                unlockedIndices: [],
                currentIndex: 0,
                animatingUnlock: null,
            });
        } else if (actionType !== "explanation" && !actionType.includes("hint") && !actionType.includes("step")) {
            stopAudio();
        }

        let solutionS3Key = "no_input";
        const needsDrawingUpload = ["verify_step", "verify", "next_3step"].includes(actionType);

        if (isWhiteboardDirty && needsDrawingUpload && stylusDrawRef.current) {
            const imageDataUrl = await stylusDrawRef.current.exportDrawing();
            if (imageDataUrl) {
                const imageFile = await dataURLtoFile(imageDataUrl, 'math_tutor_drawing.png');
                if (imageFile) {
                    const formData = new FormData();
                    formData.append("type", "RTT_Drawing");
                    formData.append("files", imageFile);
                    try {
                        const response = await fetch("/api/s3/upload", { method: "POST", body: formData });
                        if (!response.ok) throw new Error(`S3 Upload HTTP error! Status: ${response.status}`);
                        const result = await response.json();
                        if (!result?.success || !result.files?.[0]?.fileKey) {
                            throw new Error(result?.message || "Failed to get S3 key from upload response");
                        }
                        solutionS3Key = result.files[0].fileKey;
                    } catch (uploadError) {
                        toast.error(`Error uploading drawing: ${uploadError.message}`);
                        resetProcessingState();
                        return;
                    }
                } else {
                    toast.error("Could not process drawing for submission."); resetProcessingState(); return;
                }
            } else if (isWhiteboardDirty) {
                toast.error("Failed to capture drawing. Please try again."); resetProcessingState(); return;
            }
        }

        const payload = {
            question: currentQuestion.question,
            solution: solutionS3Key,
            question_url: currentQuestion.question_url || "no_input",
            feature: actionType,
            audio_feedback: true,
            explanation: additionalParams.explanationForAudio || null,
            current_hint_index: additionalParams.current_hint_index,
            current_step_index: additionalParams.current_step_index,
            hint: additionalParams.hint,
            step: additionalParams.step,
            ...additionalParams,
        };

        if (payload.current_hint_index === undefined) delete payload.current_hint_index;
        if (payload.current_step_index === undefined) delete payload.current_step_index;
        if (payload.hint === undefined) delete payload.hint;
        if (payload.step === undefined) delete payload.step;

        console.log("Page WebSocket payload:", payload);

        try {
            await wsSendMessage(payload);
        } catch (error) {
            toast.error(`Failed to send action: ${error.message}`);
            resetProcessingState();
        }
    }, [
        wsConnected, isWhiteboardDirty, stopAudio, wsSendMessage,
        currentQuestion, resetProcessingState, wsConnect,
    ]);

    const memoizedHandleContentItemAction = useCallback((_actionTypeIgnored, itemIndex, item) => {
        const newActionType = contentState.type === 'hints' ? 'next_3hint' : 'next_3step';
        const indexParam = contentState.type === 'hints' ? 'current_hint_index' : 'current_step_index';
        const textParamKey = contentState.type === 'hints' ? 'hint' : 'step';

        const itemTextForPayload = typeof item === 'object' ? item.text : item;

        setContentState(prev => ({ ...prev, animatingUnlock: itemIndex, currentIndex: itemIndex }));

        memoizedHandleTutorAction(newActionType, {
            [indexParam]: itemIndex + 1,
            [textParamKey]: itemTextForPayload,
        });
    }, [memoizedHandleTutorAction, contentState.type, setContentState]);

    const memoizedHandleExplanationAudio = useCallback(async () => {
        let explanationTextToPlay = tutorResponse.explanation;

        if (contentState.items[contentState.currentIndex]) {
            const currentItem = contentState.items[contentState.currentIndex];
            if (typeof currentItem === 'object' && currentItem.explanation) {
                explanationTextToPlay = currentItem.explanation;
            }
        }

        if (!explanationTextToPlay) {
            toast.error("No explanation available to play.");
            return;
        }
        memoizedHandleTutorAction("explanation", { explanationForAudio: explanationTextToPlay });
    }, [tutorResponse.explanation, memoizedHandleTutorAction, contentState.items, contentState.currentIndex]);

    const toggleRightPanel = () => setIsRightPanelCollapsed(!isRightPanelCollapsed);

    const containerMotionVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemMotionVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    return (
        <motion.div
            className="flex overflow-hidden w-full h-screen"
            variants={containerMotionVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className={`transition-all duration-300 ease-in-out ${isRightPanelCollapsed ? 'w-full' : 'w-[67%]'} p-6 flex flex-col h-full`}
                layout
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <motion.div className="mb-4" variants={itemMotionVariants}>
                    <motion.h2 className="text-xl font-semibold text-gray-800">
                        <Latex>{currentQuestion.displayQuestion || "Question 2: Find x, x^3 =1"}</Latex>
                    </motion.h2>
                </motion.div>
                <motion.div className="mb-4 text-gray-600" variants={itemMotionVariants}>
                    ✍️ <span className="text-md">Start solving here. I'm right here</span> ➡️ <span className="text-md">with hints and reviews!</span>
                </motion.div>
                <motion.div className="flex-grow rounded-lg shadow-lg overflow-hidden bg-white border border-gray-200" variants={itemMotionVariants} style={{ minHeight: '50vh' }}>
                    <StylusDrawComponent
                        ref={stylusDrawRef}
                        onContentChange={handleDrawingChange}
                        height="100%"
                        placeholder="Start solving on the whiteboard..."
                    />
                </motion.div>
            </motion.div>

            <motion.div
                className={`transition-all duration-300 ease-in-out bg-white shadow-2xl relative h-full border-l border-gray-200 ${isRightPanelCollapsed ? 'w-12' : 'w-[33%]'}`}
                layout
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <motion.button
                    onClick={toggleRightPanel}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-16 bg-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow rounded-l-md border border-r-0 border-gray-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isRightPanelCollapsed ? <ChevronLeft className="w-5 h-5 text-gray-600 transform rotate-180" /> : <ChevronLeft className="w-5 h-5 text-gray-600" />}
                </motion.button>

                <AnimatePresence mode="wait">
                    {!isRightPanelCollapsed && (
                        <motion.div
                            className="h-full overflow-y-auto"
                            initial={{ opacity: 0, x: "100%" }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "100%" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <TutorInteractionPanel
                                isLoading={isLoading}
                                currentButtonType={currentButtonType}
                                audioStatus={pageAudioStatus}
                                onAudioControl={onAudioControlObj}
                                onTutorAction={memoizedHandleTutorAction}
                                tutorResponse={tutorResponse}
                                contentState={contentState}
                                onContentItemAction={memoizedHandleContentItemAction}
                                onExplanationAudio={memoizedHandleExplanationAudio}
                                isWhiteboardDirty={isWhiteboardDirty}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    )
};

export default MathTutorPage;