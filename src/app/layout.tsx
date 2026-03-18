import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WhatsAppBubble } from "@/components/whatsapp-bubble";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "900"],
});

export const metadata: Metadata = {
  title: "Muditek — Redefining the Future of Business with AI Systems",
  description:
    "We diagnose where companies lose money to manual operations and build AI systems that fix it. On-premises AI for telecom, pipeline diagnostics for B2B SaaS, operational infrastructure for investment firms.",
  openGraph: {
    title: "Muditek — Redefining the Future of Business with AI Systems",
    description:
      "Your best people are stuck doing work a machine should handle. We find where you're bleeding money — and build the systems that fix it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans noise`}>
        {children}
        <WhatsAppBubble />
      </body>
    </html>
  );
}
