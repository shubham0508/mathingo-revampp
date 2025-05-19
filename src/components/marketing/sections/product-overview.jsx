'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { ArrowRightCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import RelatedBlogSection from './blogs-section';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [windowWidth, setWindowWidth] = useState(0);

  // Enhanced animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.2, ease: "easeInOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12
      }
    }
  };

  const [isTestimonialsVisible, setIsTestimonialsVisible] = useState(false);
  const [isBlogsVisible, setIsBlogsVisible] = useState(false);
  const [isBgImageVisible, setIsBgImageVisible] = useState(false);

  const testimonialsRef = useRef(null);
  const blogsRef = useRef(null);
  const bgImageRef = useRef(null);

  useEffect(() => {
    // Set initial window width
    setWindowWidth(window.innerWidth);

    // Update window width on resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === testimonialsRef.current && entry.isIntersecting) {
          setIsTestimonialsVisible(true);
        }
        if (entry.target === blogsRef.current && entry.isIntersecting) {
          setIsBlogsVisible(true);
        }
        if (entry.target === bgImageRef.current && entry.isIntersecting) {
          setIsBgImageVisible(true);
        }
      });
    }, observerOptions);

    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    if (blogsRef.current) observer.observe(blogsRef.current);
    if (bgImageRef.current) observer.observe(bgImageRef.current);

    return () => {
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current);
      if (blogsRef.current) observer.unobserve(blogsRef.current);
      if (bgImageRef.current) observer.unobserve(bgImageRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const nextSlide = () => {
    testimonialSwiperRef.current?.slideNext();
  };

  const prevSlide = () => {
    testimonialSwiperRef.current?.slidePrev();
  };

  // Use responsive layout based on window width
  const getTestimonialLayout = () => {
    if (windowWidth < 768) {
      // Mobile view - show single testimonials in slides
      return (
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          spaceBetween={20}
          slidesPerView={1}
          effect={windowWidth < 640 ? "fade" : "slide"}
          fadeEffect={{ crossFade: true }}
          pagination={{
            el: '.testimonial-pagination',
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className} w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full transition-all duration-300"></span>`;
            },
          }}
          onSlideChange={(swiper) => setSliderState(swiper.realIndex)}
          onSwiper={(swiper) => {
            testimonialSwiperRef.current = swiper;
          }}
          className="w-full"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={`testimonial-${index}`}>
              <motion.div
                className={`flex w-full flex-col items-center gap-4 ${testimonial.bgColor} p-6 rounded-lg shadow-md`}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div
                  className={`flex flex-col items-center rounded-3xl ${testimonial.quoteColor} px-4 py-2`}
                >
                  <span className="text-2xl md:text-3xl">❝</span>
                </div>
                <p className="text-center text-base md:text-lg font-medium leading-relaxed text-black">
                  "{testimonial.text}"
                </p>
                <p className="text-base md:text-lg font-medium">
                  — {testimonial.author}
                </p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      );
    } else {
      // Tablet/Desktop view - show testimonials in pairs per slide
      return (
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{
            el: '.testimonial-pagination',
            clickable: true,
          }}
          onSlideChange={(swiper) => setSliderState(swiper.realIndex)}
          onSwiper={(swiper) => {
            testimonialSwiperRef.current = swiper;
          }}
          className="w-full md:w-4/5 lg:w-2/3"
        >
          <SwiperSlide>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <motion.div
                className={`flex w-full md:w-1/2 flex-col items-center gap-4 ${testimonials[0].bgColor} p-6 rounded-lg shadow-md`}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div
                  className={`flex flex-col items-center rounded-3xl ${testimonials[0].quoteColor} px-4 py-2`}
                >
                  <span className="text-2xl">❝</span>
                </div>
                <p className="text-center text-base md:text-lg font-medium leading-relaxed text-black">
                  "{testimonials[0].text}"
                </p>
                <p className="text-base md:text-lg font-medium">
                  — {testimonials[0].author}
                </p>
              </motion.div>

              <motion.div
                className={`flex w-full md:w-1/2 flex-col items-center gap-4 ${testimonials[1].bgColor} p-6 rounded-lg shadow-md`}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div
                  className={`flex flex-col items-center rounded-3xl ${testimonials[1].quoteColor} px-4 py-2`}
                >
                  <span className="text-2xl">❝</span>
                </div>
                <p className="text-center text-base md:text-lg font-medium leading-relaxed text-black">
                  "{testimonials[1].text}"
                </p>
                <p className="text-base md:text-lg font-medium">
                  — {testimonials[1].author}
                </p>
              </motion.div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <motion.div
                className={`flex w-full md:w-1/2 flex-col items-center gap-4 ${testimonials[2].bgColor} p-6 rounded-lg shadow-md`}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div
                  className={`flex flex-col items-center rounded-3xl ${testimonials[2].quoteColor} px-4 py-2`}
                >
                  <span className="text-2xl">❝</span>
                </div>
                <p className="text-center text-base md:text-lg font-medium leading-relaxed text-black">
                  "{testimonials[2].text}"
                </p>
                <p className="text-base md:text-lg font-medium">
                  — {testimonials[2].author}
                </p>
              </motion.div>

              <motion.div
                className={`flex w-full md:w-1/2 flex-col items-center gap-4 ${testimonials[3].bgColor} p-6 rounded-lg shadow-md`}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div
                  className={`flex flex-col items-center rounded-3xl ${testimonials[3].quoteColor} px-4 py-2`}
                >
                  <span className="text-2xl">❝</span>
                </div>
                <p className="text-center text-base md:text-lg font-medium leading-relaxed text-black">
                  "{testimonials[3].text}"
                </p>
                <p className="text-base md:text-lg font-medium">
                  — {testimonials[3].author}
                </p>
              </motion.div>
            </div>
          </SwiperSlide>
        </Swiper>
      );
    }
  };

  return (
    <div className="w-full overflow-hidden relative">
      <motion.div
        className="flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <motion.div
          className="mt-6 md:mt-8 lg:mt-10 flex flex-row gap-1.5 px-4 text-center relative"
          variants={fadeInUp}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative inline-block"
          >
            <h2 className="bg-gradient-secondary bg-clip-text text-2xl md:text-3xl lg:text-4xl !text-transparent font-roca">
              Problems Solved. Hearts Won.
            </h2>
          </motion.div>

          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
          >
            😊
          </motion.h2>
        </motion.div>

        <div className="relative mt-8 md:mt-12 lg:mt-16 w-full">
          <motion.div
            ref={bgImageRef}
            className="absolute top-20 md:top-56 w-full h-full bg-[url(/images/icons/blog-bg-lp.png)] bg-cover bg-no-repeat"
            style={{ zIndex: 0 }}
            initial={{ opacity: 0 }}
            animate={isBgImageVisible ? { opacity: [0, 0.2, 0.5, 0.7, 1] } : { opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut", times: [0, 0.2, 0.5, 0.8, 1] }}
          >
            {/* Floating bubble animations */}
            <AnimatePresence>
              {isBgImageVisible && (
                <>
                  <motion.div
                    className="absolute hidden md:block bottom-10 left-1/4 w-16 h-16 rounded-full bg-gray-600 opacity-40"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 0.4,
                      scale: 1,
                      x: [0, -20, 0],
                      y: [0, -30, 0],
                    }}
                    transition={{
                      opacity: { duration: 2 },
                      scale: { duration: 2 },
                      x: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
                      y: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
                      delay: 1,
                    }}
                  />
                  <motion.div
                    className="absolute hidden md:block top-1/3 right-1/4 w-12 h-12 rounded-full bg-blue-400 opacity-20"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 0.2,
                      scale: 1,
                      x: [0, 30, 0],
                      y: [0, -20, 0],
                    }}
                    transition={{
                      opacity: { duration: 2 },
                      scale: { duration: 2 },
                      x: { duration: 15, repeat: Infinity, ease: 'easeInOut' },
                      y: { duration: 15, repeat: Infinity, ease: 'easeInOut' },
                      delay: 0.5,
                    }}
                  />
                  <motion.div
                    className="absolute hidden md:block top-1/2 left-1/3 w-8 h-8 rounded-full bg-green-500 opacity-30"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 0.3,
                      scale: 1,
                      x: [0, 15, 0],
                      y: [0, 25, 0],
                    }}
                    transition={{
                      opacity: { duration: 2 },
                      scale: { duration: 2 },
                      x: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
                      y: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
                      delay: 1.5,
                    }}
                  />
                  {/* Additional floating elements for mobile */}
                  <motion.div
                    className="absolute md:hidden top-40 right-8 w-8 h-8 rounded-full bg-purple-400 opacity-20"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 0.2,
                      scale: 1,
                      x: [0, 15, 0],
                      y: [0, -10, 0],
                    }}
                    transition={{
                      opacity: { duration: 1.5 },
                      scale: { duration: 1.5 },
                      x: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
                      y: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
                      delay: 0.2,
                    }}
                  />
                  <motion.div
                    className="absolute md:hidden bottom-80 left-10 w-6 h-6 rounded-full bg-teal-500 opacity-30"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 0.3,
                      scale: 1,
                      x: [0, -10, 0],
                      y: [0, 15, 0],
                    }}
                    transition={{
                      opacity: { duration: 1.5 },
                      scale: { duration: 1.5 },
                      x: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
                      y: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
                      delay: 0.8,
                    }}
                  />
                </>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            ref={testimonialsRef}
            className="container mx-auto px-4 relative z-10"
            initial="hidden"
            animate={isTestimonialsVisible ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >
            {getTestimonialLayout()}

            {/* Custom pagination indicators */}
            <div className="mt-6 flex justify-center items-center">
              <div className="testimonial-pagination flex gap-3 justify-center items-center"></div>
            </div>

            {/* Navigation buttons for mobile */}
            <div className="mt-4 flex justify-center gap-4 md:hidden">
              <motion.button
                onClick={prevSlide}
                className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-blue-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={nextSlide}
                className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-blue-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Desktop navigation button */}
            <motion.div
              className="absolute hidden md:block right-5 md:right-10 lg:right-20 top-[40%] transform -translate-y-1/2 z-20"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 20 }}
              animate={isTestimonialsVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div
                onClick={nextSlide}
                className="text-gray-800 hover:text-blue-600 border-4 border-gray-800 transition-all duration-300 cursor-pointer bg-white p-3 rounded-full hover:bg-gray-100"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-gray-800" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            ref={blogsRef}
            className="container mx-auto relative z-10 mt-16 md:mt-20 lg:mt-24 mb-16 md:mb-20 lg:mb-24 px-4"
            initial="hidden"
            animate={isBlogsVisible ? 'visible' : 'hidden'}
            variants={fadeIn}
          >
            <RelatedBlogSection />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}