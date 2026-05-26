import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { ensureUniqueSlug, renderIssueHtml } from "@/lib/newsletter";
import { readBooleanFlag, setPortalNewsletterArticle } from "@/lib/newsletter-portal";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();
  const rows = await sql`
    SELECT id, subject, slug, status, audience_filter, scheduled_at, sent_at, stats, created_at, updated_at
    FROM newsletter_issues
    ORDER BY created_at DESC
    LIMIT 100
  `;
  const events = await sql`
    SELECT
      issue_id,
      COUNT(*) FILTER (WHERE event = 'sent')::int AS sent_events,
      COUNT(*) FILTER (WHERE event = 'delivered')::int AS delivered,
      COUNT(*) FILTER (WHERE event = 'bounced')::int AS bounced,
      COUNT(*) FILTER (WHERE event = 'complained')::int AS complained
    FROM newsletter_events
    WHERE issue_id IS NOT NULL
    GROUP BY issue_id
  `;
  const eventByIssue = new Map(events.map((row) => [String(row.issue_id), row]));
  return NextResponse.json({
    issues: rows.map((issue) => ({
      ...issue,
      event_stats: eventByIssue.get(String(issue.id)) ?? {
        sent_events: 0,
        delivered: 0,
        bounced: 0,
        complained: 0,
      },
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
  const slug = await ensureUniqueSlug(subject);
  const html = htmlInput ?? renderIssueHtml(markdown);
  const portalArticle =
    readBooleanFlag(body.portal_article) ??
    readBooleanFlag(body.portalArticle) ??
    false;
  const stats = setPortalNewsletterArticle(null, portalArticle);

  const sql = getDb();
  const rows = await sql`
    INSERT INTO newsletter_issues (subject, slug, markdown_src, html, audience_filter, stats)
    VALUES (${subject}, ${slug}, ${markdown}, ${html}, ${audienceFilter}, ${JSON.stringify(stats)}::jsonb)
    RETURNING id, subject, slug, status, audience_filter, stats
  `;
  return NextResponse.json(rows[0]);
}
