import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseUrl } from '@/lib/supabase/config';

/**
 * Client bound to the visitor's session cookies — used by the admin panel so
 * every query runs as the signed-in admin and RLS decides what is allowed.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only; the
          // middleware refreshes the session instead.
        }
      },
    },
  });
}

/**
 * Cookie-less client for public reads, so pages that use it stay static
 * (ISR) instead of becoming per-request.
 */
export function createSupabasePublicClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
