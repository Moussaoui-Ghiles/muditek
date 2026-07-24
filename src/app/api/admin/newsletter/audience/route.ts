import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { ensureNewsletterCampaignSchema } from "@/lib/newsletter-campaign";
import { ensureNewsletterLifecycleSchema } from "@/lib/newsletter-lifecycle";
import { newsletterSendingEnabled } from "@/lib/newsletter-sending";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  await ensureNewsletterCampaignSchema();
  await ensureNewsletterLifecycleSchema();
  const sql = getDb();
  const [rows, totals, cohorts, sources, recentHealth, campaignQueue, lifecycleQueue] =
    await Promise.all([
      sql`
    SELECT
      segment,
      status,
      COUNT(*)::int AS count
    FROM newsletter_subscribers
    GROUP BY segment, status
    ORDER BY status, segment
  `,
      sql`
    SELECT status, COUNT(*)::int AS count
    FROM newsletter_subscribers
    GROUP BY status
  `,
      sql`
    SELECT
      COUNT(*) FILTER (
        WHERE s.status = 'active'
          AND EXISTS (
            SELECT 1
            FROM portal_usage_events p
            WHERE lower(p.email) = lower(s.email)
              AND (
                p.resource_slug ~* '(outbound|cold-email|lead-gen|lead-finder|agentic-sdr|revenue-leak)'
                OR p.path ~* '(outbound|cold-email|lead-gen|lead-finder|agentic-sdr|revenue-leak)'
              )
          )
      )::int AS outbound_interest,
      COUNT(*) FILTER (
        WHERE s.status = 'active'
          AND EXISTS (
            SELECT 1
            FROM portal_usage_events p
            WHERE lower(p.email) = lower(s.email)
              AND p.created_at >= NOW() - INTERVAL '30 days'
          )
      )::int AS portal_active_30d,
      COUNT(*) FILTER (
        WHERE s.status = 'active'
          AND s.subscribed_at >= NOW() - INTERVAL '90 days'
      )::int AS recent_90d
    FROM newsletter_subscribers s
  `,
      sql`
    SELECT COALESCE(consent_source, source, 'unknown') AS source, COUNT(*)::int AS count
    FROM newsletter_subscribers
    WHERE status = 'active'
    GROUP BY COALESCE(consent_source, source, 'unknown')
    ORDER BY count DESC
    LIMIT 25
  `,
      sql`
    SELECT
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'sent')::int AS sent,
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'delivered')::int AS delivered,
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'bounced')::int AS bounced,
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'complained')::int AS complained
    FROM newsletter_events
    WHERE ts >= NOW() - INTERVAL '30 days'
  `,
      sql`
    SELECT status, COUNT(*)::int AS count
    FROM newsletter_campaign_runs
    GROUP BY status
  `,
      sql`
    SELECT status, COUNT(*)::int AS count
    FROM newsletter_lifecycle_deliveries
    GROUP BY status
  `,
    ]);
  return NextResponse.json({
    sendingEnabled: newsletterSendingEnabled(),
    breakdown: rows,
    totals,
    cohorts: cohorts[0],
    sources,
    recentHealth: recentHealth[0],
    campaignQueue,
    lifecycleQueue,
  });
}
