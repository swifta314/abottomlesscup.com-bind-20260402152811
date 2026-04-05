export default function SchemaMarkup({ type, shop, name }) {
  let schema = {};

  if (type === 'CafeOrCoffeeShop' && shop) {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'CafeOrCoffeeShop',
      name: shop.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: shop.address,
        addressLocality: shop.city,
        addressRegion: shop.state,
        addressCountry: 'US',
      },
      ...(shop.phone && { telephone: shop.phone }),
      ...(shop.website && { url: shop.website }),
      ...(shop.hours && { openingHours: shop.hours }),
      ...(shop.description && { description: shop.description }),
    };
  } else if (type === 'CollectionPage' && name) {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name,
      description: `A curated collection of independent coffee shops. ${name}.`,
      provider: { '@type': 'Organization', name: 'A Bottom Less Cup' },
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
