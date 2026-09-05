import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { NewsletterInline } from "@/components/newsletter-inline";
import { TldrBox } from "@/components/tldr-box";
import { normalizePublicIssueHtml } from "@/lib/newsletter-html";

export const revalidate = 3600;

interface IssueStats {
  source?: string;
  beehiiv_id?: string;
  portal_article?: boolean | string;
  portalArticle?: boolean | string;
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

const RELATED: RelatedLink[] = [
  {
    href: "/library",
    tag: "Library",
    title: "The files behind this issue",
    body: "Skills, resources, and browser tools taken from the systems Muditek runs. Free with a portal account.",
  },
  {
    href: "/newsletter",
    tag: "Archive",
    title: "More selected issues",
    body: "Article-style issues, readable without an account.",
  },
];

async function getIssue(slug: string): Promise<Issue | null> {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`
    SELECT id, subject, slug, html, sent_at, updated_at, stats
    FROM newsletter_issues
    WHERE slug = ${slug}
      AND status = 'sent'
      AND html IS NOT NULL
      AND length(trim(html)) > 0
      AND (
        stats->>'portal_article' = 'true'
        OR stats->>'portalArticle' = 'true'
      )
    LIMIT 1
  `;
  return (rows[0] as Issue) ?? null;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getIssue(slug);
  if (!issue) return { title: "Not found | Muditek" };
  const desc = issue.stats?.tldr || issue.stats?.preview || issue.subject;
  const url = `https://muditek.com/newsletter/${slug}`;
  return {
    title: `${issue.subject} | Muditek Newsletter`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: issue.subject,
      description: desc,
      url,
      type: "article",
      publishedTime: issue.sent_at,
      images: [`${url}/opengraph-image`],
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
      image: `${url}/opengraph-image`,
      url,
      isPartOf: { "@id": "https://muditek.com/#website" },
      inLanguage: "en",
      articleSection: "Newsletter",
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
    <div className="min-h-[100dvh] bg-background text-foreground">
      <JsonLd data={schemas} />
      <Navbar />
      <main className="max-w-[760px] mx-auto px-6 sm:px-10 pt-36 md:pt-44 pb-20">
        <Link href="/newsletter" className="inline-flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-foreground transition-colors">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M9.5 6H2.5M5 3.5L2.5 6L5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          The newsletter
        </Link>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.04em] leading-[0.95] text-balance mt-8 mb-5">
          {issue.subject}
        </h1>
        <p className="text-sm text-foreground/60 mb-8">
          Published{" "}
          {new Date(issue.sent_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          {issue.updated_at ? (
            <>
              {" "}· Updated{" "}
              {new Date(issue.updated_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </>
          ) : null}
        </p>
        <div className="flex items-center gap-3 mb-10 pb-8 border-b border-white/[0.08]">
          <Image
            src="/images/ghiles.jpg"
            alt="Ghiles Moussaoui"
            width={36}
            height={36}
            className="rounded-full border border-white/[0.1] shrink-0"
          />
          <div className="text-sm text-foreground/70 leading-tight">
            <span className="text-foreground font-bold">Ghiles Moussaoui</span>
            <span className="mx-2 text-foreground/40">·</span>
            <span>Founder, Muditek</span>
            <span className="mx-2 text-foreground/40">·</span>
            <a
              href="https://www.linkedin.com/in/ghiles-moussaoui-b36218250/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/30 underline-offset-4 hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <TldrBox tldr={issue.stats?.tldr} />
        <article
          className="bg-white text-black rounded-[4px] overflow-hidden"
          dangerouslySetInnerHTML={{ __html: normalizePublicIssueHtml(issue.html) }}
        />

        <div className="mt-16 pt-10 border-t border-white/[0.08]">
          <p className="text-base font-bold text-primary mb-6">Keep going</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
            {RELATED.map((r) => (
              <Link key={r.href} href={r.href} className="group block border-t border-white/[0.08] pt-5">
                <p className="text-sm text-primary font-bold mb-2">{r.tag}</p>
                <h3 className="text-xl font-black tracking-[-0.02em] text-foreground group-hover:text-primary transition-colors mb-2 leading-tight">{r.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{r.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <NewsletterInline source={`issue:${issue.slug}`} headline="Get the next one in your inbox." />
      <Footer />
    </div>
  );
}
