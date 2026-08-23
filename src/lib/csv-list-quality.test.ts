import { describe, expect, it } from "vitest";
import { auditCsvList } from "./csv-list-quality";

describe("auditCsvList", () => {
  it("checks duplicates, titles, domains, verification, and ICP fields locally", () => {
    const csv = [
      "email,title,domain,verification_status,icp_fit",
      "alice@a.com,Founder,a.com,verified,yes",
      "ALICE@a.com,CEO,https://a.com,valid,no",
      "bob@b.com,,not a domain,catch-all,",
      'carol@c.com,"VP, Sales",c.com,,yes',
    ].join("\n");

    const result = auditCsvList(csv);
    if ("error" in result) throw new Error(result.error);

    expect(result).toMatchObject({
      rowCount: 4,
      duplicateRows: 1,
      missingTitles: 1,
      invalidDomains: 1,
      unverifiedRows: 2,
      missingIcpChecks: 1,
      rejectedByIcp: 1,
      passed: false,
    });
    expect(result.issues).toContainEqual({ rowNumber: 3, code: "duplicate" });
    expect(result.issues).toContainEqual({ rowNumber: 4, code: "invalid_domain" });
    expect(result.issues.every((issue) => Object.keys(issue).sort().join(",") === "code,rowNumber")).toBe(true);
  });

  it("accepts common header aliases and a clean list", () => {
    const csv = [
      "Email Address,Job Title,Company Website,Email Status,ICP Qualified",
      "one@example.com,Founder,example.com,deliverable,true",
      "two@example.org,Head of Sales,https://example.org/team,verified,fit",
    ].join("\r\n");

    expect(auditCsvList(csv)).toMatchObject({
      rowCount: 2,
      duplicateRows: 0,
      missingTitles: 0,
      invalidDomains: 0,
      unverifiedRows: 0,
      missingIcpChecks: 0,
      rejectedByIcp: 0,
      passed: true,
    });
  });

  it("returns a useful header error instead of guessing columns", () => {
    expect(auditCsvList("name,company\nJane,Acme")).toEqual({
      error: "The CSV needs email, title, domain, verification, and ICP columns.",
    });
  });
});
