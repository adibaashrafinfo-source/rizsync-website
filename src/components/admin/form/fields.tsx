'use client';

import { useId, useRef, useState } from 'react';
import {
  Bold,
  ChevronDown,
  ChevronUp,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Plus,
  Quote,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { getIcon, iconNames } from '@/lib/cms/icons';
import { parseSegments } from '@/lib/cms/segments';
import { accentOptions, emptyObject, emptyValue, type Field } from '@/lib/admin/fields';
import { cn } from '@/lib/utils';

export const inputClass =
  'block w-full rounded-xl border border-line-2 bg-white px-3.5 text-[15px] text-ink shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-teal-ink focus:outline-none focus:ring-4 focus:ring-teal/10';

const swatch = { teal: 'bg-teal', orange: 'bg-orange', gold: 'bg-gold', navy: 'bg-navy' } as const;

/* ------------------------------------------------------------- building */

function FieldShell({
  field,
  id,
  children,
}: {
  field: Field;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('min-w-0', field.half ? 'md:col-span-1' : 'md:col-span-2')}>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1 text-[13px] font-semibold text-navy">
        {field.label}
        {field.required ? <span className="text-red-500">*</span> : null}
      </label>
      {children}
      {field.help ? <p className="mt-1.5 text-[12.5px] leading-snug text-muted">{field.help}</p> : null}
    </div>
  );
}

export function FieldGrid({
  fields,
  value,
  onChange,
}: {
  fields: Field[];
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {fields.map((field) => (
        <FieldInput
          key={field.name}
          field={field}
          value={value?.[field.name]}
          onChange={(next) => onChange({ ...value, [field.name]: next })}
        />
      ))}
    </div>
  );
}

