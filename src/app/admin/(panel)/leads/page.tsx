import type { Metadata } from 'next';
import Link from 'next/link';
import { Inbox, Mail, Phone } from 'lucide-react';
import { Badge, EmptyState, PageHeader, Panel, leadTone, timeAgo } from '@/components/admin/ui';
import { listLeads } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/session';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Leads' };

const filters = [
  { value: '', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
];

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = '' } = await searchParams;
  const session = await requireAdmin();
  const current = filters.some((filter) => filter.value === status) ? status : '';
  const leads = await listLeads(session, current || undefined);

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Consultation requests"
        description="Every submission from the website forms. Mark each one as you follow it up."
      />

      <div className="mb-5 inline-flex gap-1 rounded-2xl border border-line bg-white p-1">
        {filters.map((filter) => (
          <Link
            key={filter.value || 'all'}
            href={filter.value ? `/admin/leads?status=${filter.value}` : '/admin/leads'}
            className={cn(
              'h-9 rounded-xl px-4 text-[13.5px] leading-9 font-semibold transition-colors',
              current === filter.value ? 'bg-navy text-white' : 'text-ink-600 hover:bg-mist hover:text-navy',
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <Panel bodyClassName="p-0">
        {leads.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-line text-[12px] tracking-[0.06em] text-muted uppercase">
                  <th className="px-6 py-3.5 font-semibold">Name</th>
                  <th className="px-3 py-3.5 font-semibold">Subject</th>
                  <th className="px-3 py-3.5 font-semibold">Contact</th>
                  <th className="px-3 py-3.5 font-semibold">Received</th>
                  <th className="px-6 py-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {leads.map((lead) => (
                  <tr key={lead.id} className="transition-colors hover:bg-[#FAFBFD]">
                    <td className="px-6 py-4">
                      <Link href={`/admin/leads/${lead.id}`} className="font-semibold text-navy hover:text-teal-ink">
                        {lead.name}
                      </Link>
                      <span className="block text-[12.5px] text-muted">
                        {lead.company || lead.client_type}
                      </span>
                    </td>
                    <td className="max-w-[240px] truncate px-3 py-4 text-ink-600">{lead.subject_label}</td>
                    <td className="px-3 py-4">
                      <span className="flex items-center gap-1.5 text-[13px] text-ink-600">
                        <Phone aria-hidden className="h-3.5 w-3.5" /> {lead.phone}
                      </span>
                      <span className="flex items-center gap-1.5 text-[13px] text-ink-600">
                        <Mail aria-hidden className="h-3.5 w-3.5" /> {lead.email}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-[13px] whitespace-nowrap text-muted">{timeAgo(lead.created_at)}</td>
                    <td className="px-6 py-4">
                      <Badge tone={leadTone[lead.status]} className="capitalize">
                        {lead.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Inbox}
            title={current ? `No ${current} requests` : 'No requests yet'}
            description="Consultation form submissions from the website appear here."
          />
        )}
      </Panel>
    </>
  );
}
