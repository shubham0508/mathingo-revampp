"use client";

import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';

const featuresData = [
  {
    id: "01",
    text: "Solve independently, get help only when you want.",
    pillBgColor: "bg-[#CDFACC]",
    numberBgColor: "bg-[#A0FF9E]",
    dotSvgPath: "/images/features-overview/img_cut.svg",
    itemMargin: "lg:ml-0",
    dotStyle: { top: '12%', left: 'calc(50% - 120px)', width: '70px', },
  },
  {
    id: "02",
    text: "Master concepts — learn the why, not just the how.",
    pillBgColor: "bg-[#FFF0F0]",
    numberBgColor: "bg-[#FFC5C5]",
    dotSvgPath: "/images/features-overview/img_arrow_5.svg",
    itemMargin: "lg:ml-12",
    dotStyle: { top: '37%', left: 'calc(50% - 80px)', width: '70px', },
  },
  {
    id: "03",
    text: "Upload an image, get help on what you pick.",
    pillBgColor: "bg-[#FFF3D2]",
    numberBgColor: "bg-[#FFE394]",
    dotSvgPath: "/images/features-overview/img_arrow_6.svg",
    itemMargin: "lg:ml-12",
    dotStyle: { top: '58%', left: 'calc(50% - 80px)', width: '70px', },
  },
  {
    id: "04",
    text: "Crack geometry problems live",
    pillBgColor: "bg-[#F7FDFF]",
    numberBgColor: "bg-[#BFEFFF]",
    dotSvgColor: "bg-[#BFEFFF]",
    dotSvgPath: "/images/features-overview/img_arrow_7.svg",
    itemMargin: "lg:ml-4",
    dotStyle: { top: '75%', left: 'calc(50% - 100px)', width: '70px', },
  },
];

const mathSymbols = [
  { src: "/images/features-overview/img_mdi_pi.svg", alt: "Pi", style: { top: '4%', left: '50%', transform: 'translateX(-50%)' }, size: 'w-7 h-7 sm:w-8 sm:h-8' },
  { src: "/images/features-overview/img_mdi_omega.svg", alt: "Omega", style: { top: '20%', left: '12%' }, size: 'w-7 h-7 sm:w-8 sm:h-8' },
  { src: "/images/features-overview/img_ic_baseline_divide.svg", alt: "Divide", style: { top: '50%', left: '4%', transform: 'translateY(-50%)' }, size: 'w-7 h-7 sm:w-8 sm:h-8' },
  { src: "/images/features-overview/img_mdi_alpha.svg", alt: "Derivative", style: { bottom: '20%', left: '12%' }, size: 'w-7 h-7 sm:w-8 sm:h-8' },
  { src: "/images/features-overview/img_mdi_alpha.svg", alt: "Alpha", style: { bottom: '4%', left: '50%', transform: 'translateX(-50%)' }, size: 'w-7 h-7 sm:w-8 sm:h-8' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut'
    }
  })
};

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25
    }
  }
};

export default function MathzUniquePage() {
  return (
    <>
      <Head>
        <title>What makes MathzAI unique?</title>
        <meta name="description" content="Features of MathzAI" />
      </Head>

      <div className="min-h-screen w-full bg-mathz-radial bg-cover bg-no-repeat flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.h1
          className="headingmd font-bold text-black mb-16 text-center font-roca"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          What makes MathzAI unique?
        </motion.h1>

        <motion.div
          className="relative flex flex-col lg:flex-row items-center justify-center w-full max-w-5xl xl:max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={container}
        >
          <motion.div
            className="relative w-[360px] h-[360px] sm:w-[400px] sm:h-[400px] lg:w-[420px] lg:h-[420px] mb-16 lg:mb-0 shrink-0"
            variants={fadeInUp}
          >
            <div
              className="w-full h-full rounded-full bg-[#94D7FF] flex items-center justify-center"
              style={{
                boxShadow: '0 0 80px 20px rgba(0, 145, 255, 0.6)',
              }}
            >
              <div className="relative w-[calc(100%-100px)] h-[calc(100%-100px)] sm:w-[calc(100%-110px)] sm:h-[calc(100%-110px)] bg-white rounded-full shadow-lg flex items-center justify-center">
                <Image
                  src="/images/icons/img_ellipse_35.png"
                  alt="MathzAI Tutor"
                  width={300}
                  height={300}
                  className="object-contain w-[90%] h-auto"
                />
              </div>
            </div>

            {mathSymbols.map((symbol, index) => (
              <motion.img
                key={symbol.alt}
                src={symbol.src}
                alt={symbol.alt}
                className={`absolute ${symbol.size} z-10 filter drop-shadow-sm`}
                style={symbol.style}
                animate={{
                  y: [0, -6, 0],
                  x: [0, 2, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4 + index * 0.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>

          <motion.div
            className="relative flex flex-col gap-10 space-y-3 sm:space-y-5 items-start lg:items-start shrink-0"
            variants={container}
          >
            {featuresData.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={`relative flex items-start z-20 ${feature.itemMargin || ''} w-full max-w-md lg:max-w-none`}
                custom={index}
                variants={fadeInUp}
              >
                <div className={`flex items-center space-x-3 sm:space-x-4 p-1.5 pr-5 sm:pr-6 rounded-full ${feature.pillBgColor} shadow-md w-auto`}>
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${feature.numberBgColor} flex items-center justify-center shrink-0`}>
                    <span className={`font-bold text-md sm:text-lg text-black`}>
                      {feature.id}
                    </span>
                  </div>
                  <span className={`text-sm sm:text-base font-medium text-black`}>
                    {feature.text}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <img
            src="/images/features-overview/img_line_1.svg"
            alt="Line"
            width={80}
            height={80}
            className="absolute hidden lg:block"
          />

          {featuresData.map((feature, index) => (
            <motion.img
              key={`dot-${feature.id}`}
              src={feature.dotSvgPath}
              alt=""
              className="absolute h-auto z-0 pointer-events-none hidden lg:block"
              style={feature.dotStyle}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            />
          ))}
        </motion.div>
      </div>
    </>
  );
}