export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const id = useId();
  const text = value === null || value === undefined ? '' : String(value);

  switch (field.type) {
    case 'group':
      return <GroupField field={field} value={value} onChange={onChange} />;
    case 'repeater':
      return <RepeaterField field={field} value={value} onChange={onChange} />;

    case 'textarea':
      return (
        <FieldShell field={field} id={id}>
          <textarea
            id={id}
            rows={field.rows ?? 3}
            value={text}
            placeholder={field.placeholder}
            onChange={(event) => onChange(event.target.value)}
            className={cn(inputClass, 'resize-y py-3 leading-relaxed')}
          />
        </FieldShell>
      );

    case 'markdown':
      return (
        <FieldShell field={field} id={id}>
          <MarkdownInput id={id} value={text} rows={field.rows} onChange={onChange} />
        </FieldShell>
      );

    case 'markup':
      return (
        <FieldShell field={field} id={id}>
          <input
            id={id}
            value={text}
            onChange={(event) => onChange(event.target.value)}
            className={cn(inputClass, 'h-11')}
          />
          {text ? (
            <p className="mt-2 rounded-lg bg-navy px-3 py-2 font-display text-[15px] font-bold text-white">
              {parseSegments(text).map((segment, index) => (
                <span
                  key={index}
                  className={cn(
                    segment.accent === 'orange' && 'text-orange',
                    segment.accent === 'teal' && 'text-teal',
                    segment.accent === 'gold' && 'text-gold',
                  )}
                >
                  {segment.text}
                </span>
              ))}
            </p>
          ) : null}
        </FieldShell>
      );

    case 'toggle':
      return (
        <div className={cn('min-w-0', field.half ? 'md:col-span-1' : 'md:col-span-2')}>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-mist/60 p-3.5">
            <button
              type="button"
              role="switch"
              aria-checked={Boolean(value)}
              onClick={() => onChange(!value)}
              className={cn(
                'relative mt-0.5 inline-flex h-6 w-11 shrink-0 rounded-full transition-colors',
                value ? 'bg-teal-ink' : 'bg-slate-300',
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                  value ? 'translate-x-5' : '',
                )}
              />
            </button>
            <span>
              <span className="block text-[14px] font-semibold text-navy">{field.label}</span>
              {field.help ? <span className="mt-0.5 block text-[12.5px] text-muted">{field.help}</span> : null}
            </span>
          </label>
        </div>
      );

    case 'select':
      return (
        <FieldShell field={field} id={id}>
          <select
            id={id}
            value={text}
            onChange={(event) => onChange(event.target.value)}
            className={cn(inputClass, 'h-11 appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10')}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            }}
          >
            {(field.options ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FieldShell>
      );

    case 'color':
      return (
        <FieldShell field={field} id={id}>
          <div id={id} role="radiogroup" className="flex flex-wrap gap-2">
            {accentOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={text === option.value}
                onClick={() => onChange(option.value)}
                className={cn(
                  'inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition-all',
                  text === option.value
                    ? 'border-navy bg-navy text-white'
                    : 'border-line bg-white text-navy hover:border-navy/30',
                )}
              >
                <span className={cn('h-4 w-4 rounded-full ring-2 ring-white/70', swatch[option.value as 'teal'])} />
                {option.label}
              </button>
            ))}
          </div>
        </FieldShell>
      );

    case 'icon':
      return (
        <FieldShell field={field} id={id}>
          <div id={id} role="radiogroup" className="grid grid-cols-6 gap-1.5 sm:grid-cols-9 lg:grid-cols-13">
            {iconNames.map((name) => {
              const Icon = getIcon(name);
              const selected = text === name;
              return (
                <button
                  key={name}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  title={name}
                  aria-label={name}
                  onClick={() => onChange(name)}
                  className={cn(
                    'flex aspect-square items-center justify-center rounded-xl border transition-all',
                    selected
                      ? 'border-navy bg-navy text-gold shadow-[0_8px_18px_-10px_rgb(0_32_74/0.8)]'
                      : 'border-line bg-white text-ink-600 hover:border-navy/30 hover:text-navy',
                  )}
                >
                  <Icon aria-hidden className="h-[18px] w-[18px]" />
                </button>
              );
            })}
          </div>
        </FieldShell>
      );

    case 'image':
      return (
        <FieldShell field={field} id={id}>
          <ImageInput id={id} value={text} folder={field.folder ?? 'uploads'} onChange={onChange} />
        </FieldShell>
      );

    case 'list':
      return (
        <FieldShell field={field} id={id}>
          <ListInput id={id} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />
        </FieldShell>
      );

    default: {
      const type =
        field.type === 'number'
          ? 'number'
          : field.type === 'date'
            ? 'date'
            : field.type === 'email'
              ? 'email'
              : field.type === 'url'
                ? 'url'
                : 'text';
      return (
        <FieldShell field={field} id={id}>
          <input
            id={id}
            type={type}
            value={text}
            placeholder={field.placeholder}
            onChange={(event) =>
              onChange(field.type === 'number' ? Number(event.target.value) : event.target.value)
            }
            className={cn(inputClass, 'h-11', field.type === 'slug' && 'font-mono text-[14px]')}
          />
        </FieldShell>
      );
    }
  }
}

/* ----------------------------------------------------------------- group */

