'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
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
    <section className="container mx-auto py-16 px-4 font-avenir">
      <div className="flex flex-col items-center">
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

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-12 sm:mt-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 w-full px-0 md:px-12 lg:px-24"
        >
          <div className="flex flex-col items-start justify-center lg:w-1/2">
            <h3 className="bg-gradient-secondary bg-clip-text headingmd !text-transparent font-roca">
              AI Math Tutor
            </h3>
            <p className="mt-4 max-w-md text-xl">
              Experience Real time tutoring support with AI buddy who teaches interactively and understands your problems.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 ">
              <Button variant="outline" className="border-black text-lg shadow-none py-5 px-2">
                <span>Know More</span>
              </Button>
              <Button
                shape="round"
                className="bg-primary text-white border-button-order hover:bg-blue-700 text-lg py-5 px-5"
              >
                Solve with buddy
              </Button>
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center items-center text-center w-full">
            <div className="relative w-full aspect-[4/3] flex justify-center items-center">
              <div className="flex justify-center items-center relative z-10 w-[90%] h-[80%] lg:w-full lg:h-full">
                <div className="absolute -left-5 -bottom-[20px] z-0 w-44 md:w-auto">
                  <Image src="/images/features/AMT/bg-shape-pink-1.png" alt="Decorative Shape" width={350} height={500} />
                </div>
                <div className="absolute -top-[35px] right-24 z-0">
                  <Image src="/images/features/AMT/bg-shape-blue-1.png" alt="Decorative Shape" width={50} height={50} />
                </div>
                <div className="absolute -top-[30px] right-12 z-0">
                  <Image src="/images/features/AMT/bg-shape-blue-1.png" alt="Decorative Shape" width={40} height={40} />
                </div>
                <div className="absolute -bottom-[20px] -right-[20px] z-0 w-44 md:w-auto">
                  <Image src="/images/features/AMT/bg-shape-pink-2.png" alt="Decorative Shape" width={350} height={1400} />
                </div>

                <div className="absolute inset-0 z-20">
                  <Image
                    src="/images/features/AMT/computer-body.png"
                    alt="Computer Display Frame"
                    layout="fill"
                    objectFit="contain w-10 h-10"
                  />
                </div>
                <div
                  className="absolute z-10 overflow-hidden h-full"
                  style={{
                    top: '6.5%',
                    left: '4.5%',
                    width: '91%',
                    height: '84%',
                  }}
                >
                  <video
                    className="w-full h-full object-cover rounded-md z-10"
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

                <div className="absolute bottom-[-3%] sm:bottom-[-3%] left-1/2 -translate-x-1/2 w-[45%] sm:w-[40%] z-20 flex flex-col items-center">
                  <Image
                    src="/images/features/AMT/computer-base-1.png"
                    alt="Computer Base"
                    width={63}
                    height={12}
                    className='mx-auto object-contain w-[30%] h-auto'
                  />
                  <Image
                    src="/images/features/AMT/computer-base-2.png"
                    alt="Computer Base"
                    width={200}
                    height={50}
                    layout="responsive"
                    objectFit="contain"
                    className="mt-2 sm:mt-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-12 sm:mt-32 flex flex-col lg:flex-row items-center justify-between gap-10 w-full px-0 md:px-12 lg:px-24"
        >
          <div className="relative flex justify-center h-full items-center text-center w-full lg:w-1/2">
            <div className="relative w-full aspect-[4/3] flex justify-center items-center mt-32">
              <Image
                src="/images/features/HA/ha_phone.png"
                alt="Smartphone"
                width={257}
                height={469}
                className="absolute z-10 w-[60%]"
              />

              <div className="absolute -top-[40px] left-0 sm:-top-[20px] sm:-left-14 z-0 opacity-80 w-[50%] h-auto">
                <Image src="/images/features/HA/ha_bg_green_circle.png" alt="Decorative Shape" width={350} height={300} />
              </div>
              <div className="absolute top-0 right-4 sm:top-0 sm:right-4 z-0 w-[80%] h-auto">
                <Image src="/images/features/HA/bg_ha_green_rectangle.png" alt="Decorative Shape" width={420} height={450} />
              </div>

              <Image
                src="/images/features/HA/ha_math-equation.png"
                alt="Math equation snippet"
                width={100}
                height={100}
                className="absolute top-0 left-8 object-contain z-20 h-auto w-[50%]"
              />

              <Image
                src="/images/features/HA/img_plus.png"
                alt="Plus icon"
                width={24}
                height={24}
                className="absolute top-3 sm:top-6 right-[37%] sm:right-[42%] w-6 h-6 z-20 object-contain"
              />

              <Image
                src="/images/features/HA/ha_book.png"
                alt="Open book"
                width={150}
                height={150}
                className="absolute top-[50px] left-[10%] sm:left-8 -translate-x-1/2 w-[30%] sm:w-[40%] object-contain z-20 h-auto"
              />

              <div className="absolute top-[150px] left-[10%] sm:top-[280px] sm:left-16 md:left-12 md:top-[240px] -translate-x-1/2 w-[10%] sm:w-[10%] object-contain z-10 h-auto">
                <Image src="/images/features/HA/ha_bg_green_circle.png" alt="Decorative Shape" width={40} height={40} layout="responsive" />
              </div>
              <div className="absolute top-[190px] left-[10%] sm:top-[340px] sm:left-16 md:left-12 md:top-[300px] -translate-x-1/2 w-[8%] sm:w-[8%] object-contain z-10 h-auto">
                <Image src="/images/features/HA/ha_bg_green_circle.png" alt="Decorative Shape" width={30} height={30} layout="responsive" />
              </div>

              <Image
                src="/images/features/HA/ha_camera.png"
                alt="Camera icon"
                width={60}
                height={60}
                className="absolute top-[20px] left-[5%] sm:left-0 -translate-x-1/2 w-[22%] object-contain z-10 h-auto"
              />

              <div className="absolute top-12 sm:top-14 z-10 flex flex-col justify-center gap-4 sm:gap-10 w-2/3 items-center px-4">
                <div className="flex flex-wrap justify-center gap-1 2xl:gap-2 font-avenir text-center">
                  <div className="text-[9px] sm:text-sm 2xl:text-sm text-primary px-1 py-1 sm:py-1 sm:px-1 2xl:px-2 2xl:py-2 rounded-md font-semibold border bg-[#E2E6FF] border-primary">
                    Hints
                  </div>
                  <div className="text-[9px] sm:text-sm 2xl:text-sm border px-1 py-1 sm:py-1 sm:px-1 2xl:px-2 2xl:py-2 rounded-md font-semibold text-primary border-primary">
                    Concepts
                  </div>
                  <div className="text-[9px] sm:text-sm 2xl:text-sm border px-1 py-1 sm:py-1 sm:px-1 2xl:px-2 2xl:py-2 rounded-md font-semibold text-primary border-primary">
                    Solution
                  </div>
                  <div className="text-[9px] sm:text-sm 2xl:text-sm border px-1 py-1 sm:py-1 sm:px-1 2xl:px-2 2xl:py-2 rounded-md font-semibold text-primary border-primary">
                    Answer
                  </div>
                </div>
                <div className="flex flex-col gap-1 sm:gap-2 font-avenir text-[10px] sm:text-sm absolute top-10 w-3/4 sm:w-[80%] px-1 sm:px-2 text-start mt-0 sm:mt-10">
                  <p>👉 Recall the definition of the transpose of a matrix.</p>
                  <p>👉 Consider an arbitrary element of the matrix A and track how its indices change after taking the transpose twice.</p>
                </div>
              </div>

              <Image
                src="/images/features/HA/ha_phone_top.png"
                alt="Smartphone"
                width={100}
                height={12}
                className="absolute object-contain z-20 -top-[55px] sm:-top-[70px] 2xl:-top-[78px] h-auto"
              />

              <Image
                src="/images/features/HA/ha_phone_black_rect.png"
                alt="Smartphone"
                width={268}
                height={118}
                className="absolute -bottom-10 sm:-bottom-16 w-[24%] object-contain z-20"
              />

              <Image
                src="/images/features/HA/ha_phone_side1.png"
                alt="Smartphone"
                width={8}
                height={37}
                className="absolute top-0 right-[18%] sm:right-[90px] 2xl:right-[105px] object-contain z-20"
              />

              <Image
                src="/images/features/HA/ha_phone_side2.png"
                alt="Smartphone"
                width={8}
                height={54}
                className="absolute top-10 right-[18%] sm:right-[90px] 2xl:right-[105px] object-contain z-20"
              />
            </div>
          </div>

          <div className="flex flex-col items-start justify-center w-full lg:w-1/2 mt-12 lg:mt-32 lg:ml-10 px-4 sm:px-0">
            <h3 className="bg-gradient-secondary bg-clip-text headingmd !text-transparent font-roca">
              Homework Assistant
            </h3>
            <p className="mt-4 max-w-md text-xl">
              Provide your math problems by uploading, typing, copy-pasting, or taking a picture. Filter out irrelevant questions and get precise hints, solutions & other relevant information for what matters most.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center items-center text-center">
              <Button variant="outline" className="border-black text-lg shadow-none py-5 px-2">
                <span>Know More</span>
              </Button>
              <Button
                shape="round"
                className="bg-primary text-white border-button-order hover:bg-blue-700 text-lg py-5 px-5"
              >
                Get help on an assignment
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative mt-32 sm:mt-44 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 w-full px-0 md:px-12 lg:px-24"
        >
          <div className="flex flex-col items-start justify-center mt-8 lg:mt-0 lg:w-1/2 px-4 sm:px-0">
            <h3 className="bg-gradient-secondary bg-clip-text headingmd !text-transparent font-roca">
              Smart Solution Check
            </h3>
            <p className="mt-4 max-w-md text-xl">
              Tired of self-validation? Submit questions with your answers, either as a PDF or image. Stand confident as an AI homework helper checks your solution for mistakes and provides optimised answers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center items-center text-center">
              <Button variant="outline" className="border-black text-lg shadow-none py-5 px-2">
                <span>Know More</span>
              </Button>
              <Button
                shape="round"
                className="bg-primary text-white border-button-order hover:bg-blue-700 text-lg py-5 px-5"
              >
                Verify your Solutions
              </Button>
            </div>
          </div>

          <div className="relative mt-10 lg:mt-48 w-full lg:w-1/2">
            <div className="relative w-full aspect-[4/3] flex justify-center items-center">
              <Image
                src="/images/features/SSC/ssc_yellow_blob.png"
                alt="Background shape"
                width={100}
                height={100}
                className="absolute object-contain z-0 -top-[30%] left-10 sm:left-10 h-[110%] w-[110%]"
              />

              <Image
                src="/images/features/SSC/ssc_book.png"
                alt="Open book"
                width={100}
                height={100}
                className="absolute -top-[17%] left-[15%] object-contain z-30 w-[20%] h-auto max-w-[100px]"
              />

              <Image
                src="/images/features/SSC/ssc_search.png"
                alt="Search Icon"
                width={59}
                height={70}
                className="absolute -top-[11%] left-[22%] object-contain z-30 w-[12%] h-auto max-w-[70px]"
              />
              <div className="relative w-full h-full flex items-center justify-center z-20">

                <Image
                  src="/images/features/SSC/ssc_laptop_screen_surround.png"
                  alt="Laptop screen"
                  width={389}
                  height={256}
                  className="absolute top-[0%] w-[85%] h-auto object-contain"
                />

                <Image
                  src="/images/features/SSC/ssc_laptop_base.png"
                  alt="Laptop base"
                  width={480}
                  height={80}
                  className="absolute top-[70%] w-[140%] h-auto object-contain"
                />

                <Image
                  src="/images/features/SSC/ssc_laptop_keyboard.png"
                  alt="Laptop keyboard"
                  width={400}
                  height={100}
                  className="absolute top-[71%] w-[80%] h-auto object-contain"
                />

                <Image
                  src="/images/features/SSC/ssc_laptop_touchpad.png"
                  alt="Laptop touchpad"
                  width={100}
                  height={100}
                  className="absolute top-[80%] w-[20%] h-auto object-contain"
                />

                <Image
                  src="/images/features/SSC/ssc_laptop_base_cover.png"
                  alt="Laptop base cover"
                  width={486}
                  height={32}
                  className="absolute top-[85%] w-[100%] h-auto object-contain"
                />

                <Image
                  src="/images/features/SSC/ssc_laptop_base_line.png"
                  alt="Laptop Base line"
                  width={108}
                  height={6}
                  className="absolute bottom-[10%] w-[20%] h-auto object-contain"
                />

                <Image
                  src="/images/features/SSC/ssc_laptop_base_line_1.png"
                  alt="Laptop Base line"
                  width={23}
                  height={7}
                  className="absolute bottom-[10%] right-[15%] w-[5%] h-auto object-contain"
                />

                <Image
                  src="/images/features/SSC/ssc_laptop_base_circle.png"
                  alt="Laptop Base circle"
                  width={10}
                  height={10}
                  className="absolute bottom-[10%] right-[10%] w-[2%] h-auto object-contain"
                />

                <Image
                  src="/images/features/SSC/ssc_laptop_base_circle.png"
                  alt="Laptop Base circle"
                  width={10}
                  height={10}
                  className="absolute bottom-[10%] right-[8%] w-[2%] h-auto object-contain"
                />

                <Image
                  src="/images/features/SSC/ai_tutor.png"
                  alt="AI Tutor character"
                  width={130}
                  height={179}
                  className="absolute object-contain h-auto pointer-events-none select-none bottom-20 sm:bottom-36 right-[25%] md:bottom-32 2xl:bottom-36 z-30"
                />

                <div className="absolute top-10 sm:top-[15%] left-12 sm:left-24 sm:right-0 md:left-20 z-30 w-full sm:w-auto">
                  <p className="ml-5 font-semibold text-[10px] 2xl:text-xl mb-1 sm:mb-5 sm:text-[16px]">Question: Solve for x, x² + 5x + 6 = 0.</p>
                  <div className="mt-2 space-y-1 sm:space-y-2 text-[9px] 2xl:text-[17px] sm:text-[14px]">
                    <div className="flex items-center gap-1">
                      <Check className="text-[#109E03] w-3 h-3 sm:w-4 sm:h-4" />
                      <span>x² + 5x + 6 = 0. So, x² + 2x + 3x + 6 = 0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="text-[#109E03] w-3 h-3 sm:w-4 sm:h-4" />
                      <span>x(x + 2) + 3(x + 2) = 0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <X className="text-[#B80303] w-3 h-3 sm:w-4 sm:h-4" />
                      <span>(x + 2)(x + 3) = 0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <X className="text-[#B80303] w-3 h-3 sm:w-4 sm:h-4" />
                      <span>x = 2, x = 3</span>
                    </div>
                  </div>
                </div>
                <div className="relative w-[45%] -top-[40%] left-[30%] sm:-top-[35%] sm:left-[35%] 2xl:-top-[30%] 2xl:left-[37%] z-40">
                  <Image
                    src="/images/features/SSC/ssc_speech_bubble.png"
                    alt="Speech bubble"
                    width={214}
                    height={214}
                    className="absolute object-fill"
                  />
                  <div className="absolute w-[60%] sm:w-[72%] 2xl:w-[62%] top-[65px] sm:top-[100px] left-10 sm:left-10 inset-0 text-[8px] sm:text-xs p-2 font-medium flex flex-col justify-center text-center">
                    <p className="font-medium text-[#B80303] px-1 sm:px-2">Mistake in step 3 while factoring!</p>
                    <p className="mt-0 ml-0 sm:mt-1 font-medium text-[#109E03] px-1 sm:px-1 sm:ml-4">
                      The correct factoring is (x+2)(x+3)=0. So, x=-2, x=-3 is the right solution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}