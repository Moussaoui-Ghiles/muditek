#!/usr/bin/env node

import { chromium, request } from "playwright";

const baseUrl = (process.argv[2] || "http://127.0.0.1:3017").replace(/\/$/, "");
const canonicalBookingUrl = "https://calendly.com/biz-ghiless/30min";
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 1000 },
];
const extraRoutes = ["/portal", "/sign-in", "/sign-up"];

function localPath(href) {
  try {
    const url = new URL(href, baseUrl);
    if (url.origin !== new URL(baseUrl).origin) return null;
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

async function sitemapRoutes(request) {
  const response = await request.get(`${baseUrl}/sitemap.xml`);
  if (!response.ok()) throw new Error(`Sitemap returned ${response.status()}.`);
  const xml = await response.text();
  const routes = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => {
    const url = new URL(match[1]);
    return `${url.pathname}${url.search}`;
  });
  return [...new Set(["/", ...routes, ...extraRoutes])];
}

const browser = await chromium.launch({ headless: true });
const requestContext = await request.newContext();
const routes = await sitemapRoutes(requestContext);
const internalLinks = new Set();
const report = {
  baseUrl,
  routeCount: routes.length,
  viewports: {},
  internalLinks: {},
};

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: viewport.name === "tablet" ? "reduce" : "no-preference",
  });
  const page = await context.newPage();
  const failures = [];

  for (const route of routes) {
    const pageErrors = [];
    const consoleErrors = [];
    const onPageError = (error) => pageErrors.push(error.message);
    const onConsole = (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    };
    page.on("pageerror", onPageError);
    page.on("console", onConsole);

    let response;
    try {
      response = await page.goto(`${baseUrl}${route}`, {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });
      await page.waitForTimeout(250);
    } catch (error) {
      failures.push({ route, type: "navigation", detail: error.message });
      page.off("pageerror", onPageError);
      page.off("console", onConsole);
      continue;
    }

    const status = response?.status() ?? 0;
    if (status >= 400 || status === 0) failures.push({ route, type: "status", detail: status });

    const state = await page.evaluate(({ bookingUrl }) => {
      const root = document.documentElement;
      const overflow = Math.max(0, root.scrollWidth - root.clientWidth);
      const brokenImages = [...document.images]
        .filter((image) => image.currentSrc && image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc);
      const links = [...document.querySelectorAll("a[href]")].map((link) => ({
        href: link.href,
        text: (link.textContent || "").replace(/\s+/g, " ").trim(),
      }));
      const bookingLinks = links.filter((link) => link.text.length <= 80 && /^(?:book\b|schedule\b|contact$)/i.test(link.text));
      const wrongBookingLinks = bookingLinks.filter((link) => {
        if (link.href === bookingUrl) return false;
        if (/^mailto:/i.test(link.href)) return false;
        return true;
      });
      return { overflow, brokenImages, links, bookingLinks, wrongBookingLinks };
    }, { bookingUrl: canonicalBookingUrl });

    for (const link of state.links) {
      const path = localPath(link.href);
      if (path) internalLinks.add(path);
    }
    if (state.overflow > 2) failures.push({ route, type: "overflow", detail: state.overflow });
    if (state.brokenImages.length > 0) failures.push({ route, type: "images", detail: state.brokenImages });
    if (state.wrongBookingLinks.length > 0) failures.push({ route, type: "booking", detail: state.wrongBookingLinks });
    if (pageErrors.length > 0) failures.push({ route, type: "page-error", detail: pageErrors });
    const actionableConsoleErrors = consoleErrors.filter((message) =>
      !/favicon|hydration warning|Failed to load resource|normal-hare-83\.clerk\.accounts\.dev/i.test(message),
    );
    if (actionableConsoleErrors.length > 0) failures.push({ route, type: "console-error", detail: actionableConsoleErrors });

    page.off("pageerror", onPageError);
    page.off("console", onConsole);
  }

  report.viewports[viewport.name] = {
    width: viewport.width,
    height: viewport.height,
    failures,
  };
  await context.close();
}

for (const path of [...internalLinks].sort()) {
  const response = await requestContext.get(`${baseUrl}${path}`, { maxRedirects: 10 });
  if (response.status() >= 400) report.internalLinks[path] = response.status();
}

report.internalLinkCount = internalLinks.size;
report.totalFailures = Object.values(report.viewports)
  .reduce((total, viewport) => total + viewport.failures.length, 0)
  + Object.keys(report.internalLinks).length;

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
await requestContext.dispose();
await browser.close();
process.exitCode = report.totalFailures === 0 ? 0 : 1;