function GroupField({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const enabled = value !== null && value !== undefined;

  if (field.optional && !enabled) {
    return (
      <div className="md:col-span-2">
        <button
          type="button"
          onClick={() => onChange(emptyObject(field.fields ?? []))}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-line-2 px-4 text-sm font-semibold text-teal-ink hover:border-teal-ink"
        >
          <Plus aria-hidden className="h-4 w-4" /> Add {field.label.toLowerCase()}
        </button>
      </div>
    );
  }

  return (
    <fieldset className="rounded-2xl border border-line bg-[#FAFBFD] p-5 md:col-span-2">
      <legend className="flex w-full items-center justify-between px-1 text-[13px] font-bold tracking-[0.04em] text-navy">
        <span className="rounded-md bg-white px-2 py-0.5 shadow-[0_0_0_1px_var(--line)]">{field.label}</span>
      </legend>
      <FieldGrid
        fields={field.fields ?? []}
        value={(value ?? {}) as Record<string, unknown>}
        onChange={onChange}
      />
      {field.optional ? (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-red-600 hover:underline"
        >
          <Trash2 aria-hidden className="h-3.5 w-3.5" /> Remove {field.label.toLowerCase()}
        </button>
      ) : null}
    </fieldset>
  );
}

/* -------------------------------------------------------------- repeater */

function RepeaterField({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const update = (index: number, next: Record<string, unknown>) =>
    onChange(items.map((item, i) => (i === index ? next : item)));
  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setOpenIndex(openIndex === index ? target : openIndex);
  };

  return (
    <div className="md:col-span-2">
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-navy">
            {field.label} <span className="font-normal text-muted">({items.length})</span>
          </p>
          {field.help ? <p className="mt-0.5 text-[12.5px] text-muted">{field.help}</p> : null}
        </div>
      </div>

      <ol className="flex flex-col gap-2">
        {items.map((item, index) => {
          const open = openIndex === index;
          const label = String(item?.[field.itemLabel ?? ''] ?? '') || `Item ${index + 1}`;
          return (
            <li key={index} className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mist text-[12px] font-bold text-navy">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="min-w-0 flex-1 truncate py-1 text-left text-[14px] font-semibold text-navy"
                >
                  {label}
                </button>
                <div className="flex shrink-0 items-center">
                  <IconButton label="Move up" onClick={() => move(index, -1)} disabled={index === 0}>
                    <ChevronUp className="h-4 w-4" />
                  </IconButton>
                  <IconButton label="Move down" onClick={() => move(index, 1)} disabled={index === items.length - 1}>
                    <ChevronDown className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    label="Remove"
                    danger
                    onClick={() => {
                      onChange(items.filter((_, i) => i !== index));
                      setOpenIndex(null);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="ml-1 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-teal-ink hover:bg-mist"
                  >
                    {open ? 'Close' : 'Edit'}
                  </button>
                </div>
              </div>
              {open ? (
                <div className="border-t border-line bg-[#FAFBFD] p-4">
                  <FieldGrid fields={field.fields ?? []} value={item} onChange={(next) => update(index, next)} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        onClick={() => {
          onChange([...items, emptyObject(field.fields ?? [])]);
          setOpenIndex(items.length);
        }}
        className="mt-2 inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-line-2 px-4 text-sm font-semibold text-teal-ink transition-colors hover:border-teal-ink hover:bg-teal-50/50"
      >
        <Plus aria-hidden className="h-4 w-4" /> Add {singular(field.label)}
      </button>
    </div>
  );
}

function singular(label: string) {
  const lower = label.toLowerCase();
  if (lower.endsWith('ies')) return lower.slice(0, -3) + 'y';
  if (lower.endsWith('s') && !/(ss|is)$/.test(lower)) return lower.slice(0, -1);
  return 'item';
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors disabled:opacity-30',
        danger ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-mist hover:text-navy',
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ list */

function ListInput({ id, value, onChange }: { id: string; value: string[]; onChange: (v: unknown) => void }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const parts = draft
      .split(/\n|,(?=\s*\S)/)
      .map((part) => part.trim())
      .filter(Boolean);
    if (!parts.length) return;
    onChange([...value, ...parts]);
    setDraft('');
  };

  return (
    <div className="rounded-xl border border-line-2 bg-white p-2 focus-within:border-teal-ink focus-within:ring-4 focus-within:ring-teal/10">
      {value.length ? (
        <ul className="flex flex-wrap gap-1.5 p-1">
          {value.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="inline-flex max-w-full items-center gap-1 rounded-lg bg-mist py-1 pr-1 pl-2.5 text-[13px] font-medium text-navy"
            >
              <span className="truncate">{item}</span>
              <button
                type="button"
                aria-label={`Remove ${item}`}
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="inline-flex h-5 w-5 items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-red-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex items-center gap-2">
        <input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              add();
            }
          }}
          placeholder="Type and press Enter"
          className="h-9 min-w-0 flex-1 bg-transparent px-2 text-[14px] focus:outline-none"
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex h-8 items-center gap-1 rounded-lg bg-mist px-3 text-[13px] font-semibold text-navy hover:bg-line"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- image */

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

function ImageInput({
  id,
  value,
  folder,
  onChange,
}: {
  id: string;
  value: string;
  folder: string;
  onChange: (v: unknown) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    if (!file.type.startsWith('image/')) return setError('Please choose an image file.');
    if (file.size > MAX_UPLOAD_BYTES) return setError('Images must be under 8 MB.');
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(path, file, { cacheControl: '31536000', contentType: file.type });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('media').getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (cause) {
      setError((cause as Error)?.message || 'Upload failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) void upload(file);
      }}
      className="flex flex-col gap-3 rounded-xl border border-dashed border-line-2 bg-[#FAFBFD] p-3 sm:flex-row sm:items-center"
    >
      <div className="relative flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-mist sm:w-44">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- previews arbitrary uploaded URLs
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImagePlus aria-hidden className="h-7 w-7 text-slate-400" />
        )}
        {busy ? (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 className="h-6 w-6 animate-spin text-navy" />
          </span>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-navy px-3.5 text-[13px] font-semibold text-white hover:bg-[#012b61] disabled:opacity-60"
          >
            <Upload aria-hidden className="h-4 w-4" /> {value ? 'Replace' : 'Upload image'}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-[13px] font-semibold text-red-600 hover:bg-red-50"
            >
              <Trash2 aria-hidden className="h-4 w-4" /> Remove
            </button>
          ) : null}
        </div>
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value || null)}
          placeholder="…or paste an image URL"
          className={cn(inputClass, 'mt-2 h-9 text-[13px]')}
        />
        <p className="mt-1.5 text-[12px] text-muted">Drag & drop works too. JPG, PNG or WebP up to 8 MB.</p>
        {error ? <p className="mt-1 text-[12.5px] font-semibold text-red-600">{error}</p> : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
          event.target.value = '';
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------------- markdown */

function MarkdownInput({
  id,
  value,
  rows,
  onChange,
}: {
  id: string;
  value: string;
  rows?: number;
  onChange: (v: unknown) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const wrap = (before: string, after = before, placeholder = 'text') => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const selected = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  const linePrefix = (prefix: string) => {
    const el = ref.current;
    if (!el) return;
    const start = value.lastIndexOf('\n', el.selectionStart - 1) + 1;
    onChange(value.slice(0, start) + prefix + value.slice(start));
    requestAnimationFrame(() => el.focus());
  };

  const tools = [
    { label: 'Heading', icon: Heading2, run: () => linePrefix('## ') },
    { label: 'Sub-heading', icon: Heading3, run: () => linePrefix('### ') },
    { label: 'Bold', icon: Bold, run: () => wrap('**') },
    { label: 'Italic', icon: Italic, run: () => wrap('_') },
    { label: 'Bullet list', icon: List, run: () => linePrefix('- ') },
    { label: 'Numbered list', icon: ListOrdered, run: () => linePrefix('1. ') },
    { label: 'Quote', icon: Quote, run: () => linePrefix('> ') },
    { label: 'Link', icon: Link2, run: () => wrap('[', '](https://)', 'link text') },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-line-2 bg-white focus-within:border-teal-ink focus-within:ring-4 focus-within:ring-teal/10">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-line bg-[#FAFBFD] px-2 py-1.5">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            onClick={tool.run}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-navy hover:shadow-[0_0_0_1px_var(--line)]"
          >
            <tool.icon className="h-4 w-4" />
          </button>
        ))}
        <span className="ml-auto pr-1 text-[12px] text-muted">
          {value.trim() ? value.trim().split(/\s+/).length : 0} words
        </span>
      </div>
      <textarea
        ref={ref}
        id={id}
        rows={rows ?? 18}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="block w-full resize-y px-4 py-3 font-mono text-[13.5px] leading-relaxed text-ink focus:outline-none"
      />
    </div>
  );
}

export { emptyValue };
