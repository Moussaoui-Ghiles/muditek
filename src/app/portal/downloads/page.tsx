import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { getPublishedLibraryItems } from "@/lib/library-manifest";
import { ensureUsageAnalyticsSchema } from "@/lib/usage-analytics";

export const dynamic = "force-dynamic";
export const metadata = { title: "Downloads and Versions · Muditek" };

type DownloadRow = { resource_slug: string; downloaded_at: string | Date };

export default async function PortalDownloadsPage() {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase() ?? "";
  const skills = getPublishedLibraryItems("skill").filter((item) => item.access === "account");
  let rows: DownloadRow[] = [];

  if (email) {
    try {
      const sql = getDb();
      await ensureUsageAnalyticsSchema(sql);
      rows = (await sql`
        SELECT resource_slug, MAX(created_at) AS downloaded_at
        FROM portal_usage_events
        WHERE lower(email) = ${email} AND event = 'skill_downloaded' AND resource_slug IS NOT NULL
        GROUP BY resource_slug
      `) as DownloadRow[];
    } catch (error) {
      console.error("portal downloads unavailable", error);
    }
  }

  const downloadedAt = new Map(rows.map((row) => [row.resource_slug, row.downloaded_at]));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <header className="border-b border-white/[0.07] pb-7">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Bundle record</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em]">Downloads and Versions</h1>
        <p className="mt-3 text-sm leading-6 text-foreground/60">The manifest date is the published version. Download records show the latest account-linked download.</p>
      </header>
      <div className="divide-y divide-white/[0.07]">
        {skills.map((skill) => {
          const lastDownload = downloadedAt.get(skill.slug);
          return (
            <div key={skill.slug} className="grid gap-3 py-5 sm:grid-cols-[1fr_150px_180px_auto] sm:items-center">
              <span className="text-sm font-medium text-foreground">{skill.title}</span>
              <span className="text-xs text-foreground/50">Version {skill.updatedAt}</span>
              <span className="text-xs text-foreground/50">{lastDownload ? `Downloaded ${new Date(lastDownload).toLocaleDateString("en-GB")}` : "Not downloaded"}</span>
              <Link href={`/skills/${skill.slug}`} className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Open bundle</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
