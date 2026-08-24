import Link from "next/link";
import { marked } from "marked";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import {
  AcquisitionPageView,
  TrackedBookingLink,
  TrackedSourceLink,
  TrackedTemplateDownload,
} from "@/components/acquisition-tracking";
import {
  type AcquisitionPageDefinition,
  getAcquisitionPage,
  readAcquisitionMarkdown,
} from "@/lib/acquisition/content-registry";

type TocItem = { depth: 2 | 3; id: string; text: string };

function stripMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)]\([^\)]+\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .trim();
}

function slugify(value: string): string {
  return stripMarkdown(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderMarkdown(markdown: string): { html: string; toc: TocItem[] } {
  const used = new Map<string, number>();
  const toc: TocItem[] = [];

  const source = markdown.replace(/^(#{2,3})\s+(.+)$/gm, (_, marks: string, heading: string) => {
    const base = slugify(heading) || "section";
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;
    toc.push({ depth: marks.length as 2 | 3, id, text: stripMarkdown(heading) });
    return `${marks} <span id="${id}"></span>${heading}`;
  });

  return { html: marked.parse(source, { async: false, gfm: true }) as string, toc };
}

function familyLabel(family: AcquisitionPageDefinition["family"]): string {
  return {
    "commercial-decision": "Buyer decision guide",
    "operational-workflow": "Outbound workflow",
    "definition-economics": "Outbound economics",
    template: "Working template",
    "signal-method": "Signal method",
  }[family];
}

export function AcquisitionContentPage({ page }: { page: AcquisitionPageDefinition }) {
  const { html, toc } = renderMarkdown(readAcquisitionMarkdown(page));
  const isTemplate = page.family === "template";
  const familyHref = isTemplate ? "/templates" : page.family === "commercial-decision" ? "/appointment-setting" : "/outbound";
  const familyName = isTemplate ? "Templates" : page.family === "commercial-decision" ? "Appointment setting" : "Outbound";
  const absoluteUrl = `https://muditek.com${page.canonicalPath}`;
  const related = page.relatedPaths.map((path) => {
    const slug = path.split("/").filter(Boolean).at(-1) ?? "";
    const family = path.startsWith("/templates/") ? "template" : undefined;
    return {
      path,
      title: family ? getAcquisitionPage(family, slug)?.title :
        (["commercial-decision", "operational-workflow", "definition-economics", "signal-method"] as const)
          .map((candidate) => getAcquisitionPage(candidate, slug))
          .find(Boolean)?.title ?? slug.replaceAll("-", " "),
    };
  });

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <AcquisitionPageView
        asset={page.slug}
        lane="outbound"
        event="organic_landing_viewed"
        placement={`${page.family}-page`}
        pageFamily={page.family}
        queryCluster={page.primaryQuery}
        releaseWave={page.releaseWave}
      />
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": isTemplate ? "DigitalDocument" : "TechArticle",
          headline: page.title,
          name: page.title,
          description: page.description,
          dateModified: page.lastChecked,
          datePublished: page.lastChecked,
          author: { "@type": "Person", name: "Ghiles Moussaoui", url: "https://muditek.com/about" },
          publisher: { "@id": "https://muditek.com/#organization" },
          mainEntityOfPage: absoluteUrl,
          url: absoluteUrl,
          inLanguage: "en",
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://muditek.com" },
            { "@type": "ListItem", position: 2, name: familyName, item: `https://muditek.com${familyHref}` },
            { "@type": "ListItem", position: 3, name: page.title, item: absoluteUrl },
          ],
        },
      ]} />

      <main id="main-content">
        <header className="relative overflow-hidden border-b border-white/[0.07] pb-16 pt-36 md:pb-24 md:pt-48">
          <div aria-hidden="true" className="pointer-events-none absolute right-[8%] top-24 h-80 w-80 rounded-full bg-primary/[0.06] blur-[120px]" />
          <div className="relative mx-auto w-full max-w-[1120px] px-6 md:px-12">
            <Link href={familyHref} className="inline-flex min-h-11 items-center text-sm font-bold text-foreground/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              ← {familyName}
            </Link>
            <p className="mt-8 text-sm font-bold text-primary">{familyLabel(page.family)}</p>
            <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.96] tracking-[-0.04em] sm:text-6xl md:text-7xl">{page.title}</h1>
            <p className="mt-7 max-w-[68ch] text-lg leading-8 text-foreground/72">{page.description}</p>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground/55">
              <span>Reviewed {page.lastChecked}</span>
              <span>Method: {page.uniqueValue}</span>
              {page.status !== "published" ? <span className="text-primary">Preview · not indexed</span> : null}
            </div>
            {isTemplate ? (
              <TrackedTemplateDownload href={`${page.canonicalPath}/download`} asset={page.slug} className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[2px] bg-primary px-6 py-3 text-sm font-extrabold text-background hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-foreground">
                Download Markdown template
              </TrackedTemplateDownload>
            ) : null}
          </div>
        </header>

        <section className="py-14 md:py-20">
          <div className="mx-auto grid w-full max-w-[1120px] gap-12 px-6 md:grid-cols-[minmax(0,1fr)_240px] md:px-12">
            <article className="library-prose min-w-0" dangerouslySetInnerHTML={{ __html: html }} />
            <aside className="order-first md:order-last">
              <nav aria-label="On this page" className="border-l border-white/[0.12] pl-5 md:sticky md:top-28">
                <p className="text-sm font-extrabold text-foreground">On this page</p>
                <ol className="mt-4 space-y-1">
                  {toc.map((item) => (
                    <li key={item.id} className={item.depth === 3 ? "pl-4" : ""}>
                      <a href={`#${item.id}`} className="inline-flex min-h-11 items-center text-sm leading-5 text-foreground/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          </div>
        </section>

        <section className="border-y border-white/[0.07] py-14">
          <div className="mx-auto grid w-full max-w-[1120px] gap-10 px-6 md:grid-cols-2 md:px-12">
            <div>
              <h2 className="text-2xl font-black tracking-[-0.02em]">Sources and limits</h2>
              <p className="mt-3 max-w-[58ch] text-sm leading-6 text-foreground/60">These sources support the method. They do not guarantee a result or prove intent for an individual company.</p>
              <ul className="mt-5 space-y-2">
                {page.citations.map((citation) => (
                  <li key={citation.href}>
                    <TrackedSourceLink href={citation.href} asset={page.slug} placement="method-source" className="inline-flex min-h-11 items-center text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      {citation.title} · {citation.publisher}
                    </TrackedSourceLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-[-0.02em]">Continue the work</h2>
              <div className="mt-5 flex flex-col gap-3">
                {related.map((item) => (
                  <Link key={item.path} href={item.path} className="inline-flex min-h-11 items-center border-b border-white/[0.1] py-3 text-sm font-bold capitalize text-foreground/75 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    {item.title} →
                  </Link>
                ))}
                <Link href="/tools" className="inline-flex min-h-11 items-center border-b border-white/[0.1] py-3 text-sm font-bold text-foreground/75 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  Use an outbound tool →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto w-full max-w-[1120px] px-6 md:px-12">
            <div className="max-w-4xl">
              <p className="text-sm font-bold text-primary">Done-for-you signal-based outbound</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.035em] sm:text-5xl">Want Muditek to operate this for you?</h2>
              <p className="mt-5 max-w-[62ch] text-lg leading-8 text-foreground/68">You cover the operating stack. The delivery fee is charged only for qualified meetings held.</p>
              <TrackedBookingLink asset={page.slug} placement="acquisition-content-cta" className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[2px] bg-primary px-7 py-3 text-sm font-extrabold text-background hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-foreground">
                Book a fit call
              </TrackedBookingLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
