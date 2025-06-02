"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Users, BrainCircuit, BookOpenCheck } from "lucide-react";

const AboutUs = () => {
    const companyName = "Mathingo AI LLP";
    const companyEmail = "support@mathzai.com";
    const companyWebsite = "www.mathzai.com";

    const features = [
        {
            icon: <BookOpenCheck className="h-8 w-8 text-primary mb-3" />,
            title: "Homework Assistance",
            description: "Step-by-Step Solutions, Instantly",
            details: "Students can type or upload math problems, and Mathz AI provides accurate, step-by-step solutions in under a second. No more guesswork—our AI ensures that every step is clearly explained, helping students understand how to solve problems rather than just giving them the final answer."
        },
        {
            icon: <BrainCircuit className="h-8 w-8 text-primary mb-3" />,
            title: "Smart Solution Check",
            description: "Verify Your Math Questions with Confidence",
            details: "Already solved a math problem but unsure if your answer is correct? Mathz AI's Smart Solution Checker allows students to verify their answers instantly. Our AI-based tool detects errors, highlights incorrect steps, and provides optimized solutions, allowing students to learn from their mistakes and improve their accuracy progressively."
        },
        {
            icon: <Users className="h-8 w-8 text-primary mb-3" />,
            title: "AI Maths Tutor",
            description: "Get Instant Help from Experts",
            details: "Mathz AI offers 24/7 real-time AI tutoring, helping students understand and solve complex topics like Geometry, Calculus, Trigonometry, Algebra, and more. The AI-powered tutor provides personalized, step-by-step guidance, making math more interactive and easier to learn."
        }
    ];

    const benefits = [
        "Aligned with the U.S. curriculum to ensure relevance and effectiveness.",
        "Combines advanced AI technology with pedagogical expertise for optimal learning.",
        "Supports multiple input modes: type, upload images, or speak your problem.",
        "Offers an interactive and engaging learning environment that makes math fun.",
        "Accessible anytime, anywhere, on any device, for learning on your schedule."
    ];

    const sectionVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "circOut" } }
    };

    return (
        <section id="about-us" className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/30 dark:from-black dark:to-gray-900/70 text-foreground" aria-labelledby="about-us-heading">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                <motion.div
                    className="text-center mb-16 md:mb-20"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <h1 id="about-us-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                        About <span className="text-primary">Mathz AI</span> by {companyName}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                        We are {companyName}, a dedicated team passionate about revolutionizing mathematics education through cutting-edge AI technology. Mathz AI is our flagship platform designed to make learning math simpler, smarter, and more accessible for everyone.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-blue-700">
                            <Link href="/signup">Get Started Free</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                            <Link href="#features">Explore Features</Link>
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    id="features"
                    className="mb-16 md:mb-24"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 md:mb-16">
                        What <span className="text-primary">Mathz AI</span> Offers
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div key={index} variants={itemVariants} viewport={{ once: true }}>
                                <Card className="h-full transform hover:scale-105 transition-transform duration-300 ease-out shadow-lg hover:shadow-xl dark:bg-card/80">
                                    <CardHeader>
                                        {feature.icon}
                                        <CardTitle className="text-2xl font-semibold text-primary">{feature.title}</CardTitle>
                                        <CardDescription className="text-lg font-medium">{feature.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{feature.details}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center mb-16 md:mb-24"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="relative h-96 mt-20 w-full rounded-2xl overflow-hidden shadow-2xl group"
                        variants={itemVariants} viewport={{ once: true }}
                    >
                        <Image
                            src="/images/icons/student-mathzai.png"
                            alt="Students learning math with Mathz AI"
                            fill
                            className="object-cover"
                        />
                    </motion.div>

                    <motion.div variants={itemVariants} viewport={{ once: true }}>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-8">
                            Why Choose <span className="text-primary">Mathz AI</span>?
                        </h2>
                        <ul className="space-y-5">
                            {benefits.map((benefit, index) => (
                                <motion.li
                                    key={index}
                                    className="flex items-start p-4 bg-card dark:bg-card/70 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                    variants={itemVariants}
                                    custom={index}
                                    whileInView="visible"
                                    initial="hidden"
                                    viewport={{ once: true }}
                                >
                                    <CheckCircle2 className="h-6 w-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                                    <span className="text-md md:text-lg text-foreground/90">{benefit}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="text-center bg-primary/10 dark:bg-primary/20 p-8 md:p-12 rounded-2xl mb-16 md:mb-24"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
                        Empowering Students, Parents, and Educators
                    </h2>
                    <p className="text-lg md:text-xl text-foreground/80 max-w-4xl mx-auto mb-6">
                        Mathz AI isn't just for students—it's a comprehensive tool designed to support parents in assisting with homework and to provide educators with resources for a more effective teaching experience. We foster a collaborative learning ecosystem for academic success.
                    </p>
                    <p className="text-xl md:text-2xl font-semibold text-primary">
                        Our Mission: To make math learning more accessible, faster, and profoundly effective for every student, everywhere.
                    </p>
                </motion.div>

                <motion.div
                    className="text-center"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                        Ready to Transform Your Math Journey?
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Join thousands of students, parents, and educators who are experiencing mathematics like never before with Mathz AI. Interactive, intuitive, and stress-free!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button asChild size="lg" className="text-lg px-10 py-7 bg-primary hover:bg-blue-700">
                            <Link href="/register">Sign Up Now</Link>
                        </Button>
                        <Button asChild variant="secondary" size="lg" className="text-lg px-10 py-7">
                            <Link href="/contact-us">Contact Our Team</Link>
                        </Button>
                    </div>
                    <motion.p
                        className="text-2xl sm:text-3xl font-bold text-primary"
                        animate={{ scale: [1, 1.03, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        Mathz AI—Making Math Simple, Smart, and Fun!
                    </motion.p>
                    <div className="mt-12 text-center text-muted-foreground">
                        <p className="text-sm">
                            Mathz AI is a product of {companyName}.
                        </p>
                        <p className="text-sm">
                            For support or inquiries, please email us at <a href={`mailto:${companyEmail}`} className="text-primary hover:underline font-medium">{companyEmail}</a> or visit <a href={`https://${companyWebsite}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">{companyWebsite}</a>.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutUs;