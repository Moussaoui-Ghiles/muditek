import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createTar } from "@/lib/tar";
import { buildAssetAccess } from "@/lib/portal-asset-loader";
import { getPortalSkill, getPortalSkillArchiveFiles } from "@/lib/portal-skills";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { slug } = await params;
  const skill = getPortalSkill(slug);
  if (!skill) {
    return NextResponse.json({ error: "Skill not found." }, { status: 404 });
  }

  if (!skill.isIncluded) {
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase();
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

  const body = createTar(files);
  return new NextResponse(new Uint8Array(body), {
    headers: {
      "Content-Type": "application/x-tar",
      "Content-Disposition": `attachment; filename="${slug}.tar"`,
      "Cache-Control": "private, max-age=60",
    },
  });
}
