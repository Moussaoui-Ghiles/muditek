import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { ensureContentItemsSchema } from "@/lib/content-items-schema";
import { withDerivedThumbnails } from "@/lib/content-thumbnails";
import { buildPortalAccess } from "@/lib/portal-access";
import type { ContentItem } from "@/lib/content-item";
import PlaybooksContent from "./playbooks-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Playbooks & Guides · Muditek Portal",
  description:
    "Long-form playbooks, guides, frameworks, and implementation docs attached to your Muditek portal account.",
};

export default async function PortalPlaybooksPage() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect("/sign-in?redirect_url=/portal/playbooks");
  const user = await currentUser();
  if (!user) redirect("/sign-in?redirect_url=/portal/playbooks");
  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) redirect("/sign-in?redirect_url=/portal/playbooks");

  const sql = getDb();
  await ensureContentItemsSchema(sql);

  const subs = await sql`
    SELECT id, status, stripe_customer_id
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
    WHERE category IN ('playbook', 'guide')
    ORDER BY is_new DESC NULLS LAST, created_at DESC
  `) as ContentItem[];

  const items = withDerivedThumbnails(rows);

  return <PlaybooksContent items={items} access={access} email={email} />;
}
