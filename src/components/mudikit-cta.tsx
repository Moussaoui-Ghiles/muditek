import Link from "next/link";
import { PUBLIC_PLAYBOOKS, PUBLIC_SKILLS, PUBLIC_TOOLS } from "@/lib/public-library";

interface LibraryCtaProps {
  variant?: "inline" | "section";
  className?: string;
  headline?: string;
  body?: string;
  ctaLabel?: string;
  href?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

const DEFAULT_HEADLINE = "Take the systems before you buy anything.";
const DEFAULT_BODY =
  "The skills, resources, and browser tools in the library are the files Muditek runs on. Read them here. Download them with a free portal account.";
const DEFAULT_CTA_LABEL = "Open the library";

const SHELF = [
  { label: "Skills", href: "/skills", items: PUBLIC_SKILLS.slice(0, 3).map((s) => s.title) },
  { label: "Resources", href: "/playbooks", items: PUBLIC_PLAYBOOKS.slice(0, 3).map((p) => p.title) },
  { label: "Tools", href: "/tools", items: PUBLIC_TOOLS.slice(0, 2).map((t) => t.title) },
];

/**
 * Library and portal call to action. The file keeps its historical name so
 * existing page imports keep working.
 */
export function MudikitCta({
  variant = "section",
  className = "",
  headline = DEFAULT_HEADLINE,
  body = DEFAULT_BODY,
  ctaLabel = DEFAULT_CTA_LABEL,
  href = "/library",
  secondaryLabel = "Create a portal account",
  secondaryHref = "/sign-up",
}: LibraryCtaProps) {
  if (variant === "inline") {
    return (
      <section className={`w-full border-t border-white/[0.08] ${className}`}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16 md:py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-[56ch]">
            <h3 className="text-2xl md:text-3xl font-black tracking-[-0.02em] leading-[1.05] text-foreground mb-3 text-balance">{headline}</h3>
            <p className="text-[17px] text-foreground/80 leading-[1.65]">{body}</p>
          </div>
          <div className="flex flex-wrap items-center gap-5 shrink-0">
            <Link href={href} className="btn btn-solid">
              {ctaLabel}
              <svg className="btn-icon" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <Link href={secondaryHref} className="text-sm font-bold text-foreground/70 hover:text-foreground transition-colors underline underline-offset-4 decoration-white/25">
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`w-full band-warm border-t border-[color:var(--surface-warm-line)] ${className}`}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <span className="rule" aria-hidden />
          <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-foreground text-balance mb-5">{headline}</h2>
          <p className="text-lg md:text-xl text-foreground/80 leading-[1.6] max-w-[48ch] mb-10">{body}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href={href} className="btn btn-solid">
              {ctaLabel}
              <svg className="btn-icon" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <Link href={secondaryHref} className="btn btn-amber">{secondaryLabel}</Link>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="panel">
            <div className="panel-bar"><span>muditek.com/library</span><span>public</span></div>
            <div className="panel-body grid gap-6 sm:grid-cols-3">
              {SHELF.map((group) => (
                <div key={group.label}>
                  <Link href={group.href} className="panel-amber font-bold hover:underline underline-offset-4">{group.label}/</Link>
                  <ul className="mt-2 space-y-1.5">
                    {group.items.map((title) => (
                      <li key={title} className="flex gap-2 leading-snug"><span className="panel-dim shrink-0">-</span><span>{title}</span></li>
                    ))}
                    <li className="panel-dim">...</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
