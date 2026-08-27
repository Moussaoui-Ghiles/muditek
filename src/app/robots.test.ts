import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots policy", () => {
  it("keeps public acquisition routes crawlable and account routes protected", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const general = rules.find((rule) => rule.userAgent === "*");

    expect(general?.allow).toBe("/");
    expect(general?.disallow).toContain("/portal/");
    expect(general?.disallow).not.toContain("/library");
    expect(general?.disallow).not.toContain("/skills/");
    expect(result.sitemap).toBe("https://muditek.com/sitemap.xml");
  });

  it("separates search and user-agent access from training crawler access", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];

    expect(rules.find((rule) => rule.userAgent === "OAI-SearchBot")?.allow).toBe("/");
    expect(rules.find((rule) => rule.userAgent === "ChatGPT-User")?.allow).toBe("/");
    expect(rules.find((rule) => rule.userAgent === "GPTBot")?.disallow).toBe("/");
  });
});
