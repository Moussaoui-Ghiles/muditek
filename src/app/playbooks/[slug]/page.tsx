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
import { AssetEmailForm } from "@/components/asset-email-form";
import { BOOKING_URL } from "@/lib/booking";
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
        <header className="relative overflow-hidden border-b border-white/[0.06] pb-16 pt-36 md:pb-24 md:pt-48">
          <div aria-hidden="true" className="pointer-events-none absolute right-[10%] top-24 h-96 w-96 rounded-full bg-primary/[0.055] blur-[120px]" />
          <div className="relative mx-auto w-full max-w-[1080px] px-6 md:px-12">
            <Link href="/playbooks" className="text-sm font-bold uppercase tracking-[0.18em] text-foreground/55 hover:text-primary">
              ← All playbooks
            </Link>
            <p className="mt-10 text-sm font-black uppercase tracking-[0.2em] text-primary">{playbook.topic}</p>
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-7xl">
              {playbook.title}
            </h1>
            <p className="mt-8 max-w-[70ch] text-lg leading-8 text-foreground/70">{playbook.summary}</p>
            <p className="mt-7 text-sm font-mono text-foreground/50">Updated 28 August 2026</p>
          </div>
        </header>

        <section className="py-12 md:py-16">
          <div className="mx-auto w-full max-w-[1120px] px-6 md:px-12">
            {headings.length > 0 ? (
              <details className="mb-10 rounded-xl border border-white/[0.1] bg-card/30 p-5 md:p-6">
                <summary className="cursor-pointer text-sm font-black uppercase tracking-[0.14em] text-foreground">
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
                className="h-[78dvh] min-h-[680px] w-full rounded-xl border border-white/[0.08] bg-card"
                loading="lazy"
              />
            )}
          </div>
        </section>

        <section className="border-t border-white/[0.06] py-14">
          <div className="mx-auto w-full max-w-[900px] px-6 md:px-12">
            <h2 className="text-2xl font-black tracking-[-0.03em] md:text-3xl">Want this playbook in your inbox?</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-foreground/60">I will send you the link plus the systems I publish next.</p>
            <AssetEmailForm slug={playbook.slug} label="" className="mt-5 max-w-md" />
          </div>
        </section>

        <section className="border-t border-white/[0.06] py-16">
          <div className="mx-auto w-full max-w-[900px] px-6 text-center md:px-12">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Implementation</p>
            <h2 className="mt-5 text-3xl font-black tracking-[-0.03em] md:text-5xl">Want Muditek to build the system?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-foreground/65">
              We scope the workflow, build the operating system, and hand over the working implementation.
            </p>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[2px] bg-primary px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-background">
              Book a call
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
