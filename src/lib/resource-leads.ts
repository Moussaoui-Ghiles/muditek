import { getDb } from "@/lib/db";

type Sql = ReturnType<typeof getDb>;

export interface TrackResourceLeadInput {
  email: string;
  resourceSlug: string;
  name?: string | null;
  clerkUserId?: string | null;
  source?: string;
}

export async function ensureResourceLeadSchema(sql: Sql = getDb()) {
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

  await sql`
    CREATE TABLE IF NOT EXISTS resource_leads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL,
      name TEXT,
      clerk_user_id TEXT,
      resource_slug TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'resource-share',
      created_at TIMESTAMP DEFAULT NOW(),
      last_seen_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(email, resource_slug)
    )
  `;

  await sql`
    ALTER TABLE resource_leads
    ADD COLUMN IF NOT EXISTS name TEXT,
    ADD COLUMN IF NOT EXISTS clerk_user_id TEXT,
    ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'resource-share',
    ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP DEFAULT NOW()
  `;

  await sql`CREATE INDEX IF NOT EXISTS resource_leads_email_idx ON resource_leads (email)`;
  await sql`CREATE INDEX IF NOT EXISTS resource_leads_slug_idx ON resource_leads (resource_slug)`;
  await sql`CREATE INDEX IF NOT EXISTS resource_leads_created_at_idx ON resource_leads (created_at DESC)`;
}

export async function trackResourceLead({
  email,
  name,
  clerkUserId,
  resourceSlug,
  source = "resource-share",
}: TrackResourceLeadInput) {
  const sql = getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedSlug = resourceSlug.trim();

  if (!normalizedEmail || !normalizedSlug) return;

  await ensureResourceLeadSchema(sql);

  await sql`
    INSERT INTO resource_leads (email, name, clerk_user_id, resource_slug, source)
    VALUES (${normalizedEmail}, ${name ?? null}, ${clerkUserId ?? null}, ${normalizedSlug}, ${source})
    ON CONFLICT (email, resource_slug) DO UPDATE
    SET
      name = COALESCE(EXCLUDED.name, resource_leads.name),
      clerk_user_id = COALESCE(EXCLUDED.clerk_user_id, resource_leads.clerk_user_id),
      source = EXCLUDED.source,
      last_seen_at = NOW()
  `;

  await sql`
    INSERT INTO newsletter_subscribers (email, source, topics, clerk_user_id)
    VALUES (
      ${normalizedEmail},
      ${`resource:${normalizedSlug}`},
      ARRAY['ai-agents','gtm-systems','solo-operator'],
      ${clerkUserId ?? null}
    )
    ON CONFLICT (email) DO UPDATE
    SET status = 'active', unsub_at = NULL
  `;

  if (clerkUserId) {
    await sql`
      UPDATE newsletter_subscribers
      SET clerk_user_id = ${clerkUserId}
      WHERE email = ${normalizedEmail}
        AND (clerk_user_id IS NULL OR clerk_user_id = ${clerkUserId})
    `;
  }

  await sql`
    INSERT INTO portal_memberships (email, role)
    VALUES (${normalizedEmail}, 'free')
    ON CONFLICT (email, role) DO UPDATE
    SET status = 'active', updated_at = NOW()
  `;
}
