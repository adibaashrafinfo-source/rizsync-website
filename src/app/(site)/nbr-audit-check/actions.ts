'use server';

import { createSupabasePublicClient } from '@/lib/supabase/server';
import { supabaseConfigured } from '@/lib/supabase/config';
import { isValidAuditNumber, type AuditKind, type AuditResult } from '@/lib/audit';

/** Exact-match lookup through the audit_lookup() RPC — the lists are never exposed whole. */
export async function checkAudit(kind: AuditKind, query: string): Promise<AuditResult> {
  if (kind !== 'tin' && kind !== 'bin') return { status: 'invalid', kind: 'tin' };
  const value = String(query ?? '').slice(0, 40);
  if (!isValidAuditNumber(kind, value)) return { status: 'invalid', kind };
  if (!supabaseConfigured) return { status: 'error', kind };

  const { data, error } = await createSupabasePublicClient().rpc('audit_lookup', {
    p_kind: kind,
    p_query: value,
  });
  if (error || !data) return { status: 'error', kind };
  if (data.error === 'invalid') return { status: 'invalid', kind };
  if (!data.found) return { status: 'not_found', kind, query: value };
  return { status: 'found', kind, record: data.record } as AuditResult;
}
