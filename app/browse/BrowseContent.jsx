'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { useSearchParams, useRouter } from 'next/navigation';
import ShopCard from '@/app/components/ShopCard';
import FilterBar from '@/app/components/FilterBar';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const PAGE_SIZE = 12;

export default function BrowseContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
    wifi: searchParams.get('wifi') === 'true',
    outlets: searchParams.get('outlets') === 'true',
    best_for: searchParams.get('best_for') || '',
    noise_level: searchParams.get('noise_level') || '',
  });

  const fetchShops = useCallback(async (currentFilters, currentPage) => {
    setLoading(true);
    try {
      let query = supabase
        .from('coffee_shops')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1)
        .order('created_at', { ascending: false });

      if (currentFilters.search) {
        query = query.or(`name.ilike.%${currentFilters.search}%,city.ilike.%${currentFilters.search}%,description.ilike.%${currentFilters.search}%`);
      }
      if (currentFilters.city) query = query.ilike('city', `%${currentFilters.city}%`);
      if (currentFilters.state) query = query.eq('state', currentFilters.state.toUpperCase());
      if (currentFilters.wifi) query = query.eq('wifi_yes_no', true);
      if (currentFilters.outlets) query = query.eq('outlets_yes_no', true);
      if (currentFilters.best_for) query = query.ilike('best_for', `%${currentFilters.best_for}%`);
      if (currentFilters.noise_level) query = query.eq('noise_level', currentFilters.noise_level);

      const { data, count, error } = await query;
      if (error) throw error;
      setShops(data || []);
      setTotal(count || 0);
    } catch (err) {
      console.error('Error fetching shops:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchShops(filters, page);
  }, [filters, page, fetchShops]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const clearSearch = () => {
    handleFilterChange({ ...filters, search: '' });
  };

  const activeFilterCount = [
    filters.wifi, filters.outlets,
    filters.best_for, filters.noise_level,
    filters.city, filters.state,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E0D8]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-[#1C1410] mb-2">Browse Coffee Shops</h1>
          <p className="text-[#6B6B6B]">Discover independent coffee shops across the United States</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search + Filter Toggle */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B]" />
            <input
              type="text"
              placeholder="Search by name, city, or keyword..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-10 py-3 border border-[#E8E0D8] rounded-xl bg-white text-[#1C1410] placeholder-[#9B9B9B] focus:outline-none focus:border-[#C4956A] focus:ring-1 focus:ring-[#C4956A]"
            />
            {filters.search && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-[#9B9B9B] hover:text-[#1C1410]" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-medium text-sm transition-all ${
              showFilters || activeFilterCount > 0
                ? 'bg-[#1C1410] text-white border-[#1C1410]'
                : 'bg-white text-[#1C1410] border-[#E8E0D8] hover:border-[#C4956A]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-[#C4956A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Bar */}
        {showFilters && (
          <div className="mb-6">
            <FilterBar filters={filters} onChange={handleFilterChange} />
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#6B6B6B]">
            {loading ? 'Loading...' : `${total} shop${total !== 1 ? 's' : ''} found`}
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={() => handleFilterChange({ search: '', city: '', state: '', wifi: false, outlets: false, best_for: '', noise_level: '' })}
              className="text-sm text-[#8B5E3C] hover:text-[#1C1410] font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-[#E8E0D8]" />
            ))}
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">☕</p>
            <h3 className="text-xl font-semibold text-[#1C1410] mb-2">No shops found</h3>
            <p className="text-[#6B6B6B]">Try adjusting your search or clearing filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > PAGE_SIZE && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-5 py-2.5 rounded-xl border border-[#E8E0D8] text-sm font-medium text-[#1C1410] disabled:opacity-40 hover:border-[#C4956A] transition-colors"
            >
              ← Previous
            </button>
            <span className="px-5 py-2.5 text-sm text-[#6B6B6B]">
              Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={(page + 1) * PAGE_SIZE >= total}
              className="px-5 py-2.5 rounded-xl border border-[#E8E0D8] text-sm font-medium text-[#1C1410] disabled:opacity-40 hover:border-[#C4956A] transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
