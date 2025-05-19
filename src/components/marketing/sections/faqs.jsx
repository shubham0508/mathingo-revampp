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
    question: 'What kind of maths problems do MathzAI solve?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Our expert team is always available to provide detailed guidance and support for all your mathematical challenges.',
  },
  {
    question: 'Can MathzAI verify my solution for the given problem?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Our expert team is always available to provide detailed guidance and support for all your mathematical challenges.',
  },
  {
    question: 'How does the personalised AI Tutor in Mathz AI work?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Our expert team is always available to provide detailed guidance and support for all your mathematical challenges.',
  },
  {
    question: 'Is Mathz AI compatible across multiple devices?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Our expert team is always available to provide detailed guidance and support for all your mathematical challenges.',
  },
  {
    question: 'How accurate are the solutions provided by Mathzai?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Our expert team is always available to provide detailed guidance and support for all your mathematical challenges.',
  },
  {
    question: 'Is there any customer support available?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Our expert team is always available to provide detailed guidance and support for all your mathematical challenges.',
  },
  {
    question: 'Do you offer any subscription plans?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Our expert team is always available to provide detailed guidance and support for all your mathematical challenges.',
  },
  {
    question: 'Can I try MathzAI before purchasing?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Our expert team is always available to provide detailed guidance and support for all your mathematical challenges.',
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
      className="mx-auto max-w-3xl w-full flex flex-col items-center px-4 py-12"
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
