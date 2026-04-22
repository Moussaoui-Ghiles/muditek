import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
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
  created_at: string;
}

interface NewsletterIssue {
  slug: string;
  title: string;
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
    UPDATE newsletter_subscribers
    SET clerk_user_id = ${user.id}, status = 'active', unsub_at = NULL
    WHERE email = ${email} AND (clerk_user_id IS NULL OR clerk_user_id = ${user.id})
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

  const paidItems = isPaid
    ? ((await sql`
        SELECT id, title, slug, description, category, download_url, file_type, is_new, created_at
        FROM content_items ORDER BY created_at DESC
      `) as ContentItem[])
    : [];

  const issues = (await sql`
    SELECT slug, title, sent_at
    FROM newsletter_issues
    WHERE status = 'sent' AND slug IS NOT NULL
    ORDER BY sent_at DESC NULLS LAST
    LIMIT 20
  `) as NewsletterIssue[];

  return (
    <PortalContent
      displayName={user.firstName || (paidSub?.name as string | undefined) || email.split("@")[0]}
      email={email}
      isPaid={isPaid}
      paidItems={paidItems}
      issues={issues}
      stripeCustomerId={paidSub?.stripe_customer_id as string | null | undefined}
    />
  );
}
