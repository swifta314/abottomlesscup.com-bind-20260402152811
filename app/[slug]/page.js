import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import ClientShopGrid from './ClientShopGrid';
import FAQSection from '@/app/components/FAQSection';
import SchemaMarkup from '@/app/components/SchemaMarkup';

const CATEGORIES = [
  { slug: 'study-coffee-shops', label: 'Study Spots', best_for: 'studying' },
  { slug: 'coffee-shops-with-wifi', label: 'WiFi Friendly', tags: 'wifi' },
  { slug: 'aesthetic-coffee-shops', label: 'Aesthetic', tags: 'aesthetic' },
  { slug: 'coffee-shops-with-outlets', label: 'Outlets Available', tags: 'outlets' },
  { slug: 'quiet-coffee-shops', label: 'Quiet', noise_level: 'quiet' },
  { slug: 'pet-friendly-coffee-shops', label: 'Pet Friendly', tags: 'pet-friendly' },
  { slug: 'coffee-shops-for-remote-work', label: 'Remote Work', best_for: 'remote work' },
  { slug: 'cozy-coffee-shops', label: 'Cozy Vibes', tags: 'cozy' },
];

const US_CITIES = [
  { slug: 'coffee-shops-new-york-ny', city: 'New York', state: 'NY' },
  { slug: 'coffee-shops-los-angeles-ca', city: 'Los Angeles', state: 'CA' },
  { slug: 'coffee-shops-chicago-il', city: 'Chicago', state: 'IL' },
  { slug: 'coffee-shops-austin-tx', city: 'Austin', state: 'TX' },
  { slug: 'coffee-shops-seattle-wa', city: 'Seattle', state: 'WA' },
  { slug: 'coffee-shops-portland-or', city: 'Portland', state: 'OR' },
  { slug: 'coffee-shops-denver-co', city: 'Denver', state: 'CO' },
  { slug: 'coffee-shops-miami-fl', city: 'Miami', state: 'FL' },
  { slug: 'coffee-shops-boston-ma', city: 'Boston', state: 'MA' },
  { slug: 'coffee-shops-nashville-tn', city: 'Nashville', state: 'TN' },
  { slug: 'coffee-shops-san-francisco-ca', city: 'San Francisco', state: 'CA' },
  { slug: 'coffee-shops-washington-dc', city: 'Washington', state: 'DC' },
];

