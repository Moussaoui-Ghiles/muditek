import { describe, expect, it } from "vitest";
import { preferenceRecordAction } from "./newsletter-preferences";

describe("newsletter preference records", () => {
  it("does not create a subscriber for an account without newsletter consent", () => {
    expect(preferenceRecordAction(false)).toBe("none");
  });

  it("can ensure a token for an existing subscriber without changing subscription status", () => {
    expect(preferenceRecordAction(true)).toBe("ensure-token-only");
  });
});
