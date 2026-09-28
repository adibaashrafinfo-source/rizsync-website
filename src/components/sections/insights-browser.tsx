'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { BlogCard } from '@/components/ui/blog-card';
import { Input } from '@/components/ui/field';
import type { Post } from '@/lib/mdx';
import { cn } from '@/lib/utils';

const PER_PAGE = 9;

/**
 * Client-side search and category filtering over posts that were read at build
 * time — DESIGN.md §6.5. Nothing is fetched: the whole (small) index ships
 * with the page, so filtering is instant and works offline.
 */
export function InsightsBrowser({
  posts,
  categories,
}: {
  posts: Post[];
  categories: { name: string; slug: string; count: number }[];
}) {
  // Read here rather than on the server so /insights stays fully static while
  // still honouring the `?q=` entry point advertised in the WebSite schema.
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return posts.filter((post) => {
      if (category && post.categorySlug !== category) return false;
      if (!needle) return true;

      return (
        post.title.toLowerCase().includes(needle) ||
        post.excerpt.toLowerCase().includes(needle) ||
        post.tags.some((tag) => tag.toLowerCase().includes(needle))
      );
    });
  }, [posts, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const reset = (next: () => void) => {
    next();
    setPage(1);
  };

  return (
    <div>
      {/* Search */}
      <div className="mx-auto max-w-xl">
        <label htmlFor="insights-search" className="sr-only">
          Search insights
        </label>
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-600"
          />
          <Input
            id="insights-search"
            type="search"
            value={query}
            onChange={(event) => reset(() => setQuery(event.target.value))}
            placeholder="Search by title, summary or tag…"
            className="pr-10 pl-11"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => reset(() => setQuery(''))}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-600 hover:text-navy-900"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Category pills */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => reset(() => setCategory(null))}
          aria-pressed={category === null}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
            category === null
              ? 'border-navy-900 bg-navy-900 text-white'
              : 'border-line bg-paper text-ink-600 hover:border-navy-900/30',
          )}
        >
          All ({posts.length})
        </button>

        {categories.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => reset(() => setCategory(item.slug))}
            aria-pressed={category === item.slug}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
              category === item.slug
                ? 'border-navy-900 bg-navy-900 text-white'
                : 'border-line bg-paper text-ink-600 hover:border-navy-900/30',
            )}
          >
            {item.name} ({item.count})
          </button>
        ))}
      </div>

      {/* Results */}
      <div aria-live="polite" className="mt-10">
        {visible.length === 0 ? (
          <div className="rounded-card border border-line bg-paper p-12 text-center shadow-soft">
            <p className="text-lg font-semibold text-navy-900">No articles match that.</p>
            <p className="mt-2 text-ink-600">
              Try a different term, or{' '}
              <Link href="/contact" className="font-semibold text-teal-600 underline">
                ask us directly
              </Link>{' '}
              — we answer questions we have not written up yet.
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <li key={post.slug}>
                <BlogCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 ? (
        <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => {
            const number = index + 1;
            return (
              <button
                key={number}
                type="button"
                onClick={() => setPage(number)}
                aria-current={number === currentPage ? 'page' : undefined}
                className={cn(
                  'h-10 min-w-10 rounded-btn border px-3 text-sm font-semibold transition-colors',
                  number === currentPage
                    ? 'border-navy-900 bg-navy-900 text-white'
                    : 'border-line bg-paper text-ink-600 hover:border-navy-900/30',
                )}
              >
                {number}
              </button>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
