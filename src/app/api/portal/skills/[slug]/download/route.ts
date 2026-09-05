import { auth, currentUser } from "@clerk/nextjs/server";
import { verifyAssetDownloadToken } from "@/lib/asset-email";
import { NextResponse } from "next/server";
import JSZip from "jszip";
import { buildAssetAccess } from "@/lib/portal-asset-loader";
import { getPortalSkill, getPortalSkillArchiveFiles } from "@/lib/portal-skills";
import { getDb } from "@/lib/db";
import { recordUsageEvent } from "@/lib/usage-analytics";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const url = new URL(req.url);
  const tokenEmail = (url.searchParams.get("e") ?? "").trim().toLowerCase();
  const token = url.searchParams.get("t") ?? "";
  const hasValidToken =
    tokenEmail.length > 0 && verifyAssetDownloadToken(slug, tokenEmail, token);
  const skill = getPortalSkill(slug);
  if (!skill) {
    return NextResponse.json({ error: "Skill not found." }, { status: 404 });
  }

  const { isAuthenticated } = await auth();
  const user = isAuthenticated ? await currentUser() : null;
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase() ?? null;

  if (!skill.is_free && !hasValidToken) {
    if (!user || !email) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    const access = await buildAssetAccess(email, user.id);
    if (!access.isMudikit && !access.isAdmin) {
      return NextResponse.json({ error: "MudiKit required." }, { status: 403 });
    }
  }

  const files = getPortalSkillArchiveFiles(slug);
  if (files.length === 0) {
    return NextResponse.json({ error: "Skill not found." }, { status: 404 });
  }

  if (user && email) {
    recordUsageEvent(getDb(), {
      email,
      clerkUserId: user.id,
      event: "skill_downloaded",
      path: `/api/portal/skills/${slug}/download`,
      resourceSlug: slug,
      metadata: { title: skill.name },
    }).catch(() => {});
  }

  const zip = new JSZip();
  const folder = zip.folder(slug);
  for (const file of files) folder?.file(file.path, file.data);
  const body = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  return new NextResponse(new Uint8Array(body), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${slug}.zip"`,
      "Cache-Control": skill.is_free ? "public, max-age=300" : "private, max-age=60",
    },
  });
}
