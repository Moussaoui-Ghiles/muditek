import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendResourceEmail } from "@/lib/email";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  const sql = getDb();

  const rows = await sql`
    SELECT
      s.id,
      s.email,
      s.campaign_id,
      s.delivered,
      c.title,
      c.resource_url
    FROM submissions s
    LEFT JOIN campaigns c ON c.id = s.campaign_id
    WHERE s.id = ${id}
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const submission = rows[0];

  if (!submission.resource_url) {
    return NextResponse.json({ error: "Campaign has no resource_url" }, { status: 400 });
  }

  const existing = await sql`
    SELECT id FROM deliveries
    WHERE campaign_id = ${submission.campaign_id} AND email = ${submission.email}
  `;

  if (existing.length > 0) {
    return NextResponse.json({
      error: "Already delivered to this email for this campaign",
      deliveryId: existing[0].id,
    }, { status: 409 });
  }

  let resendId: string;
  try {
    resendId = await sendResourceEmail(submission.email, submission.title, submission.resource_url);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  await sql`
    INSERT INTO deliveries (submission_id, campaign_id, email, resend_email_id)
    VALUES (${submission.id}, ${submission.campaign_id}, ${submission.email}, ${resendId})
  `;

  await sql`
    UPDATE submissions SET verified = true, delivered = true WHERE id = ${submission.id}
  `;

  return NextResponse.json({ sent: true, resendId });
}
