import { auth, currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { ensureMudikitMembership, ensurePortalAccount } from "@/lib/portal-account";
import { buildPortalAccess } from "@/lib/portal-access";
import { PortalShell } from "@/components/portal/portal-shell";
import { PortalUsageTracker } from "@/components/portal/portal-usage-tracker";

export const dynamic = "force-dynamic";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) return children;

  const user = await currentUser();
  if (!user) return children;

  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) return children;

  const sql = getDb();
  await ensurePortalAccount({ sql, email, clerkUserId: user.id });

  const subs = await sql`
    SELECT id, email, name, status, stripe_customer_id, clerk_user_id
    FROM subscribers WHERE email = ${email}
  `;
  const paidSub = subs[0];
  const isPaid = !!paidSub && paidSub.status === "active";

  if (paidSub && !paidSub.clerk_user_id) {
    await sql`UPDATE subscribers SET clerk_user_id = ${user.id} WHERE id = ${paidSub.id}`;
  }

  if (isPaid) {
    await ensureMudikitMembership(sql, email);
  }

  const membershipRows = await sql`
    SELECT role FROM portal_memberships
    WHERE email = ${email} AND status = 'active'
  `;

  const access = buildPortalAccess({
    email,
    membershipRoles: membershipRows.map((row) => String(row.role)),
    hasActiveSubscription: isPaid,
  });

  const displayName = user.firstName || (paidSub?.name as string | undefined) || email.split("@")[0];

  return (
    <PortalShell email={email} displayName={displayName} access={access}>
      <PortalUsageTracker />
      {children}
    </PortalShell>
  );
}
