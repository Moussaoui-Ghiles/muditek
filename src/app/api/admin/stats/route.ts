import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { NURTURE_SEQUENCE } from "@/lib/sequences";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();

  const [
    [subs],
    [leads],
    [leadsWeek],
    [commenters],
    [verified],
    [delivered],
    [subscribed],
    [emailsDeliveries],
    [emailsSequence],
    [verifiedUndelivered],
    [expiringSoon],
    nurtureLeads,
    topCampaigns,
    newsletterSegments,
    [newsletterThisWeek],
    [lastIssue],
  ] = await Promise.all([
    sql`SELECT
      COUNT(*) FILTER (WHERE status = 'active')::int AS active,
      COUNT(*)::int AS total
      FROM subscribers`,
    sql`SELECT COUNT(*)::int AS total FROM submissions`,
    sql`SELECT COUNT(*)::int AS total FROM submissions WHERE created_at >= NOW() - INTERVAL '7 days'`,
    sql`SELECT COUNT(*)::int AS total FROM commenters`,
    sql`SELECT COUNT(*)::int AS total FROM submissions WHERE verified = true`,
    sql`SELECT COUNT(*)::int AS total FROM submissions WHERE delivered = true`,
    sql`SELECT COUNT(DISTINCT email)::int AS total
      FROM submissions s
      WHERE EXISTS (SELECT 1 FROM subscribers WHERE email = s.email AND status = 'active')`,
    sql`SELECT COUNT(*)::int AS total FROM deliveries WHERE sent_at >= NOW() - INTERVAL '7 days'`,
    sql`SELECT COUNT(*)::int AS total FROM sequence_sends WHERE sent_at >= NOW() - INTERVAL '7 days'`,
    sql`SELECT COUNT(*)::int AS total FROM submissions
      WHERE verified = true AND delivered = false`,
    sql`SELECT COUNT(*)::int AS total FROM campaigns
      WHERE is_active = true
      AND expires_at BETWEEN NOW() AND NOW() + INTERVAL '3 days'`,
    sql`
      WITH lead_progress AS (
        SELECT DISTINCT ON (s.email)
          s.email,
          s.created_at AS enrolled_at,
          COALESCE((SELECT MAX(step) FROM sequence_sends WHERE email = s.email), 1) AS last_step
        FROM submissions s
        WHERE NOT EXISTS (
          SELECT 1 FROM subscribers sub WHERE sub.email = s.email AND sub.status = 'active'
        )
        ORDER BY s.email, s.created_at ASC
      )
      SELECT email, enrolled_at, last_step
      FROM lead_progress
      WHERE last_step < 5
    `,
    sql`
      SELECT
        c.id,
        c.title,
        c.keyword,
        c.is_active,
        COUNT(s.id)::int AS submissions,
        COUNT(*) FILTER (WHERE s.verified)::int AS verified,
        COUNT(*) FILTER (WHERE s.delivered)::int AS delivered
      FROM campaigns c
      LEFT JOIN submissions s ON s.campaign_id = c.id
      GROUP BY c.id, c.title, c.keyword, c.is_active
      HAVING COUNT(s.id) > 0
      ORDER BY submissions DESC, delivered DESC
      LIMIT 5
    `,
    sql`
      SELECT
        COALESCE(segment, 'UNSEGMENTED') AS segment,
        COUNT(*)::int AS total
      FROM newsletter_subscribers
      WHERE status = 'active'
      GROUP BY segment
    `,
    sql`
      SELECT COUNT(*)::int AS total
      FROM newsletter_subscribers
      WHERE status = 'active' AND subscribed_at >= NOW() - INTERVAL '7 days'
    `,
    sql`
      SELECT id, subject, slug, status, sent_at, scheduled_at, stats
      FROM newsletter_issues
      ORDER BY COALESCE(sent_at, scheduled_at, updated_at) DESC NULLS LAST
      LIMIT 1
    `,
  ]);

  const now = Date.now();
  let overdueNurture = 0;
  for (const lead of nurtureLeads) {
    const nextStep = NURTURE_SEQUENCE.find((s) => s.step > (lead.last_step || 1));
    if (!nextStep) continue;
    const due = new Date(lead.enrolled_at).getTime() + nextStep.delayDays * 86_400_000;
    if (due < now) overdueNurture++;
  }

  const segments: Record<string, number> = { HOT: 0, WARM: 0, COLD: 0, UNSEGMENTED: 0 };
  for (const row of newsletterSegments) {
    segments[row.segment] = row.total;
  }
  const newsletterTotal = Object.values(segments).reduce((a, b) => a + b, 0);

  return NextResponse.json({
    kpis: {
      activeSubscribers: subs.active ?? 0,
      mrr: (subs.active ?? 0) * 47,
      totalLeads: leads.total ?? 0,
      leadsThisWeek: leadsWeek.total ?? 0,
      emailsThisWeek: (emailsDeliveries.total ?? 0) + (emailsSequence.total ?? 0),
    },
    funnel: {
      commenters: commenters.total ?? 0,
      submissions: leads.total ?? 0,
      verified: verified.total ?? 0,
      delivered: delivered.total ?? 0,
      subscribed: subscribed.total ?? 0,
    },
    alerts: {
      verifiedUndelivered: verifiedUndelivered.total ?? 0,
      overdueNurture,
      expiringSoon: expiringSoon.total ?? 0,
    },
    topCampaigns,
    newsletter: {
      total: newsletterTotal,
      hot: segments.HOT,
      warm: segments.WARM,
      cold: segments.COLD,
      unsegmented: segments.UNSEGMENTED,
      newThisWeek: newsletterThisWeek?.total ?? 0,
      lastIssue: lastIssue
        ? {
            id: lastIssue.id,
            subject: lastIssue.subject,
            slug: lastIssue.slug,
            status: lastIssue.status,
            sentAt: lastIssue.sent_at,
            scheduledAt: lastIssue.scheduled_at,
            stats: lastIssue.stats,
          }
        : null,
    },
  });
}
