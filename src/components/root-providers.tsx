"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@/components/google-analytics";
import { NewsletterConsentCompletion } from "@/components/newsletter-consent-completion";
import { PostHogProvider } from "@/components/posthog-provider";

function isSensitiveNewsletterPath(pathname: string): boolean {
  return pathname.startsWith("/preferences/") || pathname.startsWith("/newsletter/confirm/");
}

export function RootProviders({
  children,
  posthogKey,
  posthogHost,
  gaMeasurementId,
}: {
  children: React.ReactNode;
  posthogKey?: string;
  posthogHost: string;
  gaMeasurementId?: string;
}) {
  const pathname = usePathname() || "/";

  if (isSensitiveNewsletterPath(pathname)) return <>{children}</>;

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
            subtitle: "Access your skill bundles, download history, and account settings.",
          },
        },
        signUp: {
          start: {
            title: "Create your Muditek account",
            subtitle: "Download advanced skill bundles. Newsletter consent stays separate.",
          },
        },
      }}
    >
      <PostHogProvider apiKey={posthogKey} host={posthogHost}>
        <NewsletterConsentCompletion />
        {children}
      </PostHogProvider>
      <Analytics />
      <SpeedInsights />
      <GoogleAnalytics measurementId={gaMeasurementId} />
    </ClerkProvider>
  );
}
