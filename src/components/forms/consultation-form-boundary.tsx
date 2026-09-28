import { Suspense } from 'react';
import { ConsultationForm } from '@/components/forms/consultation-form';
import type { clientTypes } from '@/lib/validators';

/**
 * `ConsultationForm` reads `?service=` via useSearchParams, which Next.js
 * requires to sit inside a Suspense boundary so the rest of the page can still
 * be statically generated.
 */
export function ConsultationFormBoundary(props: {
  defaultSubject?: string;
  defaultClientType?: (typeof clientTypes)[number];
  className?: string;
}) {
  return (
    <Suspense
      fallback={
        <div className="h-[640px] animate-pulse rounded-card border border-line bg-mist" />
      }
    >
      <ConsultationForm {...props} />
    </Suspense>
  );
}
