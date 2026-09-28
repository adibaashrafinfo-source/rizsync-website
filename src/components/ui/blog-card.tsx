import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import type { Post } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

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

  return (
    <article className={cn('h-full', className)}>
      <Link
        href={`/insights/${post.slug}`}
        className={cn(
          'group flex h-full overflow-hidden rounded-card border border-line bg-paper shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0',
          featured ? 'flex-col md:flex-row' : 'flex-col',
        )}
      >
        <div
          className={cn(
            'relative shrink-0 overflow-hidden bg-mist',
            featured ? 'aspect-[16/9] md:aspect-auto md:w-1/2' : 'aspect-[16/9]',
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

        <div className={cn('flex flex-1 flex-col p-6', featured && 'md:p-8')}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-600">
            <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[12px] font-semibold text-teal-600">
              {post.category}
            </span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden className="h-3.5 w-3.5" />
              {post.readingMinutes} min read
            </span>
          </div>

          <h3
            className={cn(
              'mt-3 leading-snug font-semibold text-navy-900 transition-colors group-hover:text-teal-600',
              featured ? 'text-xl md:text-2xl' : 'text-lg',
            )}
          >
            {post.title}
          </h3>

          <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-600">{post.excerpt}</p>

          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600">
            Read article
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
