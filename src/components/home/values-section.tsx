import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { ArrowLink } from '@/components/ui/arrow-link';
import { Reveal } from '@/components/ui/reveal';
import { ValueCard } from '@/components/home/value-card';
import { getAboutContent, getHomeContent } from '@/lib/cms/queries';

/** The Quranic Business Model — HOME_REDESIGN.md §4.8. */
export async function ValuesSection() {
  const [{ valuesSection }, { values: ethicalValues }] = await Promise.all([
    getHomeContent(),
    getAboutContent(),
  ]);
  return (
    <Section className="bg-white" labelledBy="values-heading">
      <SectionHeading
        id="values-heading"
        eyebrow={valuesSection.eyebrow}
        title={valuesSection.title}
        description={valuesSection.body}
      />

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ethicalValues.map((value, index) => (
          <li key={value.transliteration}>
            <Reveal delay={index * 0.06} className="h-full">
              <ValueCard value={value} />
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex justify-center">
        <ArrowLink href="/about#values" colorClass="text-teal-ink">
          {valuesSection.link}
        </ArrowLink>
      </div>
    </Section>
  );
}
