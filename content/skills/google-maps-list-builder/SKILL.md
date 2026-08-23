---
name: google-maps-list-builder
description: Build a local-business company list from user-approved Google Maps research or exports, then normalize, deduplicate, qualify, and document it before contact enrichment.
---

# Google Maps List Builder

Build a company list from a defined category and location. This skill produces companies, not people or verified email addresses.

## Inputs

Require:

- business category and useful synonyms;
- locations and coverage boundary;
- positive company-fit rules;
- hard exclusions;
- approved maps research method or user-supplied export;
- required output fields;
- maximum research volume or budget.

Do not choose or fund a provider for the user. Never use a hidden credential. If research requires a paid provider, stop until the user supplies the account and approves the spend.

## Output contract

Return:

1. `companies.csv` with one row per company;
2. `coverage.md` with queries, locations, dates, result counts, deduplication rules, and known gaps;
3. `excluded.csv` with the company, exclusion rule, and evidence;
4. a sample ready for human ICP review.

Use these columns when available:

```text
place_id,company_name,company_domain,website,category,address,city,region,country,phone,source_url,observed_at,fit_status,fit_reason
```

Keep an empty value empty. Do not infer a website, location, category, or fit decision from a company name.

## Workflow

### 1. Fix the search contract

Write the category, location, coverage unit, fit rules, exclusions, fields, and stop condition before collecting data.

### 2. Collect evidence

Use only the user-approved method. Record the source URL and observation date with every row. Keep raw output separate from normalized output.

### 3. Normalize

Run:

```bash
node scripts/normalize-export.mjs --input path/to/raw.csv --output companies.csv
```

The script maps common headers, extracts hostnames, and removes exact duplicate place IDs or repeated domain-and-address pairs. It does not decide ICP fit.

### 4. Review coverage

Reconcile raw rows, normalized rows, duplicates, missing domains, and missing source URLs. Explain gaps by query and location.

### 5. Calibrate fit

Review a mixed sample with the user. Use `icp-prompt-builder` when a reusable company-fit prompt is needed. Preserve corrections as explicit rules. Apply the locked rules to the remaining companies.

### 6. Hand off

Send only qualified companies to contact research. Do not claim that a company record includes a reachable decision-maker. Run `list-quality-scorecard` after contact and verification fields are added.

## Completion gate

Complete when every row has provenance, duplicates are reconciled, fit rules are explicit, exclusions are retained, and the user can see what coverage the list does and does not establish.

## Example

Read `examples/example.md`. Run the normalizer against `examples/raw.csv` before using the bundle.
