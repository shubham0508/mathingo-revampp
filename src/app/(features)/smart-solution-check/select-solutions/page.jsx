"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Fullscreen,
    LoaderCircle,
    Eye,
    Edit,
    MoreHorizontal,
    Check,
    X,
    GripVertical,
    BookOpen,
    Calculator,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Mock data for demonstration
const mockFiles = [
    {
        id: 1,
        fileName: 'Problem Set 1.jpg',
        fileType: 'image',
        fileUrl: '/api/placeholder/400/500',
        signedUrl: 'https://via.placeholder.com/280x200/f0f0f0/666?text=Math+Problem+1'
    },
    {
        id: 2,
        fileName: 'Problem Set 2.jpg',
        fileType: 'image',
        fileUrl: '/api/placeholder/400/500',
        signedUrl: 'https://via.placeholder.com/280x200/f5f5f5/666?text=Math+Problem+2'
    },
    {
        id: 3,
        fileName: 'Problem Set 3.jpg',
        fileType: 'image',
        fileUrl: '/api/placeholder/400/500',
        signedUrl: 'https://via.placeholder.com/280x200/fafafa/666?text=Math+Problem+3'
    },
    {
        id: 4,
        fileName: 'Problem Set 4.jpg',
        fileType: 'image',
        fileUrl: '/api/placeholder/400/500',
        signedUrl: 'https://via.placeholder.com/280x200/f8f8f8/666?text=Math+Problem+4'
    },
    {
        id: 5,
        fileName: 'Problem Set 5.jpg',
        fileType: 'image',
        fileUrl: '/api/placeholder/400/500',
        signedUrl: 'https://via.placeholder.com/280x200/fcfcfc/666?text=Math+Problem+5'
    }
];

const mockQuestions = [
    {
        id: 1,
        question: 'Evaluate the integral: ∫ x²/√(x²+1) dx',
        solution: 'put u = 1+x²\nso, du/dx = 2x ......',
        isSelected: true,
        isExpanded: false,
        hasWrongMatch: false
    },
    {
        id: 2,
        question: 'What is the area of the triangle whose base is 10u and height is 6u',
        solution: 'Area of triangle = 1/2* base*height\n= 1/2* 6*10\n= 30 sq. unit',
        isSelected: false,
        isExpanded: false,
        hasWrongMatch: true
    },
    {
        id: 3,
        question: 'Find the derivative of 4x³-3x²+2x-5',
        solution: 'd/dx (4x³-3x²+2x-5)\n= 12x²/2 -6x +2 ......\n= 6x² -6x +2',
        isSelected: false,
        isExpanded: false,
        hasWrongMatch: false
    }
];

