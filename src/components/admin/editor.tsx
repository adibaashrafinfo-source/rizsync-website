'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, Save, Trash2 } from 'lucide-react';
import { FieldGrid } from '@/components/admin/form/fields';
import { btn } from '@/components/admin/ui';
import { deleteEntity, saveDocument, saveEntity, type ActionResult } from '@/app/admin/actions';
import type { FormSection } from '@/lib/admin/fields';
import { cn } from '@/lib/utils';

type Toast = { tone: 'success' | 'error'; message: string } | null;

function useToast() {
  const [toast, setToast] = useState<Toast>(null);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), toast.tone === 'error' ? 7000 : 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);
  return [toast, setToast] as const;
}

export function ToastView({ toast }: { toast: Toast }) {
  if (!toast) return null;
  const Icon = toast.tone === 'success' ? CheckCircle2 : AlertCircle;
  return (
    <div
      role="status"
      className={cn(
        'fixed top-5 right-5 z-[60] flex max-w-sm items-start gap-3 rounded-2xl border bg-white px-4 py-3.5 text-[14px] font-medium shadow-[0_24px_48px_-20px_rgb(0_32_74/0.45)]',
        toast.tone === 'success' ? 'border-emerald-200 text-emerald-800' : 'border-red-200 text-red-700',
      )}
    >
      <Icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />
      {toast.message}
    </div>
  );
}

/**
 * Shared editing surface: sections (stacked or as tabs), sticky save bar,
 * Ctrl/⌘+S, and a warning before leaving with unsaved changes.
 */
function EditorForm({
  sections,
  initial,
  tabs = false,
  viewHref,
  onSave,
  extraActions,
}: {
  sections: FormSection[];
  initial: Record<string, unknown>;
  tabs?: boolean;
  viewHref?: string;
  onSave: (value: Record<string, unknown>) => Promise<ActionResult>;
  extraActions?: React.ReactNode;
}) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [active, setActive] = useState(0);
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useToast();
  const dirty = useMemo(() => JSON.stringify(value) !== saved, [value, saved]);

  const save = useCallback(() => {
    startTransition(async () => {
      const result = await onSave(value);
      if (result.ok) {
        setSaved(JSON.stringify(value));
        setToast({ tone: 'success', message: result.message ?? 'Saved.' });
      } else {
        setToast({ tone: 'error', message: result.error });
      }
    });
  }, [onSave, value, setToast]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        save();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [save]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const visible = tabs ? [sections[active]] : sections;

  return (
    <>
      <ToastView toast={toast} />

      {tabs ? (
        <div className="no-scrollbar -mx-1 mb-6 overflow-x-auto px-1">
          <div role="tablist" className="inline-flex gap-1 rounded-2xl border border-line bg-white p-1 shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
            {sections.map((section, index) => (
              <button
                key={section.title}
                type="button"
                role="tab"
                aria-selected={active === index}
                onClick={() => setActive(index)}
                className={cn(
                  'h-9 rounded-xl px-4 text-[13.5px] font-semibold whitespace-nowrap transition-colors',
                  active === index ? 'bg-navy text-white shadow' : 'text-ink-600 hover:bg-mist hover:text-navy',
                )}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
        className="flex flex-col gap-6 pb-28"
      >
        {visible.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04),0_12px_32px_-24px_rgb(0_32_74/0.25)]"
          >
            <div className="border-b border-line px-6 py-5">
              <h2 className="font-display text-[16px] font-bold text-navy">{section.title}</h2>
              {section.description ? (
                <p className="mt-1 text-[13px] text-muted">{section.description}</p>
              ) : null}
            </div>
            <div className="p-6">
              <FieldGrid fields={section.fields} value={value} onChange={setValue} />
            </div>
          </section>
        ))}

        {/* Sticky save bar */}
        <div className="fixed right-0 bottom-0 left-0 z-30 border-t border-line bg-white/90 backdrop-blur-md lg:left-[272px]">
          <div className="mx-auto flex w-full max-w-[1240px] items-center gap-3 px-4 py-3 md:px-8">
            <p className="flex min-w-0 items-center gap-2 text-[13px] font-medium">
              <span
                className={cn('h-2 w-2 shrink-0 rounded-full', dirty ? 'bg-orange' : 'bg-emerald-500')}
              />
              <span className={cn('truncate', dirty ? 'text-[#b35a0b]' : 'text-muted')}>
                {dirty ? 'Unsaved changes' : 'All changes saved'}
              </span>
              <span className="hidden text-muted md:inline">· Ctrl + S to save</span>
            </p>
            <div className="ml-auto flex items-center gap-2">
              {extraActions}
              {viewHref ? (
                <a href={viewHref} target="_blank" rel="noopener noreferrer" className={cn(btn.base, btn.outline, 'hidden sm:inline-flex')}>
                  View on site <ExternalLink aria-hidden className="h-4 w-4" />
                </a>
              ) : null}
              <button type="submit" disabled={pending} className={cn(btn.base, btn.gold, 'min-w-[120px]')}>
                {pending ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Save aria-hidden className="h-4 w-4" />}
                {pending ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function DocEditor({
  docKey,
  sections,
  initial,
  viewHref,
}: {
  docKey: string;
  sections: FormSection[];
  initial: Record<string, unknown>;
  viewHref?: string;
}) {
  const onSave = useCallback((value: Record<string, unknown>) => saveDocument(docKey, value), [docKey]);
  return <EditorForm sections={sections} initial={initial} tabs viewHref={viewHref} onSave={onSave} />;
}

export function EntityEditor({
  entityKey,
  id,
  sections,
  initial,
  viewHref,
  label,
}: {
  entityKey: string;
  id: string | null;
  sections: FormSection[];
  initial: Record<string, unknown>;
  viewHref?: string;
  label: string;
}) {
  const router = useRouter();
  const [deleting, startDelete] = useTransition();
  const [toast, setToast] = useToast();

  const onSave = useCallback(
    async (value: Record<string, unknown>) => {
      const result = await saveEntity(entityKey, id, value);
      if (result.ok && !id && result.id) {
        router.replace(`/admin/${entityKey}/${result.id}?created=1`);
      }
      return result;
    },
    [entityKey, id, router],
  );

  const remove = () => {
    if (!id) return;
    if (!window.confirm(`Delete this ${label.toLowerCase()}? This cannot be undone.`)) return;
    startDelete(async () => {
      const result = await deleteEntity(entityKey, id);
      if (result.ok) router.replace(`/admin/${entityKey}?deleted=1`);
      else setToast({ tone: 'error', message: result.error });
    });
  };

  return (
    <>
      <ToastView toast={toast} />
      <EditorForm
        sections={sections}
        initial={initial}
        viewHref={id ? viewHref : undefined}
        onSave={onSave}
        extraActions={
          id ? (
            <button type="button" onClick={remove} disabled={deleting} className={cn(btn.base, btn.danger)}>
              {deleting ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Trash2 aria-hidden className="h-4 w-4" />}
              <span className="hidden sm:inline">Delete</span>
            </button>
          ) : null
        }
      />
    </>
  );
}
