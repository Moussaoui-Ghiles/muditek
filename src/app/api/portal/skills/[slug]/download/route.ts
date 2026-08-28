import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createTar } from "@/lib/tar";
import { buildAssetAccess } from "@/lib/portal-asset-loader";
import { getPortalSkill, getPortalSkillArchiveFiles } from "@/lib/portal-skills";
import { getDb } from "@/lib/db";
import { recordUsageEvent } from "@/lib/usage-analytics";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const skill = getPortalSkill(slug);
  if (!skill) {
    return NextResponse.json({ error: "Skill not found." }, { status: 404 });
  }

  const { isAuthenticated } = await auth();
  const user = isAuthenticated ? await currentUser() : null;
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase() ?? null;

  if (!skill.is_free) {
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

  const body = createTar(files);
  return new NextResponse(new Uint8Array(body), {
    headers: {
      "Content-Type": "application/x-tar",
      "Content-Disposition": `attachment; filename="${slug}.tar"`,
      "Cache-Control": skill.is_free ? "public, max-age=300" : "private, max-age=60",
    },
  });
}
