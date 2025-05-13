'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Factory, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';

const footerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const linkHoverVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.1,
    transition: { type: 'spring', stiffness: 300 },
  },
};

function Footer() {
  return (
    <motion.footer
      className="relative text-white w-full h-full bg-[url(/images/icons/footer-background.svg)] bg-cover bg-no-repeat px-14 py-[74px]"
      initial="hidden"
      whileInView="visible"
      variants={footerVariants}
      viewport={{ once: true }}
    >
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="mb-8 flex flex-col items-center space-y-3">
          <div className="flex items-center align-middle">
            <Link href="/">
              <Image
                src="/images/icons/company_logo.svg"
                width={80}
                height={80}
                alt="Mathz AI Logo"
                priority
              />
            </Link>
            <h1 className="bg-gradient-secondary bg-clip-text text-[35px] !text-transparent font-roca -ml-[14px]">
              Mathz AI
            </h1>
          </div>
          <p className="text-gray-300 text-lg">Elevate Math Learning</p>
          <button className="text-lg mt-4 px-6 py-2 bg-primary hover:bg-blue-700 transition text-white rounded shadow">
            Start math journey now– it’s free!
          </button>
        </div>

        {/* Grid of links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left justify-items-center text-sm mt-10">
          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-lg">Company</h4>
            <ul className="flex flex-col gap-4">
              {[
                { label: 'Our Mission', href: '/mission' },
                { label: 'Terms of Services', href: '/terms' },
                { label: 'Privacy Policy', href: '/privacy' },
              ].map((link) => (
                <motion.li
                  key={link.label}
                  variants={linkHoverVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-lg">Explore</h4>
            <ul className="flex flex-col gap-4">
              {[
                { label: 'Math Quiz', href: '/quiz' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Blogs', href: '/blogs' },
              ].map((link) => (
                <motion.li
                  key={link.label}
                  variants={linkHoverVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-lg">
              Around the Web
            </h4>
            <div className="flex flex-col gap-4">
              {[
                {
                  icon: Instagram,
                  name: 'Instagram',
                  href: 'https://www.instagram.com/mathzai',
                },
                {
                  icon: Linkedin,
                  name: 'LinkedIn',
                  href: 'https://www.linkedin.com/company/mathzai',
                },
                {
                  icon: Factory,
                  name: 'TikTok',
                  href: 'https://www.tiktok.com/@mathzai',
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 align-middle text-gray-300 hover:text-white"
                >
                  <social.icon size={22} />
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 text-gray-500 text-sm text-center">
          © {new Date().getFullYear()} Mathz AI. All Rights Reserved.
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
