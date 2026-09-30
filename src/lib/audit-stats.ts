import { unstable_cache } from 'next/cache';
import { createSupabasePublicClient } from '@/lib/supabase/server';
import { supabaseConfigured } from '@/lib/supabase/config';

export const AUDIT_TAG = 'audit';

/** Record counts for the stat cards. Cached; the lists change rarely. */
export const getAuditStats = unstable_cache(
  async (): Promise<{ tin: number; bin: number }> => {
    if (!supabaseConfigured) return { tin: 0, bin: 0 };
    const { data, error } = await createSupabasePublicClient().rpc('audit_stats');
    if (error || !data) return { tin: 0, bin: 0 };
    return { tin: Number(data.tin) || 0, bin: Number(data.bin) || 0 };
  },
  ['audit', 'stats'],
  { tags: [AUDIT_TAG, 'cms'], revalidate: 3600 },
);
