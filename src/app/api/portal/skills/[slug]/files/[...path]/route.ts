import { existsSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { buildAssetAccess } from "@/lib/portal-asset-loader";
import { getPortalSkill } from "@/lib/portal-skills";

export const dynamic = "force-dynamic";

const IMAGE_TYPES: Record<string, string> = {
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml; charset=utf-8",
  webp: "image/webp",
};

function extFromPath(path: string): string {
  const dot = path.lastIndexOf(".");
  return dot === -1 ? "" : path.slice(dot + 1).toLowerCase();
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string; path: string[] }> }
) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { slug, path } = await params;
  const skill = getPortalSkill(slug);
  if (!skill) {
    return NextResponse.json({ error: "Skill not found." }, { status: 404 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!user || !email) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  if (!skill.is_free) {
    const access = await buildAssetAccess(email, user.id);
    if (!access.isMudikit && !access.isAdmin) {
      return NextResponse.json({ error: "MudiKit required." }, { status: 403 });
    }
  }

  const requestedPath = path.join("/");
  const target = join(skill.dir, requestedPath);
  const rel = relative(skill.dir, target);
  if (!rel || rel.startsWith("..") || rel.includes("..\\") || rel.startsWith("/")) {
    return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
  }

  if (!existsSync(target) || !statSync(target).isFile()) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  const ext = extFromPath(target);
  const contentType = IMAGE_TYPES[ext];
  if (!contentType) {
    return NextResponse.json({ error: "Preview not available for this file type." }, { status: 415 });
  }

  return new NextResponse(new Uint8Array(readFileSync(target)), {
    headers: {
      "Cache-Control": "private, max-age=300",
      "Content-Disposition": `inline; filename="${path.at(-1) ?? "skill-file"}"`,
      "Content-Type": contentType,
    },
  });
}
