import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { NewsletterInline } from "@/components/newsletter-inline";
import { BookForm } from "./book-form";

export const metadata: Metadata = {
  title: "Book a call | Muditek",
  description:
    "A few answers, then a slot on the calendar. The call starts at your problem instead of at introductions. AI transformation, outbound, or M&A origination.",
  alternates: { canonical: "https://muditek.com/book" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Book a call | Muditek",
    description: "A few answers, then a slot on the calendar. The call starts at your problem instead of at introductions.",
    url: "https://muditek.com/book",
    type: "website",
  },
};

const CALL = [
  { when: "before", line: "Your answers, your site, and the public signals on your company get read. The call does not start at zero." },
  { when: "on the call", line: "Thirty minutes. You describe how the work happens today. We say what is worth building, what to leave alone, or that neither offer fits." },
  { when: "after", line: "A written note with the next step. If the answer is no, the note says no and why." },
];

export default function BookPage() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-primary/20 flex flex-col items-center">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://muditek.com" },
            { "@type": "ListItem", position: 2, name: "Book a call", item: "https://muditek.com/book" },
          ],
        }}
      />
      <Navbar />

      <main id="main-content" className="w-full">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-36 md:pt-44 pb-20 md:pb-28 grid gap-14 lg:grid-cols-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <span className="rule" aria-hidden />
            <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black tracking-[-0.04em] leading-[0.92] text-foreground text-balance mb-7">
              Book a call.
            </h1>
            <p className="text-lg md:text-xl text-foreground/85 leading-[1.55] max-w-[42ch] mb-10">
              Two minutes of answers, then a slot on the calendar. Every answer gets read before the call, so the call starts at your problem instead of at introductions.
            </p>

            <div className="panel">
              <div className="panel-bar"><span>the call</span><span>thirty minutes</span></div>
              <div className="panel-body">
                {CALL.map((row) => (
                  <div key={row.when} className="panel-row flex-col gap-1 sm:flex-row sm:gap-4">
                    <span className="panel-amber font-bold shrink-0 sm:w-24">{row.when}</span>
                    <span className="text-foreground/90">{row.line}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-8 text-base text-foreground/70 leading-relaxed max-w-[40ch]">
              Not ready for a call? Read the{" "}
              <Link href="/newsletter" className="text-foreground font-bold underline underline-offset-4 decoration-primary/60 hover:text-primary">newsletter</Link>
              {" "}or take the{" "}
              <Link href="/library" className="text-foreground font-bold underline underline-offset-4 decoration-primary/60 hover:text-primary">library</Link>
              {" "}first. Both are free.
            </p>
          </div>

          <div className="lg:col-span-7">
            <BookForm />
          </div>
        </div>
      </main>

      <NewsletterInline source="book" headline="Or start with the newsletter." body="One working system per issue, written by the person running it. Most people who book a call read it first." />

      <Footer />
    </div>
  );
}
