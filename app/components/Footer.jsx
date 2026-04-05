import Link from 'next/link';

const CITIES = [
  { name: 'New York', href: '/coffee-shops-new-york-ny' },
  { name: 'Austin', href: '/coffee-shops-austin-tx' },
  { name: 'Chicago', href: '/coffee-shops-chicago-il' },
  { name: 'Los Angeles', href: '/coffee-shops-los-angeles-ca' },
  { name: 'Seattle', href: '/coffee-shops-seattle-wa' },
  { name: 'Denver', href: '/coffee-shops-denver-co' },
];

const CATEGORIES = [
  { name: 'Study Spots', href: '/study-coffee-shops' },
  { name: 'WiFi Friendly', href: '/coffee-shops-with-wifi' },
  { name: 'Remote Work', href: '/remote-work-coffee-shops' },
  { name: 'Aesthetic', href: '/aesthetic-coffee-shops' },
  { name: 'Specialty Coffee', href: '/specialty-coffee-shops' },
];

export default function Footer() {
  return (
    <footer className="bg-[#1C1410] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-1 sm:col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3">
            <span className="text-2xl">☕</span>
            <span>A Bottom Less <span className="text-[#C4956A]">Cup</span></span>
          </Link>
          <p className="text-white/50 text-sm leading-relaxed">
            The curated directory for independent coffee shops across the United States.
          </p>
        </div>

        {/* Cities */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-4">Cities</h4>
          <ul className="space-y-2">
            {CITIES.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="text-sm text-white/60 hover:text-white transition-colors">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-4">Categories</h4>
          <ul className="space-y-2">
            {CATEGORIES.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="text-sm text-white/60 hover:text-white transition-colors">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Pages */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-4">Platform</h4>
          <ul className="space-y-2">
            {[
              { name: 'Browse All', href: '/browse' },
              { name: 'Submit a Shop', href: '/submit' },
              { name: 'Claim a Listing', href: '/claim' },
              { name: 'About', href: '/about' },
              { name: 'Contact', href: '/contact' },
              { name: 'Admin (CSV Import)', href: '/admin' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">{l.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <p className="text-center text-xs text-white/30">
          © {new Date().getFullYear()} A Bottom Less Cup · Independent Coffee Shop Directory
        </p>
      </div>
    </footer>
  );
}
