'use client';

import { createContext, useContext } from 'react';
import type { Service, SiteConfig } from '@/lib/cms/types';

interface SiteData {
  config: SiteConfig;
  services: Service[];
}

const SiteDataContext = createContext<SiteData | null>(null);

/**
 * Hands the CMS settings and service list (fetched once in the site layout)
 * to client components such as the header, mobile nav and consultation form.
 */
export function SiteDataProvider({ value, children }: { value: SiteData; children: React.ReactNode }) {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData(): SiteData {
  const value = useContext(SiteDataContext);
  if (!value) throw new Error('useSiteData must be used inside <SiteDataProvider>');
  return value;
}
