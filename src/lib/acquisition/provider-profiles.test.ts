import { afterEach, describe, expect, it } from "vitest";
import {
  getProviderProfile,
  getPublishedProviderProfiles,
  getVisibleProviderProfiles,
  PROVIDER_PROFILES,
} from "./provider-profiles";

const originalVercelEnv = process.env.VERCEL_ENV;

afterEach(() => {
  if (originalVercelEnv === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = originalVercelEnv;
});

describe("provider profiles", () => {
  it("owns one canonical and one query per profile", () => {
    expect(new Set(PROVIDER_PROFILES.map((item) => item.canonicalPath)).size).toBe(PROVIDER_PROFILES.length);
    expect(new Set(PROVIDER_PROFILES.map((item) => item.primaryQuery)).size).toBe(PROVIDER_PROFILES.length);
  });

  it("contains all required source fields", () => {
    for (const profile of PROVIDER_PROFILES) {
      expect(profile.sourceUrl).toMatch(/^https:\/\//);
      expect(profile.lastChecked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(profile.releaseWave).toBe(3);
    }
  });

  it("shows published profiles on previews", () => {
    process.env.VERCEL_ENV = "preview";
    expect(getVisibleProviderProfiles()).toHaveLength(10);
    expect(getProviderProfile("belkins")?.providerName).toBe("Belkins");
  });

  it("shows published profiles in production", () => {
    process.env.VERCEL_ENV = "production";
    expect(getVisibleProviderProfiles()).toHaveLength(10);
    expect(getProviderProfile("belkins")?.providerName).toBe("Belkins");
    expect(getPublishedProviderProfiles()).toHaveLength(10);
  });
});
