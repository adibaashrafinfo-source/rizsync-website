import { cn } from '@/lib/utils';
import { Eyebrow } from './eyebrow';

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = 'center',
  onDark = false,
  size = 'lg',
  className,
  as: Tag = 'h2',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  id?: string;
  align?: 'center' | 'left';
  onDark?: boolean;
  /** `lg` = 46px, `md` = 42px — the two h2 sizes in §2.2. */
  size?: 'lg' | 'md';
  className?: string;
  as?: 'h1' | 'h2';
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'mx-auto max-w-3xl items-center text-center' : 'max-w-3xl',
        className,
      )}
    >
      {eyebrow ? <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow> : null}
      <Tag
        id={id}
        className={cn(
          'font-display text-[30px] leading-[1.12] font-bold tracking-[-0.03em]',
          size === 'lg' ? 'md:text-[40px] xl:text-h2' : 'md:text-[38px] xl:text-[42px]',
          onDark ? 'text-white' : 'text-navy',
        )}
      >
        {title}
      </Tag>
      {description ? (
        <p
          className={cn(
            'text-base leading-[1.7] md:text-[17px]',
            onDark ? 'text-on-navy-muted' : 'text-ink-600',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
