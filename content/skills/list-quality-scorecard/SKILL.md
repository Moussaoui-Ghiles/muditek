---
name: list-quality-scorecard
description: Audit a lead CSV before sending by reporting duplicate, title, domain, verification, and ICP evidence without importing universal benchmarks.
---

# List Quality Scorecard

Audit a lead list before it enters a campaign. Report what the file establishes. Keep user-approved thresholds separate from measured values.

## Inputs

Require a CSV with:

- email;
- job title;
- company domain or website;
- verification status;
- ICP decision.

Optional fields include company name, person name, buyer role, source, observed date, and exclusion reason.

## Rules

- Deduplicate normalized email addresses.
- Report missing titles. Do not infer seniority from another field.
- Validate domain syntax. Do not claim that a valid hostname is an operating company.
- Treat `verified`, `valid`, or `deliverable` as technical verification only.
- Keep invalid, risky, catch-all, unknown, and missing verification separate when the file supports those states.
- Count ICP rejection separately from missing ICP review.
- Do not invent a letter grade or sending threshold. Apply a threshold only when the user supplies it.
- Never upload or send the list as part of this audit.

## Run

```bash
node scripts/audit-list.mjs --input=leads.csv --output=scorecard.json
```

The script runs locally and writes counts plus row numbers. It does not write lead values to the report.

## Delivery

Lead with:

1. row count;
2. duplicate rows;
3. missing titles;
4. invalid domains;
5. unverified rows;
6. missing ICP decisions;
7. ICP rejections;
8. the exact rows to review;
9. the user's threshold decisions, if supplied.

## Completion gate

Complete when the counts reconcile to the input, every flag points to a row number, and the report distinguishes a missing check from a failed check.

## Example

Run the script against `examples/leads.csv`. The expected counts are in `examples/example.md`.
