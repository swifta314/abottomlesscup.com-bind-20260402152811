'use client';

import ShopCard from '@/app/components/ShopCard';

export default function ClientShopGrid({ initialShops }) {
  if (!initialShops || initialShops.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {initialShops.map((shop) => (
        <ShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  );
}
