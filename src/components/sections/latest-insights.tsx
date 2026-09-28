import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { ArrowLink } from '@/components/ui/arrow-link';
import { BlogCard } from '@/components/ui/blog-card';
import { Reveal } from '@/components/ui/reveal';
import { getAllPosts } from '@/lib/mdx';

/** DESIGN.md §6.1 ⑨ — three most recent posts. */
export function LatestInsights() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <Section className="bg-mist" labelledBy="insights-heading">
      <SectionHeading
        id="insights-heading"
        eyebrow="Insights"
        title="Regulatory Clarity, Written Plainly"
        description="Changes in tax law, RJSC practice and government process — explained in terms of what you actually have to do."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <Reveal key={post.slug} delay={index * 0.06} className="h-full">
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <ArrowLink href="/insights">View all insights</ArrowLink>
      </div>
    </Section>
  );
}
