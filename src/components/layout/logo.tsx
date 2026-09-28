import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';

/** Placeholder wordmark — DESIGN.md §0.6. Swap the SVG when the vector arrives. */
export function Logo({
  variant = 'light',
  className,
}: {
  /** 'light' = for dark surfaces (white text); 'dark' = for light surfaces. */
  variant?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={className}
      aria-label={`${siteConfig.name} — home`}
    >
      <Image
        src={variant === 'light' ? '/logo.svg' : '/logo-dark.svg'}
        alt={siteConfig.name}
        width={220}
        height={48}
        priority
        className="h-10 w-auto md:h-11"
      />
    </Link>
  );
}
