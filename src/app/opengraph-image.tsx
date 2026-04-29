import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'G.Era — Street Luxe. No Apologies.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 900, color: '#D4AF37', letterSpacing: '-2px' }}>
          G.ERA
        </div>
        <div style={{ fontSize: 24, color: '#ffffff', letterSpacing: '8px', marginTop: 16, textTransform: 'uppercase' }}>
          Street Luxe. No Apologies.
        </div>
      </div>
    ),
    { ...size }
  );
}
