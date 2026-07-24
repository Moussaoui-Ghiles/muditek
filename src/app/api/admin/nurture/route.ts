import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { ensureNewsletterLifecycleSchema } from "@/lib/newsletter-lifecycle";
import { NEWSLETTER_LIFECYCLE } from "@/lib/newsletter-programs";
import { newsletterSendingEnabled } from "@/lib/newsletter-sending";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  await ensureNewsletterLifecycleSchema();
  const sql = getDb();
  const [stepCounts, upcoming, recent, totals] = await Promise.all([
    sql`
      SELECT step, COUNT(*)::int AS total
      FROM newsletter_lifecycle_deliveries
      WHERE status = 'sent'
      GROUP BY step
      ORDER BY step
    `,
    sql`
      SELECT
        s.email,
        split_part(s.email, '@', 1) AS name,
        s.subscribed_at AS enrolled_at,
        (
          SELECT MAX(sent.step)
          FROM newsletter_lifecycle_deliveries sent
          WHERE sent.subscriber_id = s.id AND sent.status = 'sent'
        ) AS last_step,
        d.step AS next_step,
        d.scheduled_at AS next_due,
        d.scheduled_at < NOW() AS overdue
      FROM newsletter_lifecycle_deliveries d
      JOIN newsletter_subscribers s ON s.id = d.subscriber_id
      WHERE d.status IN ('queued', 'processing')
        AND NOT EXISTS (
          SELECT 1
          FROM newsletter_lifecycle_deliveries earlier
          WHERE earlier.subscriber_id = d.subscriber_id
            AND earlier.status IN ('queued', 'processing')
            AND (
              earlier.scheduled_at < d.scheduled_at
              OR (earlier.scheduled_at = d.scheduled_at AND earlier.step < d.step)
            )
        )
      ORDER BY d.scheduled_at
      LIMIT 30
    `,
    sql`
      SELECT s.email, d.step, d.sent_at
      FROM newsletter_lifecycle_deliveries d
      JOIN newsletter_subscribers s ON s.id = d.subscriber_id
      WHERE d.status = 'sent'
      ORDER BY d.sent_at DESC
      LIMIT 20
    `,
    sql`
      SELECT
        COUNT(DISTINCT subscriber_id)::int AS enrolled,
        COUNT(*) FILTER (WHERE status = 'queued')::int AS queued,
        COUNT(*) FILTER (WHERE status = 'processing')::int AS processing,
        COUNT(*) FILTER (WHERE status = 'failed')::int AS failed,
        COUNT(*) FILTER (WHERE status = 'suppressed')::int AS suppressed
      FROM newsletter_lifecycle_deliveries
    `,
  ]);

  const counts = new Map(stepCounts.map((row) => [Number(row.step), Number(row.total)]));
  const enrolled = Number(totals[0]?.enrolled ?? 0);
  return NextResponse.json({
    enabled: newsletterSendingEnabled(),
    enrolled,
    queue: {
      queued: Number(totals[0]?.queued ?? 0),
      processing: Number(totals[0]?.processing ?? 0),
      failed: Number(totals[0]?.failed ?? 0),
      suppressed: Number(totals[0]?.suppressed ?? 0),
    },
    stepInfo: NEWSLETTER_LIFECYCLE.map((step) => ({
      step: step.step,
      subject: step.subject,
      delayDays: step.delayDays,
      sent: counts.get(step.step) ?? 0,
      pctOfEnrolled:
        enrolled > 0 ? Math.round(((counts.get(step.step) ?? 0) / enrolled) * 100) : 0,
    })),
    upcoming: upcoming.map((row) => ({
      ...row,
      nextStep: Number(row.next_step),
      nextDue: row.next_due,
      last_step: row.last_step === null ? null : Number(row.last_step),
    })),
    recent,
  });
}
