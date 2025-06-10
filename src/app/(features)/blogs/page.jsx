'use client';

import Head from 'next/head';
import Script from 'next/script';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Sparkles, Users } from 'lucide-react';
import { getAllBlogs } from '@/lib/blogService';
import BlogList from '@/components/blog/BlogList';
import { siteConfig } from "@/config/site";
import { generateMetadata as generatePageMetadata } from '@/config/seo';
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/seoUtils';

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

    const pageUrl = `${siteConfig.url}/blogs`;
    const metadata = generatePageMetadata({
        title: "Our Blog - Latest Articles and Insights",
        description: "Discover insightful articles, expert opinions, and latest trends in our comprehensive MathZAI blog. Stay informed with our regularly updated content.",
        url: pageUrl,
        image: `${siteConfig.url}/images/blog-og-image.jpg`
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
        "blogPost": initialBlogs?.map(blog => {
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
                    className="relative py-16 md:py-24 overflow-hidden"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 rounded-full blur-xl" variants={floatingIconVariants} animate="animate" />
                        <motion.div className="absolute top-20 right-20 w-16 h-16 bg-purple-100 rounded-full blur-xl" variants={floatingIconVariants} animate="animate" style={{ animationDelay: '1s' }} />
                        <motion.div className="absolute bottom-20 left-20 w-24 h-24 bg-green-100 rounded-full blur-xl" variants={floatingIconVariants} animate="animate" style={{ animationDelay: '2s' }} />
                    </div>

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <motion.div className="mb-6" variants={itemVariants}>
                            <motion.div
                                className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full text-blue-600 text-sm font-medium mb-6"
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
                                className="flex items-center space-x-2 text-gray-600"
                                whileHover={{ scale: 1.05, color: '#3B82F6' }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <BookOpen className="w-5 h-5" />
                                <span className="font-medium">{initialTotal || 0}+ Articles</span>
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