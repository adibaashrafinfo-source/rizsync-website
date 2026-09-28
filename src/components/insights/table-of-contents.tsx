'use client';

import { useEffect, useState } from 'react';
import type { TocEntry } from '@/lib/mdx';
import { cn } from '@/lib/utils';

/** Sticky article contents — DESIGN.md §6.5. */
export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(entries[0]?.id ?? null);

  useEffect(() => {
    if (entries.length === 0) return;

    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      // Focus on the band just below the sticky header.
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    );

    for (const entry of entries) {
      const node = document.getElementById(entry.id);
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, [entries]);

  if (entries.length < 2) return null;

  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-28">
      <p className="text-[13px] font-semibold tracking-[0.12em] text-gold-600 uppercase">
        On this page
      </p>
      <ul className="mt-4 flex flex-col gap-1 border-l border-line">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className={cn(
                '-ml-px block border-l-2 py-1.5 text-sm transition-colors',
                entry.level === 3 ? 'pl-7' : 'pl-4',
                activeId === entry.id
                  ? 'border-l-gold-500 font-semibold text-navy-900'
                  : 'border-l-transparent text-ink-600 hover:text-navy-900',
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
