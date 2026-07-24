import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { ensureUniqueSlug, renderIssueHtml } from "@/lib/newsletter";
import { readBooleanFlag, setPortalNewsletterArticle } from "@/lib/newsletter-portal";
import { ensureNewsletterCampaignSchema } from "@/lib/newsletter-campaign";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  await ensureNewsletterCampaignSchema();
  const sql = getDb();
  const rows = await sql`
    SELECT id, subject, slug, preview_text, campaign_type, status, audience_filter,
           scheduled_at, sent_at, stats, created_at, updated_at
    FROM newsletter_issues
    ORDER BY created_at DESC
    LIMIT 100
  `;
  const events = await sql`
    SELECT
      issue_id,
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'sent')::int AS sent_events,
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'delivered')::int AS delivered,
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'opened')::int AS opened,
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'clicked')::int AS clicked,
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'bounced')::int AS bounced,
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'complained')::int AS complained
    FROM newsletter_events
    WHERE issue_id IS NOT NULL
    GROUP BY issue_id
  `;
  const eventByIssue = new Map(events.map((row) => [String(row.issue_id), row]));
  const campaigns = await sql`
    SELECT issue_id, status, total, sent, failed, suppressed, batches, last_error, updated_at
    FROM newsletter_campaign_runs
  `;
  const campaignByIssue = new Map(campaigns.map((row) => [String(row.issue_id), row]));
  return NextResponse.json({
    issues: rows.map((issue) => ({
      ...issue,
      event_stats: eventByIssue.get(String(issue.id)) ?? {
        sent_events: 0,
        delivered: 0,
        bounced: 0,
        complained: 0,
      },
      campaign: campaignByIssue.get(String(issue.id)) ?? null,
    })),
  });
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const body = await request.json();
  const rawSubject: string = String(body.subject ?? "").trim();
  const subject: string = rawSubject || "Untitled draft";

  // Accept HTML directly (Tiptap) or markdown for backwards compat
  const htmlInput: string | undefined = typeof body.html === "string" ? body.html : undefined;
  const markdown: string = String(body.markdown_src ?? "");
  const audienceFilter: string | null = body.audience_filter ?? null;
  const previewText = typeof body.preview_text === "string" ? body.preview_text.slice(0, 200) : "";
  const campaignType = body.campaign_type === "reactivation" ? "reactivation" : "editorial";
  const slug = await ensureUniqueSlug(subject);
  const html = htmlInput ?? renderIssueHtml(markdown);
  const portalArticle =
    readBooleanFlag(body.portal_article) ??
    readBooleanFlag(body.portalArticle) ??
    false;
  const stats = setPortalNewsletterArticle(null, portalArticle);

  const sql = getDb();
  const rows = await sql`
    INSERT INTO newsletter_issues
      (subject, slug, markdown_src, html, preview_text, campaign_type, audience_filter, stats)
    VALUES
      (${subject}, ${slug}, ${markdown}, ${html}, ${previewText}, ${campaignType}, ${audienceFilter}, ${JSON.stringify(stats)}::jsonb)
    RETURNING id, subject, slug, status, audience_filter, campaign_type, preview_text, stats
  `;
  return NextResponse.json(rows[0]);
}
