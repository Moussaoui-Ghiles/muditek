"use client";

import { EmailCapture } from "./email-capture";
import { ScrollReveal } from "./scroll-reveal";

interface NewsletterInlineProps {
  tags: string[];
  accentColor?: "primary" | "emerald" | "sky";
}

export function NewsletterInline({
  tags,
  accentColor = "primary",
}: NewsletterInlineProps) {
  const allTags = ["source:newsletter-inline", ...tags];

  return (
    <section className="py-24 w-full relative border-t border-b border-white/[0.04] bg-card/[0.15] flex justify-center mesh-subtle">
      <div className="max-w-[700px] w-full px-6 text-center">
        <ScrollReveal>
          <div className="doppelrand mx-auto mb-10 inline-block">
            <div className="doppelrand-inner px-6 py-2.5 flex items-center gap-3 bg-background">
              <div className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-pulse" />
              <span className="text-sm font-black uppercase tracking-[0.3em] text-foreground/70 pt-[1px]">
                B2B Agents Newsletter
              </span>
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-black tracking-[-0.02em] leading-[1.1] mb-4 text-balance">
            One deployable system.{" "}
            <span className={accentColor === "primary" ? "text-primary italic font-medium" : accentColor === "emerald" ? "text-emerald-400 italic font-medium" : "text-sky-400 italic font-medium"}>
              Every week.
            </span>
          </h3>

          <p className="text-sm text-foreground/60 font-light leading-relaxed mb-8 max-w-lg mx-auto">
            Last edition: an outbound system that books 153 calls for
            $1,200/month. The one before: an AI agent that writes proposals
            in 12 minutes. You get the full build, every week.
          </p>

          <EmailCapture
            tags={allTags}
            accentColor={accentColor}
            buttonText="Subscribe Free"
            successMessage="You're in. Check your inbox."
            compact
            className="max-w-md mx-auto"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
