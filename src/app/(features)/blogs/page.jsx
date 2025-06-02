'use client';

import Head from 'next/head';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Sparkles, Users } from 'lucide-react';
import { getAllBlogs } from '@/lib/blogService';
import BlogList from '@/components/blog/BlogList';

const BLOGS_PER_PAGE = 6;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut'
        }
    }
};

const floatingIconVariants = {
    animate: {
        y: [-10, 10, -10],
        rotate: [0, 5, -5, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

export default function BlogsPage() {
    const { blogs: initialBlogs, hasMore: initialHasMore, total: initialTotal } = getAllBlogs(1, BLOGS_PER_PAGE);

    return (
        <>
            <Head>
                <title>Our Blog - Latest Articles and Insights | Expert Knowledge Hub</title>
                <meta name="description" content="Discover insightful articles, expert opinions, and latest trends in our comprehensive blog. Stay informed with our regularly updated content covering technology, innovation, and industry insights." />
                <meta property="og:title" content="Our Blog - Latest Articles and Insights | Expert Knowledge Hub" />
                <meta property="og:description" content="Discover insightful articles, expert opinions, and latest trends in our comprehensive blog. Stay informed with our regularly updated content." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://www.mathzai.com/images/blog-og-image.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Our Blog - Latest Articles and Insights" />
                <meta name="twitter:description" content="Discover insightful articles, expert opinions, and latest trends in our comprehensive blog." />
                <link rel="canonical" href="https://www.mathzai.com/blogs" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Blog",
                            "name": "MathZAI Blog",
                            "description": "Expert insights and articles on technology, innovation, and industry trends",
                            "url": "https://www.mathzai.com/blogs",
                            "publisher": {
                                "@type": "Organization",
                                "name": "MathZAI",
                                "url": "https://www.mathzai.com"
                            },
                            "blogPost": initialBlogs?.map(blog => ({
                                "@type": "BlogPosting",
                                "headline": blog.title,
                                "description": blog.excerpt,
                                "url": `https://www.mathzai.com/blogs/${blog.slug}`,
                                "datePublished": blog.publishedDate,
                                "author": {
                                    "@type": "Organization",
                                    "name": "MathZAI"
                                }
                            })) || []
                        })
                    }}
                />
            </Head>

            <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/10">

                <motion.section
                    className="relative py-16 md:py-24 overflow-hidden"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-xl" variants={floatingIconVariants} animate="animate" />
                        <motion.div className="absolute top-20 right-20 w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-xl" variants={floatingIconVariants} animate="animate" style={{ animationDelay: '1s' }} />
                        <motion.div className="absolute bottom-20 left-20 w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full blur-xl" variants={floatingIconVariants} animate="animate" style={{ animationDelay: '2s' }} />
                    </div>

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <motion.div className="mb-6" variants={itemVariants}>
                            <motion.div
                                className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Knowledge Hub</span>
                            </motion.div>
                            <h1 className="bg-gradient-secondary bg-clip-text text-transparent font-black text-4xl md:text-6xl lg:text-7xl mb-4 font-roca leading-tight h-24">
                                Our Blogs
                            </h1>
                        </motion.div>

                        <motion.h2
                            variants={itemVariants}
                            className="text-heading-ha text-xl md:text-2xl font-semibold mb-6 max-w-3xl mx-auto leading-relaxed"
                        >
                            Dive into our collection of insightful articles, expert opinions, and the latest industry trends
                        </motion.h2>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap justify-center items-center gap-8 mb-8"
                        >
                            <motion.div
                                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
                                whileHover={{ scale: 1.05, color: '#3B82F6' }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <BookOpen className="w-5 h-5" />
                                <span className="font-medium">{initialTotal || 0}+ Articles</span>
                            </motion.div>

                            <motion.div
                                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
                                whileHover={{ scale: 1.05, color: '#10B981' }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <TrendingUp className="w-5 h-5" />
                                <span className="font-medium">Updated Weekly</span>
                            </motion.div>

                            <motion.div
                                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
                                whileHover={{ scale: 1.05, color: '#8B5CF6' }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Users className="w-5 h-5" />
                                <span className="font-medium">Expert Authors</span>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap justify-center gap-4"
                        >
                            <motion.button
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => document.getElementById('blog-content')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <span>Explore Articles</span>
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.section>

                <section id="blog-content" className="container mx-auto px-4 pb-16">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={itemVariants}
                    >
                        <BlogList
                            initialBlogs={initialBlogs}
                            initialHasMore={initialHasMore}
                            initialTotal={initialTotal}
                        />
                    </motion.div>
                </section>
            </main>
        </>
    );
}
