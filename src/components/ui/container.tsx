import { cn } from '@/lib/utils';

/** Max-w-7xl with the side padding set in DESIGN.md §4.3. */
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
    <Tag className={cn('mx-auto w-full max-w-7xl px-6 md:px-8', className)}>{children}</Tag>
  );
}
