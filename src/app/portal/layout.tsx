import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { buildPortalAccess } from "@/lib/portal-access";
import { PortalShell } from "@/components/portal/portal-shell";

export const dynamic = "force-dynamic";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect("/sign-in?redirect_url=/portal");

  const user = await currentUser();
  if (!user) redirect("/sign-in?redirect_url=/portal");

  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) redirect("/sign-in?redirect_url=/portal");

  const sql = getDb();

  const subs = await sql`
    SELECT id, status, stripe_customer_id, clerk_user_id
    FROM subscribers WHERE email = ${email}
  `;
  const paidSub = subs[0];
  const isPaid = !!paidSub && paidSub.status === "active";

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
      {children}
    </PortalShell>
  );
}
