import { cn } from '@/lib/utils';
import { Eyebrow } from './eyebrow';

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = 'center',
  onDark = false,
  className,
  as: Tag = 'h2',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  id?: string;
  align?: 'center' | 'left';
  onDark?: boolean;
  className?: string;
  as?: 'h1' | 'h2';
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl',
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow className={onDark ? 'text-gold-500' : undefined}>{eyebrow}</Eyebrow>
      ) : null}
      <Tag
        id={id}
        className={cn(
          'text-[28px] leading-tight font-bold md:text-h2',
          onDark ? 'text-white' : 'text-navy-900',
        )}
      >
        {title}
      </Tag>
      {description ? (
        <p className={cn('text-pretty', onDark ? 'text-white/75' : 'text-ink-600')}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
