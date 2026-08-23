import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { getOrCreatePreferenceHref } from "@/lib/newsletter-preferences";

export const dynamic = "force-dynamic";
export const metadata = { title: "Newsletter Preferences · Muditek" };

export default async function PortalNewsletterPage() {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase() ?? "";
  let status: string | null = null;
  let preferencesHref: string | null = null;

  if (email && user) {
    try {
      const sql = getDb();
      const rows = await sql`SELECT status FROM newsletter_subscribers WHERE email = ${email} LIMIT 1`;
      status = rows[0]?.status ? String(rows[0].status) : null;
      if (rows.length > 0) {
        preferencesHref = await getOrCreatePreferenceHref({ email, clerkUserId: user.id, sql });
      }
    } catch (error) {
      console.error("newsletter preferences unavailable", error);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <header className="border-b border-white/[0.07] pb-7">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Separate consent</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em]">Newsletter Preferences</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/60">Your portal membership does not create or reactivate a newsletter subscription.</p>
      </header>
      <section className="mt-8 rounded-xl bg-white/[0.035] p-6">
        <dl className="grid gap-5 sm:grid-cols-[180px_1fr]">
          <dt className="text-xs font-semibold text-foreground/50">Account email</dt>
          <dd className="text-sm text-foreground">{email}</dd>
          <dt className="text-xs font-semibold text-foreground/50">Newsletter status</dt>
          <dd className="text-sm capitalize text-foreground">{status ?? "Not subscribed"}</dd>
        </dl>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          {preferencesHref ? (
            <Link href={preferencesHref} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-xs font-semibold text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground">Manage preferences</Link>
          ) : (
            <Link href="/newsletter" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-xs font-semibold text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground">Open newsletter signup</Link>
          )}
          <Link href="/newsletter" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/[0.1] px-5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Read public archive</Link>
        </div>
      </section>
    </div>
  );
}
