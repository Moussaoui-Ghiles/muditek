import Link from "next/link";

interface MudikitCtaProps {
  variant?: "inline" | "section";
  className?: string;
  headline?: string;
  body?: string;
  ctaLabel?: string;
}

const DEFAULT_HEADLINE = "Get MudiKit · $47/mo";
const DEFAULT_BODY =
  "15+ Claude Code skills, 6 implementation playbooks, the vault template, 20+ outreach templates. New drops every month.";
const DEFAULT_CTA_LABEL = "Get MudiKit — $47/mo";

export function MudikitCta({
  variant = "section",
  className = "",
  headline = DEFAULT_HEADLINE,
  body = DEFAULT_BODY,
  ctaLabel = DEFAULT_CTA_LABEL,
}: MudikitCtaProps) {
  if (variant === "inline") {
    return (
      <aside
        className={`my-10 border border-white/[0.08] bg-card/[0.3] backdrop-blur-md rounded-[6px] p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5 md:gap-8 ${className}`}
      >
        <div className="flex-1">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary/80 mb-2">
            MudiKit
          </p>
          <h3 className="text-lg md:text-xl font-black tracking-tight text-foreground mb-1">
            {headline}
          </h3>
          <p className="text-sm text-foreground/65 leading-relaxed font-light">
            {body}
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <Link
            href="/buy"
            className="btn-press inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-xs font-black uppercase tracking-[0.18em] rounded-[2px] hover:scale-[1.02] transition-transform"
          >
            {ctaLabel}
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/40">
            Cancel anytime
          </span>
        </div>
      </aside>
    );
  }

  return (
    <section
      className={`py-24 md:py-32 w-full flex justify-center border-t border-b border-white/[0.04] bg-card/[0.18] ${className}`}
    >
      <div className="max-w-[1100px] w-full px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-7">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-primary/80 mb-5 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/40" />
              MudiKit · The Operator&apos;s Library
            </p>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05] text-foreground mb-6 text-balance">
              {headline.replace(" · $47/mo", "")}{" "}
              <span className="text-primary italic font-medium">
                $47/month.
              </span>
            </h2>
            <p className="text-base md:text-lg text-foreground/65 font-light leading-relaxed max-w-2xl">
              {body}
            </p>
          </div>

          <div className="md:col-span-5 flex flex-col items-start md:items-end gap-3">
            <Link
              href="/buy"
              className="btn-press group relative inline-flex items-center justify-center px-10 py-5 bg-foreground text-background font-black text-sm uppercase tracking-[0.2em] overflow-hidden rounded-[2px] hover:scale-[1.02] transition-transform duration-300"
            >
              <span className="relative z-10 flex items-center gap-3">
                {ctaLabel}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <path
                    d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 w-0 bg-primary group-hover:w-full transition-all duration-500 ease-in-out z-0" />
            </Link>
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-foreground/45">
              Cancel anytime · Stripe portal
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-foreground/35">
              No upsells · No annual lock-in
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
