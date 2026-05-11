import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { ensureContentItemsSchema } from "@/lib/content-items-schema";
import { withDerivedThumbnails } from "@/lib/content-thumbnails";
import { buildPortalAccess } from "@/lib/portal-access";
import type { ContentItem } from "@/lib/content-item";
import SkillsContent from "./skills-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Skills · Muditek Portal",
  description: "Reusable AI/operator skills for Claude, Codex, and GTM work.",
};

export default async function SkillsPage() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect("/sign-in?redirect_url=/portal/skills");

  const user = await currentUser();
  if (!user) redirect("/sign-in?redirect_url=/portal/skills");

  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) redirect("/sign-in?redirect_url=/portal/skills");

  const sql = getDb();
  await ensureContentItemsSchema(sql);

  const subs = await sql`
    SELECT id, status, stripe_customer_id, clerk_user_id
    FROM subscribers WHERE email = ${email}
  `;
  const paidSub = subs[0];
  const isPaid = !!paidSub && paidSub.status === "active";

  const membershipRows = await sql`
    SELECT role FROM portal_memberships
    WHERE email = ${email} AND status = 'active'
  `;

  const access = buildPortalAccess({
    email,
    membershipRoles: membershipRows.map((row) => String(row.role)),
    hasActiveSubscription: isPaid,
  });

  const rows = (await sql`
    SELECT id, title, slug, description, category, download_url, file_type, thumbnail_url, is_new, is_free, created_at, updated_at
    FROM content_items
    WHERE category = 'skill'
    ORDER BY is_free DESC, created_at DESC
  `) as ContentItem[];

  const skills = withDerivedThumbnails(rows);

  return <SkillsContent skills={skills} access={access} email={email} />;
}
