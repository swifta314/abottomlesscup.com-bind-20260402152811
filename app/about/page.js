import Link from 'next/link';

export const metadata = {
  title: 'About Brew Guide — Independent Coffee Shop Directory',
  description: 'Learn about Brew Guide, the curated directory for discovering independent coffee shops across the United States.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-[#8B5E3C] font-semibold mb-3">Our Story</p>
          <h1 className="text-4xl font-bold text-[#1C1410] mb-6">Built for coffee lovers,<br />by coffee lovers</h1>
          <p className="text-lg text-[#6B6B6B] leading-relaxed">
            Brew Guide started with a simple frustration: finding a great independent coffee shop in an unfamiliar city shouldn't require scrolling through hundreds of chain restaurant results or deciphering inconsistent Google Maps reviews.
          </p>
        </div>

        <div className="space-y-8 text-[#4A4A4A] leading-relaxed">
          <p>
            We built Brew Guide as a focused, filterable directory for independent coffee shops across all 50 states. Every listing includes the details that actually matter to remote workers, students, and travelers — WiFi availability, outlet access, seating type, noise level, and hours.
          </p>
          <p>
            Unlike generic map results, we focus exclusively on independently owned shops. No chains. No franchises. Just the places that make local coffee culture worth exploring.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
            {[
              { stat: '50', label: 'States covered', icon: '🗺️' },
              { stat: '100%', label: 'Independent shops only', icon: '☕' },
              { stat: 'Free', label: 'To list your shop', icon: '✨' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E8E0D8] p-6 text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-2xl font-bold text-[#1C1410] mb-1">{item.stat}</div>
                <div className="text-sm text-[#9B9B9B]">{item.label}</div>
              </div>
            ))}
          </div>

          <p>
            Brew Guide is designed to scale. As more shops are added — through our submit form, CSV imports, or future partnerships — the directory grows into the most comprehensive and reliable guide to independent coffee shops in America.
          </p>
        </div>

        <div className="mt-12 flex gap-4">
          <Link href="/submit"
            className="bg-[#1C1410] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#2D1F17] transition-colors text-sm">
            Submit a Shop
          </Link>
          <Link href="/browse"
            className="border border-[#E8E0D8] text-[#1C1410] px-6 py-3 rounded-full font-semibold hover:bg-white transition-colors text-sm">
            Browse Shops
          </Link>
        </div>
      </div>
    </div>
  );
}
