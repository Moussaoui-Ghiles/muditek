import { describe, expect, it } from "vitest";
import { htmlToPlainText, wrapIssueHtml } from "./newsletter-html";

describe("newsletter email rendering", () => {
  it("personalizes confirmation and unsubscribe links", () => {
    const html = wrapIssueHtml(
      '<p>Stay subscribed: <a href="{{NEWSLETTER_CONFIRM_URL}}">confirm</a></p>',
      {
        confirmUrl: "https://muditek.com/newsletter/confirm/issue/token",
        prefsUrl: "https://muditek.com/preferences/token",
        unsubUrl: "https://muditek.com/api/newsletter/unsubscribe/token",
      },
    );

    expect(html).toContain("https://muditek.com/newsletter/confirm/issue/token");
    expect(html).toContain("https://muditek.com/api/newsletter/unsubscribe/token");
    expect(html).not.toContain("{{NEWSLETTER_CONFIRM_URL}}");
  });

  it("produces a readable plain-text fallback", () => {
    expect(htmlToPlainText("<h1>Title</h1><p>Useful copy.</p>")).toBe(
      "Title\n\nUseful copy.",
    );
  });
});
