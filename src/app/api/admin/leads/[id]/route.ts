import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  const sql = getDb();

  const submissions = await sql`
    SELECT
      s.*,
      c.title AS campaign_title,
      c.keyword AS campaign_keyword,
      c.post_url AS campaign_post_url,
      c.resource_url AS campaign_resource_url
    FROM submissions s
    LEFT JOIN campaigns c ON c.id = s.campaign_id
    WHERE s.id = ${id}
  `;

  if (submissions.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const submission = submissions[0];

  const [deliveries, sends, subscriber] = await Promise.all([
    sql`SELECT id, sent_at, resend_email_id FROM deliveries WHERE submission_id = ${id} ORDER BY sent_at DESC`,
    sql`SELECT step, sent_at FROM sequence_sends WHERE email = ${submission.email} ORDER BY step ASC`,
    sql`SELECT id, status, stripe_customer_id, created_at FROM subscribers WHERE email = ${submission.email}`,
  ]);

  return NextResponse.json({
    submission,
    deliveries,
    sequenceSends: sends,
    subscriber: subscriber[0] || null,
  });
}
