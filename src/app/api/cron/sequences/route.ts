import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  WELCOME_SEQUENCE,
  WELCOME_SEQUENCE_ENROLLMENT_TYPE,
} from "@/lib/sequences";
import { sendSequenceEmail } from "@/lib/email-templates";
import {
  processNewsletterCampaigns,
  sunsetExpiredReactivation,
} from "@/lib/newsletter-campaign";

export const maxDuration = 300;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://muditek.com";
  const [newsletterFallback, newsletterSunset] = await Promise.all([
    processNewsletterCampaigns(baseUrl, 1),
    sunsetExpiredReactivation(),
  ]);

  if (process.env.WELCOME_SEQUENCE_ENABLED === "false") {
    return NextResponse.json({
      processed: 0,
      sent: 0,
      skipped: 0,
      errors: 0,
      paused: true,
      newsletterFallback,
      newsletterSunset,
    });
  }

  const sql = getDb();

  // Behavior-based segment recompute (opt-in via env until the COLD purge is done):
  // HOT = clicked in 90 days, WARM = opened in 90 days, COLD = neither.
  let segmentsRecomputed = 0;
  if (process.env.SEGMENT_RECOMPUTE_ENABLED === "true") {
    const updated = await sql`
      WITH engagement AS (
        SELECT
          subscriber_id,
          bool_or(event = 'clicked') AS clicked,
          bool_or(event = 'opened') AS opened
        FROM newsletter_events
        WHERE ts > NOW() - INTERVAL '90 days'
          AND subscriber_id IS NOT NULL
        GROUP BY subscriber_id
      )
      UPDATE newsletter_subscribers s
      SET segment = CASE
        WHEN e.clicked THEN 'HOT'
        WHEN e.opened THEN 'WARM'
        ELSE 'COLD'
      END
      FROM (
        SELECT s2.id, COALESCE(e2.clicked, false) AS clicked, COALESCE(e2.opened, false) AS opened
        FROM newsletter_subscribers s2
        LEFT JOIN engagement e2 ON e2.subscriber_id = s2.id
        WHERE s2.status = 'active'
      ) e
      WHERE s.id = e.id
        AND s.segment IS DISTINCT FROM (CASE
          WHEN e.clicked THEN 'HOT'
          WHEN e.opened THEN 'WARM'
          ELSE 'COLD'
        END)
      RETURNING s.id
    `;
    segmentsRecomputed = updated.length;
  }

  const allLeads = await sql`
    SELECT
      lower(s.email) AS email,
      split_part(lower(s.email), '@', 1) AS name,
      MIN(e.sent_at) AS enrolled_at,
      s.unsub_token
    FROM newsletter_subscribers s
    JOIN email_log e ON lower(e.email) = lower(s.email)
    WHERE s.status = 'active'
      AND e.type = ${WELCOME_SEQUENCE_ENROLLMENT_TYPE}
    GROUP BY lower(s.email), s.unsub_token
  `;

  let sent = 0;
  const skipped = 0;
  let errors = 0;

  for (const lead of allLeads) {
    // Get already-sent steps for this email
    const sentSteps = await sql`
      SELECT step FROM sequence_sends WHERE email = ${lead.email}
    `;
    const sentStepNumbers = new Set(sentSteps.map((s) => s.step));

    // Find the next step to send
    const enrolledAt = new Date(lead.enrolled_at);
    const now = new Date();

    for (const step of WELCOME_SEQUENCE.slice(1)) {
      if (sentStepNumbers.has(step.step)) continue;

      // Check if enough days have passed
      const dueDate = new Date(enrolledAt);
      dueDate.setDate(dueDate.getDate() + step.delayDays);

      if (now < dueDate) break; // Not due yet, and later steps won't be either

      const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe/${lead.unsub_token}`;
      const preferencesUrl = `${baseUrl}/preferences/${lead.unsub_token}`;
      const html = step.buildHtml(lead.name || "there", {
        baseUrl,
        preferencesUrl,
        unsubscribeUrl,
      });

      try {
        await sendSequenceEmail(
          lead.email,
          step.subject,
          html,
          step.step,
          unsubscribeUrl,
        );

        await sql`
          INSERT INTO sequence_sends (email, step)
          VALUES (${lead.email}, ${step.step})
          ON CONFLICT (email, step) DO NOTHING
        `;

        sent++;
      } catch {
        errors++;
      }

      // Only send one step per lead per cron run
      break;
    }
  }

  return NextResponse.json({ processed: allLeads.length, sent, skipped, errors, segmentsRecomputed });
}
