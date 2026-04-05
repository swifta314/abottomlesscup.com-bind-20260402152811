import { Suspense } from 'react';
import BrowseContent from './BrowseContent';

export const metadata = {
  title: 'Browse All Coffee Shops — Brew Guide',
  description: 'Browse independent coffee shops across the United States. Filter by city, WiFi, seating, and vibe.',
};

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#C4956A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#6B6B6B] text-sm">Loading shops...</p>
        </div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
