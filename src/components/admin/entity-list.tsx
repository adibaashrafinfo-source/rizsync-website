'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, ExternalLink, Eye, EyeOff, Loader2, Pencil, Trash2 } from 'lucide-react';
import { deleteEntity, moveEntity } from '@/app/admin/actions';
import { getIcon } from '@/lib/cms/icons';
import { Badge } from '@/components/admin/ui';
import { cn } from '@/lib/utils';

export interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string | null;
  icon?: string;
  published: boolean;
  meta?: string;
  viewHref?: string;
}

const iconButton =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-mist hover:text-navy disabled:opacity-30';

export function EntityList({
  entityKey,
  items,
  sortable,
  label,
}: {
  entityKey: string;
  items: ListItem[];
  sortable: boolean;
  label: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    startTransition(async () => {
      const result = await fn();
      if (!result.ok && result.error) window.alert(result.error);
      router.refresh();
    });

  return (
    <div className={cn('relative', pending && 'opacity-70')}>
      {pending ? (
        <Loader2 aria-hidden className="absolute top-4 right-4 h-5 w-5 animate-spin text-navy" />
      ) : null}
      <ul className="divide-y divide-line">
        {items.map((item, index) => {
          const Icon = item.icon ? getIcon(item.icon) : null;
          return (
            <li key={item.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[#FAFBFD] md:px-6">
              {sortable ? (
                <div className="flex shrink-0 flex-col">
                  <button
                    type="button"
                    aria-label="Move up"
                    disabled={index === 0 || pending}
                    onClick={() => run(() => moveEntity(entityKey, item.id, 'up'))}
                    className={cn(iconButton, 'h-6 w-7')}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    disabled={index === items.length - 1 || pending}
                    onClick={() => run(() => moveEntity(entityKey, item.id, 'down'))}
                    className={cn(iconButton, 'h-6 w-7')}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              ) : null}

              <Link href={`/admin/${entityKey}/${item.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-mist text-navy">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail of an uploaded URL
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  ) : Icon ? (
                    <Icon aria-hidden className="h-5 w-5" />
                  ) : (
                    <span className="font-display text-sm font-bold">{item.title.slice(0, 1).toUpperCase()}</span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px] font-semibold text-navy">{item.title}</span>
                  {item.subtitle ? (
                    <span className="mt-0.5 block truncate text-[13px] text-muted">{item.subtitle}</span>
                  ) : null}
                </span>
              </Link>

              {item.meta ? <span className="hidden shrink-0 text-[12.5px] text-muted md:block">{item.meta}</span> : null}

              <Badge tone={item.published ? 'green' : 'gray'} className="hidden shrink-0 sm:inline-flex">
                {item.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                {item.published ? 'Live' : 'Hidden'}
              </Badge>

              <div className="flex shrink-0 items-center">
                {item.viewHref ? (
                  <a href={item.viewHref} target="_blank" rel="noopener noreferrer" aria-label="View on site" className={cn(iconButton, 'hidden sm:inline-flex')}>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
                <Link href={`/admin/${entityKey}/${item.id}`} aria-label="Edit" className={iconButton}>
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  aria-label="Delete"
                  disabled={pending}
                  onClick={() => {
                    if (window.confirm(`Delete “${item.title}”? This cannot be undone.`)) {
                      run(() => deleteEntity(entityKey, item.id));
                    }
                  }}
                  className={cn(iconButton, 'hover:bg-red-50 hover:text-red-600')}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="sr-only">{label}</p>
    </div>
  );
}
