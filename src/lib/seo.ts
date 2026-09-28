import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

/**
 * Builds a page's metadata with the site OG card attached.
 *
 * Next.js replaces the whole `openGraph` object when a page defines one, so the
 * file-convention image from `app/opengraph-image.tsx` is not inherited by
 * pages that set their own OG fields. Routing every page through this helper
 * keeps the social card on all of them.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  /** Pass false on pages whose title should get the "| RizSync" template. */
  absoluteTitle = true,
  type = 'website',
  image,
  imageAlt,
  article,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  absoluteTitle?: boolean;
  type?: 'website' | 'article';
  image?: string;
  imageAlt?: string;
  article?: { publishedTime: string; authors: string[] };
}): Metadata {
  const images = [{ url: image ?? siteConfig.ogImage, alt: imageAlt ?? title }];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      type,
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: 'en_US',
      images,
      ...(article ?? {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map((entry) => entry.url),
    },
  };
}
