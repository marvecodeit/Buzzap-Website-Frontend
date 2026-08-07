export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.buzzaphq.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/private/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
