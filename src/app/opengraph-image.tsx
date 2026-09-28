import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const runtime = 'nodejs';
export const alt = `${siteConfig.name} — Your Unified Professional Partner for Business & Family`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Default social card. Rendered at build time with next/og; the fonts are the
 * platform defaults because next/og cannot use next/font, and the layout is
 * built to look right without a display typeface.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: 'linear-gradient(135deg, #001533 0%, #00204A 55%, #0B3A75 100%)',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              border: '3px solid #C9A24D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{ width: 22, height: 22, borderRadius: 999, background: '#C9A24D' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -0.5 }}>RizSync</div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: 4,
                color: '#C9A24D',
                marginTop: 2,
              }}
            >
              SERVICE SOLUTION
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 60,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              maxWidth: 940,
            }}
          >
            Your Unified Professional Partner for Business &amp; Family
          </div>
          <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.72)', marginTop: 24 }}>
            Finance · Corporate · Government · Digital · Family Welfare
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {siteConfig.mottoWords.map((word) => (
            <div
              key={word}
              style={{
                border: '2px solid rgba(201,162,77,0.6)',
                borderRadius: 999,
                padding: '10px 22px',
                fontSize: 20,
                fontWeight: 600,
                color: '#C9A24D',
              }}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
