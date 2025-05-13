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
    <section className="w-full bg-mathz-radial bg-cover bg-no-repeat">
      <Header />
      <div className="relative w-full flex flex-col items-center">
        <div className="w-full flex flex-col justify-center items-center">
          <div className="flex justify-center items-center mt-5">
            <Img
              src="/images/logos/infinity.png"
              alt="Infinity Background"
              width={800}
              height={800}
              priority
              className="absolute mt-40 pointer-events-none select-none"
            />
          </div>

          <div className="flex flex-col justify-center items-center relative text-center">
            <h1 className="headingmd font-semibold leading-tight text-center font-roca">
              <span className="text-black-900_01">Mathz AI is your</span>
              <span className="text-yellow-a400">&nbsp;</span>
              <span className="text-amber-400">#1</span>
              <span className="text-black-900_01">
                &nbsp;Math Buddy
                <br />
              </span>
            </h1>

            <div className="mt-6">
              <h2
                className={`text-center headingmd font-semibold text-black-900_01 transition-opacity duration-700 ${
                  fade ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {displayedText}
                <span className="animate-pulse">|</span>
              </h2>
            </div>

            <p className="text-secondary-text text-xl mt-5 flex justify-start items-center w-[52%] text-center">
              Unlock your math potential through interactive learning. Mathz AI
              is focused to make Math problem-solving faster, smarter, and
              easier.
            </p>

            <div className="w-full mt-10 flex justify-center">
              <Img
                src="/images/logos/ai_tutor.png"
                alt="AI Tutor"
                width={400}
                height={400}
                className="absolute object-contain h-auto max-h-[400px] pointer-events-none select-none right-0 top-[-40px]"
                priority
              />
            </div>
          </div>

          <div className="relative px-4 ml-24 sm:px-0 sm:w-10/12 lg:w-8/12 mt-2 flex flex-col mb-10 justify-center items-center">
            {' '}
            <SuperInput />
            <div className="w-full mt-5 flex flex-wrap gap-3">
              <Button className="bg-white text-secondary-text rounded-lg border border-secondary-border hover:bg-gray-100">
                Calculus
              </Button>
              <Button className="bg-white text-secondary-text rounded-lg border border-secondary-border hover:bg-gray-100">
                Algebra
              </Button>
              <Button className="bg-white text-secondary-text rounded-lg border border-secondary-border hover:bg-gray-100">
                Geometry
              </Button>
              <Button className="bg-white text-secondary-text rounded-lg border border-secondary-border hover:bg-gray-100">
                More Topics
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
