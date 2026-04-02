import { createClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ShopCard from '@/app/components/ShopCard';
import FAQSection from '@/app/components/FAQSection';
import SchemaMarkup from '@/app/components/SchemaMarkup';

// City slug pattern: coffee-shops-{city}-{state}
// Category slug pattern: {category}-coffee-shops or coffee-shops-with-{feature}
function parseSlug(slug) {
  const cityMatch = slug.match(/^coffee-shops-(.+)-([a-z]{2})$/);
  if (cityMatch) {
    const city = cityMatch[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const state = cityMatch[2].toUpperCase();
    return { type: 'city', city, state, slug };
  }

  const CATEGORY_MAP = {
    'study-coffee-shops': { label: 'Study', best_for: 'study', description: 'quiet, focused environments with reliable WiFi' },
    'coffee-shops-with-wifi': { label: 'WiFi Friendly', wifi: true, description: 'fast and reliable WiFi connections' },
    'aesthetic-coffee-shops': { label: 'Aesthetic', aesthetic: true, description: 'beautifully designed, photo-worthy spaces' },
    'remote-work-coffee-shops': { label: 'Remote Work', best_for: 'remote work', description: 'outlets, seating, and long-stay friendly vibes' },
    'specialty-coffee-shops': { label: 'Specialty Coffee', description: 'craft roasts and barista excellence' },
    'pet-friendly-coffee-shops': { label: 'Pet Friendly', description: 'welcoming spaces for you and your pet' },
  };

  if (CATEGORY_MAP[slug]) {
    return { type: 'category', ...CATEGORY_MAP[slug], slug };
  }

  // City + Category combos: {category}-{city} or coffee-shops-with-{feature}-{city}
  for (const [catSlug, catData] of Object.entries(CATEGORY_MAP)) {
    const cityPart = slug.replace(catSlug + '-', '');
    if (cityPart !== slug && cityPart.length > 0) {
      const city = cityPart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return { type: 'city+category', city, ...catData, slug };
    }
  }

  return null;
}

async function fetchShopsForPage(parsed) {
  const supabase = createClient();
  let query = supabase.from('coffee_shops').select('*').eq('status', 'active').limit(24);

  if (parsed.type === 'city') {
    query = query.ilike('city', parsed.city).eq('state', parsed.state);
  } else if (parsed.type === 'category') {
    if (parsed.wifi) query = query.eq('wifi_yes_no', true);
    if (parsed.best_for) query = query.ilike('best_for', `%${parsed.best_for}%`);
  } else if (parsed.type === 'city+category') {
    query = query.ilike('city', parsed.city);
    if (parsed.wifi) query = query.eq('wifi_yes_no', true);
    if (parsed.best_for) query = query.ilike('best_for', `%${parsed.best_for}%`);
  }

  const { data } = await query.order('created_at', { ascending: false });
  return data || [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return { title: 'Not Found' };

  if (parsed.type === 'city') {
    return {
      title: `Best Independent Coffee Shops in ${parsed.city}, ${parsed.state} — Brew Guide`,
      description: `Discover the best independent coffee shops in ${parsed.city}, ${parsed.state}. Filter by WiFi, seating, noise level, and more.`,
    };
  }
  return {
    title: `${parsed.label} Coffee Shops — Brew Guide`,
    description: `Find the best ${parsed.label?.toLowerCase()} coffee shops across the U.S. Curated for ${parsed.description}.`,
  };
}

export default async function SlugPage({ params }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);

  if (!parsed) notFound();

  const shops = await fetchShopsForPage(parsed);

  const isCity = parsed.type === 'city';
  const pageTitle = isCity
    ? `Coffee Shops in ${parsed.city}, ${parsed.state}`
    : `${parsed.label} Coffee Shops`;

  const intro = isCity
    ? `Whether you're a remote worker hunting for reliable WiFi, a student looking for a quiet corner, or a traveler wanting to taste the local scene — ${parsed.city} has a rich independent coffee culture worth exploring. Below you'll find a curated list of independently owned coffee shops in ${parsed.city}, ${parsed.state}, each with detailed information on seating, WiFi, noise level, and more so you can find exactly the right spot for your needs.`
    : `Finding a coffee shop that matches your vibe shouldn't require scrolling through dozens of generic map results. This curated list focuses on independently owned shops known for ${parsed.description} — spaces that were purpose-built for people who care about their environment as much as their espresso. Every listing has been reviewed for the features that matter most.`;

  const faqs = isCity
    ? [
        { q: `What are the best independent coffee shops in ${parsed.city}?`, a: `We've curated a list of the top-rated independent coffee shops in ${parsed.city}, ${parsed.state} based on WiFi reliability, seating comfort, noise level, and overall atmosphere. Browse the listings above to find your perfect match.` },
        { q: `Which coffee shops in ${parsed.city} have WiFi?`, a: `Many of the shops listed on this page offer free WiFi. Use the WiFi filter to narrow down your options quickly.` },
        { q: `Are there coffee shops in ${parsed.city} good for remote work?`, a: `Yes — several shops in ${parsed.city} are listed as remote-work friendly with outlets, stable WiFi, and relaxed long-stay policies.` },
        { q: `How do I submit a coffee shop in ${parsed.city}?`, a: `Use our Submit a Shop form to add a new independent coffee shop to our directory. Submissions are reviewed before going live.` },
      ]
    : [
        { q: `What makes a coffee shop good for ${parsed.label?.toLowerCase()}?`, a: `The best ${parsed.label?.toLowerCase()} coffee shops offer ${parsed.description}. We evaluate each shop based on community feedback and direct verification.` },
        { q: `How are these coffee shops selected?`, a: `Every shop in our directory is independently owned and verified. We prioritize shops with strong community reputations and accurate, up-to-date information.` },
        { q: `Can I filter by city too?`, a: `Yes — use the search bar at the top of the browse page to narrow results by city, or explore our city pages for location-specific listings.` },
        { q: `How do I add my coffee shop to this category?`, a: `Submit your shop using the Submit a Shop form. Make sure to tag it with relevant features so it appears in the right category pages.` },
      ];

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <SchemaMarkup type="CollectionPage" name={pageTitle} />

      {/* Header */}
      <div className="bg-white border-b border-[#E8E0D8]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <nav className="text-sm text-[#9B9B9B] mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-[#8B5E3C] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/browse" className="hover:text-[#8B5E3C] transition-colors">Browse</Link>
            <span>/</span>
            <span className="text-[#1C1410]">{pageTitle}</span>
          </nav>
          <h1 className="text-4xl font-bold text-[#1C1410] mb-4">{pageTitle}</h1>
          <p className="text-[#6B6B6B] leading-relaxed max-w-2xl">{intro}</p>
        </div>
      </div>

      {/* Shop Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {shops.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E0D8]">
            <p className="text-4xl mb-4">☕</p>
            <h3 className="text-xl font-semibold text-[#1C1410] mb-2">No shops listed yet</h3>
            <p className="text-[#6B6B6B] mb-6">Be the first to add a shop in this area.</p>
            <Link href="/submit"
              className="inline-block bg-[#C4956A] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#B07D52] transition-colors">
              Submit a Shop
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#6B6B6B] mb-6">{shops.length} shop{shops.length !== 1 ? 's' : ''} listed</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Internal Links */}
      <div className="bg-[#F4F0EB] py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-xl font-semibold text-[#1C1410] mb-6">Explore More</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'New York', href: '/coffee-shops-new-york-ny' },
              { label: 'Austin', href: '/coffee-shops-austin-tx' },
              { label: 'Chicago', href: '/coffee-shops-chicago-il' },
              { label: 'Seattle', href: '/coffee-shops-seattle-wa' },
              { label: 'Study Spots', href: '/study-coffee-shops' },
              { label: 'WiFi Friendly', href: '/coffee-shops-with-wifi' },
              { label: 'Remote Work', href: '/remote-work-coffee-shops' },
              { label: 'Aesthetic', href: '/aesthetic-coffee-shops' },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="px-4 py-2 bg-white rounded-full text-sm text-[#1C1410] border border-[#E8E0D8] hover:border-[#C4956A] hover:text-[#8B5E3C] transition-all">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <FAQSection faqs={faqs} />
    </div>
  );
}
