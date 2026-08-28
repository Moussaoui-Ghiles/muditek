import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revenue Leak Calculator | B2B SaaS Pipeline Analysis | Muditek",
  description:
    "Calculator estimating annual revenue leakage from speed-to-lead decay, pipeline conversion gaps, and excess churn in 2026. No email required.",
  alternates: { canonical: "https://muditek.com/tools/revenue-leak-calculator" },
  openGraph: {
    title: "Revenue Leak Calculator | B2B SaaS Pipeline Analysis",
    description:
      "Enter your numbers. See where your B2B SaaS pipeline is leaking revenue, broken down by category with the formula shown.",
    url: "https://muditek.com/tools/revenue-leak-calculator",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
