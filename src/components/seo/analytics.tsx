'use client';

import Script from 'next/script';
import { GoogleTagManager } from '@next/third-parties/google';
import { siteConfig } from '@/config/site';

/**
 * GA4 is loaded through Google Tag Manager (§2). Meta Pixel sits behind an env
 * flag — when NEXT_PUBLIC_META_PIXEL_ID is empty nothing is injected at all.
 */
export function Analytics() {
  const { gtmId, metaPixelId } = siteConfig.analytics;

  return (
    <>
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}

      {metaPixelId ? (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${metaPixelId}');fbq('track','PageView');`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              alt=""
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      ) : null}
    </>
  );
}
