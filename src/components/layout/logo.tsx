import Image from 'next/image';
import Link from 'next/link';
import { staticSite } from '@/config/site';
import { cn } from '@/lib/utils';
import type { SiteConfig } from '@/lib/cms/types';

/**
 * Fallback sync mark: two opposing arcs, teal and orange. Shown only until a
 * logo is uploaded in the admin panel (Site settings → Logo), so the header
 * is never blank.
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

/**
 * Brand lock-up for the navy header and footer. Renders the uploaded logo
 * when there is one; `showWordmark` keeps the text beside a mark-only logo.
 */
export function Logo({
  className,
  compact = false,
  config,
  variant = 'header',
}: {
  className?: string;
  /** Drops the "Service Solution" line (mobile sheet header). */
  compact?: boolean;
  /** Live settings. Without them the built-in mark is used. */
  config?: SiteConfig;
  variant?: 'header' | 'footer';
}) {
  const branding = config?.branding;
  const name = config?.name ?? staticSite.name;
  const shortName = config?.shortName ?? staticSite.shortName;

  const src =
    variant === 'footer'
      ? branding?.footerLogo || branding?.headerLogo || ''
      : branding?.headerLogo || '';
  const configured =
    variant === 'footer' ? branding?.footerLogoHeight : branding?.headerLogoHeight;
  const height = Math.min(120, Math.max(24, Number(configured) || 46));
  const withWordmark = !src || branding?.showWordmark === true;

  const content = (
    <>
      {src ? (
        <Image
          src={src}
          alt={name}
          height={height}
          width={height * 4}
          priority={variant === 'header'}
          sizes={`${height * 4}px`}
          style={{ height, width: 'auto' }}
          className="object-contain"
        />
      ) : (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn bg-white">
          <SyncMark className="h-7 w-7" />
        </span>
      )}

      {withWordmark ? (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[22px] leading-none font-bold tracking-[-0.02em] text-white">
            {shortName}
          </span>
          {compact ? null : (
            <span className="mt-1.5 text-[10.5px] leading-none font-semibold tracking-[0.22em] text-on-navy-faint uppercase">
              Service Solution
            </span>
          )}
        </span>
      ) : null}
    </>
  );

  // The footer already sits inside its own layout, and nesting a link inside
  // the footer's brand column would duplicate the header's home link.
  if (variant === 'footer') {
    return <span className={cn('flex items-center gap-3', className)}>{content}</span>;
  }

  return (
    <Link
      href="/"
      aria-label={`${name} — home`}
      className={cn('flex items-center gap-3 rounded-btn', className)}
    >
      {content}
    </Link>
  );
}
