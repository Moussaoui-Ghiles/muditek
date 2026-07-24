import { describe, expect, it } from "vitest";
import {
  campaignRemaining,
  campaignSafetyStopReason,
  isRetryableResendError,
} from "./newsletter-campaign-policy";

describe("newsletter campaign safety policy", () => {
  it("does not stop before there is a meaningful delivery sample", () => {
    expect(
      campaignSafetyStopReason({
        sent: 50,
        delivered: 45,
        bounced: 5,
        complained: 0,
      }),
    ).toBeNull();
  });

  it("stops before Resend's four percent bounce ceiling", () => {
    expect(
      campaignSafetyStopReason({
        sent: 1_000,
        delivered: 965,
        bounced: 35,
        complained: 0,
      }),
    ).toContain("bounce rate 3.50%");
  });

  it("stops when the complaint safety ceiling is reached", () => {
    expect(
      campaignSafetyStopReason({
        sent: 2_000,
        delivered: 1_950,
        bounced: 20,
        complained: 1,
      }),
    ).toContain("complaint rate 0.050%");
  });

  it("never reports a negative remaining count", () => {
    expect(campaignRemaining(100, 90, 8, 5)).toBe(0);
  });

  it("retries transient Resend failures but not validation failures", () => {
    expect(isRetryableResendError("rate_limit_exceeded")).toBe(true);
    expect(isRetryableResendError("internal_server_error")).toBe(true);
    expect(isRetryableResendError("validation_error")).toBe(false);
    expect(isRetryableResendError("invalid_api_key")).toBe(false);
  });
});
