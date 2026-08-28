import { describe, expect, it } from "vitest";
import { htmlToPlainText, normalizePublicIssueHtml, wrapIssueHtml } from "./newsletter-html";

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

  it("replaces the retired Beehiiv publication logo on public issues", () => {
    const html = '<img src="https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto/uploads/publication/logo/2effd3a4-1768-4ed7-8c9b-ff764a036162/thumb_WhatsApp_Image_2025-05-23_at_00.49.13_a69bd58a.jpg" alt="">';

    expect(normalizePublicIssueHtml(html)).toBe('<img src="/images/ghiles.jpg" alt="">');
  });
});
