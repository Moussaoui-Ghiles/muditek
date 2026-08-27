import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Data and Privacy | Muditek",
  description: "What Muditek records when you use the public library, browser tools, newsletter, account, and booking link.",
  alternates: { canonical: "https://muditek.com/privacy" },
};

const SECTIONS = [
  {
    title: "Public browser tools",
    body: "Tool inputs and results stay in your browser. Muditek records the tool name and completion event. It does not record financial values, CSV rows, lead data, or generated briefs.",
  },
  {
    title: "Site analytics",
    body: "Muditek uses PostHog, Google Analytics, and Vercel Analytics to measure page views and the funnel events described on this site. Events can include the asset, lane, placement, page, referrer, and UTM values. They exclude form contents and tool inputs.",
  },
  {
    title: "Free account",
    body: "Clerk provides account authentication. Muditek connects the account to skill downloads and recent activity. Creating an account does not subscribe or resubscribe the email address to the newsletter.",
  },
  {
    title: "Newsletter",
    body: "A newsletter subscription stores the email address, selected topics, consent source, and subscription status. An unsubscribed address remains unsubscribed unless its private preference link is used to resubscribe.",
  },
  {
    title: "Booking",
    body: "Booking links open Microsoft Bookings in a new tab. Microsoft receives the information you choose to submit there under its own privacy terms.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <main id="main-content">
        <header className="border-b border-white/[0.06] pb-16 pt-36 md:pb-20 md:pt-44">
          <div className="mx-auto w-full max-w-[900px] px-6 md:px-12">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Data and privacy</p>
            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.035em] sm:text-6xl">What the site records.</h1>
            <p className="mt-7 max-w-[65ch] text-lg leading-8 text-foreground/75">This page describes the current public site, member account, newsletter, and booking path. It was last updated on 23 August 2026.</p>
          </div>
        </header>

        <section className="py-14 md:py-20">
          <div className="mx-auto w-full max-w-[900px] divide-y divide-white/[0.08] border-y border-white/[0.08] px-6 md:px-12">
            {SECTIONS.map((section) => (
              <section key={section.title} className="grid gap-4 py-7 md:grid-cols-[190px_1fr]">
                <h2 className="text-base font-black text-foreground">{section.title}</h2>
                <p className="text-sm leading-7 text-foreground/70">{section.body}</p>
              </section>
            ))}
          </div>
        </section>

        <section className="border-t border-white/[0.06] py-14">
          <div className="mx-auto w-full max-w-[900px] px-6 md:px-12">
            <h2 className="text-2xl font-black tracking-[-0.02em]">Questions or requests</h2>
            <p className="mt-4 max-w-[65ch] text-sm leading-7 text-foreground/70">Email <a href="mailto:biz@ghiless.com" className="text-primary underline underline-offset-4">biz@ghiless.com</a>. Newsletter subscribers can also use the private preference link in any newsletter email.</p>
            <Link href="/library" className="mt-7 inline-flex min-h-11 items-center text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Return to the library →</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
