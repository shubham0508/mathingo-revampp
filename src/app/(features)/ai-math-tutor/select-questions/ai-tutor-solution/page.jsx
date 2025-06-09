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
import { useSelector, useDispatch } from 'react-redux';
import StylusDrawComponent from '@/components/shared/SuperInputBox/StylusComponent';
import { useRouter } from 'next/navigation';
import { useCheckMySolutionMutation } from '@/store/slices/AMT';
import { setSolutionFeedback } from '@/store/reducers/AMT';
import { useSession } from 'next-auth/react';

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
    const [dbSessionId, setDbSessionId] = useState(null);
    const [timer, setTimer] = useState(0);
    const [requestCount, setRequestCount] = useState(0);
    const currentActionParamsRef = useRef(null);
    const stylusDrawRef = useRef(null);

    const dispatch = useDispatch();
    const router = useRouter();
    const [checkMySolution, { isLoading: isCheckingSolutionApi }] = useCheckMySolutionMutation();
    const { data: session } = useSession();
    const isGuestUser = session?.user?.isGuest || false;

    const [tutorResponse, setTutorResponse] = useState({
        streamingText: "",
        isStreamingEffect: false,
        structuredResponse: null,
        explanation: null,
        activeItemDetail: null,
    });

    const selectedQuestionDetails = useSelector(
        (state) => state?.aiMathTutor?.answers || {},
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const currentQuestion = useMemo(() => {
        if (selectedQuestionDetails && typeof selectedQuestionDetails === 'object' && !Array.isArray(selectedQuestionDetails) && selectedQuestionDetails.question) {
            const questionTextArray = Array.isArray(selectedQuestionDetails.question)
                ? selectedQuestionDetails.question
                : [String(selectedQuestionDetails.question)];

            const questionDisplayString = Array.isArray(selectedQuestionDetails.question)
                ? selectedQuestionDetails.question.join(' ')
                : String(selectedQuestionDetails.question);

            return {
                question_id: selectedQuestionDetails.question_id,
                question: questionTextArray,
                displayQuestion: `Question: ${questionDisplayString}`,
                question_url: selectedQuestionDetails.question_url,
                question_difficulty_level: selectedQuestionDetails?.question_difficulty_level
            };
        }

        const fallbackQuestionId = selectedQuestionDetails?.currentQuestion?.question_id || selectedQuestionDetails?.question_id;
        const fallbackQuestionText = selectedQuestionDetails?.currentQuestion?.text || "Loading question...";
        const fallbackQuestionUrl = selectedQuestionDetails?.currentQuestion?.file_url || selectedQuestionDetails?.question_url || "";

        const questionTextArray = Array.isArray(fallbackQuestionText)
            ? fallbackQuestionText
            : [String(fallbackQuestionText)];
        const questionDisplayString = Array.isArray(fallbackQuestionText)
            ? fallbackQuestionText.join(' ')
            : String(fallbackQuestionText);

        return {
            question_id: fallbackQuestionId,
            question: questionTextArray,
            displayQuestion: `Question: ${questionDisplayString}`,
            question_url: fallbackQuestionUrl,
        };
    }, [selectedQuestionDetails]);

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

    useEffect(() => {
        if (pageAudioStatus.queueLength === 0 && currentButtonType === 'explanation' && isLoading) {
            setIsLoading(false);
            setCurrentButtonType(null);
            if (currentActionParamsRef.current && currentActionParamsRef.current.feature === 'explanation') {
                currentActionParamsRef.current = null;
            }
        }
    }, [pageAudioStatus.queueLength, currentButtonType, isLoading]);

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
        if (data.type === "session_established" && data.session_id) {
            setDbSessionId(data.session_id);
            return;
        }

        const requestedActionParams = currentActionParamsRef.current || {};
        const feature = requestedActionParams.feature;

        if (feature !== "explanation" && data.type !== "audio_stream_complete") {
            setIsLoading(false);
        }

        if (data.status === "info" && data.message && data.message.toLowerCase().includes("connection timeout")) {
            toast.info(data.message);
            resetProcessingState();
            setTutorResponse({ streamingText: "", isStreamingEffect: false, structuredResponse: null, explanation: null, activeItemDetail: null });
            setContentState({ type: null, items: [], unlockedIndices: [], currentIndex: 0, animatingUnlock: null });
            return;
        }

        if (data.status === "error") {
            setIsLoading(false);
            const errorMessage = data?.message?.toLowerCase() || "";
            if (["you exceeded your current quota", "received 1011", "audio quota"].some(msg => errorMessage.includes(msg))) {
                toast.error("You have exhausted your audio quota.");
            } else if (data.error_code === "SESSION_INIT_FAILED") {
                toast.error(data?.message || "Failed to initialize session. Please try reconnecting.");
            } else {
                toast.error(data?.message || "Tutor service error.");
            }
            setTutorResponse(prev => ({ ...prev, structuredResponse: { type: 'error', message: data.message } }));
            resetProcessingState();
            return;
        }

        if (data.status === "success" && data.data_type === "audio" && data.data) {
            return;
        }
        if (data.type === "audio_stream_complete") {
            if (currentActionParamsRef.current?.feature === "explanation") {
                setIsLoading(false);
            }
            return;
        }

        if (data.status === "success" && !data.data_type) {
            if (feature !== 'explanation') {
                setIsLoading(false);
            }

            let newTutorResponseUpdate = {
                streamingText: "",
                isStreamingEffect: false,
                structuredResponse: null,
                explanation: null,
                activeItemDetail: null,
            };
            let newContentStateUpdate = {
                type: null, items: [], unlockedIndices: [], currentIndex: 0, animatingUnlock: null
            };

            if ((feature === "next_hint" || feature === "next_step") && data.steps && Array.isArray(data.steps)) {
                newTutorResponseUpdate.structuredResponse = {
                    type: feature === "next_hint" ? 'fix_errors_hint' : 'fix_errors_step',
                    stepsData: data.steps,
                    message: null,
                    isCompleteFlag: data.is_complete_flag,
                };
            } else if (feature === "next_hint") {
                if (data.hint && typeof data.hint.next_hint === 'string') {
                    newTutorResponseUpdate.activeItemDetail = {
                        type: 'hint',
                        mainText: data.hint.next_hint,
                        explanationText: data.hint.explanation_of_hint || data.hint.explaination_of_hint,
                    };
                } else if (data.hint && Array.isArray(data.hint.next_hint)) {
                    const hintItems = data.hint.next_hint.map(h_text => ({
                        text: h_text,
                        explanation: data.hint.explanation_of_hint || data.hint.explaination_of_hint || null,
                    }));
                    newContentStateUpdate = {
                        type: 'hints',
                        items: hintItems,
                        unlockedIndices: hintItems.length > 0 ? [0] : [],
                        currentIndex: 0,
                        animatingUnlock: null,
                    };
                }
            } else if (feature === "next_step") {
                if (data.hint && typeof data.hint.next_step === 'string') {
                    newTutorResponseUpdate.activeItemDetail = {
                        type: 'step',
                        mainText: data.hint.next_step,
                        explanationText: data.hint.explanation_of_hint || data.hint.explaination_of_hint,
                    };
                } else if (data.hint && Array.isArray(data.hint.next_step)) {
                    const stepItems = data.hint.next_step.map(s_text => ({
                        text: s_text,
                        explanation: data.hint.explanation_of_hint || data.hint.explaination_of_hint || null,
                    }));
                    newContentStateUpdate = {
                        type: 'steps',
                        items: stepItems,
                        unlockedIndices: stepItems.length > 0 ? [0] : [],
                        currentIndex: 0,
                        animatingUnlock: null,
                    };
                }
            } else if (feature === "next_3hint" && data.hint) {
                const itemToUpdateIndex = (requestedActionParams.current_hint_index || 1) - 1;
                const clickedIndex = itemToUpdateIndex;
                const unlockedItemData = {
                    text: data.hint.next_hint,
                    explanation: data.hint.explanation_of_hint || data.hint.explaination_of_hint,
                };

                const updatedItems = [...contentState.items];
                if (itemToUpdateIndex >= 0 && itemToUpdateIndex < updatedItems.length) {
                    updatedItems[itemToUpdateIndex] = unlockedItemData;
                } else if (itemToUpdateIndex === updatedItems.length) {
                    updatedItems.push(unlockedItemData);
                } else {
                    while (updatedItems.length < itemToUpdateIndex) {
                        updatedItems.push({ text: "...", explanation: null });
                    }
                    updatedItems.push(unlockedItemData);
                }

                const newUnlockedIndices = Array.from(new Set([...contentState.unlockedIndices, clickedIndex])).sort((a, b) => a - b);

                newContentStateUpdate = {
                    type: 'hints',
                    items: updatedItems,
                    unlockedIndices: newUnlockedIndices,
                    currentIndex: itemToUpdateIndex,
                    animatingUnlock: null,
                };
                setIsLoading(false);
                currentActionParamsRef.current = null;
            } else if (feature === "next_3step" && data.hint) {
                const itemToUpdateIndex = (requestedActionParams.current_step_index || 1) - 1;
                const clickedIndex = itemToUpdateIndex;
                const unlockedItemData = {
                    text: data.hint.next_step,
                    explanation: data.hint.explanation_of_hint || data.hint.explaination_of_hint,
                };
                const updatedItems = [...contentState.items];
                if (itemToUpdateIndex >= 0 && itemToUpdateIndex < updatedItems.length) {
                    updatedItems[itemToUpdateIndex] = unlockedItemData;
                } else if (itemToUpdateIndex === updatedItems.length) {
                    updatedItems.push(unlockedItemData);
                } else {
                    while (updatedItems.length < itemToUpdateIndex) {
                        updatedItems.push({ text: "...", explanation: null });
                    }
                    updatedItems.push(unlockedItemData);
                }

                const newUnlockedIndices = Array.from(new Set([...contentState.unlockedIndices, clickedIndex])).sort((a, b) => a - b);

                newContentStateUpdate = {
                    type: 'steps',
                    items: updatedItems,
                    unlockedIndices: newUnlockedIndices,
                    currentIndex: itemToUpdateIndex,
                    animatingUnlock: null,
                };
                setIsLoading(false);
                currentActionParamsRef.current = null;
            } else if ((feature === "verify_step") && data.steps) {
                const steps = data.steps;
                const allStepsCorrect = Array.isArray(steps) ? steps.every(s => s.are_both_steps_correct !== false) : (steps.are_both_steps_correct !== false);
                newTutorResponseUpdate.structuredResponse = createVerifyStepResponseStructure(steps, allStepsCorrect, data);
                newTutorResponseUpdate.explanation = null;

            } else if (feature === "explanation") {
            } else if (data.data && typeof data.data === 'string') {
                newTutorResponseUpdate.streamingText = data.data;
                newTutorResponseUpdate.isStreamingEffect = true;
            } else {
                setIsLoading(false);
            }

            setTutorResponse(prev => ({
                ...prev,
                streamingText: newTutorResponseUpdate.streamingText !== undefined ? newTutorResponseUpdate.streamingText : prev.streamingText,
                isStreamingEffect: newTutorResponseUpdate.isStreamingEffect !== undefined ? newTutorResponseUpdate.isStreamingEffect : prev.isStreamingEffect,
                structuredResponse: newTutorResponseUpdate.structuredResponse,
                explanation: newTutorResponseUpdate.explanation,
                activeItemDetail: newTutorResponseUpdate.activeItemDetail,
            }));

            if (newContentStateUpdate.type || newContentStateUpdate.items.length > 0 || (contentState.items.length > 0 && newContentStateUpdate.unlockedIndices.length !== contentState.unlockedIndices.length)) {
                setContentState(prev => ({ ...prev, ...newContentStateUpdate }));
            }
        }

        if (feature !== "explanation" && feature !== "next_3hint" && feature !== "next_3step" && currentActionParamsRef.current?.feature === feature) {
            currentActionParamsRef.current = null;
        }

        if (contentState.animatingUnlock !== null && newContentStateUpdate?.animatingUnlock === null) {
            setContentState(prev => ({ ...prev, animatingUnlock: null }));
        }

    }, [
        resetProcessingState,
        contentState,
    ]);

    const memoizedHandleWebSocketConnection = useCallback((isConnected) => {
        if (isConnected) {
            toast.success("Connected to AI Tutor");
        } else {
            setDbSessionId(null);
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
        if (actionType === 'verify') {
            if (!isWhiteboardDirty) {
                toast.error("Please draw your final solution on the whiteboard first.");
                return;
            }
            if (isLoading || isCheckingSolutionApi) {
                toast.info("A submission is already in progress.");
                return;
            }

            setIsLoading(true);
            setCurrentButtonType(actionType);
            currentActionParamsRef.current = { feature: actionType, ...additionalParams };

            let solutionS3Key = "no_input";
            if (isWhiteboardDirty && stylusDrawRef.current) {
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

            const apiPayload = {
                question_id: currentQuestion.question_id,
                question: Array.isArray(currentQuestion.question) ? currentQuestion.question.join(' ') : String(currentQuestion.question),
                question_url: currentQuestion.question_url || "no_input",
                solution_url: solutionS3Key,
                total_time: timer,
                difficulty_level: currentQuestion?.question_difficulty_level,
                input_type: currentQuestion.question_url?.includes("no_input") ? "text" : "image",
            };

            try {
                const result = await checkMySolution(apiPayload).unwrap();
                dispatch(setSolutionFeedback({
                    help_count: requestCount,
                    question: currentQuestion?.question,
                    ...result?.data
                }));
                toast.success("Solution submitted successfully! Redirecting to dashboard...");
                router.push('/ai-math-tutor/select-questions/ai-tutor-solution/ai-tutor-feedback');
            } catch (error) {
                console.error("Failed to submit final solution:", error);
                const errorMsg = error?.data?.detail || error?.data?.message || error?.message || "Failed to submit solution.";
                toast.error(errorMsg);
                resetProcessingState();
            } finally {
                setIsLoading(false);
                setCurrentButtonType(null);
                currentActionParamsRef.current = null;
            }
            return;
        }

        if (!wsConnected) {
            toast.error("Not connected. Please wait or try reconnecting.");
            wsConnect();
            return;
        }

        if (actionType.includes('hint') || actionType.includes('step')) {
            setRequestCount(prev => prev + 1);
        }

        if (isLoading && currentButtonType === 'explanation' && actionType !== 'explanation') {
            toast.info("Please wait for the current explanation to finish.");
            return;
        }

        const needsDrawingForAction = ["verify_step"].includes(actionType);
        if (needsDrawingForAction && !isWhiteboardDirty) {
            const message = (actionType.includes("step"))
                ? "Please draw your steps on the whiteboard before requesting next steps."
                : "Please draw your solution on the whiteboard first.";
            toast.error(message);
            return;
        }

        if (actionType !== 'explanation') {
            if (!(currentButtonType === 'explanation' && isLoading)) {
                setIsLoading(true);
            }
        } else {
            setIsLoading(true);
        }
        setCurrentButtonType(actionType);
        currentActionParamsRef.current = { feature: actionType, ...additionalParams };

        const isMainButtonAction = ['next_hint', 'next_step', 'verify_step'].includes(actionType);

        if (isMainButtonAction && actionType !== 'next_3hint' && actionType !== 'next_3step') {
            if (actionType !== 'explanation' && !(isLoading && currentButtonType === 'explanation')) {
                stopAudio();
            }
            setTutorResponse(prev => ({
                streamingText: "",
                isStreamingEffect: false,
                structuredResponse: null,
                explanation: null,
                activeItemDetail: null,
            }));
            setContentState({
                type: null,
                items: [],
                unlockedIndices: [],
                currentIndex: 0,
                animatingUnlock: null,
            });
        } else if (actionType !== "explanation" && !(isLoading && currentButtonType === 'explanation')) {
            stopAudio();
        }

        let solutionS3Key = "no_input";
        const needsDrawingUploadForWS = ["verify_step", "next_3step", "next_step", "hint", "next_hint"].includes(actionType);

        if (isWhiteboardDirty && needsDrawingUploadForWS && stylusDrawRef.current) {
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
                        if (actionType === 'explanation') setIsLoading(false);
                        return;
                    }
                } else {
                    toast.error("Could not process drawing for submission."); resetProcessingState(); if (actionType === 'explanation') setIsLoading(false); return;
                }
            } else if (isWhiteboardDirty) {
                toast.error("Failed to capture drawing. Please try again."); resetProcessingState(); if (actionType === 'explanation') setIsLoading(false); return;
            }
        }

        const wsPayload = {
            feature: actionType,
            question_id: currentQuestion.question_id,
            question: Array.isArray(currentQuestion.question) ? currentQuestion.question.join(' ') : String(currentQuestion.question),
            question_url: currentQuestion.question_url || "no_input",
            solution: solutionS3Key,
            session_id: dbSessionId,
            question_difficulty_level: currentQuestion?.question_difficulty_level || "easy"
        };

        if (actionType === "explanation" && additionalParams.explanation_text) {
            wsPayload.explanation_text = additionalParams.explanation_text;
        } else if (actionType === "next_3hint") {
            wsPayload.current_hint_index = additionalParams.current_hint_index + 1;
            wsPayload.hint = additionalParams.hint_text;
            setContentState(prev => ({
                ...prev,
                unlockedIndices: Array.from(new Set([...prev.unlockedIndices, additionalParams.current_hint_index])),
                currentIndex: additionalParams.current_hint_index
            }));
        } else if (actionType === "next_3step") {
            wsPayload.current_step_index = additionalParams.current_step_index + 1;
            wsPayload.step = additionalParams.step_text;
            setContentState(prev => ({
                ...prev,
                unlockedIndices: Array.from(new Set([...prev.unlockedIndices, additionalParams.current_step_index])),
                currentIndex: additionalParams.current_step_index
            }));
        } else if (actionType === "next_hint" && additionalParams.hint_text) {
            wsPayload.hint = additionalParams.hint_text;
        } else if (actionType === "next_step" && additionalParams.step_text) {
            wsPayload.step = additionalParams.step_text;
        }


        try {
            await wsSendMessage(wsPayload);
        } catch (error) {
            toast.error(`Failed to send action: ${error.message}`);
            resetProcessingState();
            if (actionType === 'explanation') setIsLoading(false);
        }
    }, [
        wsConnected, isWhiteboardDirty, stopAudio, wsSendMessage,
        currentQuestion, resetProcessingState, wsConnect, dbSessionId,
        isLoading, currentButtonType, timer, requestCount,
        dispatch, router, checkMySolution, isCheckingSolutionApi
    ]);

    const memoizedHandleContentItemAction = useCallback((_actionTypeIgnored, itemIndex, itemData) => {
        const newActionType = contentState.type === 'hints' ? 'next_3hint' : 'next_3step';
        const indexParam = contentState.type === 'hints' ? 'current_hint_index' : 'current_step_index';
        const textParamKey = contentState.type === 'hints' ? 'hint_text' : 'step_text';

        setContentState(prev => ({ ...prev, animatingUnlock: itemIndex, currentIndex: itemIndex }));

        memoizedHandleTutorAction(newActionType, {
            [indexParam]: itemIndex + 1,
            [textParamKey]: itemData.text,
        });
    }, [memoizedHandleTutorAction, contentState.type]);

    const memoizedHandleExplanationAudio = useCallback(async (explanationText, sourceKey) => {
        if (!explanationText) {
            toast.error("No explanation available to play.");
            return;
        }
        if (isLoading && currentButtonType === 'explanation' && currentActionParamsRef.current?.sourceKey !== sourceKey) {
            stopAudio();
        }
        memoizedHandleTutorAction("explanation", { explanation_text: explanationText, sourceKey: sourceKey });
    }, [memoizedHandleTutorAction, stopAudio, isLoading, currentButtonType]);

    const toggleRightPanel = () => setIsRightPanelCollapsed(!isRightPanelCollapsed);

    const containerMotionVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemMotionVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    return (
        <motion.div
            className="flex overflow-hidden w-full h-screen"
            variants={containerMotionVariants}
            initial="hidden"
            animate="visible"
            aria-label="Math Tutor Page"
        >
            <motion.main
                className={`transition-all duration-300 ease-in-out ${isRightPanelCollapsed ? 'w-full' : 'w-[67%]'} p-6 flex flex-col h-full`}
                layout
                transition={{ duration: 0.3, ease: "easeInOut" }}
                aria-labelledby="question-heading"
            >
                <motion.div className="mb-4" variants={itemMotionVariants}>
                    <motion.h2 id="question-heading" className="text-xl font-semibold text-gray-800">
                        <Latex>{currentQuestion.displayQuestion || "Question: Solve for x."}</Latex>
                    </motion.h2>
                </motion.div>
                <motion.div className="mb-4 text-gray-600" variants={itemMotionVariants}>
                    <p>✍️ <span className="text-md">Start solving here. I'm right here</span> ➡️ <span className="text-md">with hints and reviews!</span></p>
                </motion.div>
                <motion.div className="flex-grow rounded-lg shadow-lg overflow-hidden bg-white border border-gray-200" variants={itemMotionVariants} style={{ minHeight: '50vh' }} role="application" aria-label="Whiteboard Area">
                    <StylusDrawComponent
                        ref={stylusDrawRef}
                        onContentChange={handleDrawingChange}
                        height="100%"
                        placeholder="Start solving on the whiteboard..."
                    />
                </motion.div>
            </motion.main>

            <motion.aside
                className={`transition-all duration-300 ease-in-out bg-white shadow-2xl relative h-full border-l border-gray-200 ${isRightPanelCollapsed ? 'w-12' : 'w-[33%]'}`}
                layout
                transition={{ duration: 0.3, ease: "easeInOut" }}
                aria-label="Tutor Interaction Panel"
            >
                <motion.button
                    onClick={toggleRightPanel}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-16 bg-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow rounded-l-md border border-r-0 border-gray-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={isRightPanelCollapsed ? "Expand tutor panel" : "Collapse tutor panel"}
                    aria-expanded={!isRightPanelCollapsed}
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
                            role="region"
                            aria-live="polite"
                        >
                            <TutorInteractionPanel
                                isLoading={isLoading || isCheckingSolutionApi}
                                currentButtonType={currentButtonType}
                                audioStatus={pageAudioStatus}
                                onAudioControl={onAudioControlObj}
                                onTutorAction={memoizedHandleTutorAction}
                                tutorResponse={tutorResponse}
                                contentState={contentState}
                                onContentItemAction={memoizedHandleContentItemAction}
                                onExplanationAudio={memoizedHandleExplanationAudio}
                                isWhiteboardDirty={isWhiteboardDirty}
                                formatTime={formatTime}
                                timer={timer}
                                isGuestUser={isGuestUser}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.aside>
        </motion.div>
    )
};

export default MathTutorPage;