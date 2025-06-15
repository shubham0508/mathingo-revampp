'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Factory, Instagram, Linkedin, Youtube } from 'lucide-react';
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
      className="relative text-white w-full h-full bg-[url(/images/icons/footer-background.svg)] bg-cover bg-no-repeat px-4 sm:px-6 md:px-10 lg:px-14 py-10 sm:py-[74px] md:py-16 lg:py-[74px]"
      initial="hidden"
      whileInView="visible"
      variants={footerVariants}
      viewport={{ once: true }}
    >
      <div className="relative z-10 container mx-auto text-center">
        <div className="mt-32 md:mt-0 mb-6 md:mb-8 flex flex-col items-center space-y-3 gap-3 md:gap-5">
          <div className='flex flex-col justify-center items-center text-center'>
            <div className="flex gap-1.5 align-middle justify-center">
              <Link href="/" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/images/icons/2.png"
                  width={44}
                  height={44}
                  alt="Mathz AI Logo"
                />
              </Link>
              <h1 className="bg-gradient-secondary font-roca bg-clip-text text2xl !text-transparent font-semibold">
                Mathz AI
              </h1>
            </div>
            <p className='font-medium'>Elevate Math Learning</p>
          </div>
          <button className="text-base sm:text-lg mt-6 sm:mt-10 px-4 sm:px-6 py-2 bg-primary hover:bg-blue-700 transition text-white rounded shadow w-full sm:w-auto max-w-xs">
            Start solving now– it's free!
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 text-left mt-12 md:mt-20">
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-white font-semibold mb-3 md:mb-4 uppercase text-base sm:text-lg">CONTACT US</h4>
            <motion.p
              key={"contact us"}
              variants={linkHoverVariants}
              initial="initial"
              whileHover="hover"
            >
              <Link
                href="/contact-us"
                className="text-gray-400 hover:text-white transition-colors hover:cursor-pointer text-sm sm:text-base"
                target="_blank"
                rel="noopener noreferrer"
              >
                support@mathzai.com
              </Link>
            </motion.p>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-white font-semibold mb-3 md:mb-4 uppercase text-base sm:text-lg">Company</h4>
            <ul className="flex flex-col gap-2 md:gap-4 items-center sm:items-start">
              {[
                { label: 'Our Mission', href: '/about-us' },
                { label: 'Terms of Services', href: '/terms-of-service' },
                { label: 'Privacy Policy', href: '/privacy-policy' },
              ].map((link) => (
                <motion.li
                  key={link.label}
                  variants={linkHoverVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-white font-semibold mb-3 md:mb-4 uppercase text-base sm:text-lg">Explore</h4>
            <ul className="flex flex-col gap-2 md:gap-4 items-center sm:items-start">
              {[
                { label: 'Math Quiz', href: '/math-quiz' },
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
                    className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-white font-semibold mb-3 md:mb-4 uppercase text-base sm:text-lg">
              Around the Web
            </h4>
            <div className="flex flex-col gap-2 md:gap-4 items-center sm:items-start">
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
                  icon: Youtube,
                  name: 'Youtube',
                  href: 'https://www.youtube.com/@MathzAI',
                },
              ].map((social) => (
                <motion.a
                  variants={linkHoverVariants}
                  initial="initial"
                  whileHover="hover"
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex items-center gap-2 md:gap-4 align-middle text-gray-300 hover:text-white text-sm sm:text-base"
                >
                  <social.icon size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  <span>{social.name}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-16 text-gray-500 text-xs sm:text-sm text-center">
          © {new Date().getFullYear()} Mathz AI. All Rights Reserved.
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;