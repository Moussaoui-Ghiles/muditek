import Link from "next/link";
import { notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Issue {
  id: string;
  subject: string;
  slug: string;
  html: string;
  sent_at: string;
}

async function getIssue(slug: string): Promise<Issue | null> {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`
    SELECT id, subject, slug, html, sent_at
    FROM newsletter_issues
    WHERE slug = ${slug} AND status = 'sent'
    LIMIT 1
  `;
  return (rows[0] as Issue) ?? null;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getIssue(slug);
  if (!issue) return { title: "Not found — MudiKit" };
  return {
    title: `${issue.subject} — MudiKit`,
    description: issue.subject,
    openGraph: {
      title: issue.subject,
      description: issue.subject,
      type: "article",
      publishedTime: issue.sent_at,
    },
  };
}

export default async function IssuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const issue = await getIssue(slug);
  if (!issue) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: issue.subject,
    datePublished: issue.sent_at,
    author: { "@type": "Person", name: "Ghiles Moussaoui" },
  };

  return (
    <main className="min-h-[100dvh] bg-[#0c0c0e] text-[#e8e8ec]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="max-w-[680px] mx-auto px-6 sm:px-10 py-16">
        <Link href="/newsletter" className="text-xs font-mono uppercase tracking-wider text-[#a0a0a6] hover:text-[#e8e8ec]">
          ← MudiKit Newsletter
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-6 mb-3">
          {issue.subject}
        </h1>
        <p className="text-sm text-[#636366] font-mono mb-10">
          {new Date(issue.sent_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <article
          className="bg-white text-black rounded-lg overflow-hidden"
          dangerouslySetInnerHTML={{ __html: issue.html }}
        />
        <div className="mt-12 pt-8 border-t border-[#232326] text-center">
          <p className="text-[#a0a0a6] mb-4">Want these weekly?</p>
          <Link
            href="/subscribe"
            className="inline-block px-6 py-3 bg-[#e8e8ec] text-[#0c0c0e] font-semibold rounded-lg hover:bg-white"
          >
            Subscribe — free
          </Link>
        </div>
      </section>
    </main>
  );
}
