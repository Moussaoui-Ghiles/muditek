import type { NeonQueryFunction } from "@neondatabase/serverless";

type Sql = NeonQueryFunction<false, false>;

export async function ensureTikTokSchema(sql: Sql) {
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

  await sql`
    CREATE TABLE IF NOT EXISTS tiktok_accounts (
      id SERIAL PRIMARY KEY,
      handle TEXT NOT NULL,
      display_name TEXT,
      avatar_url TEXT,
      open_id TEXT NOT NULL UNIQUE,
      access_token TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      access_expires TIMESTAMPTZ NOT NULL,
      refresh_expires TIMESTAMPTZ NOT NULL,
      scope TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    ALTER TABLE tiktok_accounts
    ADD COLUMN IF NOT EXISTS display_name TEXT,
    ADD COLUMN IF NOT EXISTS avatar_url TEXT,
    ADD COLUMN IF NOT EXISTS scope TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS tiktok_post_attempts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      account_id INTEGER REFERENCES tiktok_accounts(id) ON DELETE SET NULL,
      account_handle TEXT,
      source_label TEXT,
      title TEXT,
      caption TEXT,
      image_count INTEGER NOT NULL DEFAULT 0,
      blob_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
      publish_id TEXT,
      status TEXT NOT NULL DEFAULT 'created',
      fail_reason TEXT,
      error_message TEXT,
      request_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    ALTER TABLE tiktok_post_attempts
    ADD COLUMN IF NOT EXISTS account_handle TEXT,
    ADD COLUMN IF NOT EXISTS source_label TEXT,
    ADD COLUMN IF NOT EXISTS title TEXT,
    ADD COLUMN IF NOT EXISTS caption TEXT,
    ADD COLUMN IF NOT EXISTS image_count INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS blob_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS publish_id TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'created',
    ADD COLUMN IF NOT EXISTS fail_reason TEXT,
    ADD COLUMN IF NOT EXISTS error_message TEXT,
    ADD COLUMN IF NOT EXISTS request_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS tiktok_poster_api_keys (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      key_prefix TEXT NOT NULL,
      key_hash TEXT NOT NULL UNIQUE,
      created_by TEXT,
      last_used_at TIMESTAMPTZ,
      revoked_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    ALTER TABLE tiktok_poster_api_keys
    ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'TikTok poster key',
    ADD COLUMN IF NOT EXISTS key_prefix TEXT,
    ADD COLUMN IF NOT EXISTS key_hash TEXT,
    ADD COLUMN IF NOT EXISTS created_by TEXT,
    ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()
  `;

  await sql`CREATE INDEX IF NOT EXISTS tiktok_accounts_open_id_idx ON tiktok_accounts (open_id)`;
  await sql`CREATE INDEX IF NOT EXISTS tiktok_accounts_handle_idx ON tiktok_accounts (lower(handle))`;
  await sql`CREATE INDEX IF NOT EXISTS tiktok_post_attempts_created_idx ON tiktok_post_attempts (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS tiktok_post_attempts_account_idx ON tiktok_post_attempts (account_id)`;
  await sql`CREATE INDEX IF NOT EXISTS tiktok_post_attempts_status_idx ON tiktok_post_attempts (status)`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS tiktok_poster_api_keys_hash_idx ON tiktok_poster_api_keys (key_hash) WHERE key_hash IS NOT NULL`;
  await sql`CREATE INDEX IF NOT EXISTS tiktok_poster_api_keys_active_idx ON tiktok_poster_api_keys (revoked_at, created_at DESC)`;
}
