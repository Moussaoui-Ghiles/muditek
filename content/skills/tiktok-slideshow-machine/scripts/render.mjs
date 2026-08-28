import { access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const input = join(scriptDir, "slides.html");

await access(input);

const browser = await chromium.launch();

try {
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(pathToFileURL(input).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  const slides = page.locator("section.slide");
  const count = await slides.count();
  if (count === 0) throw new Error("No <section class=\"slide\"> elements found.");

  for (let index = 0; index < count; index += 1) {
    const output = join(scriptDir, `slide-${String(index + 1).padStart(2, "0")}.png`);
    await slides.nth(index).screenshot({ path: output, type: "png" });
    process.stdout.write(`rendered ${output}\n`);
  }
} finally {
  await browser.close();
}
