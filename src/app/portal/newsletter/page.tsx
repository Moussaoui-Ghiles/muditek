import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getOrCreatePreferenceHref } from "@/lib/newsletter-preferences";
import { buildPortalAccess } from "@/lib/portal-access";
import NewsletterArchiveContent from "./newsletter-archive-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Newsletter · Muditek Portal",
  description: "Past issues of the Muditek newsletter.",
};

interface IssueRow {
  slug: string;
  subject: string;
  sent_at: string | Date | null;
  stats: {
    preview?: string | null;
    tldr?: string | null;
    thumbnail_url?: string | null;
    image?: string | null;
    hero_image?: string | null;
  } | null;
}

function sanitizePreview(value: string | null | undefined): string | null {
  const preview = value?.trim();
  if (!preview) return null;
  return preview.replace(/\bFree\b/g, "Included");
}

export default async function PortalNewsletterPage() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect("/sign-in?redirect_url=/portal/newsletter");

  const user = await currentUser();
  if (!user) redirect("/sign-in?redirect_url=/portal/newsletter");

  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) redirect("/sign-in?redirect_url=/portal/newsletter");

  const sql = getDb();

  const subs = await sql`
    SELECT id, name, status, clerk_user_id FROM subscribers WHERE email = ${email}
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
    SELECT slug, subject, sent_at, stats
    FROM newsletter_issues
    WHERE status = 'sent'
      AND slug IS NOT NULL
      AND html IS NOT NULL
      AND length(trim(html)) > 0
    ORDER BY sent_at DESC NULLS LAST
  `) as IssueRow[];

  const issues = rows.map((r) => ({
    slug: r.slug,
    subject: r.subject,
    sent_at: r.sent_at ? new Date(r.sent_at).toISOString() : null,
    preview: sanitizePreview(r.stats?.preview) || sanitizePreview(r.stats?.tldr),
    thumbnailUrl:
      r.stats?.thumbnail_url?.trim() ||
      r.stats?.hero_image?.trim() ||
      r.stats?.image?.trim() ||
      null,
  }));

  const displayName =
    user.firstName || (paidSub?.name as string | undefined) || email.split("@")[0];
  const preferencesHref = await getOrCreatePreferenceHref({
    email,
    clerkUserId: user.id,
    sql,
  });

  return (
    <NewsletterArchiveContent
      email={email}
      displayName={displayName}
      access={access}
      issues={issues}
      preferencesHref={preferencesHref}
    />
  );
}
