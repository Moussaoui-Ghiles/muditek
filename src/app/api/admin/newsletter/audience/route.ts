import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();
  const rows = await sql`
    SELECT
      segment,
      status,
      COUNT(*)::int AS count
    FROM newsletter_subscribers
    GROUP BY segment, status
    ORDER BY status, segment
  `;
  const totals = await sql`
    SELECT status, COUNT(*)::int AS count
    FROM newsletter_subscribers
    GROUP BY status
  `;
  return NextResponse.json({ breakdown: rows, totals });
}
