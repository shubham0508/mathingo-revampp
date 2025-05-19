"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogOverlay
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

const HelpModal = ({ open, onOpenChange }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        question: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        question: "",
    });

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            setFormData({
                name: "",
                email: "",
                question: "",
            });
            setErrors({
                name: "",
                email: "",
                question: "",
            });
            setIsSubmitting(false);
        }
    }, [open]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
            isValid = false;
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }

        // Question validation
        if (!formData.question.trim()) {
            newErrors.question = "Question is required";
            isValid = false;
        } else if (formData.question.trim().length < 10) {
            newErrors.question = "Your question must be at least 10 characters";
            isValid = false;
        } else if (formData.question.length > 500) {
            newErrors.question = "Your question cannot exceed 500 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // This is where you'd integrate your API call
            // For now, we're simulating a successful submission
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success("We'll get back to you as soon as possible.");

            setFormData({
                name: "",
                email: "",
                question: "",
            });

            onOpenChange(false);
        } catch (error) {
            toast.error("Your message couldn't be sent. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
            <DialogOverlay className="bg-black-opacity-90" />

            <DialogContent
                className="w-[350px] max-h-[90vh] overflow-y-auto border-1"
                onInteractOutside={(e) => e.preventDefault ? null : onOpenChange(false)}
            >
                <DialogHeader className="bg-primary text-white px-6 py-5 -mt-6 -mx-6 rounded-t-lg flex justify-center items-center">
                    <DialogTitle className="text-2xl font-bold mb-2">How can we help you?</DialogTitle>
                    <DialogDescription className="text-[15px] text-white font-medium flex justify-center items-center text-center">
                        Have a question? Check our FAQs or ask us below. We'll get back to you shortly.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4 font-avenir">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 text-[15px] font-bold">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            disabled={isSubmitting}
                            className="focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && (
                            <p className="text-[15px] font-medium text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 text-[15px] font-bold">Email address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="you@example.com"
                            disabled={isSubmitting}
                            className="focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && (
                            <p className="text-[15px] font-medium text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="question" className="text-gray-700 text-[15px] font-bold">What question can we answer about Mathz AI?</Label>
                        <Textarea
                            id="question"
                            name="question"
                            value={formData.question}
                            onChange={handleInputChange}
                            placeholder="Type your question here..."
                            disabled={isSubmitting}
                            className="resize-none h-32 focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.question && (
                            <p className="text-[15px] font-medium text-red-500">{errors.question}</p>
                        )}
                        <div className="text-right text-xs text-gray-500">
                            {formData.question.length}/500
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black hover:bg-gray-800 text-white"
                    >
                        {isSubmitting ? "Sending..." : "Send a message"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const FloatingHelpButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="w-2/3 h-2/3">
            <Button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 h-14 w-14 rounded-full shadow-lg z-40"
                size="icon"
                aria-label="Ask us a question"
            >
                <MessageCircle className="h-6 w-6" />
            </Button>

            <HelpModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </div>
    );
};

export default FloatingHelpButton;