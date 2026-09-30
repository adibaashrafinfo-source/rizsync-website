import { redirect } from 'next/navigation';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * Local-only preview of the admin UI without a database (`ADMIN_PREVIEW=1`
 * with `next dev`). It can never be active in a production build.
 */
export const adminPreview =
  process.env.NODE_ENV === 'development' && process.env.ADMIN_PREVIEW === '1';

export interface AdminSession {
  supabase: SupabaseClient | null;
  user: Pick<User, 'id' | 'email'>;
}

export async function getAdminSession(): Promise<AdminSession | 'not-admin' | null> {
  if (adminPreview) return { supabase: null, user: { id: 'preview', email: 'preview@rizsync.local' } };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) return 'not-admin';
  return { supabase, user };
}

/** Guard for admin pages and actions: signed in *and* on the admin list. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  if (session === 'not-admin') redirect('/admin/login?error=not-admin');
  return session;
}
