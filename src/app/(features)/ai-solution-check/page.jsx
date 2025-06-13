"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, Upload, FileText, Camera, CheckCircle, Brain, Clock, Award, TrendingUp, Lightbulb, Target, Zap, AlertCircle, BookOpen, PenTool } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';

const SmartSolutionCheckContent = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [animatedStats, setAnimatedStats] = useState({ students: 0, solutions: 0, accuracy: 0 });

    const steps = [
        {
            icon: <Upload className="w-6 h-6" />,
            title: "Upload Your Question",
            description: "Drag and drop or browse a math problem from your homework sheet"
        },
        {
            icon: <PenTool className="w-6 h-6" />,
            title: "Submit Your Answer Sheet",
            description: "Upload your handwritten or typed solution"
        },
        {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Get Feedback",
            description: "Our AI checks every step and notifies you of errors, missed concepts, or correct logic"
        }
    ];

    const features = [
        {
            icon: <Camera className="w-8 h-8 text-blue-600" />,
            title: "Supports Handwritten Input",
            description: "Works with photos and scanned sheets - no need to retype your work"
        },
        {
            icon: <FileText className="w-8 h-8 text-green-600" />,
            title: "Multiple Formats",
            description: "Upload PDF, PNG, JPEG files up to 5MB with crystal clear recognition"
        },
        {
            icon: <Brain className="w-8 h-8 text-purple-600" />,
            title: "Concept-Level Accuracy",
            description: "Understand which step was wrong and why with detailed explanations"
        },
        {
            icon: <Zap className="w-8 h-8 text-yellow-600" />,
            title: "Instant Feedback",
            description: "Save time with quick, step-by-step validation and error detection"
        },
        {
            icon: <Lightbulb className="w-8 h-8 text-teal-600" />,
            title: "Learn from Solved Examples",
            description: "Try previously solved problems to reinforce your understanding"
        },
        {
            icon: <Target className="w-8 h-8 text-red-600" />,
            title: "Precision Checking",
            description: "Catch calculation errors, logic mistakes, and formatting issues"
        }
    ];

    const exampleProblems = [
        {
            type: "Calculus",
            problem: "Find the integral of 2x + 4",
            difficulty: "Intermediate",
            color: "bg-purple-100 text-purple-800"
        },
        {
            type: "Algebra",
            problem: "Factor and solve: x² + 6x + 8 = 0",
            difficulty: "Basic",
            color: "bg-blue-100 text-blue-800"
        },
        {
            type: "Geometry",
            problem: "Find the area of a triangle with sides 3, 4, 5",
            difficulty: "Basic",
            color: "bg-green-100 text-green-800"
        },
        {
            type: "Trigonometry",
            problem: "Solve sin(x) = 0.5 for 0 ≤ x ≤ 2π",
            difficulty: "Intermediate",
            color: "bg-orange-100 text-orange-800"
        },
        {
            type: "Statistics",
            problem: "Calculate mean and standard deviation",
            difficulty: "Advanced",
            color: "bg-red-100 text-red-800"
        },
        {
            type: "Functions",
            problem: "Graph y = x² - 4x + 3",
            difficulty: "Intermediate",
            color: "bg-teal-100 text-teal-800"
        }
    ];

    const testimonials = [
        {
            name: "Emma R.",
            grade: "Grade 12",
            text: "Smart Solution Check caught my algebra mistake before I submitted. Saved my grade!",
            rating: 5
        },
        {
            name: "David L.",
            grade: "University",
            text: "Perfect for checking calculus homework. The step-by-step feedback is incredibly helpful.",
            rating: 5
        },
        {
            name: "Sophie M.",
            grade: "Grade 10",
            text: "Finally, a tool that understands my handwriting! No more retyping problems.",
            rating: 5
        }
    ];

    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const fadeInDown = {
        hidden: { opacity: 0, y: -60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const fadeInLeft = {
        hidden: { opacity: 0, x: -60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const fadeInRight = {
        hidden: { opacity: 0, x: 60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const staggerItem = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const animateStats = () => {
            const targets = { students: 25000, solutions: 850000, accuracy: 96 };
            const duration = 2000;
            const stepCount = 60;
            const stepTime = duration / stepCount;

            let step = 0;
            const timer = setInterval(() => {
                step++;
                const progress = step / stepCount;

                setAnimatedStats({
                    students: Math.floor(targets.students * progress),
                    solutions: Math.floor(targets.solutions * progress),
                    accuracy: Math.floor(targets.accuracy * progress)
                });

                if (step >= stepCount) clearInterval(timer);
            }, stepTime);
        };

        animateStats();
    }, []);

    const siteConfig = {
        url: "https://mathzai.com",
        name: "Mathz AI",
        description: "AI-powered math learning platform"
    };

    const pageUrl = `${siteConfig.url}/smart-solution-check`;
    const metadata = {
        title: "Smart Solution Check | Instantly Verify Your Handwritten Math Answers – Mathz AI",
        description: "Upload your handwritten math answers and get them verified instantly with Mathz AI's Smart Solution Check. Supports PDF, JPEG, PNG. Perfect for students needing fast and accurate feedback!",
        openGraph: {
            type: "website",
            locale: "en_US",
            url: pageUrl,
            title: "Smart Solution Check | Instantly Verify Your Handwritten Math Answers – Mathz AI",
            description: "Upload your handwritten math answers and get them verified instantly with Mathz AI's Smart Solution Check. Supports PDF, JPEG, PNG. Perfect for students needing fast and accurate feedback!",
            siteName: siteConfig.name,
            images: [{
                url: `${siteConfig.url}/images/smart-solution-check-og.jpg`,
                width: 1200,
                height: 630,
                alt: "Smart Solution Check - Mathz AI"
            }]
        },
        twitter: {
            card: "summary_large_image",
            title: "Smart Solution Check | Instantly Verify Your Handwritten Math Answers – Mathz AI",
            description: "Upload your handwritten math answers and get them verified instantly with Mathz AI's Smart Solution Check. Supports PDF, JPEG, PNG. Perfect for students needing fast and accurate feedback!",
            images: [`${siteConfig.url}/images/smart-solution-check-og.jpg`],
            creator: "@mathzai"
        },
        alternates: {
            canonical: pageUrl
        }
    };

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Smart Solution Verification",
        "name": "Mathz AI - Smart Solution Check",
        "description": "AI-powered math solution verification tool that checks handwritten answers instantly. Supports PDF, JPEG, PNG uploads with step-by-step feedback and error detection.",
        "provider": {
            "@type": "Organization",
            "name": siteConfig.name,
            "url": siteConfig.url
        },
        "areaServed": {
            "@type": "Country",
            "name": "Global"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Smart Solution Check Plans",
            "itemListElement": [{
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Free Solution Verification"
                },
                "priceSpecification": {
                    "@type": "PriceSpecification",
                    "price": "0.00",
                    "priceCurrency": "USD"
                }
            }]
        }
    };

    return (
        <>
            <Head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                <meta name="keywords" content="smart solution check, math answer verification, handwritten math checker, AI math validator, PDF math checker, JPEG math solver, PNG math verification, mathzai solution check, instant math feedback" />

                <meta property="og:type" content={metadata.openGraph.type} />
                <meta property="og:locale" content={metadata.openGraph.locale} />
                <meta property="og:url" content={metadata.openGraph.url} />
                <meta property="og:title" content={metadata.openGraph.title} />
                <meta property="og:description" content={metadata.openGraph.description} />
                <meta property="og:site_name" content={metadata.openGraph.siteName} />
                <meta property="og:image" content={metadata.openGraph.images[0].url} />
                <meta property="og:image:width" content={String(metadata.openGraph.images[0].width)} />
                <meta property="og:image:height" content={String(metadata.openGraph.images[0].height)} />
                <meta property="og:image:alt" content={metadata.openGraph.images[0].alt} />

                <meta name="twitter:card" content={metadata.twitter.card} />
                <meta name="twitter:title" content={metadata.twitter.title} />
                <meta name="twitter:description" content={metadata.twitter.description} />
                <meta name="twitter:image" content={metadata.twitter.images[0]} />
                <meta name="twitter:creator" content={metadata.twitter.creator} />

                <link rel="canonical" href={metadata.alternates.canonical} />
            </Head>
            <Script
                id="smart-solution-check-service-schema"
                type="application/ld+json"
                strategy="afterInteractive"
            >
                {JSON.stringify(serviceSchema)}
            </Script>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="text-center space-y-8"
                >
                    <motion.div variants={staggerItem} className="space-y-4">
                        <motion.h1
                            variants={fadeInDown}
                            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
                        >
                            Smart Solution Check
                        </motion.h1>
                        <motion.p
                            variants={fadeInUp}
                            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
                        >
                            Get even your handwritten answers checked here ✨
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
                    >
                        {[
                            { value: animatedStats.students, label: "Students Helped", color: "text-green-600", suffix: "+" },
                            { value: animatedStats.solutions, label: "Solutions Verified", color: "text-blue-600", suffix: "+" },
                            { value: animatedStats.accuracy, label: "Accuracy Rate", color: "text-purple-600", suffix: "%" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                whileHover={{ scale: 1.05, rotate: 1 }}
                                className="bg-white rounded-2xl shadow-lg p-6 transform transition-transform duration-300"
                            >
                                <motion.div
                                    className={`text-3xl font-bold ${stat.color}`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.2, duration: 0.5, type: "spring" }}
                                >
                                    {stat.value.toLocaleString()}{stat.suffix}
                                </motion.div>
                                <div className="text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.section>

                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12"
                >
                    <div className="max-w-4xl mx-auto">
                        <motion.p
                            variants={fadeInLeft}
                            className="text-lg text-gray-700 leading-relaxed mb-6"
                        >
                            Struggling to verify if your math solution is correct? With <strong>Mathz AI's Smart Solution Check</strong>, you can upload your handwritten answers — whether they're in PDF, JPEG, or PNG — and our intelligent system will validate each step for accuracy.
                        </motion.p>
                        <motion.p
                            variants={fadeInRight}
                            className="text-lg text-gray-700 leading-relaxed"
                        >
                            Ideal for students preparing for exams or completing homework, this tool ensures you're always on the right track. <em>No more second-guessing your math work!</em>
                        </motion.p>
                    </div>
                </motion.section>

                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="space-y-8"
                >
                    <motion.h2
                        variants={fadeInUp}
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800"
                    >
                        How Smart Solution Check Works
                    </motion.h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            variants={fadeInLeft}
                            className="space-y-6"
                        >
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${activeStep === index
                                        ? 'bg-green-100 border-2 border-green-500 shadow-lg'
                                        : 'bg-white border border-gray-200 hover:shadow-md'
                                        }`}
                                    onClick={() => setActiveStep(index)}
                                >
                                    <div className="flex items-center space-x-4">
                                        <motion.div
                                            className={`p-3 rounded-lg ${activeStep === index ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                                                }`}
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {step.icon}
                                        </motion.div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                📄 {step.title}
                                            </h3>
                                            <p className="text-gray-600">{step.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <motion.div
                                variants={fadeInUp}
                                className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white text-center"
                            >
                                <p className="font-semibold">No more second-guessing your math work!</p>
                            </motion.div>
                        </motion.div>
                        <motion.div
                            variants={fadeInRight}
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            className="bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl p-8 text-white"
                        >
                            <div className="text-center space-y-4">
                                <motion.div
                                    className="text-6xl"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                >
                                    ✅
                                </motion.div>
                                <motion.h3
                                    key={activeStep}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-2xl font-bold"
                                >
                                    {steps[activeStep].title}
                                </motion.h3>
                                <motion.p
                                    key={`desc-${activeStep}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-green-100"
                                >
                                    {steps[activeStep].description}
                                </motion.p>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="space-y-8"
                >
                    <motion.h2
                        variants={fadeInUp}
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800"
                    >
                        Why Use Smart Solution Check?
                    </motion.h2>
                    <motion.div
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                whileHover={{
                                    scale: 1.02,
                                    y: -5,
                                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                }}
                                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <motion.div
                                    className="flex items-center space-x-3 mb-4"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {feature.icon}
                                    </motion.div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        📷 {feature.title}
                                    </h3>
                                </motion.div>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.section>

                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="space-y-8"
                >
                    <motion.h2
                        variants={fadeInUp}
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800"
                    >
                        Explore Solved Examples
                    </motion.h2>
                    <motion.p
                        variants={fadeInUp}
                        className="text-center text-gray-600 max-w-2xl mx-auto"
                    >
                        Use these examples as templates or practice sets to strengthen your solution approach.
                    </motion.p>
                    <motion.div
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {exampleProblems.map((example, index) => (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                whileHover={{
                                    scale: 1.05,
                                    y: -5,
                                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                                }}
                                className="bg-white rounded-lg p-6 shadow-md transition-shadow duration-300 border border-gray-100"
                            >
                                <motion.div
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${example.color}`}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {example.type}
                                </motion.div>
                                <h3 className="text-gray-800 font-semibold mb-2">✅ {example.problem}</h3>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-sm text-gray-500">Difficulty: {example.difficulty}</span>
                                    <Link href="/smart-solution-check">
                                        <motion.div
                                            className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
                                            whileHover={{ x: 5 }}
                                        >
                                            <span className="text-sm">Try this</span>
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </motion.div>
                                        </motion.div>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.section>

                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="space-y-8"
                >
                    <motion.h2
                        variants={fadeInUp}
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800"
                    >
                        What Students Say
                    </motion.h2>
                    <motion.div
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                whileHover={{
                                    scale: 1.05,
                                    rotate: 1,
                                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                                }}
                                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                            >
                                <motion.div
                                    className="flex items-center space-x-1 mb-4"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <motion.span
                                            key={i}
                                            className="text-yellow-400 text-xl"
                                            initial={{ scale: 0, rotate: 0 }}
                                            whileInView={{ scale: 1, rotate: 360 }}
                                            transition={{ delay: i * 0.1, duration: 0.5 }}
                                        >
                                            ⭐
                                        </motion.span>
                                    ))}
                                </motion.div>
                                <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                                <div className="border-t pt-4">
                                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                                    <p className="text-sm text-gray-600">{testimonial.grade}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.section>

                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white"
                >
                    <motion.h2
                        variants={fadeInDown}
                        className="text-4xl font-bold mb-4"
                    >
                        Try Smart Solution Check Now
                    </motion.h2>
                    <motion.p
                        variants={fadeInUp}
                        className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                    >
                        Upload your answer and let our AI verify it. Trusted by 1000s of students for accurate math help.
                    </motion.p>
                    <motion.div
                        variants={staggerContainer}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link href="/smart-solution-check">
                            <motion.button
                                variants={staggerItem}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.5)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 transition-colors"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                    <CheckCircle className="w-5 h-5" />
                                </motion.div>
                                Check My Solution
                            </motion.button>
                        </Link>
                        <motion.div
                            variants={staggerItem}
                            className="text-gray-400 text-sm"
                        >
                            ✓ Supports PDF, JPEG, PNG ✓ Up to 5MB ✓ Instant feedback
                        </motion.div>
                    </motion.div>
                </motion.section>
            </div>
        </>
    );
};

export default SmartSolutionCheckContent;