// Toast Component
const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
                'bg-blue-500 text-white'
            }`}
    >
        {type === 'success' && <CheckCircle2 className="w-5 h-5" />}
        {type === 'error' && <AlertCircle className="w-5 h-5" />}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
            <X className="w-4 h-4" />
        </button>
    </motion.div>
);

// Enhanced Image Gallery Component
const ImageGallery = ({ files, onImageClick }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [hoveredImage, setHoveredImage] = useState(null);
    const imagesPerPage = 3;
    const totalPages = Math.ceil(files.length / imagesPerPage);

    const getCurrentImages = () => {
        const start = currentPage * imagesPerPage;
        return files.slice(start, start + imagesPerPage);
    };

    const handleNext = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const handlePrevious = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    return (
        <div className="mb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <div className="flex items-center justify-center gap-4">
                    {currentPage > 0 && (
                        <button
                            onClick={handlePrevious}
                            className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-200"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                    )}

                    <div className="flex gap-4 overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPage}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="flex gap-4"
                            >
                                {getCurrentImages().map((file, index) => (
                                    <motion.div
                                        key={file.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative group cursor-pointer"
                                        onMouseEnter={() => setHoveredImage(file.id)}
                                        onMouseLeave={() => setHoveredImage(null)}
                                        onClick={() => onImageClick(file)}
                                    >
                                        <div className="w-72 h-48 border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                            <img
                                                src={file.signedUrl}
                                                alt={file.fileName}
                                                className="w-full h-full object-cover"
                                            />

                                            {hoveredImage === file.id && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                                                >
                                                    <div className="text-white text-center">
                                                        <Eye className="w-8 h-8 mx-auto mb-2" />
                                                        <p className="text-sm font-medium">Click to expand</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {currentPage < totalPages - 1 && (
                        <button
                            onClick={handleNext}
                            className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-200"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center mt-4 gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i)}
                                className="focus:outline-none"
                            >
                                <div
                                    className={`rounded-full transition-all w-3 h-3 ${i === currentPage
                                        ? 'bg-blue-600'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// Draggable Question Card Component
const DraggableQuestionCard = ({ question, index, onToggleSelect, onToggleExpand, onEdit, moveCard }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'card',
        item: { id: question.id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'card',
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveCard(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <motion.div
            ref={(node) => drag(drop(node))}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: isDragging ? 0.5 : 1,
                y: 0,
                scale: isDragging ? 1.05 : 1
            }}
            whileHover={{ scale: isDragging ? 1.05 : 1.02 }}
            className={`border rounded-lg p-4 mb-4 transition-all duration-200 cursor-move ${question.isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                } ${isDragging
                    ? 'shadow-2xl z-50'
                    : 'shadow-sm hover:shadow-md'
                } ${question.hasWrongMatch
                    ? 'border-orange-400 bg-orange-50'
                    : ''
                }`}
        >
            <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 mt-1">
                    <input
                        type="checkbox"
                        checked={question.isSelected}
                        onChange={() => onToggleSelect(question.id)}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                </div>

                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-2">
                                <span className="text-sm text-gray-600">Question:</span> {question.question}
                            </p>

                            <div className="mb-3">
                                <p className="text-sm text-gray-600 mb-1">Solution:</p>
                                <div className="bg-gray-50 p-3 rounded text-sm font-mono whitespace-pre-line">
                                    {question.isExpanded ? question.solution : `${question.solution.substring(0, 50)}...`}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                            {question.hasWrongMatch && (
                                <div className="flex items-center gap-1 text-orange-600 text-xs mr-2">
                                    <span className="bg-orange-100 px-2 py-1 rounded text-xs">Wrong Match?</span>
                                </div>
                            )}

                            {question.hasWrongMatch && (
                                <button className="px-3 py-1 text-xs bg-orange-100 text-orange-700 hover:bg-orange-200 rounded transition-colors">
                                    Reassign
                                </button>
                            )}

                            <button
                                onClick={() => onToggleExpand(question.id)}
                                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                            >
                                {question.isExpanded ? 'Collapse' : 'Expand'}
                            </button>

                            <button
                                onClick={() => onEdit(question.id)}
                                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                            >
                                Edit
                            </button>
                        </div>
                    </div>

                    {question.hasWrongMatch && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-2 p-2 bg-orange-100 rounded text-xs text-orange-800"
                        >
                            Click if AI matched your solution to the wrong question.
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// Drag and Drop Matching Component
const DragDropMatching = ({ questions, solutions, onConfirmMapping, onBack }) => {
    const [draggedItem, setDraggedItem] = useState(null);
    const [matches, setMatches] = useState({});
    const [draggedQuestions, setDraggedQuestions] = useState(questions);

    const moveQuestion = (fromIndex, toIndex) => {
        const newQuestions = [...draggedQuestions];
        const [movedQuestion] = newQuestions.splice(fromIndex, 1);
        newQuestions.splice(toIndex, 0, movedQuestion);
        setDraggedQuestions(newQuestions);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto p-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">
                            Drag the Question card to match with the correct answer
                        </h2>
                        <button
                            onClick={onConfirmMapping}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            Confirm mapping →
                        </button>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <h3 className="font-semibold text-gray-800 mb-4">Solutions</h3>
                            {solutions.map((solution, index) => (
                                <motion.div
                                    key={solution.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <p className="font-medium text-gray-900 mb-2">Solution:</p>
                                    <div className="bg-gray-50 p-3 rounded text-sm font-mono whitespace-pre-line">
                                        {solution.content}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <h3 className="font-semibold text-gray-800 mb-4">Questions</h3>
                            {draggedQuestions.map((question, index) => (
                                <DraggableQuestionCard
                                    key={question.id}
                                    question={{ ...question, content: question.question }}
                                    index={index}
                                    onToggleSelect={() => { }}
                                    onToggleExpand={() => { }}
                                    onEdit={() => { }}
                                    moveCard={moveQuestion}
                                />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

// Main Component
export default function MathzAISolutionPage() {
    const [currentStep, setCurrentStep] = useState('select'); // 'select', 'review', 'match'
    const [questions, setQuestions] = useState(mockQuestions);
    const [selectedCount, setSelectedCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleToggleSelect = (id) => {
        setQuestions(prev => prev.map(q =>
            q.id === id ? { ...q, isSelected: !q.isSelected } : q
        ));
        setSelectedCount(prev => questions.find(q => q.id === id)?.isSelected ? prev - 1 : prev + 1);
    };

    const handleToggleExpand = (id) => {
        setQuestions(prev => prev.map(q =>
            q.id === id ? { ...q, isExpanded: !q.isExpanded } : q
        ));
    };

    const handleEdit = (id) => {
        showToast('Edit functionality would open a modal here', 'info');
    };

    const handleSelectAll = () => {
        const allSelected = questions.every(q => q.isSelected);
        setQuestions(prev => prev.map(q => ({ ...q, isSelected: !allSelected })));
        setSelectedCount(allSelected ? 0 : questions.length);
    };

    const handleReviewSolutions = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCurrentStep('match');
        setIsLoading(false);
        showToast('Solutions loaded for review', 'success');
    };

    const handleImageClick = (file) => {
        setPreviewImage(file);
    };

    const handleConfirmMapping = () => {
        showToast('Mapping confirmed successfully!', 'success');
        setCurrentStep('select');
    };

    const moveCard = (fromIndex, toIndex) => {
        const newQuestions = [...questions];
        const [movedQuestion] = newQuestions.splice(fromIndex, 1);
        newQuestions.splice(toIndex, 0, movedQuestion);
        setQuestions(newQuestions);
    };

    if (currentStep === 'match') {
        return (
            <DragDropMatching
                questions={questions}
                solutions={[
                    { id: 1, content: 'put u = 1+x²\nso, du/dx = 2x\nso, 2xdx = du ......' },
                    { id: 2, content: 'Area of triangle = 1/2* base*height\n= 1/2* 6*10\n= 30 sq. unit' },
                    { id: 3, content: 'd/dx (4x³-3x²+2x-5)\n= 12x²/2 -6x +2\n= 6x² -6x +2' }
                ]}
                onConfirmMapping={handleConfirmMapping}
                onBack={() => setCurrentStep('select')}
            />
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white shadow-sm border-b"
                >
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-blue-600 text-white p-2 rounded-lg"
                                >
                                    <Calculator className="w-6 h-6" />
                                </motion.div>
                                <div>
                                    <h1 className="text-2xl font-bold text-blue-600">Mathz AI</h1>
                                </div>
                            </div>
                            <nav className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <BookOpen className="w-5 h-5" />
                                    <span>Homework Assistant</span>
                                </div>
                            </nav>
                        </div>
                    </div>
                </motion.header>

                <main className="max-w-7xl mx-auto px-4 py-8">
                    {/* Uploaded Files Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-xl font-semibold text-blue-600">Uploaded Files ({mockFiles.length})</h2>
                            <span className="text-yellow-500">👍</span>
                        </div>
                        <ImageGallery files={mockFiles} onImageClick={handleImageClick} />
                    </motion.section>

                    {/* Select Solutions Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h2 className="text-xl font-semibold text-blue-600">Select solutions for Review</h2>
                                    <span className="text-yellow-500">👍</span>
                                </div>
                                <p className="text-gray-600">AI extracted and linked questions to answers—select which solutions to review.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleSelectAll}
                                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                >
                                    Select All
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleReviewSolutions}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
                                    disabled={selectedCount === 0}
                                >
                                    {isLoading ? (
                                        <LoaderCircle className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>Review my Solutions ({selectedCount})</>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {questions.map((question, index) => (
                                <DraggableQuestionCard
                                    key={question.id}
                                    question={question}
                                    index={index}
                                    onToggleSelect={handleToggleSelect}
                                    onToggleExpand={handleToggleExpand}
                                    onEdit={handleEdit}
                                    moveCard={moveCard}
                                />
                            ))}
                        </div>
                    </motion.section>
                </main>

                {/* Image Preview Modal */}
                <AnimatePresence>
                    {previewImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                            onClick={() => setPreviewImage(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="relative max-w-4xl max-h-screen p-4"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setPreviewImage(null)}
                                    className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors z-10"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <img
                                    src={previewImage.signedUrl}
                                    alt={previewImage.fileName}
                                    className="max-w-full max-h-full object-contain rounded-lg"
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Toast Notifications */}
                <AnimatePresence>
                    {toast && (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </DndProvider>
    );
}