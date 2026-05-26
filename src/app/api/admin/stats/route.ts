import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { ensureContentItemsSchema } from "@/lib/content-items-schema";
import { ensureResourceLeadSchema } from "@/lib/resource-leads";
import { ensureUsageAnalyticsSchema } from "@/lib/usage-analytics";

export const dynamic = "force-dynamic";

type IssueStats = {
  sent?: number;
  failed?: number;
  remaining?: number;
  last_batch_sent?: number;
  last_batch_failed?: number;
  portal_article?: boolean;
  portalArticle?: boolean;
  source?: string;
};

function numberFrom(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function sendState(status: string, stats: IssueStats | null): "draft" | "sending" | "sent" | "imported_article" {
  if (stats?.source === "beehiiv_import") return "imported_article";
  const sent = numberFrom(stats?.sent);
  const remaining = numberFrom(stats?.remaining);
  if (status === "sent" || (sent > 0 && remaining === 0)) return "sent";
  if (sent > 0 || remaining > 0) return "sending";
  return "draft";
}

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();
  await ensureContentItemsSchema(sql);
  await ensureResourceLeadSchema(sql);
  await ensureUsageAnalyticsSchema(sql);

  const [
    [newsletter],
    [portal],
    [resources],
    recentResources,
    recentActivity,
    issueRows,
    issueEvents,
  ] = await Promise.all([
    sql`
      SELECT
        COUNT(*) FILTER (WHERE status = 'active')::int AS active,
        COUNT(*) FILTER (WHERE status = 'active' AND subscribed_at >= NOW() - INTERVAL '7 days')::int AS new_7d,
        COUNT(*) FILTER (WHERE status = 'active' AND segment = 'HOT')::int AS hot,
        COUNT(*) FILTER (WHERE status = 'active' AND segment = 'WARM')::int AS warm,
        COUNT(*) FILTER (WHERE status = 'active' AND segment = 'COLD')::int AS cold
      FROM newsletter_subscribers
    `,
    sql`
      SELECT
        COUNT(DISTINCT lower(email)) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int AS active_users_7d,
        COUNT(DISTINCT lower(email)) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS active_users_30d,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days' AND event IN ('resource_viewed', 'skill_viewed', 'newsletter_article_opened'))::int AS content_opens_7d,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days' AND event IN ('resource_downloaded', 'skill_downloaded'))::int AS downloads_7d,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days' AND event = 'tool_used')::int AS tool_runs_7d
      FROM portal_usage_events
      WHERE email IS NOT NULL
    `,
    sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE COALESCE(thumbnail_url, '') = '')::int AS missing_thumbnail,
        COUNT(*) FILTER (WHERE COALESCE(download_url, '') = '')::int AS missing_asset,
        COUNT(*) FILTER (WHERE file_type = 'html')::int AS html,
        COUNT(*) FILTER (WHERE file_type = 'pdf')::int AS pdf,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int AS added_7d
      FROM content_items
      WHERE category IN ('skill', 'playbook', 'guide', 'tool')
    `,
    sql`
      SELECT title, slug, category, file_type, thumbnail_url, created_at
      FROM content_items
      WHERE category IN ('skill', 'playbook', 'guide', 'tool')
      ORDER BY created_at DESC
      LIMIT 5
    `,
    sql`
      SELECT email, event, path, resource_slug, created_at
      FROM portal_usage_events
      ORDER BY created_at DESC
      LIMIT 8
    `,
    sql`
      SELECT id, subject, slug, status, audience_filter, sent_at, stats, updated_at, created_at
      FROM newsletter_issues
      ORDER BY
        CASE
          WHEN (COALESCE((stats->>'sent')::int, 0) > 0 AND COALESCE((stats->>'remaining')::int, 0) > 0) THEN 0
          WHEN status = 'draft' THEN 1
          ELSE 2
        END,
        updated_at DESC NULLS LAST,
        created_at DESC
      LIMIT 1
    `,
    sql`
      SELECT
        issue_id,
        COUNT(*) FILTER (WHERE event = 'sent')::int AS sent_events,
        COUNT(*) FILTER (WHERE event = 'delivered')::int AS delivered,
        COUNT(*) FILTER (WHERE event = 'bounced')::int AS bounced,
        COUNT(*) FILTER (WHERE event = 'complained')::int AS complained
      FROM newsletter_events
      WHERE issue_id IN (
        SELECT id FROM newsletter_issues
        ORDER BY updated_at DESC NULLS LAST, created_at DESC
        LIMIT 20
      )
      GROUP BY issue_id
    `,
  ]);

  const eventByIssue = new Map<string, any>();
  for (const row of issueEvents) eventByIssue.set(String(row.issue_id), row);
  const issue = issueRows[0];
  const stats = (issue?.stats ?? null) as IssueStats | null;
  const eventStats = issue ? eventByIssue.get(String(issue.id)) : null;

  return NextResponse.json({
    newsletter: {
      active: Number(newsletter?.active ?? 0),
      new_7d: Number(newsletter?.new_7d ?? 0),
      hot: Number(newsletter?.hot ?? 0),
      warm: Number(newsletter?.warm ?? 0),
      cold: Number(newsletter?.cold ?? 0),
      currentEmail: issue
        ? {
            id: issue.id,
            subject: issue.subject,
            slug: issue.slug,
            audience: issue.audience_filter ?? "All active",
            status: issue.status,
            sendState: sendState(String(issue.status), stats),
            sent: numberFrom(stats?.sent) || Number(eventStats?.sent_events ?? 0),
            remaining: numberFrom(stats?.remaining),
            failed: numberFrom(stats?.failed),
            lastBatchSent: numberFrom(stats?.last_batch_sent),
            lastBatchFailed: numberFrom(stats?.last_batch_failed),
            delivered: Number(eventStats?.delivered ?? 0),
            bounced: Number(eventStats?.bounced ?? 0),
            complained: Number(eventStats?.complained ?? 0),
            updatedAt: issue.updated_at,
            sentAt: issue.sent_at,
          }
        : null,
    },
    portal: {
      activeUsers7d: Number(portal?.active_users_7d ?? 0),
      activeUsers30d: Number(portal?.active_users_30d ?? 0),
      contentOpens7d: Number(portal?.content_opens_7d ?? 0),
      downloads7d: Number(portal?.downloads_7d ?? 0),
      toolRuns7d: Number(portal?.tool_runs_7d ?? 0),
      recentActivity,
    },
    resources: {
      total: Number(resources?.total ?? 0),
      missingThumbnail: Number(resources?.missing_thumbnail ?? 0),
      missingAsset: Number(resources?.missing_asset ?? 0),
      html: Number(resources?.html ?? 0),
      pdf: Number(resources?.pdf ?? 0),
      added7d: Number(resources?.added_7d ?? 0),
      recent: recentResources,
    },
  });
}
