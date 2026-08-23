import { auth, currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { ensurePortalAccount } from "@/lib/portal-account";
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
  await ensurePortalAccount({
    sql,
    email,
    clerkUserId: user.id,
  });

  const membershipRows = await sql`
    SELECT role FROM portal_memberships
    WHERE email = ${email} AND status = 'active'
  `;

  const access = buildPortalAccess({
    email,
    membershipRoles: membershipRows.map((row) => String(row.role)),
    hasActiveSubscription: false,
  });

  const displayName = user.firstName || email.split("@")[0];

  return (
    <PortalShell email={email} displayName={displayName} access={access}>
      <PortalUsageTracker />
      {children}
    </PortalShell>
  );
}
