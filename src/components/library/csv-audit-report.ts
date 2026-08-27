import type { CsvListIssueCode, CsvListQualityAudit } from "../../lib/csv-list-quality";

export const CSV_ISSUE_LABELS: Record<CsvListIssueCode, string> = {
  duplicate: "Duplicate email",
  missing_title: "Missing title",
  invalid_domain: "Invalid domain",
  unverified: "Unverified email",
  missing_icp: "Missing ICP review",
  rejected_icp: "Rejected by ICP",
};

export function buildCsvAuditReport(result: CsvListQualityAudit): string {
  const rows = result.issues.map((issue) => `${issue.rowNumber},${CSV_ISSUE_LABELS[issue.code]}`);
  return ["row_number,issue_type", ...rows].join("\n");
}
