import { currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { ensureUsageAnalyticsSchema } from "@/lib/usage-analytics";

export const dynamic = "force-dynamic";
export const metadata = { title: "Recent Activity · Muditek" };

type Row = { event: string; path: string | null; resource_slug: string | null; created_at: string | Date };

export default async function PortalActivityPage() {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase() ?? "";
  let rows: Row[] = [];

  if (email) {
    try {
      const sql = getDb();
      await ensureUsageAnalyticsSchema(sql);
      rows = (await sql`
        SELECT event, path, resource_slug, created_at
        FROM portal_usage_events
        WHERE lower(email) = ${email}
        ORDER BY created_at DESC
        LIMIT 50
      `) as Row[];
    } catch (error) {
      console.error("portal activity unavailable", error);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <header className="border-b border-white/[0.07] pb-7">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Account history</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em]">Recent Activity</h1>
        <p className="mt-3 text-sm leading-6 text-foreground/60">Resource and download events attached to this account. Public anonymous browsing is not stored here.</p>
      </header>
      {rows.length > 0 ? (
        <ol className="divide-y divide-white/[0.07]">
          {rows.map((row, index) => (
            <li key={`${row.event}-${String(row.created_at)}-${index}`} className="grid gap-2 py-4 sm:grid-cols-[190px_1fr_auto] sm:items-center">
              <span className="text-xs font-medium capitalize text-foreground">{row.event.replaceAll("_", " ")}</span>
              <span className="truncate text-xs text-foreground/50">{row.resource_slug ?? row.path ?? "Workspace"}</span>
              <time className="text-[11px] text-foreground/45">{new Date(row.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</time>
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-7 rounded-xl border border-dashed border-white/[0.1] p-6 text-sm text-foreground/55">No activity has been recorded for this account.</div>
      )}
    </div>
  );
}
