import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Clock, User } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { BlogCard } from '@/components/ui/blog-card';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Eyebrow } from '@/components/ui/eyebrow';
import { TableOfContents } from '@/components/insights/table-of-contents';
import { ShareButtons } from '@/components/insights/share-buttons';
import { mdxComponents } from '@/components/insights/mdx-components';
import { JsonLd } from '@/components/seo/json-ld';
import { getAllPosts, getPostBySlug, getRelatedPosts, getToc } from '@/lib/mdx';
import { articleSchema, breadcrumbSchema } from '@/lib/schema';
import { absoluteUrl, siteConfig } from '@/config/site';
import { formatDate } from '@/lib/utils';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/insights/${post.slug}`,
    keywords: post.tags,
    absoluteTitle: false,
    type: 'article',
    image: post.cover,
    imageAlt: `Cover image for “${post.title}”`,
    article: { publishedTime: post.date, authors: [post.author] },
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const toc = getToc(post.content);
  const related = getRelatedPosts(post, 3);
  const url = `/insights/${post.slug}`;

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Insights', href: '/insights' },
    { label: post.title, href: url },
  ];

  return (
    <>
      {/* Article header */}
      <section className="relative overflow-hidden bg-navy-900 pt-12 pb-14 md:pt-14 md:pb-16">
        <div aria-hidden className="bg-circuit pointer-events-none absolute inset-0" />
        <Container className="relative">
          <Breadcrumbs items={crumbs} onDark />

          <div className="mt-6 max-w-3xl">
            <Link href={`/insights/category/${post.categorySlug}`}>
              <Eyebrow onDark className="transition-colors hover:text-white">
                {post.category}
              </Eyebrow>
            </Link>

            <h1 className="mt-3 text-[30px] leading-[1.15] font-bold tracking-[-0.02em] text-white md:text-[42px]">
              {post.title}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-white/75 md:text-lg">
              {post.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
              <span className="inline-flex items-center gap-1.5">
                <User aria-hidden className="h-4 w-4" />
                {post.author}
              </span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="inline-flex items-center gap-1.5">
                <Clock aria-hidden className="h-4 w-4" />
                {post.readingMinutes} min read
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Cover */}
      {post.cover ? (
        <Container className="-mt-8 md:-mt-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-card border border-line shadow-lift md:aspect-[21/9]">
            <Image
              src={post.cover}
              alt={`Cover image for “${post.title}”`}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
          </div>
        </Container>
      ) : null}

      {/* Body + TOC */}
      <Container className="py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <aside className="lg:col-span-3">
            <TableOfContents entries={toc} />
          </aside>

          <div className="lg:col-span-9">
            <article className="prose prose-rizsync max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-[26px] prose-h3:mt-8 prose-h3:text-[20px] prose-p:leading-[1.75] prose-li:leading-[1.75] prose-blockquote:not-italic prose-blockquote:font-normal">
              <MDXRemote source={post.content} components={mdxComponents} />
            </article>

            {post.tags.length > 0 ? (
              <ul className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-mist px-3 py-1 text-[13px] font-medium text-ink-600"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-8 border-t border-line pt-6">
              <ShareButtons url={absoluteUrl(url)} title={post.title} />
            </div>

            {/* CTA box */}
            <div className="mt-12 overflow-hidden rounded-card border border-line bg-navy-900 p-8">
              <Eyebrow onDark>Need this handled?</Eyebrow>
              <h2 className="mt-2 text-xl leading-snug font-bold text-white md:text-2xl">
                Talk it through with someone who does it every week
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">
                A free consultation with {siteConfig.shortName} will tell you exactly where
                you stand and what it will cost to put right — with no obligation to
                proceed.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/contact#consultation-form">Request Consultation</Link>
                </Button>
                <Button asChild variant="secondaryDark">
                  <a
                    href={siteConfig.contact.whatsappPrefilled}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp us
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Related */}
      {related.length > 0 ? (
        <section aria-labelledby="related-posts-heading" className="bg-mist py-14 md:py-20">
          <Container>
            <h2
              id="related-posts-heading"
              className="text-[26px] leading-tight font-bold text-navy-900 md:text-[32px]"
            >
              Related reading
            </h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <BlogCard post={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <JsonLd
        graph={[
          breadcrumbSchema(crumbs),
          articleSchema({
            title: post.title,
            description: post.excerpt,
            url,
            image: post.cover,
            datePublished: post.date,
            author: post.author,
            category: post.category,
          }),
        ]}
      />
    </>
  );
}
