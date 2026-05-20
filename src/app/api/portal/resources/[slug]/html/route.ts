import { readFile } from "fs/promises";
import { basename, join } from "path";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  buildAssetAccess,
  ensureHtmlBaseHref,
  loadAssetBySlugAndCategories,
} from "@/lib/portal-asset-loader";
import { PLAYBOOK_RESOURCE_CATEGORIES } from "@/lib/content-item";

export const dynamic = "force-dynamic";

type PlaybookHtmlShape = "fixed-pages" | "scaler" | "article";

function detectHtmlShape(html: string): PlaybookHtmlShape {
  const hasFixedPageCss = /width\s*:\s*210mm/i.test(html) || /height\s*:\s*297mm/i.test(html);
  const hasPageDom = /\bclass=["'][^"']*\bpage\b/i.test(html);
  if (hasFixedPageCss && hasPageDom) return "fixed-pages";
  if (/\.playbook-scaler\b/i.test(html)) return "scaler";
  return "article";
}

function rendererStyles(shape: PlaybookHtmlShape): string {
  const base = `
<style id="muditek-portal-html-renderer">
  html {
    margin: 0 !important;
    padding: 0 !important;
    background: #0a0a0a;
    overflow-x: hidden;
  }
  body {
    min-width: 0 !important;
    overflow-x: hidden !important;
  }
  body * {
    box-sizing: border-box;
  }
  img, svg, video, canvas {
    max-width: 100%;
    height: auto;
  }
  body.muditek-portal-article {
    margin: 0 !important;
    width: 100% !important;
    max-width: 100vw !important;
    background: #0a0a0a;
  }
  body.muditek-portal-article :where(.wrap, .wide, .container, .page-wrapper, main, article, section) {
    max-width: 100vw !important;
  }
  body.muditek-portal-article :where(pre, table, code) {
    max-width: 100%;
  }
  body.muditek-portal-article :where(pre, table) {
    overflow-x: auto;
  }
  @media (max-width: 640px) {
    body.muditek-portal-article :where(.toc ol) {
      columns: 1 !important;
    }
    body.muditek-portal-article :where(.g2, .g3, .cmp, .stats, .layers-grid, .toc-grid) {
      grid-template-columns: 1fr !important;
    }
    body.muditek-portal-article :where(.stats) {
      flex-direction: column !important;
    }
    body.muditek-portal-article :where(pre, code) {
      white-space: pre-wrap !important;
      overflow-wrap: anywhere;
    }
  }
  body.muditek-portal-fixed-pages {
    margin: 0 !important;
    padding: clamp(12px, 2vw, 28px) 0 56px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: clamp(14px, 2vw, 28px) !important;
    background: #0a0a0a !important;
  }
  .muditek-page-shell {
    position: relative;
    flex: none;
    max-width: calc(100vw - 24px);
    overflow: visible;
  }
  .muditek-page-shell > .page {
    margin: 0 !important;
    transform-origin: top left !important;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
  }
  @media (max-width: 640px) {
    body.muditek-portal-fixed-pages {
      padding-top: 10px !important;
      padding-bottom: 32px !important;
      gap: 12px !important;
    }
  }
</style>`;

  if (shape !== "scaler") return base;

  return `${base}
<style id="muditek-portal-scaler-fallback">
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #0a0a0a;
  }
  .playbook-scaler {
    min-height: 100vh;
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
  }
  .playbook-scaler :where(.wrap, .wide, .container, .page-wrapper, main, article, section) {
    max-width: 100vw !important;
  }
  .playbook-scaler :where(pre, table) {
    max-width: 100%;
    overflow-x: auto;
  }
  @media (max-width: 640px) {
    .playbook-scaler :where(.toc ol) {
      columns: 1 !important;
    }
    .playbook-scaler :where(.g2, .g3, .cmp, .stats, .layers-grid, .toc-grid) {
      grid-template-columns: 1fr !important;
    }
    .playbook-scaler :where(.stats) {
      flex-direction: column !important;
    }
    .playbook-scaler :where(pre, code) {
      white-space: pre-wrap !important;
      overflow-wrap: anywhere;
    }
  }
</style>`;
}

function rendererRuntime(shape: PlaybookHtmlShape, frameId: string): string {
  return `<script>
(() => {
  const id = ${JSON.stringify(frameId)};
  const shape = ${JSON.stringify(shape)};
  let last = 0;

  const scaleFixedPages = () => {
    if (shape !== "fixed-pages" || !document.body) return;
    document.body.classList.add("muditek-portal-fixed-pages");

    const pages = Array.from(document.querySelectorAll(".page"));
    for (const page of pages) {
      if (page.parentElement?.classList.contains("muditek-page-shell")) continue;
      const shell = document.createElement("div");
      shell.className = "muditek-page-shell";
      page.parentNode?.insertBefore(shell, page);
      shell.appendChild(page);
    }

    for (const shell of Array.from(document.querySelectorAll(".muditek-page-shell"))) {
      const page = shell.firstElementChild;
      if (!(page instanceof HTMLElement) || !(shell instanceof HTMLElement)) continue;

      page.style.transform = "";
      shell.style.width = "";
      shell.style.height = "";

      const rect = page.getBoundingClientRect();
      const naturalWidth = rect.width || page.offsetWidth || 794;
      const naturalHeight = rect.height || page.offsetHeight || 1123;
      const available = Math.max(280, window.innerWidth - 24);
      const scale = Math.min(1, available / naturalWidth);

      shell.style.width = (naturalWidth * scale) + "px";
      shell.style.height = (naturalHeight * scale) + "px";
      page.style.transform = "scale(" + scale + ")";
    }
  };

  const measure = () => {
    if (!document.body) return;
    if (shape === "fixed-pages") scaleFixedPages();
    if (shape !== "fixed-pages") {
      document.body.classList.add("muditek-portal-article");
    }

    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );
    if (Math.abs(height - last) > 4) {
      last = height;
      parent.postMessage({ type: "muditek:asset-height", id, height }, "*");
    }
  };
  if (window.ResizeObserver && document.body) {
    new ResizeObserver(measure).observe(document.body);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", measure, { once: true });
  } else {
    measure();
  }
  window.addEventListener("load", measure);
  window.addEventListener("resize", measure);
  setTimeout(measure, 80);
  setTimeout(measure, 500);
  setTimeout(measure, 1500);
})();
</script>`;
}

function injectIntoHead(html: string, value: string): string {
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${value}</head>`);
  }

  if (/<html\b[^>]*>/i.test(html)) {
    return html.replace(/<html\b([^>]*)>/i, `<html$1><head>${value}</head>`);
  }

  return `<!doctype html><html><head>${value}</head><body>${html}</body></html>`;
}

function injectIntoBodyEnd(html: string, value: string): string {
  if (!value) return html;

  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${value}</body>`);
  }

  if (/<\/html>/i.test(html)) {
    return html.replace(/<\/html>/i, `${value}</html>`);
  }

  return `${html}${value}`;
}

