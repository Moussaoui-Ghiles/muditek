import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { NURTURE_SEQUENCE } from "@/lib/sequences";
import { sendSequenceEmail } from "@/lib/email-templates";
import { ensureResourceLeadSchema } from "@/lib/resource-leads";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const body = (await request.json()) as { email: string; step?: number };
  const { email, step } = body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  const sql = getDb();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  await ensureResourceLeadSchema(sql);

  const subscriberRows = await sql`
    SELECT 1 FROM subscribers WHERE email = ${normalizedEmail} AND status = 'active'
  `;
  if (subscriberRows.length > 0) {
    return NextResponse.json(
      { error: "Already an active subscriber" },
      { status: 409 },
    );
  }

  const leadRows = await sql`
    WITH raw_leads AS (
      SELECT lower(email) AS email, name, created_at AS enrolled_at
      FROM submissions
      UNION ALL
      SELECT lower(email) AS email, name, created_at AS enrolled_at
      FROM resource_leads
      UNION ALL
      SELECT lower(email) AS email, split_part(email, '@', 1) AS name, subscribed_at AS enrolled_at
      FROM newsletter_subscribers
      WHERE status = 'active'
        AND source IN ('portal', 'portal-signup', 'sign-up')
    )
    SELECT name, enrolled_at
    FROM raw_leads
    WHERE email = ${normalizedEmail}
    ORDER BY enrolled_at ASC
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
      SELECT COALESCE(MAX(step), 1) AS last_step FROM sequence_sends WHERE email = ${normalizedEmail}
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
    SELECT 1 FROM sequence_sends WHERE email = ${normalizedEmail} AND step = ${target}
  `;
  if (alreadySent.length > 0) {
    return NextResponse.json(
      { error: `Step ${target} already sent to this lead` },
      { status: 409 },
    );
  }

  const portalUrl = `${baseUrl}/portal`;
  const html = stepConfig.buildHtml(lead.name || "there", portalUrl);

  try {
    await sendSequenceEmail(normalizedEmail, stepConfig.subject, html, stepConfig.step);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  await sql`
    INSERT INTO sequence_sends (email, step)
    VALUES (${normalizedEmail}, ${target})
    ON CONFLICT (email, step) DO NOTHING
  `;

  return NextResponse.json({ sent: true, step: target });
}
