'use client';

import { useActionState } from 'react';
import { Loader2 } from 'lucide-react';
import { changePassword } from '@/app/admin/actions';
import { inputClass } from '@/components/admin/form/fields';
import { btn } from '@/components/admin/ui';
import { cn } from '@/lib/utils';

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined);

  return (
    <form action={action} className="flex w-full flex-col gap-4">
      <div>
        <label htmlFor="new-password" className="mb-1.5 block text-[13px] font-semibold text-navy">
          New password
        </label>
        <input id="new-password" name="password" type="password" autoComplete="new-password" required minLength={10} className={cn(inputClass, 'h-11')} />
      </div>
      <div>
        <label htmlFor="confirm-password" className="mb-1.5 block text-[13px] font-semibold text-navy">
          Confirm new password
        </label>
        <input id="confirm-password" name="confirm" type="password" autoComplete="new-password" required minLength={10} className={cn(inputClass, 'h-11')} />
      </div>
      {state ? (
        <p
          role="status"
          className={cn(
            'rounded-xl px-3.5 py-2.5 text-sm font-medium',
            state.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700',
          )}
        >
          {state.ok ? state.message : state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={cn(btn.base, btn.primary, 'self-start')}>
        {pending ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : null}
        Update password
      </button>
    </form>
  );
}
