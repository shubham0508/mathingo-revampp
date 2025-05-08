'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import React from 'react';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function FeaturesSection() {
  return (
    <section className="container mx-auto py-16 px-4">
      <div className="flex flex-col items-center">
        {/* Section Title */}
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-3xl text-center font-medium sm:text-4xl"
        >
          Mathz AI wears many hats,
        </motion.h1>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          custom={1}
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-2 text-3xl text-center font-medium sm:text-4xl"
        >
          depending on how you want to see it.
        </motion.h2>

        {/* Feature 1 - AI Math Tutor */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 w-full px-4 md:px-12 lg:px-24"
        >
          <div className="flex flex-col items-start">
            <h3 className="text-2xl sm:text-3xl font-bold font-roca">
              AI Math Tutor
            </h3>
            <p className="mt-4 max-w-md text-base sm:text-lg">
              Experience real-time tutoring support with an AI buddy who teaches
              interactively and understands your problems.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="outline" className="border-black">
                <span>Know More</span>
              </Button>
              <Button
                variant="outline"
                className="bg-gradient-button text-white border-button-order"
              >
                Start Learning
              </Button>
            </div>
          </div>

          <div className="w-full max-w-lg">
            <video
              className="rounded-lg border-2 border-blue-500 w-full h-auto"
              controls
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            >
              <source src="/videos/feature_AMT.mov" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>

        {/* Feature 2 - Homework Assignment */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-20 flex flex-col lg:flex-row items-center justify-between gap-12 w-full px-4 md:px-12 lg:px-24"
        >
          <div className="w-full max-w-lg">
            <Image
              src="/images/features/feature_HA.png"
              alt="Homework Assignment - Upload math problems easily"
              width={600}
              height={800}
              className="rounded-lg object-cover w-full h-auto"
              quality={90}
              loading="lazy"
              priority={false}
            />
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-2xl sm:text-3xl font-bold font-roca">
              Homework Assignment
            </h3>
            <p className="mt-4 max-w-md text-base sm:text-lg">
              Provide your math problems by uploading, typing, copy-pasting, or
              taking a picture. Filter out irrelevant questions and get precise
              hints, solutions, and relevant information.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="outline" className="border-black">
                <span>Know More</span>
              </Button>
              <Button
                variant="outline"
                className="bg-gradient-button text-white border-button-order"
              >
                Get help on an assignment
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Feature 3 - Smart Solution Check */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 w-full px-4 md:px-12 lg:px-24"
        >
          <div className="flex flex-col items-start">
            <h3 className="text-2xl sm:text-3xl font-bold font-roca">
              Smart Solution Check
            </h3>
            <p className="mt-4 max-w-md text-base sm:text-lg">
              Submit questions with your answers (PDF or image). Let an AI
              homework helper check your solution, find mistakes, and provide
              optimized guidance.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="outline" className="border-black">
                <span>Know More</span>
              </Button>
              <Button
                variant="outline"
                className="bg-gradient-button text-white border-button-order"
              >
                Check your Solution
              </Button>
            </div>
          </div>

          <div className="w-full max-w-lg">
            <Image
              src="/images/features/feature_SSC.png"
              alt="Smart solution check AI feature image"
              width={600}
              height={800}
              className="rounded-lg object-cover w-full h-auto"
              quality={90}
              loading="lazy"
              priority={false}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
