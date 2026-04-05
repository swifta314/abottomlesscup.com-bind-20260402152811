import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found — A Bottom Less Cup',
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center bg-[#FAFAF8]">
      <span className="text-6xl mb-6">☕️</span>
      <h1 className="text-4xl font-bold text-[#1C1410] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
        Page Not Found
      </h1>
      <p className="text-[#6B6B6B] mb-8 max-w-md mx-auto text-lg">
        We couldn&apos;t find the coffee shop or page you were looking for. It might have been moved or removed.
      </p>
      <Link 
        href="/" 
        className="bg-[#C4956A] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#B07D52] transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
