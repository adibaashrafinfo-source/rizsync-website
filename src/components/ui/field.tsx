'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/** HOME_REDESIGN.md §4.13: 52px, 12px radius, 1.5px border, teal-ink focus + 3px ring. */
const base =
  'w-full rounded-btn border-[1.5px] border-line-2 bg-white px-4 text-[15px] text-ink outline-none focus-visible:outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-teal-ink focus:ring-[3px] focus:ring-teal/15 disabled:opacity-60 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/15';

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(base, 'h-[52px]', className)} {...props} />
  ),
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(base, 'min-h-32 py-3 leading-relaxed', className)} {...props} />
  ),
);
Textarea.displayName = 'Textarea';

/**
 * Native select, wrapped for the chevron. Native beats a custom listbox here:
 * it is keyboard- and screen-reader-correct for free and uses the platform
 * picker on mobile.
 */
export const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<'select'>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(base, 'h-[52px] appearance-none pr-10', className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-ink-600"
      />
    </div>
  ),
);
Select.displayName = 'Select';

export function Label({
  className,
  required,
  children,
  ...props
}: React.ComponentProps<'label'> & { required?: boolean }) {
  return (
    <label className={cn('text-sm font-semibold text-navy', className)} {...props}>
      {children}
      {required ? (
        <span className="ml-0.5 text-red-600" aria-hidden>
          *
        </span>
      ) : null}
    </label>
  );
}

export function FieldError({ id, children }: { id: string; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="text-sm font-medium text-red-600">
      {children}
    </p>
  );
}

export function Field({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('flex flex-col gap-1.5', className)}>{children}</div>;
}
