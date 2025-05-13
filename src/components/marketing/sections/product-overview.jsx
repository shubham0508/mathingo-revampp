'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { ArrowRightCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import RelatedBlogSection from './blogs-section';
import { motion } from 'framer-motion';

const accordionData = [
  {
    whatkindofOne: 'What kind of maths problem do MathzAI solve?',
    canmathzaiOne: 'Can MathzAI verify my solution for the given problem?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Our expert team is always available to provide detailed guidance and support for all your mathematical challenges.',
  },
  {
    whatkindofOne: 'How to get started with MathzAI?',
    canmathzaiOne: 'What subjects are covered by MathzAI?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Our expert team is always available to provide detailed guidance and support for all your mathematical challenges.',
  },
  {
    whatkindofOne: 'How does the personalised AI Tutor in Mathz AI work?',
    canmathzaiOne: 'Is Mathz AI compatible across multiple devices?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Our expert team is always available to provide detailed guidance and support for all your mathematical challenges.',
  },
  {
    whatkindofOne: 'Do you offer any subscription plans?',
    canmathzaiOne: 'Can I try MathzAI before purchasing?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Our expert team is always available to provide detailed guidance and support for all your mathematical challenges.',
  },
  {
    whatkindofOne: 'How accurate are the solutions provided by Mathzai?',
    canmathzaiOne: 'Is there any customer support available?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Our expert team is always available to provide detailed guidance and support for all your mathematical challenges.',
  },
];

const testimonials = [
  {
    text: 'My son used to panic over math homework. Now, with MathzAI, he feels confident and finishes on time — without tears or tantrums.',
    author: 'Jordan M., Parent of a 9th Grader',
    bgColor: 'bg-yellow-100',
    quoteColor: 'bg-amber-200',
  },
  {
    text: 'My son used to panic over math homework. Now, with MathzAI, he feels confident and finishes on time — without tears or tantrums.',
    author: 'Jordan M., Parent of a 9th Grader',
    bgColor: 'bg-red-50',
    quoteColor: 'bg-deep_orange-100',
  },
  {
    text: 'MathzAI has transformed our approach to math education. Students are more engaged and their test scores have improved significantly.',
    author: 'Sarah J., High School Teacher',
    bgColor: 'bg-blue-50',
    quoteColor: 'bg-blue-200',
  },
  {
    text: 'As a college student, MathzAI helps me tackle complex calculus problems with step-by-step solutions that actually make sense.',
    author: 'Aiden T., College Student',
    bgColor: 'bg-green-50',
    quoteColor: 'bg-green-200',
  },
];

