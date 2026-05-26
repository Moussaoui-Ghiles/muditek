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

  const campaigns = await sql`SELECT * FROM campaigns WHERE id = ${id}`;
  if (campaigns.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const submissions = await sql`
    SELECT * FROM submissions
    WHERE campaign_id = ${id}
    ORDER BY created_at DESC
  `;

  const commenterResult = await sql`
    SELECT COUNT(*)::int as count FROM commenters WHERE campaign_id = ${id}
  `;

  const subscribedResult = await sql`
    SELECT COUNT(DISTINCT sub.email)::int as count
    FROM subscribers sub
    WHERE sub.status = 'active'
    AND sub.email IN (
      SELECT email FROM submissions WHERE campaign_id = ${id}
    )
  `;

  return NextResponse.json({
    campaign: campaigns[0],
    submissions,
    commenterCount: commenterResult[0]?.count ?? 0,
    subscribedCount: subscribedResult[0]?.count ?? 0,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  await params;

  return NextResponse.json(
    {
      error:
        "Legacy campaigns are archived and read-only. Share portal resource links instead.",
    },
    { status: 410 }
  );
}
