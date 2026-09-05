import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { extname } from "node:path";
import { join } from "node:path";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { ColdEmailCapacityCalculator } from "@/components/cold-email-capacity-calculator";
import { NewsletterInline } from "@/components/newsletter-inline";
import { BOOK_PATH } from "@/lib/booking";
import { renderLibraryMarkdown } from "@/lib/library-markdown";
import { getPublicPlaybook, PUBLIC_PLAYBOOKS } from "@/lib/public-library";

export function generateStaticParams() {
  return PUBLIC_PLAYBOOKS.map((playbook) => ({ slug: playbook.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "outbound-failure-diagnostic") {
    return {
      title: "Outbound Failure Diagnostic | Muditek",
      alternates: { canonical: "https://muditek.com/revenue-leak-audit" },
    };
  }
  const playbook = getPublicPlaybook(slug);
  if (!playbook) return { title: "Playbook not found | Muditek" };
  const url = `https://muditek.com/playbooks/${playbook.slug}`;
  return {
    title: `${playbook.title} | Muditek`,
    description: playbook.summary,
    alternates: { canonical: url },
    openGraph: {
      title: playbook.title,
      description: playbook.summary,
      url,
      type: "article",
    },
  };
}

export default async function PublicPlaybookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "outbound-failure-diagnostic") permanentRedirect("/revenue-leak-audit");
  if (slug === "openclaw-outbound") permanentRedirect("/playbooks/google-maps-outbound");
  const playbook = getPublicPlaybook(slug);
  if (!playbook) notFound();

  let raw = "";
  const extension = extname(playbook.source).toLowerCase();
  if (extension === ".md") {
    try {
      raw = readFileSync(join(/* turbopackIgnore: true */ process.cwd(), playbook.source), "utf8");
    } catch {
      notFound();
    }
  }

  const { html, headings } = raw ? renderLibraryMarkdown(raw) : { html: "", headings: [] };
  const showCalculator = playbook.slug === "10000-cold-email-system";
  const url = `https://muditek.com/playbooks/${playbook.slug}`;
  const contentHref = `/api/library/playbooks/${encodeURIComponent(playbook.slug)}`;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: playbook.title,
            description: playbook.summary,
            datePublished: "2026-08-28",
            dateModified: "2026-08-28",
            publisher: { "@id": "https://muditek.com/#organization" },
            mainEntityOfPage: url,
            url,
            inLanguage: "en",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Library", item: "https://muditek.com/library" },
              { "@type": "ListItem", position: 2, name: "Playbooks", item: "https://muditek.com/playbooks" },
              { "@type": "ListItem", position: 3, name: playbook.title, item: url },
            ],
          },
        ]}
      />

      <main id="main-content">
        <header className="w-full">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12 pt-36 md:pt-48 pb-16 md:pb-20">
            <Link href="/playbooks" className="inline-flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-foreground transition-colors mb-8">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M9.5 6H2.5M5 3.5L2.5 6L5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              All resources
            </Link>
            <p className="text-base font-bold text-primary mb-6">Resource · {playbook.topic}</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.92] tracking-[-0.04em] text-balance max-w-[16ch]">
              {playbook.title}
            </h1>
            <p className="mt-7 max-w-[62ch] text-lg md:text-xl leading-relaxed text-foreground/75">{playbook.summary}</p>
            <p className="mt-7 text-sm text-foreground/60">Updated 28 August 2026</p>
          </div>
        </header>

        <section className="border-t border-white/[0.08] py-12 md:py-16">
          <div className="mx-auto w-full max-w-[1120px] px-6 md:px-12">
            {headings.length > 0 ? (
              <details className="mb-10 rounded-[4px] border border-white/[0.1] bg-card/40 p-5 md:p-6">
                <summary className="cursor-pointer text-sm font-black text-foreground">
                  On this page
                </summary>
                <ol className="mt-5 grid gap-3 border-t border-white/[0.08] pt-5 sm:grid-cols-2">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a href={`#${heading.id}`} className="inline-flex min-h-11 items-center text-sm leading-5 text-foreground/70 hover:text-primary">
                        {heading.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            ) : null}

            {showCalculator ? (
              <div className="mb-14">
                <ColdEmailCapacityCalculator />
              </div>
            ) : null}

            {extension === ".md" ? (
              <article className="library-prose [&_h2]:scroll-mt-28" dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <iframe
                src={contentHref}
                title={`${playbook.title} full playbook`}
                className="h-[78dvh] min-h-[680px] w-full rounded-[4px] border border-white/[0.08] bg-card"
                loading="lazy"
              />
            )}
          </div>
        </section>

        <NewsletterInline source={`playbook:${playbook.slug}`} headline="Get the next system before it is published." />

        <section className="border-t border-white/[0.08]">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12 py-20 md:py-28 text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-balance max-w-[18ch] mx-auto">Want Muditek to build this for you?</h2>
            <p className="mx-auto mt-5 max-w-[50ch] text-base md:text-lg leading-relaxed text-foreground/70">
              We scope the workflow, build the system, run it on real work, and hand it over as files you own.
            </p>
            <a href={BOOK_PATH} className="btn btn-solid mt-10">Book a call</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
