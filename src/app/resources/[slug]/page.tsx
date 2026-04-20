import type { Metadata } from "next";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { NewsletterInline } from "@/components/newsletter-inline";

const CONTENT_DIR = join(process.cwd(), "content/playbooks");

type ResourceMeta = {
  slug: string;
  title: string;
  description: string;
  tag: string;
  date: string;
  type: "html" | "pdf";
  pdfFile: string;
};

const resources: Record<string, ResourceMeta> = {
  "clawchief-blueprint": {
    slug: "clawchief-blueprint",
    title: "The Chief of Staff Blueprint",
    description:
      "7 text files just replaced a $75K/year executive assistant. Full end-to-end build guide for turning OpenClaw into an autonomous chief of staff — inbox, calendar, outreach, tasks, meeting notes, running on 3 cron jobs, 4 skills, and 8 markdown files. Extracted verbatim from snarktank/clawchief.",
    tag: "Blueprint",
    date: "2026-04-13",
    type: "html",
    pdfFile: "clawchief-blueprint.pdf",
  },
  "claude-code-self-evolving": {
    slug: "claude-code-self-evolving",
    title: "How To Transform Claude Code Into A Self-Evolving System",
    description:
      "The system that took corrections from 4-5 per session to near zero by session 20. Every mistake Claude makes gets captured, verified, and turned into a permanent rule it never breaks again.",
    tag: "Guide",
    date: "2026-03-31",
    type: "html",
    pdfFile: "claude-code-self-evolving.pdf",
  },
  "judgment-moat": {
    slug: "judgment-moat",
    title: "The Judgment Moat",
    description:
      "Why 6 skill files beat 1,000 specialists. How encoded judgment is replacing vertical AI wrappers as the real competitive advantage.",
    tag: "Playbook",
    date: "2026-03-25",
    type: "html",
    pdfFile: "judgment-moat-playbook.pdf",
  },
  "claude-code-tips": {
    slug: "claude-code-tips",
    title: "The Claude Code 45-Tip Power User Playbook",
    description:
      "All 45 Claude Code tips from basics to running 3 AI agents in parallel from your phone.",
    tag: "Playbook",
    date: "2026-03-24",
    type: "html",
    pdfFile: "claude-code-tips-playbook.pdf",
  },
  "google-maps-outbound": {
    slug: "google-maps-outbound",
    title: "The Google Maps Outbound Playbook",
    description:
      "Claude Code + Google Maps = 2,000 leads a day for $10/mo. Full scraper logic and multi-channel sequencing.",
    tag: "Playbook",
    date: "2026-03-21",
    type: "html",
    pdfFile: "google-maps-outbound-playbook.pdf",
  },
  "skill-creator-blueprint": {
    slug: "skill-creator-blueprint",
    title: "The Skill Creator Blueprint",
    description:
      "How to build Claude Code skills that encode your expertise into reusable AI instructions.",
    tag: "Playbook",
    date: "2026-03-24",
    type: "html",
    pdfFile: "skill-creator-blueprint.pdf",
  },
  "claude-dispatch-guide": {
    slug: "claude-dispatch-guide",
    title: "Claude Dispatch Setup Guide",
    description:
      "Full walkthrough for setting up Claude Dispatch and Remote Control.",
    tag: "Guide",
    date: "2026-03-19",
    type: "pdf",
    pdfFile: "claude-dispatch-guide.pdf",
  },
  "agentic-sdr-setup-guide": {
    slug: "agentic-sdr-setup-guide",
    title: "Agentic SDR Setup Guide",
    description:
      "$269/month. 3 channels. 157+ booked calls. The full autonomous outbound system.",
    tag: "Guide",
    date: "2026-03-18",
    type: "pdf",
    pdfFile: "agentic-sdr-setup-guide.pdf",
  },
  "cowork-setup-guide": {
    slug: "cowork-setup-guide",
    title: "Cowork Setup Guide",
    description:
      "Get Claude Cowork running on your machine with plugins, skills, and scheduled tasks.",
    tag: "Guide",
    date: "2026-03-17",
    type: "pdf",
    pdfFile: "cowork-setup-guide.pdf",
  },
  "gtm-skills-guide": {
    slug: "gtm-skills-guide",
    title: "GTM Skills Guide",
    description:
      "Go-to-market skills for AI agents. Outreach, content, lead generation, and pipeline automation.",
    tag: "Guide",
    date: "2026-03-16",
    type: "pdf",
    pdfFile: "gtm-skills-guide.pdf",
  },
  "sequoia-autopilot-playbook": {
    slug: "sequoia-autopilot-playbook",
    title: "Sequoia Autopilot Playbook",
    description:
      "Automated content and distribution system inspired by the Sequoia growth framework.",
    tag: "Playbook",
    date: "2026-03-15",
    type: "pdf",
    pdfFile: "sequoia-autopilot-playbook.pdf",
  },
  "ai-data-agent-guide": {
    slug: "ai-data-agent-guide",
    title: "AI Data Agent Guide",
    description:
      "Build AI agents that scrape, enrich, and organize business data.",
    tag: "Guide",
    date: "2026-03-14",
    type: "pdf",
    pdfFile: "ai-data-agent-guide.pdf",
  },
  "ai-productivity-scorecard": {
    slug: "ai-productivity-scorecard",
    title: "AI Productivity Scorecard",
    description:
      "Score your AI adoption maturity across 6 dimensions.",
    tag: "Tool",
    date: "2026-03-13",
    type: "pdf",
    pdfFile: "ai-productivity-scorecard.pdf",
  },
};

