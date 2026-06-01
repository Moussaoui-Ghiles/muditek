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

// Slugs whose stylesheet scopes ALL vars/styles to `.playbook-scaler` (a class
// the portal injects at serve time but the raw file lacks). Rendered standalone
// they fall back to serif/no-color/full-width, producing a lopsided cover. For
// these we replicate the portal wrapper and compose the editorial hero into the
// 16:10 frame instead of clipping the raw full-width wrap.
const SCALER_HERO_SLUGS = new Set(["clawchief-blueprint"]);

const HERO_COMPOSE_CSS = `
  html,body{margin:0!important;padding:0!important;background:#0a0a0a!important;overflow:hidden!important}
  .playbook-scaler{background:#0a0a0a!important;padding:0!important}
  .hero{padding:0!important;border:none!important;height:1000px!important;display:flex!important;align-items:center!important}
  .hero .wrap{max-width:none!important;width:100%!important;padding:0 112px!important;margin:0!important}
  .hero-eyebrow{font-size:23px!important;margin-bottom:44px!important;letter-spacing:0.2em!important}
  .hero h1{max-width:24ch!important;font-size:100px!important;line-height:0.95!important;margin:0 0 48px 0!important}
  .hero-sub{font-size:34px!important;max-width:30ch!important;line-height:1.35!important;margin:0!important;
    display:-webkit-box!important;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .hero-meta{display:none!important}
`;

// Slugs whose cover lives in a `.cover` block sibling to a sticky `.brandbar`
// and a long body. Standalone clipping of `.page` includes the brandbar and
// truncates the subtitle mid-sentence. For these we render at a 1600x1000
// viewport, isolate `.cover`, and compose its three lines to fill the frame.
const COVER_COMPOSE_CSS_BY_SLUG = {
  "slack-outbound-agent-playbook": `
    html,body{margin:0!important;padding:0!important;overflow:hidden!important;height:1000px!important;background:var(--paper,#f6efe6)!important}
    body::before,body::after{display:none!important}
    .brandbar,.hook,section,.cta,.callout,.footer,.codeblock,figure,.recipe-anchor,.factors,.disclaim,nav,header.brandbar{display:none!important}
    main.page{max-width:none!important;width:100%!important;height:1000px!important;margin:0!important;padding:96px 112px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;box-sizing:border-box!important}
    header.cover{margin:0!important;padding:0!important;border:none!important}
    .eyebrow{font-size:22px!important;margin-bottom:36px!important;letter-spacing:0.2em!important}
    header.cover h1{max-width:18ch!important;font-size:108px!important;line-height:0.94!important;margin:0 0 40px 0!important;letter-spacing:-0.025em!important}
    header.cover .subtitle,header.cover p.subtitle{font-size:32px!important;max-width:48ch!important;line-height:1.32!important;margin:0!important;
      display:-webkit-box!important;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis}
  `,
  "geo-playbook": `
    html,body{margin:0!important;padding:0!important;overflow:hidden!important;height:1000px!important;background:#fbfaf7!important}
    body::before,body::after{display:none!important}
    body > *:not(.hero){display:none!important}
    body{display:flex!important;flex-direction:column!important;justify-content:center!important;padding:0 112px!important;box-sizing:border-box!important;height:1000px!important}
    header.hero{margin:0!important;padding:0!important;border:none!important;width:100%!important;max-width:none!important}
    header.hero hr,header.hero .logos,header.hero p:not(:first-of-type){display:none!important}
    header.hero h1{max-width:22ch!important;font-size:96px!important;line-height:0.96!important;margin:0 0 44px 0!important;letter-spacing:-0.025em!important;color:#0f2e5a!important}
    header.hero p:first-of-type{font-size:30px!important;max-width:48ch!important;line-height:1.32!important;margin:0!important;color:#243854!important;
      display:-webkit-box!important;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis}
    header.hero p:first-of-type strong{font-weight:600!important}
  `,
  "cold-email-claude-code-blueprint": `
    html,body{margin:0!important;padding:0!important;overflow:hidden!important;height:1000px!important;background:var(--paper,#f6f1e8)!important}
    body::before,body::after{display:none!important}
    main.wrap > *:not(.mast):not(.cover){display:none!important}
    main.wrap{max-width:none!important;width:100%!important;height:1000px!important;margin:0!important;padding:96px 112px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;box-sizing:border-box!important}
    .mast{display:flex!important;align-items:center!important;gap:14px!important;margin:0 0 40px 0!important;padding:0!important;border:none!important}
    .mast svg{width:42px!important;height:42px!important}
    .mast .m{font-size:22px!important;font-weight:700!important;letter-spacing:-0.01em!important}
    .mast .tag{margin-left:auto!important;font-size:18px!important;font-weight:700!important;letter-spacing:0.18em!important;text-transform:uppercase!important}
    header.cover{margin:0!important;padding:0!important;border:none!important}
    header.cover h1{max-width:22ch!important;font-size:74px!important;line-height:0.98!important;margin:0 0 40px 0!important;letter-spacing:-0.025em!important;
      display:-webkit-box!important;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
    header.cover .sub,header.cover p.sub{font-size:30px!important;max-width:50ch!important;line-height:1.32!important;margin:0!important;
      display:-webkit-box!important;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis}
  `,
};
const COVER_COMPOSE_SLUGS = new Set(Object.keys(COVER_COMPOSE_CSS_BY_SLUG));

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
    // Scaler-hero slugs render at a fixed 16:10 viewport, wrapped + composed.
    if (SCALER_HERO_SLUGS.has(slug)) {
      await page.setViewportSize({ width: 1600, height: 1000 });
      await page.goto(`file://${join(HTML_DIR, file)}`, { waitUntil: "networkidle", timeout: 30000 });
      await page.evaluate(() => {
        if (!document.querySelector(".playbook-scaler")) {
          const w = document.createElement("div");
          w.className = "playbook-scaler";
          while (document.body.firstChild) w.appendChild(document.body.firstChild);
          document.body.appendChild(w);
        }
      });
      await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));
      await page.addStyleTag({ content: HERO_COMPOSE_CSS });
      await page.waitForTimeout(400);
      const outPath = join(OUT_DIR, slug, "cover.png");
      await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1600, height: 1000 } });
      console.log(`OK   ${slug}  via composed-hero  1600x1000`);
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.close();
      continue;
    }

    // Cover-compose slugs: isolate `.cover` block, hide brandbar+body, render
    // at fixed 16:10 viewport so the frame fills with eyebrow+h1+subtitle.
    if (COVER_COMPOSE_SLUGS.has(slug)) {
      await page.setViewportSize({ width: 1600, height: 1000 });
      await page.goto(`file://${join(HTML_DIR, file)}`, { waitUntil: "networkidle", timeout: 30000 });
      await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));
      await page.addStyleTag({ content: COVER_COMPOSE_CSS_BY_SLUG[slug] });
      await page.waitForTimeout(400);
      const outPath = join(OUT_DIR, slug, "cover.png");
      await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1600, height: 1000 } });
      console.log(`OK   ${slug}  via cover-compose  1600x1000`);
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.close();
      continue;
    }

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
