'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogCard from '@/components/blog/BlogCard';

export default function RelatedBlogSection({ relatedBlogs = [] }) {
  const swiperRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const sectionRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

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

  if (!relatedBlogs || relatedBlogs.length === 0) {
    return null;
  }

  return (
    <div
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center w-full py-6 px-4 md:px-6 lg:px-8"
    >
      <motion.div
        className="w-full md:w-5/6 lg:w-4/5 flex flex-col items-center h-full"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeInUp}
      >
        <motion.div className="flex flex-col items-center" variants={fadeInUp}>
          <motion.h2
            className="bg-gradient-secondary bg-clip-text text-2xl md:headingmd !text-transparent font-roca text-center h-12"
            variants={fadeInUp}
          >
            Related Blog Posts
          </motion.h2>

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
                spaceBetween={24}
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
                {relatedBlogs.map((blog) => (
                  <SwiperSlide key={blog.slug}>
                    <motion.div
                      className="h-full"
                      whileHover={{
                        y: -8,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <BlogCard blog={blog} animate={isVisible} />
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

          {/* Mobile navigation buttons */}
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