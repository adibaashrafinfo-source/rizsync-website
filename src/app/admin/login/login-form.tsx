'use client';

import { useActionState, useState } from 'react';
import { AlertCircle, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { signIn } from '@/app/admin/actions';
import { inputClass } from '@/components/admin/form/fields';
import { cn } from '@/lib/utils';

export function LoginForm({ initialError }: { initialError?: string }) {
  const [state, action, pending] = useActionState(signIn, undefined);
  const [show, setShow] = useState(false);
  const error = state?.error ?? initialError;

  return (
    <form action={action} className="mt-8 flex flex-col gap-5">
      {error ? (
        <p role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
          <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      ) : null}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold text-navy">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={cn(inputClass, 'h-12')}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-[13px] font-semibold text-navy">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            required
            className={cn(inputClass, 'h-12 pr-12')}
          />
          <button
            type="button"
            onClick={() => setShow((value) => !value)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute top-1/2 right-2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-mist hover:text-navy"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-navy text-[15px] font-semibold text-white shadow-[0_14px_30px_-14px_rgb(0_32_74/0.9)] transition-colors hover:bg-[#012b61] disabled:opacity-60"
      >
        {pending ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <LogIn aria-hidden className="h-5 w-5" />}
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
