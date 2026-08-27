import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createTar } from "@/lib/tar";
import { getLibraryItem } from "@/lib/library-manifest";
import { ensurePortalAccount } from "@/lib/portal-account";
import { getPortalSkill, getPortalSkillArchiveFiles } from "@/lib/portal-skills";
import { getDb } from "@/lib/db";
import { decideSkillDownloadAccess } from "@/lib/skill-download-access";
import { recordUsageEvent } from "@/lib/usage-analytics";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const item = getLibraryItem("skill", slug);
  const skill = getPortalSkill(slug);
  if (!item || !skill || item.status !== "published") {
    return NextResponse.json({ error: "Skill not found." }, { status: 404 });
  }

  const { isAuthenticated } = await auth();
  let user = null as Awaited<ReturnType<typeof currentUser>>;
  let email: string | undefined;
  let hasActiveMembership = false;
  const sql = getDb();

  if (isAuthenticated) {
    user = await currentUser();
    email = user?.emailAddresses[0]?.emailAddress?.toLowerCase();
    if (user && email) {
      await ensurePortalAccount({ sql, email, clerkUserId: user.id });
      const memberships = await sql`
        SELECT role FROM portal_memberships
        WHERE email = ${email} AND status = 'active' AND role IN ('free', 'admin')
        LIMIT 1
      `;
      hasActiveMembership = memberships.length > 0;
    }
  }

  const decision = decideSkillDownloadAccess(item.access, isAuthenticated, hasActiveMembership);
  if (!decision.allowed) {
    return NextResponse.json({ error: decision.error }, { status: decision.status });
  }

  const files = getPortalSkillArchiveFiles(slug);
  if (files.length === 0) {
    return NextResponse.json({ error: "Skill not found." }, { status: 404 });
  }

  const body = createTar(files);

  if (user && email) {
    recordUsageEvent(sql, {
      email,
      clerkUserId: user.id,
      event: "skill_downloaded",
      path: `/api/portal/skills/${slug}/download`,
      resourceSlug: slug,
      metadata: { title: skill.name, lane: item.lane },
    }).catch(() => {});
  }

  return new NextResponse(new Uint8Array(body), {
    headers: {
      "Content-Type": "application/x-tar",
      "Content-Disposition": `attachment; filename="${slug}.tar"`,
      "Cache-Control": item.access === "public" ? "public, max-age=300" : "private, max-age=60",
    },
  });
}
