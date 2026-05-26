import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { ensureContentItemsSchema } from "@/lib/content-items-schema";
import { ensureResourceLeadSchema } from "@/lib/resource-leads";
import { ensureUsageAnalyticsSchema } from "@/lib/usage-analytics";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();
  await ensureUsageAnalyticsSchema(sql);
  await ensureResourceLeadSchema(sql);
  await ensureContentItemsSchema(sql);

  const [summaryRows, daily, contentDemand, toolAdoption, recentEvents] = await Promise.all([
    sql`
      SELECT
        (SELECT COUNT(DISTINCT lower(email))::int FROM portal_memberships WHERE status = 'active') AS portal_accounts,
        (SELECT COUNT(DISTINCT lower(email))::int FROM portal_usage_events WHERE email IS NOT NULL AND created_at >= NOW() - INTERVAL '1 day') AS active_today,
        (SELECT COUNT(DISTINCT lower(email))::int FROM portal_usage_events WHERE email IS NOT NULL AND created_at >= NOW() - INTERVAL '7 days') AS active_7d,
        (SELECT COUNT(DISTINCT lower(email))::int FROM portal_usage_events WHERE email IS NOT NULL AND created_at >= NOW() - INTERVAL '30 days') AS active_30d,
        (SELECT COUNT(*)::int FROM portal_usage_events WHERE event IN ('resource_viewed', 'skill_viewed', 'newsletter_article_opened') AND created_at >= NOW() - INTERVAL '30 days') AS content_opens_30d,
        (SELECT COUNT(*)::int FROM portal_usage_events WHERE event IN ('resource_downloaded', 'skill_downloaded') AND created_at >= NOW() - INTERVAL '30 days') AS downloads_30d,
        (SELECT COUNT(*)::int FROM portal_usage_events WHERE event = 'tool_used' AND created_at >= NOW() - INTERVAL '30 days') AS tool_runs_30d
    `,
    sql`
      SELECT
        to_char(day, 'YYYY-MM-DD') AS date,
        COALESCE(COUNT(DISTINCT lower(e.email)) FILTER (WHERE e.email IS NOT NULL), 0)::int AS active_people,
        COALESCE(COUNT(*) FILTER (WHERE e.event IN ('resource_viewed', 'skill_viewed', 'newsletter_article_opened')), 0)::int AS content_opens,
        COALESCE(COUNT(*) FILTER (WHERE e.event IN ('resource_downloaded', 'skill_downloaded')), 0)::int AS downloads,
        COALESCE(COUNT(*) FILTER (WHERE e.event = 'tool_used'), 0)::int AS tool_runs
      FROM generate_series(
        date_trunc('day', NOW()) - INTERVAL '13 days',
        date_trunc('day', NOW()),
        INTERVAL '1 day'
      ) day
      LEFT JOIN portal_usage_events e
        ON e.created_at >= day
       AND e.created_at < day + INTERVAL '1 day'
      GROUP BY day
      ORDER BY day ASC
    `,
    sql`
      SELECT
        ci.title,
        ci.slug,
        ci.category,
        ci.file_type,
        ci.thumbnail_url,
        COUNT(*) FILTER (WHERE ue.event IN ('resource_viewed', 'skill_viewed', 'newsletter_article_opened'))::int AS opens_30d,
        COUNT(*) FILTER (WHERE ue.event IN ('resource_downloaded', 'skill_downloaded'))::int AS downloads_30d,
        COUNT(DISTINCT ue.email) FILTER (WHERE ue.email IS NOT NULL)::int AS people_30d,
        COUNT(DISTINCT rl.email)::int AS signups_total
      FROM content_items ci
      LEFT JOIN portal_usage_events ue
        ON ue.resource_slug = ci.slug
       AND ue.created_at >= NOW() - INTERVAL '30 days'
      LEFT JOIN resource_leads rl ON rl.resource_slug = ci.slug
      WHERE ci.category IN ('skill', 'playbook', 'guide', 'tool')
      GROUP BY ci.id, ci.title, ci.slug, ci.category, ci.file_type, ci.thumbnail_url
      HAVING
        COUNT(*) FILTER (WHERE ue.event IN ('resource_viewed', 'skill_viewed', 'newsletter_article_opened')) > 0
        OR COUNT(*) FILTER (WHERE ue.event IN ('resource_downloaded', 'skill_downloaded')) > 0
        OR COUNT(DISTINCT rl.email) > 0
      ORDER BY opens_30d DESC, downloads_30d DESC, signups_total DESC, ci.created_at DESC
      LIMIT 20
    `,
    sql`
      SELECT
        resource_slug,
        COUNT(*) FILTER (WHERE event = 'tool_viewed')::int AS views_30d,
        COUNT(*) FILTER (WHERE event = 'tool_used')::int AS runs_30d,
        COUNT(DISTINCT lower(email)) FILTER (WHERE email IS NOT NULL AND event = 'tool_used')::int AS users_30d,
        MAX(created_at) AS last_used_at
      FROM portal_usage_events
      WHERE created_at >= NOW() - INTERVAL '30 days'
        AND event IN ('tool_viewed', 'tool_used')
        AND resource_slug IS NOT NULL
      GROUP BY resource_slug
      HAVING COUNT(*) FILTER (WHERE event = 'tool_used') > 0
      ORDER BY runs_30d DESC, users_30d DESC, views_30d DESC
      LIMIT 10
    `,
    sql`
      SELECT email, event, path, resource_slug, created_at
      FROM portal_usage_events
      ORDER BY created_at DESC
      LIMIT 30
    `,
  ]);

  return NextResponse.json({
    summary: summaryRows[0],
    daily,
    contentDemand,
    toolAdoption,
    recentEvents,
  });
}
