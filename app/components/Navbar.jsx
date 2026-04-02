'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Browse', href: '/browse' },
  { label: 'Cities', href: '/browse?view=cities' },
  { label: 'Submit', href: '/submit' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-[#E8E0D8] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-[#1C1410] tracking-tight">
          <span className="text-2xl">☕</span>
          <span>Brew <span className="text-[#C4956A]">Guide</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'bg-[#F4F0EB] text-[#8B5E3C]'
                  : 'text-[#6B6B6B] hover:text-[#1C1410] hover:bg-[#F4F0EB]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/submit"
            className="ml-3 bg-[#1C1410] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#2D1F17] transition-colors">
            List Your Shop
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#1C1410]"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#E8E0D8] px-6 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'bg-[#F4F0EB] text-[#8B5E3C]'
                  : 'text-[#6B6B6B] hover:text-[#1C1410] hover:bg-[#F4F0EB]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/submit"
            onClick={() => setMobileOpen(false)}
            className="block mt-2 text-center bg-[#1C1410] text-white px-5 py-2.5 rounded-full text-sm font-semibold">
            List Your Shop
          </Link>
        </div>
      )}
    </nav>
  );
}
