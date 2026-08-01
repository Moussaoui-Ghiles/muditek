import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import {
  WELCOME_SEQUENCE,
  WELCOME_SEQUENCE_ENROLLMENT_TYPE,
} from "@/lib/sequences";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();

  const [stepCounts, upcoming, recent, totalEnrolled] = await Promise.all([
    sql`
      SELECT ss.step, COUNT(*)::int AS total
      FROM sequence_sends ss
      WHERE EXISTS (
        SELECT 1 FROM email_log e
        WHERE lower(e.email) = lower(ss.email)
          AND e.type = ${WELCOME_SEQUENCE_ENROLLMENT_TYPE}
      )
      GROUP BY ss.step
      ORDER BY ss.step ASC
    `,
    sql`
      WITH lead_progress AS (
        SELECT
          lower(s.email) AS email,
          split_part(lower(s.email), '@', 1) AS name,
          MIN(e.sent_at) AS enrolled_at,
          (SELECT MAX(step) FROM sequence_sends WHERE lower(email) = lower(s.email)) AS last_step
        FROM newsletter_subscribers s
        JOIN email_log e ON lower(e.email) = lower(s.email)
        WHERE s.status = 'active'
          AND e.type = ${WELCOME_SEQUENCE_ENROLLMENT_TYPE}
        GROUP BY lower(s.email)
      )
      SELECT email, name, enrolled_at, last_step
      FROM lead_progress
      WHERE last_step IS NULL OR last_step < 3
      ORDER BY enrolled_at DESC
      LIMIT 50
    `,
    sql`
      SELECT ss.email, ss.step, ss.sent_at
      FROM sequence_sends ss
      WHERE EXISTS (
        SELECT 1 FROM email_log e
        WHERE lower(e.email) = lower(ss.email)
          AND e.type = ${WELCOME_SEQUENCE_ENROLLMENT_TYPE}
      )
      ORDER BY ss.sent_at DESC
      LIMIT 20
    `,
    sql`
      SELECT COUNT(DISTINCT lower(s.email))::int AS total
      FROM newsletter_subscribers s
      JOIN email_log e ON lower(e.email) = lower(s.email)
      WHERE s.status = 'active'
        AND e.type = ${WELCOME_SEQUENCE_ENROLLMENT_TYPE}
    `,
  ]);

  const countsByStep: Record<number, number> = {};
  for (const row of stepCounts) {
    countsByStep[row.step] = row.total;
  }

  const enrolled = totalEnrolled[0]?.total ?? 0;
  countsByStep[1] = enrolled;
  const stepInfo = WELCOME_SEQUENCE.map((s) => ({
    step: s.step,
    subject: s.subject,
    delayDays: s.delayDays,
    sent: countsByStep[s.step] ?? 0,
    pctOfEnrolled: enrolled > 0 ? Math.round(((countsByStep[s.step] ?? 0) / enrolled) * 100) : 0,
  }));

  const now = new Date();
  const withDue = upcoming.map((lead) => {
    const nextStep = WELCOME_SEQUENCE.find((s) => s.step > (lead.last_step || 1));
    if (!nextStep) return { ...lead, nextStep: null, nextDue: null };
    const dueDate = new Date(lead.enrolled_at);
    dueDate.setDate(dueDate.getDate() + nextStep.delayDays);
    return {
      ...lead,
      nextStep: nextStep.step,
      nextDue: dueDate.toISOString(),
      overdue: dueDate < now,
    };
  });

  return NextResponse.json({
    enabled: process.env.WELCOME_SEQUENCE_ENABLED !== "false",
    enrolled,
    stepInfo,
    upcoming: withDue.slice(0, 30),
    recent,
  });
}
