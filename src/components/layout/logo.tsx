import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

/**
 * The sync mark: two opposing arcs, teal and orange, each ending in an
 * arrowhead. Placeholder until the client's vector logo arrives (§0.6) —
 * replace this component's SVG and every placement updates.
 */
export function SyncMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden focusable="false">
      <path
        d="M6.5 17.5A9.5 9.5 0 0 1 23 9.2"
        fill="none"
        stroke="#0FA3A3"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path d="M24.8 4.6 25.4 11.4 18.8 10.1Z" fill="#0FA3A3" />
      <path
        d="M25.5 14.5A9.5 9.5 0 0 1 9 22.8"
        fill="none"
        stroke="#F28C28"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path d="M7.2 27.4 6.6 20.6 13.2 21.9Z" fill="#F28C28" />
    </svg>
  );
}

/** Header/sheet lock-up: 44px white tile + wordmark (HOME_REDESIGN.md §4.1). */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — home`}
      className={cn('flex items-center gap-3 rounded-btn', className)}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn bg-white">
        <SyncMark className="h-7 w-7" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[22px] leading-none font-bold tracking-[-0.02em] text-white">
          RizSync
        </span>
        {compact ? null : (
          <span className="mt-1.5 text-[10.5px] leading-none font-semibold tracking-[0.22em] text-on-navy-faint uppercase">
            Service Solution
          </span>
        )}
      </span>
    </Link>
  );
}
