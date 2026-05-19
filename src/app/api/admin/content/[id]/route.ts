import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { ensureContentItemsSchema } from "@/lib/content-items-schema";
import { normalizeCreatePayload, normalizeUpdatePayload } from "@/lib/content-admin-validation";
import { withDerivedThumbnail } from "@/lib/content-thumbnails";

interface ContentItem {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  category: string;
  topic?: string | null;
  download_url: string;
  file_type: string;
  thumbnail_url: string | null;
  is_new: boolean;
  is_free: boolean;
  created_at: string;
  updated_at?: string | null;
}

function localSkillSlug(id: string): string | null {
  return id.startsWith("local-skill-") ? id.replace(/^local-skill-/, "") : null;
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

  const sourceSlug = localSkillSlug(id);
  if (sourceSlug) {
    const normalized = normalizeCreatePayload({
      ...body,
      fileType: "md",
      topic: body.topic ?? "",
      isNew: body.isNew,
      isFree: body.isFree,
      category: "skill",
      slug: sourceSlug,
    });
    if (!normalized.ok) {
      return NextResponse.json({ error: normalized.error }, { status: 400 });
    }
    const payload = normalized.payload;

    const result = await sql`
      INSERT INTO content_items (title, slug, description, category, topic, download_url, file_type, thumbnail_url, is_new, is_free, updated_at)
      VALUES (
        ${payload.title},
        ${payload.slug},
        ${payload.description},
        ${payload.category},
        ${payload.topic},
        ${payload.downloadUrl},
        ${payload.fileType},
        ${payload.thumbnailUrl},
        ${payload.isNew},
        ${payload.isFree},
        NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        topic = EXCLUDED.topic,
        download_url = EXCLUDED.download_url,
        file_type = EXCLUDED.file_type,
        thumbnail_url = EXCLUDED.thumbnail_url,
        is_new = EXCLUDED.is_new,
        is_free = EXCLUDED.is_free,
        updated_at = NOW()
      RETURNING *
    `;

    return NextResponse.json(withDerivedThumbnail(result[0] as ContentItem));
  }

  const current = (await sql`
    SELECT title, slug, description, category, topic, download_url, file_type, thumbnail_url, is_new, is_free
    FROM content_items
    WHERE id = ${id}
    LIMIT 1
  `) as ContentItem[];

  if (!current[0]) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const normalized = normalizeUpdatePayload(body, current[0]);
  if (!normalized.ok) {
    return NextResponse.json({ error: normalized.error }, { status: 400 });
  }

  const payload = normalized.payload;

  await sql`
    UPDATE content_items
    SET
      title = ${payload.title},
      slug = ${payload.slug},
      description = ${payload.description},
      category = ${payload.category},
      topic = ${payload.topic},
      download_url = ${payload.downloadUrl},
      file_type = ${payload.fileType},
      thumbnail_url = ${payload.thumbnailUrl},
      is_new = ${payload.isNew},
      is_free = ${payload.isFree},
      updated_at = NOW()
    WHERE id = ${id}
  `;

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
  if (localSkillSlug(id)) {
    return NextResponse.json(
      { error: "File-backed skills cannot be deleted from the CMS. Edit once to import an override." },
      { status: 400 }
    );
  }

  const sql = getDb();
  await ensureContentItemsSchema(sql);

  await sql`DELETE FROM content_items WHERE id = ${id}`;

  return NextResponse.json({ success: true });
}
