import type { Metadata } from 'next';
import { DocEditor } from '@/components/admin/editor';
import { PageHeader } from '@/components/admin/ui';
import { docs } from '@/lib/admin/config';
import { getDoc } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/session';

export const metadata: Metadata = { title: 'Site settings' };

export default async function SettingsPage() {
  const session = await requireAdmin();
  const initial = await getDoc(session, 'settings');

  return (
    <>
      <PageHeader eyebrow="Settings" title={docs.settings.title} description={docs.settings.description} />
      <DocEditor docKey="settings" sections={docs.settings.sections} initial={initial} viewHref="/contact" />
    </>
  );
}
