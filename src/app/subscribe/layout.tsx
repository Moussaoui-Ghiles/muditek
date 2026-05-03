import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscribe | B2B Agents Newsletter | Muditek",
  description:
    "Join 5,000+ operators on the B2B Agents newsletter. AI automation systems, revenue operations, and operator playbooks delivered weekly. Free, unsubscribe anytime.",
  alternates: { canonical: "https://muditek.com/subscribe" },
  openGraph: {
    title: "Subscribe | B2B Agents Newsletter | Muditek",
    description:
      "AI automation systems, revenue operations, and operator playbooks delivered weekly. Pick your topics. Free, unsubscribe anytime.",
    url: "https://muditek.com/subscribe",
    type: "website",
  },
};

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mudikit-dark min-h-[100dvh] bg-background text-foreground">
      {children}
    </div>
  );
}
