import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { NewsletterInline } from "@/components/newsletter-inline";
import { MudikitCta } from "@/components/mudikit-cta";
import { LibraryHeader, LibraryList } from "@/components/library/library-list";
import { PUBLIC_PLAYBOOKS, PUBLIC_SKILLS, PUBLIC_TOOLS } from "@/lib/public-library";

export const metadata: Metadata = {
  title: "Public Library | Muditek",
  description: "Practical Muditek guides, browser tools, and downloadable workflows for B2B operators.",
  alternates: { canonical: "https://muditek.com/library" },
};

const COLLECTIONS = [
  { href: "/skills", title: "Skills", count: PUBLIC_SKILLS.length, description: "Instruction files an agent can follow, with the working files behind them." },
  { href: "/playbooks", title: "Resources", count: PUBLIC_PLAYBOOKS.length, description: "Complete operating guides for outbound and AI systems." },
  { href: "/tools", title: "Tools", count: PUBLIC_TOOLS.length, description: "Browser calculators that use only the values you enter." },
];

const FEATURED = [
  PUBLIC_PLAYBOOKS[0],
  PUBLIC_PLAYBOOKS[1],
  PUBLIC_SKILLS.find((item) => item.slug === "google-maps-owner-email-finder")!,
  PUBLIC_TOOLS[0],
];

export default function PublicLibraryPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <main id="main-content">
        <LibraryHeader
          kicker="Library"
          title="The systems, as files."
          lead="Everything Muditek runs on, published. Skills you download, guides you follow, tools you run in the browser. All public. A free portal account keeps them in one place."
        />

        <section className="border-t border-white/[0.08]">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12">
            <div className="grid md:grid-cols-3">
              {COLLECTIONS.map((c, i) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className={`group py-12 md:py-16 flex flex-col ${i < 2 ? "border-b md:border-b-0 md:border-r border-white/[0.08] md:pr-10" : ""} ${i > 0 ? "md:pl-10" : ""}`}
                >
                  <p className="font-mono text-sm text-primary mb-5">public, free</p>
                  <h2 className="text-4xl md:text-5xl font-black tracking-[-0.035em] leading-[0.95] text-foreground group-hover:text-primary transition-colors">{c.title}</h2>
                  <p className="mt-4 text-base leading-relaxed text-foreground/70 max-w-[32ch]">{c.description}</p>
                  <span className="mt-8 text-sm font-bold text-foreground/70 group-hover:text-foreground transition-colors">Browse {c.title.toLowerCase()}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.08]">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12 py-16 md:py-24 grid gap-8 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="rule" aria-hidden />
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.035em] leading-[0.95] lg:sticky lg:top-32">Start here</h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/70 max-w-[36ch]">The four items most people open first.</p>
            </div>
            <div className="lg:col-span-8">
              <LibraryList items={FEATURED} showKind />
            </div>
          </div>
        </section>

        <MudikitCta
          variant="inline"
          headline="Same files, one login."
          body="The portal holds the public library plus account resources and saved downloads. Free."
          ctaLabel="Create a portal account"
          href="/sign-up"
          secondaryLabel="Sign in"
          secondaryHref="/sign-in?redirect_url=/portal"
        />
        <NewsletterInline source="library" />
      </main>
      <Footer />
    </div>
  );
}
