// Generate first-page cover thumbnails for HTML playbooks.
// Captures the first cover/page/hero element, clipped to 16:10 at the
// element's own width so there is never an external white margin.
import { createRequire } from "module";
import { readdirSync } from "fs";
import { join, basename } from "path";

const require = createRequire("/Users/ghilesmoussaoui/Desktop/mudiagent-muditel/package.json");
const { chromium } = require("playwright");

const ROOT = "/Users/ghilesmoussaoui/Desktop/BizOps/muditek/website/muditek-web";
const HTML_DIR = join(ROOT, "content/playbooks");
const OUT_DIR = join(ROOT, "public/playbooks");

// Selector priority: outer deck slide first, then cover block. For continuous
// docs, prefer the inner content column (.wrap/.container) over the full-width
// .hero so left-aligned heroes frame on their content instead of leaving a big
// empty gutter. Decks always match .page first and never reach these.
const COVER_SELECTORS = [
  ".page",
  ".page-wrapper > .cover",
  ".cover",
  ".wrap",
  ".container",
  ".hero",
  "main > section",
  "section",
  "main",
  "body",
];

const onlyArg = process.argv[2]; // optional: single slug

const files = readdirSync(HTML_DIR)
  .filter((f) => f.endsWith(".html"))
  .filter((f) => (onlyArg ? basename(f, ".html") === onlyArg : true));

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

for (const file of files) {
  const slug = basename(file, ".html");
  const page = await ctx.newPage();
  try {
    await page.goto(`file://${join(HTML_DIR, file)}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));
    await page.waitForTimeout(400);

    const box = await page.evaluate((selectors) => {
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 200 || r.height < 100) continue;
        return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height, sel };
      }
      return null;
    }, COVER_SELECTORS);

    if (!box) {
      console.log(`SKIP ${slug}: no cover element`);
      await page.close();
      continue;
    }

    // Clip to 16:10 from the element's top-left, at the element's own width.
    const targetH = Math.round((box.w * 10) / 16);
    const clipH = Math.min(targetH, Math.round(box.h));
    const clip = {
      x: Math.max(0, Math.round(box.x)),
      y: Math.max(0, Math.round(box.y)),
      width: Math.round(box.w),
      height: clipH,
    };

    const outPath = join(OUT_DIR, slug, "cover.png");
    await page.screenshot({ path: outPath, clip });
    console.log(`OK   ${slug}  via ${box.sel}  ${clip.width}x${clip.height}`);
  } catch (err) {
    console.log(`FAIL ${slug}: ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
