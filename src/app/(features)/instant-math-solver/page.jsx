"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  Brain,
  BookOpen,
  Trophy,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  CheckCircle,
  Upload,
  Zap,
  Target,
  Award,
  Lightbulb,
  ArrowRight,
  PlayCircle
} from 'lucide-react';
import Link from 'next/link';

const HomeworkAssistantContent = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeTab, setActiveTab] = useState('algebra');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleOnHover = {
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Recognition",
      description: "Advanced OCR technology reads handwritten and printed math problems with 99.5% accuracy",
      stat: "99.5% Accuracy"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Step-by-Step Solutions",
      description: "Get detailed explanations for every step, helping you understand the 'why' behind each solution",
      stat: "< 3 Seconds"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Learning",
      description: "Adapts to your learning style and difficulty level for optimal comprehension",
      stat: "15+ Subjects"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Exam Preparation",
      description: "Supports SAT, ACT, JEE, CBSE, ICSE, and other major competitive examinations",
      stat: "50+ Exam Types"
    }
  ];

  const mathTopics = {
    algebra: {
      title: "Algebra & Pre-Algebra",
      problems: [
        "Linear equations and inequalities",
        "Quadratic equations and functions",
        "Polynomial operations",
        "Systems of equations",
        "Exponential and logarithmic functions"
      ],
      difficulty: "Beginner to Advanced",
      color: "bg-blue-500"
    },
    calculus: {
      title: "Calculus & Analysis",
      problems: [
        "Limits and continuity",
        "Derivatives and applications",
        "Integrals and area under curves",
        "Differential equations",
        "Multivariable calculus"
      ],
      difficulty: "Intermediate to Expert",
      color: "bg-purple-500"
    },
    geometry: {
      title: "Geometry & Trigonometry",
      problems: [
        "Angle relationships and proofs",
        "Area and volume calculations",
        "Trigonometric identities",
        "Circle theorems",
        "3D coordinate geometry"
      ],
      difficulty: "Beginner to Advanced",
      color: "bg-green-500"
    },
    statistics: {
      title: "Statistics & Probability",
      problems: [
        "Descriptive statistics",
        "Probability distributions",
        "Hypothesis testing",
        "Regression analysis",
        "Data visualization"
      ],
      difficulty: "Intermediate to Advanced",
      color: "bg-orange-500"
    }
  };

  const testimonials = [
    {
      name: "Sarah Chen",
      grade: "12th Grade",
      subject: "Calculus",
      rating: 5,
      text: "This AI homework assistant helped me understand derivatives in a way my textbook never could. The step-by-step solutions are incredible!",
      improvement: "+25% grade improvement"
    },
    {
      name: "Marcus Johnson",
      grade: "10th Grade",
      subject: "Algebra",
      rating: 5,
      text: "I was struggling with quadratic equations for weeks. One session with this tool and everything clicked. It's like having a personal tutor 24/7!",
      improvement: "From C to A- average"
    },
    {
      name: "Priya Patel",
      grade: "College Freshman",
      subject: "Statistics",
      rating: 5,
      text: "The probability explanations are so clear and detailed. It helped me ace my statistics midterm. Highly recommend for college-level math!",
      improvement: "90% on midterm exam"
    }
  ];

  const faqs = [
    {
      question: "How accurate is the AI math solver for handwritten problems?",
      answer: "Our advanced OCR technology achieves 99.5% accuracy for clear handwritten math problems. For best results, ensure your handwriting is legible and use dark ink on light paper."
    },
    {
      question: "Can it solve word problems and application-based questions?",
      answer: "Yes! Our AI excels at interpreting word problems, extracting key information, and providing step-by-step solutions with explanations of the problem-solving approach."
    },
    {
      question: "Is it suitable for competitive exam preparation like SAT, JEE, or CBSE?",
      answer: "Absolutely. Our system is trained on thousands of problems from major examinations including SAT, ACT, JEE Main/Advanced, CBSE, ICSE, and international curricula."
    },
    {
      question: "What file formats are supported for problem uploads?",
      answer: "You can upload images (JPG, PNG, GIF), PDF documents, or simply type/paste your problems directly. We also support taking photos directly through your device camera."
    },
    {
      question: "How does it help improve my understanding, not just give answers?",
      answer: "Every solution includes detailed step-by-step explanations, conceptual insights, alternative methods, and tips to avoid common mistakes, ensuring deep understanding."
    }
  ];

  const stats = [
    { label: "Problems Solved Daily", value: "50,000+", icon: <Calculator /> },
    { label: "Student Success Rate", value: "94.7%", icon: <TrendingUp /> },
    { label: "Average Grade Improvement", value: "+1.2 GPA", icon: <Award /> },
    { label: "Active Students", value: "125K+", icon: <Users /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* Hero Section with Value Proposition */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center"
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Transform Your Math Learning with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI Power</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join over 125,000 students who've improved their math grades by an average of 1.2 GPA points using our intelligent homework assistant
            </p>
          </motion.div>

          {/* Key Stats */}
          <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={scaleOnHover.hover}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <div className="text-blue-600 mb-2 flex justify-center">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Interactive Features Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Students Choose Our AI Math Assistant
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of math learning with features designed for student success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className={`bg-white rounded-xl p-6 shadow-lg border-2 transition-all duration-300 cursor-pointer ${activeFeature === index ? 'border-blue-500 bg-blue-50' : 'border-gray-100'
                  }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block">
                  {feature.stat}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Interactive Math Topics */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="bg-white rounded-2xl p-8 shadow-xl"
        >
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Master Every Math Subject
            </h3>
            <p className="text-lg text-gray-600">
              From basic arithmetic to advanced calculus - we've got you covered
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.keys(mathTopics).map((topic) => (
              <button
                key={topic}
                onClick={() => setActiveTab(topic)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === topic
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {mathTopics[topic].title}
              </button>
            ))}
          </div>

          {/* Topic Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div>
              <div className={`inline-block px-4 py-2 rounded-full text-white text-sm font-semibold mb-4 ${mathTopics[activeTab].color}`}>
                {mathTopics[activeTab].difficulty}
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                {mathTopics[activeTab].title}
              </h4>
              <ul className="space-y-3">
                {mathTopics[activeTab].problems.map((problem, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {problem}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h5 className="text-lg font-semibold text-gray-900 mb-2">
                  Interactive Learning
                </h5>
                <p className="text-gray-600 mb-4">
                  Get step-by-step solutions with visual explanations and practice problems
                </p>
                <Link href="/homework-assistant">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                    Try Sample Problems
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* How It Works - Process Flow */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Get Solutions in 3 Simple Steps
            </h3>
            <p className="text-lg text-gray-600">
              From problem to solution in under 30 seconds
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                icon: <Upload className="w-8 h-8" />,
                title: "Upload or Type",
                description: "Take a photo, upload an image, or type your math problem directly",
                color: "bg-blue-500"
              },
              {
                step: 2,
                icon: <Brain className="w-8 h-8" />,
                title: "AI Analysis",
                description: "Our advanced AI reads and understands your problem in seconds",
                color: "bg-purple-500"
              },
              {
                step: 3,
                icon: <Lightbulb className="w-8 h-8" />,
                title: "Step-by-Step Solution",
                description: "Receive detailed explanations with learning insights and tips",
                color: "bg-green-500"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={scaleOnHover.hover}
                className="relative bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                  {step.icon}
                </div>
                <div className="absolute -top-3 -right-3 bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  {step.step}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h4>
                <p className="text-gray-600">{step.description}</p>
                {index < 2 && (
                  <ArrowRight className="hidden md:block absolute -right-8 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Student Success Stories */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">
              See how our AI homework assistant transforms math learning
            </h3>
          </motion.div>

          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl font-medium mb-6 italic">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <div>
                  <div className="font-bold text-lg">{testimonials[currentTestimonial].name}</div>
                  <div className="text-blue-200">{testimonials[currentTestimonial].grade} • {testimonials[currentTestimonial].subject}</div>
                </div>
                <div className="bg-green-500 px-4 py-2 rounded-full text-sm font-semibold">
                  {testimonials[currentTestimonial].improvement}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${index === currentTestimonial ? 'bg-white' : 'bg-white/30'
                  }`}
              />
            ))}
          </div>
        </motion.section>

        {/* Comprehensive FAQ Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-lg text-gray-600">
              Everything you need to know about our AI math homework assistant
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl shadow-none mb-4 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white"
        >
          <h3 className="text-4xl font-bold mb-4">
            Ready to Excel in Mathematics?
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students who've transformed their math learning experience. Start solving problems with AI-powered precision today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/homework-assistant">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 transition-colors"
              >
                <PlayCircle className="w-6 h-6" />
                Start Solving Now - Free
              </motion.button>
            </Link>
            <div className="text-gray-400 text-sm">
              ✓ No registration required ✓ Unlimited problems ✓ Instant results
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default HomeworkAssistantContent;