import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendResourceEmailBatch } from "@/lib/email";
import { requireAdmin } from "@/lib/admin-auth";

export const maxDuration = 300;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  const sql = getDb();

  const campaigns = await sql`
    SELECT id, title, resource_url FROM campaigns WHERE id = ${id}
  `;

  if (campaigns.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const campaign = campaigns[0];

  // Get verified but not yet delivered, excluding already-delivered emails
  const submissions = await sql`
    SELECT s.id, s.email FROM submissions s
    WHERE s.campaign_id = ${id}
      AND s.verified = true
      AND s.delivered = false
      AND NOT EXISTS (
        SELECT 1 FROM deliveries d
        WHERE d.campaign_id = ${id} AND d.email = s.email
      )
  `;

  if (submissions.length === 0) {
    return NextResponse.json({ sent: 0, pending: 0 });
  }

  // Batch send via Resend
  let sent = 0;
  let failed = 0;

  try {
    const results = await sendResourceEmailBatch(
      submissions.map((s) => ({
        to: s.email,
        resourceTitle: campaign.title,
        resourceUrl: campaign.resource_url,
      }))
    );

    // Record each delivery with the Resend email ID
    for (const result of results) {
      const sub = submissions.find((s) => s.email === result.to);
      if (!sub) continue;

      await sql`
        INSERT INTO deliveries (submission_id, campaign_id, email, resend_email_id)
        VALUES (${sub.id}, ${id}, ${sub.email}, ${result.id})
        ON CONFLICT (campaign_id, email) DO NOTHING
      `;

      await sql`
        UPDATE submissions SET delivered = true WHERE id = ${sub.id}
      `;

      sent++;
    }
  } catch (err) {
    failed = submissions.length - sent;
    return NextResponse.json({
      sent,
      failed,
      pending: submissions.length,
      error: String(err),
    });
  }

  return NextResponse.json({ sent, pending: submissions.length });
}
