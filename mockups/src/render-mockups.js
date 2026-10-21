// Renders the CSS device mockups to 3200x2000 PNG plus 1920px-wide WebP.
// Run from ./showcase (where Playwright and sharp are installed): npm run mockups
const path = require('path');
const { pathToFileURL } = require('url');
const SHOWCASE_MODULES = path.resolve(__dirname, '../../showcase/node_modules');
const { chromium } = require(path.join(SHOWCASE_MODULES, 'playwright'));
const sharp = require(path.join(SHOWCASE_MODULES, 'sharp'));

const OUT = path.resolve(__dirname, '../output');
const PAGE = pathToFileURL(path.join(__dirname, 'mockup.html')).href;

const JOBS = [
  { file: 'a-macbook-iphone-brand', scene: 'a', bg: 'brand' },
  { file: 'b-macbook-iphone-studio', scene: 'b', bg: 'studio' },
  { file: 'c-three-iphones-dark', scene: 'c', bg: 'dark' },
  { file: 'd-macbook-3d-iphone-brand', scene: 'd', bg: 'brand' },
  { file: 'e-macbook-iphone-transparent', scene: 'a', bg: 'none', transparent: true },
  { file: 'e-macbook-3d-iphone-transparent', scene: 'd', bg: 'none', transparent: true },
];

(async () => {
  const only = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 3200, height: 2000 }, deviceScaleFactor: 1 });
  for (const job of JOBS) {
    if (only.length && !only.includes(job.scene) && !only.includes(job.file)) continue;
    await page.goto(`${PAGE}?scene=${job.scene}&bg=${job.bg}`);
    await page.waitForSelector('body[data-ready="1"]');
    await page.waitForTimeout(300);
    const png = path.join(OUT, `${job.file}.png`);
    await page.screenshot({ path: png, omitBackground: !!job.transparent });
    await sharp(png).resize({ width: 1920 }).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(OUT, `${job.file}-1920.webp`));
    console.log('wrote', job.file);
  }
  await browser.close();
})();
