'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ExternalLink,
  FileSearch,
  FileText,
  HelpCircle,
  Home,
  Inbox,
  Info,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Newspaper,
  Settings,
  UserCog,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { SyncMark } from '@/components/layout/logo';
import { signOut } from '@/app/admin/actions';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

function navGroups(newLeads: number): { label: string; items: NavItem[] }[] {
  return [
    {
      label: 'Overview',
      items: [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/leads', label: 'Leads', icon: Inbox, badge: newLeads },
      ],
    },
    {
      label: 'Pages',
      items: [
        { href: '/admin/pages/home', label: 'Home page', icon: Home },
        { href: '/admin/pages/about', label: 'About page', icon: Info },
        { href: '/admin/pages/ceo', label: 'CEO profile', icon: UserRound },
        { href: '/admin/pages/team', label: 'Our Team page', icon: Users },
      ],
    },
    {
      label: 'Content',
      items: [
        { href: '/admin/services', label: 'Services', icon: Layers },
        { href: '/admin/insights', label: 'Insights', icon: Newspaper },
        { href: '/admin/team_members', label: 'Our Team', icon: Users },
        { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
        { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
        { href: '/admin/audit', label: 'NBR audit lists', icon: FileSearch },
      ],
    },
    {
      label: 'Settings',
      items: [
        { href: '/admin/settings', label: 'Site settings', icon: Settings },
        { href: '/admin/account', label: 'My account', icon: UserCog },
      ],
    },
  ];
}

function isActive(pathname: string, href: string) {
  return href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
}

function Sidebar({
  email,
  newLeads,
  preview,
  onNavigate,
}: {
  email: string;
  newLeads: number;
  preview: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-b from-[#00204A] via-[#001a3d] to-[#00112a] text-white">
      <div aria-hidden className="pattern-star pointer-events-none absolute inset-0 opacity-[0.035]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-teal/20 blur-3xl"
      />

      {/* Brand */}
      <div className="relative flex items-center gap-3 px-6 pt-7 pb-6">
        <span className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-white shadow-[0_8px_24px_-8px_rgb(0_0_0/0.5)]">
          <SyncMark className="h-7 w-7" />
        </span>
        <span className="min-w-0">
          <span className="block font-display text-[19px] leading-none font-bold tracking-[-0.02em]">
            RizSync
          </span>
          <span className="mt-1.5 inline-flex items-center rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold tracking-[0.16em] text-gold uppercase">
            Admin CMS
          </span>
        </span>
      </div>

      {/* Nav */}
      <nav aria-label="Admin" className="relative flex-1 overflow-y-auto px-3 pb-6">
        {navGroups(newLeads).map((group) => (
          <div key={group.label} className="mt-5 first:mt-1">
            <p className="px-3 pb-2 text-[11px] font-semibold tracking-[0.14em] text-white/40 uppercase">
              {group.label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group relative flex h-10 items-center gap-3 rounded-xl px-3 text-[14px] font-medium transition-colors',
                        active
                          ? 'bg-white/[0.09] text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06)]'
                          : 'text-white/65 hover:bg-white/[0.05] hover:text-white',
                      )}
                    >
                      {active ? (
                        <span
                          aria-hidden
                          className="absolute top-2 bottom-2 -left-3 w-[3px] rounded-r-full bg-gold"
                        />
                      ) : null}
                      <Icon
                        aria-hidden
                        className={cn(
                          'h-[18px] w-[18px] shrink-0',
                          active ? 'text-gold' : 'text-white/50 group-hover:text-white/80',
                        )}
                        strokeWidth={2}
                      />
                      <span className="truncate">{item.label}</span>
                      {item.badge ? (
                        <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1.5 text-[11px] font-bold text-navy">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="relative border-t border-white/10 p-4">
        {preview ? (
          <p className="mb-3 rounded-lg bg-orange/15 px-3 py-2 text-[12px] leading-snug text-orange">
            Preview mode — changes are not saved.
          </p>
        ) : null}
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.05] p-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal to-teal-ink font-display text-sm font-bold text-white">
            {email.slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-white">{email}</span>
            <span className="block text-[11px] text-white/45">Administrator</span>
          </span>
          <form action={signOut}>
            <button
              type="submit"
              aria-label="Sign out"
              title="Sign out"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut aria-hidden className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/** Admin chrome: fixed sidebar on desktop, slide-over drawer on mobile. */
export function AdminShell({
  email,
  newLeads,
  preview,
  children,
}: {
  email: string;
  newLeads: number;
  preview: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-dvh bg-[#F3F6FA]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] lg:block">
        <Sidebar email={email} newLeads={newLeads} preview={preview} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            'absolute inset-0 bg-navy/60 backdrop-blur-sm transition-opacity',
            open ? 'opacity-100' : 'opacity-0',
          )}
        />
        <div
          className={cn(
            'absolute inset-y-0 left-0 w-[284px] max-w-[85vw] shadow-2xl transition-transform duration-300',
            open ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <Sidebar email={email} newLeads={newLeads} preview={preview} onNavigate={() => setOpen(false)} />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="absolute top-5 right-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10"
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/85 px-4 backdrop-blur-md md:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line text-navy lg:hidden"
          >
            <Menu aria-hidden className="h-5 w-5" />
          </button>
          <p className="hidden items-center gap-2 text-sm text-muted sm:flex">
            <FileText aria-hidden className="h-4 w-4" />
            Content Management System
          </p>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-white px-3.5 text-sm font-semibold text-navy transition-colors hover:border-navy/30"
            >
              View website
              <ExternalLink aria-hidden className="h-4 w-4" />
            </a>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1240px] px-4 py-8 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}
