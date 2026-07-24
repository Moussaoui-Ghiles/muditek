import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscribe | Muditek Newsletter",
  description:
    "One real business workflow each week, including the inputs, instructions, source material, AI steps, and human checks.",
  alternates: { canonical: "https://muditek.com/subscribe" },
  openGraph: {
    title: "Subscribe | Muditek Newsletter",
    description:
      "One real business workflow each week. Pick your topics and unsubscribe any time.",
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
