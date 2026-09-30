import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { slugify } from '@/lib/utils';
import { insightCategories } from '@/lib/categories';
import { getPostsFromCms, type Post } from '@/lib/cms/queries';

export { insightCategories, categoryColor, type InsightCategory } from '@/lib/categories';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'insights');

export type { Post } from '@/lib/cms/queries';

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

/** The MDX files in `content/insights` — seed data and offline fallback. */
export function readMdxPosts(): Post[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map(readPostFile)
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** All published posts, newest first — from the CMS, or the MDX files. */
export function getAllPosts(): Promise<Post[]> {
  return getPostsFromCms(readMdxPosts);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return (await getAllPosts()).find((post) => post.slug === slug);
}

export async function getPostsByCategorySlug(categorySlug: string): Promise<Post[]> {
  return (await getAllPosts()).filter((post) => post.categorySlug === categorySlug);
}

/** Categories that actually have posts, with counts, for the listing pills. */
export async function getCategoriesInUse() {
  const posts = await getAllPosts();
  const names = Array.from(new Set([...insightCategories, ...posts.map((post) => post.category)]));
  return names
    .map((category) => ({
      name: category,
      slug: slugify(category),
      count: posts.filter((post) => post.category === category).length,
    }))
    .filter((category) => category.count > 0);
}

/** The featured post, falling back to the newest one. */
export async function getFeaturedPost(): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((post) => post.featured) ?? posts[0];
}

/** Up to `limit` posts sharing a category, excluding the current one. */
export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const others = (await getAllPosts()).filter((candidate) => candidate.slug !== post.slug);
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
