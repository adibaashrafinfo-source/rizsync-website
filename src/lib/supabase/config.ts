/**
 * The anon key is public by design (RLS guards every table), so the same
 * values serve the server, the browser and the admin panel.
 */
export const supabaseUrl = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  ''
).replace(/\/$/, '');

export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
