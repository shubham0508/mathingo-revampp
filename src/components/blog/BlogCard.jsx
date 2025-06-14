'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 30,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    },
    hover: {
        y: -8,
        scale: 1.02,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

const imageVariants = {
    hover: {
        scale: 1.1,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const contentVariants = {
    hover: {
        y: -2,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

const arrowVariants = {
    rest: { x: 0, opacity: 0 },
    hover: {
        x: 5,
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

export default function BlogCard({ blog, animate = true }) {
    if (!blog) return null;

    return (
        <motion.div
            variants={animate ? cardVariants : undefined}
            initial={animate ? "hidden" : undefined}
            animate={animate ? "visible" : undefined}
            whileHover="hover"
            className="h-full group"
        >
            <Link href={`/blogs/${blog.slug}`} legacyBehavior>
                <a className="block h-full">
                    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:border-blue-200">
                        <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                            <motion.div variants={imageVariants} className="w-full h-full">
                                <Image
                                    src={blog.coverImage || '/placeholder-images/default.webp'}
                                    alt={blog.title || 'Blog post cover image'}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    style={{ objectFit: 'cover' }}
                                    className="transition-all duration-500"
                                    priority={false}
                                />
                            </motion.div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        <motion.div
                            variants={contentVariants}
                            className="p-6 flex flex-col flex-grow"
                        >
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                                <motion.div
                                    className="flex items-center space-x-1"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Calendar className="w-3 h-3" />
                                    <span>{blog.publishedDate}</span>
                                </motion.div>
                                <motion.div
                                    className="flex items-center space-x-1"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Clock className="w-3 h-3" />
                                    <span>{blog.readTime}</span>
                                </motion.div>
                            </div>

                            <motion.h3
                                className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300"
                                layoutId={`title-${blog.slug}`}
                            >
                                {blog.title}
                            </motion.h3>

                            <motion.p
                                className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed"
                                layoutId={`excerpt-${blog.slug}`}
                            >
                                {blog.excerpt}
                            </motion.p>
                        </motion.div>
                    </article>
                </a>
            </Link>
        </motion.div>
    );
}