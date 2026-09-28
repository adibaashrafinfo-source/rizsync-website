import { Container } from '@/components/ui/container';
import { StatCounter } from '@/components/ui/stat-counter';
import { stats } from '@/data/stats';

/** DESIGN.md §6.1 ③ — TODO(client): confirm the four figures in data/stats.ts. */
export function TrustStrip() {
  return (
    <section className="border-b border-line bg-paper py-12 md:py-14">
      <Container>
        <ul className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <li key={stat.label}>
              <StatCounter stat={stat} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
