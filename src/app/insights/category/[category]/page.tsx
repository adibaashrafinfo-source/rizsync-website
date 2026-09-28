import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/section';
import { BlogCard } from '@/components/ui/blog-card';
import { PageHero } from '@/components/sections/page-hero';
import { CtaBanner } from '@/components/sections/cta-banner';
import { JsonLd } from '@/components/seo/json-ld';
import { getCategoriesInUse, getPostsByCategorySlug, insightCategories } from '@/lib/mdx';
import { breadcrumbSchema } from '@/lib/schema';
import { slugify } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function generateStaticParams() {
  return getCategoriesInUse().map((category) => ({ category: category.slug }));
}

function categoryName(slug: string): string | undefined {
  return insightCategories.find((category) => slugify(category) === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const name = categoryName(category);
  if (!name) return {};

  return pageMetadata({
    title: `${name} Insights | RizSync`,
    description: `Articles from RizSync advisors on ${name.toLowerCase()} in Bangladesh — practical guidance on what the rules mean and what you have to do about them.`,
    path: `/insights/category/${category}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const name = categoryName(category);
  const posts = getPostsByCategorySlug(category);

  if (!name || posts.length === 0) notFound();

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Insights', href: '/insights' },
    { label: name, href: `/insights/category/${category}` },
  ];

  return (
    <>
      <PageHero
        eyebrow="Category"
        title={name}
        description={`${posts.length} article${posts.length === 1 ? '' : 's'} on ${name.toLowerCase()}.`}
        crumbs={crumbs}
      />

      <Section className="bg-paper">
        <div className="mb-10 flex flex-wrap gap-2">
          <Link
            href="/insights"
            className="rounded-full border border-line bg-paper px-4 py-1.5 text-sm font-semibold text-ink-600 transition-colors hover:border-navy-900/30"
          >
            All insights
          </Link>
          {getCategoriesInUse().map((item) => (
            <Link
              key={item.slug}
              href={`/insights/category/${item.slug}`}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
                item.slug === category
                  ? 'border-navy-900 bg-navy-900 text-white'
                  : 'border-line bg-paper text-ink-600 hover:border-navy-900/30',
              )}
            >
              {item.name} ({item.count})
            </Link>
          ))}
        </div>

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <BlogCard post={post} />
            </li>
          ))}
        </ul>
      </Section>

      <CtaBanner />

      <JsonLd graph={[breadcrumbSchema(crumbs)]} />
    </>
  );
}
