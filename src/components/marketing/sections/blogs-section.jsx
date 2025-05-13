'use client';

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import { ArrowRightCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function RelatedBlogSection() {
  const swiperRef = useRef(null);

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

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <motion.div
        className="w-2/3 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="bg-gradient-secondary bg-clip-text headingmd !text-transparent font-roca">
          Related Blog Posts
        </h2>
        <p className="mt-5 text-lg font-normal text-center text-black">
          From confusion to clarity — one blog at a time.
        </p>

        <div className="w-full mt-10 relative">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            spaceBetween={24}
            slidesPerView={3}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 1 },
              1024: { slidesPerView: 3 },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="w-full"
          >
            {blogs.map((blog) => (
              <SwiperSlide key={blog.id}>
                <motion.div
                  className="border border-gray-200 bg-white shadow-md h-full rounded-lg transition-all duration-300 hover:shadow-lg p-6 flex flex-col"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="h-48 bg-gray-100 rounded-md mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {blog.title}
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                    {blog.excerpt}
                  </p>
                  <div className="mt-auto">
                    <motion.button
                      className="text-blue-500 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                      whileHover={{ x: 3 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      Read More
                      <span className="inline-block">→</span>
                    </motion.button>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-8 flex gap-2">
          <motion.div
            className="h-2 w-2 rounded-full bg-black"
            whileHover={{ scale: 1.5 }}
          ></motion.div>
          <motion.div
            className="h-2 w-2 rounded-full bg-[#C9CCE0]"
            whileHover={{ scale: 1.5 }}
          ></motion.div>
          <motion.div
            className="h-2 w-2 rounded-full bg-[#C9CCE0]"
            whileHover={{ scale: 1.5 }}
          ></motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute right-40 top-[50%] transform -translate-y-1/2 z-20"
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
    </div>
  );
}
