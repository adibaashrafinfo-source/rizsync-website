/**
 * Prints SQL that seeds the CMS tables with the bundled default content.
 * Run: npx tsx scripts/seed-sql.ts > seed.sql  (then execute it in Supabase).
 * Existing rows are left alone (ON CONFLICT / NOT EXISTS), so it is re-runnable.
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { defaultSettings } from '../src/config/site';
import { defaultHome } from '../src/data/home';
import { defaultAbout } from '../src/data/about';
import { defaultServices } from '../src/data/services';
import { defaultTeam } from '../src/data/team';
import { defaultTestimonials } from '../src/data/testimonials';
import { defaultFaqs } from '../src/data/faqs';

const q = (value: unknown) => `$json$${JSON.stringify(value)}$json$::jsonb`;
const out: string[] = [];

for (const [key, data] of Object.entries({ settings: defaultSettings, home: defaultHome, about: defaultAbout })) {
  out.push(`insert into public.site_content (key, data) values ('${key}', ${q(data)}) on conflict (key) do nothing;`);
}

const services = defaultServices.map((s, index) => ({
  slug: s.slug,
  sort_order: index,
  title: s.title,
  short_title: s.shortTitle,
  h1: s.h1,
  nav_description: s.navDescription,
  intro: s.intro,
  color: s.color,
  icon: s.icon,
  bullets: s.bullets,
  hero_card: s.heroCard ?? null,
  items: s.items,
  why_rizsync: s.whyRizsync,
  faqs: s.faqs,
  seo_title: s.seo.title,
  seo_description: s.seo.description,
  seo_keywords: s.seo.keywords,
}));
out.push(`insert into public.services (slug, sort_order, title, short_title, h1, nav_description, intro, color, icon, bullets, hero_card, items, why_rizsync, faqs, seo_title, seo_description, seo_keywords)
select slug, sort_order, title, short_title, h1, nav_description, intro, color, icon, bullets, hero_card, items, why_rizsync, faqs, seo_title, seo_description, seo_keywords
from jsonb_to_recordset(${q(services)}) as x(slug text, sort_order int, title text, short_title text, h1 text, nav_description text, intro text, color text, icon text, bullets text[], hero_card jsonb, items jsonb, why_rizsync jsonb, faqs jsonb, seo_title text, seo_description text, seo_keywords text[])
on conflict (slug) do nothing;`);

const dir = path.join(process.cwd(), 'content', 'insights');
const posts = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx')).map((file) => {
  const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
  return {
    slug: data.slug || file.replace(/\.mdx$/, ''),
    title: data.title,
    excerpt: data.excerpt || '',
    category: data.category,
    tags: data.tags || [],
    author: data.author || 'RizSync Advisory Team',
    published_on: String(data.date).slice(0, 10),
    cover: data.cover || null,
    featured: Boolean(data.featured),
    content: content.trim(),
  };
});
out.push(`insert into public.insights (slug, title, excerpt, category, tags, author, published_on, cover, featured, content)
select slug, title, excerpt, category, tags, author, published_on, cover, featured, content
from jsonb_to_recordset(${q(posts)}) as x(slug text, title text, excerpt text, category text, tags text[], author text, published_on date, cover text, featured boolean, content text)
on conflict (slug) do nothing;`);

const seedList = (table: string, rows: Record<string, unknown>[], columns: string) => {
  const cols = columns.split(',').map((c) => c.trim().split(' ')[0]).join(', ');
  const ordered = rows.map((row, index) => ({ ...row, sort_order: index }));
  out.push(`insert into public.${table} (${cols}, sort_order)
select ${cols}, sort_order from jsonb_to_recordset(${q(ordered)}) as x(${columns}, sort_order int)
where not exists (select 1 from public.${table});`);
};
seedList('team_members', defaultTeam.map((m) => ({ ...m })), 'name text, title text, bio text, photo text, linkedin text, email text');
seedList('testimonials', defaultTestimonials.map((t) => ({ ...t })), 'quote text, name text, role text, company text, rating int');
seedList('faqs', defaultFaqs.map((f) => ({ ...f })), 'question text, answer text');

console.log(out.join('\n\n'));
