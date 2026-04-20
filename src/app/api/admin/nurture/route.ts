import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { NURTURE_SEQUENCE } from "@/lib/sequences";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();

  const [stepCounts, upcoming, recent, totalEnrolled] = await Promise.all([
    sql`
      SELECT step, COUNT(*)::int AS total
      FROM sequence_sends
      GROUP BY step
      ORDER BY step ASC
    `,
    sql`
      WITH lead_progress AS (
        SELECT DISTINCT ON (s.email)
          s.email,
          s.name,
          s.created_at AS enrolled_at,
          (SELECT MAX(step) FROM sequence_sends WHERE email = s.email) AS last_step
        FROM submissions s
        WHERE NOT EXISTS (SELECT 1 FROM subscribers sub WHERE sub.email = s.email AND sub.status = 'active')
        ORDER BY s.email, s.created_at ASC
      )
      SELECT email, name, enrolled_at, last_step
      FROM lead_progress
      WHERE last_step IS NULL OR last_step < 5
      ORDER BY enrolled_at DESC
      LIMIT 50
    `,
    sql`
      SELECT email, step, sent_at FROM sequence_sends
      ORDER BY sent_at DESC
      LIMIT 20
    `,
    sql`
      SELECT COUNT(DISTINCT email)::int AS total
      FROM submissions s
      WHERE NOT EXISTS (SELECT 1 FROM subscribers sub WHERE sub.email = s.email AND sub.status = 'active')
    `,
  ]);

  const countsByStep: Record<number, number> = {};
  for (const row of stepCounts) {
    countsByStep[row.step] = row.total;
  }

  const enrolled = totalEnrolled[0]?.total ?? 0;
  const stepInfo = NURTURE_SEQUENCE.map((s) => ({
    step: s.step,
    subject: s.subject,
    delayDays: s.delayDays,
    sent: countsByStep[s.step] ?? 0,
    pctOfEnrolled: enrolled > 0 ? Math.round(((countsByStep[s.step] ?? 0) / enrolled) * 100) : 0,
  }));

  const now = new Date();
  const withDue = upcoming.map((lead) => {
    const nextStep = NURTURE_SEQUENCE.find((s) => s.step > (lead.last_step || 1));
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
    enrolled,
    stepInfo,
    upcoming: withDue.slice(0, 30),
    recent,
  });
}
