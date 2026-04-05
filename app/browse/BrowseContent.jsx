'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import ShopCard from '@/app/components/ShopCard';
import FilterBar from '@/app/components/FilterBar';
import SearchBar from '@/app/components/SearchBar';

const PAGE_SIZE = 12;

export default function BrowseContent() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const fetchShops = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from('coffee_shops')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (search) {
      query = query.or(`name.ilike.%${search}%,city.ilike.%${search}%,state.ilike.%${search}%`);
    }
    if (filters.wifi === 'true') query = query.eq('wifi_yes_no', true);
    if (filters.outlets === 'true') query = query.eq('outlets_yes_no', true);
    if (filters.noise_level) query = query.ilike('noise_level', `%${filters.noise_level}%`);
    if (filters.best_for) query = query.ilike('best_for', `%${filters.best_for}%`);

    const { data, count, error } = await query.order('name');
    if (!error) {
      setShops(data || []);
      setTotal(count || 0);
    }
    setLoading(false);
  }, [page, search, filters]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={(val) => { setSearch(val); setPage(0); }}
            placeholder="Search by name, city, or state..."
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors text-sm font-medium whitespace-nowrap"
        >
          <span>⚙</span> Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
        </button>
      </div>

      {showFilters && (
        <FilterBar
          filters={filters}
          onChange={(f) => { setFilters(f); setPage(0); }}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-stone-500">
          {loading ? 'Loading...' : `${total} coffee shop${total !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      ) : shops.length === 0 ? (
        <div className="text-center py-20 text-stone-500">
          <p className="text-lg font-medium mb-2">No coffee shops found</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 bg-white border border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-stone-500">
            Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * PAGE_SIZE >= total}
            className="px-4 py-2 bg-white border border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
