import { getDb } from "@/lib/db";
import type { ContentItem } from "@/lib/content-item";
import { ensureContentItemsSchema } from "@/lib/content-items-schema";
import { withDerivedThumbnail, withDerivedThumbnails } from "@/lib/content-thumbnails";

type Visibility = "free" | "paid" | "all";

export async function listContentItems(visibility: Visibility = "all"): Promise<ContentItem[]> {
  const sql = getDb();
  await ensureContentItemsSchema(sql);

  if (visibility === "free") {
    const items = (await sql`
      SELECT id, title, slug, description, category, download_url, file_type, thumbnail_url, is_new, is_free, created_at, updated_at
      FROM content_items
      WHERE is_free = true
      ORDER BY created_at DESC
    `) as ContentItem[];
    return withDerivedThumbnails(items);
  }

  if (visibility === "paid") {
    const items = (await sql`
      SELECT id, title, slug, description, category, download_url, file_type, thumbnail_url, is_new, is_free, created_at, updated_at
      FROM content_items
      WHERE is_free = false
      ORDER BY created_at DESC
    `) as ContentItem[];
    return withDerivedThumbnails(items);
  }

  const items = (await sql`
    SELECT id, title, slug, description, category, download_url, file_type, thumbnail_url, is_new, is_free, created_at, updated_at
    FROM content_items
    ORDER BY is_free DESC, created_at DESC
  `) as ContentItem[];
  return withDerivedThumbnails(items);
}

export async function getContentItemBySlug(slug: string): Promise<ContentItem | null> {
  const sql = getDb();
  await ensureContentItemsSchema(sql);
  const rows = (await sql`
    SELECT id, title, slug, description, category, download_url, file_type, thumbnail_url, is_new, is_free, created_at, updated_at
    FROM content_items
    WHERE slug = ${slug}
    LIMIT 1
  `) as ContentItem[];

  return rows[0] ? withDerivedThumbnail(rows[0]) : null;
}
