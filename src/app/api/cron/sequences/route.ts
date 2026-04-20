import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { NURTURE_SEQUENCE } from "@/lib/sequences";
import { sendSequenceEmail } from "@/lib/email-templates";

export const maxDuration = 300;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getDb();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://linkingin.vercel.app";

  // Get all unique emails from submissions with their earliest submission date
  const allLeads = await sql`
    SELECT DISTINCT ON (email)
      email, name, created_at as enrolled_at
    FROM submissions
    ORDER BY email, created_at ASC
  `;

  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const lead of allLeads) {
    // Skip if already a subscriber
    const isSubscriber = await sql`
      SELECT 1 FROM subscribers WHERE email = ${lead.email} AND status = 'active'
    `;
    if (isSubscriber.length > 0) {
      skipped++;
      continue;
    }

    // Get already-sent steps for this email
    const sentSteps = await sql`
      SELECT step FROM sequence_sends WHERE email = ${lead.email}
    `;
    const sentStepNumbers = new Set(sentSteps.map((s) => s.step));

    // Find the next step to send
    const enrolledAt = new Date(lead.enrolled_at);
    const now = new Date();

    for (const step of NURTURE_SEQUENCE) {
      if (sentStepNumbers.has(step.step)) continue;

      // Check if enough days have passed
      const dueDate = new Date(enrolledAt);
      dueDate.setDate(dueDate.getDate() + step.delayDays);

      if (now < dueDate) break; // Not due yet, and later steps won't be either

      // Build email content
      const checkoutUrl = `${baseUrl}/buy?email=${encodeURIComponent(lead.email)}`;
      const html =
        step.step === 5
          ? (step.buildHtml as (name: string, url: string) => string)(
              lead.name || "there",
              checkoutUrl
            )
          : step.buildHtml(lead.name || "there");

      try {
        await sendSequenceEmail(lead.email, step.subject, html);

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

  return NextResponse.json({ processed: allLeads.length, sent, skipped, errors });
}