function ensureScalerWrapper(html: string, shape: PlaybookHtmlShape): string {
  if (shape !== "scaler" || /\bclass=["'][^"']*\bplaybook-scaler\b/i.test(html)) {
    return html;
  }

  if (/<body\b[^>]*>/i.test(html) && /<\/body>/i.test(html)) {
    return html
      .replace(/<body\b([^>]*)>/i, `<body$1><div class="playbook-scaler">`)
      .replace(/<\/body>/i, `</div></body>`);
  }

  return `<div class="playbook-scaler">${html}</div>`;
}

function normalizeStandalonePlaybook(html: string, frameId: string): string {
  const shape = detectHtmlShape(html);
  const withStyles = injectIntoHead(html, rendererStyles(shape));
  const normalized = ensureScalerWrapper(withStyles, shape);
  return injectIntoBodyEnd(normalized, rendererRuntime(shape, frameId));
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!user || !email) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { slug } = await params;
  const item = await loadAssetBySlugAndCategories(slug, [
    ...PLAYBOOK_RESOURCE_CATEGORIES,
    "skill",
  ]);
  if (!item) {
    return NextResponse.json({ error: "Resource not found." }, { status: 404 });
  }

  const access = await buildAssetAccess(email, user.id);
  if (!item.is_free && !access.isMudikit && !access.isAdmin) {
    return NextResponse.json({ error: "MudiKit required." }, { status: 403 });
  }

  const htmlPath = join(process.cwd(), "content/playbooks", `${basename(item.slug)}.html`);
  try {
    const rawHtml = await readFile(htmlPath, "utf-8");
    const frameId = new URL(req.url).searchParams.get("frame") ?? "";
    const html = normalizeStandalonePlaybook(
      ensureHtmlBaseHref(rawHtml, new URL(req.url).origin),
      frameId
    );

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, max-age=60",
        "X-Muditek-Html-Renderer": "v2",
      },
    });
  } catch {
    return NextResponse.json({ error: "Resource file not found." }, { status: 404 });
  }
}
