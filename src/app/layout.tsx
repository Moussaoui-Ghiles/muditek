import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { WhatsAppBubble } from "@/components/whatsapp-bubble";
import { ExitIntent } from "@/components/exit-intent";
import { JsonLd } from "@/components/json-ld";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "900"],
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muditek | AI Systems That Eliminate Operational Waste",
  description:
    "We diagnose where companies lose money to manual operations and build AI systems that fix it. On-premises AI for telecom, revenue recovery for B2B SaaS, operational infrastructure for investment firms.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Muditek | AI Systems That Eliminate Operational Waste",
    description:
      "Your best people are stuck doing work a machine should handle. We find where you're bleeding money, then build the systems that fix it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`scroll-smooth ${inter.variable} ${geist.variable} ${geistMono.variable}`}
      >
        <body className="font-sans noise">
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Muditek",
              url: "https://muditek.com",
              logo: "https://muditek.com/icon.svg",
              description: "AI systems that eliminate operational waste. We diagnose where companies lose money to manual operations and build AI systems that fix it.",
              founder: {
                "@type": "Person",
                name: "Ghiles Moussaoui",
                url: "https://www.linkedin.com/in/ghiles-moussaoui-b36218250/",
              },
              sameAs: [
                "https://www.linkedin.com/in/ghiles-moussaoui-b36218250/",
              ],
            }}
          />
          {children}
          <WhatsAppBubble />
          <ExitIntent />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
