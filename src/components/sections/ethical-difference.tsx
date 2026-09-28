import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ArrowLink } from '@/components/ui/arrow-link';
import { Reveal } from '@/components/ui/reveal';
import { ValueCard } from '@/components/sections/value-card';
import { ethicalValues } from '@/data/values';

/** DESIGN.md §6.1 ⑤ — navy section with the 8-point star lattice at 5%. */
export function EthicalDifference() {
  return (
    <section
      aria-labelledby="ethics-heading"
      className="relative overflow-hidden bg-navy-900 py-16 md:py-24"
    >
      <div aria-hidden className="bg-geometric pointer-events-none absolute inset-0" />

      <Container className="relative">
        <SectionHeading
          id="ethics-heading"
          eyebrow="The Ethical Difference"
          title="Business Guided by Timeless Values"
          description="Four principles decide how we quote, what we accept and how your information is held. They are not a marketing line — they are the reason clients stay."
          onDark
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ethicalValues.map((value, index) => (
            <li key={value.transliteration}>
              <Reveal delay={index * 0.06} className="h-full">
                <ValueCard value={value} />
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <ArrowLink href="/about#values" colorClass="text-gold-500">
            Read about our Quranic Business Model
          </ArrowLink>
        </div>
      </Container>
    </section>
  );
}
