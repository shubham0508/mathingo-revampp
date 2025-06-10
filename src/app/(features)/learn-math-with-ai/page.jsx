"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, Brain, Calculator, Camera, PenTool, CheckCircle, Users, Clock, Award, TrendingUp, Lightbulb, Target, Zap } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import { siteConfig } from "@/config/site";
import { generateMetadata as generatePageMetadata } from '@/config/seo';
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/seoUtils';

const MathTutorContent = () => {
    const [activeFeature, setActiveFeature] = useState(0);
    const [animatedStats, setAnimatedStats] = useState({ students: 0, problems: 0, accuracy: 0 });

    const features = [
        {
            icon: <Calculator className="w-6 h-6" />,
            title: "Step-by-Step Solutions",
            description: "Get detailed explanations for every math problem with clear reasoning"
        },
        {
            icon: <Brain className="w-6 h-6" />,
            title: "Adaptive Learning",
            description: "AI adapts to your learning style and identifies knowledge gaps"
        },
        {
            icon: <Camera className="w-6 h-6" />,
            title: "Photo & Stylus Input",
            description: "Snap a photo or write with stylus - we'll recognize your math problems"
        },
        {
            icon: <Target className="w-6 h-6" />,
            title: "Instant Feedback",
            description: "Know exactly where you went wrong and how to fix it"
        }
    ];

    const mathTopics = [
        { name: "Algebra", color: "bg-blue-500", width: "85%" },
        { name: "Calculus", color: "bg-purple-500", width: "78%" },
        { name: "Geometry", color: "bg-green-500", width: "82%" },
        { name: "Statistics", color: "bg-orange-500", width: "75%" },
        { name: "Trigonometry", color: "bg-red-500", width: "80%" }
    ];

    const testimonials = [
        {
            name: "Sarah M.",
            grade: "Grade 11",
            text: "Finally understood calculus derivatives! The step-by-step explanations are amazing.",
            rating: 5
        },
        {
            name: "Alex K.",
            grade: "University",
            text: "Saved my semester. The AI tutor explains things better than my professor.",
            rating: 5
        },
        {
            name: "Maya P.",
            grade: "Grade 9",
            text: "Math homework is actually fun now. Love the interactive problem solving!",
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
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const animateStats = () => {
            const targets = { students: 50000, problems: 1200000, accuracy: 98 };
            const duration = 2000;
            const steps = 60;
            const stepTime = duration / steps;

            let step = 0;
            const timer = setInterval(() => {
                step++;
                const progress = step / steps;

                setAnimatedStats({
                    students: Math.floor(targets.students * progress),
                    problems: Math.floor(targets.problems * progress),
                    accuracy: Math.floor(targets.accuracy * progress)
                });

                if (step >= steps) clearInterval(timer);
            }, stepTime);
        };

        animateStats();
    }, []);

    const pageUrl = `${siteConfig.url}/ai-math-tutor-features`; // Or whatever the specific URL for this page is
    const metadata = generatePageMetadata({
        title: "AI Math Tutor - Interactive Learning & Step-by-Step Solutions",
        description: "Discover MathzAI's AI Math Tutor: your personal math coach for step-by-step solutions, adaptive learning, photo & stylus input, and instant feedback. Master algebra, calculus, geometry, and more.",
        url: pageUrl,
        image: `${siteConfig.url}/images/ai-math-tutor-features-og.jpg` // Create a specific OG image
    });

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "AI Math Tutoring",
        "name": "MathzAI - AI Math Tutor",
        "description": "Personalized AI math coach providing step-by-step solutions, adaptive learning, instant feedback, and support for various input methods (photo, stylus, text) across all major math topics.",
        "provider": createOrganizationSchema(),
        "areaServed": {
            "@type": "Country",
            "name": "Global"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "AI Math Tutor Plans",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Free AI Math Tutor Access"
                    },
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "price": "0.00",
                        "priceCurrency": "USD"
                    }
                }
            ]
        },
        "serviceOutput": {
            "@type": "Thing",
            "name": "Interactive Math Problem Solving Guidance"
        },
        "potentialAction": {
            "@type": "InteractAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${siteConfig.url}/ai-math-tutor`
            }
        }
    };

    return (
        <>
            <Head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                <meta name="keywords" content="ai math tutor, math coach, step-by-step math, adaptive learning, math problem solver, photo math, stylus math input, instant math feedback, algebra tutor, calculus help, mathzai tutor" />

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
                id="ai-math-tutor-service-schema"
                type="application/ld+json"
                strategy="afterInteractive"
            >
                {JSON.stringify(serviceSchema)}
            </Script>
            <Script
                id="website-schema-math-tutor-features"
                type="application/ld+json"
                strategy="afterInteractive"
            >
                {JSON.stringify(createWebsiteSchema())}
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
                            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent"
                        >
                            AI Math Tutor – Your Personal Math Coach
                        </motion.h1>
                        <motion.p
                            variants={fadeInUp}
                            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
                        >
                            Struggling with a math step? Just ask – I'll guide you through with clarity and precision, always ready to help!
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
                    >
                        {[
                            { value: animatedStats.students, label: "Students Helped", color: "text-blue-600", suffix: "+" },
                            { value: animatedStats.problems, label: "Problems Solved", color: "text-purple-600", suffix: "+" },
                            { value: animatedStats.accuracy, label: "Accuracy Rate", color: "text-teal-600", suffix: "%" }
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
                    viewport={{ once: true, amount: 0.3 }}
                    variants={staggerContainer}
                    className="space-y-8"
                >
                    <motion.h2
                        variants={fadeInUp}
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800"
                    >
                        What Can You Do Here?
                    </motion.h2>
                    <motion.div
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {[
                            {
                                icon: <Calculator className="w-8 h-8 text-blue-600" />,
                                title: "Step-by-Step Solutions",
                                description: "Solve math problems with real-time AI guidance and detailed explanations"
                            },
                            {
                                icon: <Lightbulb className="w-8 h-8 text-yellow-600" />,
                                title: "Smart Hints System",
                                description: "Get hints without giving away the answer instantly - learn at your pace"
                            },
                            {
                                icon: <PenTool className="w-8 h-8 text-green-600" />,
                                title: "Multiple Input Methods",
                                description: "Upload photos, write with stylus, or type your math problems directly"
                            },
                            {
                                icon: <CheckCircle className="w-8 h-8 text-purple-600" />,
                                title: "Error Analysis",
                                description: "Understand why a step is wrong and learn how to fix it properly"
                            },
                            {
                                icon: <Brain className="w-8 h-8 text-teal-600" />,
                                title: "All Math Subjects",
                                description: "Works for algebra, calculus, word problems, geometry, statistics and more"
                            },
                            {
                                icon: <TrendingUp className="w-8 h-8 text-red-600" />,
                                title: "Progress Tracking",
                                description: "Monitor your learning progress and identify areas for improvement"
                            }
                        ].map((item, index) => (
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
                                        {item.icon}
                                    </motion.div>
                                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                                </motion.div>
                                <p className="text-gray-600 leading-relaxed">{item.description}</p>
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
                        <motion.h2
                            variants={fadeInDown}
                            className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800"
                        >
                            How Our AI Math Tutor Helps You Learn
                        </motion.h2>
                        <motion.div
                            variants={scaleIn}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white rounded-2xl p-8 shadow-lg"
                        >
                            <motion.p
                                variants={fadeInLeft}
                                className="text-lg text-gray-700 leading-relaxed mb-6"
                            >
                                Unlike traditional math solvers that just give you the answer, <strong>Mathz AI's intelligent tutor teaches you the process</strong>. Whether you're stuck at the first step or somewhere in the middle of a complex problem, our adaptive AI system identifies exactly where you need help.
                            </motion.p>
                            <motion.p
                                variants={fadeInRight}
                                className="text-lg text-gray-700 leading-relaxed"
                            >
                                You'll always know <em>what to do next</em> and <em>why it works</em> – building genuine understanding that lasts beyond homework. Our step-by-step math solver with interactive guidance makes learning mathematics intuitive and engaging.
                            </motion.p>
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
                        Interactive Learning Experience
                    </motion.h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            variants={fadeInLeft}
                            className="space-y-6"
                        >
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${activeFeature === index
                                        ? 'bg-blue-100 border-2 border-blue-500 shadow-lg'
                                        : 'bg-white border border-gray-200 hover:shadow-md'
                                        }`}
                                    onClick={() => setActiveFeature(index)}
                                >
                                    <div className="flex items-center space-x-4">
                                        <motion.div
                                            className={`p-3 rounded-lg ${activeFeature === index ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                                                }`}
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {feature.icon}
                                        </motion.div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                                            <p className="text-gray-600">{feature.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                        <motion.div
                            variants={fadeInRight}
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white"
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
                                    🧮
                                </motion.div>
                                <motion.h3
                                    key={activeFeature}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-2xl font-bold"
                                >
                                    {features[activeFeature].title}
                                </motion.h3>
                                <motion.p
                                    key={`desc-${activeFeature}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-blue-100"
                                >
                                    {features[activeFeature].description}
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
                        Complete Math Subject Coverage
                    </motion.h2>
                    <motion.div
                        variants={scaleIn}
                        className="bg-white rounded-2xl p-8 shadow-lg"
                    >
                        <div className="space-y-6">
                            {mathTopics.map((topic, index) => (
                                <motion.div
                                    key={index}
                                    className="space-y-2"
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-800">{topic.name}</span>
                                        <span className="text-sm text-gray-600">{topic.width}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <motion.div
                                            className={`h-3 rounded-full ${topic.color}`}
                                            initial={{ width: 0 }}
                                            whileInView={{ width: topic.width }}
                                            transition={{ duration: 1, delay: index * 0.1 }}
                                        ></motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
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
                        Popular Examples You Can Try
                    </motion.h2>
                    <motion.div
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        {[
                            { text: "Find the integral of sin(x)", category: "Calculus", color: "bg-purple-100 text-purple-800" },
                            { text: "Factor: x² - 5x + 6", category: "Algebra", color: "bg-blue-100 text-blue-800" },
                            { text: "Derivative of 2x³ + 4x", category: "Calculus", color: "bg-purple-100 text-purple-800" },
                            { text: "Solve: 3x + 2 = 17", category: "Algebra", color: "bg-blue-100 text-blue-800" },
                            { text: "Graph: y = x² - 4", category: "Functions", color: "bg-green-100 text-green-800" },
                            { text: "Train speed word problem", category: "Word Problems", color: "bg-orange-100 text-orange-800" },
                            { text: "Find area of triangle", category: "Geometry", color: "bg-teal-100 text-teal-800" },
                            { text: "Standard deviation calculation", category: "Statistics", color: "bg-red-100 text-red-800" }
                        ].map((example, index) => (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                whileHover={{
                                    scale: 1.05,
                                    y: -5,
                                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                                }}
                                className="bg-white rounded-lg p-4 shadow-md transition-shadow duration-300 border border-gray-100"
                            >
                                <motion.div
                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${example.color}`}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {example.category}
                                </motion.div>
                                <p className="text-gray-800 font-medium">{example.text}</p>
                                <Link href="/ai-math-tutor">
                                    <motion.div
                                        className="mt-3 flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
                                        whileHover={{ x: 5 }}
                                    >
                                        <span className="text-sm">Try this example</span>
                                        <motion.div
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        >
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </motion.div>
                                    </motion.div>
                                </Link>
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
                        What Students Say About Our AI Math Tutor
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
                        Ready to Master Mathematics with AI?
                    </motion.h2>
                    <motion.p
                        variants={fadeInUp}
                        className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                    >
                        Join thousands of students who've improved their math grades with our intelligent tutoring system
                    </motion.p>
                    <motion.div
                        variants={staggerContainer}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link href="/ai-math-tutor">
                            <motion.button
                                variants={staggerItem}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 transition-colors"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                    <Zap className="w-5 h-5" />
                                </motion.div>
                                Start Learning Now
                            </motion.button>
                        </Link>
                        <motion.div
                            variants={staggerItem}
                            className="text-gray-400 text-sm"
                        >
                            ✓ No registration required ✓ Unlimited problems ✓ Instant results
                        </motion.div>
                    </motion.div>
                </motion.section>
            </div>
        </>
    );
};

export default MathTutorContent;