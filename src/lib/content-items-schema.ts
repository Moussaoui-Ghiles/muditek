import type { getDb } from "@/lib/db";

type SqlClient = ReturnType<typeof getDb>;

let schemaReady = false;

export async function ensureContentItemsSchema(sql: SqlClient) {
  if (schemaReady) return;

  await sql`
    ALTER TABLE content_items
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS file_type TEXT DEFAULT 'zip',
    ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
    ADD COLUMN IF NOT EXISTS topic TEXT,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()
  `;

  schemaReady = true;
}