export default function LANDINGPAGEEightPage() {
  const [sliderState, setSliderState] = useState(0);
  const testimonialSwiperRef = useRef(null);
  const [chipOptions] = useState(() => [
    { value: 1, label: `Calculus` },
    { value: 2, label: `Algebra` },
    { value: 3, label: `Geometry` },
    { value: 4, label: `More Topics` },
  ]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  // Handle animations when components come into view
  const [isTestimonialsVisible, setIsTestimonialsVisible] = useState(false);
  const [isBlogsVisible, setIsBlogsVisible] = useState(false);
  const [isFaqVisible, setIsFaqVisible] = useState(false);

  const testimonialsRef = useRef(null);
  const blogsRef = useRef(null);
  const faqRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === testimonialsRef.current && entry.isIntersecting) {
          setIsTestimonialsVisible(true);
        }
        if (entry.target === blogsRef.current && entry.isIntersecting) {
          setIsBlogsVisible(true);
        }
        if (entry.target === faqRef.current && entry.isIntersecting) {
          setIsFaqVisible(true);
        }
      });
    }, observerOptions);

    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    if (blogsRef.current) observer.observe(blogsRef.current);
    if (faqRef.current) observer.observe(faqRef.current);

    return () => {
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current);
      if (blogsRef.current) observer.unobserve(blogsRef.current);
      if (faqRef.current) observer.unobserve(faqRef.current);
    };
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <motion.div
        className="flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <motion.div className="mt-10 flex flex-row gap-1.5" variants={fadeInUp}>
          <h2 className="bg-gradient-secondary bg-clip-text headingmd !text-transparent font-roca">
            Problems Solved. Hearts Won.
          </h2>
          <h2 className="headingmd">😊</h2>
        </motion.div>

        <div className="relative mt-16 w-full">
          <div
            className="absolute top-56 w-full h-full bg-[url(/images/icons/blog-bg-lp.png)] bg-cover bg-no-repeat"
            style={{ zIndex: 0 }}
          >
            <motion.div
              className="absolute bottom-10 w-16 h-16 rounded-full bg-gray-600 opacity-40"
              animate={{
                x: [0, -20, 0],
                y: [0, -30, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 2,
              }}
            />
          </div>

          <motion.div
            ref={testimonialsRef}
            className="container mx-auto px-4 relative z-10"
            initial="hidden"
            animate={isTestimonialsVisible ? 'visible' : 'hidden'}
            variants={fadeIn}
          >
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              spaceBetween={20}
              slidesPerView={1}
              onSlideChange={(swiper) => setSliderState(swiper.realIndex)}
              onSwiper={(swiper) => {
                testimonialSwiperRef.current = swiper;
              }}
              className="w-2/3"
            >
              <SwiperSlide>
                <div className="flex flex-row gap-6 justify-center items-center">
                  <motion.div
                    className={`flex w-1/2 flex-col items-center gap-4 ${testimonials[0].bgColor} p-6 rounded-lg shadow-md px-12`}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <div
                      className={`flex flex-col items-center rounded-3xl ${testimonials[0].quoteColor} px-4 py-2`}
                    >
                      <span className="text-2xl">❝</span>
                    </div>
                    <p className="text-center text-lg font-medium leading-relaxed text-black">
                      "{testimonials[0].text}"
                    </p>
                    <p className="text-lg font-medium">
                      — {testimonials[0].author}
                    </p>
                  </motion.div>

                  <motion.div
                    className={`flex w-1/2 flex-col items-center gap-4 ${testimonials[1].bgColor} p-6 rounded-lg shadow-md`}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <div
                      className={`flex flex-col items-center rounded-3xl ${testimonials[1].quoteColor} p-4`}
                    >
                      <span className="text-2xl">❝</span>
                    </div>
                    <p className="text-center text-lg font-medium leading-relaxed text-black-900/80">
                      "{testimonials[1].text}"
                    </p>
                    <p className="text-lg font-medium">
                      — {testimonials[1].author}
                    </p>
                  </motion.div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="flex flex-row gap-6 justify-center items-center">
                  <motion.div
                    className={`flex w-1/2 flex-col items-center gap-4 ${testimonials[2].bgColor} p-6 rounded-lg shadow-md`}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <div
                      className={`flex flex-col items-center rounded-3xl ${testimonials[2].quoteColor} p-4`}
                    >
                      <span className="text-2xl">❝</span>
                    </div>
                    <p className="text-center text-lg font-medium leading-relaxed text-black-900/80">
                      "{testimonials[2].text}"
                    </p>
                    <p className="text-lg font-medium">
                      — {testimonials[2].author}
                    </p>
                  </motion.div>

                  <motion.div
                    className={`flex w-1/2 flex-col items-center gap-4 ${testimonials[3].bgColor} p-6 rounded-lg shadow-md`}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <div
                      className={`flex flex-col items-center rounded-3xl ${testimonials[3].quoteColor} p-4`}
                    >
                      <span className="text-2xl">❝</span>
                    </div>
                    <p className="text-center text-lg font-medium leading-relaxed text-black-900/80">
                      "{testimonials[3].text}"
                    </p>
                    <p className="text-lg font-medium">
                      — {testimonials[3].author}
                    </p>
                  </motion.div>
                </div>
              </SwiperSlide>
            </Swiper>

            <div className="mt-6 flex justify-center space-x-2">
              {[0, 1].map((index) => (
                <motion.button
                  key={`dot-${index}`}
                  onClick={() => testimonialSwiperRef.current?.slideTo(index)}
                  className={`h-2 w-2 rounded-full ${
                    sliderState === index ? 'bg-black' : 'bg-[#C9CCE0]'
                  }`}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <motion.div
              className="absolute right-40 top-1/2 transform -translate-y-1/2 z-20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div
                variant="ghost"
                size="icon"
                onClick={() => testimonialSwiperRef.current?.slideNext()}
                className="text-gray-600 hover:text-primary transition-all duration-200 cursor-pointer"
                aria-label="Next testimonial"
              >
                <ArrowRightCircle className="w-7 h-7" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            ref={blogsRef}
            className="container mx-auto relative z-10 mt-24"
            initial="hidden"
            animate={isBlogsVisible ? 'visible' : 'hidden'}
            variants={fadeIn}
          >
            <RelatedBlogSection />
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div
        ref={faqRef}
        className="mx-auto w-full h-full flex flex-col items-center gap-12 px-16 mt-64"
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

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {accordionData.map((item, i) => (
            <motion.div
              key={`faq-container-${i}`}
              variants={fadeInUp}
              whileHover={{ scale: 1.01 }}
            >
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  value={`item-${i}`}
                  className="border border-gray-200 rounded-lg px-4 h-auto shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <AccordionTrigger className="py-4">
                    <div className="flex flex-col text-left w-full">
                      <h3 className="text-lg font-medium">
                        {item.whatkindofOne}
                      </h3>
                      {item.canmathzaiOne && (
                        <h4 className="font-medium text-gray-600">
                          {item.canmathzaiOne}
                        </h4>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <motion.div
                      className="pt-2 pl-6 pb-4"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-700">{item.content}</p>
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
