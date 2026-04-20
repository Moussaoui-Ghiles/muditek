"use client";

import { useState } from "react";
import { EmailCapture } from "./email-capture";
import { ScrollReveal } from "./scroll-reveal";

interface LeadMagnetGateProps {
  title: string;
  description: string;
  tags: string[];
  accentColor?: "primary" | "emerald" | "sky";
  downloadUrl?: string;
}

const ACCENT_STYLES = {
  primary: {
    border: "border-primary/[0.15]",
    bg: "bg-primary/[0.03]",
    icon: "text-primary",
    badge: "text-primary",
  },
  emerald: {
    border: "border-emerald-500/[0.15]",
    bg: "bg-emerald-500/[0.03]",
    icon: "text-emerald-400",
    badge: "text-emerald-400",
  },
  sky: {
    border: "border-sky-500/[0.15]",
    bg: "bg-sky-500/[0.03]",
    icon: "text-sky-400",
    badge: "text-sky-400",
  },
};

export function LeadMagnetGate({
  title,
  description,
  tags,
  accentColor = "primary",
  downloadUrl,
}: LeadMagnetGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const style = ACCENT_STYLES[accentColor];

  return (
    <section className="py-24 md:py-32 w-full flex justify-center relative">
      <div className="max-w-[800px] w-full px-6 md:px-12">
        <ScrollReveal>
          <div className={`${style.border} ${style.bg} p-8 md:p-12 rounded-[4px]`}>
            {/* Icon */}
            <div className="flex items-center gap-3 mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={style.icon}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={`text-sm font-black uppercase tracking-[0.2em] ${style.badge}`}>
                Free Download
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-black tracking-[-0.02em] text-foreground mb-3">
              {title}
            </h3>
            <p className="text-base text-foreground/60 font-light leading-relaxed mb-8 max-w-xl">
              {description}
            </p>

            {unlocked ? (
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {downloadUrl ? (
                  <a
                    href={downloadUrl}
                    download
                    className={`btn-press inline-flex items-center gap-3 px-8 py-4 ${style.border} ${accentColor === "primary" ? "bg-primary text-background" : accentColor === "emerald" ? "bg-emerald-500 text-background" : "bg-sky-500 text-background"} font-black text-sm uppercase tracking-[0.15em] rounded-[2px] transition-transform hover:scale-[1.02]`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    Download PDF
                  </a>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${accentColor === "primary" ? "bg-primary" : accentColor === "emerald" ? "bg-emerald-400" : "bg-sky-400"} animate-pulse`} />
                    <span className={`text-sm font-bold uppercase tracking-[0.15em] ${style.badge}`}>
                      We&apos;ll email it to you shortly.
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <EmailCapture
                tags={tags}
                accentColor={accentColor}
                buttonText="Get It Free"
                successMessage={downloadUrl ? "Unlocked! Click download below." : "We'll email it to you shortly."}
                onSuccess={() => setUnlocked(true)}
              />
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
