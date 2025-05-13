'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Img } from '../ui/img';
import { Heading } from '../ui/heading';
import { Button } from '../ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function Header({ className, ...props }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

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
      className={`flex align-middle justify-between items-center mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 ${className}`}
    >
      <div className="flex items-center align-middle justify-between gap-8">
        <div className="flex gap-1.5 align-middle justify-center">
          <Link href="/">
            <Img
              src="/images/icons/company_logo.svg"
              width={100}
              height={100}
              alt="Mathz AI Logo"
              priority
            />
          </Link>
          <h1 className="bg-gradient-secondary font-roca bg-clip-text text2xl !text-transparent font-semibold">
            Mathz AI
          </h1>
        </div>

        <div className="lg:hidden">
          <button
            onClick={handleMenuToggle}
            className="text-black p-2"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation - hides below lg (1024px) */}
        <nav
          className={`lg:flex lg:items-center lg:space-x-6 ${
            menuOpen
              ? 'absolute top-16 left-0 right-0 bg-white shadow-md z-50 px-6 py-8 block'
              : 'hidden'
          }`}
        >
          <ul className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-2 font-avenir font-medium text-lg mt-2">
            {/* Dropdown */}
            <li className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex items-center text-black hover:text-blue-600 p-2 align-middle font-avenir"
                  aria-expanded={productsDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="text-lg">Products</span>
                  <ChevronDown
                    size={16}
                    className={`ml-1 transition-transform ${productsDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="bg-white">
                  <DropdownMenuItem className="px-3 py-2">
                    <Link
                      href="#"
                      onClick={handleCloseMenu}
                      className="block w-full"
                    >
                      <span className="text-sm">AI Math Tutor</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-3 py-2">
                    <Link
                      href="#"
                      onClick={handleCloseMenu}
                      className="block w-full"
                    >
                      <span className="text-sm">Homework Assignment</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-3 py-2">
                    <Link
                      href="#"
                      onClick={handleCloseMenu}
                      className="block w-full"
                    >
                      <span className="text-sm">Smart Solution Check</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>

            <li>
              <Link
                href="#pricing"
                onClick={handleCloseMenu}
                className="block text-black hover:text-blue-600 p-2"
              >
                <span className="text-lg">Pricing</span>
              </Link>
            </li>
            <li>
              <Link
                href="#blogs"
                onClick={handleCloseMenu}
                className="block text-black hover:text-blue-600 p-2"
              >
                <span className="text-lg">Blogs</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Desktop Buttons - hides below lg (1024px) */}
      <div className="hidden lg:flex gap-3">
        <Button
          shape="round"
          onClick={handleLoginClick}
          className="rounded-md border border-black px-3 py-4 bg-transparent text-black duration-200 font-avenir"
        >
          Log in
        </Button>
        <Button
          shape="round"
          onClick={handleSolveNowClick}
          className="rounded-md border border-blue-900 bg-primary text-white px-3 py-4 font-medium hover:bg-blue-700 transition-colors duration-200 font-avenir"
        >
          Solve now- it's free !
        </Button>
      </div>
    </header>
  );
}
