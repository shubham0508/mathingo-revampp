'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, FileText, TrendingUp, Clock, Calendar } from 'lucide-react';
import BlogCard from './BlogCard';
import { staggerContainer } from '@/lib/framer-animations';
import { getAllBlogs } from '@/lib/blogService';
import { Skeleton } from '../ui/skeleton';

function BlogSkeletonCard() {
    return (
        <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Skeleton className="h-48 md:h-56 w-full" />
            <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-5/6 mb-4" />
                <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-3 w-1/5" />
                </div>
            </div>
        </motion.div>
    );
}

function EmptyState() {
    const icons = [BookOpen, FileText, TrendingUp, Search];

    return (
        <motion.div
            className="flex flex-col items-center justify-center py-16 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <motion.div
                className="relative mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>

                {icons.slice(1).map((Icon, index) => (
                    <motion.div
                        key={index}
                        className="absolute"
                        style={{
                            top: index === 0 ? '-10px' : index === 1 ? '60px' : '20px',
                            left: index === 0 ? '60px' : index === 1 ? '-10px' : '70px',
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0.6, scale: 1 }}
                        transition={{
                            duration: 0.4,
                            delay: 0.6 + index * 0.1,
                            repeat: Infinity,
                            repeatType: "reverse",
                            repeatDelay: 2
                        }}
                    >
                        <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center">
                            <Icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.h3
                className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                No Blog Posts Yet
            </motion.h3>

            <motion.p
                className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
            >
                We're working on creating amazing content for you. Check back soon for insightful articles and updates!
            </motion.p>

            <motion.div
                className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
            >
                <Clock className="w-4 h-4" />
                <span>New posts coming soon</span>
            </motion.div>
        </motion.div>
    );
}

function LoadingIndicator() {
    return (
        <motion.div
            className="flex justify-center items-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="flex items-center space-x-3">
                <motion.div
                    className="w-2 h-2 bg-blue-600 rounded-full"
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                    className="w-2 h-2 bg-blue-600 rounded-full"
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                    className="w-2 h-2 bg-blue-600 rounded-full"
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
            </div>
        </motion.div>
    );
}

export default function BlogList({ initialBlogs, initialHasMore, initialTotal }) {
    const [blogs, setBlogs] = useState(initialBlogs || []);
    const [page, setPage] = useState(2);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [isLoading, setIsLoading] = useState(false);
    const loaderRef = useRef(null);

    const loadMoreBlogs = useCallback(async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 700));
            const { blogs: newBlogs, hasMore: newHasMore } = getAllBlogs(page, 6);

            setBlogs(prev => [...prev, ...newBlogs]);
            setPage(prev => prev + 1);
            setHasMore(newHasMore);
        } catch (error) {
            console.error("Failed to load more blogs:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, hasMore, isLoading]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMoreBlogs();
                }
            },
            { threshold: 0.5, rootMargin: "0px 0px 200px 0px" }
        );

        const currentLoaderRef = loaderRef.current;
        if (currentLoaderRef) {
            observer.observe(currentLoaderRef);
        }

        return () => {
            if (currentLoaderRef) {
                observer.unobserve(currentLoaderRef);
            }
        };
    }, [loadMoreBlogs, hasMore, isLoading]);

    const getGridClass = () => {
        if (blogs.length === 0) return '';
        if (blogs.length === 1) return 'grid-cols-1 max-w-md mx-auto';
        if (blogs.length === 2) return 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto';
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    };

    if (blogs.length === 0 && !isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 md:py-12">
                <EmptyState />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">            
            <motion.div
                className={`grid gap-8 ${getGridClass()}`}
                variants={staggerContainer}
                initial="initial"
                animate="animate"
            >
                <AnimatePresence mode="popLayout">
                    {blogs.map((blog, index) => (
                        <motion.div
                            key={blog.slug}
                            layout
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                layout: { duration: 0.3 }
                            }}
                        >
                            <BlogCard blog={blog} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {[...Array(3)].map((_, i) => (
                            <BlogSkeletonCard key={`skeleton-${i}`} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div ref={loaderRef} className="h-10" />

            <AnimatePresence>
                {isLoading && <LoadingIndicator />}
            </AnimatePresence>

            {!hasMore && blogs.length > 0 && (
                <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-400">
                        <BookOpen className="w-4 h-4" />
                        <span>You've reached the end of our blog posts</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
}