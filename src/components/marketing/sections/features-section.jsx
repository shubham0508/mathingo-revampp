'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import React from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

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
          className="mt-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-2 w-full px-4 md:px-12 lg:px-24"
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
                shape="round"
                className="bg-primary text-white border-button-order hover:bg-blue-700"
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
          className="mt-20 flex flex-col lg:flex-row items-center justify-between gap-2 w-full px-4 md:px-12 lg:px-24"
        >
          <div className="relative flex h-[468px] w-[44%] flex-col items-center self-center">
            <div className="relative flex aspect-square w-full items-center justify-center rounded-full bg-[#BBF9B6]">
              <div className="absolute right-[15%] top-1 h-[62px] w-[62px] rounded-[10px] bg-ha-image-blue-boxes" />
              <div className="absolute bottom-[13%] left-[16%] h-[62px] w-[20%] rounded-[10px] bg-ha-image-blue-boxes" />

              <Image
                src="/images/features/ha_math_question.png"
                alt="Math question"
                width={268}
                height={352}
                className="absolute top-[7px] w-[64%] rounded-[10px] object-contain"
              />

              <Image
                src="/images/features/ha_math-equation.png"
                alt="Math equation"
                width={278}
                height={40}
                className="absolute top-[42%] left-[19px] w-[68%] object-contain"
              />

              <Image
                src="/images/icons/img_plus.svg"
                alt="Plus icon"
                width={24}
                height={24}
                className="absolute right-[25%] my-auto h-6 w-6"
              />
            </div>

            <div className="absolute bottom-0 right-0 z-10 flex w-3/4 flex-col justify-center gap-[18px] rounded-[10px] border border-landing-bg-border bg-white px-5 py-[22px]">
              <div className="flex items-center gap-2 font-avenir">
                <div className="bg-landing-bg-image text-[9px] px-4 py-2 rounded-md font-medium border border-landing-bg-border">
                  Hints
                </div>
                <div className="text-[9px] border border-landing-bg-border px-4 py-2 rounded-md text-landing-bg-border font-medium">
                  Concepts
                </div>
                <div className="text-[9px] border border-landing-bg-border px-4 py-2 rounded-md text-landing-bg-border">
                  Solution
                </div>
                <div className="text-[9px] border border-landing-bg-border px-4 py-2 rounded-md text-landing-bg-border">
                  Answer
                </div>
              </div>
              <ul className="text-xs text-[13px] font-normal leading-[17px] list-disc px-5">
                <li>Recall the definition of the transpose of a matrix.</li>
                <li>
                  Consider an arbitrary element of the matrix A and track how
                  its indices change after taking the transpose twice.
                </li>
              </ul>
            </div>

            <Image
              src="/images/icons/img_arrow_1.svg"
              alt="Arrow icon"
              width={62}
              height={126}
              className="absolute top-0 left-[13%] w-[16%] object-contain"
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
                shape="round"
                className="bg-primary text-white border-button-order hover:bg-blue-700"
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
          className="mt-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-2 w-full px-4 md:px-12 lg:px-24"
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
                shape="round"
                className="bg-primary text-white border-button-order hover:bg-blue-700"
              >
                Check your Solution
              </Button>
            </div>
          </div>

          <div className="relative h-[468px]">
            <div className="flex flex-col items-center justify-center">
              <div className="border border-landing-bg-border rounded-lg px-8 py-5 font-avenir">
                <div className="text-xs flex justify-center items-center">
                  Upload/ Paste/ Type your Question & Answer
                </div>
                <div className="flex justify-center items-center flex-row gap-8 mt-8">
                  <div className="relative flex justify-center items-center align-middle">
                    <Image
                      src="/images/icons/ssc_answer.png"
                      width={139}
                      height={155}
                      alt="Question Image"
                      className="rounded-md object-contain"
                    />
                    <p className="absolute bg-landing-bg-image text-[12px] px-6 py-1 rounded-md font-medium top-[-12%]">
                      Question
                    </p>
                  </div>
                  <div className="relative flex justify-center items-center align-middle">
                    <Image
                      src="/images/icons/ssc_question.jpeg"
                      width={139}
                      height={155}
                      alt="Arrow"
                      className="object-contain"
                    />
                    <p className="absolute bg-landing-bg-image text-[12px] px-6 py-1 rounded-md font-medium top-[-12%]">
                      Solution
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-2 bg-white border border-landing-bg-border rounded-lg px-8 py-5 font-avenir mt-[-50px] ml-48">
                <div className="flex items-start flex-col">
                  <div className="flex flex-row gap-8">
                    <p className="bg-landing-bg-image text-[12px] px-3 py-1 rounded-md font-medium">
                      Uploaded Solution
                    </p>
                    <p className="text-landing-bg-border border border-landing-bg-border text-[12px] px-3 py-1 rounded-md font-medium">
                      Optimised Solution
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1 text-sm font-normal mt-2">
                    <CheckCircle2 className="fill-green-600 text-white w-5 h-5" />
                    <span>x² + 5x + 6 = 0.</span>
                    <span className="ml-5">So, x² + 2x + 3x + 6 = 0</span>
                  </div>

                  <div className="space-y-1 text-sm font-normal mt-1">
                    <div className="flex flex-wrap items-center gap-1 mb-1">
                      <CheckCircle2 className="fill-green-600 text-white w-5 h-5" />
                      <span>x(x + 2) + 3(x + 2) = 0</span>
                    </div>
                      <div className="flex flex-wrap items-center gap-1 mb-1">
                      <XCircle className="fill-red-600 text-white w-5 h-5" />
                      <span>(x + 2)(x + 3) = 0</span>
                    </div>
                      <div className="flex flex-wrap items-center gap-1">
                      <XCircle className="fill-red-600 text-white w-5 h-5" />
                      <span>x = -2, x = -3</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-start px-3 py-2 mt-3">
                    <div className="flex items-center gap-2 text-red-700">
                      <p className="text-sm font-medium">Error in Factoring!</p>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      The correct factoring is{' '}
                      <span>(x + 2)(x + 3) = 0</span>. So,{' '}
                      <span>x = -2, x = -3</span> is the right solution.
                    </p>
                  </div>

                  <Image
                    src="/images/logos/ai_tutor.png"
                    width={114}
                    height={202}
                    alt="AI Tutor"
                    className="absolute top-1 right-0 h-[202px] w-[46%] object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
