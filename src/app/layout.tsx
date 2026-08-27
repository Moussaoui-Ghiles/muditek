import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { RootProviders } from "@/components/root-providers";
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
  title: "Muditek | Appointment Setting and AI Implementation",
  description:
    "B2B appointment setting, practical AI implementation, and a public library of working methods and tools.",
  alternates: { canonical: "https://muditek.com" },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Muditek | Appointment Setting and AI Implementation",
    description:
      "B2B appointment setting, practical AI implementation, and a public library of working methods and tools.",
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
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
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
                  "Appointment-setting systems, a public operating library, and practical AI implementation.",
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
                  "B2B appointment setting, practical AI implementation, and a public library of working methods and tools.",
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
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <RootProviders posthogKey={posthogKey} posthogHost={posthogHost} gaMeasurementId={gaMeasurementId}>
            {children}
          </RootProviders>
      </body>
    </html>
  );
}
