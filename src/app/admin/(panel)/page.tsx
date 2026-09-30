import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Home,
  Inbox,
  Layers,
  MessageSquareQuote,
  Newspaper,
  PenSquare,
  Plus,
  Settings,
  Share2,
  UserPlus,
  Users,
} from 'lucide-react';
import { Badge, EmptyState, Panel, StatCard, leadTone, timeAgo } from '@/components/admin/ui';
import { getDoc, listLeads, listRows } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/session';
import type { SiteSettings } from '@/lib/cms/types';

export const metadata: Metadata = { title: 'Dashboard' };

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Asia/Dhaka' }).format(new Date()),
  );
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default async function DashboardPage() {
  const session = await requireAdmin();
  const [leads, services, insights, team, testimonials, settings] = await Promise.all([
    listLeads(session),
    listRows(session, 'services'),
    listRows(session, 'insights'),
    listRows(session, 'team_members'),
    listRows(session, 'testimonials'),
    getDoc(session, 'settings') as Promise<unknown> as Promise<SiteSettings>,
  ]);

  const newLeads = leads.filter((lead) => lead.status === 'new').length;
  const monthAgo = Date.now() - 30 * 864e5;
  const leadsThisMonth = leads.filter((lead) => new Date(lead.created_at).getTime() > monthAgo).length;

  const checklist = [
    {
      done: !team.some((member) => String(member.name).startsWith('Placeholder')),
      label: 'Replace placeholder team profiles',
      href: '/admin/team_members',
    },
    {
      done: team.some((member) => member.photo),
      label: 'Upload team photos',
      href: '/admin/team_members',
    },
    {
      done: !testimonials.some((item) => String(item.name).startsWith('Placeholder')),
      label: 'Add real client testimonials',
      href: '/admin/testimonials',
    },
    {
      done: Boolean(settings.social?.linkedin),
      label: 'Add your LinkedIn page',
      href: '/admin/settings',
    },
    {
      done: insights.length >= 5,
      label: 'Publish at least 5 insights',
      href: '/admin/insights/new',
    },
  ];
  const done = checklist.filter((item) => item.done).length;

  const quickActions = [
    { href: '/admin/insights/new', label: 'Write an article', icon: PenSquare },
    { href: '/admin/services/new', label: 'Add a service', icon: Plus },
    { href: '/admin/team_members/new', label: 'Add team member', icon: UserPlus },
    { href: '/admin/pages/home', label: 'Edit home page', icon: Home },
    { href: '/admin/settings', label: 'Contact & address', icon: Settings },
    { href: '/admin/settings', label: 'Social media links', icon: Share2 },
  ];

  return (
    <>
      {/* Welcome banner */}
      <section className="relative mb-8 overflow-hidden rounded-3xl bg-navy p-7 text-white shadow-[0_30px_60px_-30px_rgb(0_32_74/0.8)] md:p-9">
        <div aria-hidden className="pattern-grid absolute inset-0" />
        <div aria-hidden className="absolute -top-24 -right-10 h-72 w-72 rounded-full bg-teal/25 blur-3xl" />
        <div aria-hidden className="absolute right-40 -bottom-32 h-64 w-64 rounded-full bg-orange/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[13px] font-semibold text-teal-on-navy">
              {new Intl.DateTimeFormat('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                timeZone: 'Asia/Dhaka',
              }).format(new Date())}
            </p>
            <h1 className="mt-2 font-display text-[28px] leading-tight font-bold tracking-[-0.02em] text-white md:text-[34px]">
              {greeting()} 👋
            </h1>
            <p className="mt-2 max-w-xl text-on-navy-muted">
              {newLeads
                ? `You have ${newLeads} new consultation request${newLeads > 1 ? 's' : ''} waiting.`
                : 'No new requests right now — a good moment to update your content.'}
            </p>
          </div>
          <Link
            href="/admin/leads"
            className="inline-flex h-11 items-center gap-2 self-start rounded-xl bg-gold px-5 text-sm font-bold text-navy shadow-[0_12px_28px_-12px_rgb(201_162_77/0.9)] transition hover:brightness-105 md:self-auto"
          >
            <Inbox aria-hidden className="h-4 w-4" />
            Open inbox
          </Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="New requests" value={newLeads} hint={`${leadsThisMonth} in the last 30 days`} icon={Inbox} tone="orange" href="/admin/leads?status=new" />
        <StatCard label="Services" value={services.length} hint={`${services.filter((s) => s.published).length} published`} icon={Layers} tone="navy" href="/admin/services" />
        <StatCard label="Insights" value={insights.length} hint={`${insights.filter((s) => s.published).length} published`} icon={Newspaper} tone="teal" href="/admin/insights" />
        <StatCard label="Team members" value={team.length} hint={`${testimonials.length} testimonials`} icon={Users} tone="gold" href="/admin/team_members" />
      </div>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1.6fr_1fr] [&>*]:min-w-0">
        <Panel
          title="Latest consultation requests"
          description="From the website contact and consultation forms."
          actions={
            <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm font-semibold text-teal-ink hover:underline">
              View all <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          }
          bodyClassName="p-0"
        >
          {leads.length ? (
            <ul className="divide-y divide-line">
              {leads.slice(0, 6).map((lead) => (
                <li key={lead.id}>
                  <Link href={`/admin/leads/${lead.id}`} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-mist/60">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist font-display text-sm font-bold text-navy">
                      {lead.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold text-navy">{lead.name}</span>
                      <span className="block truncate text-[13px] text-muted">{lead.subject_label}</span>
                    </span>
                    <span className="hidden shrink-0 text-[12px] text-muted sm:block">{timeAgo(lead.created_at)}</span>
                    <Badge tone={leadTone[lead.status]} className="capitalize">
                      {lead.status}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={Inbox} title="No requests yet" description="Submissions from the consultation form will appear here." />
          )}
        </Panel>

        <div className="flex min-w-0 flex-col gap-6">
          <Panel title="Quick actions">
            <div className="grid grid-cols-2 gap-2.5">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex flex-col gap-3 rounded-xl border border-line bg-[#FAFBFD] p-3.5 transition-all hover:-translate-y-0.5 hover:border-navy/20 hover:bg-white hover:shadow-[0_12px_28px_-18px_rgb(0_32_74/0.4)]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-gold">
                    <action.icon aria-hidden className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-[13px] leading-snug font-semibold text-navy">{action.label}</span>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel title="Launch checklist" description={`${done} of ${checklist.length} complete`}>
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-mist">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-ink to-teal transition-all"
                style={{ width: `${(done / checklist.length) * 100}%` }}
              />
            </div>
            <ul className="flex flex-col gap-1">
              {checklist.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="flex items-center gap-3 rounded-lg px-2 py-2 text-[14px] hover:bg-mist/60">
                    {item.done ? (
                      <CheckCircle2 aria-hidden className="h-[18px] w-[18px] shrink-0 text-emerald-600" />
                    ) : (
                      <AlertTriangle aria-hidden className="h-[18px] w-[18px] shrink-0 text-orange" />
                    )}
                    <span className={item.done ? 'text-muted line-through' : 'font-medium text-navy'}>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Testimonials" bodyClassName="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 text-gold-ink">
              <MessageSquareQuote aria-hidden className="h-5 w-5" />
            </span>
            <p className="flex-1 text-[14px] text-ink-600">
              {testimonials.filter((item) => item.published).length} showing on the home page.
            </p>
            <Link href="/admin/testimonials" className="text-sm font-semibold text-teal-ink hover:underline">
              Manage
            </Link>
          </Panel>
        </div>
      </div>
    </>
  );
}
