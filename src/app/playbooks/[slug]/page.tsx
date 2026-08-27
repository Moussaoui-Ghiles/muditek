import type { Metadata } from "next";
import { readFileSync } from "fs";
import { extname, join } from "path";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { AcquisitionPageView } from "@/components/acquisition-tracking";
import { CommercialNextStep } from "@/components/library/library-collection";
import { formatLibraryDate, getLibraryItem, getPublishedLibraryItems } from "@/lib/library-manifest";
import { renderLibraryMarkdown, type ArticleHeading } from "@/lib/library-markdown";

export function generateStaticParams() {
  return getPublishedLibraryItems("playbook").map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getLibraryItem("playbook", slug);
  if (!item || item.status !== "published") return { title: "Playbook not found | Muditek" };
  const url = `https://muditek.com/playbooks/${item.slug}`;
  return {
    title: `${item.title} | Muditek Playbook`,
    description: item.summary,
    alternates: { canonical: url },
    openGraph: { title: item.title, description: item.summary, url, type: "article" },
  };
}

export default async function PlaybookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getLibraryItem("playbook", slug);
  if (!item) notFound();
  if (item.status === "redirected" && item.redirectTarget) permanentRedirect(item.redirectTarget);
  if (item.status !== "published") notFound();

  const extension = extname(item.source).toLowerCase();
  let markdownHtml = "";
  let headings: ArticleHeading[] = [];
  if (extension === ".md") {
    try {
      const raw = readFileSync(join(/* turbopackIgnore: true */ process.cwd(), item.source), "utf-8");
      const rendered = renderLibraryMarkdown(raw);
      markdownHtml = rendered.html;
      headings = rendered.headings;
    } catch {
      notFound();
    }
  }

  const contentHref = `/api/library/playbooks/${encodeURIComponent(item.slug)}`;
  const url = `https://muditek.com/playbooks/${item.slug}`;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <AcquisitionPageView asset={item.slug} lane={item.lane} event="library_item_viewed" placement="playbook-page" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: item.title,
          description: item.summary,
          dateModified: item.updatedAt,
          datePublished: item.updatedAt,
          author: { "@type": "Person", name: "Ghiles Moussaoui", url: "https://muditek.com/about" },
          publisher: { "@id": "https://muditek.com/#organization" },
          mainEntityOfPage: url,
          url,
          inLanguage: "en",
        }}
      />

      <main id="main-content">
        <header className="relative overflow-hidden border-b border-white/[0.06] pb-16 pt-36 md:pb-24 md:pt-48">
          <div aria-hidden="true" className="pointer-events-none absolute right-[10%] top-28 h-96 w-96 rounded-full bg-primary/[0.055] blur-[120px]" />
          <div className="relative mx-auto w-full max-w-[1080px] px-6 md:px-12">
            <Link href="/playbooks" className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/55 hover:text-primary">← All playbooks</Link>
            <p className="mt-9 text-xs font-black uppercase tracking-[0.2em] text-primary">{item.lane.replace("-", " ")} · {item.topic.replaceAll("-", " ")}</p>
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.035em] sm:text-6xl md:text-7xl">{item.title}</h1>
            <p className="mt-7 max-w-[70ch] text-lg leading-8 text-foreground/75">{item.summary}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-foreground/55">
              <span>By Ghiles Moussaoui</span>
              <span aria-hidden="true">•</span>
              <span>Updated {formatLibraryDate(item.updatedAt)}</span>
              <span aria-hidden="true">•</span>
              <span>{extension === ".pdf" ? "PDF" : extension === ".html" ? "Interactive document" : "Article"}</span>
            </div>
          </div>
        </header>

        <section className="py-12 md:py-16">
          <div className="mx-auto w-full max-w-[1120px] px-6 md:px-12">
            <div className="mb-8 flex flex-col gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-[-0.02em]">Read the complete playbook</h2>
                <p className="mt-2 text-xs text-foreground/55">Complete source · Updated {formatLibraryDate(item.updatedAt)}</p>
              </div>
              <a href={contentHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center border border-white/[0.14] px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-foreground hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">
                Open original
              </a>
            </div>

            {extension === ".md" ? (
              <>
                {headings.length > 0 ? (
                  <details className="mb-10 rounded-xl border border-white/[0.1] bg-card/30 p-5 md:p-6">
                    <summary className="cursor-pointer text-sm font-black uppercase tracking-[0.14em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">On this page</summary>
                    <ol className="mt-5 grid gap-3 border-t border-white/[0.08] pt-5 sm:grid-cols-2">
                      {headings.map((heading) => (
                        <li key={heading.id}>
                          <a href={`#${heading.id}`} className="inline-flex min-h-11 items-center text-sm leading-5 text-foreground/70 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">
                            {heading.label}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </details>
                ) : null}
                <article className="library-prose [&_h2]:scroll-mt-28" dangerouslySetInnerHTML={{ __html: markdownHtml }} />
              </>
            ) : (
              <iframe
                src={contentHref}
                title={`${item.title} full playbook`}
                className="h-[78dvh] min-h-[680px] w-full rounded-xl border border-white/[0.08] bg-card"
                loading="lazy"
              />
            )}
          </div>
        </section>

        {item.relatedAssets.length > 0 ? (
          <section className="border-t border-white/[0.06] py-14">
            <div className="mx-auto w-full max-w-[1000px] px-6 md:px-12">
              <h2 className="text-2xl font-black tracking-[-0.02em]">Use this with</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {item.relatedAssets.map((path) => {
                  const relatedSlug = path.split("/").filter(Boolean).at(-1) ?? path;
                  return <Link key={path} href={path} className="border border-white/[0.12] px-4 py-3 text-sm font-bold text-foreground/75 hover:border-primary/60 hover:text-primary">{relatedSlug.replaceAll("-", " ")}</Link>;
                })}
              </div>
            </div>
          </section>
        ) : null}

        <CommercialNextStep item={item} />
      </main>
      <Footer />
    </div>
  );
}
