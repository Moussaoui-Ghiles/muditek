import { readFile } from "fs/promises";
import { join, normalize } from "path";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  buildAssetAccess,
  loadAssetBySlugAndCategories,
} from "@/lib/portal-asset-loader";
import { PLAYBOOK_RESOURCE_CATEGORIES } from "@/lib/content-item";

export const dynamic = "force-dynamic";

function localPagePath(slug: string, file: string): string | null {
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) return null;
  if (!/^page-\d+\.jpe?g$/i.test(file)) return null;

  const normalized = normalize(join(slug, file));
  if (normalized.includes("..") || normalized.startsWith("/")) return null;

  return join(process.cwd(), "content/downloads/playbooks", normalized);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string; file: string }> },
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

  const { slug, file } = await params;
  const item = await loadAssetBySlugAndCategories(slug, [...PLAYBOOK_RESOURCE_CATEGORIES]);
  if (!item) {
    return NextResponse.json({ error: "Resource not found." }, { status: 404 });
  }

  const access = await buildAssetAccess(email, user.id);
  if (!item.is_free && !access.isMudikit && !access.isAdmin) {
    return NextResponse.json({ error: "MudiKit required." }, { status: 403 });
  }

  const localPath = localPagePath(slug, file);
  if (!localPath) {
    return NextResponse.json({ error: "Page not found." }, { status: 404 });
  }

  try {
    const image = await readFile(localPath);
    return new NextResponse(new Uint8Array(image), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Page not found." }, { status: 404 });
  }
}
