import React from 'react';
import { Composition } from 'remotion';
import { Background } from './Background';
import { Showcase } from './Showcase';

const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Showcase-16x9" component={Showcase} defaultProps={{ mode: 'full' as const }} width={1920} height={1080} fps={FPS} durationInFrames={25 * FPS} />
    <Composition id="Showcase-9x16" component={Showcase} defaultProps={{ mode: 'full' as const }} width={1080} height={1920} fps={FPS} durationInFrames={25 * FPS} />
    <Composition id="Teaser-16x9" component={Showcase} defaultProps={{ mode: 'teaser' as const }} width={1920} height={1080} fps={FPS} durationInFrames={6 * FPS} />
    <Composition id="Teaser-9x16" component={Showcase} defaultProps={{ mode: 'teaser' as const }} width={1080} height={1920} fps={FPS} durationInFrames={6 * FPS} />
    {/* Still background shared with the device mockups (3200x2000). */}
    <Composition id="MockupBackground" component={() => <Background still />} width={3200} height={2000} fps={FPS} durationInFrames={1} />
  </>
);
