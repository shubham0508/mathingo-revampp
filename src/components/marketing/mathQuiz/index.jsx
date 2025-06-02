"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    BookOpen,
    BarChart3,
    Brain,
    Award,
    RefreshCw,
    ThumbsUp,
    Send,
    Lightbulb,
    Target,
    Atom,
    BarChartHorizontalBig,
} from "lucide-react";

const gradeOptions = [
    { value: "elementary", label: "Elementary School", icon: <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" /> },
    { value: "middle_high", label: "Middle/High School", icon: <Target className="mr-2 h-5 w-5 text-sky-500" /> },
    { value: "undergraduate", label: "Undergraduate", icon: <Atom className="mr-2 h-5 w-5 text-purple-500" /> },
    { value: "exam_prep", label: "Exam Prep (SAT, GRE etc.)", icon: <BarChartHorizontalBig className="mr-2 h-5 w-5 text-green-500" /> },
];

const questionDatabase = {
    elementary: [
        { id: "el1", type: "singleChoice", question: "What is 25 + 17?", options: ["32", "40", "42", "52"], correctAnswer: "42" },
        { id: "el2", type: "singleChoice", question: "If a storybook has 50 pages and you read 23 pages, how many pages are left to read?", options: ["27", "37", "33", "73"], correctAnswer: "27" },
        { id: "el3", type: "singleChoice", question: "How many sides does a rectangle have?", options: ["3", "4", "5", "6"], correctAnswer: "4" },
        { id: "el4", type: "singleChoice", question: "What is 8 multiplied by 6?", options: ["14", "42", "48", "54"], correctAnswer: "48" },
        { id: "el5", type: "singleChoice", question: "Which number is greater: 98 or 89?", options: ["98", "89", "They are equal"], correctAnswer: "98" },
    ],
    middle_high: [
        { id: "mh1", type: "singleChoice", question: "Solve for x: 3x - 7 = 14", options: ["5", "7", "9", "21"], correctAnswer: "7" },
        { id: "mh2", type: "singleChoice", question: "What is the area of a triangle with base 10cm and height 6cm?", options: ["16 cm²", "30 cm²", "60 cm²", "120 cm²"], correctAnswer: "30 cm²" },
        { id: "mh3", type: "singleChoice", question: "If a price of $80 is discounted by 25%, what is the sale price?", options: ["$20", "$55", "$60", "$100"], correctAnswer: "$60" },
        { id: "mh4", type: "singleChoice", question: "What is the value of (-2)³?", options: ["-8", "-6", "6", "8"], correctAnswer: "-8" },
        { id: "mh5", type: "singleChoice", question: "The sum of angles in a quadrilateral is:", options: ["180°", "270°", "360°", "540°"], correctAnswer: "360°" },
    ],
    undergraduate: [
        { id: "ug1", type: "singleChoice", question: "What is the derivative of f(x) = x³ - 2x + 5?", options: ["3x² - 2", "x² - 2", "3x² + 5", "3x³ - 2x"], correctAnswer: "3x² - 2" },
        { id: "ug2", type: "singleChoice", question: "If matrix A is 2x3 and matrix B is 3x4, what is the dimension of AB?", options: ["2x3", "3x4", "2x4", "Not possible"], correctAnswer: "2x4" },
        { id: "ug3", type: "singleChoice", question: "What is the limit of (1/x) as x approaches infinity?", options: ["0", "1", "Infinity", "Undefined"], correctAnswer: "0" },
        { id: "ug4", type: "singleChoice", question: "The integral of 1/x dx is:", options: ["x² + C", "ln|x| + C", "-1/x² + C", "1 + C"], correctAnswer: "ln|x| + C" },
        { id: "ug5", type: "singleChoice", question: "In a normal distribution, what percentage of data falls within one standard deviation of the mean (approximately)?", options: ["34%", "50%", "68%", "95%"], correctAnswer: "68%" },
    ],
    exam_prep: [
        { id: "ep1", type: "singleChoice", question: "If 5a + 3b = 25 and a = 2, what is the value of b?", options: ["3", "5", "7", "15"], correctAnswer: "5" },
        { id: "ep2", type: "singleChoice", question: "A car travels 180 miles in 3 hours. What is its average speed in miles per hour?", options: ["45 mph", "50 mph", "60 mph", "75 mph"], correctAnswer: "60 mph" },
        { id: "ep3", type: "singleChoice", question: "If the ratio of apples to oranges is 3:5 and there are 24 apples, how many oranges are there?", options: ["15", "30", "40", "72"], correctAnswer: "40" },
        { id: "ep4", type: "singleChoice", question: "What is 15% of 300?", options: ["15", "30", "45", "50"], correctAnswer: "45" },
        { id: "ep5", type: "singleChoice", question: "If a square has a perimeter of 36 units, what is its area in square units?", options: ["9", "36", "81", "144"], correctAnswer: "81" },
    ],
};

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function MathQuizComponent() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    const [currentGrade, setCurrentGrade] = useState("");
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [score, setScore] = useState(0);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const startQuiz = useCallback(() => {
        if (!currentGrade) return;
        const gradeQuestions = questionDatabase[currentGrade] || [];
        const selectedQs = shuffleArray(gradeQuestions).slice(0, 5);

        setQuestions(selectedQs);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
        setQuizStarted(true);
        setQuizFinished(false);
    }, [currentGrade]);

    const handleAnswerSubmission = useCallback(() => {
        if (isAnswerCorrect !== null || selectedAnswer === null) return;

        const question = questions[currentQuestionIndex];
        let correct = false;

        if (question.type === "singleChoice") {
            correct = selectedAnswer === question.correctAnswer;
        }

        setUserAnswers((prev) => ({ ...prev, [question.id]: { answer: selectedAnswer, correct } }));
        setIsAnswerCorrect(correct);

        if (correct) {
            setScore((prev) => prev + 1);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3500);
        }

        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
                setSelectedAnswer(null);
                setIsAnswerCorrect(null);
            } else {
                setQuizFinished(true);
            }
        }, 2500);
    }, [isAnswerCorrect, selectedAnswer, questions, currentQuestionIndex]);

    const resetQuiz = () => {
        setCurrentGrade("");
        setQuizStarted(false);
        setQuizFinished(false);
    };

    const currentQuizGradeLabel = useMemo(() => {
        return gradeOptions.find(g => g.value === currentGrade)?.label || "Selected";
    }, [currentGrade]);

    if (!hasMounted || windowSize.width === undefined) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
                <Brain className="h-16 w-16 animate-pulse text-primary" />
            </div>
        );
    }

    const currentQ = questions[currentQuestionIndex];
    const progressPercent = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

    const containerVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
        exit: { opacity: 0, y: -30, scale: 0.98, transition: { duration: 0.4, ease: "easeIn" } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.1 } }
    };

    const questionTransition = {
        type: "spring",
        stiffness: 260,
        damping: 25,
    };

    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 selection:bg-primary/20 selection:text-primary">
                {showConfetti && windowSize.width && windowSize.height && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={350} gravity={0.12} tweenDuration={15000} initialVelocityY={20} />}

                <AnimatePresence mode="wait">
                    {!quizStarted && (
                        <motion.div
                            key="gradeSelection"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full max-w-xl"
                        >
                            <Card className="shadow-2xl dark:bg-slate-800 dark:border-primary/30 transform hover:shadow-primary/20 transition-all duration-300">
                                <CardHeader className="text-center bg-gradient-to-r from-primary to-indigo-600 dark:from-primary/90 dark:to-indigo-700 text-white rounded-t-xl py-8">
                                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 12 }}>
                                        <BookOpen className="mx-auto h-16 w-16 mb-3 text-white animate-pulse" />
                                        <CardTitle className="text-4xl font-extrabold tracking-tight">Math Mastery Quiz</CardTitle>
                                    </motion.div>
                                    <CardDescription className="text-indigo-100 text-2xl mt-2">
                                        Challenge yourself and elevate your math skills!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-8 pb-8">
                                    <motion.div variants={itemVariants} className="space-y-6">
                                        <Label htmlFor="grade-select" className="text-xl font-semibold text-foreground dark:text-slate-200 block mb-3 text-center">
                                            Select Your Academic Level:
                                        </Label>
                                        <Select onValueChange={setCurrentGrade} value={currentGrade}>
                                            <SelectTrigger id="grade-select" className="w-full max-w-md mx-auto h-14 text-lg border-2 border-border focus:ring-2 focus:ring-primary focus:border-primary dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 shadow-sm">
                                                <SelectValue placeholder="Tap to choose your level..." />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-72 dark:bg-slate-800 dark:border-slate-700 shadow-lg">
                                                {gradeOptions.map((grade) => (
                                                    <SelectItem key={grade.value} value={grade.value} className="text-lg py-3 hover:bg-primary/10 dark:hover:bg-primary/20 dark:text-slate-200 focus:bg-primary/10 dark:focus:bg-primary/20">
                                                        <div className="flex items-center">{grade.icon} {grade.label}</div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </motion.div>
                                </CardContent>
                                <CardFooter className="flex justify-center py-6">
                                    <motion.div whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300 } }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            onClick={startQuiz}
                                            disabled={!currentGrade}
                                            size="xl"
                                            className="bg-primary hover:bg-blue-700 text-white font-bold text-xl px-3 py-3 rounded-md shadow-lg transform transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100"
                                            aria-label="Start Math Quiz Now"
                                        >
                                            Start Quiz Now
                                        </Button>
                                    </motion.div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    )}

                    {quizStarted && !quizFinished && currentQ && (
                        <motion.div
                            key={`question-${currentQuestionIndex}`}
                            initial={{ opacity: 0, x: windowSize.width > 768 ? 120 : 0, y: windowSize.width <= 768 ? 60 : 0 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            exit={{ opacity: 0, x: windowSize.width > 768 ? -120 : 0, y: windowSize.width <= 768 ? -60 : 0 }}
                            transition={questionTransition}
                            className="w-full max-w-3xl"
                        >
                            <Card className="shadow-2xl dark:bg-slate-800 dark:border-primary/30 overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-primary to-indigo-600 dark:from-primary/90 dark:to-indigo-700 text-white rounded-t-xl py-5">
                                    <div className="flex justify-between items-center mb-2">
                                        <CardTitle className="text-xl sm:text-2xl font-bold">
                                            Question {currentQuestionIndex + 1}
                                            <span className="text-base sm:text-lg font-normal opacity-80">/{questions.length}</span>
                                        </CardTitle>
                                        <motion.div
                                            key={score}
                                            initial={{ scale: 0.8, opacity: 0.5 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                            className="text-lg font-semibold bg-white/20 px-3 py-1 rounded-full"
                                        >
                                            Score: {score}
                                        </motion.div>
                                    </div>
                                    <Progress
                                        value={progressPercent}
                                        className="h-3 rounded-full bg-gray-200"
                                        indicatorClassName="bg-lime-400 dark:bg-lime-500 rounded-full transition-all duration-500 ease-out"
                                    />
                                </CardHeader>

                                <CardContent className="pt-8 pb-6">
                                    <motion.p variants={itemVariants} className="text-xl sm:text-2xl font-semibold text-foreground dark:text-slate-100 mb-6 text-center flex items-center justify-center px-2">
                                        {currentQ.question}
                                    </motion.p>

                                    {currentQ.type === "singleChoice" && (
                                        <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer} className="space-y-2">
                                            {currentQ.options.map((option, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    variants={itemVariants}
                                                    whileHover={{ scale: 1.02, boxShadow: "0px 6px 20px rgba(var(--primary-rgb, 59, 130, 246),0.15)" }}
                                                    className={`flex items-center p-2 rounded-lg border-2 cursor-pointer transition-all duration-200 transform 
                            ${isAnswerCorrect !== null && option === currentQ.correctAnswer ? "bg-green-100 dark:bg-green-700/30 border-green-500 dark:border-green-500 ring-2 ring-green-500 dark:ring-green-400 scale-105" : ""}
                            ${isAnswerCorrect === false && selectedAnswer === option ? "bg-red-100 dark:bg-red-700/30 border-red-500 dark:border-red-500 ring-2 ring-red-500 dark:ring-red-400 scale-105" : ""}
                            ${selectedAnswer === option && isAnswerCorrect === null ? "bg-primary/10 dark:bg-primary/20 border-primary dark:border-primary ring-2 ring-primary dark:ring-primary" : "border-border dark:border-slate-700 hover:border-primary/60 dark:hover:border-primary/70"}`}
                                                >
                                                    <RadioGroupItem value={option} id={`option-${idx}`} className="h-5 w-5 text-primary focus:ring-primary border-muted-foreground" disabled={isAnswerCorrect !== null} />
                                                    <Label htmlFor={`option-${idx}`} className="ml-3 text-base sm:text-lg text-foreground dark:text-slate-200 cursor-pointer">{option}</Label>
                                                </motion.div>
                                            ))}
                                        </RadioGroup>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-between items-center py-5 border-t border-border dark:border-slate-700 px-6">
                                    <p className="text-sm text-muted-foreground hidden sm:block">
                                        Choose the best answer.
                                    </p>
                                    <motion.div whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300 } }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            onClick={handleAnswerSubmission}
                                            disabled={selectedAnswer === null || isAnswerCorrect !== null}
                                            size="lg"
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-3 rounded-full shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100"
                                            aria-label={isAnswerCorrect !== null ? (currentQuestionIndex < questions.length - 1 ? "Next Question" : "Show Quiz Results") : "Submit Your Answer"}
                                        >
                                            {isAnswerCorrect !== null ? (currentQuestionIndex < questions.length - 1 ? "Next Question" : "Show Results") : "Submit Answer"} <Send className="ml-2 h-5 w-5" />
                                        </Button>
                                    </motion.div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    )}

                    {quizFinished && (
                        <motion.div
                            key="results"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full max-w-2xl"
                        >
                            <Card className="shadow-2xl border-primary/20 dark:bg-slate-800 dark:border-primary/30">
                                <CardHeader className="text-center bg-gradient-to-r from-primary to-indigo-600 dark:from-primary/90 dark:to-indigo-700 text-white rounded-t-xl py-8">
                                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 150 }}>
                                        <Award className="mx-auto h-16 w-16 mb-3 text-yellow-300 animate-bounce" />
                                        <CardTitle className="text-4xl font-extrabold tracking-tight">Quiz Results</CardTitle>
                                    </motion.div>
                                    <CardDescription className="text-indigo-100 text-lg mt-1">
                                        You've completed the {currentQuizGradeLabel} Math Quiz!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-8 pb-6 text-center">
                                    <motion.div variants={itemVariants} className="space-y-6">
                                        <p className="text-5xl sm:text-6xl font-bold text-primary dark:text-indigo-400 mb-2">{score} / {questions.length}</p>
                                        <div className="text-xl sm:text-2xl font-semibold mb-4">
                                            {score === questions.length ? <span className="text-green-500 dark:text-green-400">🎉 Perfect Score! Outstanding! 🎉</span>
                                                : score >= questions.length * 0.7 ? <span className="text-blue-500 dark:text-blue-400">👍 Great Job! You're a Math Whiz! 👍</span>
                                                    : score >= questions.length * 0.5 ? <span className="text-yellow-500 dark:text-yellow-400">😊 Good Effort! Keep Practicing! 😊</span>
                                                        : <span className="text-red-500 dark:text-red-400">💪 Don't Give Up! Review and Try Again! 💪</span>}
                                        </div>
                                        <Progress value={(score / questions.length) * 100} className="h-5 rounded-full bg-white dark:bg-slate-700" indicatorClassName={
                                            `rounded-full transition-all duration-700 ease-in-out ${score === questions.length ? "bg-green-500"
                                                : score >= questions.length * 0.7 ? "bg-blue-500"
                                                    : score >= questions.length * 0.5 ? "bg-yellow-500"
                                                        : "bg-red-500"}`
                                        } />

                                        <div className="pt-6 space-y-4">
                                            <p className="text-lg text-muted-foreground dark:text-slate-400">What's next on your math adventure?</p>
                                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                                <motion.div whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300 } }} whileTap={{ scale: 0.95 }}>
                                                    <Button onClick={resetQuiz} size="lg" variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-400/10 text-lg shadow-sm">
                                                        <BarChart3 className="mr-2 h-5 w-5" /> Try Another Level
                                                    </Button>
                                                </motion.div>
                                                <motion.div whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300 } }} whileTap={{ scale: 0.95 }}>
                                                    <Button onClick={startQuiz} size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-lg shadow-sm">
                                                        <RefreshCw className="mr-2 h-5 w-5" /> Retry This Quiz
                                                    </Button>
                                                </motion.div>
                                            </div>
                                            <motion.div whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 300 } }} className="pt-4">
                                                <Button size="xl" asChild className="w-full max-w-md mx-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl shadow-lg">
                                                    <Link href="https://www.mathzai.com/ai-tutor">
                                                        <ThumbsUp className="mr-3 h-6 w-6" /> Explore Our AI Math Tutor
                                                    </Link>
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}