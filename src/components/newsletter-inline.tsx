import { EmailCapture } from "./email-capture";
import { ScrollReveal } from "./scroll-reveal";

interface NewsletterInlineProps {
  /** Where the signup came from. Stored on the subscriber row. */
  source?: string;
  /** Legacy prop. First "source:*" tag is used when `source` is absent. */
  tags?: string[];
  accentColor?: "primary" | "emerald" | "sky";
  headline?: string;
  body?: string;
  className?: string;
}

/**
 * The newsletter block that closes every marketing page.
 * Amber ground, navy type. One headline, one line, one field.
 */
export function NewsletterInline({
  source,
  tags,
  headline = "One working system per issue.",
  body = "How the outbound engine runs, how the agents are written, what broke and what got fixed. Written by the person running it. Reply to any issue and it gets read.",
  className = "",
}: NewsletterInlineProps) {
  const derived = source ?? tags?.find((t) => t.startsWith("source:"))?.slice(7) ?? "newsletter-inline";

  return (
    <section className={`w-full drench ${className}`} aria-labelledby="newsletter-heading">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28 grid gap-10 lg:grid-cols-12 lg:gap-16 items-start">
        <ScrollReveal className="lg:col-span-7">
          <p className="text-base font-bold mb-6 opacity-80">The newsletter</p>
          <h2 id="newsletter-heading" className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-balance mb-5">
            {headline}
          </h2>
          <p className="text-lg md:text-xl leading-[1.6] max-w-[50ch] opacity-90">{body}</p>
        </ScrollReveal>
        <ScrollReveal delay={120} className="lg:col-span-5 lg:pt-16">
          <EmailCapture source={derived} buttonText="Subscribe" />
          <p className="mt-4 text-sm opacity-75">Unsubscribe in one click, in every email.</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
