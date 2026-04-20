import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();
  const items = await sql`
    SELECT * FROM content_items ORDER BY category ASC, created_at DESC
  `;

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const body = await request.json();
  const { title, slug, description, category, downloadUrl, fileType } = body;

  if (!title || !slug || !category || !downloadUrl) {
    return NextResponse.json(
      { error: "title, slug, category, and downloadUrl are required" },
      { status: 400 }
    );
  }

  const sql = getDb();

  const result = await sql`
    INSERT INTO content_items (title, slug, description, category, download_url, file_type)
    VALUES (${title}, ${slug}, ${description || null}, ${category}, ${downloadUrl}, ${fileType || "zip"})
    RETURNING *
  `;

  return NextResponse.json(result[0], { status: 201 });
}
