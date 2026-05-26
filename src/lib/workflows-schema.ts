import type { getDb } from "@/lib/db";

type SqlClient = ReturnType<typeof getDb>;

let schemaReady = false;

export async function ensureWorkflowsSchema(sql: SqlClient) {
  if (schemaReady) return;

  await sql`
    CREATE TABLE IF NOT EXISTS workflows (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
      slug TEXT UNIQUE NOT NULL,
      format TEXT NOT NULL,
      raw_json JSONB NOT NULL,
      node_count INT NOT NULL DEFAULT 0,
      apps TEXT[] NOT NULL DEFAULT '{}',
      source_path TEXT,
      drive_file_id TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_workflows_format ON workflows(format)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_workflows_slug ON workflows(slug)`;

  schemaReady = true;
}
