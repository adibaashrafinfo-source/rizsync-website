import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, ExternalLink, FileText, Search, SearchCheck } from 'lucide-react';
import { EmptyState, PageHeader, Panel, StatCard } from '@/components/admin/ui';
import { requireAdmin } from '@/lib/admin/session';

export const metadata: Metadata = { title: 'NBR audit lists' };

const PAGE_SIZE = 50;

interface BinRow {
  bin: string;
  name: string;
  address: string;
}

export default async function AuditAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = '', page = '1' } = await searchParams;
  const session = await requireAdmin();
  const pageNo = Math.max(1, Number.parseInt(page, 10) || 1);
  const term = q.trim().slice(0, 80);

  let rows: BinRow[] = [];
  let total = 0;
  let tinCount = 0;
  let binCount = 0;
  let searches = 0;
  let hits = 0;

  if (session.supabase) {
    const since = new Date(Date.now() - 30 * 864e5).toISOString();
    let query = session.supabase
      .from('audit_bin')
      .select('bin, name, address', { count: 'exact' })
      .order('name')
      .range((pageNo - 1) * PAGE_SIZE, pageNo * PAGE_SIZE - 1);
    if (term) {
      const safe = term.replace(/[%,()]/g, ' ');
      query = query.or(`bin.ilike.%${safe}%,name.ilike.%${safe}%,address.ilike.%${safe}%`);
    }
    const [list, bin, tin, lookups, found] = await Promise.all([
      query,
      session.supabase.from('audit_bin').select('bin', { count: 'exact', head: true }),
      session.supabase.from('audit_tin').select('tin', { count: 'exact', head: true }),
      session.supabase.from('audit_lookups').select('id', { count: 'exact', head: true }).gte('created_at', since),
      session.supabase
        .from('audit_lookups')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', since)
        .eq('found', true),
    ]);
    rows = (list.data ?? []) as BinRow[];
    total = list.count ?? 0;
    binCount = bin.count ?? 0;
    tinCount = tin.count ?? 0;
    searches = lookups.count ?? 0;
    hits = found.count ?? 0;
  }

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const href = (p: number) => `/admin/audit?${new URLSearchParams({ ...(term ? { q: term } : {}), page: String(p) })}`;

  return (
    <>
      <PageHeader
        eyebrow="Tools"
        title="NBR audit lists"
        description="The records behind the public NBR Audit Check page. Visitors can only look up one exact TIN or BIN at a time."
        actions={
          <Link
            href="/nbr-audit-check"
            target="_blank"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-navy hover:bg-mist"
          >
            View page <ExternalLink aria-hidden className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="BIN records (VAT)" value={binCount} hint="From Audit_BIN_List.pdf" icon={Building2} tone="orange" />
        <StatCard label="TIN records (income tax)" value={tinCount} hint={tinCount ? 'Loaded' : 'Awaiting TIN list PDFs'} icon={FileText} tone="teal" />
        <StatCard label="Searches (30 days)" value={searches} hint="No search terms are stored" icon={Search} tone="navy" />
        <StatCard label="Matches (30 days)" value={hits} hint={searches ? `${Math.round((hits / searches) * 100)}% of searches` : 'No searches yet'} icon={SearchCheck} tone="gold" />
      </div>

      <Panel
        className="mt-6"
        title="BIN list"
        description={term ? `${total} match${total === 1 ? '' : 'es'} for “${term}”` : `${total} institutions`}
        bodyClassName="p-0"
        actions={
          <form className="flex gap-2" action="/admin/audit">
            <input
              name="q"
              defaultValue={term}
              placeholder="Search BIN, name or address"
              className="h-10 w-56 rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/15 sm:w-72"
            />
            <button className="h-10 rounded-xl bg-navy px-4 text-sm font-semibold text-white">Search</button>
          </form>
        }
      >
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[14px]">
              <thead className="bg-mist/60 text-[12px] font-semibold tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-6 py-3">BIN</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Registered HQ address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row) => (
                  <tr key={row.bin} className="align-top hover:bg-mist/40">
                    <td className="px-6 py-3 font-mono font-semibold whitespace-nowrap text-navy">{row.bin}</td>
                    <td className="px-6 py-3 font-medium text-navy">{row.name}</td>
                    <td className="px-6 py-3 text-ink-600">{row.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={Building2} title="No records" description={term ? 'Try a different search.' : 'The BIN list has not been loaded.'} />
        )}
        {pages > 1 ? (
          <div className="flex items-center justify-between border-t border-line px-6 py-3 text-sm">
            <span className="text-muted">
              Page {pageNo} of {pages}
            </span>
            <div className="flex gap-2">
              {pageNo > 1 ? (
                <Link href={href(pageNo - 1)} className="rounded-lg border border-line px-3 py-1.5 font-semibold text-navy hover:bg-mist">
                  Previous
                </Link>
              ) : null}
              {pageNo < pages ? (
                <Link href={href(pageNo + 1)} className="rounded-lg border border-line px-3 py-1.5 font-semibold text-navy hover:bg-mist">
                  Next
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </Panel>
    </>
  );
}
