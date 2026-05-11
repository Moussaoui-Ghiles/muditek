import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
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
  stats: { preview?: string | null; tldr?: string | null } | null;
}

export default async function PortalNewsletterPage() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect("/sign-in?redirect_url=/portal/newsletter");

  const user = await currentUser();
  if (!user) redirect("/sign-in?redirect_url=/portal/newsletter");

  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) redirect("/sign-in?redirect_url=/portal/newsletter");

  const sql = getDb();
  const rows = (await sql`
    SELECT slug, subject, sent_at, stats
    FROM newsletter_issues
    WHERE status = 'sent' AND slug IS NOT NULL
    ORDER BY sent_at DESC NULLS LAST
  `) as IssueRow[];

  const issues = rows.map((r) => ({
    slug: r.slug,
    subject: r.subject,
    sent_at: r.sent_at ? new Date(r.sent_at).toISOString() : null,
    preview: r.stats?.preview?.trim() || r.stats?.tldr?.trim() || null,
  }));

  return <NewsletterArchiveContent email={email} issues={issues} />;
}
