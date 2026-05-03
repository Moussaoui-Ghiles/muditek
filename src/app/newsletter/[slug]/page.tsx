import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { TldrBox } from "@/components/tldr-box";

export const dynamic = "force-dynamic";

interface IssueStats {
  source?: string;
  beehiiv_id?: string;
  preview?: string | null;
  tldr?: string | null;
}

interface Issue {
  id: string;
  subject: string;
  slug: string;
  html: string;
  sent_at: string;
  updated_at: string | null;
  stats: IssueStats | null;
}

type RelatedLink = { href: string; tag: string; title: string; body: string };

const RELATED_BUY: RelatedLink = {
  href: "/buy",
  tag: "MudiKit",
  title: "Get the operator library — $47/mo",
  body: "Skills, playbooks, vault template, outreach templates. New drops monthly.",
};

const RELATED_NEWSLETTER_ARCHIVE: RelatedLink = {
  href: "/newsletter",
  tag: "Archive",
  title: "Browse every issue",
  body: "All past systems, indexed and searchable.",
};

const RELATED_REVENUE_LEAK: RelatedLink = {
  href: "/revenue-leak-audit",
  tag: "Diagnostic",
  title: "Find your revenue leaks",
  body: "We quantify B2B SaaS pipeline leakage in euros. €50K guarantee.",
};

const RELATED_MUDIAGENT: RelatedLink = {
  href: "/mudiagent",
  tag: "Build",
  title: "Deploy mudiAgent on-prem",
  body: "Digital employees that automate operations. 40-hour guarantee.",
};

const RELATED_PE_OPS: RelatedLink = {
  href: "/pe-ops",
  tag: "PE Ops",
  title: "Operational infrastructure for investment firms",
  body: "Custom-built. Investor onboarding in 3-5 days. KYC automated.",
};

function pickRelated(subject: string): [RelatedLink, RelatedLink] {
  const s = subject.toLowerCase();
  const hasOutbound =
    /\b(outbound|lead\b|leads|sdr|cold[- ]?email|sales)\b/.test(s);
  const hasAgent = /\b(agent|agents|claude|automation|automations)\b/.test(s);
  const hasPe = /\b(pe\b|investor|investors|fund\b|funds|private equity|kyc)\b/.test(s);

  if (hasPe) return [RELATED_PE_OPS, RELATED_BUY];
  if (hasOutbound) return [RELATED_REVENUE_LEAK, RELATED_BUY];
  if (hasAgent) return [RELATED_MUDIAGENT, RELATED_BUY];
  return [RELATED_BUY, RELATED_NEWSLETTER_ARCHIVE];
}

async function getIssue(slug: string): Promise<Issue | null> {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`
    SELECT id, subject, slug, html, sent_at, updated_at, stats
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
  if (!issue) return { title: "Not found — Muditek" };
  const desc = issue.stats?.tldr || issue.stats?.preview || issue.subject;
  return {
    title: `${issue.subject} — Muditek Newsletter`,
    description: desc,
    openGraph: {
      title: issue.subject,
      description: desc,
      type: "article",
      publishedTime: issue.sent_at,
      images: ["https://muditek.com/images/ghiles.jpg"],
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

  const url = `https://muditek.com/newsletter/${issue.slug}`;
  const description =
    issue.stats?.tldr || issue.stats?.preview || issue.subject;
  const related = pickRelated(issue.subject);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: issue.subject,
      description,
      datePublished: issue.sent_at,
      dateModified: issue.updated_at || issue.sent_at,
      author: {
        "@type": "Person",
        "@id": "https://muditek.com/#ghiles",
        name: "Ghiles Moussaoui",
        url: "https://muditek.com/about",
      },
      publisher: { "@id": "https://muditek.com/#organization" },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      image: "https://muditek.com/images/ghiles.jpg",
      url,
      isPartOf: { "@id": "https://muditek.com/#website" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://muditek.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Newsletter",
          item: "https://muditek.com/newsletter",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: issue.subject,
          item: url,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": url,
      url,
      name: issue.subject,
      isPartOf: { "@id": "https://muditek.com/#website" },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "[data-speakable='tldr']"],
      },
    },
  ];

  return (
    <main className="min-h-[100dvh] bg-[#0c0c0e] text-[#e8e8ec]">
      <JsonLd data={schemas} />
      <section className="max-w-[680px] mx-auto px-6 sm:px-10 py-16">
        <Link href="/newsletter" className="text-xs font-mono uppercase tracking-wider text-[#a0a0a6] hover:text-[#e8e8ec]">
          ← Muditek Newsletter
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-6 mb-3">
          {issue.subject}
        </h1>
        <p className="text-sm text-[#636366] font-mono mb-6">
          Updated{" "}
          {new Date(issue.updated_at || issue.sent_at).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}{" "}
          · Published{" "}
          {new Date(issue.sent_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-[#232326]">
          <Image
            src="/images/ghiles.jpg"
            alt="Ghiles Moussaoui"
            width={32}
            height={32}
            className="rounded-full border border-[#232326] shrink-0"
          />
          <div className="text-sm text-[#a0a0a6] leading-tight">
            <span className="text-[#e8e8ec] font-medium">By Ghiles Moussaoui</span>
            <span className="mx-2 text-[#636366]">·</span>
            <span>Founder, Muditek</span>
            <span className="mx-2 text-[#636366]">·</span>
            <a
              href="https://www.linkedin.com/in/ghiles-moussaoui-b36218250/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[#636366] underline-offset-4 hover:text-[#e8e8ec] hover:decoration-[#e8e8ec] transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <TldrBox tldr={issue.stats?.tldr} />
        <article
          className="bg-white text-black rounded-lg overflow-hidden"
          dangerouslySetInnerHTML={{ __html: issue.html }}
        />

        <div className="mt-14 pt-10 border-t border-[#232326]">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#636366] mb-5">
            Related
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group block border border-[#232326] hover:border-[#3a3a3e] bg-[#151517] hover:bg-[#1a1a1d] rounded-lg p-5 transition-colors"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#a0a0a6] group-hover:text-[#e8e8ec] mb-2 transition-colors">
                  {r.tag}
                </p>
                <h3 className="text-base font-bold text-[#e8e8ec] mb-1 leading-tight flex items-center gap-2">
                  {r.title}
                  <span
                    aria-hidden
                    className="text-[#636366] group-hover:text-[#e8e8ec] group-hover:translate-x-0.5 transition-all"
                  >
                    →
                  </span>
                </h3>
                <p className="text-sm text-[#a0a0a6] leading-relaxed">
                  {r.body}
                </p>
              </Link>
            ))}
          </div>
        </div>

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
