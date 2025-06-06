'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqData = [
  {
    question: 'What types of math problems can MathzAI solve?',
    content:
      'MathzAI supports a wide range of math topics including algebra, calculus, geometry, trigonometry, statistics, and word problems. Whether it’s a simple equation or a complex multi-step problem, MathzAI can guide you through it.',
  },
  {
    question: 'Can MathzAI check my own solution step-by-step?',
    content:
      'Yes! With our Step-by-Step Concept (SSC) feature, you can upload your handwritten or typed solution, and MathzAI will verify each step for accuracy. If there’s a mistake, we’ll highlight it and guide you to the correct approach.',
  },
  {
    question: 'How does the AI Tutor in MathzAI help students?',
    content:
      'Our AI Tutor acts like a personal coach. It offers interactive guidance, explains concepts clearly, and helps students solve problems in real time — even with voice support. It’s like having a private tutor available 24/7.',
  },
  {
    question: 'Is MathzAI free to use?',
    content:
      'MathzAI offers both free and premium plans. You can try many core features at no cost. To unlock advanced tools like the AI Tutor, detailed solutions, and audio walkthroughs, you can subscribe to one of our affordable plans.',
  },
  {
    question: 'Can I try MathzAI before subscribing?',
    content:
      'Absolutely! We offer a free trial where you can solve math questions, check your steps, and explore the AI tutor. No credit card required.',
  },
  {
    question: 'Is MathzAI compatible with all devices?',
    content:
      'Yes. MathzAI works seamlessly across desktops, tablets, and mobile devices. It’s optimized for all modern browsers and supports touch input for stylus-based math solving.',
  },
  {
    question: 'Can I draw or upload handwritten solutions?',
    content:
      'Yes! You can either type your solution or use our stylus/drawing feature to submit handwritten answers. MathzAI uses advanced recognition to understand and evaluate your input.',
  },
  {
    question: 'Is MathzAI suitable for school and competitive exams?',
    content:
      'Definitely. MathzAI is ideal for students from middle school to college and those preparing for exams like SAT, ACT, JEE, CBSE Boards, and more. Our explanations align with curriculum standards.',
  },
  {
    question: 'How accurate are the solutions provided by MathzAI?',
    content:
      'Our solutions are powered by AI trained on thousands of verified problem-solving patterns. Each answer is cross-checked for correctness and educational clarity.',
  },
  {
    question: 'Do you offer support if I get stuck?',
    content:
      'Yes. You can reach out via our support chat or email for help. For deeper assistance, our AI tutor can walk you through the steps with real-time guidance.',
  },
];


const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FAQs = () => {
  const faqRef = useRef(null);
  const [isFaqVisible, setIsFaqVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState(5);

  const handleShowMore = () => {
    setVisibleItems(faqData.length);
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === faqRef.current && entry.isIntersecting) {
          setIsFaqVisible(true);
        }
      });
    }, observerOptions);

    if (faqRef.current) observer.observe(faqRef.current);

    return () => {
      if (faqRef.current) observer.unobserve(faqRef.current);
    };
  }, []);

  return (
    <motion.div
      ref={faqRef}
      className="mx-auto max-w-3xl w-full flex flex-col items-center px-4 py-12 font-avenir"
      initial="hidden"
      animate={isFaqVisible ? 'visible' : 'hidden'}
      variants={staggerChildren}
    >
      <motion.h2
        className="bg-gradient-secondary bg-clip-text headingmd !text-transparent font-roca"
        variants={fadeInUp}
      >
        FAQ's
      </motion.h2>

      <div className="w-full mt-10">
        <Accordion type="single" collapsible className="w-full">
          {faqData.slice(0, visibleItems).map((item, i) => (
            <motion.div
              key={`faq-item-${i}`}
              variants={fadeInUp}
              className="mb-4"
            >
              <AccordionItem
                value={`item-${i}`}
                className="border-b border-gray-200"
              >
                <AccordionTrigger className="py-4 flex justify-between w-full text-left">
                  <span className="text-black text-lg pr-8">
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-1 text-gray-800 text-lg">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>

      {visibleItems < faqData.length && (
        <motion.div
          className="mt-4 w-full flex justify-start"
          variants={fadeInUp}
        >
          <button
            className="text-primary hover:text-blue-700 font-medium underline text-lg"
            onClick={handleShowMore}
          >
            Show More
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FAQs;