function parseSlug(slug) {
  // Check category match
  const cat = CATEGORIES.find(c => c.slug === slug);
  if (cat) return { type: 'category', category: cat };

  // Check city match
  const cityMatch = US_CITIES.find(c => c.slug === slug);
  if (cityMatch) return { type: 'city', ...cityMatch };

  // Try to parse city+category combo: e.g. "study-coffee-shops-new-york"
  for (const cat of CATEGORIES) {
    for (const city of US_CITIES) {
      const combo = `${cat.slug}-${city.city.toLowerCase().replace(/\s+/g, '-')}`;
      if (slug === combo) {
        return { type: 'city_category', category: cat, city: city.city, state: city.state };
      }
    }
  }

  // Try dynamic city parse: coffee-shops-{city}-{state}
  const cityPattern = /^coffee-shops-(.+)-([a-z]{2})$/;
  const match = slug.match(cityPattern);
  if (match) {
    const city = match[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const state = match[2].toUpperCase();
    return { type: 'city', city, state };
  }

  return { type: 'unknown' };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  const siteName = 'A Bottom Less Cup';

  if (parsed.type === 'city') {
    return {
      title: `Best Independent Coffee Shops in ${parsed.city}, ${parsed.state} | ${siteName}`,
      description: `Discover the best independent coffee shops in ${parsed.city}, ${parsed.state}. Browse by vibe, WiFi, seating, and more.`,
    };
  }
  if (parsed.type === 'category') {
    return {
      title: `${parsed.category.label} Coffee Shops in the US | ${siteName}`,
      description: `Find the best ${parsed.category.label.toLowerCase()} coffee shops across the United States on ${siteName}.`,
    };
  }
  if (parsed.type === 'city_category') {
    return {
      title: `Best ${parsed.category.label} Coffee Shops in ${parsed.city}, ${parsed.state} | ${siteName}`,
      description: `Looking for ${parsed.category.label.toLowerCase()} coffee shops in ${parsed.city}? Browse curated picks on ${siteName}.`,
    };
  }
  return { title: siteName };
}

async function fetchShops(parsed) {
  const supabase = createClient();
  let query = supabase.from('coffee_shops').select('*').eq('status', 'active');

  if (parsed.type === 'city') {
    query = query.ilike('city', parsed.city).ilike('state', parsed.state);
  } else if (parsed.type === 'category') {
    const cat = parsed.category;
    if (cat.best_for) query = query.ilike('best_for', `%${cat.best_for}%`);
    else if (cat.tags) query = query.ilike('tags', `%${cat.tags}%`);
    else if (cat.noise_level) query = query.ilike('noise_level', `%${cat.noise_level}%`);
  } else if (parsed.type === 'city_category') {
    query = query.ilike('city', parsed.city).ilike('state', parsed.state);
    const cat = parsed.category;
    if (cat.best_for) query = query.ilike('best_for', `%${cat.best_for}%`);
    else if (cat.tags) query = query.ilike('tags', `%${cat.tags}%`);
  }

  const { data, error } = await query.order('name').limit(100);
  if (error) {
    console.error('fetchShops error:', error.message);
    return [];
  }
  return data || [];
}

const CITY_FAQS = (city, state) => [
  { question: `What are the best independent coffee shops in ${city}, ${state}?`, answer: `A Bottom Less Cup curates the top-rated independent coffee shops in ${city}, ${state}, featuring places known for quality coffee, great atmosphere, and unique character.` },
  { question: `Which coffee shops in ${city} have WiFi?`, answer: `Many shops listed in ${city} offer free WiFi. Filter by WiFi on each listing to find the best spots for remote work or studying.` },
  { question: `Are there quiet coffee shops in ${city} for studying?`, answer: `Yes! Use the filters on this page to find quiet, study-friendly coffee shops in ${city} with comfortable seating and reliable WiFi.` },
  { question: `How do I add my coffee shop to A Bottom Less Cup?`, answer: `Visit our Submit a Coffee Shop page to add your independent shop to our directory. It's free and easy.` },
];

const CATEGORY_FAQS = (label) => [
  { question: `What makes a coffee shop great for ${label.toLowerCase()}?`, answer: `The best ${label.toLowerCase()} coffee shops offer a combination of comfortable seating, reliable WiFi, quality coffee, and a welcoming atmosphere.` },
  { question: `How are these coffee shops selected?`, answer: `A Bottom Less Cup curates listings based on community submissions, verified features, and editorial review. Every shop is independently owned.` },
  { question: `Can I filter by city?`, answer: `Yes. Use the search bar or browse our city pages to find ${label.toLowerCase()} coffee shops near you.` },
  { question: `How do I submit a coffee shop?`, answer: `Visit our Submit a Coffee Shop page to add your favorite independent shop to the directory.` },
];

export default async function SlugPage({ params }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  const shops = await fetchShops(parsed);

  if (parsed.type === 'unknown') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800 mb-4">Page Not Found</h1>
          <Link href="/" className="text-amber-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  const isCity = parsed.type === 'city';
  const isCategory = parsed.type === 'category';
  const isCityCategory = parsed.type === 'city_category';

  const title = isCity
    ? `Independent Coffee Shops in ${parsed.city}, ${parsed.state}`
    : isCategory
    ? `${parsed.category.label} Coffee Shops`
    : `${parsed.category.label} Coffee Shops in ${parsed.city}, ${parsed.state}`;

  const intro = isCity
    ? `Discover the best independent coffee shops in ${parsed.city}, ${parsed.state}. Whether you are looking for a quiet place to work, a cozy spot to catch up with friends, or simply the best espresso in the city, A Bottom Less Cup has you covered. Every listing is independently owned and verified by our community.`
    : isCategory
    ? `Find the best ${parsed.category.label.toLowerCase()} coffee shops across the United States. A Bottom Less Cup curates independent shops that match the vibe you are looking for — no chains, no fluff, just great coffee and honest recommendations.`
    : `Looking for ${parsed.category.label.toLowerCase()} coffee shops in ${parsed.city}, ${parsed.state}? You have come to the right place. A Bottom Less Cup curates the top independent coffee shops that match your vibe and needs — right in your city.`;

  const faqs = isCity
    ? CITY_FAQS(parsed.city, parsed.state)
    : CATEGORY_FAQS(parsed.category?.label || 'this category');

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Browse', href: '/browse' },
    { label: isCity ? `${parsed.city}, ${parsed.state}` : parsed.category?.label, href: `/${slug}` },
  ];

  return (
    <>
      {isCity && (
        <SchemaMarkup
          type="city"
          data={{ city: parsed.city, state: parsed.state, count: shops.length }}
        />
      )}

      <div className="min-h-screen bg-stone-50">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-stone-500">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span>/</span>}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-stone-700 font-medium">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-amber-600 transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
            <div className="max-w-3xl">
              {(isCategory || isCityCategory) && (
                <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                  {parsed.category.label}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight">
                {title}
              </h1>
              <p className="text-stone-600 text-base md:text-lg leading-relaxed mb-4">
                {intro}
              </p>
              <p className="text-sm text-stone-500">
                {shops.length > 0
                  ? `Showing ${shops.length} independent coffee shop${shops.length !== 1 ? 's' : ''}`
                  : 'No listings yet — check back soon or submit one below.'}
              </p>
            </div>
          </div>
        </div>

        {/* Shop Grid */}
        <div className="max-w-6xl mx-auto px-4 py-10">
          <ClientShopGrid initialShops={shops} />
        </div>

        {/* Internal Links */}
        <div className="bg-white border-t border-stone-200">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-lg font-semibold text-stone-800 mb-5">
              {isCity ? 'Browse by Category' : 'Browse by City'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {isCity
                ? CATEGORIES.map(cat => (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}`}
                      className="bg-stone-100 hover:bg-amber-50 hover:text-amber-700 text-stone-700 text-sm px-4 py-2 rounded-full transition-colors border border-stone-200"
                    >
                      {cat.label}
                    </Link>
                  ))
                : US_CITIES.map(city => (
                    <Link
                      key={city.slug}
                      href={`/${city.slug}`}
                      className="bg-stone-100 hover:bg-amber-50 hover:text-amber-700 text-stone-700 text-sm px-4 py-2 rounded-full transition-colors border border-stone-200"
                    >
                      {city.city}, {city.state}
                    </Link>
                  ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-6xl mx-auto px-4 py-10">
          <FAQSection faqs={faqs} />
        </div>

        {/* Submit CTA */}
        <div className="bg-amber-50 border-t border-amber-100">
          <div className="max-w-6xl mx-auto px-4 py-10 text-center">
            <h2 className="text-xl font-bold text-stone-800 mb-2">Know a great coffee shop?</h2>
            <p className="text-stone-600 mb-5">Help the community discover it. Submissions are free and take less than 2 minutes.</p>
            <Link
              href="/submit"
              className="inline-block bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Submit a Coffee Shop
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
