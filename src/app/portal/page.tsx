import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
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

export default async function PortalPage() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect("/sign-in");
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) redirect("/sign-in");

  const sql = getDb();
  const subs = await sql`SELECT id, email, name, status, stripe_customer_id, clerk_user_id, created_at FROM subscribers WHERE email = ${email}`;
  const sub = subs[0];

  if (sub && !sub.clerk_user_id) {
    await sql`UPDATE subscribers SET clerk_user_id = ${user.id} WHERE id = ${sub.id}`;
  }

  if (!sub || sub.status !== "active") {
    return (
      <main className="min-h-[100dvh] bg-[#0c0c0e] text-[#e8e8ec] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-3">Unlock MudiKit</h1>
          <p className="text-[#a0a0a6] mb-8">Subscribe to access skills, playbooks, templates. New content monthly.</p>
          <Link href="/buy" className="inline-block px-8 py-4 bg-[#e8e8ec] text-[#0c0c0e] font-bold rounded-lg hover:bg-white active:scale-[0.98] transition-all duration-150 text-lg">
            Subscribe — $47/mo
          </Link>
          <p className="text-sm text-[#636366] mt-4">Cancel anytime.</p>
        </div>
      </main>
    );
  }

  const items = (await sql`SELECT id, title, slug, description, category, download_url, file_type, is_new, created_at FROM content_items ORDER BY created_at DESC`) as ContentItem[];

  return (
    <PortalContent
      items={items}
      displayName={user.firstName || sub.name || email.split("@")[0]}
      email={email}
      memberSince={sub.created_at}
      stripeCustomerId={sub.stripe_customer_id}
    />
  );
}
