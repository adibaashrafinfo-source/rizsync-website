import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ShieldCheck, Tag } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { MottoStrip } from '@/components/home/motto-strip';
import { ServiceHub } from '@/components/home/service-hub';
import { siteConfig } from '@/config/site';

const trustIcons = [ShieldCheck, Tag, MapPin];
const trustPoints = ['Confidential (Amanah)', 'Transparent Pricing', 'Mirpur, Dhaka'];

/** DESIGN.md §6.1 ① — full-bleed hero, 5/12 text + 7/12 interactive hub. */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-navy-900 pt-12 pb-16 md:pt-16">
      {/*
        TODO(client) §0.7: replace hero-dhaka.webp with the supplied Dhaka
        cityscape + circuitry artwork. The gradient below keeps the left-hand
        text readable whatever photograph is used.
      */}
      <Image
        src={siteConfig.heroImage}
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        quality={72}
        className="-z-20 object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/90 via-navy-900/75 to-navy-900/40"
      />
      <div aria-hidden className="bg-circuit absolute inset-0 -z-10 opacity-[0.10]" />

      <Container className="relative">
        <div className="grid items-center gap-12 xl:grid-cols-12 xl:gap-8">
          {/* Left column — 5/12 */}
          <div className="flex min-w-0 flex-col gap-6 xl:col-span-5">
            <Eyebrow className="text-gold-500">Ethical &middot; Professional &middot; Integrated</Eyebrow>

            <div className="flex flex-col gap-4">
              <h1 className="text-[36px] leading-[1.1] font-bold tracking-[-0.02em] text-white md:text-[46px] xl:text-display">
                {siteConfig.name}
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-white/80 md:text-xl">
                Your Unified Professional Partner for Business &amp; Family.
              </p>
            </div>

            <MottoStrip />

            <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {/*
                This label is long enough to overflow a 360px viewport if it is
                held on one line, so it is allowed to wrap and the button grows
                to fit rather than pushing the whole column wider.
              */}
              <Button
                asChild
                size="lg"
                className="h-auto min-h-14 py-3 text-center whitespace-normal"
              >
                <Link href="#consultation">Request Consultation — An Ethical Partnership</Link>
              </Button>
              <Button asChild variant="secondaryDark" size="lg">
                <Link href="#pillars">Explore Services</Link>
              </Button>
            </div>

            <ul className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/70">
              {trustPoints.map((point, index) => {
                const Icon = trustIcons[index];
                return (
                  <li key={point} className="inline-flex items-center gap-1.5">
                    <Icon aria-hidden className="h-4 w-4 text-gold-500" strokeWidth={1.5} />
                    {point}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right column — 7/12: the interactive hub */}
          <div className="min-w-0 xl:col-span-7">
            <ServiceHub />
          </div>
        </div>
      </Container>
    </section>
  );
}
