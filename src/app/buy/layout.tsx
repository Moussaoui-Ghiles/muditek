import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function BuyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mudikit-dark min-h-[100dvh] bg-background text-foreground">
      {children}
    </div>
  );
}
