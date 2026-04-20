import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();

  const leads = await sql`
    SELECT
      s.id,
      s.name,
      s.email,
      s.comment,
      s.verified,
      s.delivered,
      s.created_at,
      s.campaign_id,
      c.title AS campaign_title,
      c.keyword AS campaign_keyword,
      c.is_active AS campaign_active,
      (SELECT MAX(step) FROM sequence_sends ss WHERE ss.email = s.email) AS nurture_step,
      EXISTS (
        SELECT 1 FROM subscribers sub WHERE sub.email = s.email AND sub.status = 'active'
      ) AS is_subscriber
    FROM submissions s
    LEFT JOIN campaigns c ON c.id = s.campaign_id
    ORDER BY s.created_at DESC
    LIMIT 500
  `;

  const campaigns = await sql`
    SELECT id, title FROM campaigns ORDER BY created_at DESC
  `;

  return NextResponse.json({ leads, campaigns });
}
