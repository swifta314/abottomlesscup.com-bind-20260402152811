import { createClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ShopCard from '@/app/components/ShopCard';
import FAQSection from '@/app/components/FAQSection';
import ClientShopGrid from './ClientShopGrid';

const CATEGORIES = [
  { slug: 'study-coffee-shops', label: 'Study', tag: 'study' },
  { slug: 'coffee-shops-with-wifi', label: 'WiFi Friendly', tag: 'wifi' },
  { slug: 'aesthetic-coffee-shops', label: 'Aesthetic', tag: 'aesthetic' },
  { slug: 'coffee-shops-with-outdoor-seating', label: 'Outdoor Seating', tag: 'outdoor' },
  { slug: 'pet-friendly-coffee-shops', label: 'Pet Friendly', tag: 'pet-friendly' },
  { slug: 'specialty-coffee-shops', label: 'Specialty Coffee', tag: 'specialty' },
];

function parseSlug(slug) {
  const decoded = decodeURIComponent(slug);

  // city+category: e.g. study-coffee-shops-new-york or coffee-shops-with-wifi-chicago
  for (const cat of CATEGORIES) {
    const suffix = '-' + cat.slug.replace('coffee-shops-', '').replace('coffee-shops-with-', '');
    if (decoded.startsWith(cat.slug + '-')) {
      const cityPart = decoded.slice(cat.slug.length + 1);
      return { type: 'city-category', categoryTag: cat.tag, categoryLabel: cat.label, cityRaw: cityPart };
    }
  }

  // pure category
  const cat = CATEGORIES.find((c) => c.slug === decoded);
  if (cat) return { type: 'category', ...cat };

  // city: coffee-shops-new-york-ny or coffee-shops-austin-tx
  const cityMatch = decoded.match(/^coffee-shops-(.+)$/);
  if (cityMatch) {
    return { type: 'city', cityRaw: cityMatch[1] };
  }

  return { type: 'unknown' };
}

function rawToCity(raw) {
  return raw
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  const supabase = createClient();

  if (parsed.type === 'city') {
    const city = rawToCity(parsed.cityRaw);
    return {
      title: `Independent Coffee Shops in ${city} | A Bottom Less Cup`,
      description: `Browse the best independent coffee shops in ${city}. Filter by WiFi, seating, vibe, and more.`,
    };
  }
  if (parsed.type === 'category') {
    return {
      title: `${parsed.label} Coffee Shops Across the US | A Bottom Less Cup`,
      description: `Discover the best ${parsed.label.toLowerCase()} coffee shops in the United States.`,
    };
  }
  if (parsed.type === 'city-category') {
    const city = rawToCity(parsed.cityRaw);
    return {
      title: `${parsed.categoryLabel} Coffee Shops in ${city} | A Bottom Less Cup`,
      description: `Find the best ${parsed.categoryLabel.toLowerCase()} coffee shops in ${city}.`,
    };
  }
  return { title: 'A Bottom Less Cup' };
}

export default async function SlugPage({ params }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  const supabase = createClient();

  if (parsed.type === 'unknown') return notFound();

  let shops = [];
  let pageTitle = '';
  let pageSubtitle = '';
  let introText = '';
  let faqs = [];

  if (parsed.type === 'city') {
    const city = rawToCity(parsed.cityRaw);
    const stateAbbr = parsed.cityRaw.split('-').pop().toUpperCase();
    pageTitle = `Independent Coffee Shops in ${city}`;
    pageSubtitle = `Curated by A Bottom Less Cup`;
    introText = `Discover the best independent coffee shops in ${city}. Whether you're looking for a quiet place to work, a cozy corner to read, or the perfect espresso, our curated list covers the full spectrum of what ${city}'s local coffee scene has to offer. Every shop listed here has been selected for its character, quality, and community feel — no chains, no compromises.`;

    const { data } = await supabase
      .from('coffee_shops')
      .select('*')
      .ilike('city', `%${city.split(',')[0]}%`)
      .eq('status', 'active')
      .order('name');
    shops = data || [];

    faqs = [
      { question: `What are the best independent coffee shops in ${city}?`, answer: `Our directory lists the top-rated independent coffee shops in ${city}, covering neighborhoods, vibes, and features like WiFi and seating.` },
      { question: `Do these coffee shops have WiFi?`, answer: `Many shops in our ${city} listings offer free WiFi. Use the WiFi filter on the browse page to narrow your search.` },
      { question: `Are these coffee shops good for remote work?`, answer: `Yes — we specifically tag shops that are remote-work friendly with ample outlets and quiet seating.` },
    ];
  }

  if (parsed.type === 'category') {
    pageTitle = `${parsed.label} Coffee Shops`;
    pageSubtitle = `Across the United States`;
    introText = `Looking for the best ${parsed.label.toLowerCase()} coffee shops in the US? A Bottom Less Cup curates independent shops that match this vibe — hand-picked for quality, character, and what matters most to coffee lovers, students, remote workers, and travelers. Browse our full list below and click through to any listing for full details, directions, and website links.`;

    const { data } = await supabase
      .from('coffee_shops')
      .select('*')
      .contains('tags', [parsed.tag])
      .eq('status', 'active')
      .order('name');
    shops = data || [];

    faqs = [
      { question: `What makes a coffee shop qualify as "${parsed.label}"?`, answer: `We tag shops based on their features, ambiance, and community feedback. Each shop listed here has been reviewed for its ${parsed.label.toLowerCase()} qualities.` },
      { question: `Are these coffee shops nationwide?`, answer: `Yes — our ${parsed.label} category includes independent shops from cities across the United States.` },
      { question: `How do I submit a coffee shop to this category?`, answer: `Use our Submit a Coffee Shop form and include relevant tags. Our team reviews submissions before publishing.` },
    ];
  }

  if (parsed.type === 'city-category') {
    const city = rawToCity(parsed.cityRaw);
    pageTitle = `${parsed.categoryLabel} Coffee Shops in ${city}`;
    pageSubtitle = `Curated by A Bottom Less Cup`;
    introText = `Find the best ${parsed.categoryLabel.toLowerCase()} coffee shops in ${city}. Our curated list focuses on independent shops that match this specific vibe, making it easy to discover your next go-to spot without wading through generic results.`;

    const { data } = await supabase
      .from('coffee_shops')
      .select('*')
      .ilike('city', `%${city.split(',')[0]}%`)
      .contains('tags', [parsed.categoryTag])
      .eq('status', 'active')
      .order('name');
    shops = data || [];

    faqs = [
      { question: `Are there good ${parsed.categoryLabel.toLowerCase()} coffee shops in ${city}?`, answer: `Absolutely. Our list focuses on independent shops in ${city} that specifically match the ${parsed.categoryLabel.toLowerCase()} criteria.` },
      { question: `How often is this list updated?`, answer: `We update our listings regularly. If you know a shop that should be here, submit it via our submission form.` },
    ];
  }

  const relatedCities = ['New York', 'Los Angeles', 'Chicago', 'Austin', 'Seattle', 'Portland', 'Denver', 'Nashville'];
  const relatedCategories = CATEGORIES.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <div className="bg-[#1a1a1a] text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-stone-400 mb-4 flex flex-wrap gap-1">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span className="mx-1">/</span>
            <Link href="/browse" className="hover:text-amber-400 transition-colors">Browse</Link>
            <span className="mx-1">/</span>
            <span className="text-stone-300">{pageTitle}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            {pageTitle}
          </h1>
          <p className="text-stone-400 text-lg">{pageSubtitle}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Intro */}
        <div className="prose prose-stone max-w-none mb-10">
          <p className="text-stone-600 text-lg leading-relaxed">{introText}</p>
        </div>

        {/* Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-stone-500 text-sm">
            {shops.length} {shops.length === 1 ? 'shop' : 'shops'} found
          </p>
        </div>

        {/* Shop Grid */}
        <ClientShopGrid initialShops={shops} />

        {/* Empty state */}
        {shops.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">☕</div>
            <h3 className="text-xl font-semibold text-stone-700 mb-2">No shops listed yet</h3>
            <p className="text-stone-500 mb-6">Be the first to add a coffee shop to this page.</p>
            <Link
              href="/submit"
              className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Submit a Coffee Shop
            </Link>
          </div>
        )}

        {/* Internal Links */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-stone-800 mb-4">Browse by City</h3>
            <div className="flex flex-wrap gap-2">
              {relatedCities.map((city) => {
                const citySlug = city.toLowerCase().replace(/\s/g, '-');
                return (
                  <Link
                    key={city}
                    href={`/coffee-shops-${citySlug}`}
                    className="bg-white border border-stone-200 text-stone-600 px-3 py-1 rounded-full text-sm hover:border-amber-400 hover:text-amber-700 transition-colors"
                  >
                    {city}
                  </Link>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-stone-800 mb-4">Browse by Vibe</h3>
            <div className="flex flex-wrap gap-2">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="bg-white border border-stone-200 text-stone-600 px-3 py-1 rounded-full text-sm hover:border-amber-400 hover:text-amber-700 transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        {faqs.length > 0 && (
          <div className="mt-16">
            <FAQSection faqs={faqs} />
          </div>
        )}
      </div>
    </div>
  );
}
