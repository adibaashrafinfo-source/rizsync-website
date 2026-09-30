import { defaultSettings } from '@/config/site';
import { defaultHome } from '@/data/home';
import { defaultAbout } from '@/data/about';
import { defaultCeo } from '@/data/ceo';
import { defaultServices } from '@/data/services';
import { defaultTeam, defaultTeamPage } from '@/data/team';
import { defaultTestimonials } from '@/data/testimonials';
import { defaultFaqs } from '@/data/faqs';
import { mergeDefaults } from '@/lib/cms/queries';
import { entities, type DocKey, type EntityKey } from '@/lib/admin/config';
import type { AdminSession } from '@/lib/admin/session';

export type Row = Record<string, unknown> & { id: string };

export interface Lead {
  id: string;
  created_at: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  client_type: string;
  subject: string;
  subject_label: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  notes: string | null;
  source: string | null;
}

/* Preview-mode stand-ins, shaped like database rows. */
function previewRows(key: EntityKey): Row[] {
  const withMeta = (rows: Record<string, unknown>[]) =>
    rows.map((row, index) => ({
      id: `preview-${index}`,
      published: true,
      sort_order: index,
      updated_at: new Date().toISOString(),
      ...row,
    }));
  switch (key) {
    case 'services':
      return withMeta(
        defaultServices.map((s) => ({
          slug: s.slug,
          title: s.title,
          short_title: s.shortTitle,
          h1: s.h1,
          nav_description: s.navDescription,
          intro: s.intro,
          color: s.color,
          icon: s.icon,
          bullets: s.bullets,
          hero_card: s.heroCard ?? null,
          items: s.items,
          why_rizsync: s.whyRizsync,
          faqs: s.faqs,
          seo_title: s.seo.title,
          seo_description: s.seo.description,
          seo_keywords: s.seo.keywords,
        })),
      );
    case 'team_members':
      return withMeta(defaultTeam.map((m) => ({ ...m })));
    case 'testimonials':
      return withMeta(defaultTestimonials.map((t) => ({ ...t, rating: String(t.rating) })));
    case 'faqs':
      return withMeta(defaultFaqs.map((f) => ({ ...f })));
    case 'insights':
      return withMeta([
        {
          slug: 'vat-return-deadlines-bangladesh',
          title: 'Monthly VAT Returns: What Actually Causes a Late Filing',
          category: 'Tax & VAT',
          published_on: '2026-08-18',
          cover: '/images/insights/vat-returns-photo.webp',
          excerpt: 'Most VAT penalties are not caused by a lack of money.',
          content: '## Example\n\nPreview content.',
          tags: ['VAT'],
          author: 'RizSync Advisory Team',
          featured: true,
        },
      ]);
  }
}

const previewLeads: Lead[] = [
  {
    id: 'preview-lead-1',
    created_at: new Date(Date.now() - 36e5).toISOString(),
    name: 'Nusrat Jahan',
    company: 'Jahan Textiles Ltd.',
    email: 'nusrat@example.com',
    phone: '01711000000',
    client_type: 'Business',
    subject: 'business-corporate',
    subject_label: 'Business & Corporate Services',
    message: 'We need help with our RJSC annual return and a trade licence renewal before next month.',
    status: 'new',
    notes: null,
    source: 'consultation-form',
  },
  {
    id: 'preview-lead-2',
    created_at: new Date(Date.now() - 2 * 864e5).toISOString(),
    name: 'Karim Ahmed',
    company: null,
    email: 'karim@example.com',
    phone: '01811000000',
    client_type: 'Individual & Family',
    subject: 'government-assistance',
    subject_label: 'Government Service Assistance',
    message: 'Passport renewal for my parents and a land mutation for our family property in Mirpur.',
    status: 'contacted',
    notes: 'Called on Tuesday, documents requested.',
    source: 'consultation-form',
  },
];

export async function listRows(session: AdminSession, key: EntityKey): Promise<Row[]> {
  if (!session.supabase) return previewRows(key);
  const config = entities[key];
  let query = session.supabase.from(config.table).select('*');
  query = query.order(config.orderBy.column, { ascending: config.orderBy.ascending });
  if (config.orderBy.column === 'sort_order') query = query.order('created_at');
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Row[];
}

export async function getRow(session: AdminSession, key: EntityKey, id: string): Promise<Row | null> {
  if (!session.supabase) return previewRows(key).find((row) => row.id === id) ?? null;
  const { data, error } = await session.supabase
    .from(entities[key].table)
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Row) ?? null;
}

const docDefaults = {
  settings: defaultSettings,
  home: defaultHome,
  about: defaultAbout,
  ceo: defaultCeo,
  team: defaultTeamPage,
};

export async function getDoc(session: AdminSession, key: DocKey): Promise<Record<string, unknown>> {
  const fallback = docDefaults[key] as unknown as Record<string, unknown>;
  if (!session.supabase) return fallback;
  const { data, error } = await session.supabase
    .from('site_content')
    .select('data')
    .eq('key', key)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return mergeDefaults(fallback, data?.data);
}

export async function listLeads(session: AdminSession, status?: string): Promise<Lead[]> {
  if (!session.supabase) {
    return status ? previewLeads.filter((lead) => lead.status === status) : previewLeads;
  }
  let query = session.supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Lead[];
}

export async function getLead(session: AdminSession, id: string): Promise<Lead | null> {
  if (!session.supabase) return previewLeads.find((lead) => lead.id === id) ?? null;
  const { data, error } = await session.supabase.from('leads').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Lead) ?? null;
}

export async function countNewLeads(session: AdminSession): Promise<number> {
  if (!session.supabase) return previewLeads.filter((lead) => lead.status === 'new').length;
  const { count } = await session.supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new');
  return count ?? 0;
}
