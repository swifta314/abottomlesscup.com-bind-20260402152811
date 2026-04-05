import { createClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SchemaMarkup from '@/app/components/SchemaMarkup';
import { MapPin, Globe, Phone, Clock, Wifi, Zap, Users, Volume2 } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = createClient();
  const { data: shop } = await supabase
    .from('coffee_shops')
    .select('name, city, state, description')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (!shop) return { title: 'Shop Not Found' };

  return {
    title: `${shop.name} — ${shop.city}, ${shop.state} | Brew Guide`,
    description: shop.description || `Discover ${shop.name}, an independent coffee shop in ${shop.city}, ${shop.state}. View hours, WiFi, seating, and more.`,
  };
}

export default async function ShopPage({ params }) {
  const { slug } = await params;
  const supabase = createClient();

  const { data: shop, error } = await supabase
    .from('coffee_shops')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error || !shop) notFound();

  const citySlug = `coffee-shops-${shop.city?.toLowerCase().replace(/\s+/g, '-')}-${shop.state?.toLowerCase()}`;

  const featureBadges = [
    shop.wifi_yes_no && { label: 'WiFi', icon: Wifi, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    shop.outlets_yes_no && { label: 'Outlets', icon: Zap, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    shop.seating_type && { label: shop.seating_type, icon: Users, color: 'bg-green-50 text-green-700 border-green-200' },
    shop.noise_level && { label: `${shop.noise_level} noise`, icon: Volume2, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ].filter(Boolean);

  const scores = [
    shop.coffee_quality && { label: 'Coffee Quality', value: shop.coffee_quality },
    shop.aesthetic_score && { label: 'Aesthetic', value: shop.aesthetic_score },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <SchemaMarkup type="CafeOrCoffeeShop" shop={shop} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E8E0D8]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <nav className="text-sm text-[#9B9B9B] flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-[#8B5E3C] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/browse" className="hover:text-[#8B5E3C] transition-colors">Browse</Link>
            <span>/</span>
            <Link href={`/${citySlug}`} className="hover:text-[#8B5E3C] transition-colors">
              {shop.city}, {shop.state}
            </Link>
            <span>/</span>
            <span className="text-[#1C1410]">{shop.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Card */}
            <div className="bg-white rounded-2xl border border-[#E8E0D8] overflow-hidden">
              <div className="h-56 bg-gradient-to-br from-[#C4956A]/20 to-[#8B5E3C]/20 flex items-center justify-center">
                <span className="text-6xl">☕</span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="text-2xl font-bold text-[#1C1410]">{shop.name}</h1>
                  {shop.featured && (
                    <span className="shrink-0 px-3 py-1 bg-[#C4956A]/10 text-[#8B5E3C] text-xs font-semibold rounded-full border border-[#C4956A]/30">
                      Featured
                    </span>
                  )}
                </div>
                <p className="flex items-center gap-2 text-[#6B6B6B] text-sm mb-4">
                  <MapPin className="w-4 h-4 shrink-0 text-[#C4956A]" />
                  {shop.address}, {shop.city}, {shop.state}
                </p>
                {featureBadges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featureBadges.map((badge, i) => (
                      <span key={i} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
                        <badge.icon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    ))}
                  </div>
                )}
                {shop.description && (
                  <p className="text-[#4A4A4A] leading-relaxed">{shop.description}</p>
                )}
              </div>
            </div>

            {/* Details */}
            {(shop.best_for || shop.food_availability || shop.tags) && (
              <div className="bg-white rounded-2xl border border-[#E8E0D8] p-6">
                <h2 className="font-semibold text-[#1C1410] mb-4">About This Shop</h2>
                <dl className="space-y-3 text-sm">
                  {shop.best_for && (
                    <div className="flex gap-3">
                      <dt className="w-32 shrink-0 text-[#9B9B9B]">Best for</dt>
                      <dd className="text-[#1C1410] font-medium capitalize">{shop.best_for}</dd>
                    </div>
                  )}
                  {shop.food_availability && (
                    <div className="flex gap-3">
                      <dt className="w-32 shrink-0 text-[#9B9B9B]">Food</dt>
                      <dd className="text-[#1C1410] font-medium capitalize">{shop.food_availability}</dd>
                    </div>
                  )}
                  {shop.seating_type && (
                    <div className="flex gap-3">
                      <dt className="w-32 shrink-0 text-[#9B9B9B]">Seating</dt>
                      <dd className="text-[#1C1410] font-medium capitalize">{shop.seating_type}</dd>
                    </div>
                  )}
                  {shop.noise_level && (
                    <div className="flex gap-3">
                      <dt className="w-32 shrink-0 text-[#9B9B9B]">Noise level</dt>
                      <dd className="text-[#1C1410] font-medium capitalize">{shop.noise_level}</dd>
                    </div>
                  )}
                  {shop.tags && (
                    <div className="flex gap-3">
                      <dt className="w-32 shrink-0 text-[#9B9B9B]">Tags</dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {shop.tags.split(',').map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[#F4F0EB] text-[#6B6B6B] text-xs rounded-full">
                            {tag.trim()}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Scores */}
            {scores.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E8E0D8] p-6">
                <h2 className="font-semibold text-[#1C1410] mb-4">Ratings</h2>
                <div className="grid grid-cols-2 gap-4">
                  {scores.map((score, i) => (
                    <div key={i} className="text-center p-4 bg-[#FAFAF8] rounded-xl">
                      <p className="text-3xl font-bold text-[#C4956A]">{score.value}<span className="text-base text-[#9B9B9B]">/10</span></p>
                      <p className="text-sm text-[#6B6B6B] mt-1">{score.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* CTA Card */}
            <div className="bg-[#1C1410] rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-4">Visit This Shop</h3>
              <div className="space-y-3">
                {shop.website && (
                  <a href={shop.website.startsWith('http') ? shop.website : `https://${shop.website}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full bg-[#C4956A] hover:bg-[#B07D52] text-white px-4 py-3 rounded-xl font-medium text-sm transition-colors">
                    <Globe className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
                {shop.address && (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name} ${shop.address} ${shop.city} ${shop.state}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-medium text-sm transition-colors">
                    <MapPin className="w-4 h-4" />
                    Get Directions
                  </a>
                )}
              </div>
            </div>

            {/* Contact Info */}
            {(shop.phone || shop.hours) && (
              <div className="bg-white rounded-2xl border border-[#E8E0D8] p-6">
                <h3 className="font-semibold text-[#1C1410] mb-4">Info</h3>
                <div className="space-y-3 text-sm">
                  {shop.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#C4956A] shrink-0" />
                      <a href={`tel:${shop.phone}`} className="text-[#1C1410] hover:text-[#8B5E3C]">{shop.phone}</a>
                    </div>
                  )}
                  {shop.hours && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-[#C4956A] shrink-0 mt-0.5" />
                      <p className="text-[#4A4A4A] whitespace-pre-line">{shop.hours}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Claim Listing */}
            <div className="bg-[#F4F0EB] rounded-2xl p-5 border border-[#E8E0D8]">
              <p className="text-sm text-[#6B6B6B] mb-3">Is this your shop?</p>
              <Link href={`/claim?shop=${encodeURIComponent(shop.name)}&slug=${shop.slug}`}
                className="text-sm font-medium text-[#8B5E3C] hover:text-[#1C1410] transition-colors">
                Claim this listing →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to City */}
      <div className="bg-white border-t border-[#E8E0D8] py-8">
        <div className="max-w-4xl mx-auto px-6">
          <Link href={`/${citySlug}`}
            className="text-sm text-[#8B5E3C] hover:text-[#1C1410] font-medium transition-colors">
            ← Back to coffee shops in {shop.city}, {shop.state}
          </Link>
        </div>
      </div>
    </div>
  );
}
