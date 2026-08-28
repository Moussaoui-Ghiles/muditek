import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { buildPortalAccess } from "@/lib/portal-access";
import ToolsContent from "./tools-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tools · Muditek Portal",
  description:
    "Live calculators, lead finders, and operating workbenches attached to your Muditek portal account.",
};

export default async function PortalToolsPage() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect("/sign-in?redirect_url=/portal/tools");
  const user = await currentUser();
  if (!user) redirect("/sign-in?redirect_url=/portal/tools");
  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) redirect("/sign-in?redirect_url=/portal/tools");

  const sql = getDb();

  const subs = await sql`
    SELECT id, status, stripe_customer_id
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

  const displayName = user.firstName || email.split("@")[0];

  return <ToolsContent access={access} email={email} displayName={displayName} />;
}
