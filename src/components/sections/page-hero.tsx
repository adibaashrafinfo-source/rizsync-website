import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { cn } from '@/lib/utils';

/** Shared navy hero for every inner page (§6.2.1, §6.3.1, §6.4.1, §6.5, §6.6.1). */
export function PageHero({
  eyebrow,
  eyebrowClassName,
  title,
  description,
  crumbs,
  children,
  className,
  image,
}: {
  eyebrow?: string;
  eyebrowClassName?: string;
  title: string;
  description?: string;
  crumbs: Crumb[];
  children?: React.ReactNode;
  className?: string;
  /** Wide photo, dark on its left (the copy sits there); shown behind navy fades. */
  image?: string;
}) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden bg-navy-900',
        image ? 'py-16 md:py-24 xl:py-28' : 'py-14 md:py-20',
        className,
      )}
    >
      {image ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[75%_center] opacity-45 md:opacity-80 lg:object-right"
          />
          {/* Solid navy under the copy, fading out towards the photo. */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--navy)_0%,var(--navy)_30%,rgb(0_32_74/0.6)_62%,rgb(0_32_74/0.2)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-navy/40" />
        </div>
      ) : (
        <>
          <div aria-hidden className="bg-circuit pointer-events-none absolute inset-0" />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-navy-950/70 via-transparent to-navy-950/60"
          />
        </>
      )}

      <Container className="relative">
        <Breadcrumbs items={crumbs} onDark />

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className={cn(children ? 'lg:col-span-7' : 'lg:col-span-9')}>
            {eyebrow ? (
              <Eyebrow onDark className={eyebrowClassName}>{eyebrow}</Eyebrow>
            ) : null}
            <h1 className="mt-3 text-[32px] leading-[1.12] font-bold tracking-[-0.02em] text-white md:text-[44px]">
              {title}
            </h1>
            {description ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
                {description}
              </p>
            ) : null}
          </div>

          {children ? <div className="lg:col-span-5">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
