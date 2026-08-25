import { APPOINTMENT_SETTING_PROVIDERS } from "../appointment-setting-providers";
import { isAcquisitionPreviewEnvironment } from "./publication";

export type ProviderProfileStatus = "draft" | "review" | "published" | "retired";

export type ProviderProfileDefinition = {
  slug: string;
  title: string;
  description: string;
  canonicalPath: `/appointment-setting/providers/${string}`;
  primaryQuery: string;
  searchIntent: "commercial-investigation";
  providerName: string;
  sourceUrl: string;
  lastChecked: string;
  releaseWave: 3;
  status: ProviderProfileStatus;
};

const REVIEWED_PROVIDERS = [
  ["abstrakt", "Abstrakt Marketing Group"],
  ["belkins", "Belkins"],
  ["cleverly", "Cleverly"],
  ["leadium", "Leadium"],
  ["leadriver", "Leadriver"],
  ["oneaway", "OneAway"],
  ["pearl-lemon-leads", "Pearl Lemon Leads"],
  ["saleshive", "SalesHive"],
  ["salesbread", "SalesBread"],
  ["salesroads", "SalesRoads"],
] as const;

export const PROVIDER_PROFILES: ProviderProfileDefinition[] = REVIEWED_PROVIDERS.map(
  ([slug, providerName]) => {
    const provider = APPOINTMENT_SETTING_PROVIDERS.find((item) => item.name === providerName);

    if (!provider) {
      throw new Error(`Missing provider record: ${providerName}`);
    }

    return {
      slug,
      title: `${providerName} pricing and appointment-setting terms`,
      description: `Sourced ${providerName} pricing, billing model, contract term, channels, qualification language, and no-show treatment.`,
      canonicalPath: `/appointment-setting/providers/${slug}`,
      primaryQuery: `${providerName.toLowerCase()} pricing`,
      searchIntent: "commercial-investigation",
      providerName,
      sourceUrl: provider.sourceUrl,
      lastChecked: "2026-08-24",
      releaseWave: 3,
      status: "published",
    };
  },
);

export function isAcquisitionPreview() {
  return isAcquisitionPreviewEnvironment();
}

export function getVisibleProviderProfiles() {
  const preview = isAcquisitionPreview();
  return PROVIDER_PROFILES.filter(
    (profile) => profile.status === "published" || (preview && ["draft", "review"].includes(profile.status)),
  );
}

export function getPublishedProviderProfiles() {
  return PROVIDER_PROFILES.filter((profile) => profile.status === "published");
}

export function getProviderProfile(slug: string) {
  return getVisibleProviderProfiles().find((profile) => profile.slug === slug);
}

export function getProviderRecord(providerName: string) {
  return APPOINTMENT_SETTING_PROVIDERS.find((provider) => provider.name === providerName);
}
