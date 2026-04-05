'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Coffee, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/browse', label: 'Browse' },
    { href: '/coffee-shops-with-wifi', label: 'WiFi' },
    { href: '/study-coffee-shops', label: 'Study' },
    { href: '/aesthetic-coffee-shops', label: 'Aesthetic' },
    { href: '/submit', label: 'Submit' },
    { href: '/admin', label: 'Admin (CSV)' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-stone-900 text-lg tracking-tight">
            <Coffee className="w-5 h-5 text-amber-600" />
            <span>A Bottom Less Cup</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'text-amber-600'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden p-2 text-stone-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-3 flex flex-col gap-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-medium ${
                pathname === href ? 'text-amber-600' : 'text-stone-700'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
