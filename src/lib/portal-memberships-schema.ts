import type { getDb } from "@/lib/db";

type SqlClient = ReturnType<typeof getDb>;

let schemaReady = false;

export async function ensurePortalMembershipsSchema(sql: SqlClient) {
  if (schemaReady) return;

  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

  await sql`
    CREATE TABLE IF NOT EXISTS portal_memberships (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(email, role)
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS portal_memberships_email_idx ON portal_memberships (email)`;
  await sql`CREATE INDEX IF NOT EXISTS portal_memberships_role_idx ON portal_memberships (role)`;

  schemaReady = true;
}
