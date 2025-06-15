'use client';

import { useEffect } from 'react';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/header';
import Link from 'next/link';
import Footer from '@/components/layout/footer';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">Oops!</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Something went wrong</h2>

          <p className="text-gray-600 mb-8">
            {error?.message || 'An unexpected error occurred. Please try again.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>

            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}