import { getDb } from "@/lib/db";
import { ensurePortalMembershipsSchema } from "@/lib/portal-memberships-schema";

type Sql = ReturnType<typeof getDb>;

export async function ensurePortalAccount({
  sql = getDb(),
  email,
  clerkUserId,
}: {
  sql?: Sql;
  email: string;
  clerkUserId: string;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !clerkUserId) return;

  await ensurePortalMembershipsSchema(sql);

  await sql`
    INSERT INTO portal_memberships (email, role)
    VALUES (${normalizedEmail}, 'free')
    ON CONFLICT (email, role) DO NOTHING
  `;
}
