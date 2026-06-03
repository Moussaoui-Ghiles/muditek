import { createHash, randomBytes } from "crypto";
import type { NeonQueryFunction } from "@neondatabase/serverless";

type Sql = NeonQueryFunction<false, false>;

export type TikTokPosterApiKeyRow = {
  id: string;
  name: string;
  key_prefix: string;
  created_by: string | null;
  last_used_at: Date | string | null;
  revoked_at: Date | string | null;
  created_at: Date | string | null;
  updated_at: Date | string | null;
};

export function generateTikTokPosterApiKey() {
  return `mtp_${randomBytes(32).toString("base64url")}`;
}

export function hashTikTokPosterApiKey(apiKey: string) {
  return createHash("sha256").update(apiKey.trim()).digest("hex");
}

export function getTikTokPosterApiKeyPrefix(apiKey: string) {
  const value = apiKey.trim();
  return value.length > 12 ? `${value.slice(0, 12)}...` : value;
}

export function serializeTikTokPosterApiKey(row: TikTokPosterApiKeyRow) {
  return {
    id: row.id,
    name: row.name || "TikTok poster key",
    keyPrefix: row.key_prefix || "",
    createdBy: row.created_by,
    lastUsedAt: row.last_used_at ? new Date(row.last_used_at).toISOString() : null,
    revokedAt: row.revoked_at ? new Date(row.revoked_at).toISOString() : null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  };
}

export async function verifyTikTokPosterApiKey(sql: Sql, apiKey: string) {
  const value = apiKey.trim();
  if (!value) return null;

  const rows = await sql`
    UPDATE tiktok_poster_api_keys
    SET last_used_at = NOW(),
        updated_at = NOW()
    WHERE key_hash = ${hashTikTokPosterApiKey(value)}
      AND revoked_at IS NULL
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

  return rows[0] ? serializeTikTokPosterApiKey(rows[0] as TikTokPosterApiKeyRow) : null;
}
