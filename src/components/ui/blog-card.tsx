import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/mdx';
import { categoryColor } from '@/lib/categories';
import { pillarTheme } from '@/lib/pillar';
import { cn, formatDate } from '@/lib/utils';

const hover =
  'transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:border-line-2 hover:shadow-lift motion-reduce:hover:translate-y-0';

/**
 * Insight card — HOME_REDESIGN.md §4.12, shared by the home page and
 * /insights. When a post has no cover the image area becomes a solid block in
 * its category's pillar colour.
 */
export function BlogCard({
  post,
  variant = 'default',
  className,
  priority = false,
}: {
  post: Post;
  variant?: 'default' | 'featured';
  className?: string;
  priority?: boolean;
}) {
  const featured = variant === 'featured';
  const theme = pillarTheme[categoryColor(post.category)];

  return (
    <article className={cn('h-full', className)}>
      <Link
        href={`/insights/${post.slug}`}
        className={cn(
          'group flex h-full overflow-hidden rounded-card border border-line bg-white shadow-soft',
          hover,
          featured ? 'flex-col md:flex-row' : 'flex-col',
        )}
      >
        <div
          className={cn(
            'relative shrink-0 overflow-hidden',
            post.cover ? 'bg-mist' : theme.solid,
            featured ? 'h-[220px] md:h-auto md:min-h-[320px] md:w-1/2' : 'h-[220px]',
          )}
        >
          {post.cover ? (
            <Image
              src={post.cover}
              alt={`Cover image for “${post.title}”`}
              fill
              priority={priority}
              sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 1024px) 100vw, 33vw'}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
            />
          ) : null}
        </div>

        <div className={cn('flex flex-1 flex-col p-6 md:p-7', featured && 'md:p-10')}>
          <span
            className={cn(
              'self-start rounded-md px-2.5 py-1 text-[12px] font-bold tracking-wide',
              theme.chipOnLight,
            )}
          >
            {post.category}
          </span>

          <h3
            className={cn(
              'mt-4 font-display leading-[1.3] font-bold text-navy transition-colors group-hover:text-teal-ink',
              featured ? 'text-[22px] md:text-[28px]' : 'text-xl',
            )}
          >
            {post.title}
          </h3>

          {featured ? (
            <p className="mt-3 text-[15px] leading-[1.7] text-ink-600">{post.excerpt}</p>
          ) : null}

          <p className="mt-auto pt-5 text-sm text-muted">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden> · </span>
            {post.readingMinutes} min read
          </p>
        </div>
      </Link>
    </article>
  );
}
