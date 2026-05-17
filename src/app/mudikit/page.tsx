import Link from "next/link";
import { CheckoutButton } from "./checkout-button";
import { FaqItem } from "./faq-item";
import { listShippedPortalSkills } from "@/lib/portal-skills";

const FEATURED_SKILL_SLUGS = [
  "linkedin-outreach",
  "linkedin-content-writer",
  "cold-email",
  "email-sequence",
  "apify-lead-generation",
  "apify-ultimate-scraper",
  "phantombuster",
  "offer-creation",
  "copywriting",
  "content-strategy",
  "page-cro",
  "seo-audit",
  "source-ingest",
  "source-distill",
];

const PLAYBOOKS = [
  {
    name: "OpenClaw outbound",
    note: "AI-driven cold outbound system. 153 booked calls for $1,200/mo on the reference run.",
  },
  {
    name: "Google Maps outbound",
    note: "Local-business prospecting at scale. Apify + Claude scoring + DM-ready messages.",
  },
  {
    name: "Agentic SDR loop",
    note: "Inbox triage, qualification, and reply drafting that runs while you sleep.",
  },
  {
    name: "Claude Code in production",
    note: "How to build, deploy, and operate real client systems with Claude Code skills.",
  },
  {
    name: "Lead-capture funnel",
    note: "Comment-gated LinkedIn to email to 12-day nurture to checkout. The exact stack this site runs.",
  },
  {
    name: "Content engine",
    note: "Source ingest to distillation to LinkedIn post plus newsletter issue. Once a week, repeatable.",
  },
];

const FAQ = [
  {
    q: "What is this, in one line?",
    a: "The Claude Code skills, playbooks, and vault template I use to run Muditek. Updated every week.",
  },
  {
    q: "Why $47 a month?",
    a: "Clients pay €40K-100K to have me install these systems for them. $47 is what it costs to install them yourself, with the same source files I work from.",
  },
  {
    q: "Who is this for?",
    a: "Operators, founders, consultants, and SDRs who already use Claude Code or are willing to learn it. If you don't run a terminal, this isn't for you.",
  },
  {
    q: "What ships every week?",
    a: "One new skill or playbook, plus updates to existing ones. You see the change log inside the kit. Cancel anytime. You keep what you've already downloaded.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. One click in the portal. No retention call, no annual lock-in.",
  },
  {
    q: "Do I get the vault template?",
    a: "Yes. The full BizOps vault structure: CLAUDE.md hierarchy, decision rules, source library taxonomy, skill organization. Drop your work in, your AI agents read it.",
  },
];

