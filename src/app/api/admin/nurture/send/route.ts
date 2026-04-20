import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { NURTURE_SEQUENCE } from "@/lib/sequences";
import { sendSequenceEmail } from "@/lib/email-templates";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const body = (await request.json()) as { email: string; step?: number };
  const { email, step } = body;

  if (!email) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  const sql = getDb();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const subscriberRows = await sql`
    SELECT 1 FROM subscribers WHERE email = ${email} AND status = 'active'
  `;
  if (subscriberRows.length > 0) {
    return NextResponse.json(
      { error: "Already an active subscriber" },
      { status: 409 },
    );
  }

  const leadRows = await sql`
    SELECT name, created_at AS enrolled_at
    FROM submissions
    WHERE email = ${email}
    ORDER BY created_at ASC
    LIMIT 1
  `;
  if (leadRows.length === 0) {
    return NextResponse.json(
      { error: "No submission found for this email" },
      { status: 404 },
    );
  }
  const lead = leadRows[0];

  let target = step;
  if (!target) {
    const sentRows = await sql`
      SELECT COALESCE(MAX(step), 1) AS last_step FROM sequence_sends WHERE email = ${email}
    `;
    const lastStep = sentRows[0]?.last_step ?? 1;
    const next = NURTURE_SEQUENCE.find((s) => s.step > lastStep);
    if (!next) {
      return NextResponse.json(
        { error: "Lead has completed the sequence" },
        { status: 409 },
      );
    }
    target = next.step;
  }

  const stepConfig = NURTURE_SEQUENCE.find((s) => s.step === target);
  if (!stepConfig) {
    return NextResponse.json({ error: "Invalid step" }, { status: 400 });
  }

  const alreadySent = await sql`
    SELECT 1 FROM sequence_sends WHERE email = ${email} AND step = ${target}
  `;
  if (alreadySent.length > 0) {
    return NextResponse.json(
      { error: `Step ${target} already sent to this lead` },
      { status: 409 },
    );
  }

  const checkoutUrl = `${baseUrl}/buy?email=${encodeURIComponent(email)}`;
  const html = stepConfig.buildHtml(lead.name || "there", checkoutUrl);

  try {
    await sendSequenceEmail(email, stepConfig.subject, html, stepConfig.step);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  await sql`
    INSERT INTO sequence_sends (email, step)
    VALUES (${email}, ${target})
    ON CONFLICT (email, step) DO NOTHING
  `;

  return NextResponse.json({ sent: true, step: target });
}
