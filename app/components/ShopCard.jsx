import Link from 'next/link';
import { MapPin, Wifi, Zap } from 'lucide-react';

export default function ShopCard({ shop }) {
  if (!shop) return null;

  return (
    <Link href={`/coffee-shop/${shop.slug}`}
      className="group bg-white rounded-2xl border border-[#E8E0D8] overflow-hidden hover:shadow-lg hover:border-[#C4956A]/40 transition-all duration-200 flex flex-col">
      {/* Image / Placeholder */}
      <div className="h-40 bg-gradient-to-br from-[#F4F0EB] to-[#E8E0D8] flex items-center justify-center relative overflow-hidden">
        <span className="text-4xl group-hover:scale-110 transition-transform duration-300">☕</span>
        {shop.featured && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-[#C4956A] text-white text-xs font-semibold rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-[#1C1410] mb-1 group-hover:text-[#8B5E3C] transition-colors line-clamp-1">
          {shop.name}
        </h3>
        <p className="flex items-center gap-1.5 text-xs text-[#9B9B9B] mb-3">
          <MapPin className="w-3 h-3 shrink-0 text-[#C4956A]" />
          {shop.city}, {shop.state}
        </p>

        {shop.description && (
          <p className="text-sm text-[#6B6B6B] line-clamp-2 mb-3 flex-1">{shop.description}</p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {shop.wifi_yes_no && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-100">
              <Wifi className="w-2.5 h-2.5" /> WiFi
            </span>
          )}
          {shop.outlets_yes_no && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-600 text-xs rounded-full border border-yellow-100">
              <Zap className="w-2.5 h-2.5" /> Outlets
            </span>
          )}
          {shop.best_for && (
            <span className="px-2 py-0.5 bg-[#F4F0EB] text-[#8B5E3C] text-xs rounded-full border border-[#E8E0D8] capitalize">
              {shop.best_for}
            </span>
          )}
          {shop.noise_level && (
            <span className="px-2 py-0.5 bg-[#F4F0EB] text-[#6B6B6B] text-xs rounded-full border border-[#E8E0D8] capitalize">
              {shop.noise_level} noise
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