export async function generateStaticParams() {
  return Object.keys(resources).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = resources[slug];
  if (!meta) return {};

  return {
    title: `${meta.title} | Muditek`,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://muditek.com/resources/${slug}`,
      type: "article",
    },
    alternates: {
      canonical: `https://muditek.com/resources/${slug}`,
    },
  };
}

function getHTMLContent(slug: string): { styles: string; body: string } | null {
  try {
    const html = readFileSync(join(CONTENT_DIR, `${slug}.html`), "utf-8");
    const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    const styles = styleMatch ? styleMatch[1] : "";
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
    const body = bodyMatch ? bodyMatch[1] : "";
    const cleanBody = body.replace(/<script[\s\S]*?<\/script>/g, "");
    return { styles, body: cleanBody };
  } catch {
    return null;
  }
}

function getPdfPageImages(slug: string): string[] {
  try {
    const dir = join(process.cwd(), "public/playbooks", slug);
    const files = readdirSync(dir)
      .filter((f) => f.startsWith("page-") && f.endsWith(".jpg"))
      .sort((a, b) => {
        const numA = parseInt(a.replace("page-", "").replace(".jpg", ""));
        const numB = parseInt(b.replace("page-", "").replace(".jpg", ""));
        return numA - numB;
      });
    return files.map((f) => `/playbooks/${slug}/${f}`);
  } catch {
    return [];
  }
}

