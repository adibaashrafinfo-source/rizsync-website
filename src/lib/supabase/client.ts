'use client';

import { createBrowserClient } from '@supabase/ssr';
import { supabaseAnonKey, supabaseUrl } from '@/lib/supabase/config';

/** Browser client for the admin panel (image uploads). */
export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
