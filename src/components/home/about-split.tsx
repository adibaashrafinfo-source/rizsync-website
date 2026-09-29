import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Reveal } from '@/components/ui/reveal';
import { Segments } from '@/components/ui/segments';
import { SyncMark } from '@/components/layout/logo';
import { about } from '@/data/home';

/**
 * "Who we are" split — HOME_REDESIGN.md §4.5. The navy panel is ready for a
 * team/office photo (`about.photo`); until one is supplied the gold star
 * lattice and the brand mark stand in, with no invented imagery.
 */
export function AboutSplit() {
  return (
    <section aria-labelledby="about-heading" className="bg-white pt-20 pb-14 md:pt-24 md:pb-[72px] xl:pt-32 xl:pb-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 xl:gap-[88px]">
          {/* Visual */}
          <Reveal>
            <div className="relative mx-auto h-[360px] w-full max-w-[520px] sm:h-[420px] xl:h-[520px]">
              <div className="relative h-[92%] w-[90%] overflow-hidden rounded-panel bg-navy">
                {about.photo ? (
                  <>
                    <Image
                      src={about.photo}
                      alt={about.photoAlt}
                      fill
                      sizes="(max-width: 1024px) 90vw, 470px"
                      className="object-cover object-top"
                    />
                    {/* Navy fade at the foot so the floating cards sit on calm ground. */}
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-transparent"
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-24 w-24 items-center justify-center rounded-[22px] bg-white/[0.06] ring-1 ring-white/10">
                      <SyncMark className="h-14 w-14" />
                    </span>
                  </div>
                )}
                {about.photo ? null : (
                  <div aria-hidden className="pattern-star absolute inset-0 opacity-[0.14]" />
                )}
              </div>

              {/* Floating white card — top right */}
              <div className="absolute top-6 right-0 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-float sm:top-10 sm:px-5 sm:py-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-btn bg-orange-50 text-orange-icon sm:h-11 sm:w-11">
                  <ShieldCheck aria-hidden className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="font-display text-sm font-bold text-navy sm:text-base">
                  {about.confidential}
                </span>
              </div>

              {/* Floating teal card — bottom right */}
              <div className="absolute right-0 bottom-0 w-[170px] rounded-card bg-teal p-5 shadow-float sm:w-[200px] sm:p-6">
                <p className="font-display text-[34px] leading-none font-extrabold tracking-[-0.03em] text-navy sm:text-[44px]">
                  {about.sinceYear}
                </p>
                <p className="mt-2 text-[13px] leading-snug font-semibold text-navy sm:text-sm">
                  {about.sinceLabel}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Copy */}
          <Reveal delay={0.08}>
            <div>
              <Eyebrow>{about.eyebrow}</Eyebrow>
              <h2
                id="about-heading"
                className="mt-4 font-display text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-navy md:text-[38px] xl:text-[42px]"
              >
                <Segments segments={about.title} />
              </h2>
              <p className="mt-5 text-base leading-[1.7] text-ink-600 md:text-[17px]">
                {about.body}
              </p>

              <ul className="mt-8 flex flex-col gap-4">
                {about.points.map((point) => (
                  <li key={point.label} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-ink">
                      <Check aria-hidden className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                    <p className="text-[15px] leading-[1.6] text-ink-600 md:text-base">
                      <strong className="font-bold text-navy">{point.label}:</strong> {point.text}
                    </p>
                  </li>
                ))}
              </ul>

              <Button asChild variant="navy" className="mt-9">
                <Link href="/about">
                  {about.cta}
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
