import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome | Muditek",
  description: "Payment confirmed. Redirecting you to your portal.",
  robots: { index: false, follow: false },
};

export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mudikit-dark min-h-[100dvh] bg-background text-foreground">
      {children}
    </div>
  );
}
