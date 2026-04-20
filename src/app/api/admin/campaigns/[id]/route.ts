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

  const { id } = await params;
  const body = await request.json();
  const sql = getDb();

  if (typeof body.isActive === "boolean") {
    await sql`
      UPDATE campaigns SET is_active = ${body.isActive} WHERE id = ${id}
    `;
  }

  if (typeof body.postUrl === "string") {
    await sql`
      UPDATE campaigns SET post_url = ${body.postUrl} WHERE id = ${id}
    `;
  }

  if (typeof body.keyword === "string") {
    await sql`
      UPDATE campaigns SET keyword = ${body.keyword.trim()} WHERE id = ${id}
    `;
  }

  if (typeof body.title === "string") {
    await sql`
      UPDATE campaigns SET title = ${body.title.trim()} WHERE id = ${id}
    `;
  }

  if (typeof body.resourceUrl === "string") {
    await sql`
      UPDATE campaigns SET resource_url = ${body.resourceUrl.trim()} WHERE id = ${id}
    `;
  }

  const result = await sql`SELECT * FROM campaigns WHERE id = ${id}`;
  return NextResponse.json(result[0]);
}
