import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { extractNewsletterThumbnailFromHtml } from "@/lib/newsletter-portal";
import { getOrCreatePreferenceHref } from "@/lib/newsletter-preferences";
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
  html: string | null;
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
  return preview.replace(/\bFree\b/g, "Open");
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
    SELECT slug, subject, sent_at, html, stats
    FROM newsletter_issues
    WHERE status = 'sent'
      AND slug IS NOT NULL
      AND html IS NOT NULL
      AND length(trim(html)) > 0
      AND (
        stats->>'portal_article' = 'true'
        OR stats->>'portalArticle' = 'true'
        OR (
          stats->>'source' = 'beehiiv'
          AND COALESCE(stats->>'portal_article', stats->>'portalArticle', 'true') <> 'false'
        )
      )
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
      extractNewsletterThumbnailFromHtml(r.html) ||
      null,
  }));

  const preferencesHref = await getOrCreatePreferenceHref({
    email,
    clerkUserId: user.id,
    sql,
  });

  return (
    <NewsletterArchiveContent
      email={email}
      issues={issues}
      preferencesHref={preferencesHref}
    />
  );
}
