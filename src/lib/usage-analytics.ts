import type { NeonQueryFunction } from "@neondatabase/serverless";

export type UsageEventName =
  | "portal_opened"
  | "portal_page_view"
  | "resource_viewed"
  | "resource_downloaded"
  | "skill_viewed"
  | "skill_downloaded"
  | "tool_viewed"
  | "tool_used"
  | "newsletter_article_opened";

type UsageEventInput = {
  email?: string | null;
  clerkUserId?: string | null;
  event: UsageEventName | string;
  path?: string | null;
  resourceSlug?: string | null;
  metadata?: Record<string, unknown> | null;
};

export async function ensureUsageAnalyticsSchema(sql: NeonQueryFunction<false, false>) {
  await sql`
    CREATE TABLE IF NOT EXISTS portal_usage_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT,
      clerk_user_id TEXT,
      event TEXT NOT NULL,
      path TEXT,
      resource_slug TEXT,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS portal_usage_events_email_idx ON portal_usage_events (lower(email))`;
  await sql`CREATE INDEX IF NOT EXISTS portal_usage_events_event_idx ON portal_usage_events (event)`;
  await sql`CREATE INDEX IF NOT EXISTS portal_usage_events_created_at_idx ON portal_usage_events (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS portal_usage_events_resource_idx ON portal_usage_events (resource_slug)`;
}

export async function recordUsageEvent(
  sql: NeonQueryFunction<false, false>,
  input: UsageEventInput,
) {
  await ensureUsageAnalyticsSchema(sql);
  await sql`
    INSERT INTO portal_usage_events (email, clerk_user_id, event, path, resource_slug, metadata)
    VALUES (
      ${input.email?.toLowerCase() ?? null},
      ${input.clerkUserId ?? null},
      ${input.event},
      ${input.path ?? null},
      ${input.resourceSlug ?? null},
      ${JSON.stringify(input.metadata ?? {})}::jsonb
    )
  `;
}
