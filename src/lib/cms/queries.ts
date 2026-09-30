import { unstable_cache } from 'next/cache';
import readingTime from 'reading-time';
import { createSupabasePublicClient } from '@/lib/supabase/server';
import { supabaseConfigured } from '@/lib/supabase/config';
import { defaultSettings, resolveSiteConfig } from '@/config/site';
import { defaultHome } from '@/data/home';
import { defaultAbout } from '@/data/about';
import { defaultCeo } from '@/data/ceo';
import { defaultServices } from '@/data/services';
import { defaultTeam } from '@/data/team';
import { defaultTestimonials } from '@/data/testimonials';
import { defaultFaqs } from '@/data/faqs';
import { slugify } from '@/lib/utils';
import type {
  AboutContent,
  CeoContent,
  Faq,
  HomeContent,
  Service,
  SiteConfig,
  SiteSettings,
  TeamMember,
  Testimonial,
} from '@/lib/cms/types';

/**
 * Public reads for the website. Every getter:
 *   - reads through `unstable_cache` tagged `cms`, so pages stay static and
 *     the admin panel refreshes them on save (`revalidateTag('cms')`);
 *   - falls back to the bundled defaults when Supabase is not configured or
 *     cannot be reached, so the site never renders empty.
 * Errors are thrown inside the cached function so a failure is never cached.
 */

export const CMS_TAG = 'cms';
const REVALIDATE_SECONDS = 3600;

function cached<T>(key: string, fn: () => Promise<T>) {
  return unstable_cache(fn, ['cms', key], { tags: [CMS_TAG], revalidate: REVALIDATE_SECONDS });
}

async function withFallback<T>(load: () => Promise<T>, fallback: T, label: string): Promise<T> {
  if (!supabaseConfigured) return fallback;
  try {
    return await load();
  } catch (error) {
    console.warn(`[cms] ${label}: using bundled defaults`, (error as Error)?.message ?? error);
    return fallback;
  }
}

/** Deep-merges stored JSON over defaults so new fields never arrive undefined. */
export function mergeDefaults<T>(defaults: T, stored: unknown): T {
  if (stored === null || stored === undefined) return defaults;
  if (Array.isArray(defaults)) return (Array.isArray(stored) ? stored : defaults) as T;
  if (typeof defaults === 'object' && defaults !== null) {
    if (typeof stored !== 'object' || Array.isArray(stored)) return defaults;
    const result: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };
    for (const [key, value] of Object.entries(stored as Record<string, unknown>)) {
      result[key] = key in result ? mergeDefaults(result[key], value) : value;
    }
    return result as T;
  }
  return (typeof stored === typeof defaults ? stored : defaults) as T;
}

/* ------------------------------------------------------------- documents */

const loadDocs = cached('site_content', async () => {
  const { data, error } = await createSupabasePublicClient()
    .from('site_content')
    .select('key, data');
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((row) => [row.key, row.data])) as Record<
    string,
    unknown
  >;
});

export async function getSiteSettings(): Promise<SiteSettings> {
  return withFallback(
    async () => mergeDefaults(defaultSettings, (await loadDocs()).settings),
    defaultSettings,
    'settings',
  );
}

export async function getSiteConfig(): Promise<SiteConfig> {
  return resolveSiteConfig(await getSiteSettings());
}

export async function getHomeContent(): Promise<HomeContent> {
  return withFallback(
    async () => mergeDefaults(defaultHome, (await loadDocs()).home),
    defaultHome,
    'home',
  );
}

export async function getAboutContent(): Promise<AboutContent> {
  return withFallback(
    async () => mergeDefaults(defaultAbout, (await loadDocs()).about),
    defaultAbout,
    'about',
  );
}

export async function getCeoContent(): Promise<CeoContent> {
  return withFallback(
    async () => mergeDefaults(defaultCeo, (await loadDocs()).ceo),
    defaultCeo,
    'ceo',
  );
}

/* -------------------------------------------------------------- services */

export interface ServiceRow {
  id: string;
  slug: string;
  sort_order: number;
  published: boolean;
  title: string;
  short_title: string;
  h1: string;
  nav_description: string;
  intro: string;
  color: Service['color'];
  icon: string;
  bullets: string[];
  hero_card: Service['heroCard'];
  items: Service['items'];
  why_rizsync: Service['whyRizsync'];
  faqs: Faq[];
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
}

