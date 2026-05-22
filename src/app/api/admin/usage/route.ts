import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { ensureUsageAnalyticsSchema } from "@/lib/usage-analytics";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();
  await ensureUsageAnalyticsSchema(sql);

  const [
    [summary],
    daily,
    topResources,
    topTools,
    topPages,
    recentUsers,
    recentEvents,
  ] = await Promise.all([
    sql`
      SELECT
        COUNT(*)::int AS total_events,
        COUNT(DISTINCT lower(email)) FILTER (WHERE email IS NOT NULL)::int AS total_users,
        COUNT(DISTINCT lower(email)) FILTER (WHERE email IS NOT NULL AND created_at >= NOW() - INTERVAL '1 day')::int AS active_today,
        COUNT(DISTINCT lower(email)) FILTER (WHERE email IS NOT NULL AND created_at >= NOW() - INTERVAL '7 days')::int AS active_7d,
        COUNT(DISTINCT lower(email)) FILTER (WHERE email IS NOT NULL AND created_at >= NOW() - INTERVAL '30 days')::int AS active_30d,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int AS events_7d
      FROM portal_usage_events
    `,
    sql`
      SELECT
        to_char(day, 'YYYY-MM-DD') AS date,
        COALESCE(COUNT(e.id), 0)::int AS events,
        COALESCE(COUNT(DISTINCT lower(e.email)) FILTER (WHERE e.email IS NOT NULL), 0)::int AS users
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
        resource_slug,
        COUNT(*)::int AS events,
        COUNT(DISTINCT lower(email)) FILTER (WHERE email IS NOT NULL)::int AS users
      FROM portal_usage_events
      WHERE created_at >= NOW() - INTERVAL '30 days'
        AND event IN ('resource_viewed', 'resource_downloaded', 'skill_viewed', 'skill_downloaded', 'newsletter_article_opened')
        AND resource_slug IS NOT NULL
      GROUP BY resource_slug
      ORDER BY users DESC, events DESC
      LIMIT 10
    `,
    sql`
      SELECT
        resource_slug,
        COUNT(*)::int AS runs,
        COUNT(DISTINCT lower(email)) FILTER (WHERE email IS NOT NULL)::int AS users
      FROM portal_usage_events
      WHERE created_at >= NOW() - INTERVAL '30 days'
        AND event = 'tool_used'
        AND resource_slug IS NOT NULL
      GROUP BY resource_slug
      ORDER BY runs DESC
      LIMIT 10
    `,
    sql`
      SELECT
        COALESCE(path, '/') AS path,
        COUNT(*)::int AS views,
        COUNT(DISTINCT lower(email)) FILTER (WHERE email IS NOT NULL)::int AS users
      FROM portal_usage_events
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY path
      ORDER BY users DESC, views DESC
      LIMIT 10
    `,
    sql`
      SELECT
        lower(email) AS email,
        MAX(created_at) AS last_seen_at,
        COUNT(*)::int AS events,
        COUNT(DISTINCT path)::int AS pages,
        COUNT(*) FILTER (WHERE event = 'tool_used')::int AS tools_used,
        COUNT(*) FILTER (WHERE event IN ('resource_downloaded', 'skill_downloaded'))::int AS downloads
      FROM portal_usage_events
      WHERE email IS NOT NULL
      GROUP BY lower(email)
      ORDER BY last_seen_at DESC
      LIMIT 20
    `,
    sql`
      SELECT email, event, path, resource_slug, created_at
      FROM portal_usage_events
      ORDER BY created_at DESC
      LIMIT 30
    `,
  ]);

  return NextResponse.json({
    summary,
    daily,
    topResources,
    topTools,
    topPages,
    recentUsers,
    recentEvents,
  });
}
