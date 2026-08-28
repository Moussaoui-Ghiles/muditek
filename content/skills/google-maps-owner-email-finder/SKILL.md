---
name: google-maps-owner-email-finder
description: Research owner evidence and public website emails for a local-business CSV without paid APIs, then return a reviewable result that preserves unknowns.
---

# Google Maps Owner and Email Finder

Turn a local-business company file into cited owner findings and public website emails. The workflow runs locally without a paid API.

Expect `unknown` results. The workflow does not verify email deliverability or guess email patterns.

## Required input

Use a CSV with these headers:

```text
company_name,website
```

Optional columns such as `place_id`, `address`, `phone`, `source_url`, and `observed_at` may remain in the file. The collector reads only the company name and website.

Use the `google-maps-list-builder` skill first when the Maps export still needs normalization, deduplication, or company-fit review.

## Step 1: Collect website evidence

From this skill folder, run:

```bash
node scripts/collect-website-evidence.mjs --input=path/to/companies.csv --output-dir=run
```

Optional limits:

```bash
node scripts/collect-website-evidence.mjs \
  --input=path/to/companies.csv \
  --output-dir=run \
  --max-pages=20 \
  --concurrency=3
```

The collector:

- visits the company homepage;
- follows direct About, Team, Story, Leadership and Contact links;
- collects sentences that mention ownership or leadership roles;
- collects email addresses published on the visited pages;
- records the page URL for every result;
- rejects local, private, non-HTTP and oversized targets;
- saves one JSON evidence file per company plus `evidence-index.csv`.

It does not decide who the owner is.

## Step 2: Review the evidence

Read every JSON file under `run/evidence/`. Create `run/owners.csv` using `templates/owners-output.csv` as the header contract.

Use these owner states:

- `explicit`: a cited public page explicitly identifies the named person as the owner or proprietor of the same business.
- `unknown`: the evidence does not support a defensible owner claim or sources conflict.

Rules:

1. Preserve the role exactly as the page states it. Founder, president and CEO do not mean owner without explicit ownership wording.
2. Use `explicit` only for explicit owner or proprietor language.
3. Use pages on the supplied company website. Do not substitute LinkedIn profiles, directory listings or AI answers.
4. If two pages conflict, use `unknown` and explain the conflict in `notes`.
5. Never infer a person from the company name.
6. Never generate an email from a name and domain pattern.

## Step 3: Record public emails

Use an email only when it appears on a cited public website page.

Set:

```text
email_status=published_unverified
```

Keep the exact page in `email_source_url`.

If the page publishes only a generic address, keep it. Do not relabel it as the owner's direct email.

If no public email appears, leave `public_email` and `email_source_url` empty.

## Step 4: Audit the result

Run:

```bash
node scripts/audit-results.mjs --input=run/owners.csv
```

The audit rejects:

- owner claims without evidence;
- `explicit` claims without owner or proprietor language in the saved evidence text;
- public emails without `published_unverified`;
- emails without a source URL;
- emails that do not appear in the saved evidence for the cited source page;
- generated-looking or malformed email values;
- unsupported status values.

The audit checks the file contract. A person must still review every claimed owner against the cited page before outreach.

## Output contract

Return `owners.csv` with:

```text
company_name,website,owner_name,owner_role,owner_status,evidence_url,evidence_text,public_email,email_status,email_source_url,notes
```

Complete when:

- every input company has one output row;
- every owner claim has a cited page and supporting text;
- unsupported or conflicting owners remain `unknown`;
- every email is copied from a cited public page and marked `published_unverified`;
- the audit passes;
- a person reviews the claimed-owner rows.

## What this does not include

The package starts with a reviewed company CSV and stops at a reviewed owner-and-email CSV. It does not collect the Maps list, use LinkedIn, run paid enrichment, verify deliverability or send outreach.
