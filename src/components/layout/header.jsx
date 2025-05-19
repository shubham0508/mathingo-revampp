'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Img } from '../ui/img';
import { Button } from '../ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Image from 'next/image';

export default function Header({ className }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleLoginClick = () => {
    console.log('Login clicked');
  };

  const handleSolveNowClick = () => {
    console.log('Solve now clicked');
  };

  return (
    <header
      className={`${className}`}
    >
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-evenly">
        <div className="relative z-20 flex items-center">
          <div className='flex flex-col justify-center items-center text-center'>
            <div className="flex gap-1.5 align-middle justify-center">
              <Link href="/">
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
        </div>

        <nav className="hidden md:flex items-start justify-start flex-1">
          <ul className="flex items-start space-x-1 lg:space-x-2 font-medium ml-32">
            <li className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex items-center text-black hover:text-blue-600 px-2 py-1.5 rounded-md transition-colors"
                >
                  <span className="text-base lg:text-lg">Products</span>
                  <ChevronDown size={16} className="ml-1" />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="bg-white shadow-lg rounded-md min-w-[180px] border border-gray-200">
                  <DropdownMenuItem className="px-3 py-2 hover:bg-blue-50 rounded-sm cursor-pointer">
                    <Link href="#" className="block w-full">
                      <span className="text-sm">AI Math Tutor</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-3 py-2 hover:bg-blue-50 rounded-sm cursor-pointer">
                    <Link href="#" className="block w-full">
                      <span className="text-sm">Homework Assignment</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-3 py-2 hover:bg-blue-50 rounded-sm cursor-pointer">
                    <Link href="#" className="block w-full">
                      <span className="text-sm">Smart Solution Check</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>

            <li>
              <Link
                href="#pricing"
                className="block text-black hover:text-blue-600 px-2 py-1.5 rounded-md transition-colors"
              >
                <span className="text-base lg:text-lg">Pricing</span>
              </Link>
            </li>
            <li>
              <Link
                href="#blogs"
                className="block text-black hover:text-blue-600 px-2 py-1.5 rounded-md transition-colors"
              >
                <span className="text-base lg:text-lg">Blogs</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2 lg:gap-3">
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Button
              shape="round"
              onClick={handleLoginClick}
              className="rounded-md border border-black px-3 py-1.5 bg-transparent text-black hover:bg-black/5 transition-colors text-sm lg:text-base"
            >
              Log in
            </Button>
            <Button
              shape="round"
              onClick={handleSolveNowClick}
              className="rounded-md border border-blue-700 bg-primary text-white px-3 py-1.5 hover:bg-blue-700 transition-colors text-sm lg:text-base font-medium"
            >
              Solve now - it's free!
            </Button>
          </div>

          <div className="md:hidden relative z-20">
            <button
              onClick={handleMenuToggle}
              className="text-black p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div
          className={`fixed inset-0 z-10 transition-transform duration-300 transform md:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="flex flex-col h-full pt-20 px-6 bg-white">
            <nav className="flex-1">
              <ul className="space-y-4 font-medium text-lg pt-10">
                <li className="border-b pb-3">
                  <button
                    onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                    className="flex items-center justify-between w-full text-black"
                  >
                    <span>Products</span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${productsDropdownOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  {productsDropdownOpen && (
                    <div className="mt-3 ml-4 space-y-3 p-3 rounded-md">
                      <Link href="#" onClick={handleCloseMenu} className="block py-1">
                        <span className="text-base">AI Math Tutor</span>
                      </Link>
                      <Link href="#" onClick={handleCloseMenu} className="block py-1">
                        <span className="text-base">Homework Assignment</span>
                      </Link>
                      <Link href="#" onClick={handleCloseMenu} className="block py-1">
                        <span className="text-base">Smart Solution Check</span>
                      </Link>
                    </div>
                  )}
                </li>

                <li className="border-b pb-3">
                  <Link
                    href="#pricing"
                    onClick={handleCloseMenu}
                    className="block text-black"
                  >
                    Pricing
                  </Link>
                </li>
                <li className="border-b pb-3">
                  <Link
                    href="#blogs"
                    onClick={handleCloseMenu}
                    className="block text-black"
                  >
                    Blogs
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="py-6 grid grid-cols-2 gap-3">
              <Button
                shape="round"
                onClick={() => {
                  handleLoginClick();
                  handleCloseMenu();
                }}
                className="rounded-md border border-black px-3 py-2 bg-transparent text-black"
              >
                Log in
              </Button>
              <Button
                shape="round"
                onClick={() => {
                  handleSolveNowClick();
                  handleCloseMenu();
                }}
                className="rounded-md border border-blue-700 bg-primary text-white px-3 py-2 font-medium"
              >
                Solve now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}