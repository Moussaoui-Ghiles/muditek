import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "MudiKit | 15+ Claude Code skills, 6 playbooks, 1 vault | $47/mo",
  description:
    "The Claude Code skills, playbooks, and vault template I use to run Muditek. $47 a month. New drops every week. Cancel anytime.",
  alternates: {
    canonical: "https://muditek.com/mudikit",
  },
  openGraph: {
    title: "MudiKit · $47/mo",
    description:
      "The Claude Code skills, playbooks, and vault template I use to run Muditek. New drops every week. Cancel anytime.",
    url: "https://muditek.com/mudikit",
    type: "website",
    images: [
      {
        url: "https://muditek.com/mudikit/opengraph-image",
        width: 1200,
        height: 630,
        alt: "MudiKit — $47/mo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MudiKit · $47/mo",
    description:
      "The Claude Code skills, playbooks, and vault template I use to run Muditek. New drops every week.",
    images: ["https://muditek.com/mudikit/opengraph-image"],
  },
};

const PRODUCT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://muditek.com/mudikit#kit",
  name: "MudiKit",
  description:
    "Subscription kit of Claude Code skills, implementation playbooks, vault template, and outreach templates used to run Muditek.",
  brand: {
    "@type": "Brand",
    name: "Muditek",
  },
  offers: {
    "@type": "Offer",
    price: "47",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://muditek.com/mudikit",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: "47",
      priceCurrency: "USD",
      unitText: "MONTH",
      billingDuration: "P1M",
    },
  },
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://muditek.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "MudiKit",
      item: "https://muditek.com/mudikit",
    },
  ],
};

export default function MudikitLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mudikit-dark">
      <JsonLd data={[PRODUCT_SCHEMA, BREADCRUMB_SCHEMA]} />
      {children}
    </div>
  );
}
