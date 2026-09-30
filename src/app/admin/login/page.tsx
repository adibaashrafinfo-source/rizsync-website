import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { SyncMark } from '@/components/layout/logo';
import { LoginForm } from '@/app/admin/login/login-form';

export const metadata: Metadata = { title: 'Sign in' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="relative grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-navy lg:block">
        <div aria-hidden className="pattern-grid absolute inset-0" />
        <div aria-hidden className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-teal/20 blur-3xl" />
        <div aria-hidden className="absolute -right-24 -bottom-48 h-[460px] w-[460px] rounded-full bg-orange/15 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-14 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-white">
              <SyncMark className="h-8 w-8" />
            </span>
            <span className="font-display text-2xl font-bold tracking-[-0.02em]">RizSync</span>
          </div>

          <div className="max-w-md">
            <p className="text-[13px] font-bold tracking-[0.16em] text-teal-on-navy uppercase">
              Content Management System
            </p>
            <h1 className="mt-4 font-display text-[44px] leading-[1.08] font-bold tracking-[-0.03em] text-white">
              Your whole website, <span className="text-gold">one place</span> to manage it.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-on-navy-muted">
              Services, insights, team, contact details and every line of copy — edit, save, and
              the site updates in seconds.
            </p>
          </div>

          <p className="flex items-center gap-2 text-sm text-on-navy-faint">
            <ShieldCheck aria-hidden className="h-4 w-4 text-gold" />
            Admin access only. Every change is protected by row-level security.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center bg-[#F3F6FA] px-5 py-14">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-navy">
              <SyncMark className="h-7 w-7" />
            </span>
            <span className="font-display text-xl font-bold text-navy">RizSync Admin</span>
          </div>

          <div className="rounded-3xl border border-line bg-white p-8 shadow-[0_30px_60px_-30px_rgb(0_32_74/0.35)] sm:p-10">
            <h2 className="font-display text-[26px] font-bold tracking-[-0.02em] text-navy">Welcome back</h2>
            <p className="mt-1.5 text-[15px] text-ink-600">Sign in to manage the RizSync website.</p>
            <LoginForm initialError={error === 'not-admin' ? 'This account does not have admin access.' : undefined} />
          </div>

          <p className="mt-6 text-center text-[13px] text-muted">
            <a href="/" className="font-semibold text-teal-ink hover:underline">
              ← Back to website
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
