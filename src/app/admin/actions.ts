'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { CMS_TAG } from '@/lib/cms/queries';
import { requireAdmin } from '@/lib/admin/session';
import { docs, entities, isDocKey, isEntityKey } from '@/lib/admin/config';
import { sanitizeSections, ValidationError } from '@/lib/admin/fields';

export type ActionResult = { ok: true; id?: string; message?: string } | { ok: false; error: string };

/** Content changed: rebuild every cached public page on its next request. */
function refreshSite() {
  revalidateTag(CMS_TAG);
  revalidatePath('/', 'layout');
}

function failure(error: unknown): ActionResult {
  if (error instanceof ValidationError) return { ok: false, error: error.message };
  const message = (error as { message?: string })?.message ?? 'Something went wrong.';
  if (/duplicate key/i.test(message)) {
    return { ok: false, error: 'That URL slug is already used — choose another.' };
  }
  console.error('[admin]', message);
  return { ok: false, error: message };
}

const previewResult: ActionResult = {
  ok: false,
  error: 'Preview mode — connect Supabase to save changes.',
};

/* ------------------------------------------------------------------- auth */

export async function signIn(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { error: 'Enter your email and password.' };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: 'Incorrect email or password.' };

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: 'This account does not have admin access.' };
  }
  redirect('/admin');
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function changePassword(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session.supabase) return previewResult;
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirm') ?? '');
  if (password.length < 10) return { ok: false, error: 'Use at least 10 characters.' };
  if (password !== confirm) return { ok: false, error: 'The two passwords do not match.' };
  const { error } = await session.supabase.auth.updateUser({ password });
  if (error) return failure(error);
  return { ok: true, message: 'Password updated.' };
}

/* -------------------------------------------------------------- documents */

export async function saveDocument(key: string, data: Record<string, unknown>): Promise<ActionResult> {
  try {
    if (!isDocKey(key)) return { ok: false, error: 'Unknown page.' };
    const session = await requireAdmin();
    if (!session.supabase) return previewResult;

    const clean = sanitizeSections(docs[key].sections, data);
    const { error } = await session.supabase
      .from('site_content')
      .upsert({ key, data: clean }, { onConflict: 'key' });
    if (error) throw error;

    refreshSite();
    return { ok: true, message: 'Saved — the website is updated.' };
  } catch (error) {
    return failure(error);
  }
}

/* ------------------------------------------------------------ collections */

export async function saveEntity(
  key: string,
  id: string | null,
  data: Record<string, unknown>,
): Promise<ActionResult> {
  try {
    if (!isEntityKey(key)) return { ok: false, error: 'Unknown content type.' };
    const session = await requireAdmin();
    if (!session.supabase) return previewResult;

    const config = entities[key];
    const clean = sanitizeSections(config.sections, data);
    const table = session.supabase.from(config.table);
    const { data: saved, error } = id
      ? await table.update(clean).eq('id', id).select('id').single()
      : await table.insert(clean).select('id').single();
    if (error) throw error;

    refreshSite();
    return { ok: true, id: saved.id as string, message: 'Saved — the website is updated.' };
  } catch (error) {
    return failure(error);
  }
}

export async function deleteEntity(key: string, id: string): Promise<ActionResult> {
  try {
    if (!isEntityKey(key)) return { ok: false, error: 'Unknown content type.' };
    const session = await requireAdmin();
    if (!session.supabase) return previewResult;

    const { error } = await session.supabase.from(entities[key].table).delete().eq('id', id);
    if (error) throw error;

    refreshSite();
    revalidatePath(`/admin/${key}`);
    return { ok: true, message: 'Deleted.' };
  } catch (error) {
    return failure(error);
  }
}

/** Swaps an item with its neighbour in display order. */
export async function moveEntity(key: string, id: string, direction: 'up' | 'down'): Promise<ActionResult> {
  try {
    if (!isEntityKey(key) || !entities[key].sortable) return { ok: false, error: 'Not sortable.' };
    const session = await requireAdmin();
    if (!session.supabase) return previewResult;

    const { data, error } = await session.supabase
      .from(entities[key].table)
      .select('id, sort_order')
      .order('sort_order')
      .order('created_at');
    if (error) throw error;

    const rows = data as { id: string; sort_order: number }[];
    const index = rows.findIndex((row) => row.id === id);
    const target = direction === 'up' ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= rows.length) return { ok: true };

    [rows[index], rows[target]] = [rows[target], rows[index]];
    // Renumber everything so duplicate sort orders from manual edits resolve.
    const updates = rows.map((row, position) =>
      session.supabase!.from(entities[key].table).update({ sort_order: position }).eq('id', row.id),
    );
    const results = await Promise.all(updates);
    const failed = results.find((result) => result.error);
    if (failed?.error) throw failed.error;

    refreshSite();
    revalidatePath(`/admin/${key}`);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

/* ------------------------------------------------------------------ leads */

const LEAD_STATUSES = ['new', 'contacted', 'closed'];

export async function updateLead(
  id: string,
  patch: { status?: string; notes?: string },
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    if (!session.supabase) return previewResult;

    const update: Record<string, string> = {};
    if (patch.status !== undefined) {
      if (!LEAD_STATUSES.includes(patch.status)) return { ok: false, error: 'Unknown status.' };
      update.status = patch.status;
    }
    if (patch.notes !== undefined) update.notes = patch.notes.slice(0, 5000);

    const { error } = await session.supabase.from('leads').update(update).eq('id', id);
    if (error) throw error;

    revalidatePath('/admin', 'layout');
    return { ok: true, message: 'Lead updated.' };
  } catch (error) {
    return failure(error);
  }
}

export async function deleteLead(id: string): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    if (!session.supabase) return previewResult;
    const { error } = await session.supabase.from('leads').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin', 'layout');
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}
