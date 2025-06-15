'use client';

import Head from 'next/head';
import Script from 'next/script';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { BookOpen, TrendingUp, Sparkles, Users, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { allBlogs } from '@/lib/blogService';
import BlogCard from '@/components/blog/BlogCard';
import { siteConfig } from "@/config/site";
import { generateMetadata as generatePageMetadata } from '@/config/seo';
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/seoUtils';

const BLOGS_PER_PAGE = 12;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            staggerChildren: 0.1
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

const blogCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
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

function Pagination({ currentPage, totalPages, onPageChange }) {
    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5;

        if (totalPages <= showPages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                if (totalPages > 5) pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                if (totalPages > 5) pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center space-x-2 mt-12">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                    disabled={page === '...'}
                    className={`px-4 py-2 rounded-lg transition-colors ${page === currentPage
                        ? 'bg-blue-600 text-white'
                        : page === '...'
                            ? 'cursor-default'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}

function SearchBar({ searchTerm, onSearchChange, totalResults }) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="max-w-2xl mx-auto mb-8">
            <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-105' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className={`h-5 w-5 transition-colors ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search blogs by title, keywords, or tags..."
                    className="block w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                {searchTerm && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
            {searchTerm && (
                <div className="mt-2 text-center text-gray-600">
                    Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{searchTerm}"
                </div>
            )}
        </div>
    );
}

export default function BlogsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredBlogs = useMemo(() => {
        if (!searchTerm.trim()) return allBlogs;

        const searchLower = searchTerm.toLowerCase();
        return allBlogs.filter(blog => {
            const titleMatch = blog.title?.toLowerCase().includes(searchLower);
            const excerptMatch = blog.excerpt?.toLowerCase().includes(searchLower);
            const tagsMatch = blog.tags?.some(tag => tag.toLowerCase().includes(searchLower));
            const authorMatch = blog.author?.name?.toLowerCase().includes(searchLower);

            return titleMatch || excerptMatch || tagsMatch || authorMatch;
        });
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE);
    const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
    const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + BLOGS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const pageUrl = `${siteConfig.url}/blogs`;
    const metadata = generatePageMetadata({
        title: "Our Blog - Latest Articles and Insights",
        description: "Discover insightful articles, expert opinions, and latest trends in our comprehensive MathZAI blog. Stay informed with our regularly updated content.",
        url: pageUrl,
        image: `${siteConfig.url}/images/og-image.png`
    });

    const blogSchema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": `${siteConfig.name} Blog`,
        "description": "Expert insights and articles on technology, innovation, and industry trends from MathZAI",
        "url": pageUrl,
        "image": metadata.openGraph.images[0].url,
        "publisher": createOrganizationSchema(),
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": pageUrl
        },
        "blogPost": allBlogs?.map(blog => {
            const postUrl = `${siteConfig.url}/blogs/${blog.slug}`;
            const authorSchema = blog.author && blog.author.name ? {
                "@type": blog.author.type || "Person",
                "name": blog.author.name,
                ...(blog.author.url && { "url": blog.author.url })
            } : createOrganizationSchema();

            return {
                "@type": "BlogPosting",
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": postUrl
                },
                "headline": blog.title,
                "name": blog.title,
                "description": blog.excerpt,
                "image": blog.coverImage ? (blog.coverImage.startsWith('http') ? blog.coverImage : `${siteConfig.url}${blog.coverImage}`) : metadata.openGraph.images[0].url,
                "url": postUrl,
                "datePublished": new Date(blog.publishedDate).toISOString(),
                "dateModified": new Date(blog.modifiedDate || blog.publishedDate).toISOString(),
                "author": authorSchema,
                "publisher": createOrganizationSchema()
            };
        }) || []
    };

    return (
        <>
            <Head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                <meta property="og:type" content={metadata.openGraph.type} />
                <meta property="og:locale" content={metadata.openGraph.locale} />
                <meta property="og:url" content={metadata.openGraph.url} />
                <meta property="og:title" content={metadata.openGraph.title} />
                <meta property="og:description" content={metadata.openGraph.description} />
                <meta property="og:site_name" content={metadata.openGraph.siteName} />
                <meta property="og:image" content={metadata.openGraph.images[0].url} />
                <meta property="og:image:width" content={String(metadata.openGraph.images[0].width)} />
                <meta property="og:image:height" content={String(metadata.openGraph.images[0].height)} />
                <meta property="og:image:alt" content={metadata.openGraph.images[0].alt} />

                <meta name="twitter:card" content={metadata.twitter.card} />
                <meta name="twitter:title" content={metadata.twitter.title} />
                <meta name="twitter:description" content={metadata.twitter.description} />
                <meta name="twitter:image" content={metadata.twitter.images[0]} />
                <meta name="twitter:creator" content={metadata.twitter.creator} />

                <link rel="canonical" href={metadata.alternates.canonical} />
            </Head>
            <Script
                id="blog-list-schema"
                type="application/ld+json"
                strategy="afterInteractive"
            >
                {JSON.stringify(blogSchema)}
            </Script>
            <Script
                id="website-schema-blogs"
                type="application/ld+json"
                strategy="afterInteractive"
            >
                {JSON.stringify(createWebsiteSchema())}
            </Script>

            <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
                <motion.section
                    className="relative py-6 overflow-hidden"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 rounded-full blur-xl" variants={floatingIconVariants} animate="animate" />
                        <motion.div className="absolute top-20 right-20 w-16 h-16 bg-purple-100 rounded-full blur-xl" variants={floatingIconVariants} animate="animate" style={{ animationDelay: '1s' }} />
                        <motion.div className="absolute bottom-20 left-20 w-24 h-24 bg-green-100 rounded-full blur-xl" variants={floatingIconVariants} animate="animate" style={{ animationDelay: '2s' }} />
                    </div>

                    <div className="container px-4 text-center relative z-10">
                        <motion.div className="mb-6" variants={itemVariants}>
                            <motion.div
                                className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full text-blue-600 text-sm font-medium mb-6"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Knowledge Hub</span>
                            </motion.div>
                            <h1 className="bg-gradient-secondary bg-clip-text text-transparent font-black text-5xl mb-4 font-roca leading-tight h-16">
                                Our Blogs
                            </h1>
                        </motion.div>

                        <motion.h2
                            variants={itemVariants}
                            className="text-heading-ha text-xl font-semibold mb-6 max-w-3xl mx-auto leading-relaxed"
                        >
                            Dive into our collection of insightful articles, expert opinions, and the latest industry trends
                        </motion.h2>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap justify-center items-center gap-8 mb-8"
                        >
                            <motion.div
                                className="flex items-center space-x-2 text-gray-600"
                                whileHover={{ scale: 1.05, color: '#3B82F6' }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <BookOpen className="w-5 h-5" />
                                <span className="font-medium">{allBlogs?.length || 0}+ Articles</span>
                            </motion.div>

                            <motion.div
                                className="flex items-center space-x-2 text-gray-600"
                                whileHover={{ scale: 1.05, color: '#10B981' }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <TrendingUp className="w-5 h-5" />
                                <span className="font-medium">Updated Weekly</span>
                            </motion.div>

                            <motion.div
                                className="flex items-center space-x-2 text-gray-600"
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

                <section id="blog-content" className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <SearchBar
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                totalResults={filteredBlogs.length}
                            />
                        </motion.div>

                        {paginatedBlogs.length > 0 ? (
                            <>
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-10"
                                    variants={containerVariants}
                                >
                                    {paginatedBlogs.map((blog, index) => (
                                        <motion.div
                                            key={blog.slug}
                                            variants={blogCardVariants}
                                            custom={index}
                                        >
                                            <BlogCard blog={blog} animate={false} />
                                        </motion.div>
                                    ))}
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </motion.div>
                            </>
                        ) : (
                            <motion.div
                                className="text-center py-12"
                                variants={itemVariants}
                            >
                                <div className="text-gray-500 text-lg mb-4">
                                    {searchTerm ? `No blogs found for "${searchTerm}"` : 'No blogs available'}
                                </div>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Clear search and view all blogs
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </section>
            </main>
        </>
    );
}