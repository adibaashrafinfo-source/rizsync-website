import Link from 'next/link';
import { ArrowLeft, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const btn = {
  base: 'inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
  primary: 'bg-navy text-white shadow-[0_8px_20px_-10px_rgb(0_32_74/0.8)] hover:bg-[#012b61]',
  gold: 'bg-gold text-navy shadow-[0_8px_20px_-10px_rgb(201_162_77/0.9)] hover:brightness-105',
  outline: 'border border-line bg-white text-navy hover:border-navy/30',
  ghost: 'text-ink-600 hover:bg-mist hover:text-navy',
  danger: 'border border-red-200 bg-white text-red-600 hover:bg-red-50',
  icon: 'h-9 w-9 px-0',
};

export function PageHeader({
  title,
  description,
  eyebrow,
  back,
  actions,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {back ? (
          <Link
            href={back.href}
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-navy"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            {back.label}
          </Link>
        ) : null}
        {eyebrow ? (
          <p className="text-[12px] font-bold tracking-[0.16em] text-teal-ink uppercase">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 font-display text-[26px] leading-tight font-bold tracking-[-0.02em] text-navy md:text-[30px]">
          {title}
        </h1>
        {description ? <p className="mt-2 max-w-2xl text-[15px] text-ink-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Panel({
  title,
  description,
  actions,
  className,
  bodyClassName,
  children,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04),0_12px_32px_-24px_rgb(0_32_74/0.25)]',
        className,
      )}
    >
      {title ? (
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <h2 className="font-display text-[16px] font-bold text-navy">{title}</h2>
            {description ? <p className="mt-1 text-[13px] text-muted">{description}</p> : null}
          </div>
          {actions}
        </div>
      ) : null}
      <div className={cn('p-6', bodyClassName)}>{children}</div>
    </section>
  );
}

const statTones = {
  navy: 'from-navy to-[#013a7d] text-white',
  teal: 'from-teal-ink to-teal text-white',
  orange: 'from-[#c4650d] to-orange text-white',
  gold: 'from-gold-ink to-gold text-white',
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'navy',
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: keyof typeof statTones;
  href?: string;
}) {
  const body = (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04),0_12px_32px_-24px_rgb(0_32_74/0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgb(0_32_74/0.35)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-semibold text-muted">{label}</p>
        <span
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-[0_8px_18px_-10px_rgb(0_32_74/0.6)]',
            statTones[tone],
          )}
        >
          <Icon aria-hidden className="h-5 w-5" strokeWidth={2} />
        </span>
      </div>
      <p className="mt-3 font-display text-[32px] leading-none font-bold tracking-[-0.02em] text-navy">
        {value}
      </p>
      {hint ? <p className="mt-2 text-[13px] text-muted">{hint}</p> : null}
    </div>
  );
  return href ? (
    <Link href={href} className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-gold">
      {body}
    </Link>
  ) : (
    body
  );
}

const badgeTones = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  gray: 'bg-slate-100 text-slate-600 ring-slate-500/15',
  orange: 'bg-orange-50 text-[#b35a0b] ring-orange/25',
  blue: 'bg-sky-50 text-sky-700 ring-sky-600/15',
  gold: 'bg-gold-50 text-gold-ink ring-gold/25',
};

export function Badge({
  tone = 'gray',
  children,
  className,
}: {
  tone?: keyof typeof badgeTones;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-semibold ring-1 ring-inset',
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export const leadTone = { new: 'orange', contacted: 'blue', closed: 'green' } as const;

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-teal-ink">
        <Icon aria-hidden className="h-6 w-6" />
      </span>
      <p className="mt-4 font-display text-base font-bold text-navy">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function timeAgo(iso: string): string {
  const seconds = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  const units: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ];
  for (const [size, name] of units) {
    const value = Math.floor(seconds / size);
    if (value >= 1) return `${value} ${name}${value > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}
