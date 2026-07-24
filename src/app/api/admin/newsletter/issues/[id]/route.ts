import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { renderIssueHtml } from "@/lib/newsletter";
import { readBooleanFlag, setPortalNewsletterArticle } from "@/lib/newsletter-portal";
import {
  ensureNewsletterCampaignSchema,
  getNewsletterCampaign,
  getNewsletterCampaignPreflight,
} from "@/lib/newsletter-campaign";
import { isNewsletterAudienceFilter } from "@/lib/newsletter-audience";

function sentCount(stats: unknown): number {
  if (!stats || typeof stats !== "object") return 0;
  const value = (stats as Record<string, unknown>).sent;
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  await ensureNewsletterCampaignSchema();
  const sql = getDb();
  const rows = await sql`
    SELECT id, subject, slug, markdown_src, html, preview_text, campaign_type,
           status, audience_filter, scheduled_at, sent_at, stats, created_at,
           updated_at, resend_broadcast_id, test_sent_at, test_sent_to
    FROM newsletter_issues WHERE id = ${id} LIMIT 1
  `;
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const events = await sql`
    SELECT
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'sent')::int AS sent_events,
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'delivered')::int AS delivered,
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'opened')::int AS opened,
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'clicked')::int AS clicked,
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'bounced')::int AS bounced,
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'complained')::int AS complained
    FROM newsletter_events
    WHERE issue_id = ${id}
  `;
  return NextResponse.json({
    ...rows[0],
    event_stats: events[0],
    campaign: await getNewsletterCampaign(id),
    preflight: await getNewsletterCampaignPreflight(id),
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  const body = await request.json();

  const subject: string | undefined = body.subject;
  const markdown: string | undefined = body.markdown_src;
  const htmlInput: string | undefined = typeof body.html === "string" ? body.html : undefined;
  const previewText: string | undefined =
    typeof body.preview_text === "string" ? body.preview_text.slice(0, 200) : undefined;
  const campaignType: string | undefined =
    typeof body.campaign_type === "string" ? body.campaign_type : undefined;
  const audienceProvided = Object.prototype.hasOwnProperty.call(body, "audience_filter");
  const audienceFilter: string | null | undefined = body.audience_filter;
  const portalArticleProvided =
    Object.prototype.hasOwnProperty.call(body, "portal_article") ||
    Object.prototype.hasOwnProperty.call(body, "portalArticle");
  const portalArticle = portalArticleProvided
    ? readBooleanFlag(
        Object.prototype.hasOwnProperty.call(body, "portal_article")
          ? body.portal_article
          : body.portalArticle,
      )
    : null;
  const bodyEditProvided =
    subject !== undefined ||
    markdown !== undefined ||
    htmlInput !== undefined ||
    previewText !== undefined ||
    campaignType !== undefined ||
    audienceProvided;

  if (campaignType !== undefined && !["reactivation", "editorial"].includes(campaignType)) {
    return NextResponse.json({ error: "Invalid campaign_type" }, { status: 400 });
  }
  if (
    audienceProvided &&
    audienceFilter !== null &&
    !isNewsletterAudienceFilter(audienceFilter)
  ) {
    return NextResponse.json({ error: "Invalid audience_filter" }, { status: 400 });
  }

  if (portalArticleProvided && portalArticle === null) {
    return NextResponse.json({ error: "portal_article must be true or false" }, { status: 400 });
  }

  const sql = getDb();
  const cur = await sql`SELECT status, stats FROM newsletter_issues WHERE id = ${id} LIMIT 1`;
  if (cur.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const alreadySent =
    cur[0].status !== "draft" ||
    sentCount(cur[0].stats) > 0;
  if (alreadySent && bodyEditProvided) {
    return NextResponse.json({ error: "Cannot edit an email after sending has started." }, { status: 409 });
  }

  if (portalArticleProvided && portalArticle !== null) {
    const nextStats = setPortalNewsletterArticle(cur[0].stats, portalArticle);
    await sql`
      UPDATE newsletter_issues
      SET stats = ${JSON.stringify(nextStats)}::jsonb, updated_at = NOW()
      WHERE id = ${id}
    `;
  }

  if (!bodyEditProvided) {
    const rows = await sql`
      SELECT id, subject, slug, status, audience_filter, stats
      FROM newsletter_issues
      WHERE id = ${id}
      LIMIT 1
    `;
    return NextResponse.json(rows[0]);
  }

  // Prefer Tiptap HTML, fall back to rendering markdown
  const html = htmlInput !== undefined
    ? htmlInput
    : markdown !== undefined
      ? renderIssueHtml(markdown)
      : undefined;

  const rows = audienceProvided
    ? await sql`
        UPDATE newsletter_issues
        SET
          subject = COALESCE(${subject ?? null}, subject),
          markdown_src = COALESCE(${markdown ?? null}, markdown_src),
          html = COALESCE(${html ?? null}, html),
          preview_text = COALESCE(${previewText ?? null}, preview_text),
          campaign_type = COALESCE(${campaignType ?? null}, campaign_type),
          audience_filter = ${audienceFilter ?? null},
          test_sent_at = NULL,
          test_sent_to = NULL,
          test_content_hash = NULL,
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, subject, slug, status, audience_filter, stats
      `
    : await sql`
        UPDATE newsletter_issues
        SET
          subject = COALESCE(${subject ?? null}, subject),
          markdown_src = COALESCE(${markdown ?? null}, markdown_src),
          html = COALESCE(${html ?? null}, html),
          preview_text = COALESCE(${previewText ?? null}, preview_text),
          campaign_type = COALESCE(${campaignType ?? null}, campaign_type),
          test_sent_at = NULL,
          test_sent_to = NULL,
          test_content_hash = NULL,
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, subject, slug, status, audience_filter, stats
      `;
  return NextResponse.json(rows[0]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  const sql = getDb();
  const cur = await sql`SELECT status, stats FROM newsletter_issues WHERE id = ${id} LIMIT 1`;
  if (cur.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (cur[0].status !== "draft" || sentCount(cur[0].stats) > 0) {
    return NextResponse.json({ error: "Cannot delete an email after sending has started." }, { status: 409 });
  }
  await sql`DELETE FROM newsletter_issues WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
