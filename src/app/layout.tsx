import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@/components/google-analytics";
import { PostHogProvider } from "@/components/posthog-provider";
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

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif-display",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://muditek.com"),
  title: "Muditek | AI Systems That Eliminate Operational Waste",
  description:
    "We diagnose where companies lose money to manual operations and build the AI systems that fix it. On-premises AI, revenue recovery, and operational infrastructure.",
  alternates: { canonical: "https://muditek.com" },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Muditek | AI Systems That Eliminate Operational Waste",
    description:
      "We diagnose where companies lose money to manual operations and build the AI systems that fix it. On-prem AI, revenue recovery, ops infrastructure.",
    url: "https://muditek.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_ID?.trim();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        logoImageUrl: "/icon.svg",
        variables: {
          colorPrimary: "#e8e8ec",
          colorBackground: "#0a0a0c",
          colorInputBackground: "#151517",
          colorInputText: "#e8e8ec",
          colorText: "#e8e8ec",
          colorTextSecondary: "#a0a0a6",
          colorDanger: "#f87171",
          borderRadius: "6px",
          fontFamily: "var(--font-geist), system-ui, sans-serif",
        },
      }}
      localization={{
        signIn: {
          start: {
            title: "Sign in to Muditek",
            subtitle: "Welcome back. Access your portal, playbooks, and archive.",
          },
        },
        signUp: {
          start: {
            title: "Create your Muditek account",
            subtitle: "One email. Portal + newsletter archive. Unsubscribe anytime.",
          },
        },
      }}
    >
      <html
        lang="en"
        className={`scroll-smooth ${inter.variable} ${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      >
        <body className="font-sans noise">
          <JsonLd
            data={[
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": "https://muditek.com/#organization",
                name: "Muditek",
                url: "https://muditek.com",
                logo: {
                  "@type": "ImageObject",
                  url: "https://muditek.com/icon.svg",
                  width: 512,
                  height: 512,
                },
                description:
                  "AI systems that eliminate operational waste. We diagnose where companies lose money to manual operations and build AI systems that fix it.",
                founder: {
                  "@type": "Person",
                  "@id": "https://muditek.com/#ghiles",
                  name: "Ghiles Moussaoui",
                  url: "https://www.linkedin.com/in/ghiles-moussaoui-b36218250/",
                },
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "sales",
                  email: "biz@ghiless.com",
                  url: "https://muditek.com/about",
                  availableLanguage: ["en", "fr"],
                },
                sameAs: [
                  "https://www.linkedin.com/in/ghiles-moussaoui-b36218250/",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": "https://muditek.com/#website",
                url: "https://muditek.com",
                name: "Muditek",
                description:
                  "AI systems that eliminate operational waste. On-premises AI for telecom, revenue recovery for B2B SaaS, operational infrastructure for investment firms.",
                publisher: { "@id": "https://muditek.com/#organization" },
                inLanguage: "en",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate:
                      "https://muditek.com/newsletter?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "https://muditek.com/#ghiles",
                name: "Ghiles Moussaoui",
                url: "https://muditek.com/about",
                image: "https://muditek.com/images/ghiles.jpg",
                jobTitle: "Founder",
                worksFor: { "@id": "https://muditek.com/#organization" },
                sameAs: [
                  "https://www.linkedin.com/in/ghiles-moussaoui-b36218250/",
                ],
              },
            ]}
          />
          <PostHogProvider apiKey={posthogKey} host={posthogHost}>{children}</PostHogProvider>
          <WhatsAppBubble />
          <ExitIntent />
          <Analytics />
          <SpeedInsights />
          <GoogleAnalytics measurementId={gaMeasurementId} />
        </body>
      </html>
    </ClerkProvider>
  );
}
