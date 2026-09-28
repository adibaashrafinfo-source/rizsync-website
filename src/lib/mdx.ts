import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { slugify } from '@/lib/utils';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'insights');

/** The fixed category set — DESIGN.md §6.5. */
export const insightCategories = [
  'Tax & VAT',
  'RJSC & Compliance',
  'Government Services',
  'Digital Transformation',
  'Islamic Finance',
  'Family Planning',
] as const;

export type InsightCategory = (typeof insightCategories)[number];

export interface PostFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  cover?: string;
  featured?: boolean;
}

export interface Post extends PostFrontmatter {
  content: string;
  readingMinutes: number;
  categorySlug: string;
}

/** Heading extracted for the article table of contents (§6.5). */
export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

function readPostFile(fileName: string): Post | null {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, fileName), 'utf8');
  const { data, content } = matter(raw);
  const front = data as Partial<PostFrontmatter>;

  // A post missing any of these cannot be rendered or linked, so skip it
  // rather than failing the whole build.
  if (!front.title || !front.date || !front.category) return null;

  const slug = front.slug || fileName.replace(/\.mdx?$/, '');

  return {
    title: front.title,
    slug,
    excerpt: front.excerpt || '',
    category: front.category,
    categorySlug: slugify(front.category),
    tags: front.tags || [],
    author: front.author || 'RizSync',
    date: front.date,
    cover: front.cover,
    featured: front.featured ?? false,
    content,
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
  };
}

/** All posts, newest first. */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map(readPostFile)
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPostsByCategorySlug(categorySlug: string): Post[] {
  return getAllPosts().filter((post) => post.categorySlug === categorySlug);
}

/** Categories that actually have posts, with counts, for the listing pills. */
export function getCategoriesInUse() {
  const posts = getAllPosts();
  return insightCategories
    .map((category) => ({
      name: category,
      slug: slugify(category),
      count: posts.filter((post) => post.category === category).length,
    }))
    .filter((category) => category.count > 0);
}

/** The featured post, falling back to the newest one. */
export function getFeaturedPost(): Post | undefined {
  const posts = getAllPosts();
  return posts.find((post) => post.featured) ?? posts[0];
}

/** Up to `limit` posts sharing a category, excluding the current one. */
export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const others = getAllPosts().filter((candidate) => candidate.slug !== post.slug);
  const sameCategory = others.filter(
    (candidate) => candidate.categorySlug === post.categorySlug,
  );
  return [...sameCategory, ...others.filter((p) => !sameCategory.includes(p))].slice(0, limit);
}

/**
 * Pulls H2/H3 headings straight out of the MDX source. Cheaper and more
 * predictable than a rehype pass, and it produces exactly the slugs that
 * `headingId` gives the rendered headings.
 */
export function getToc(content: string): TocEntry[] {
  const entries: TocEntry[] = [];
  let inFence = false;

  for (const line of content.split('\n')) {
    if (line.trimStart().startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const text = match[2].replace(/[*_`]/g, '');
    entries.push({
      id: headingId(text),
      text,
      level: match[1].length === 2 ? 2 : 3,
    });
  }

  return entries;
}

/** Shared between the TOC and the rendered headings so anchors always match. */
export function headingId(text: string): string {
  return slugify(text);
}
