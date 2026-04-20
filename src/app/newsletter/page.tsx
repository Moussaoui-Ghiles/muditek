import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Newsletter — MudiKit",
  description: "What I'm shipping, what's working, what's breaking. Every week.",
};

interface Issue {
  id: string;
  subject: string;
  slug: string;
  sent_at: string;
}

async function getIssues(): Promise<Issue[]> {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`
    SELECT id, subject, slug, sent_at
    FROM newsletter_issues
    WHERE status = 'sent'
    ORDER BY sent_at DESC
    LIMIT 200
  `;
  return rows as Issue[];
}

export default async function NewsletterIndex() {
  const issues = await getIssues();

  return (
    <main className="min-h-[100dvh] bg-[#0c0c0e] text-[#e8e8ec]">
      <section className="max-w-[720px] mx-auto px-6 sm:px-10 py-20">
        <p className="text-xs font-mono tracking-wider text-[#a0a0a6] mb-3 uppercase">
          MudiKit Newsletter
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          What I&apos;m shipping, what&apos;s working, what&apos;s breaking.
        </h1>
        <p className="text-lg text-[#a0a0a6] mb-8 max-w-[540px]">
          Weekly. Direct from me. Skills, systems, and wins from running an AI-native B2B business.
        </p>
        <Link
          href="/subscribe"
          className="inline-block px-6 py-3 bg-[#e8e8ec] text-[#0c0c0e] font-semibold rounded-lg hover:bg-white transition-colors"
        >
          Subscribe — free
        </Link>

        <div className="mt-16 border-t border-[#232326] pt-10">
          <h2 className="text-sm font-mono uppercase tracking-wider text-[#a0a0a6] mb-6">
            Recent issues
          </h2>
          {issues.length === 0 ? (
            <p className="text-sm text-[#636366]">No issues published yet.</p>
          ) : (
            <ul className="space-y-4">
              {issues.map((i) => (
                <li key={i.id} className="group">
                  <Link
                    href={`/newsletter/${i.slug}`}
                    className="flex items-baseline justify-between gap-6 py-3 border-b border-[#232326] hover:border-[#3a3a3e]"
                  >
                    <span className="text-base font-medium group-hover:text-white">
                      {i.subject}
                    </span>
                    <span className="text-xs font-mono text-[#636366] shrink-0">
                      {new Date(i.sent_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
