import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email preferences | Muditek",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

export default function PreferencesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mudikit-dark min-h-[100dvh] bg-background text-foreground">
      {children}
    </div>
  );
}
