import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { ensureContentItemsSchema } from "@/lib/content-items-schema";
import { withDerivedThumbnail } from "@/lib/content-thumbnails";

interface ContentItem {
  slug: string;
  thumbnail_url: string | null;
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
  await ensureContentItemsSchema(sql);

  if (typeof body.title === "string") {
    await sql`UPDATE content_items SET title = ${body.title.trim()}, updated_at = NOW() WHERE id = ${id}`;
  }
  if (typeof body.slug === "string") {
    await sql`UPDATE content_items SET slug = ${body.slug.trim()}, updated_at = NOW() WHERE id = ${id}`;
  }
  if (typeof body.description === "string") {
    await sql`UPDATE content_items SET description = ${body.description.trim() || null}, updated_at = NOW() WHERE id = ${id}`;
  }
  if (typeof body.downloadUrl === "string") {
    await sql`UPDATE content_items SET download_url = ${body.downloadUrl.trim()}, updated_at = NOW() WHERE id = ${id}`;
  }
  if (typeof body.category === "string") {
    await sql`UPDATE content_items SET category = ${body.category.trim()}, updated_at = NOW() WHERE id = ${id}`;
  }
  if (typeof body.fileType === "string") {
    await sql`UPDATE content_items SET file_type = ${body.fileType.trim() || "zip"}, updated_at = NOW() WHERE id = ${id}`;
  }
  if (typeof body.thumbnailUrl === "string") {
    await sql`UPDATE content_items SET thumbnail_url = ${body.thumbnailUrl.trim() || null}, updated_at = NOW() WHERE id = ${id}`;
  }
  if (typeof body.isNew === "boolean") {
    await sql`UPDATE content_items SET is_new = ${body.isNew}, updated_at = NOW() WHERE id = ${id}`;
  }
  if (typeof body.isFree === "boolean") {
    await sql`UPDATE content_items SET is_free = ${body.isFree}, updated_at = NOW() WHERE id = ${id}`;
  }

  const result = await sql`
    SELECT id, title, slug, description, category, download_url, file_type, thumbnail_url, is_new, is_free, created_at, updated_at
    FROM content_items
    WHERE id = ${id}
  `;

  if (result.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(withDerivedThumbnail(result[0] as ContentItem));
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  const sql = getDb();
  await ensureContentItemsSchema(sql);

  await sql`DELETE FROM content_items WHERE id = ${id}`;

  return NextResponse.json({ success: true });
}
