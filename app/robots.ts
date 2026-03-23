import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Update this with your actual live domain url!
  const baseUrl = 'https://billbuddies.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/login', '/register'],
      disallow: ['/dashboard', '/trips/'], // Keep private user data out of Google
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
