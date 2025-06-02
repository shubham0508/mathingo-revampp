'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import BlogCard from './BlogCard';
import { sectionFadeIn, staggerContainer } from '@/lib/framer-animations';

export default function BlogCarousel({
    blogs,
    title = "From Our Blog",
    subtitle = "Latest articles and insights from our team."
}) {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, []);

    if (!blogs || blogs.length === 0) {
        return null;
    }

    return (
        <motion.section
            ref={sectionRef}
            className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900"
            initial="initial"
            animate={isVisible ? "animate" : "initial"}
            variants={sectionFadeIn}
        >
            <div className="container mx-auto px-4">
                <motion.div className="text-center mb-8 md:mb-12" variants={sectionFadeIn}>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
                    <p className="text-md md:text-lg text-gray-600 dark:text-gray-300">{subtitle}</p>
                </motion.div>

                <motion.div
                    className="relative"
                    variants={staggerContainer}
                >
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        spaceBetween={24}
                        slidesPerView={1}
                        loop={blogs.length > 2}
                        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        pagination={{ clickable: true, el: '.swiper-custom-pagination-carousel' }}
                        navigation={{
                            nextEl: '.swiper-button-next-carousel',
                            prevEl: '.swiper-button-prev-carousel',
                        }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="pb-16"
                    >
                        {blogs.map((blog) => (
                            <SwiperSlide key={blog.slug} className="h-full">
                                <BlogCard blog={blog} animate={false} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="swiper-button-prev-carousel group absolute top-1/2 -translate-y-1/2 left-0 z-10 p-2 bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-700 rounded-full shadow-md cursor-pointer text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all md:left-[-12px] flex items-center justify-center">
                        <ChevronLeft size={28} />
                    </div>
                    <div className="swiper-button-next-carousel group absolute top-1/2 -translate-y-1/2 right-0 z-10 p-2 bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-700 rounded-full shadow-md cursor-pointer text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all md:right-[-12px] flex items-center justify-center">
                        <ChevronRight size={28} />
                    </div>

                    <div className="swiper-custom-pagination-carousel text-center mt-6 flex justify-center space-x-2">
                        {/* Bullets will be rendered here by Swiper */}
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}