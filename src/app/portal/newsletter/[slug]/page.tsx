import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import { buildPortalAccess } from "@/lib/portal-access";
import NewsletterDetailContent from "./newsletter-detail-content";

export const dynamic = "force-dynamic";

interface IssueRow {
  id: string;
  subject: string;
  slug: string;
  html: string | null;
  sent_at: string | Date | null;
  updated_at: string | Date | null;
  stats: { preview?: string | null; tldr?: string | null } | null;
}

interface NeighborRow {
  slug: string;
  subject: string;
}

async function getIssue(slug: string) {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, subject, slug, html, sent_at, updated_at, stats
    FROM newsletter_issues
    WHERE slug = ${slug} AND status = 'sent'
    LIMIT 1
  `) as IssueRow[];
  return rows[0] ?? null;
}

async function getNeighbors(sentAt: Date | null) {
  if (!sentAt) return { prev: null, next: null };
  const sql = getDb();
  const iso = sentAt.toISOString();
  const [nextRows, prevRows] = await Promise.all([
    sql`
      SELECT slug, subject FROM newsletter_issues
      WHERE status = 'sent' AND slug IS NOT NULL AND sent_at > ${iso}
      ORDER BY sent_at ASC
      LIMIT 1
    `,
    sql`
      SELECT slug, subject FROM newsletter_issues
      WHERE status = 'sent' AND slug IS NOT NULL AND sent_at < ${iso}
      ORDER BY sent_at DESC
      LIMIT 1
    `,
  ]);
  return {
    next: (nextRows[0] as NeighborRow | undefined) ?? null,
    prev: (prevRows[0] as NeighborRow | undefined) ?? null,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getIssue(slug);
  if (!issue) return { title: "Issue not found · Muditek Portal" };
  return {
    title: `${issue.subject} · Newsletter · Muditek Portal`,
    description: issue.stats?.tldr || issue.stats?.preview || issue.subject,
  };
}

export default async function PortalNewsletterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug?.trim();
  if (!slug) redirect("/portal/newsletter");

  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    redirect(`/sign-in?redirect_url=/portal/newsletter/${encodeURIComponent(slug)}`);
  }
  const user = await currentUser();
  if (!user) {
    redirect(`/sign-in?redirect_url=/portal/newsletter/${encodeURIComponent(slug)}`);
  }
  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) {
    redirect(`/sign-in?redirect_url=/portal/newsletter/${encodeURIComponent(slug)}`);
  }

  const issue = await getIssue(slug);
  if (!issue) notFound();

  const sql = getDb();
  const subs = await sql`
    SELECT id, name, status FROM subscribers WHERE email = ${email}
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

  const displayName =
    user.firstName || (paidSub?.name as string | undefined) || email.split("@")[0];

  const sentAtDate = issue.sent_at ? new Date(issue.sent_at) : null;
  const updatedAtDate = issue.updated_at ? new Date(issue.updated_at) : null;
  const { prev, next } = await getNeighbors(sentAtDate);

  return (
    <NewsletterDetailContent
      email={email}
      issue={{
        subject: issue.subject,
        slug: issue.slug,
        html: issue.html ?? "",
        sentAtIso: sentAtDate ? sentAtDate.toISOString() : null,
        updatedAtIso: updatedAtDate ? updatedAtDate.toISOString() : null,
        tldr: issue.stats?.tldr ?? null,
        preview: issue.stats?.preview ?? null,
      }}
      prev={prev ? { slug: prev.slug, subject: prev.subject } : null}
      next={next ? { slug: next.slug, subject: next.subject } : null}
    />
  );
}
