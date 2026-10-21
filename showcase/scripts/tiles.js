// Slices the full-page captures into tiles the video can stack without hitting
// browser image-size limits. Tiles overlap by a few source rows to hide seams.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUB = path.resolve(__dirname, '../video/public');
const OVERLAP = 4;

async function slice(name, tileH) {
  const src = path.join(PUB, `${name}-page.png`);
  const { width, height } = await sharp(src).metadata();
  const dir = path.join(PUB, 'tiles');
  fs.mkdirSync(dir, { recursive: true });
  const tiles = [];
  for (let i = 0, top = 0; top < height; i++, top += tileH) {
    const h = Math.min(tileH + OVERLAP, height - top);
    const file = `tiles/${name}-${String(i).padStart(2, '0')}.png`;
    await sharp(src, { limitInputPixels: false }).extract({ left: 0, top, width, height: h }).png().toFile(path.join(PUB, file));
    tiles.push({ file, top, height: h });
  }
  const metaFile = path.join(PUB, `${name}-meta.json`);
  const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
  fs.writeFileSync(metaFile, JSON.stringify({ ...meta, imageWidth: width, imageHeight: height, tiles }, null, 2));
  console.log(name, tiles.length, 'tiles');
}

(async () => {
  await slice('desktop', 2048);
  await slice('mobile', 1536);
})();
