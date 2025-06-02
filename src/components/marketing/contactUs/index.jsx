"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { Mail, MapPin, MessageSquareText, Send, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

const ContactPage = () => {
    const [hasMounted, setHasMounted] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email_address: "",
        subject: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isPreFilled, setIsPreFilled] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        const savedFormData = localStorage.getItem("contactFormData");
        if (savedFormData) {
            try {
                const parsedData = JSON.parse(savedFormData);
                setFormData(parsedData);
                setIsPreFilled(true);
                localStorage.removeItem("contactFormData");
                const formElement = document.getElementById("contact-form-card");
                if (formElement) {
                    formElement.scrollIntoView({ behavior: "smooth", block: "center" });
                    formElement.classList.add("highlight-form-animation");
                    setTimeout(() => formElement.classList.remove("highlight-form-animation"), 2500);
                }
                toast.success("Your information has been pre-filled from our chat assistant!", { duration: 4000 });
            } catch (error) {
                console.error("Error parsing form data from localStorage:", error);
            }
        }
    }, []);

    const validateField = useCallback((name, value) => {
        let errorMsg = "";
        switch (name) {
            case "full_name":
                if (!value.trim()) errorMsg = "Full name is required.";
                else if (value.trim().length < 2) errorMsg = "Full name must be at least 2 characters.";
                break;
            case "email_address":
                if (!value.trim()) errorMsg = "Email address is required.";
                else if (!/\S+@\S+\.\S+/.test(value)) errorMsg = "Email address is invalid.";
                break;
            case "subject":
                if (!value.trim()) errorMsg = "Subject is required.";
                else if (value.trim().length < 5) errorMsg = "Subject must be at least 5 characters.";
                break;
            case "message":
                if (!value.trim()) errorMsg = "Message is required.";
                else if (value.trim().length < 10) errorMsg = "Message must be at least 10 characters.";
                break;
            default:
                break;
        }
        return errorMsg;
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
        }
    }, [errors, validateField]);

    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;
        const errorMsg = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }, [validateField]);

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitStatus(null);
        if (!validateForm()) {
            toast.error("Please correct the errors in the form.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.error || "Failed to submit. Please try again.");
                setSubmitStatus('error');
            } else {
                toast.success("Message sent successfully! We'll get back to you soon.");
                setSubmitStatus('success');
                setFormData({ full_name: "", email_address: "", subject: "", message: "" });
                setErrors({});
                setIsPreFilled(false);
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            toast.error(err.message || "An unexpected error occurred. Please try again.");
            setSubmitStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const renderInput = (name, label, type = 'text', placeholder, customHint = null) => {
        return (
            <motion.div className="w-full space-y-1.5" variants={fadeInUp}>
                <Label htmlFor={name} className="font-semibold text-foreground/90 text-base">
                    {label} {customHint && <span className="text-sm text-muted-foreground font-normal">{customHint}</span>}
                </Label>
                <div className="relative w-full">
                    <Input
                        id={name}
                        name={name}
                        type={(type === 'password' && !showPassword) ? 'password' : type}
                        value={formData[name] || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        className={`w-full h-11 px-3 rounded-md border text-base shadow-sm transition-colors duration-150 ease-in-out
                                    ${errors[name] ? 'border-destructive focus-visible:ring-destructive/50' : 'border-[#000000]/40'}`}
                        aria-invalid={!!errors[name]}
                        aria-describedby={`${name}-error`}
                    />
                    {type === 'password' && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(prev => !prev)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                    )}
                    {errors[name] && type !== 'password' && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                    )}
                </div>
                {errors[name] && <p id={`${name}-error`} className="text-sm text-destructive flex items-center mt-1"><AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />{errors[name]}</p>}
            </motion.div>
        );
    };

    const renderTextarea = (name, label, placeholder, rows = 4, customHint = null) => {
        return (
            <motion.div className="w-full space-y-1.5" variants={fadeInUp}>
                <Label htmlFor={name} className="font-semibold text-foreground/90 text-base">
                    {label} {customHint && <span className="text-sm text-muted-foreground font-normal">{customHint}</span>}
                </Label>
                <Textarea
                    id={name}
                    name={name}
                    value={formData[name] || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    rows={rows}
                    className={`w-full px-3 py-2 rounded-md border text-base shadow-sm transition-colors duration-150 ease-in-out
                                ${errors[name] ? 'border-destructive focus-visible:ring-destructive/50' : 'border-[#000000]/40'}`}
                    aria-invalid={!!errors[name]}
                    aria-describedby={`${name}-error`}
                />
                {errors[name] && <p id={`${name}-error`} className="text-sm text-destructive flex items-center mt-1"><AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />{errors[name]}</p>}
            </motion.div>
        );
    };


    if (!hasMounted) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };


    return (
        <>
            <section id="contact-us" className="py-16 md:py-24 bg-gradient-to-br from-background via-secondary/20 to-background text-foreground">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    <motion.div
                        className="text-center mb-12 md:mb-20"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                            Get in <span className="text-primary">Touch</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Have questions, feedback, or need support? We're here to help. Reach out to us through the form below or using our contact details.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid lg:grid-cols-5 gap-8 md:gap-12 items-start"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            className="lg:col-span-3"
                            variants={fadeInUp}
                        >
                            <Card className="shadow-xl dark:bg-card/85 border-border/30" id="contact-form-card">
                                <CardHeader>
                                    <CardTitle className="text-3xl font-semibold flex items-center">
                                        <MessageSquareText className="mr-3 h-8 w-8 text-primary" />
                                        Send Us a Message
                                    </CardTitle>
                                    {isPreFilled && (
                                        <CardDescription className="!mt-2 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-3 py-1.5 rounded-md inline-block">
                                            Your details are pre-filled from our chat assistant.
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <motion.div className="grid sm:grid-cols-2 gap-6" variants={containerVariants}>
                                            {renderInput("full_name", "Full Name", "text", "e.g., Ada Lovelace")}
                                            {renderInput("email_address", "Email Address", "email", "e.g., ada@example.com")}
                                        </motion.div>
                                        {renderInput("subject", "Subject", "text", "e.g., Inquiry about Mathz AI Pro")}
                                        {renderTextarea("message", "Message", "Your detailed message...", 5)}

                                        <motion.div className="flex justify-end pt-2" variants={fadeInUp}>
                                            <Button 
                                                type="submit" 
                                                size="lg" 
                                                disabled={isLoading || Object.values(formData).some(val => val.trim() === "")}
                                                className="bg-primary hover:bg-blue-700"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        Send Message
                                                        <Send className="ml-2 h-5 w-5" />
                                                    </>
                                                )}
                                            </Button>
                                        </motion.div>

                                        <AnimatePresence>
                                            {submitStatus && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className={`p-3 rounded-md text-sm flex items-center
                                                        ${submitStatus === 'success' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : ''}
                                                        ${submitStatus === 'error' ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' : ''}
                                                    `}
                                                >
                                                    {submitStatus === 'success' && <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />}
                                                    {submitStatus === 'error' && <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />}
                                                    {submitStatus === 'success' ? 'Your message has been sent successfully. We will get back to you shortly.' : 'There was an error sending your message. Please try again.'}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            className="lg:col-span-2 space-y-8"
                            variants={fadeInUp}
                        >
                            <Card className="shadow-lg dark:bg-card/85 border-border/30">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-semibold flex items-center">
                                        Contact Information
                                    </CardTitle>
                                    <CardDescription className="text-[16px]">
                                        Alternatively, you can reach us directly:
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <motion.div className="flex items-start" variants={fadeInUp}>
                                        <Mail className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg">Email Us</h3>
                                            <a href="mailto:support@mathzai.com" className="text-primary hover:underline break-all">
                                                support@mathzai.com
                                            </a>
                                            <p className="text-[16px] text-muted-foreground">For support, feedback, and inquiries.</p>
                                        </div>
                                    </motion.div>
                                    <motion.div className="flex items-start" variants={fadeInUp}>
                                        <MapPin className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-[16px]">Our Office</h3>
                                            <address className="not-italic text-muted-foreground">
                                                House No 123, 2nd Floor, Pkt-6, Sec 22 Rohini,
                                                <br />
                                                Sultanpuri C Block, North West Delhi,
                                                <br />
                                                Delhi, India, 110086
                                            </address>
                                        </div>
                                    </motion.div>
                                    <motion.div className="mt-6 pt-6 border-t border-border/50" variants={fadeInUp}>
                                        <h3 className="font-semibold text-2xl mb-3">Frequently Asked Questions</h3>
                                        <p className="text-muted-foreground mb-4 text-[16px]">
                                            Have a common question? Check our FAQ page first for quick answers.
                                        </p>
                                        <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800">
                                            <Link href="/faq">
                                                <CheckCircle2 className="mr-2 h-5 w-5" /> Visit FAQ Page
                                            </Link>
                                        </Button>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="mt-16 md:mt-24 text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                            Connect with <span className="text-primary">Mathz AI</span>
                        </h2>
                        <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                            We are committed to providing excellent support and fostering a strong math learning community. Your success is our priority.
                        </p>
                        <Button 
                            size="xl" 
                            asChild 
                            className="bg-primary hover:bg-primary-700 shadow-lg transform hover:scale-105 transition-transform duration-300 p-4">
                            <Link href="/about-us">
                                Learn More About Our Mission
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>
            <style jsx global>{`
              .highlight-form-animation {
                animation: pulse-border 2.5s ease-out;
              }
              @keyframes pulse-border {
                0% { box-shadow: 0 0 0 0px hsl(var(--primary) / 0.6); }
                50% { box-shadow: 0 0 0 10px hsl(var(--primary) / 0.25); }
                100% { box-shadow: 0 0 0 0px hsl(var(--primary) / 0.0); }
              }
            `}</style>
        </>
    );
};

export default ContactPage;