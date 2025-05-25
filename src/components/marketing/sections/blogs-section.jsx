'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { ArrowRightCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RelatedBlogSection() {
  const swiperRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const sectionRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Set initial window width
    setWindowWidth(window.innerWidth);

    // Update window width on resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // IntersectionObserver setup
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Enhanced animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const staggerCards = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      }
    }
  };

  const cardAnimation = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12
      }
    }
  };

  const scaleUp = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.3 } }
  };

  const blogs = [
    {
      id: 1,
      title: 'Mastering Calculus: Step-by-Step Approaches',
      excerpt:
        'Learn the fundamentals of calculus with our comprehensive guide.',
    },
    {
      id: 2,
      title: 'Algebra Made Easy: Solving Complex Equations',
      excerpt:
        'Simplify complex algebra problems with these proven techniques.',
    },
    {
      id: 3,
      title: 'Geometry Principles for High School Students',
      excerpt:
        'Essential geometry concepts every high school student should know.',
    },
    {
      id: 4,
      title: 'Statistics Fundamentals: Understanding Data Analysis',
      excerpt:
        'Master the basics of statistical analysis for better decision making.',
    },
    {
      id: 5,
      title: 'Trigonometry: Applications in Real Life',
      excerpt:
        'Discover how trigonometry is used in various everyday scenarios.',
    },
    {
      id: 6,
      title: 'Preparing for Math Competitions: Expert Tips',
      excerpt: 'Strategies and tips to excel in mathematics competitions.',
    },
  ];

  const getSlidesPerView = () => {
    if (windowWidth < 640) return 1;
    if (windowWidth < 1024) return 2;
    return 3;
  };

  const nextSlide = () => {
    swiperRef.current?.slideNext();
  };

  const prevSlide = () => {
    swiperRef.current?.slidePrev();
  };

  return (
    <div
      ref={sectionRef}
      className="flex flex-col items-center justify-center w-full py-6 px-4 md:px-6 lg:px-8"
    >
      <motion.div
        className="w-full md:w-5/6 lg:w-4/5 flex flex-col items-center h-full"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeInUp}
      >
        <motion.div className="flex flex-col items-center" variants={fadeInUp}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full flex"
          >
            <motion.h2
              className="bg-gradient-secondary bg-clip-text text-2xl md:headingmd !text-transparent font-roca text-center h-12"
              variants={fadeInUp}
            >
              Related Blog Posts
            </motion.h2>
          </motion.div>

          <motion.p
            className="mt-5 md:mt-5 lg:mt-6 text-base md:text-lg font-normal text-center text-gray-700 max-w-2xl"
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
          >
            From confusion to clarity — one blog at a time.
          </motion.p>
        </motion.div>

        <div className="w-full mt-8 md:mt-10 lg:mt-12 relative">
          <AnimatePresence>
            <motion.div
              variants={staggerCards}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              className="w-full"
            >
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true
                }}
                pagination={{
                  el: '.blog-pagination',
                  clickable: true,
                  renderBullet: (index, className) => {
                    return `<span class="${className} w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full transition-all duration-300"></span>`;
                  },
                }}
                loop={true}
                spaceBetween={20}
                slidesPerView={getSlidesPerView()}
                breakpoints={{
                  0: { slidesPerView: 1, spaceBetween: 16 },
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                }}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  setTotalSlides(swiper.slides.length - swiper.loopedSlides * 2);
                }}
                onSlideChange={(swiper) => {
                  setActiveIndex(swiper.realIndex);
                }}
                className="w-full pb-14"
              >
                {blogs.map((blog) => (
                  <SwiperSlide key={blog.id}>
                    <motion.div
                      className="border border-gray-200 bg-white shadow-md h-full rounded-lg transition-all duration-300 p-4 md:p-6 flex flex-col"
                      variants={cardAnimation}
                      whileHover={{
                        y: -8,
                        boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                        transition: { duration: 0.3 }
                      }}
                    >
                      <motion.div
                        className="h-32 md:h-40 lg:h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-md mb-4 overflow-hidden relative"
                        whileHover={{
                          scale: 1.03,
                          transition: { duration: 0.3 }
                        }}
                      >
                        <div className="w-full h-full relative">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 opacity-70"
                            animate={{
                              backgroundPosition: ["0% 0%", "100% 100%"],
                              transition: {
                                duration: 10,
                                repeat: Infinity,
                                repeatType: "reverse"
                              }
                            }}
                          />
                          <motion.div
                            className="absolute inset-0 opacity-30"
                            style={{
                              background: "radial-gradient(circle at center, transparent 0%, rgba(59, 130, 246, 0.2) 100%)"
                            }}
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.3, 0.5, 0.3],
                              transition: {
                                duration: 6,
                                repeat: Infinity,
                                repeatType: "reverse"
                              }
                            }}
                          />
                          {/* Decorative Math Elements */}
                          <motion.div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <div className="text-3xl font-bold text-blue-800">
                              {blog.id % 2 === 0 ? '∫f(x)dx' : 'y = mx + b'}
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>

                      <h3 className="text-lg md:text-xl font-semibold text-gray-800 line-clamp-1 mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base line-clamp-2 flex-grow">
                        {blog.excerpt}
                      </p>
                      <div className="mt-4 pt-2 border-t border-gray-100">
                        <motion.button
                          className="text-blue-500 hover:text-blue-700 font-medium text-sm md:text-base flex items-center gap-1 group"
                          whileHover={{ x: 5 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          Read More
                          <motion.span
                            className="inline-block group-hover:translate-x-1 transition-transform"
                            animate={{
                              x: [0, 4, 0],
                              transition: {
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut"
                              }
                            }}
                          >
                            →
                          </motion.span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          </AnimatePresence>

          {/* Custom pagination */}
          <div className="mt-4 flex justify-center items-center gap-2">
            <div className="blog-pagination flex gap-3 justify-center items-center"></div>
          </div>

          <div className="flex justify-center gap-4 mt-4 md:hidden">
            <motion.button
              onClick={prevSlide}
              className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-blue-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
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
        </div>
      </motion.div>

      {/* Desktop Next button */}
      <motion.div
        className="hidden md:block absolute right-5 md:right-10 lg:right-16 top-1/2 transform -translate-y-1/2 z-20"
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: -20 }}
        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div
          onClick={nextSlide}
          className="text-gray-800 hover:text-blue-600 border-4 border-gray-800 transition-all duration-300 cursor-pointer bg-white p-3 rounded-full hover:bg-gray-100"
          aria-label="Next blog"
        >
          <ChevronRight className="w-7 h-7 md:w-7 md:h-7 text-gray-800" />
        </div>
      </motion.div>

      {/* Desktop Prev button */}
      <motion.div
        className="hidden md:block absolute left-5 md:left-10 lg:left-16 top-1/2 transform -translate-y-1/2 z-20"
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: 20 }}
        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div
          onClick={prevSlide}
          className="text-gray-800 hover:text-blue-600 border-4 border-gray-800 transition-all duration-300 cursor-pointer bg-white p-3 rounded-full hover:bg-gray-100" 
          aria-label="Previous blog"
        >
          <ChevronLeft className="w-7 h-7 md:w-7 md:h-7 text-gray-800" />
        </div>
      </motion.div>
    </div>
  );
}