import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { BRAND } from './brand';

// Smooth closed wave path across the frame. `phase` is in radians; every term uses an
// integer multiple of it so a full 2π cycle returns exactly to the start (clean loops).
function wavePath(w: number, h: number, baseY: number, amp: number, phase: number, variant: number) {
  const pts: [number, number][] = [];
  const steps = 64;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const u = (i / steps) * Math.PI * 2;
    const y =
      baseY +
      amp * 0.55 * Math.sin(u * 1.0 + phase + variant) +
      amp * 0.3 * Math.sin(u * 2.0 - phase * 2 + variant * 1.7) +
      amp * 0.15 * Math.sin(u * 3.0 + phase * 3 + variant * 0.6);
    pts.push([x, y]);
  }
  let d = `M 0 ${h} L ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d += ` Q ${x0} ${y0} ${mx} ${(y0 + y1) / 2}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last[0]} ${last[1]} L ${w} ${h} Z`;
  return d;
}

export const Background: React.FC<{ grain?: boolean; still?: boolean }> = ({ grain = true, still = false }) => {
  const frame = useCurrentFrame();
  const { width: w, height: h, durationInFrames } = useVideoConfig();
  const phase = still ? 0.9 : (frame / durationInFrames) * Math.PI * 2;
  const portrait = h > w;
  const amp = (portrait ? 0.07 : 0.11) * h;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 15% 0%, ${BRAND.orangeLight} 0%, ${BRAND.orange} 42%, ${BRAND.orangeDeep} 100%)`,
        }}
      />
      {/* warm ochre glow behind the window */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 45% at 70% 30%, ${BRAND.ochre}55 0%, transparent 70%)`,
        }}
      />
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="wave-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={BRAND.greenLight} />
            <stop offset="1" stopColor={BRAND.greenDeep} />
          </linearGradient>
        </defs>
        <path d={wavePath(w, h, h * (portrait ? 0.6 : 0.56), amp * 1.1, phase, 2.1)} fill={BRAND.ochre} opacity={0.55} />
        <path d={wavePath(w, h, h * (portrait ? 0.66 : 0.64), amp, phase, 0)} fill="url(#wave-front)" />
      </svg>
      {grain && (
        <svg width={w} height={h} style={{ position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: 0.16 }}>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={still ? 3 : Math.floor(frame / 2) % 24} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      )}
    </AbsoluteFill>
  );
};
