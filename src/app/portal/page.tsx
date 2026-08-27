import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { getPublishedLibraryItems } from "@/lib/library-manifest";
import { ensureUsageAnalyticsSchema } from "@/lib/usage-analytics";

export const dynamic = "force-dynamic";
export const metadata = { title: "Workspace · Muditek" };

type ActivityRow = {
  event: string;
  resource_slug: string | null;
  created_at: string | Date;
};

function eventLabel(event: string) {
  if (event === "skill_downloaded") return "Downloaded skill";
  if (event === "skill_viewed") return "Viewed skill";
  if (event === "resource_downloaded") return "Downloaded resource";
  return event.replaceAll("_", " ");
}

function updatedLabel(updatedAt: string) {
  const date = new Date(`${updatedAt}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return updatedAt;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export default async function PortalHomePage() {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase() ?? "";
  const advancedSkills = getPublishedLibraryItems("skill").filter((item) => item.access === "account");
  let activity: ActivityRow[] = [];

  if (email) {
    try {
      const sql = getDb();
      await ensureUsageAnalyticsSchema(sql);
      activity = (await sql`
        SELECT event, resource_slug, created_at
        FROM portal_usage_events
        WHERE lower(email) = ${email}
        ORDER BY created_at DESC
        LIMIT 5
      `) as ActivityRow[];
    } catch (error) {
      console.error("portal: recent activity unavailable", error);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <header className="border-b border-white/[0.07] pb-7">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Member workspace</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-foreground">Skills, downloads, and account settings.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/65">Download advanced skill files, check recent activity, and manage your account. Public reading and browser tools remain in the library.</p>
      </header>

      <nav className="grid gap-px border-b border-white/[0.07] bg-white/[0.07] py-px sm:grid-cols-2 lg:grid-cols-5" aria-label="Workspace sections">
        {[
          ["Advanced Skills", "/portal/skills"],
          ["Recent Activity", "/portal/activity"],
          ["Downloads and Versions", "/portal/downloads"],
          ["Newsletter Preferences", "/portal/newsletter"],
          ["Account", "/portal/account"],
        ].map(([label, href]) => (
          <Link key={href} href={href} className="inline-flex min-h-12 items-center justify-between bg-background px-4 text-sm font-medium text-foreground/70 transition-colors hover:bg-white/[0.025] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary">
            {label}<span aria-hidden="true" className="text-primary">→</span>
          </Link>
        ))}
      </nav>

      <div className="grid gap-8 pt-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section id="advanced-skills" aria-labelledby="advanced-skills-title">
          <div className="flex items-center justify-between gap-4">
            <h2 id="advanced-skills-title" className="text-lg font-semibold text-foreground">Advanced Skills</h2>
            <Link href="/portal/skills" className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">View all</Link>
          </div>
          <div className="mt-4 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {advancedSkills.slice(0, 6).map((skill) => (
              <Link key={skill.slug} href={`/skills/${skill.slug}`} className="grid gap-1 py-4 transition-colors hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:grid-cols-[1fr_auto] sm:items-center">
                <span><strong className="block text-sm font-medium text-foreground">{skill.title}</strong><span className="mt-1 block text-xs leading-5 text-foreground/50">{skill.summary}</span></span>
                <span className="text-xs text-foreground/50">Updated {updatedLabel(skill.updatedAt)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section id="recent-activity" aria-labelledby="recent-activity-title">
          <div className="flex items-center justify-between gap-4">
            <h2 id="recent-activity-title" className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <Link href="/portal/activity" className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">View all</Link>
          </div>
          {activity.length > 0 ? (
            <ol className="mt-4 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {activity.map((row, index) => (
                <li key={`${row.event}-${String(row.created_at)}-${index}`} className="py-4">
                  <p className="text-sm font-medium capitalize text-foreground">{eventLabel(row.event)}</p>
                  <p className="mt-1 text-xs text-foreground/50">{row.resource_slug ?? "Workspace"} · {new Date(row.created_at).toLocaleDateString("en-GB", { dateStyle: "medium" })}</p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-white/[0.1] p-5 text-sm leading-6 text-foreground/55">No recorded activity yet. Downloads will appear here after you use an advanced bundle.</div>
          )}
        </section>
      </div>
    </div>
  );
}
