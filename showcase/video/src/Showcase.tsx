import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from './Background';
import { BRAND, URL_TEXT } from './brand';
import desktopMeta from '../public/desktop-meta.json';
import mobileMeta from '../public/mobile-meta.json';

type Meta = typeof desktopMeta;
type Mode = 'full' | 'teaser';

const SECTIONS = ['philosophy', 'about', 'admissions', 'academics', 'school-life', 'campus', 'contact'] as const;
const SCALE_FROM = 0.92;
const HOLD = 1.2;

const inOut = Easing.inOut(Easing.cubic);

// Scroll position (CSS px) and window scale for a given time, in seconds.
function timeline(t: number, total: number, meta: Meta, viewportCss: number, mode: Mode) {
  const scaleIn = interpolate(t, [0, 1], [SCALE_FROM, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scaleOut = interpolate(t, [total - 0.6, total], [1, SCALE_FROM], { easing: Easing.in(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  if (mode === 'teaser') {
    const push = interpolate(t, [1, total - 0.6], [1, 1.025], { easing: inOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return { scroll: 0, scale: scaleIn * scaleOut * push };
  }

  const maxScroll = meta.pageH - viewportCss;
  const offsets = meta.offsets as Record<string, number>;
  const stops = [...SECTIONS.map((id) => Math.min(offsets[id] - meta.headerH, maxScroll)), maxScroll];

  const introHold = 1.6;
  const returnDur = 1.2;
  const endHold = 0.8;
  const travel = (total - introHold - returnDur - endHold - stops.length * HOLD) / stops.length;

  let scroll = 0;
  let cursor = introHold;
  let prev = 0;
  for (const stop of stops) {
    if (t >= cursor) scroll = interpolate(t, [cursor, cursor + travel], [prev, stop], { easing: inOut, extrapolateRight: 'clamp' });
    cursor += travel + HOLD;
    prev = stop;
  }
  if (t >= cursor) scroll = interpolate(t, [cursor, cursor + returnDur], [prev, 0], { easing: inOut, extrapolateRight: 'clamp' });

  return { scroll, scale: scaleIn * scaleOut };
}

const TopBar: React.FC<{ height: number; width: number }> = ({ height, width }) => {
  const dot = Math.round(height * 0.27);
  const pillH = Math.round(height * 0.6);
  return (
    <div style={{ height, display: 'flex', alignItems: 'center', position: 'relative', background: '#FFFFFF', borderBottom: '1px solid #EEE9E2' }}>
      <div style={{ display: 'flex', gap: dot * 0.7, paddingLeft: height * 0.42 }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <div key={c} style={{ width: dot, height: dot, borderRadius: '50%', background: c }} />
        ))}
      </div>
      <div
        style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          height: pillH, width: Math.min(width * 0.42, 460), borderRadius: pillH / 2, background: '#F3F0EC',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: pillH * 0.3,
          fontFamily: '-apple-system, "SF Pro Text", "Helvetica Neue", sans-serif', fontSize: pillH * 0.52,
          color: '#5E544B', letterSpacing: '0.01em',
        }}
      >
        <svg width={pillH * 0.42} height={pillH * 0.5} viewBox="0 0 10 12" fill="none">
          <rect x="1" y="5" width="8" height="6.4" rx="1.4" fill="#8A7F75" />
          <path d="M3 5V3.6a2 2 0 0 1 4 0V5" stroke="#8A7F75" strokeWidth="1.3" />
        </svg>
        {URL_TEXT}
      </div>
    </div>
  );
};

export const Showcase: React.FC<{ mode: Mode }> = ({ mode }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const portrait = height > width;
  const meta: Meta = portrait ? mobileMeta : desktopMeta;
  const name = portrait ? 'mobile' : 'desktop';

  // Window geometry: desktop site at 1:1 CSS px; mobile site at 2x so text stays legible.
  const cssScale = portrait ? 2 : 1;
  const contentW = meta.width * cssScale;
  const contentH = portrait ? 1688 : 900;
  const barH = portrait ? 56 : 46;
  const viewportCss = contentH / cssScale;
  const imgScale = contentW / meta.imageWidth;

  const t = frame / fps;
  const total = durationInFrames / fps;
  const { scroll, scale } = timeline(t, total, meta, viewportCss, mode);
  const loop = (frame / durationInFrames) * Math.PI * 2;
  const driftY = 6 * Math.sin(loop * 2);
  const driftX = 3 * Math.sin(loop + 0.8);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.orange }}>
      <Background />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: contentW, height: contentH + barH, borderRadius: 14, overflow: 'hidden', background: '#FFFFFF',
            transform: `translate(${driftX}px, ${driftY}px) scale(${scale})`,
            boxShadow: [
              '0 1px 2px rgba(60,25,0,0.10)',
              '0 6px 14px rgba(60,25,0,0.12)',
              '0 22px 44px rgba(60,25,0,0.16)',
              '0 50px 100px rgba(40,18,0,0.22)',
              '0 90px 180px rgba(30,14,0,0.20)',
            ].join(', '),
          }}
        >
          <TopBar height={barH} width={contentW} />
          <div style={{ position: 'relative', width: contentW, height: contentH, overflow: 'hidden', background: BRAND.cream }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: contentW, transform: `translateY(${-scroll * cssScale}px)` }}>
              {meta.tiles.map((tile) => (
                <Img
                  key={tile.file}
                  src={staticFile(tile.file)}
                  style={{ position: 'absolute', left: 0, top: tile.top * imgScale, width: contentW, height: tile.height * imgScale }}
                />
              ))}
            </div>
            <Img src={staticFile(`${name}-header.png`)} style={{ position: 'absolute', left: 0, top: 0, width: contentW, height: meta.headerH * cssScale }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
