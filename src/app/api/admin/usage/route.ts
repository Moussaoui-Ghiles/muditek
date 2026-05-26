import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { ensureResourceLeadSchema } from "@/lib/resource-leads";
import { ensureUsageAnalyticsSchema } from "@/lib/usage-analytics";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();
  await ensureUsageAnalyticsSchema(sql);
  await ensureResourceLeadSchema(sql);

  const [
    [business],
    daily,
    funnel,
    contentDemand,
    toolAdoption,
    leadMagnets,
    segments,
    users,
    recentEvents,
  ] = await Promise.all([
    sql`
      SELECT
        (SELECT COUNT(*)::int FROM newsletter_subscribers WHERE status = 'active') AS newsletter_active,
        (SELECT COUNT(*)::int FROM newsletter_subscribers WHERE status = 'active' AND subscribed_at >= NOW() - INTERVAL '7 days') AS newsletter_new_7d,
        (SELECT COUNT(*)::int FROM newsletter_subscribers WHERE status = 'active' AND subscribed_at >= NOW() - INTERVAL '30 days') AS newsletter_new_30d,
        (SELECT COUNT(DISTINCT lower(email))::int FROM portal_memberships WHERE status = 'active') AS portal_accounts,
        (SELECT COUNT(DISTINCT lower(email))::int FROM portal_memberships WHERE status = 'active' AND created_at >= NOW() - INTERVAL '7 days') AS portal_accounts_new_7d,
        (SELECT COUNT(DISTINCT lower(email))::int FROM portal_usage_events WHERE email IS NOT NULL AND created_at >= NOW() - INTERVAL '1 day') AS people_active_today,
        (SELECT COUNT(DISTINCT lower(email))::int FROM portal_usage_events WHERE email IS NOT NULL AND created_at >= NOW() - INTERVAL '7 days') AS people_active_7d,
        (SELECT COUNT(DISTINCT lower(email))::int FROM portal_usage_events WHERE email IS NOT NULL AND created_at >= NOW() - INTERVAL '30 days') AS people_active_30d,
        (SELECT COUNT(DISTINCT lower(email))::int FROM portal_usage_events WHERE email IS NOT NULL AND event IN ('resource_viewed', 'skill_viewed', 'newsletter_article_opened') AND created_at >= NOW() - INTERVAL '30 days') AS content_consumers_30d,
        (SELECT COUNT(DISTINCT lower(email))::int FROM portal_usage_events WHERE email IS NOT NULL AND event IN ('resource_downloaded', 'skill_downloaded') AND created_at >= NOW() - INTERVAL '30 days') AS downloaders_30d,
        (SELECT COUNT(DISTINCT lower(email))::int FROM portal_usage_events WHERE email IS NOT NULL AND event = 'tool_used' AND created_at >= NOW() - INTERVAL '30 days') AS tool_users_30d,
        (SELECT COUNT(DISTINCT lower(email))::int FROM portal_usage_events WHERE email IS NOT NULL AND event IN ('resource_downloaded', 'skill_downloaded', 'tool_used') AND created_at >= NOW() - INTERVAL '30 days') AS high_intent_30d,
        (SELECT COUNT(DISTINCT lower(email))::int FROM resource_leads WHERE created_at >= NOW() - INTERVAL '30 days') AS lead_magnet_signups_30d,
        (SELECT COUNT(*)::int FROM subscribers WHERE status = 'active') AS paid_active,
        (SELECT COALESCE(COUNT(*) FILTER (WHERE status = 'active') * 47, 0)::int FROM subscribers) AS mrr
    `,
    sql`
      SELECT
        to_char(day, 'YYYY-MM-DD') AS date,
        COALESCE(COUNT(DISTINCT lower(e.email)) FILTER (WHERE e.email IS NOT NULL), 0)::int AS people,
        COALESCE(COUNT(DISTINCT lower(e.email)) FILTER (WHERE e.email IS NOT NULL AND e.event IN ('resource_viewed', 'skill_viewed', 'newsletter_article_opened')), 0)::int AS content_people,
        COALESCE(COUNT(DISTINCT lower(e.email)) FILTER (WHERE e.email IS NOT NULL AND e.event = 'tool_used'), 0)::int AS tool_people,
        COALESCE(COUNT(*) FILTER (WHERE e.event IN ('resource_downloaded', 'skill_downloaded')), 0)::int AS downloads
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
      SELECT *
      FROM (
        VALUES
          ('Newsletter audience', 'People on the email list right now', (SELECT COUNT(*)::int FROM newsletter_subscribers WHERE status = 'active'), 1),
          ('Portal accounts', 'People who can log into the portal', (SELECT COUNT(DISTINCT lower(email))::int FROM portal_memberships WHERE status = 'active'), 2),
          ('Opened portal', 'Unique people with any portal activity in 30d', (SELECT COUNT(DISTINCT lower(email))::int FROM portal_usage_events WHERE email IS NOT NULL AND created_at >= NOW() - INTERVAL '30 days'), 3),
          ('Consumed content', 'Opened a resource, skill, or article in 30d', (SELECT COUNT(DISTINCT lower(email))::int FROM portal_usage_events WHERE email IS NOT NULL AND event IN ('resource_viewed', 'skill_viewed', 'newsletter_article_opened') AND created_at >= NOW() - INTERVAL '30 days'), 4),
          ('High intent', 'Downloaded something or used a tool in 30d', (SELECT COUNT(DISTINCT lower(email))::int FROM portal_usage_events WHERE email IS NOT NULL AND event IN ('resource_downloaded', 'skill_downloaded', 'tool_used') AND created_at >= NOW() - INTERVAL '30 days'), 5)
      ) AS f(label, description, value, sort_order)
      ORDER BY sort_order
    `,
    sql`
      SELECT
        ci.title,
        ci.slug,
        ci.category,
        ci.file_type,
        ci.thumbnail_url,
        COUNT(DISTINCT ue.email) FILTER (WHERE ue.event IN ('resource_viewed', 'skill_viewed', 'newsletter_article_opened'))::int AS viewers_30d,
        COUNT(DISTINCT ue.email) FILTER (WHERE ue.event IN ('resource_downloaded', 'skill_downloaded'))::int AS downloaders_30d,
        COUNT(DISTINCT ue.id)::int AS actions_30d,
        COUNT(DISTINCT rl.email)::int AS leads_total
      FROM content_items ci
      LEFT JOIN portal_usage_events ue
        ON ue.resource_slug = ci.slug
       AND ue.created_at >= NOW() - INTERVAL '30 days'
      LEFT JOIN resource_leads rl
        ON rl.resource_slug = ci.slug
      GROUP BY ci.id, ci.title, ci.slug, ci.category, ci.file_type, ci.thumbnail_url
      ORDER BY viewers_30d DESC, downloaders_30d DESC, leads_total DESC, ci.created_at DESC
      LIMIT 12
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
      ORDER BY runs_30d DESC, users_30d DESC, views_30d DESC
      LIMIT 10
    `,
    sql`
      SELECT
        rl.resource_slug,
        COALESCE(ci.title, rl.resource_slug) AS title,
        COUNT(DISTINCT lower(rl.email))::int AS leads,
        MIN(rl.created_at) AS first_signup_at,
        MAX(rl.last_seen_at) AS last_signup_at
      FROM resource_leads rl
      LEFT JOIN content_items ci ON ci.slug = rl.resource_slug
      GROUP BY rl.resource_slug, ci.title
      ORDER BY leads DESC, last_signup_at DESC
      LIMIT 10
    `,
    sql`
      SELECT
        COALESCE(segment, 'UNSEGMENTED') AS segment,
        COUNT(*)::int AS subscribers,
        COUNT(*) FILTER (WHERE subscribed_at >= NOW() - INTERVAL '30 days')::int AS new_30d,
        COALESCE(ROUND(AVG(lifetime_open_rate) FILTER (WHERE lifetime_open_rate IS NOT NULL), 2), 0)::float AS avg_open_rate,
        COALESCE(SUM(lifetime_click_count), 0)::int AS lifetime_clicks
      FROM newsletter_subscribers
      WHERE status = 'active'
      GROUP BY COALESCE(segment, 'UNSEGMENTED')
      ORDER BY subscribers DESC
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
      )
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
        GREATEST(
          COALESCE(usage.last_seen_at, 'epoch'::timestamptz),
          COALESCE(leads.last_lead_at::timestamptz, 'epoch'::timestamptz),
          COALESCE(memberships.account_updated_at::timestamptz, 'epoch'::timestamptz),
          COALESCE(ns.subscribed_at::timestamptz, 'epoch'::timestamptz)
        ) AS last_activity_at
      FROM people p
      LEFT JOIN newsletter_subscribers ns ON lower(ns.email) = p.email
      LEFT JOIN usage ON usage.email = p.email
      LEFT JOIN leads ON leads.email = p.email
      LEFT JOIN memberships ON memberships.email = p.email
      LEFT JOIN paid ON paid.email = p.email
      ORDER BY last_activity_at DESC
      LIMIT 100
    `,
    sql`
      SELECT email, event, path, resource_slug, created_at
      FROM portal_usage_events
      ORDER BY created_at DESC
      LIMIT 30
    `,
  ]);

  return NextResponse.json({
    business,
    daily,
    funnel,
    contentDemand,
    toolAdoption,
    leadMagnets,
    segments,
    users,
    recentEvents,
  });
}
