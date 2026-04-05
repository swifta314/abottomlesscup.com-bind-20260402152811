import { createClient } from '@/lib/supabase';

export default async function sitemap() {
  const supabase = createClient();
  const { data: shops } = await supabase
    .from('coffee_shops')
    .select('slug, updated_at')
    .eq('status', 'active');

  const baseUrl = 'https://abottomlesscup.com';

  const shopUrls = (shops || []).map((shop) => ({
    url: `${baseUrl}/coffee-shop/${shop.slug}`,
    lastModified: shop.updated_at || new Date().toISOString(),
  }));

  const staticUrls = [
    { url: baseUrl, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/browse`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/about`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/submit`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/contact`, lastModified: new Date().toISOString() },
  ];

  return [...staticUrls, ...shopUrls];
}