interface PageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function MudikitPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const emailParam = typeof params.email === "string" ? params.email : undefined;
  const allSkills = listShippedPortalSkills();
  const skillsBySlug = new Map(allSkills.map((skill) => [skill.slug, skill]));
  const featuredSkills = FEATURED_SKILL_SLUGS
    .map((slug) => skillsBySlug.get(slug))
    .filter((skill): skill is (typeof allSkills)[number] => Boolean(skill))
    .slice(0, 15);
  const skillCount = allSkills.length;

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-[#e8e8ec] font-[family-name:var(--font-geist-sans)]">
      {/* Top bar */}
      <header className="px-6 md:px-10 py-6 flex items-center justify-between max-w-[960px] mx-auto">
        <Link
          href="/"
          className="text-sm font-mono text-[#a0a0a6] hover:text-[#e8e8ec] transition-colors"
        >
          Back to muditek.com
        </Link>
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#636366]">
          MudiKit · $47/mo
        </span>
      </header>

      {/* Hero */}
      <section className="px-6 md:px-10 pt-16 md:pt-24 pb-20 max-w-[960px] mx-auto">
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#636366] mb-6">
          The kit
        </p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.05] mb-8 text-balance">
          The Claude Code skills, playbooks, and vault I use to run Muditek.
        </h1>
        <p className="text-lg md:text-xl text-[#a0a0a6] leading-relaxed max-w-2xl mb-10">
          $47 a month. New drops every week. Cancel anytime.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <CheckoutButton email={emailParam} label="Get the kit - $47/mo" />
          <a
            href="#inside"
            className="text-sm text-[#a0a0a6] hover:text-[#e8e8ec] transition-colors underline underline-offset-4 decoration-[#636366]"
          >
            See what&rsquo;s inside
          </a>
        </div>
      </section>

      {/* Why this exists */}
      <section className="px-6 md:px-10 py-16 max-w-[960px] mx-auto border-t border-white/[0.06]">
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#636366] mb-6">
          Why this exists
        </p>
        <div className="max-w-3xl space-y-5 text-[#a0a0a6] text-base md:text-lg leading-relaxed">
          <p>
            I&rsquo;m Ghiles. I run Muditek. I build AI systems for telecom operators, B2B SaaS, and PE firms. Clients pay €40K-100K to have me install these systems.
          </p>
          <p>
            Behind the scenes, the work is run by Claude Code skills, an Obsidian vault, and a handful of playbooks I&rsquo;ve refined on real engagements. MudiKit is that toolkit, packaged.
          </p>
          <p>Same files I work from. Updated every week as I refine them on live work.</p>
        </div>
      </section>

      {/* Inventory */}
      <section
        id="inside"
        className="px-6 md:px-10 py-20 max-w-[960px] mx-auto border-t border-white/[0.06]"
      >
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#636366] mb-6">
          What&rsquo;s inside
        </p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] mb-14 max-w-2xl">
          {skillCount} skills. 6 playbooks. 1 vault. 20+ outreach templates.
        </h2>

        {/* Skills */}
        <div className="mb-16">
          <div className="flex items-baseline justify-between mb-6">
            <h3 className="text-xl md:text-2xl font-semibold">Claude Code skills</h3>
            <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#636366]">
              {skillCount} shipped
            </span>
          </div>
          <p className="text-[#a0a0a6] text-base leading-relaxed mb-6 max-w-2xl">
            Drop them into{" "}
            <span className="font-mono text-[#e8e8ec]">~/.claude/skills/</span>. Claude Code reads, understands, and runs them. Not prompts: full skill files with logic, references, and execution rules.
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 font-mono text-[14px] text-[#e8e8ec]">
            {featuredSkills.map((skill) => (
              <li key={skill.slug} className="flex items-center gap-3">
                <span className="text-[#636366]">·</span>
                {skill.slug}
              </li>
            ))}
          </ul>
          <p className="text-[#636366] text-sm font-mono mt-6">
            New ones are added inside the portal.
          </p>
        </div>

        {/* Playbooks */}
        <div className="mb-16">
          <div className="flex items-baseline justify-between mb-6">
            <h3 className="text-xl md:text-2xl font-semibold">Implementation playbooks</h3>
            <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#636366]">
              6 systems
            </span>
          </div>
          <p className="text-[#a0a0a6] text-base leading-relaxed mb-6 max-w-2xl">
            Each playbook is a complete system. Architecture, code, deployment steps, and the prompts that make it run.
          </p>
          <ol className="space-y-5">
            {PLAYBOOKS.map((p, i) => (
              <li key={p.name} className="flex gap-5 max-w-2xl">
                <span className="text-[#636366] font-mono text-sm shrink-0 mt-0.5 w-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[#e8e8ec] font-medium">{p.name}</p>
                  <p className="text-[#a0a0a6] text-[15px] leading-relaxed mt-1">{p.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Vault + outreach */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-xl md:text-2xl font-semibold">Vault template</h3>
              <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#636366]">
                1 structure
              </span>
            </div>
            <p className="text-[#a0a0a6] text-[15px] leading-relaxed">
              The BizOps Obsidian vault structure that runs the system.{" "}
              <span className="font-mono text-[#e8e8ec]">CLAUDE.md</span> hierarchy, decision rules, source library taxonomy, skill organization. Drop your work in. AI agents read it and execute.
            </p>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-xl md:text-2xl font-semibold">Outreach templates</h3>
              <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#636366]">
                20+ DMs
              </span>
            </div>
            <p className="text-[#a0a0a6] text-[15px] leading-relaxed">
              LinkedIn DMs, cold emails, follow-ups, reply patterns. With A/B variants and the segment they&rsquo;re built for. Edit one line, send.
            </p>
          </div>
        </div>
      </section>

      {/* The math */}
      <section className="px-6 md:px-10 py-20 max-w-[960px] mx-auto border-t border-white/[0.06]">
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#636366] mb-6">
          The math
        </p>
        <div className="max-w-3xl space-y-6 text-base md:text-lg leading-relaxed">
          <p className="text-[#a0a0a6]">
            <span className="text-[#e8e8ec] font-medium">Done-for-you</span>: I install the same systems for clients. Engagements run €40K-100K depending on scope, with a guarantee in euros.
          </p>
          <p className="text-[#a0a0a6]">
            <span className="text-[#e8e8ec] font-medium">Do-it-yourself</span>: $47 a month. Same files. You install them. Cancel anytime, keep what you&rsquo;ve downloaded.
          </p>
          <p className="text-[#a0a0a6]">
            One paid hour saved a month covers it. After that, the kit is paying you back.
          </p>
        </div>
      </section>

      {/* How it lands */}
      <section className="px-6 md:px-10 py-20 max-w-[960px] mx-auto border-t border-white/[0.06]">
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#636366] mb-6">
          How it lands
        </p>
        <ol className="space-y-10 max-w-2xl">
          <li className="flex gap-6">
            <span className="text-[#636366] font-mono text-sm shrink-0 w-8 mt-1">01</span>
            <div>
              <p className="text-xl md:text-2xl font-semibold mb-2">Pay $47</p>
              <p className="text-[#a0a0a6] leading-relaxed">
                Stripe Checkout. Card or Apple/Google Pay. Receipt in your inbox.
              </p>
            </div>
          </li>
          <li className="flex gap-6">
            <span className="text-[#636366] font-mono text-sm shrink-0 w-8 mt-1">02</span>
            <div>
              <p className="text-xl md:text-2xl font-semibold mb-2">Get the portal</p>
              <p className="text-[#a0a0a6] leading-relaxed">
                Skills, playbooks, vault, and outreach templates. All download links inside. Copy them into your{" "}
                <span className="font-mono text-[#e8e8ec]">~/.claude/skills/</span> and your editor.
              </p>
            </div>
          </li>
          <li className="flex gap-6">
            <span className="text-[#636366] font-mono text-sm shrink-0 w-8 mt-1">03</span>
            <div>
              <p className="text-xl md:text-2xl font-semibold mb-2">New drops every week</p>
              <p className="text-[#a0a0a6] leading-relaxed">
                Email when something new ships. Always backwards-compatible. Old skills keep working.
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* Who it's for */}
      <section className="px-6 md:px-10 py-20 max-w-[960px] mx-auto border-t border-white/[0.06]">
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#636366] mb-6">
          Who it&rsquo;s for
        </p>
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#e8e8ec]">Built for</h3>
            <ul className="space-y-3 text-[#a0a0a6] text-[15px] leading-relaxed">
              <li>Operators running outbound, content, or ops manually who want to hand it to an agent.</li>
              <li>Founders and consultants who already use Claude Code and want a working library.</li>
              <li>SDRs and growth marketers who&rsquo;d rather edit a real skill than write a prompt every day.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#636366]">Not for</h3>
            <ul className="space-y-3 text-[#636366] text-[15px] leading-relaxed">
              <li>People who don&rsquo;t open a terminal.</li>
              <li>Teams looking for hand-holding. There&rsquo;s no Slack, no live coaching.</li>
              <li>Anyone wanting a no-code SaaS. This is files, in a vault, run by an agent.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing line */}
      <section className="px-6 md:px-10 py-24 max-w-[960px] mx-auto border-t border-white/[0.06] text-center">
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#636366] mb-6">
          Pricing
        </p>
        <p className="text-3xl md:text-5xl font-bold tracking-[-0.02em] mb-3">$47 a month.</p>
        <p className="text-[#a0a0a6] text-base md:text-lg mb-10">
          Cancel anytime. Keep what you&rsquo;ve downloaded.
        </p>
        <CheckoutButton email={emailParam} label="Get the kit" />
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-10 py-20 max-w-[960px] mx-auto border-t border-white/[0.06]">
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#636366] mb-6">
          FAQ
        </p>
        <div>
          {FAQ.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 md:px-10 py-24 max-w-[960px] mx-auto border-t border-white/[0.06]">
        <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.1] mb-6 max-w-3xl">
          Same files I work from. $47 a month.
        </h2>
        <p className="text-[#a0a0a6] text-base md:text-lg mb-10 max-w-xl">
          Get the kit. Cancel whenever. Keep everything you downloaded.
        </p>
        <CheckoutButton email={emailParam} label="Get the kit - $47/mo" />
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-10 py-10 max-w-[960px] mx-auto border-t border-white/[0.06] text-xs font-mono text-[#636366] flex flex-wrap items-center justify-between gap-4">
        <span>© Muditek</span>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-[#e8e8ec] transition-colors">
            muditek.com
          </Link>
          <Link href="/portal" className="hover:text-[#e8e8ec] transition-colors">
            Member portal
          </Link>
        </div>
      </footer>
    </main>
  );
}
