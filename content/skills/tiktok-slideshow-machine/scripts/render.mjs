import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = `file://${join(__dirname, 'slides.html')}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(file, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const ids = ['slide-1', 'slide-2'];
for (let i = 0; i < ids.length; i++) {
  const el = await page.$(`#${ids[i]}`);
  if (!el) continue;
  const out = join(__dirname, `slide-${String(i + 1).padStart(2, '0')}.png`);
  await el.screenshot({ path: out, type: 'png' });
  console.log('rendered', out);
}
await browser.close();
