import { getDb } from "@/lib/db";
import { ensurePortalMembershipsSchema } from "@/lib/portal-memberships-schema";

type Sql = ReturnType<typeof getDb>;

export async function ensurePortalAccount({
  sql = getDb(),
  email,
  clerkUserId,
  source = "portal",
}: {
  sql?: Sql;
  email: string;
  clerkUserId: string;
  source?: string;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !clerkUserId) return;

  await ensurePortalMembershipsSchema(sql);

  await sql`
    INSERT INTO newsletter_subscribers (email, source, topics, clerk_user_id)
    VALUES (${normalizedEmail}, ${source}, ARRAY['ai-agents','gtm-systems','solo-operator'], ${clerkUserId})
    ON CONFLICT (email) DO UPDATE
    SET
      clerk_user_id = CASE
        WHEN newsletter_subscribers.clerk_user_id IS NULL
          OR newsletter_subscribers.clerk_user_id = ${clerkUserId}
        THEN ${clerkUserId}
        ELSE newsletter_subscribers.clerk_user_id
      END,
      status = 'active',
      unsub_at = NULL
  `;

  await sql`
    INSERT INTO portal_memberships (email, role)
    VALUES (${normalizedEmail}, 'free')
    ON CONFLICT (email, role) DO UPDATE
    SET status = 'active', updated_at = NOW()
  `;
}

export async function ensureMudikitMembership(sql: Sql, email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return;

  await ensurePortalMembershipsSchema(sql);

  await sql`
    INSERT INTO portal_memberships (email, role)
    VALUES (${normalizedEmail}, 'mudikit')
    ON CONFLICT (email, role) DO UPDATE
    SET status = 'active', updated_at = NOW()
  `;
}
