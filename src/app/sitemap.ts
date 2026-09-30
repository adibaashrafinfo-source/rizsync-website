import type { MetadataRoute } from 'next';
import { getServices } from '@/lib/cms/queries';
import { getAllPosts, getCategoriesInUse } from '@/lib/mdx';
import { absoluteUrl } from '@/config/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [services, allPosts, categoriesInUse] = await Promise.all([
    getServices(),
    getAllPosts(),
    getCategoriesInUse(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/about'), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/ceo-profile'), lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/our-team'), lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/nbr-audit-check'), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    {
      url: absoluteUrl('/services'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/insights'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/contact'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/privacy-policy'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    { url: absoluteUrl('/terms'), lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const posts: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: absoluteUrl(`/insights/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  const categories: MetadataRoute.Sitemap = categoriesInUse.map((category) => ({
    url: absoluteUrl(`/insights/category/${category.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.4,
  }));

  return [...staticPages, ...servicePages, ...posts, ...categories];
}
