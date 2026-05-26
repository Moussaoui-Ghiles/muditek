import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();

  const campaigns = await sql`
    SELECT
      c.*,
      COALESCE(s.submission_count, 0) as submission_count,
      COALESCE(s.verified_count, 0) as verified_count,
      COALESCE(s.delivered_count, 0) as delivered_count
    FROM campaigns c
    LEFT JOIN (
      SELECT
        campaign_id,
        COUNT(*) as submission_count,
        COUNT(*) FILTER (WHERE verified = true) as verified_count,
        COUNT(*) FILTER (WHERE delivered = true) as delivered_count
      FROM submissions
      GROUP BY campaign_id
    ) s ON s.campaign_id = c.id
    ORDER BY c.created_at DESC
  `;

  return NextResponse.json(campaigns);
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  return NextResponse.json(
    {
      error:
        "Legacy campaigns are archived. Share portal resource links instead.",
    },
    { status: 410 }
  );
}
