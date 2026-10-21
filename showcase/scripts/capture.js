// Captures portfolio screenshots of the site with Playwright.
// Serves the site folder itself (static), so no external dev server is needed.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const SITE = path.resolve(__dirname, '../..');
const OUT = path.resolve(__dirname, '../screens');
const VIDEO_SRC = path.resolve(__dirname, '../video/public');
const PORT = 5180;

// Hero + the three strongest sections (chosen after reviewing every section).
const FEATURED = ['philosophy', 'admissions', 'academics'];
// Every section, used for the video's key-section holds.
const ALL = ['philosophy', 'about', 'admissions', 'academics', 'school-life', 'campus', 'contact'];

const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.svg': 'image/svg+xml',
};

function serve() {
  return http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    let file = path.join(SITE, p);
    if (!file.startsWith(SITE)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    const stat = fs.statSync(file);
    const type = TYPES[path.extname(file)] || 'application/octet-stream';
    const range = req.headers.range;
    if (range) {
      const [s, e] = range.replace('bytes=', '').split('-');
      const start = Number(s), end = e ? Number(e) : stat.size - 1;
      res.writeHead(206, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1, 'Content-Range': `bytes ${start}-${end}/${stat.size}` });
      return fs.createReadStream(file, { start, end }).pipe(res);
    }
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': stat.size, 'Accept-Ranges': 'bytes' });
    fs.createReadStream(file).pipe(res);
  }).listen(PORT);
}

const HIDE_SCROLLBARS = `
  html { scrollbar-width: none !important; scroll-behavior: auto !important; }
  ::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
`;

async function prepare(page) {
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: HIDE_SCROLLBARS });
  // Freeze the hero on its poster frame so every capture is identical.
  await page.evaluate(() => {
    const v = document.querySelector('[data-hero-video]');
    if (v) { v.pause(); v.style.display = 'none'; }
  });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const imgs = [...document.images];
    imgs.forEach((i) => { i.loading = 'eager'; });
    await Promise.all(imgs.map((i) => (i.complete ? i.decode().catch(() => {}) : new Promise((r) => { i.onload = i.onerror = r; }))));
  });
  // Walk every section into view so reveal animations finish, then return to the top.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = page.viewportSize().height;
  for (let y = 0; y < height; y += Math.round(vh * 0.6)) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(1200);
  await page.evaluate(async () => {
    const imgs = [...document.images];
    await Promise.all(imgs.map((i) => (i.complete ? Promise.resolve() : new Promise((r) => { i.onload = i.onerror = r; }))));
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-revealed'));
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
}

async function scrollToSection(page, id) {
  await page.evaluate((sid) => {
    const el = document.getElementById(sid);
    const header = document.querySelector('.site-header').offsetHeight;
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - header);
  }, id);
  await page.waitForTimeout(700);
}

async function run(browser, { name, width, height, scale, mobile }) {
  const ctx = await browser.newContext({
    viewport: { width, height }, deviceScaleFactor: scale, isMobile: mobile, hasTouch: mobile,
    reducedMotion: 'no-preference',
  });
  const page = await ctx.newPage();
  await prepare(page);
  await page.screenshot({ path: path.join(OUT, `${name}-hero.png`) });
  for (const id of FEATURED) {
    await scrollToSection(page, id);
    await page.screenshot({ path: path.join(OUT, `${name}-${id}.png`) });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  // Chromium drops content under backdrop-filter in full-page captures (blank ghost buttons).
  await page.addStyleTag({ content: '* { -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }' });
  await page.waitForTimeout(500);
  if (!mobile) await page.screenshot({ path: path.join(OUT, `${name}-fullpage.png`), fullPage: true });

  // Video source: full page without the sticky header + a pinned header strip + section offsets.
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(500);
  const headerH = await page.evaluate(() => document.querySelector('.site-header').offsetHeight);
  await page.screenshot({ path: path.join(VIDEO_SRC, `${name}-header.png`), clip: { x: 0, y: 0, width, height: headerH } });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const meta = await page.evaluate((ids) => {
    const header = document.querySelector('.site-header');
    const hh = header.offsetHeight;
    header.style.visibility = 'hidden';
    const offsets = {};
    ids.forEach((id) => { offsets[id] = document.getElementById(id).getBoundingClientRect().top + window.scrollY; });
    return { headerH: hh, pageH: document.documentElement.scrollHeight, offsets };
  }, ALL);
  await page.screenshot({ path: path.join(VIDEO_SRC, `${name}-page.png`), fullPage: true });
  fs.writeFileSync(path.join(VIDEO_SRC, `${name}-meta.json`), JSON.stringify({ width, scale, ...meta }, null, 2));
  await ctx.close();
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(VIDEO_SRC, { recursive: true });
  const server = serve();
  const browser = await chromium.launch();
  await run(browser, { name: 'desktop', width: 1440, height: 900, scale: 2, mobile: false });
  await run(browser, { name: 'mobile', width: 390, height: 844, scale: 3, mobile: true });
  await browser.close();
  server.close();
  console.log('done');
})();
