import { describe, expect, it } from "vitest";
import { APPOINTMENT_SETTING_PROVIDERS } from "../lib/appointment-setting-providers";
import {
  getVisibleProviders,
  MAX_COMPARISON_PROVIDERS,
  updateProviderSelection,
} from "./appointment-setting-pricing-index";

describe("appointment-setting pricing index", () => {
  it("searches provider facts without changing the source records", () => {
    const result = getVisibleProviders(APPOINTMENT_SETTING_PROVIDERS, "warm phone follow-up", false, "name");

    expect(result.map((provider) => provider.name)).toEqual(["OneAway"]);
    expect(APPOINTMENT_SETTING_PROVIDERS).toHaveLength(30);
  });

  it("can limit the directory to providers with a public price", () => {
    const result = getVisibleProviders(APPOINTMENT_SETTING_PROVIDERS, "", true, "name");

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((provider) => provider.hasPublicPrice)).toBe(true);
  });

  it("puts public prices first without claiming that unlike prices are comparable", () => {
    const result = getVisibleProviders(APPOINTMENT_SETTING_PROVIDERS, "", false, "public-price");
    const firstMissingPrice = result.findIndex((provider) => !provider.hasPublicPrice);

    expect(firstMissingPrice).toBeGreaterThan(0);
    expect(result.slice(0, firstMissingPrice).every((provider) => provider.hasPublicPrice)).toBe(true);
    expect(result.slice(firstMissingPrice).every((provider) => !provider.hasPublicPrice)).toBe(true);
  });

  it("puts stated contract terms before missing contract information", () => {
    const result = getVisibleProviders(APPOINTMENT_SETTING_PROVIDERS, "", false, "stated-contract");
    const leadiumIndex = result.findIndex((provider) => provider.name === "Leadium");
    const abstraktIndex = result.findIndex((provider) => provider.name === "Abstrakt Marketing Group");

    expect(leadiumIndex).toBeLessThan(abstraktIndex);
  });

  it("adds, removes, and caps a provider comparison", () => {
    const selected = APPOINTMENT_SETTING_PROVIDERS
      .slice(0, MAX_COMPARISON_PROVIDERS)
      .reduce<string[]>((current, provider) => updateProviderSelection(current, provider.name), []);

    expect(selected).toHaveLength(MAX_COMPARISON_PROVIDERS);
    expect(updateProviderSelection(selected, APPOINTMENT_SETTING_PROVIDERS[4].name)).toEqual(selected);
    expect(updateProviderSelection(selected, selected[0])).toEqual(selected.slice(1));
  });
});
