export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.buzzaphq.com';

  const routes = [
    '',
    '/services',
    '/brand',
    '/brand-showcase',
    '/case-studies',
    '/why-buzzap',
    '/products',
    '/pricing',
    '/insights',
    '/booking',
    '/contact',
    '/about',
    '/faq',
    '/ai-solution/system',
    '/demo/video',
  ];

  const currentDate = new Date().toISOString();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/services' || route === '/booking' ? 0.9 : 0.8,
  }));
}
