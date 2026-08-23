import { describe, expect, it } from "vitest";
import { newsletterActionForAccountCreation } from "./newsletter-consent";

describe("account newsletter consent", () => {
  it("creates no subscription when consent is off", () => {
    expect(newsletterActionForAccountCreation(false, null)).toBe("none");
  });

  it("keeps an unsubscribed address unsubscribed when consent is off", () => {
    expect(newsletterActionForAccountCreation(false, "unsubscribed")).toBe("none");
  });

  it("subscribes only after explicit consent", () => {
    expect(newsletterActionForAccountCreation(true, null)).toBe("subscribe");
  });

  it("never reactivates an unsubscribed address through account creation", () => {
    expect(newsletterActionForAccountCreation(true, "unsubscribed")).toBe("none");
  });
});
