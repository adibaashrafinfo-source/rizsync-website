/**
 * Emits a JSON-LD @graph. Passing nodes as a graph (rather than one script tag
 * per node) lets them reference each other by @id — see `src/lib/schema.ts`.
 */
export function JsonLd({ graph }: { graph: Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Schema is generated from our own config, never from user input.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}
