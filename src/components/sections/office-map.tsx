'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

/**
 * Google Maps embed — DESIGN.md §6.6.4.
 * The iframe is only mounted once the section scrolls close to the viewport,
 * so a third-party frame never competes with the page's own LCP.
 */
export function OfficeMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShow(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="overflow-hidden rounded-card border border-line shadow-soft">
      <div className="relative aspect-[16/9] w-full bg-mist md:aspect-[21/9]">
        {show ? (
          <iframe
            src={siteConfig.mapEmbedSrc}
            title={`Map to the RizSync ${siteConfig.offices.corporate.label}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-ink-600">
            <MapPin aria-hidden className="mr-2 h-4 w-4" />
            Loading map&hellip;
          </div>
        )}
      </div>

      <div className="flex flex-col items-start justify-between gap-4 border-t border-line bg-paper p-5 sm:flex-row sm:items-center">
        <p className="text-sm text-ink-600">
          <span className="font-semibold text-navy-900">
            {siteConfig.offices.corporate.label}
          </span>
          <span className="mx-2 text-line">|</span>
          {siteConfig.offices.corporate.full}
        </p>
        <Button asChild variant="secondaryLight" size="sm">
          <a href={siteConfig.mapDirectionsUrl} target="_blank" rel="noopener noreferrer">
            Get Directions
          </a>
        </Button>
      </div>
    </div>
  );
}
