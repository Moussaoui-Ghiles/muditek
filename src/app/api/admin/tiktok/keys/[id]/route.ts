import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import {
  serializeTikTokPosterApiKey,
  type TikTokPosterApiKeyRow,
} from "@/lib/tiktok-api-keys";
import { ensureTikTokSchema } from "@/lib/tiktok-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  const sql = getDb();
  await ensureTikTokSchema(sql);

  const rows = await sql`
    UPDATE tiktok_poster_api_keys
    SET revoked_at = COALESCE(revoked_at, NOW()),
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING
      id,
      name,
      key_prefix,
      created_by,
      last_used_at,
      revoked_at,
      created_at,
      updated_at
  `;

  if (!rows[0]) {
    return NextResponse.json({ error: "API key not found." }, { status: 404 });
  }

  return NextResponse.json({
    key: serializeTikTokPosterApiKey(rows[0] as TikTokPosterApiKeyRow),
  });
}