function ResourceHeader({ meta }: { meta: ResourceMeta }) {
  return (
    <section className="pt-32 pb-8 px-6 md:px-12">
      <div className="max-w-[900px] mx-auto">
        <a
          href="/resources"
          className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/30 hover:text-foreground/60 transition-colors mb-6 inline-block"
        >
          &larr; Resources
        </a>
        <div className="flex items-center gap-3 mt-4 mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-foreground/10 text-foreground/50">
            {meta.tag}
          </span>
          <span className="text-xs text-foreground/30">{meta.date}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.95]">
          {meta.title}
        </h1>
        <p className="text-foreground/50 text-base md:text-lg mt-4 max-w-2xl leading-relaxed">
          {meta.description}
        </p>
        {meta.type === "pdf" && (
          <a
            href={`/playbooks/${meta.pdfFile}`}
            download
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-foreground text-background text-sm font-bold uppercase tracking-[0.1em] hover:opacity-90 transition-opacity"
          >
            Download PDF
          </a>
        )}
      </div>
    </section>
  );
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = resources[slug];
  if (!meta) notFound();

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    author: {
      "@type": "Person",
      name: "Ghiles Moussaoui",
      url: "https://muditek.com/about",
    },
    publisher: { "@type": "Organization", name: "Muditek" },
    datePublished: meta.date,
    mainEntityOfPage: `https://muditek.com/resources/${slug}`,
  };

  if (meta.type === "pdf") {
    const pageImages = getPdfPageImages(slug);

    return (
      <>
        <JsonLd data={schemaData} />
        <Navbar />
        <ResourceHeader meta={meta} />

        <section className="px-4 md:px-12 pb-24">
          <div className="max-w-[900px] mx-auto flex flex-col gap-4 md:gap-6">
            {pageImages.map((src, i) => (
              <div
                key={i}
                className="w-full rounded-xl md:rounded-2xl overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.2)]"
              >
                <img
                  src={src}
                  alt={`${meta.title} — Page ${i + 1}`}
                  className="w-full h-auto block"
                  loading={i < 3 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        </section>

        <NewsletterInline tags={["source:resource", `resource:${slug}`]} />
        <Footer />
      </>
    );
  }

  // HTML type
  const content = getHTMLContent(slug);
  if (!content) notFound();

  // Responsive wrapper styles: scale A4 pages to fit mobile viewport
  const responsiveStyles = `
    .playbook-scaler {
      max-width: 100%;
      overflow-x: hidden;
      padding: 0 16px 64px;
    }
    .playbook-scaler .page {
      margin: 0 auto 24px;
      box-shadow: 0 4px 32px rgba(0,0,0,0.15);
      border-radius: 12px;
    }
    @media (max-width: 850px) {
      .playbook-scaler .page {
        width: 100% !important;
        height: auto !important;
        min-height: unset !important;
        padding: 32px 24px !important;
        page-break-after: unset !important;
      }
      .playbook-scaler .page img {
        max-width: 100% !important;
        height: auto !important;
      }
      .playbook-scaler .page .metrics,
      .playbook-scaler .page [style*="grid-template-columns: repeat(3"] {
        grid-template-columns: 1fr 1fr 1fr !important;
      }
      .playbook-scaler .page .skill-grid,
      .playbook-scaler .page [style*="grid-template-columns: 1fr 1fr"] {
        grid-template-columns: 1fr !important;
      }
      .playbook-scaler .page h1,
      .playbook-scaler .page [style*="font-size: 82px"],
      .playbook-scaler .page [style*="font-size: 68px"] {
        font-size: 42px !important;
      }
      .playbook-scaler .page h2,
      .playbook-scaler .page [style*="font-size: 64px"],
      .playbook-scaler .page [style*="font-size: 58px"],
      .playbook-scaler .page [style*="font-size: 54px"],
      .playbook-scaler .page [style*="font-size: 52px"] {
        font-size: 32px !important;
      }
      .playbook-scaler .page [style*="font-size: 56px"] {
        font-size: 36px !important;
      }
      .playbook-scaler .page .foot {
        position: relative !important;
        bottom: unset !important;
        left: unset !important;
        right: unset !important;
        margin-top: 32px;
        padding-top: 16px;
        border-top: 1px solid rgba(128,128,128,0.15);
      }
      .playbook-scaler .page .accent-stripe {
        display: none !important;
      }
      .playbook-scaler .page .cover-glow {
        display: none !important;
      }
    }
    @media (min-width: 851px) {
      .playbook-scaler {
        padding: 0 24px 64px;
      }
    }
  `;

  return (
    <>
      <JsonLd data={schemaData} />
      <Navbar />
      <ResourceHeader meta={meta} />

      <style dangerouslySetInnerHTML={{ __html: content.styles }} />
      <style dangerouslySetInnerHTML={{ __html: responsiveStyles }} />
      <div className="playbook-scaler" dangerouslySetInnerHTML={{ __html: content.body }} />

      <NewsletterInline tags={["source:resource", `resource:${slug}`]} />
      <Footer />
    </>
  );
}
