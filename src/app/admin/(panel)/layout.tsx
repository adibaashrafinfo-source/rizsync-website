import { AdminShell } from '@/components/admin/shell';
import { countNewLeads } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/session';

export const dynamic = 'force-dynamic';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const newLeads = await countNewLeads(session).catch(() => 0);

  return (
    <AdminShell email={session.user.email ?? 'admin'} newLeads={newLeads} preview={!session.supabase}>
      {children}
    </AdminShell>
  );
}
