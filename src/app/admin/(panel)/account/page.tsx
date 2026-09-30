import type { Metadata } from 'next';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { PasswordForm } from '@/components/admin/password-form';
import { PageHeader, Panel } from '@/components/admin/ui';
import { requireAdmin } from '@/lib/admin/session';

export const metadata: Metadata = { title: 'My account' };

export default async function AccountPage() {
  const session = await requireAdmin();

  return (
    <>
      <PageHeader eyebrow="Settings" title="My account" description="Your sign-in details for the admin panel." />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Panel title="Profile" bodyClassName="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal to-teal-ink font-display text-xl font-bold text-white">
            {(session.user.email ?? 'A').slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold text-navy">{session.user.email}</span>
            <span className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-emerald-700">
              <ShieldCheck aria-hidden className="h-4 w-4" /> Administrator
            </span>
          </span>
        </Panel>
        <Panel title="Change password" description="Use at least 10 characters. You stay signed in on this device.">
          <div className="flex items-start gap-3">
            <KeyRound aria-hidden className="mt-3 hidden h-5 w-5 text-muted sm:block" />
            <PasswordForm />
          </div>
        </Panel>
      </div>
    </>
  );
}
