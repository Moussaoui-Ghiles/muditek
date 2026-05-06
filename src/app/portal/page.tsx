import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { buildPortalAccess } from "@/lib/portal-access";
import PortalContent from "./portal-content";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  download_url: string;
  file_type: string;
  is_new: boolean;
  is_free: boolean;
  created_at: string;
}

interface NewsletterIssue {
  slug: string;
  subject: string;
  sent_at: Date | null;
}

export default async function PortalPage() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect("/sign-in?redirect_url=/portal");
  const user = await currentUser();
  if (!user) redirect("/sign-in?redirect_url=/portal");
  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) redirect("/sign-in?redirect_url=/portal");

  const sql = getDb();

  await sql`
    INSERT INTO newsletter_subscribers (email, source, topics, clerk_user_id)
    VALUES (${email}, 'portal', ARRAY['ai-agents','gtm-systems','solo-operator'], ${user.id})
    ON CONFLICT (email) DO UPDATE
    SET clerk_user_id = ${user.id}, status = 'active', unsub_at = NULL
    WHERE newsletter_subscribers.clerk_user_id IS NULL OR newsletter_subscribers.clerk_user_id = ${user.id}
  `;

  await sql`
    INSERT INTO portal_memberships (email, role)
    VALUES (${email}, 'free')
    ON CONFLICT (email, role) DO UPDATE
    SET status = 'active', updated_at = NOW()
  `;

  const subs = await sql`
    SELECT id, email, name, status, stripe_customer_id, clerk_user_id, created_at
    FROM subscribers WHERE email = ${email}
  `;
  const paidSub = subs[0];

  if (paidSub && !paidSub.clerk_user_id) {
    await sql`UPDATE subscribers SET clerk_user_id = ${user.id} WHERE id = ${paidSub.id}`;
  }

  const isPaid = !!paidSub && paidSub.status === "active";

  if (isPaid) {
    await sql`
      INSERT INTO portal_memberships (email, role)
      VALUES (${email}, 'mudikit')
      ON CONFLICT (email, role) DO UPDATE
      SET status = 'active', updated_at = NOW()
    `;
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

  const freeItems = (await sql`
    SELECT id, title, slug, description, category, download_url, file_type, is_new, is_free, created_at
    FROM content_items
    WHERE is_free = true
    ORDER BY created_at DESC
  `) as ContentItem[];

  const paidItems = isPaid
    ? ((await sql`
        SELECT id, title, slug, description, category, download_url, file_type, is_new, is_free, created_at
        FROM content_items
        WHERE is_free = false
        ORDER BY created_at DESC
      `) as ContentItem[])
    : [];

  const issues = (await sql`
    SELECT slug, subject, sent_at
    FROM newsletter_issues
    WHERE status = 'sent' AND slug IS NOT NULL
    ORDER BY sent_at DESC NULLS LAST
    LIMIT 40
  `) as NewsletterIssue[];

  return (
    <PortalContent
      displayName={user.firstName || (paidSub?.name as string | undefined) || email.split("@")[0]}
      email={email}
      access={access}
      freeItems={freeItems}
      paidItems={paidItems}
      issues={issues}
      stripeCustomerId={paidSub?.stripe_customer_id as string | null | undefined}
    />
  );
}
