'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center bg-[#FAFAF8]">
      <span className="text-6xl mb-6">⚠️</span>
      <h1 className="text-4xl font-bold text-[#1C1410] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
        Something went wrong
      </h1>
      <p className="text-[#6B6B6B] mb-8 max-w-md mx-auto text-lg">
        An unexpected error occurred while trying to load this page. Please try again.
      </p>
      <button 
        onClick={() => reset()} 
        className="bg-[#1C1410] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#2D1F17] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
