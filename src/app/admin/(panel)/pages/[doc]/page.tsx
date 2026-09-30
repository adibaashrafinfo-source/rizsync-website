import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocEditor } from '@/components/admin/editor';
import { PageHeader } from '@/components/admin/ui';
import { docs } from '@/lib/admin/config';
import { getDoc } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/session';

/** Settings has its own route; these are the page documents. */
function isPageDoc(doc: string): doc is 'home' | 'about' | 'ceo' | 'team' {
  return doc === 'home' || doc === 'about' || doc === 'ceo' || doc === 'team';
}

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }): Promise<Metadata> {
  const { doc } = await params;
  return { title: isPageDoc(doc) ? docs[doc].title : 'Not found' };
}

export default async function PageEditor({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  if (!isPageDoc(doc)) notFound();

  const session = await requireAdmin();
  const config = docs[doc];
  const initial = await getDoc(session, doc);

  return (
    <>
      <PageHeader eyebrow="Pages" title={config.title} description={config.description} />
      <DocEditor docKey={doc} sections={config.sections} initial={initial} viewHref={config.publicPath} />
    </>
  );
}
