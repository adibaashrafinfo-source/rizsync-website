import { cn } from '@/lib/utils';

/**
 * HOME_REDESIGN.md §2.3 — 1280px content width, with 80px side padding on
 * desktop, 32px on tablet and 20px on mobile (so the outer box is 1440px).
 */
export function Container({
  className,
  children,
  as: Tag = 'div',
}: {
  className?: string;
  children: React.ReactNode;
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav' | 'main';
}) {
  return (
    <Tag className={cn('mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-20', className)}>
      {children}
    </Tag>
  );
}
