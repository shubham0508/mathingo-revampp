'use client';

import { TRACKED_ENDPOINTS } from '@/lib/apiLoadingMiddleware';
import { useSelector } from 'react-redux';

export function LoadingIndicator() {
  const { loadingStates, globalLoading } = useSelector(
    (state) => state.loading,
  );

  const isLoading =
    globalLoading ||
    Object.entries(loadingStates).some(
      ([endpoint, isLoading]) =>
        TRACKED_ENDPOINTS.includes(endpoint) && isLoading,
    );

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
}