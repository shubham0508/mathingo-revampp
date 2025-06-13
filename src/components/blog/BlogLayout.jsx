'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogCard from './BlogCard';
import {
  sectionFadeIn,
  fadeInUp,
  tocItemVariants,
} from '@/lib/framer-animations';
import { Clock, User, Calendar } from 'lucide-react';

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

      headings?.forEach((heading) => {
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
      className="p-4 rounded-lg shadow bg-white sticky top-24 h-fit"
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
                                ${activeId === heading.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
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
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <motion.header
            className="mb-5 md:mb-5"
            initial="initial"
            animate="animate"
            variants={sectionFadeIn}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              {blog.author?.name && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{blog.author.name}</span>
                </div>
              )}
              {blog.publishedDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{blog.publishedDate}</span>
                </div>
              )}
              {blog.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{blog.readTime}</span>
                </div>
              )}
            </div>
          </motion.header>

          <motion.article
            className="prose prose-lg max-w-none text-gray-900
                       prose-headings:font-semibold prose-headings:text-gray-900
                       prose-a:text-blue-600 hover:prose-a:text-blue-800
                       prose-img:rounded-lg prose-img:shadow-md
                       prose-ul:list-disc prose-ol:list-decimal
                       prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50
                       prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            dangerouslySetInnerHTML={{ __html: blog.contentHTML }}
          />

          {blog.author && (blog.author.bio || blog.author.title) && (
            <motion.section
              className="mt-12 p-6 bg-gray-50 rounded-lg border"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              variants={sectionFadeIn}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                About {blog.author.name}
              </h3>
              {blog.author.title && (
                <p className="text-primary font-medium mb-2">{blog.author.title}</p>
              )}
              {blog.author.bio && (
                <p className="tex-lg mb-4">{blog.author.bio}</p>
              )}
              {blog.author.expertise && blog.author.expertise.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Expertise:</h4>
                  <div className="flex flex-wrap gap-2">
                    {blog.author.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-secondary-background text-primary border-2 border-primary rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>
          )}

          {blog.tags && blog.tags.length > 0 && (
            <motion.section
              className="mt-8 pt-6 border-t border-gray-200"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              variants={sectionFadeIn}
            >
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-lg cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.section>
          )}

          {/* Related Blogs Section */}
          {relatedBlogs && relatedBlogs.length > 0 && (
            <motion.section
              className="mt-16 pt-8 border-t border-gray-200"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              variants={sectionFadeIn}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Table of Contents - Fixed sidebar */}
        <aside className="lg:w-1/4">
          <div className="lg:sticky lg:top-24">
            {blog.headings && blog.headings.length > 0 && (
              <TableOfContents headings={blog.headings} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}