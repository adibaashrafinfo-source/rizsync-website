import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { services } from '@/data/services';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-24 md:py-32">
      <div aria-hidden className="bg-circuit pointer-events-none absolute inset-0" />

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow onDark>Error 404</Eyebrow>
          <p className="mt-4 font-display text-[72px] leading-none font-bold text-white/15 md:text-[104px]">
            404
          </p>
          <h1 className="mt-2 text-[28px] leading-tight font-bold text-white md:text-[40px]">
            We could not find that page
          </h1>
          <p className="mt-4 text-white/75">
            The link may be out of date, or the page may have moved. Everything
            {' '}
            {siteConfig.shortName} does is one step away below.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild variant="secondaryDark" size="lg">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-[13px] font-semibold tracking-[0.12em] text-gold-500 uppercase">
              Our services
            </p>
            <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-white/75 transition-colors hover:text-gold-500"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
