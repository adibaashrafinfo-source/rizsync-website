import { Suspense } from 'react';
import { ConsultationForm } from '@/components/forms/consultation-form';

/**
 * `ConsultationForm` reads `?service=` via useSearchParams, which Next.js
 * requires inside a Suspense boundary so the page stays statically generated.
 */
export function ConsultationFormBoundary(props: { defaultSubject?: string; className?: string }) {
  return (
    <Suspense
      fallback={<div className="h-[720px] animate-pulse rounded-panel border border-line bg-mist" />}
    >
      <ConsultationForm {...props} />
    </Suspense>
  );
}
