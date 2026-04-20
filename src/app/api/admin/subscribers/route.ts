import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();

  const subscribers = await sql`
    SELECT id, email, name, status, current_period_end, created_at, cancelled_at,
      stripe_customer_id
    FROM subscribers
    ORDER BY created_at DESC
  `;

  const activeCount = subscribers.filter((s) => s.status === "active").length;
  const cancelledCount = subscribers.filter((s) => s.status === "cancelled").length;

  return NextResponse.json({
    subscribers,
    stats: {
      total: subscribers.length,
      active: activeCount,
      cancelled: cancelledCount,
      mrr: activeCount * 47,
    },
  });
}
