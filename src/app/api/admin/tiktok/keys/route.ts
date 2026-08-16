import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import {
  generateTikTokPosterApiKey,
  getTikTokPosterApiKeyPrefix,
  hashTikTokPosterApiKey,
  serializeTikTokPosterApiKey,
  type TikTokPosterApiKeyRow,
} from "@/lib/tiktok-api-keys";
import { ensureTikTokSchema } from "@/lib/tiktok-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanName(value: unknown) {
  if (typeof value !== "string") return "TikTok poster key";
  const name = value.trim();
  return name.length > 0 ? name.slice(0, 80) : "TikTok poster key";
}

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();
  await ensureTikTokSchema(sql);

  const rows = await sql`
    SELECT
      id,
      name,
      key_prefix,
      created_by,
      last_used_at,
      revoked_at,
      created_at,
      updated_at
    FROM tiktok_poster_api_keys
    ORDER BY created_at DESC
    LIMIT 50
  `;

  return NextResponse.json({
    keys: rows.map((row) => serializeTikTokPosterApiKey(row as TikTokPosterApiKeyRow)),
  });
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const body = await request.json().catch(() => ({}));
  const apiKey = generateTikTokPosterApiKey();
  const sql = getDb();
  await ensureTikTokSchema(sql);

  const rows = await sql`
    INSERT INTO tiktok_poster_api_keys (
      name,
      key_prefix,
      key_hash,
      created_by
    )
    VALUES (
      ${cleanName((body as Record<string, unknown>).name)},
      ${getTikTokPosterApiKeyPrefix(apiKey)},
      ${hashTikTokPosterApiKey(apiKey)},
      ${admin.email}
    )
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

  return NextResponse.json({
    key: serializeTikTokPosterApiKey(rows[0] as TikTokPosterApiKeyRow),
    apiKey,
  });
}
