import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscribe | Newsletter | Muditek",
  description:
    "The Muditek newsletter. One working system per issue: outbound engines, lead research, AI agents running operations. Unsubscribe anytime.",
  alternates: { canonical: "https://muditek.com/subscribe" },
  openGraph: {
    title: "Subscribe | Newsletter | Muditek",
    description:
      "One working system per issue. Pick your topics. Unsubscribe anytime.",
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
