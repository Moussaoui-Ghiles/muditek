import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Account · Muditek" };

export default async function PortalAccountPage() {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase() ?? "";
  let roles: string[] = [];

  if (email) {
    try {
      const sql = getDb();
      const rows = await sql`SELECT role FROM portal_memberships WHERE email = ${email} AND status = 'active'`;
      roles = rows.map((row) => String(row.role));
    } catch (error) {
      console.error("portal account memberships unavailable", error);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <header className="border-b border-white/[0.07] pb-7">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Identity and access</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em]">Account</h1>
      </header>
      <section className="mt-8 rounded-xl bg-white/[0.035] p-6">
        <dl className="grid gap-5 sm:grid-cols-[180px_1fr]">
          <dt className="text-xs font-semibold text-foreground/50">Name</dt>
          <dd className="text-sm text-foreground">{user?.fullName ?? user?.firstName ?? "—"}</dd>
          <dt className="text-xs font-semibold text-foreground/50">Email</dt>
          <dd className="text-sm text-foreground">{email}</dd>
          <dt className="text-xs font-semibold text-foreground/50">Membership</dt>
          <dd className="text-sm capitalize text-foreground">{roles.length > 0 ? roles.join(", ") : "Free"}</dd>
        </dl>
        <p className="mt-7 border-t border-white/[0.07] pt-5 text-xs leading-5 text-foreground/50">Use the account menu in the sidebar to manage your identity or sign out. Newsletter consent is managed separately.</p>
        <Link href="/portal/newsletter" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-white/[0.1] px-5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Newsletter preferences</Link>
      </section>
    </div>
  );
}
