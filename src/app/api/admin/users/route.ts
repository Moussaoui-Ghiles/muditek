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
        (SELECT COUNT(DISTINCT lower(email))::int FROM portal_usage_events WHERE email IS NOT NULL AND event IN ('resource_downloaded', 'skill_downloaded', 'tool_used') AND created_at >= NOW() - INTERVAL '30 days') AS follow_up_candidates_30d,
        (SELECT COUNT(*)::int FROM subscribers WHERE status = 'active') AS paid_customers
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
          COUNT(DISTINCT path)::int AS pages,
          COUNT(*) FILTER (WHERE event IN ('resource_viewed', 'skill_viewed', 'newsletter_article_opened'))::int AS content_views,
          COUNT(*) FILTER (WHERE event IN ('resource_downloaded', 'skill_downloaded'))::int AS downloads,
          COUNT(*) FILTER (WHERE event = 'tool_used')::int AS tool_runs
        FROM portal_usage_events
        WHERE email IS NOT NULL
        GROUP BY lower(email)
      ),
      leads AS (
        SELECT
          lower(email) AS email,
          COUNT(DISTINCT resource_slug)::int AS lead_magnets,
          (array_agg(resource_slug ORDER BY created_at ASC))[1] AS first_resource_slug,
          MIN(created_at) AS first_lead_at,
          MAX(last_seen_at) AS last_lead_at
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
      paid AS (
        SELECT lower(email) AS email, COUNT(*) FILTER (WHERE status = 'active')::int AS active_paid
        FROM subscribers
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
          leads.lead_magnets,
          leads.first_resource_slug,
          usage.first_seen_at,
          usage.last_seen_at,
          COALESCE(usage.actions, 0)::int AS actions,
          COALESCE(usage.pages, 0)::int AS pages,
          COALESCE(usage.content_views, 0)::int AS content_views,
          COALESCE(usage.downloads, 0)::int AS downloads,
          COALESCE(usage.tool_runs, 0)::int AS tool_runs,
          COALESCE(paid.active_paid, 0)::int AS active_paid,
          (COALESCE(usage.downloads, 0) > 0 OR COALESCE(usage.tool_runs, 0) > 0) AS follow_up_ready,
          CASE
            WHEN COALESCE(paid.active_paid, 0) > 0 THEN 'Paid customer'
            WHEN memberships.roles IS NOT NULL THEN 'Portal account'
            WHEN COALESCE(leads.lead_magnets, 0) > 0 THEN 'Resource signup'
            WHEN ns.status IS NOT NULL THEN 'Newsletter only'
            ELSE 'Unknown'
          END AS pool,
          NULLIF(GREATEST(
            COALESCE(usage.last_seen_at, 'epoch'::timestamptz),
            COALESCE(leads.last_lead_at::timestamptz, 'epoch'::timestamptz),
            COALESCE(memberships.account_updated_at::timestamptz, 'epoch'::timestamptz),
            COALESCE(ns.subscribed_at::timestamptz, 'epoch'::timestamptz)
          ), 'epoch'::timestamptz) AS last_activity_at
        FROM people p
        LEFT JOIN newsletter_subscribers ns ON lower(ns.email) = p.email
        LEFT JOIN usage ON usage.email = p.email
        LEFT JOIN leads ON leads.email = p.email
        LEFT JOIN memberships ON memberships.email = p.email
        LEFT JOIN paid ON paid.email = p.email
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
        OR (${filter} = 'resources' AND COALESCE(lead_magnets, 0) > 0)
        OR (${filter} = 'follow-up' AND follow_up_ready)
        OR (${filter} = 'paid' AND active_paid > 0)
        OR (${filter} = 'no-portal' AND newsletter_status = 'active' AND roles IS NULL)
      )
      ORDER BY follow_up_ready DESC, active_paid DESC, last_activity_at DESC
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
