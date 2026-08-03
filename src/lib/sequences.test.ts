import { describe, expect, it } from "vitest";
import {
  WELCOME_SEQUENCE,
  WELCOME_SEQUENCE_ENROLLMENT_TYPE,
  welcomeSequenceIdempotencyKey,
} from "./sequences";

const context = {
  baseUrl: "https://muditek.com",
  preferencesUrl: "https://muditek.com/preferences/test-token",
  unsubscribeUrl: "https://muditek.com/api/newsletter/unsubscribe/test-token",
};

describe("Muditek welcome sequence", () => {
  it("contains exactly three emails sent on days 0, 3, and 7", () => {
    expect(WELCOME_SEQUENCE).toHaveLength(3);
    expect(WELCOME_SEQUENCE.map((email) => email.step)).toEqual([1, 2, 3]);
    expect(WELCOME_SEQUENCE.map((email) => email.delayDays)).toEqual([0, 3, 7]);
    expect(WELCOME_SEQUENCE_ENROLLMENT_TYPE).toBe("welcome-sequence-v1-e1");
  });

  it("routes Email 1 to the two approved playbooks", () => {
    const html = WELCOME_SEQUENCE[0].buildHtml("there", context);

    expect(html).toContain("/portal/playbooks/judgment-moat");
    expect(html).toContain("/portal/playbooks/skill-creator-blueprint");
    expect(html).toContain("Welcome, and thank you for subscribing.");
  });

  it("routes Email 2 to Offer Creation and Cold Offer Review", () => {
    const html = WELCOME_SEQUENCE[1].buildHtml("there", context);

    expect(html).toContain("/portal/skills/offer-creation");
    expect(html).toContain("/portal/skills/cold-offer-review");
    expect(html).toContain("Run Offer Creation first. Run Cold Offer Review second.");
  });

  it("qualifies before pitching in Email 3 and asks for a reply", () => {
    const html = WELCOME_SEQUENCE[2].buildHtml("there", context);
    const qualification = html.indexOf("A new client is worth at least €10,000");
    const offer = html.indexOf("I can run the outbound for you");

    expect(qualification).toBeGreaterThan(-1);
    expect(offer).toBeGreaterThan(qualification);
    expect(html).toContain("reply to this email");
    expect(html).not.toContain("calendly.com");
    expect(html).not.toContain("Email 1");
    expect(html).not.toContain("Email 2");
  });

  it("includes preference and unsubscribe links in every email", () => {
    for (const email of WELCOME_SEQUENCE) {
      const html = email.buildHtml("there", context);
      expect(html).toContain(context.preferencesUrl);
      expect(html).toContain(context.unsubscribeUrl);
      expect(html).not.toContain("—");
    }
  });

  it("uses one stable, privacy-safe Resend idempotency key per recipient", () => {
    const lower = welcomeSequenceIdempotencyKey("person@example.com");
    const mixedCase = welcomeSequenceIdempotencyKey(" Person@Example.com ");

    expect(mixedCase).toBe(lower);
    expect(lower).toMatch(/^welcome-sequence-v1-e1:[a-f0-9]{64}$/);
    expect(lower).not.toContain("person@example.com");
  });
});
