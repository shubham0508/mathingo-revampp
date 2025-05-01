'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Img } from '@/components/ui/img';
import Header from '@/components/layout/header';
import SuperInput from '@/components/shared/SuperInputBox';

export function HeroSection() {
  const fullText = 'Anytime, Anywhere!';
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let typingInterval;

    if (!fade) {
      typingInterval = setInterval(() => {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex((prevIndex) => {
          if (prevIndex + 1 === fullText.length) {
            setTimeout(() => setFade(true), 500);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, 150);
    }

    return () => clearInterval(typingInterval);
  }, [currentIndex, fade]);

  useEffect(() => {
    if (fade) {
      const fadeTimeout = setTimeout(() => {
        setDisplayedText('');
        setCurrentIndex(0);
        setFade(false);
      }, 1000);
      return () => clearTimeout(fadeTimeout);
    }
  }, [fade]);

  useEffect(() => {
    const button = document.getElementById('askUsButton');

    if (!button) return;

    let bounceTimeout;

    const bounce = () => {
      button.classList.add('animate-bounce-once');

      setTimeout(() => {
        button.classList.remove('animate-bounce-once');
      }, 2000);
    };

    const loopBounce = () => {
      const randomDelay = Math.random() * 2000 + 4000;
      bounceTimeout = setTimeout(() => {
        bounce();
        loopBounce();
      }, randomDelay);
    };

    loopBounce();

    return () => clearTimeout(bounceTimeout);
  }, []);

  return (
    <section className="w-full bg-hero-pattern bg-cover bg-no-repeat">
      <Header />
      <div className="relative w-full flex flex-col items-center">
        <div className="w-full flex flex-col justify-center items-center">
          <div className="flex justify-center items-center mt-10">
            <Img
              src="/images/logos/infinity.png"
              alt="Infinity Background"
              width={800}
              height={800}
              priority
              className="absolute mt-40 pointer-events-none select-none"
            />
          </div>

          <div className="flex w-4/5 flex-col justify-center items-center relative">
            <h2 className="text-4xl font-bold leading-tight md:text-3xl sm:text-2xl text-center">
              <span className="text-black-900_01">Mathz AI is your</span>
              <span className="text-yellow-a400">&nbsp;</span>
              <span className="text-amber-400">#1</span>
              <span className="text-black-900_01">
                &nbsp;Math Buddy
                <br />
              </span>
            </h2>

            {/* Streaming Text with fade */}
            <div className="mt-6">
              <h2
                className={`text-center text-4xl font-normal text-amber-500 transition-opacity duration-700 ${
                  fade ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {displayedText}
                <span className="animate-pulse">|</span>
              </h2>
            </div>

            {/* Subtext */}
            <div className="mt-6 w-1/2 flex justify-center">
              <p className="text-base text-center">
                Unlock your math potential through interactive learning. Mathz
                AI is focused to make Math problem-solving faster, smarter, and
                easier.
              </p>
            </div>

            {/* AI Tutor image */}
            <div className="w-full mt-10 flex justify-center">
              <Img
                src="/images/logos/ai_tutor.png"
                alt="AI Tutor"
                width={400}
                height={400}
                className="absolute object-contain h-auto max-h-[400px] pointer-events-none select-none right-4 top-[-60px]"
                priority
              />
            </div>
          </div>

          {/* Input and Topic Buttons */}
          <div className="relative w-full px-4 sm:px-0 sm:w-10/12 lg:w-7/12 mt-5 flex flex-col mb-10 justify-center items-center">
            {' '}
            <SuperInput />
            <div className="w-full mt-5 flex flex-wrap gap-3">
              <Button className="bg-white text-black rounded-md border border-gray-200 hover:bg-gray-100">
                Calculus
              </Button>
              <Button className="bg-white text-black rounded-md border-2 border-gray-200 hover:bg-gray-100">
                Algebra
              </Button>
              <Button className="bg-white text-black rounded-md border-2 border-gray-200 hover:bg-gray-100">
                Geometry
              </Button>
              <Button className="bg-white text-black rounded-md border-2 border-gray-200 hover:bg-gray-100">
                More Topics
              </Button>
            </div>
          </div>
        </div>
        
      </div>
      {/* <div className="absolute bottom-4 right-0 sm:right-8 md:relative md:mt-6 md:right-0">
          <Button
            id="askUsButton"
            variant="fill"
            colorScheme="blue"
            className="rounded-full bg-gradient-primary px-5 py-3 text-white hover:shadow-lg"
          >
            Ask Us
          </Button>
        </div> */}
    </section>
  );
}
