import { Suspense } from 'react';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { BlogCard } from '@/components/ui/blog-card';
import { PageHero } from '@/components/sections/page-hero';
import { InsightsBrowser } from '@/components/sections/insights-browser';
import { CtaBanner } from '@/components/home/cta-banner';
import { JsonLd } from '@/components/seo/json-ld';
import { getAllPosts, getCategoriesInUse, getFeaturedPost } from '@/lib/mdx';
import { breadcrumbSchema } from '@/lib/schema';

const crumbs = [
  { label: 'Home', href: '/' },
  { label: 'Insights', href: '/insights' },
];

export const metadata: Metadata = pageMetadata({
  title: 'Business Insights, Regulatory Updates & Islamic Finance | RizSync Blog',
  description:
    'Stay updated on changes in Bangladesh Tax law, RJSC regulations, ESG standards, and Islamic business practices. Expert analysis from RizSync advisors.',
  path: '/insights',
});

export default function InsightsPage() {
  const posts = getAllPosts();
  const featured = getFeaturedPost();
  const categories = getCategoriesInUse();
  const rest = featured ? posts.filter((post) => post.slug !== featured.slug) : posts;

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Regulatory Clarity, Written Plainly"
        description="Changes in tax law, RJSC practice, government process and Islamic business ethics — explained in terms of what you actually have to do."
        crumbs={crumbs}
        image="/images/page-heroes/insights.webp"
      />

      {featured ? (
        <Section className="bg-paper pb-0 md:pb-0" labelledBy="featured-heading">
          <h2 id="featured-heading" className="sr-only">
            Featured article
          </h2>
          <BlogCard post={featured} variant="featured" priority />
        </Section>
      ) : null}

      <Section className="bg-paper" labelledBy="all-insights-heading">
        <SectionHeading
          id="all-insights-heading"
          eyebrow="Library"
          title="All Insights"
          description="Search by keyword, or filter by the area you are dealing with."
        />

        <div className="mt-10">
          <Suspense
            fallback={
              <div className="h-[520px] animate-pulse rounded-card border border-line bg-mist" />
            }
          >
            <InsightsBrowser posts={rest} categories={categories} />
          </Suspense>
        </div>
      </Section>

      <CtaBanner
        title="A question we have not written up yet?"
        description="Ask it in a free consultation. We would rather answer it directly than have you guess from a blog post."
      />

      <JsonLd graph={[breadcrumbSchema(crumbs)]} />
    </>
  );
}
