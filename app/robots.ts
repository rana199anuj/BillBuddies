import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://billbuddies.online';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/login', '/register'],
      disallow: ['/dashboard', '/trips/'], // Keep private user data out of Google
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
