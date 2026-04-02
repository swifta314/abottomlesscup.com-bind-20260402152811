import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ShopCard from '../components/ShopCard';
import FAQSection from '../components/FAQSection';
import FilterBar from '../components/FilterBar';
import { Suspense } from 'react';
import { MapPin } from 'lucide-react';

function parseCitySlug(slug) {
  const match = slug.match(/^coffee-shops-(.+)-([a-z]{2})$/);
  if (!match) return null;
  const city = match[1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const state = match[2].toUpperCase();
  return { city, state };
}

export async function generateMetadata({ params }) {
  const parsed = parseCitySlug(params.citySlug);
  if (!parsed) return {};
  return {
    title: `Best Independent Coffee Shops in ${parsed.city}, ${parsed.state} — Brew Guide`,
    description: `Discover the top independent coffee shops in ${parsed.city}, ${parsed.state}. Find spots with WiFi, outlets, outdoor seating, and great coffee.`,
  };
}

export default async function CityPage({ params }) {
  const parsed = parseCitySlug(params.citySlug);
  if (!parsed) return notFound();

  const { city, state } = parsed;

  const { data: shops } = await supabase
    .from('coffee_shops')
    .select('*')
    .ilike('city', city)
    .eq('state', state)
    .order('featured', { ascending: false });

  const faqs = [
    {
      question: `How many independent coffee shops are in ${city}, ${state}?`,
      answer: `Brew Guide currently lists ${shops?.length || 0} independent coffee shops in ${city}, ${state}. We're always adding new locations as we expand our directory.`,
    },
    {
      question: `Which coffee shops in ${city} have WiFi?`,
      answer: `Use the WiFi filter above to instantly see all coffee shops in ${city} with reliable internet access — great for remote workers and students.`,
    },
    {
      question: `Are these coffee shops independently owned?`,
      answer: `Yes. Brew Guide exclusively features independently owned and operated coffee shops. We do not list national chains or franchises.`,
    },
    {
      question: `How do I get my ${city} coffee shop listed?`,
      answer: `You can submit your shop through our Submit page. Listings are reviewed and typically go live within a few business days.`,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-2 flex items-center gap-1.5 text-xs text-espresso-400">
        <MapPin size={12} />
        <span>{state}</span>
        <span>/</span>
        <span>{city}</span>
      </div>

      <h1 className="font-display text-4xl text-espresso-800 mb-3">
        Independent Coffee Shops in {city}, {state}
      </h1>

      <div className="prose prose-sm max-w-none text-espresso-600 mb-8 leading-relaxed">
        <p>
          {city} has a thriving independent coffee scene, with a growing number of locally owned
          cafés offering everything from specialty pour-overs to cozy study spots. Whether you're
          a remote worker hunting for reliable WiFi, a student looking for a quiet corner, or a
          traveler wanting a taste of the local coffee culture — {city} has a café for you.
        </p>
        <p className="mt-3">
          Browse our curated list of {shops?.length || 0} independent coffee shops in {city},{' '}
          {state} below. Use the filters to narrow by WiFi, outlets, seating style, and more.
          Click any listing to see full details, hours, and a direct link to the shop's website
          or directions.
        </p>
      </div>

      <div className="mb-8">
        <Suspense>
          <FilterBar />
        </Suspense>
      </div>

      {shops?.length === 0 ? (
        <div className="text-center py-20 text-espresso-400">
          <p className="text-lg font-medium mb-2">No listings yet for {city}</p>
          <p className="text-sm">Know a great shop here? Submit it to Brew Guide.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}

      <FAQSection faqs={faqs} />

      <section className="mt-12 pt-8 border-t border-cream-200">
        <h2 className="font-display text-xl text-espresso-800 mb-4">Browse by Category in {city}</h2>
        <div className="flex flex-wrap gap-2">
          {['Study', 'WiFi', 'Aesthetic', 'Outdoor Seating', 'Specialty Coffee'].map((cat) => {
            const slug = cat.toLowerCase().replace(/\s+/g, '-');
            return (
              <a
                key={cat}
                href={`/${slug}-${params.citySlug.replace('coffee-shops-', '')}`}
                className="text-sm border border-cream-200 bg-white rounded-lg px-3 py-1.5 text-espresso-600 hover:border-espresso-400 hover:text-espresso-800 transition-colors"
              >
                {cat} in {city}
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
