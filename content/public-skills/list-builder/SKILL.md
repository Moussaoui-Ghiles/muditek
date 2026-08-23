---
name: list-builder
description: Build a qualified company and contact list through explicit research lanes, approval gates, provenance, deduplication, verification, and pre-send quality checks.
---

# List Builder

Build the largest useful list supported by the approved scope, sources, budget, and evidence. Recall matters, but it does not override cost approval, legal constraints, source terms, or quality.

## Intake

Fix these inputs before research:

1. known-good seed companies;
2. positive company-fit rules and hard exclusions;
3. company size, geography, and other pull-time boundaries;
4. buyer roles and seniorities;
5. approved research sources and budget;
6. destination: CSV, sheet, or database;
7. account and contact exclusion files;
8. required provenance and verification fields.

## Workflow

### 1. Plan company discovery

Choose independent lanes that match the market: seed expansion, database filters, public-web research, or local maps research. State the cost, capability, and known blind spot of each lane.

Do not spend credits or use a credential until the user approves the source and budget.

### 2. Collect companies

Keep raw output. Normalize domains, company names, source URLs, observation dates, and source-specific identifiers. Deduplicate by normalized domain while retaining conflicting source records for review.

### 3. Calibrate company fit

Use `icp-prompt-builder` on a mixed sample. Human corrections control the rule set. Apply the locked rules to the remaining candidates and keep evidence plus unknowns with every decision.

### 4. Reconcile company coverage

Report raw candidates, unique companies, exclusions, fit decisions, unknown decisions, and source overlap. Do not call the list complete when a source failed or a defined lane remains unreviewed.

### 5. Request contact-stage approval

Show the qualified company count, expected contact volume, provider cost, target titles, and exclusion handling. Start paid contact research only after approval.

### 6. Collect contacts

Collect only the approved buyer roles. Preserve the provider's raw fields and provenance. Deduplicate by stable profile URL, then by normalized company domain plus person name.

### 7. Verify contact paths

Keep provider discovery separate from mailbox verification. Treat risky, catch-all, invalid, and unknown states separately. Never label an address send-ready because a discovery provider returned it.

### 8. Audit the final list

Run `list-quality-scorecard`. Reconcile duplicates, title coverage, domains, verification, ICP decisions, and exclusions before any campaign upload.

## Output

Return:

- company and contact CSVs;
- exclusions with reasons;
- provenance and observation dates;
- source and cost reconciliation;
- company, contact, and verification funnels;
- unresolved coverage gaps;
- the exact next approval.

## Completion gate

Complete when the scope and cost were approved, every delivered row has provenance, exclusions were applied, duplicates were reconciled, verification states remain accurate, and the final list passed the user's quality rules.

## Example

Read `examples/example.md`. It shows the required stage boundaries with fictional counts.
