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

function frameRuntime(frameId: string): string {
  if (!frameId) return "";

  return `<script>
(() => {
  const id = ${JSON.stringify(frameId)};
  let last = 0;
  const measure = () => {
    if (!document.body) return;
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
  window.addEventListener("load", measure);
  window.addEventListener("resize", measure);
  setTimeout(measure, 80);
  setTimeout(measure, 500);
  setTimeout(measure, 1500);
})();
</script>`;
}

function injectRuntime(html: string, frameId: string): string {
  const runtime = frameRuntime(frameId);
  if (!runtime) return html;

  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${runtime}</body>`);
  }

  if (/<\/html>/i.test(html)) {
    return html.replace(/<\/html>/i, `${runtime}</html>`);
  }

  return `${html}${runtime}`;
}

function normalizeStandalonePlaybook(html: string): string {
  if (!/\.playbook-scaler\b/.test(html) || /\bclass=["'][^"']*\bplaybook-scaler\b/i.test(html)) {
    return html;
  }

  const withBodyReset = /<\/head>/i.test(html)
    ? html.replace(
        /<\/head>/i,
        `<style>html,body{margin:0;padding:0;background:#0a0a0a;}</style></head>`
      )
    : html;

  if (/<body\b[^>]*>/i.test(withBodyReset) && /<\/body>/i.test(withBodyReset)) {
    return withBodyReset
      .replace(/<body\b([^>]*)>/i, `<body$1><div class="playbook-scaler">`)
      .replace(/<\/body>/i, `</div></body>`);
  }

  return `<div class="playbook-scaler">${withBodyReset}</div>`;
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
    const html = injectRuntime(
      normalizeStandalonePlaybook(ensureHtmlBaseHref(rawHtml, new URL(req.url).origin)),
      frameId
    );

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch {
    return NextResponse.json({ error: "Resource file not found." }, { status: 404 });
  }
}