export function serviceFromRow(row: ServiceRow, index: number): Service {
  const heroCard =
    row.hero_card && (row.hero_card.title || row.hero_card.subtitle) ? row.hero_card : null;
  return {
    id: row.id,
    slug: row.slug,
    number: String(index + 1).padStart(2, '0'),
    title: row.title,
    shortTitle: row.short_title || row.title,
    heroCard,
    h1: row.h1 || row.title,
    navDescription: row.nav_description,
    intro: row.intro,
    color: row.color,
    icon: row.icon,
    bullets: row.bullets ?? [],
    items: row.items ?? [],
    whyRizsync: row.why_rizsync ?? [],
    faqs: row.faqs ?? [],
    seo: {
      title: row.seo_title || row.title,
      description: row.seo_description || row.nav_description,
      keywords: row.seo_keywords ?? [],
    },
  };
}

const loadServices = cached('services', async () => {
  const { data, error } = await createSupabasePublicClient()
    .from('services')
    .select('*')
    .eq('published', true)
    .order('sort_order')
    .order('created_at');
  if (error) throw error;
  return (data as ServiceRow[]).map(serviceFromRow);
});

export async function getServices(): Promise<Service[]> {
  return withFallback(loadServices, defaultServices, 'services');
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  return (await getServices()).find((service) => service.slug === slug);
}

/* ----------------------------------------------------- team, voices, faqs */

const loadTeam = cached('team', async () => {
  const { data, error } = await createSupabasePublicClient()
    .from('team_members')
    .select('id, name, title, bio, photo, linkedin, email')
    .eq('published', true)
    .order('sort_order')
    .order('created_at');
  if (error) throw error;
  return data as TeamMember[];
});

export async function getTeam(): Promise<TeamMember[]> {
  return withFallback(loadTeam, defaultTeam, 'team');
}

const loadTestimonials = cached('testimonials', async () => {
  const { data, error } = await createSupabasePublicClient()
    .from('testimonials')
    .select('id, quote, name, role, company, rating, photo')
    .eq('published', true)
    .order('sort_order')
    .order('created_at');
  if (error) throw error;
  return data as Testimonial[];
});

export async function getTestimonials(): Promise<Testimonial[]> {
  return withFallback(loadTestimonials, defaultTestimonials, 'testimonials');
}

const loadFaqs = cached('faqs', async () => {
  const { data, error } = await createSupabasePublicClient()
    .from('faqs')
    .select('question, answer')
    .eq('published', true)
    .order('sort_order')
    .order('created_at');
  if (error) throw error;
  return data as Faq[];
});

export async function getFaqs(): Promise<Faq[]> {
  return withFallback(loadFaqs, defaultFaqs, 'faqs');
}

/* -------------------------------------------------------------- insights */

export interface Post {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  tags: string[];
  author: string;
  date: string;
  cover?: string;
  featured?: boolean;
  content: string;
  readingMinutes: number;
}

export interface InsightRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  published_on: string;
  cover: string | null;
  featured: boolean;
  content: string;
  published: boolean;
}

export function postFromRow(row: InsightRow): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    category: row.category,
    categorySlug: slugify(row.category),
    tags: row.tags ?? [],
    author: row.author,
    date: row.published_on,
    cover: row.cover || undefined,
    featured: row.featured,
    content: row.content,
    readingMinutes: Math.max(1, Math.round(readingTime(row.content).minutes)),
  };
}

const loadPosts = cached('insights', async () => {
  const { data, error } = await createSupabasePublicClient()
    .from('insights')
    .select('*')
    .eq('published', true)
    .order('published_on', { ascending: false });
  if (error) throw error;
  return (data as InsightRow[]).map(postFromRow);
});

/** DB posts, or the MDX files in `content/insights` as the fallback. */
export async function getPostsFromCms(fallback: () => Post[]): Promise<Post[]> {
  if (!supabaseConfigured) return fallback();
  try {
    return await loadPosts();
  } catch (error) {
    console.warn('[cms] insights: using bundled MDX', (error as Error)?.message ?? error);
    return fallback();
  }
}
