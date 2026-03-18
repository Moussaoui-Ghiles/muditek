import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "900"],
});

export const metadata: Metadata = {
  title: "Muditek — AI Systems That Eliminate Operational Waste",
  description:
    "On-premises AI systems for telecom, B2B SaaS, and investment firms. We find where you're bleeding money and build the systems that fix it.",
  openGraph: {
    title: "Muditek — AI Systems That Eliminate Operational Waste",
    description:
      "We find where you're bleeding money — and build the AI systems that fix it.",
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
      <body className={`${inter.variable} font-sans noise`}>{children}</body>
    </html>
  );
}
