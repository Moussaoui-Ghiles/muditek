import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getOrCreatePreferenceHref } from "@/lib/newsletter-preferences";
import { buildPortalAccess } from "@/lib/portal-access";
import { ensureResourceLeadSchema } from "@/lib/resource-leads";
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
  await ensureResourceLeadSchema(sql);

  const subs = await sql`
    SELECT id, status, stripe_customer_id, current_period_end, created_at
    FROM subscribers WHERE email = ${email}
  `;
  const paidSub = subs[0];
  const isPaid = !!paidSub && paidSub.status === "active";
  const stripeCustomerId = (paidSub?.stripe_customer_id as string | null | undefined) ?? null;
  const subscriptionStatus = (paidSub?.status as string | null | undefined) ?? null;
  const currentPeriodEnd = paidSub?.current_period_end
    ? new Date(paidSub.current_period_end as string | Date).toISOString()
    : null;
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
  const preferencesHref = await getOrCreatePreferenceHref({
    email,
    clerkUserId: user.id,
    sql,
  });

  const newsletterRows = await sql`
    SELECT status, source, topics, subscribed_at, unsub_at
    FROM newsletter_subscribers
    WHERE email = ${email}
    LIMIT 1
  `;
  const newsletter = newsletterRows[0] ?? null;

  const resourceRows = await sql`
    SELECT
      rl.resource_slug,
      rl.created_at,
      rl.last_seen_at,
      ci.title AS resource_title,
      ci.category AS resource_category
    FROM resource_leads rl
    LEFT JOIN content_items ci ON ci.slug = rl.resource_slug
    WHERE lower(rl.email) = ${email}
    ORDER BY rl.last_seen_at DESC
    LIMIT 5
  `;

  const resourceCountRows = await sql`
    SELECT COUNT(*)::int AS count
    FROM resource_leads
    WHERE lower(email) = ${email}
  `;

  const displayName = user.firstName || email.split("@")[0];

  return (
    <AccountContent
      email={email}
      displayName={displayName}
      access={access}
      roles={membershipRows.map((row) => String(row.role))}
      stripeCustomerId={stripeCustomerId}
      subscriptionStatus={subscriptionStatus}
      currentPeriodEndIso={currentPeriodEnd}
      memberSinceIso={memberSince}
      preferencesHref={preferencesHref}
      newsletter={
        newsletter
          ? {
              status: String(newsletter.status ?? ""),
              source: String(newsletter.source ?? ""),
              topics: Array.isArray(newsletter.topics)
                ? newsletter.topics.map((topic: unknown) => String(topic))
                : [],
              subscribedAtIso: newsletter.subscribed_at
                ? new Date(newsletter.subscribed_at as string | Date).toISOString()
                : null,
              unsubscribedAtIso: newsletter.unsub_at
                ? new Date(newsletter.unsub_at as string | Date).toISOString()
                : null,
            }
          : null
      }
      resourceUnlockCount={Number(resourceCountRows[0]?.count ?? 0)}
      resourceUnlocks={resourceRows.map((row) => ({
        slug: String(row.resource_slug),
        title: row.resource_title ? String(row.resource_title) : null,
        category: row.resource_category ? String(row.resource_category) : null,
        createdAtIso: row.created_at ? new Date(row.created_at as string | Date).toISOString() : null,
        lastSeenAtIso: row.last_seen_at ? new Date(row.last_seen_at as string | Date).toISOString() : null,
      }))}
    />
  );
}
