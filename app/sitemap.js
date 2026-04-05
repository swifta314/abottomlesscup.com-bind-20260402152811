export default function sitemap() {
  const baseUrl = 'https://abottomlesscup.com';

  // Base static routes
  const routes = [
    '',
    '/browse',
    '/about',
    '/submit',
    '/claim',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // We could also dynamically fetch all active coffee shop slugs from Supabase here
  // and append them to this array to ensure Google indexes every single listing automatically.
  // For now, this establishes the foundational sitemap format.

  return routes;
}
