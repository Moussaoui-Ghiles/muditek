import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  const body = await request.json();
  const sql = getDb();

  if (typeof body.title === "string") {
    await sql`UPDATE content_items SET title = ${body.title} WHERE id = ${id}`;
  }
  if (typeof body.description === "string") {
    await sql`UPDATE content_items SET description = ${body.description} WHERE id = ${id}`;
  }
  if (typeof body.downloadUrl === "string") {
    await sql`UPDATE content_items SET download_url = ${body.downloadUrl} WHERE id = ${id}`;
  }
  if (typeof body.category === "string") {
    await sql`UPDATE content_items SET category = ${body.category} WHERE id = ${id}`;
  }
  if (typeof body.isNew === "boolean") {
    await sql`UPDATE content_items SET is_new = ${body.isNew} WHERE id = ${id}`;
  }

  const result = await sql`SELECT * FROM content_items WHERE id = ${id}`;

  if (result.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result[0]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  const sql = getDb();

  await sql`DELETE FROM content_items WHERE id = ${id}`;

  return NextResponse.json({ success: true });
}
