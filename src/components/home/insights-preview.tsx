import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { ArrowLink } from '@/components/ui/arrow-link';
import { BlogCard } from '@/components/ui/blog-card';
import { Reveal } from '@/components/ui/reveal';
import { getAllPosts } from '@/lib/mdx';
import { insightsSection } from '@/data/home';

/** Latest three MDX posts — HOME_REDESIGN.md §4.12. */
export function InsightsPreview() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <Section className="bg-mist" labelledBy="insights-heading">
      <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
        <SectionHeading
          id="insights-heading"
          eyebrow={insightsSection.eyebrow}
          title={insightsSection.title}
          align="left"
        />
        <ArrowLink href="/insights" colorClass="text-teal-ink" className="shrink-0 text-[15px]">
          {insightsSection.cta}
        </ArrowLink>
      </div>

      <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <li key={post.slug} className={index === 2 ? 'md:max-lg:hidden' : undefined}>
            <Reveal delay={index * 0.06} className="h-full">
              <BlogCard post={post} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
