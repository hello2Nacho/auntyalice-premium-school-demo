// Renders the showcase videos, teasers and the mockup background still with Remotion.
// Usage: node scripts/render.js [compositionId ...]   (default: all)
//        node scripts/render.js --stills 0,300,600     (QA stills of the full videos)
const fs = require('fs');
const path = require('path');
const { bundle } = require('@remotion/bundler');
const { selectComposition, renderMedia, renderStill } = require('@remotion/renderer');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'output');
const MOCKUP_BG = path.resolve(ROOT, '../mockups/src/assets/brand-background.png');

const FILES = {
  'Showcase-16x9': 'auntyalice-showcase-16x9.mp4',
  'Showcase-9x16': 'auntyalice-showcase-9x16.mp4',
  'Teaser-16x9': 'auntyalice-hero-teaser-16x9.mp4',
  'Teaser-9x16': 'auntyalice-hero-teaser-9x16.mp4',
};

(async () => {
  const args = process.argv.slice(2);
  const serveUrl = await bundle({
    entryPoint: path.join(ROOT, 'video/src/index.ts'),
    publicDir: path.join(ROOT, 'video/public'),
  });
  fs.mkdirSync(OUT, { recursive: true });

  if (args[0] === '--stills') {
    const dir = path.join(ROOT, '.qa');
    fs.mkdirSync(dir, { recursive: true });
    for (const id of ['Showcase-16x9', 'Showcase-9x16']) {
      const composition = await selectComposition({ serveUrl, id });
      for (const frame of args[1].split(',').map(Number)) {
        await renderStill({ composition, serveUrl, frame, output: path.join(dir, `${id}-f${frame}.png`) });
      }
    }
    return;
  }

  const ids = args.length ? args : [...Object.keys(FILES), 'MockupBackground'];
  for (const id of ids) {
    const composition = await selectComposition({ serveUrl, id });
    if (id === 'MockupBackground') {
      fs.mkdirSync(path.dirname(MOCKUP_BG), { recursive: true });
      await renderStill({ composition, serveUrl, output: MOCKUP_BG });
      console.log('wrote', MOCKUP_BG);
      continue;
    }
    const output = path.join(OUT, FILES[id]);
    await renderMedia({
      composition, serveUrl, codec: 'h264', crf: 18, x264Preset: 'slow', pixelFormat: 'yuv420p',
      imageFormat: 'png', outputLocation: output, concurrency: 6,
      onProgress: ({ progress }) => process.stdout.write(`\r${id} ${(progress * 100).toFixed(0)}%   `),
    });
    console.log(`\nwrote ${output} (${(fs.statSync(output).size / 1e6).toFixed(1)} MB)`);
  }
})();
