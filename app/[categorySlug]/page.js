import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CATEGORY_META } from '@/lib/utils';
import ShopCard from '../components/ShopCard';
import FAQSection from '../components/FAQSection';
import { Suspense } from 'react';
import FilterBar from '../components/FilterBar';

export async function generateMetadata({ params }) {
  const meta = CATEGORY_META[params.categorySlug];
  if (!meta) return {};
  return {
    title: `${meta.label} — Brew Guide`,
    description: `${meta.description} Browse our full directory of independent coffee shops.`,
  };
}

async function getShopsByCategory(slug) {
  let query = supabase.from('coffee_shops').select('*');
  if (slug === 'coffee-shops-with-wifi') query = query.eq('wifi_yes_no', true);
  else if (slug === 'study-coffee-shops') query = query.ilike('best_for', '%study%');
  else if (slug === 'aesthetic-coffee-shops') query = query.gte('aesthetic_score', 4);
  else if (slug === 'coffee-shops-with-outdoor-seating') query = query.ilike('seating_type', '%outdoor%');
  else if (slug === 'pet-friendly-coffee-shops') query = query.ilike('tags', '%pet%');
  else if (slug === 'specialty-coffee-shops') query = query.gte('coffee_quality', 4);
  return query.order('featured', { ascending: false }).limit(48);
}

export default async function CategoryPage({ params }) {
  const meta = CATEGORY_META[params.categorySlug];
  if (!meta) return notFound();

  const { data: shops } = await getShopsByCategory(params.categorySlug);

  const faqs = [
    {
      question: `What makes a coffee shop "${meta.label}"?`,
      answer: `${meta.description} We verify this through our listing submissions and ongoing curation.`,
    },
    {
      question: `How often is this list updated?`,
      answer: `Our directory is updated regularly as new shops are submitted and verified. Featured listings are refreshed monthly.`,
    },
    {
      question: `Can I filter by city?`,
      answer: `Yes — each city has its own dedicated page. You can also browse the city + category combinations, like "Study Coffee Shops in Austin."`,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-4xl text-espresso-800 mb-3">{meta.label}</h1>
      <div className="prose prose-sm max-w-none text-espresso-600 mb-8 leading-relaxed">
        <p>
          {meta.description} Brew Guide curates only independent coffee shops, so every listing
          here has been reviewed for quality and accuracy. Browse {shops?.length || 0} verified
          locations across the U.S. below.
        </p>
        <p className="mt-3">
          Use the filters to further narrow results by location, features, and vibe. Click any
          listing to view full details including hours, WiFi availability, seating type, and a
          direct link to the shop's website or directions.
        </p>
      </div>

      <div className="mb-8">
        <Suspense>
          <FilterBar />
        </Suspense>
      </div>

      {shops?.length === 0 ? (
        <div className="text-center py-20 text-espresso-400">
          <p className="text-lg font-medium mb-2">No listings yet in this category</p>
          <p className="text-sm">Check back soon — we're adding new shops regularly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}

      <FAQSection faqs={faqs} />
    </div>
  );
}
