import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { auditCsvList } from "../../lib/csv-list-quality";
import { buildCsvAuditReport } from "./csv-audit-report";

describe("CSV audit report", () => {
  it("exports row numbers and issue labels without lead contents", () => {
    const leadContents = "sensitive.person@example.com";
    const result = auditCsvList([
      "email,title,domain,verification,icp",
      `${leadContents},,invalid domain,unknown,`,
    ].join("\n"));

    expect("rowCount" in result).toBe(true);
    if (!("rowCount" in result)) return;

    const report = buildCsvAuditReport(result);
    expect(report).toBe([
      "row_number,issue_type",
      "2,Missing title",
      "2,Invalid domain",
      "2,Unverified email",
      "2,Missing ICP review",
    ].join("\n"));
    expect(report).not.toContain(leadContents);
    expect(report).not.toContain("invalid domain");
  });

  it("moves focus to each browser-tool result without removing its live region", () => {
    const source = readFileSync(join(process.cwd(), "src/components/library/public-tools.tsx"), "utf8");

    expect(source.match(/focusResult\(resultRef\.current\)/g)).toHaveLength(3);
    expect(source.match(/ref=\{resultRef\} tabIndex=\{-1\}/g)).toHaveLength(3);
    expect(source.match(/aria-live="polite" aria-atomic="true"/g)).toHaveLength(3);
  });
});
