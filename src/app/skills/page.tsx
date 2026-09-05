import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { NewsletterInline } from "@/components/newsletter-inline";
import { MudikitCta } from "@/components/mudikit-cta";
import { LibraryHeader, LibraryList } from "@/components/library/library-list";
import { PUBLIC_SKILLS } from "@/lib/public-library";

export const metadata: Metadata = {
  title: "Muditek Skills | Downloadable AI Workflows",
  description: "Downloadable workflows and working files for outbound, research, and content operations.",
  alternates: { canonical: "https://muditek.com/skills" },
};

const GROUPS = [
  { title: "Outbound", description: "Offer review, targeting, list building, and funnel analysis.", items: PUBLIC_SKILLS.slice(0, 6) },
  { title: "Content systems", description: "Source-led workflows for content production and lead magnets.", items: PUBLIC_SKILLS.slice(6) },
];

export default function SkillsPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <main id="main-content">
        <LibraryHeader
          back={{ href: "/library", label: "Library" }}
          kicker="Skills"
          title="Download the workflow."
          lead="Instruction files an agent can follow, with the working files behind them. Read the instructions, inspect the files, download the package."
        />
        {GROUPS.map((group) => (
          <section key={group.title} className="border-t border-white/[0.08]">
            <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12 py-16 md:py-20 grid gap-8 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <span className="rule" aria-hidden />
                <h2 className="text-4xl md:text-5xl font-black tracking-[-0.035em] leading-[0.95] lg:sticky lg:top-32">{group.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-foreground/70 max-w-[36ch]">{group.description}</p>
              </div>
              <div className="lg:col-span-8">
                <LibraryList items={group.items} />
              </div>
            </div>
          </section>
        ))}
        <MudikitCta
          variant="inline"
          headline="Want every file in one place?"
          body="A free portal account keeps the skills, resources, and tools together, with downloads tied to one login."
          ctaLabel="Create a portal account"
          href="/sign-up"
          secondaryLabel="Sign in"
          secondaryHref="/sign-in?redirect_url=/portal/skills"
        />
        <NewsletterInline source="skills" />
      </main>
      <Footer />
    </div>
  );
}
