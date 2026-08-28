import { getDb } from "@/lib/db";
import { sendFreeWelcomeEmail } from "@/lib/email-templates";
import { ensurePortalMembershipsSchema } from "@/lib/portal-memberships-schema";

type Sql = ReturnType<typeof getDb>;

export async function ensurePortalAccount({
  sql = getDb(),
  email,
  clerkUserId,
  name = null,
  source = "portal",
}: {
  sql?: Sql;
  email: string;
  clerkUserId: string;
  name?: string | null;
  source?: string;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !clerkUserId) return;

  await ensurePortalMembershipsSchema(sql);

  const inserted = await sql`
    INSERT INTO newsletter_subscribers (email, source, topics, clerk_user_id)
    VALUES (${normalizedEmail}, ${source}, ARRAY['ai-agents','gtm-systems','solo-operator'], ${clerkUserId})
    ON CONFLICT (email) DO NOTHING
    RETURNING id
  `;

  await sql`
    UPDATE newsletter_subscribers
    SET
      clerk_user_id = CASE
        WHEN clerk_user_id IS NULL OR clerk_user_id = ${clerkUserId}
        THEN ${clerkUserId}
        ELSE clerk_user_id
      END,
      status = 'active',
      unsub_at = NULL
    WHERE email = ${normalizedEmail}
  `;

  await sql`
    INSERT INTO portal_memberships (email, role)
    VALUES (${normalizedEmail}, 'free')
    ON CONFLICT (email, role) DO UPDATE
    SET status = 'active', updated_at = NOW()
  `;

  if (inserted.length > 0) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://muditek.com";
    try {
      await sendFreeWelcomeEmail(normalizedEmail, name, baseUrl);
    } catch (error) {
      console.error("portal-account: welcome email failed", error);
    }
  }
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
