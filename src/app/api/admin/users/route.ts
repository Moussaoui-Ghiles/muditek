import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { ensureResourceLeadSchema } from "@/lib/resource-leads";
import { ensureUsageAnalyticsSchema } from "@/lib/usage-analytics";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const like = `%${q}%`;
  const filter = url.searchParams.get("filter") ?? "all";
  const limitParam = Number(url.searchParams.get("limit") ?? 250);
  const limit = Math.min(500, Math.max(25, Number.isFinite(limitParam) ? limitParam : 250));

  const sql = getDb();
  await ensureUsageAnalyticsSchema(sql);
  await ensureResourceLeadSchema(sql);

  const [[summary], users, recentActivity] = await Promise.all([
    sql`
      SELECT
        (SELECT COUNT(*)::int FROM newsletter_subscribers WHERE status = 'active') AS newsletter_active,
        (SELECT COUNT(DISTINCT lower(email))::int FROM portal_memberships WHERE status = 'active') AS portal_accounts,
        (SELECT COUNT(DISTINCT lower(email))::int FROM resource_leads) AS resource_signups,
        (SELECT COUNT(DISTINCT lower(email))::int FROM portal_usage_events WHERE email IS NOT NULL AND created_at >= NOW() - INTERVAL '30 days') AS portal_users_30d,
        (SELECT COUNT(*)::int FROM newsletter_events WHERE event = 'sent') AS newsletter_sent_events,
        (SELECT COUNT(*)::int FROM newsletter_events WHERE event = 'delivered') AS newsletter_delivered_events
    `,
    sql`
      WITH people AS (
        SELECT lower(email) AS email FROM newsletter_subscribers WHERE email IS NOT NULL
        UNION
        SELECT lower(email) AS email FROM portal_memberships WHERE email IS NOT NULL
        UNION
        SELECT lower(email) AS email FROM resource_leads WHERE email IS NOT NULL
        UNION
        SELECT lower(email) AS email FROM portal_usage_events WHERE email IS NOT NULL
      ),
      usage AS (
        SELECT
          lower(email) AS email,
          MIN(created_at) AS first_seen_at,
          MAX(created_at) AS last_seen_at,
          COUNT(*)::int AS actions,
          COUNT(*) FILTER (WHERE event IN ('resource_viewed', 'skill_viewed', 'newsletter_article_opened'))::int AS content_views,
          COUNT(*) FILTER (WHERE event IN ('resource_downloaded', 'skill_downloaded'))::int AS downloads,
          COUNT(*) FILTER (WHERE event = 'tool_used')::int AS tool_runs
        FROM portal_usage_events
        WHERE email IS NOT NULL
        GROUP BY lower(email)
      ),
      resource_signups AS (
        SELECT
          lower(email) AS email,
          COUNT(DISTINCT resource_slug)::int AS resources_requested,
          (array_agg(resource_slug ORDER BY created_at ASC))[1] AS first_resource_slug,
          MIN(created_at) AS first_resource_at,
          MAX(last_seen_at) AS last_resource_at
        FROM resource_leads
        GROUP BY lower(email)
      ),
      memberships AS (
        SELECT
          lower(email) AS email,
          string_agg(role, ', ' ORDER BY role) AS roles,
          MIN(created_at) AS account_created_at,
          MAX(updated_at) AS account_updated_at
        FROM portal_memberships
        WHERE status = 'active'
        GROUP BY lower(email)
      ),
      email_events AS (
        SELECT
          lower(email) AS email,
          COUNT(*) FILTER (WHERE event = 'sent')::int AS newsletter_sent,
          COUNT(*) FILTER (WHERE event = 'delivered')::int AS newsletter_delivered,
          COUNT(*) FILTER (WHERE event = 'bounced')::int AS newsletter_bounced,
          MAX(ts) AS last_newsletter_event_at
        FROM newsletter_events
        WHERE email IS NOT NULL
        GROUP BY lower(email)
      ),
      rows AS (
        SELECT
          p.email,
          ns.status AS newsletter_status,
          ns.segment,
          ns.source,
          ns.subscribed_at,
          ns.lifetime_open_rate,
          ns.lifetime_click_count,
          memberships.roles,
          memberships.account_created_at,
          resource_signups.resources_requested,
          resource_signups.first_resource_slug,
          usage.first_seen_at,
          usage.last_seen_at,
          COALESCE(usage.actions, 0)::int AS actions,
          COALESCE(usage.content_views, 0)::int AS content_views,
          COALESCE(usage.downloads, 0)::int AS downloads,
          COALESCE(usage.tool_runs, 0)::int AS tool_runs,
          COALESCE(email_events.newsletter_sent, 0)::int AS newsletter_sent,
          COALESCE(email_events.newsletter_delivered, 0)::int AS newsletter_delivered,
          COALESCE(email_events.newsletter_bounced, 0)::int AS newsletter_bounced,
          CASE
            WHEN memberships.roles IS NOT NULL THEN 'Portal account'
            WHEN COALESCE(resource_signups.resources_requested, 0) > 0 THEN 'Resource signup'
            WHEN ns.status IS NOT NULL THEN 'Newsletter only'
            ELSE 'Unknown'
          END AS pool,
          NULLIF(GREATEST(
            COALESCE(usage.last_seen_at, 'epoch'::timestamptz),
            COALESCE(resource_signups.last_resource_at::timestamptz, 'epoch'::timestamptz),
            COALESCE(memberships.account_updated_at::timestamptz, 'epoch'::timestamptz),
            COALESCE(email_events.last_newsletter_event_at::timestamptz, 'epoch'::timestamptz),
            COALESCE(ns.subscribed_at::timestamptz, 'epoch'::timestamptz)
          ), 'epoch'::timestamptz) AS last_activity_at
        FROM people p
        LEFT JOIN newsletter_subscribers ns ON lower(ns.email) = p.email
        LEFT JOIN usage ON usage.email = p.email
        LEFT JOIN resource_signups ON resource_signups.email = p.email
        LEFT JOIN memberships ON memberships.email = p.email
        LEFT JOIN email_events ON email_events.email = p.email
      )
      SELECT *
      FROM rows
      WHERE (
        ${q} = ''
        OR email ILIKE ${like}
        OR COALESCE(segment, '') ILIKE ${like}
        OR COALESCE(source, '') ILIKE ${like}
        OR COALESCE(first_resource_slug, '') ILIKE ${like}
      )
      AND (
        ${filter} = 'all'
        OR (${filter} = 'newsletter' AND newsletter_status = 'active')
        OR (${filter} = 'portal' AND roles IS NOT NULL)
        OR (${filter} = 'resources' AND COALESCE(resources_requested, 0) > 0)
        OR (${filter} = 'no-portal' AND newsletter_status = 'active' AND roles IS NULL)
      )
      ORDER BY last_activity_at DESC NULLS LAST
      LIMIT ${limit}
    `,
    sql`
      SELECT email, event, path, resource_slug, created_at
      FROM portal_usage_events
      ORDER BY created_at DESC
      LIMIT 20
    `,
  ]);

  return NextResponse.json({ summary, users, recentActivity });
}
