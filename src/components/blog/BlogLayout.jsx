'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import BlogCard from './BlogCard';
import {
  sectionFadeIn,
  fadeInUp,
  tocItemVariants,
} from '@/lib/framer-animations';

function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState('');
  const observer = useRef(null);
  const tocRef = useRef(null);

  const majorHeadings = headings
    ? headings.filter((heading) => heading.level === 2)
    : [];

  useEffect(() => {
    const observeElements = () => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: '0px 0px -50% 0px', threshold: [0.5, 1] },
      );

      headings.forEach((heading) => {
        const el = document.getElementById(heading.id);
        if (el) observer.current.observe(el);
      });
    };

    const timeoutId = setTimeout(observeElements, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observer.current) observer.current.disconnect();
    };
  }, [headings]);

  useEffect(() => {
    if (activeId && tocRef.current) {
      const activeLink = tocRef.current.querySelector(`a[href="#${activeId}"]`);
      if (activeLink) {
        activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeId]);

  if (!majorHeadings || majorHeadings.length === 0) return null;

  return (
    <motion.div
      className="p-4 rounded-lg shadow"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      <h3 className="text-xl font-semibold mb-3 text-black">
        On this page
      </h3>
      <nav ref={tocRef}>
        <ul className="space-y-1 max-h-[70vh] overflow-y-auto">
          <AnimatePresence>
            {majorHeadings.map((heading, index) => (
              <motion.li
                key={heading.id}
                custom={index}
                variants={tocItemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(heading.id)
                      ?.scrollIntoView({ behavior: 'smooth' });
                    setActiveId(heading.id);
                  }}
                  className={`block text-[16px] py-1 px-2 rounded transition-colors duration-200
                                ${ activeId === heading.id
                                    ? 'bg-tabs-background text-primary font-medium'
                                    : 'text-black hover:bg-slate-100 hover:text-gray-900'
                                }
                            `}
                >
                  {heading.text}
                </a>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </nav>
    </motion.div>
  );
}

export default function BlogLayout({ blog, relatedBlogs }) {
  if (!blog) return <p>Blog post not found.</p>;

  return (
    <div className="container mx-auto px-4">
      <motion.header
        className="mb-8 md:mb-12"
        initial="initial"
        animate="animate"
        variants={sectionFadeIn}
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-roca bg-gradient-secondary bg-clip-text text-transparent mb-3 text-center h-14">
          {blog.title}
        </h1>
        <div className="text-center text-sm text-gray-600 space-x-2">
          <span>By {blog.author.name}</span>
          <span>•</span>
          <span>Published: {blog.publishedDate}</span>
          <span>•</span>
          <span>{blog.readTime}</span>
        </div>
        {/* {blog.coverImage && (
          <motion.div
            className="mt-6 md:mt-8 rounded-lg overflow-hidden shadow-xl aspect-video relative max-h-full mx-auto w-full"
            variants={fadeInUp}
          >
            <Image
              src={blog.coverImage}
              alt={`Cover image for ${blog.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </motion.div>
        )} */}
      </motion.header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <motion.article
          className="lg:w-3/4 prose prose-lg max-w-none 
                       prose-headings:font-semibold prose-headings:tracking-tight
                       prose-a:text-blue-600 hover:prose-a:text-blue-800
                       prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto
                       prose-code:before:content-none prose-code:after:content-none prose-code:px-1 prose-code:py-0.5 prose-code:bg-slate-100 prose-code:rounded
                       "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          dangerouslySetInnerHTML={{ __html: blog.contentHTML }}
        />

        {blog.headings && blog.headings.length > 0 && (
          <aside className="lg:w-1/4 lg:sticky lg:top-24 h-max">
            <TableOfContents headings={blog.headings} />
          </aside>
        )}
      </div>

      {relatedBlogs && relatedBlogs.length > 0 && (
        <motion.section
          className="mt-16 pt-8 border-t border-gray-200"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionFadeIn}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900mb-6 md:mb-8">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {relatedBlogs.map((relatedBlog) => (
              <BlogCard
                key={relatedBlog.slug}
                blog={relatedBlog}
                animate={false}
              />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
