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
  title: "Muditek | AI Transformation Partner and Outbound Systems for B2B",
  description:
    "Muditek audits how your work actually happens, builds the AI systems that run it, and trains your team to keep them running. Outbound engines built and operated for you.",
  alternates: { canonical: "https://muditek.com" },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Muditek | AI Transformation Partner and Outbound Systems for B2B",
    description:
      "We audit how your work actually happens, build the AI systems that run it, and train your team to keep them running. Outbound built and operated for you.",
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
          colorPrimary: "#F59E0B",
          colorBackground: "#0C1118",
          colorInputBackground: "#050A0F",
          colorInputText: "#e8e8ec",
          colorText: "#e8e8ec",
          colorTextSecondary: "#a9b3bd",
          colorDanger: "#f87171",
          borderRadius: "6px",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
        },
      }}
      localization={{
        signIn: {
          start: {
            title: "Sign in to Muditek",
            subtitle: "Your library: skills, resources, tools, and the newsletter archive.",
          },
        },
        signUp: {
          start: {
            title: "Create your Muditek account",
            subtitle: "One email. The library, the tools, and the newsletter archive in one place.",
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
                  "AI transformation partner and outbound systems for B2B companies. Workflow audit, AI-executable business context, systems built and operated, teams trained.",
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
                  availableLanguage: ["en"],
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
                  "AI transformation partner and outbound systems for B2B companies. Built and operated by Ghiles Moussaoui.",
                publisher: { "@id": "https://muditek.com/#organization" },
                inLanguage: "en",
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
