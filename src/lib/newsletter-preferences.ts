import { getDb } from "./db";

type Sql = ReturnType<typeof getDb>;

export function preferenceRecordAction(hasSubscriber: boolean): "none" | "ensure-token-only" {
  return hasSubscriber ? "ensure-token-only" : "none";
}

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

  const existing = await sql`
    SELECT id FROM newsletter_subscribers WHERE email = ${normalizedEmail} LIMIT 1
  `;
  if (preferenceRecordAction(existing.length > 0) === "none") return null;

  const rows = await sql`
    UPDATE newsletter_subscribers
    SET
      clerk_user_id = CASE
        WHEN clerk_user_id IS NULL OR clerk_user_id = ${clerkUserId}
        THEN ${clerkUserId}
        ELSE clerk_user_id
      END,
      unsub_token = COALESCE(unsub_token, gen_random_uuid())
    WHERE email = ${normalizedEmail}
    RETURNING unsub_token
  `;

  const token = rows[0]?.unsub_token ? String(rows[0].unsub_token) : "";
  return token ? `/preferences/${token}` : null;
}
