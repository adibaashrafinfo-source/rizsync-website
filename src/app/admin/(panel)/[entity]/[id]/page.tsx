import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EntityEditor } from '@/components/admin/editor';
import { PageHeader } from '@/components/admin/ui';
import { entities, isEntityKey } from '@/lib/admin/config';
import { getRow } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/session';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ entity: string; id: string }>;
}): Promise<Metadata> {
  const { entity, id } = await params;
  if (!isEntityKey(entity)) return { title: 'Not found' };
  return { title: `${id === 'new' ? 'New' : 'Edit'} ${entities[entity].singular.toLowerCase()}` };
}

export default async function EntityEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ entity: string; id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { entity, id } = await params;
  if (!isEntityKey(entity)) notFound();
  const { created } = await searchParams;

  const config = entities[entity];
  const session = await requireAdmin();
  const isNew = id === 'new';
  const row = isNew ? null : await getRow(session, entity, id);
  if (!isNew && !row) notFound();

  // Rows come back with numbers where some selects hold strings (rating).
  const initial = { ...config.defaults, ...(row ?? {}) };
  if (entity === 'testimonials') initial.rating = String(initial.rating ?? '5');

  const title = isNew
    ? `New ${config.singular.toLowerCase()}`
    : String(row?.[config.titleField] || `Edit ${config.singular.toLowerCase()}`);

  return (
    <>
      <PageHeader
        back={{ href: `/admin/${entity}`, label: config.plural }}
        eyebrow={isNew ? 'Create' : `Edit ${config.singular.toLowerCase()}`}
        title={title}
      />
      {created ? (
        <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          Created and published to the website.
        </p>
      ) : null}
      <EntityEditor
        key={id}
        entityKey={entity}
        id={isNew ? null : id}
        sections={config.sections}
        initial={initial}
        viewHref={row ? config.publicPath?.(row) : undefined}
        label={config.singular}
      />
    </>
  );
}
