'use client';

import { useState } from 'react';
import ShopCard from '@/app/components/ShopCard';
import FilterBar from '@/app/components/FilterBar';

export default function ClientShopGrid({ initialShops = [] }) {
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const filtered = initialShops.filter((shop) => {
    if (filters.wifi === 'true' && !shop.wifi_yes_no) return false;
    if (filters.outlets === 'true' && !shop.outlets_yes_no) return false;
    if (filters.noise_level && !shop.noise_level?.toLowerCase().includes(filters.noise_level.toLowerCase())) return false;
    if (filters.best_for && !shop.best_for?.toLowerCase().includes(filters.best_for.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-stone-500">
          {filtered.length} shop{filtered.length !== 1 ? 's' : ''}
          {Object.keys(filters).length > 0 ? ' (filtered)' : ''}
        </p>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors text-sm font-medium"
        >
          ⚙ Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
        </button>
      </div>

      {showFilters && (
        <div className="mb-6">
          <FilterBar filters={filters} onChange={setFilters} />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-stone-500">
          <p className="text-lg font-medium mb-2">No shops match your filters</p>
          <button
            onClick={() => setFilters({})}
            className="text-amber-600 hover:underline text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
}
