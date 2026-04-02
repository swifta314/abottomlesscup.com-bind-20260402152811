import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import SearchBar from '@/app/components/SearchBar';
import ShopCard from '@/app/components/ShopCard';

const CITIES = [
  { name: 'New York', state: 'NY', slug: 'coffee-shops-new-york-ny', img: 'photo-1485871981521-5b1fd3805eee' },
  { name: 'Austin', state: 'TX', slug: 'coffee-shops-austin-tx', img: 'photo-1531218150217-54595bc2b934' },
  { name: 'Chicago', state: 'IL', slug: 'coffee-shops-chicago-il', img: 'photo-1477959858617-67f85cf4f1df' },
  { name: 'Los Angeles', state: 'CA', slug: 'coffee-shops-los-angeles-ca', img: 'photo-1534430480872-3498386e7856' },
  { name: 'Seattle', state: 'WA', slug: 'coffee-shops-seattle-wa', img: 'photo-1502175353174-a7a70e73b362' },
  { name: 'Denver', state: 'CO', slug: 'coffee-shops-denver-co', img: 'photo-1619468129361-605ebea04b44' },
];

const CATEGORIES = [
  { name: 'Best for Study', slug: 'study-coffee-shops', icon: '📚', desc: 'Quiet, focused, with reliable WiFi' },
  { name: 'WiFi Friendly', slug: 'coffee-shops-with-wifi', icon: '📶', desc: 'Fast, reliable internet for work' },
  { name: 'Aesthetic Spots', slug: 'aesthetic-coffee-shops', icon: '✨', desc: 'Beautifully designed, photo-worthy' },
  { name: 'Remote Work', slug: 'remote-work-coffee-shops', icon: '💻', desc: 'Outlets, seating, and long-stay vibes' },
  { name: 'Specialty Coffee', slug: 'specialty-coffee-shops', icon: '☕', desc: 'Craft roasts and barista excellence' },
  { name: 'Pet Friendly', slug: 'pet-friendly-coffee-shops', icon: '🐾', desc: 'Bring your four-legged companion' },
];

async function getFeaturedShops() {
  const supabase = createClient();
  const { data } = await supabase
    .from('coffee_shops')
    .select('*')
    .eq('status', 'active')
    .order('aesthetic_score', { ascending: false })
    .limit(6);
  return data || [];
}

export const metadata = {
  title: 'Brew Guide — Discover Independent Coffee Shops Across the U.S.',
  description: 'Find the best independent coffee shops in your city. Filter by WiFi, seating, vibe, and more. The curated guide to coffee shops across America.',
};

export default async function HomePage() {
  const featuredShops = await getFeaturedShops();

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* Hero */}
      <section className="relative bg-[#1C1410] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #8B5E3C 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C4956A 0%, transparent 40%)' }} />
        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#8B5E3C]/40 text-[#C4956A] text-sm font-medium tracking-wide">
            Independent Coffee Shops · All 50 States
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
            Find your next<br />
            <span className="text-[#C4956A]">favorite coffee shop</span>
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto mb-10">
            Discover independently owned coffee shops by city, vibe, and features. WiFi, outlets, seating — all the details that matter.
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Browse by City */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#8B5E3C] font-semibold mb-2">Explore by Location</p>
            <h2 className="text-3xl font-bold text-[#1C1410]">Browse by City</h2>
          </div>
          <Link href="/browse" className="text-sm text-[#8B5E3C] hover:text-[#1C1410] font-medium transition-colors">
            View all cities →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CITIES.map((city) => (
            <Link key={city.slug} href={`/${city.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] block">
              <img
                src={`https://images.unsplash.com/${city.img}?w=600&h=450&fit=crop&q=80`}
                alt={`Coffee shops in ${city.name}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <p className="text-white font-semibold text-lg leading-tight">{city.name}</p>
                <p className="text-white/60 text-sm">{city.state}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by Vibe */}
      <section className="bg-[#F4F0EB] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-[#8B5E3C] font-semibold mb-2">Find Your Vibe</p>
            <h2 className="text-3xl font-bold text-[#1C1410]">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/${cat.slug}`}
                className="bg-white rounded-2xl p-6 hover:shadow-md transition-all group border border-[#E8E0D8] hover:border-[#C4956A]">
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-[#1C1410] mb-1 group-hover:text-[#8B5E3C] transition-colors">{cat.name}</h3>
                <p className="text-sm text-[#6B6B6B]">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Shops */}
      {featuredShops.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8B5E3C] font-semibold mb-2">Editor's Picks</p>
              <h2 className="text-3xl font-bold text-[#1C1410]">Featured Shops</h2>
            </div>
            <Link href="/browse" className="text-sm text-[#8B5E3C] hover:text-[#1C1410] font-medium transition-colors">
              See all shops →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Strip */}
      <section className="bg-[#1C1410] text-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Own a coffee shop?</h2>
          <p className="text-white/60 mb-8 text-lg">Get your shop discovered by remote workers, students, and travelers in your city.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit"
              className="bg-[#C4956A] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#B07D52] transition-colors">
              Submit Your Shop
            </Link>
            <Link href="/claim"
              className="border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
              Claim a Listing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
