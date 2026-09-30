import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Building2, Calendar, Mail, Phone, Tag, User } from 'lucide-react';
import { LeadActions } from '@/components/admin/lead-actions';
import { Badge, PageHeader, Panel, leadTone } from '@/components/admin/ui';
import { WhatsAppIcon } from '@/components/ui/social-icons';
import { getLead } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/session';

export const metadata: Metadata = { title: 'Lead' };

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdmin();
  const lead = await getLead(session, id);
  if (!lead) notFound();

  const digits = lead.phone.replace(/\D/g, '').replace(/^0/, '880');
  const received = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Dhaka',
  }).format(new Date(lead.created_at));

  const details = [
    { icon: User, label: 'Client type', value: lead.client_type },
    { icon: Building2, label: 'Company / family', value: lead.company || '—' },
    { icon: Tag, label: 'Subject', value: lead.subject_label },
    { icon: Calendar, label: 'Received', value: received },
  ];

  return (
    <>
      <PageHeader
        back={{ href: '/admin/leads', label: 'All requests' }}
        eyebrow="Consultation request"
        title={lead.name}
        actions={
          <Badge tone={leadTone[lead.status]} className="px-3 py-1 text-[13px] capitalize">
            {lead.status}
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-6">
          <Panel title="Message">
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-ink">{lead.message}</p>
          </Panel>
          <Panel title="Details" bodyClassName="grid gap-4 sm:grid-cols-2">
            {details.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mist text-navy">
                  <item.icon aria-hidden className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[12px] font-semibold tracking-[0.04em] text-muted uppercase">{item.label}</span>
                  <span className="block text-[14px] font-medium text-navy">{item.value}</span>
                </span>
              </div>
            ))}
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Get in touch" bodyClassName="flex flex-col gap-2.5">
            <a href={`tel:+${digits}`} className="flex items-center gap-3 rounded-xl border border-line p-3.5 transition-colors hover:border-navy/30 hover:bg-mist/50">
              <Phone aria-hidden className="h-5 w-5 text-navy" />
              <span className="text-[14px] font-semibold text-navy">{lead.phone}</span>
            </a>
            <a
              href={`https://wa.me/${digits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-line p-3.5 transition-colors hover:border-navy/30 hover:bg-mist/50"
            >
              <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
              <span className="text-[14px] font-semibold text-navy">WhatsApp</span>
            </a>
            <a href={`mailto:${lead.email}`} className="flex items-center gap-3 rounded-xl border border-line p-3.5 transition-colors hover:border-navy/30 hover:bg-mist/50">
              <Mail aria-hidden className="h-5 w-5 text-navy" />
              <span className="truncate text-[14px] font-semibold text-navy">{lead.email}</span>
            </a>
          </Panel>
          <LeadActions id={lead.id} status={lead.status} notes={lead.notes ?? ''} />
        </div>
      </div>
    </>
  );
}
