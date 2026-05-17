import { getDb } from "@/lib/db";

type Sql = ReturnType<typeof getDb>;

const DEFAULT_TOPICS = ["ai-agents", "gtm-systems", "solo-operator"];

export async function getOrCreatePreferenceHref({
  email,
  clerkUserId,
  sql = getDb(),
}: {
  email: string;
  clerkUserId: string;
  sql?: Sql;
}): Promise<string | null> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

  const rows = await sql`
    INSERT INTO newsletter_subscribers (email, source, topics, clerk_user_id)
    VALUES (${normalizedEmail}, 'portal', ${DEFAULT_TOPICS}, ${clerkUserId})
    ON CONFLICT (email) DO UPDATE
    SET
      clerk_user_id = CASE
        WHEN newsletter_subscribers.clerk_user_id IS NULL
          OR newsletter_subscribers.clerk_user_id = ${clerkUserId}
        THEN ${clerkUserId}
        ELSE newsletter_subscribers.clerk_user_id
      END,
      unsub_token = COALESCE(newsletter_subscribers.unsub_token, gen_random_uuid())
    RETURNING unsub_token
  `;

  const token = rows[0]?.unsub_token ? String(rows[0].unsub_token) : "";
  return token ? `/preferences/${token}` : null;
}
