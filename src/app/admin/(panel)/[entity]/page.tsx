import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FolderOpen, Plus } from 'lucide-react';
import { EntityList, type ListItem } from '@/components/admin/entity-list';
import { EmptyState, PageHeader, Panel, btn } from '@/components/admin/ui';
import { entities, isEntityKey } from '@/lib/admin/config';
import { listRows } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/session';
import { formatDate, cn } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ entity: string }> }): Promise<Metadata> {
  const { entity } = await params;
  return { title: isEntityKey(entity) ? entities[entity].plural : 'Not found' };
}

export default async function EntityListPage({
  params,
  searchParams,
}: {
  params: Promise<{ entity: string }>;
  searchParams: Promise<{ deleted?: string }>;
}) {
  const { entity } = await params;
  if (!isEntityKey(entity)) notFound();
  const { deleted } = await searchParams;

  const config = entities[entity];
  const session = await requireAdmin();
  const rows = await listRows(session, entity);

  const items: ListItem[] = rows.map((row) => ({
    id: row.id,
    title: String(row[config.titleField] ?? 'Untitled'),
    subtitle: config.subtitleField ? String(row[config.subtitleField] ?? '') : undefined,
    image: config.imageField ? ((row[config.imageField] as string | null) ?? null) : null,
    icon: entity === 'services' ? String(row.icon ?? '') : undefined,
    published: Boolean(row.published),
    meta: entity === 'insights' && row.published_on ? formatDate(String(row.published_on)) : undefined,
    viewHref: config.publicPath?.(row),
  }));

  const newButton = (
    <Link href={`/admin/${entity}/new`} className={cn(btn.base, btn.gold)}>
      <Plus aria-hidden className="h-4 w-4" /> New {config.singular.toLowerCase()}
    </Link>
  );

  return (
    <>
      <PageHeader eyebrow="Content" title={config.plural} description={config.description} actions={newButton} />

      {deleted ? (
        <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          Deleted. The website has been updated.
        </p>
      ) : null}

      <Panel
        title={`${items.length} ${items.length === 1 ? config.singular.toLowerCase() : config.plural.toLowerCase()}`}
        description={config.sortable ? 'Use the arrows to change the order on the website.' : undefined}
        bodyClassName="p-0"
      >
        {items.length ? (
          <EntityList entityKey={entity} items={items} sortable={config.sortable} label={config.plural} />
        ) : (
          <EmptyState
            icon={FolderOpen}
            title={`No ${config.plural.toLowerCase()} yet`}
            description="Create the first one — it appears on the website as soon as you save."
            action={newButton}
          />
        )}
      </Panel>
    </>
  );
}
