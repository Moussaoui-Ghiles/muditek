import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revenue Leak Calculator | Free B2B SaaS Pipeline Analysis | Muditek",
  description: "Free calculator that estimates annual revenue leakage from speed-to-lead decay, pipeline conversion gaps, and excess churn. No email required.",
  openGraph: {
    title: "Revenue Leak Calculator | Free B2B SaaS Pipeline Analysis",
    description: "Enter your numbers. See where your B2B SaaS pipeline is leaking revenue, broken down by category with the formula shown.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
