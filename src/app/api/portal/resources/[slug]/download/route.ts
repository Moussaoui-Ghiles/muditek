import { readFile } from "fs/promises";
import { basename, join, normalize } from "path";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  buildAssetAccess,
  loadAssetBySlugAndCategories,
} from "@/lib/portal-asset-loader";
import { PLAYBOOK_RESOURCE_CATEGORIES } from "@/lib/content-item";
import { getDb } from "@/lib/db";
import { recordUsageEvent } from "@/lib/usage-analytics";

export const dynamic = "force-dynamic";

function localPlaybookPath(downloadUrl: string): string | null {
  let pathname = downloadUrl.trim();

  if (/^https?:\/\//i.test(pathname)) {
    try {
      const url = new URL(pathname);
      if (!["muditek.com", "www.muditek.com"].includes(url.hostname)) return null;
      pathname = url.pathname;
    } catch {
      return null;
    }
  }

  if (!pathname.startsWith("/playbooks/")) return null;

  const relativePath = pathname.replace(/^\/+/, "");
  const normalized = normalize(relativePath);
  if (!normalized.startsWith("playbooks/") || normalized.includes("..")) return null;

  return join(process.cwd(), "content/downloads", normalized);
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
  const item = await loadAssetBySlugAndCategories(slug, [...PLAYBOOK_RESOURCE_CATEGORIES]);
  if (!item) {
    return NextResponse.json({ error: "Resource not found." }, { status: 404 });
  }

  const access = await buildAssetAccess(email, user.id);
  if (!item.is_free && !access.isMudikit && !access.isAdmin) {
    return NextResponse.json({ error: "MudiKit required." }, { status: 403 });
  }

  recordUsageEvent(getDb(), {
    email,
    clerkUserId: user.id,
    event: "resource_downloaded",
    path: new URL(req.url).pathname,
    resourceSlug: item.slug,
    metadata: { file_type: item.file_type, title: item.title },
  }).catch(() => {});

  if (item.file_type?.toLowerCase() === "html") {
    const htmlPath = join(process.cwd(), "content/playbooks", `${basename(item.slug)}.html`);
    try {
      const file = await readFile(htmlPath);
      return new NextResponse(new Uint8Array(file), {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `attachment; filename="${basename(item.slug)}.html"`,
          "Cache-Control": "private, max-age=60",
        },
      });
    } catch {
      return NextResponse.json({ error: "Resource file not found." }, { status: 404 });
    }
  }

  const localPath = localPlaybookPath(item.download_url);
  if (!localPath) {
    return NextResponse.redirect(new URL(item.download_url, req.url));
  }

  try {
    const file = await readFile(localPath);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${basename(localPath)}"`,
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch {
    return NextResponse.json({ error: "Resource file not found." }, { status: 404 });
  }
}
