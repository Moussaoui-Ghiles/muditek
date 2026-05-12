import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { buildPortalAccess } from "@/lib/portal-access";
import AccountContent from "./account-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Account · Muditek Portal",
};

export default async function PortalAccountPage() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect("/sign-in?redirect_url=/portal/account");

  const user = await currentUser();
  if (!user) redirect("/sign-in?redirect_url=/portal/account");

  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) redirect("/sign-in?redirect_url=/portal/account");

  const sql = getDb();
  const subs = await sql`
    SELECT id, status, stripe_customer_id, created_at
    FROM subscribers WHERE email = ${email}
  `;
  const paidSub = subs[0];
  const isPaid = !!paidSub && paidSub.status === "active";
  const stripeCustomerId = (paidSub?.stripe_customer_id as string | null | undefined) ?? null;
  const memberSince = paidSub?.created_at
    ? new Date(paidSub.created_at as string | Date).toISOString()
    : null;

  const membershipRows = await sql`
    SELECT role FROM portal_memberships
    WHERE email = ${email} AND status = 'active'
  `;

  const access = buildPortalAccess({
    email,
    membershipRoles: membershipRows.map((row) => String(row.role)),
    hasActiveSubscription: isPaid,
  });

  const displayName = user.firstName || email.split("@")[0];

  return (
    <AccountContent
      email={email}
      displayName={displayName}
      access={access}
      stripeCustomerId={stripeCustomerId}
      memberSinceIso={memberSince}
    />
  );
}
