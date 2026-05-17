import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { ensureContentItemsSchema } from "@/lib/content-items-schema";
import { withDerivedThumbnails } from "@/lib/content-thumbnails";
import { listPortalSkills } from "@/lib/portal-skills";
import type { ContentItem } from "@/lib/content-item";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();
  await ensureContentItemsSchema(sql);
  const items = await sql`
    SELECT id, title, slug, description, category, download_url, file_type, thumbnail_url, is_new, is_free, created_at, updated_at
    FROM content_items
    ORDER BY is_free ASC, category ASC, created_at DESC
  `;
  const dbItems = withDerivedThumbnails(items as ContentItem[]);
  const dbSkillSlugs = new Set(
    dbItems.filter((item) => item.category === "skill").map((item) => item.slug)
  );
  const localSkills = listPortalSkills().filter((item) => !dbSkillSlugs.has(item.slug));

  return NextResponse.json(
    withDerivedThumbnails([...dbItems, ...localSkills]).sort((a, b) => {
      if (a.is_free !== b.is_free) return a.is_free ? -1 : 1;
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
  );
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const body = await request.json();
  const { title, slug, description, category, downloadUrl, fileType, thumbnailUrl, isFree, isNew } = body;

  if (!title || !slug || !category || !downloadUrl) {
    return NextResponse.json(
      { error: "title, slug, category, and downloadUrl are required" },
      { status: 400 }
    );
  }

  const sql = getDb();
  await ensureContentItemsSchema(sql);

  const result = await sql`
    INSERT INTO content_items (title, slug, description, category, download_url, file_type, thumbnail_url, is_free, is_new, updated_at)
    VALUES (
      ${title.trim()},
      ${slug.trim()},
      ${description?.trim() || null},
      ${category.trim()},
      ${downloadUrl.trim()},
      ${fileType?.trim() || "zip"},
      ${thumbnailUrl?.trim() || null},
      ${Boolean(isFree)},
      ${typeof isNew === "boolean" ? isNew : true},
      NOW()
    )
    RETURNING *
  `;

  return NextResponse.json(result[0], { status: 201 });
}
