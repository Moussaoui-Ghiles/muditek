import { afterEach, describe, expect, it } from "vitest";
import {
  newsletterContentHash,
  validateNewsletterDraft,
} from "./newsletter-preflight";
import {
  assertNewsletterSendingEnabled,
  newsletterSendingEnabled,
  newsletterTestSendingEnabled,
} from "./newsletter-sending";
import {
  NEWSLETTER_CAMPAIGN_DRAFTS,
  NEWSLETTER_LIFECYCLE,
} from "./newsletter-programs";
import {
  NEWSLETTER_AUDIENCE_FILTERS,
  isNewsletterAudienceFilter,
} from "./newsletter-audience";

const originalEnabled = process.env.NEWSLETTER_EMAILS_ENABLED;
const originalTestEnabled = process.env.NEWSLETTER_TEST_EMAILS_ENABLED;

afterEach(() => {
  if (originalEnabled === undefined) delete process.env.NEWSLETTER_EMAILS_ENABLED;
  else process.env.NEWSLETTER_EMAILS_ENABLED = originalEnabled;
  if (originalTestEnabled === undefined) delete process.env.NEWSLETTER_TEST_EMAILS_ENABLED;
  else process.env.NEWSLETTER_TEST_EMAILS_ENABLED = originalTestEnabled;
});

describe("newsletter preflight", () => {
  it("accepts every lifecycle email", () => {
    for (const email of NEWSLETTER_LIFECYCLE) {
      const result = validateNewsletterDraft({
        subject: email.subject,
        previewText: email.previewText,
        html: email.html,
        campaignType: "editorial",
      });
      expect(result.errors).toEqual([]);
    }
  });

  it("accepts every outbound campaign draft", () => {
    for (const draft of NEWSLETTER_CAMPAIGN_DRAFTS) {
      const result = validateNewsletterDraft({
        subject: draft.subject,
        previewText: draft.previewText,
        html: draft.html,
        audienceFilter: draft.audienceFilter,
        campaignType: draft.campaignType,
      });
      expect(result.errors).toEqual([]);
    }
  });

  it("recognizes every supported audience cohort and rejects arbitrary input", () => {
    for (const filter of NEWSLETTER_AUDIENCE_FILTERS) {
      expect(isNewsletterAudienceFilter(filter)).toBe(true);
    }
    expect(isNewsletterAudienceFilter("EVERYONE_I_FEEL_LIKE")).toBe(false);
    expect(isNewsletterAudienceFilter(null)).toBe(false);
  });

  it("blocks unsafe links, inline images, and unknown placeholders", () => {
    const result = validateNewsletterDraft({
      subject: "Test",
      previewText: "Preview",
      campaignType: "editorial",
      html: `
        <p>This body has enough words to satisfy the minimum while still containing several unsafe pieces that must block launch.</p>
        <a href="http://localhost:3000/test">bad</a>
        <img src="data:image/png;base64,abc" />
        <p>{{UNKNOWN_FIELD}}</p>
      `,
    });
    expect(result.errors.map((error) => error.code)).toEqual(
      expect.arrayContaining(["invalid_link", "inline_image", "unknown_placeholder"]),
    );
  });

  it("requires a confirmation link for reactivation", () => {
    const result = validateNewsletterDraft({
      subject: "Confirm",
      previewText: "Please choose",
      campaignType: "reactivation",
      html: "<p>This reactivation message has enough words but gives the reader no explicit way to confirm continued permission.</p>",
    });
    expect(result.errors.map((error) => error.code)).toContain("confirmation_missing");
  });

  it("changes the approval hash when send-critical content changes", () => {
    const first = newsletterContentHash({
      subject: "One",
      previewText: "Preview",
      html: "<p>Body</p>",
      campaignType: "editorial",
    });
    const second = newsletterContentHash({
      subject: "Two",
      previewText: "Preview",
      html: "<p>Body</p>",
      campaignType: "editorial",
    });
    expect(first).not.toBe(second);
  });
});

describe("newsletter kill switch", () => {
  it("fails closed by default", () => {
    delete process.env.NEWSLETTER_EMAILS_ENABLED;
    expect(newsletterSendingEnabled()).toBe(false);
    expect(() => assertNewsletterSendingEnabled()).toThrow(/disabled/i);
  });

  it("enables only for the exact true value", () => {
    process.env.NEWSLETTER_EMAILS_ENABLED = "true";
    expect(newsletterSendingEnabled()).toBe(true);
    expect(() => assertNewsletterSendingEnabled()).not.toThrow();
  });

  it("allows isolated inbox tests without enabling subscriber sends", () => {
    delete process.env.NEWSLETTER_EMAILS_ENABLED;
    process.env.NEWSLETTER_TEST_EMAILS_ENABLED = "true";
    expect(newsletterTestSendingEnabled()).toBe(true);
    expect(newsletterSendingEnabled()).toBe(false);
    expect(() => assertNewsletterSendingEnabled()).toThrow(/disabled/i);
  });
});
