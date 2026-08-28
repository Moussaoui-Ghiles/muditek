---
title: How to Find Local Business Owners and Emails from Google Maps
status: approved
asset_type: playbook
created: 2026-08-28
updated: 2026-08-28
tags:
  - gtm/outbound
  - google-maps
  - local-business
---

# How to Find Local Business Owners and Emails from Google Maps

Google Maps gives you the company, category, address, phone number and website. It rarely tells you who owns the business. That missing field is where bad automation starts.

This workflow checks the public company website and saves the exact page behind each owner claim. When the evidence is weak or missing, the answer is `unknown`. Public website emails stay `published_unverified`.

The package runs locally in Claude Code or Codex without a paid API.

## What the package does

```text
company CSV
→ website collection
→ saved evidence
→ owner review
→ public email review
→ audited CSV
```

It does not collect the starting Maps list. Use an existing export or build and review the company file first.

It does not scrape LinkedIn, guess email patterns, verify deliverability or send outreach.

## 1. Prepare the company CSV

The required headers are:

```text
company_name,website
```

Keep useful Maps fields in the file when you have them:

```text
place_id
maps_url
category
address
phone
observed_at
```

The collector reads only the company name and website. The extra fields help you confirm that the evidence belongs to the correct business.

Clean the file before research:

1. Remove duplicate companies and domains.
2. Remove chains, franchises or categories outside the target rules.
3. Confirm the website belongs to the listed company and location.
4. Keep failed and unknown websites in the file.

Use the [Google Maps List Builder](/skills/google-maps-list-builder) when the export needs normalization or company-fit review.

## 2. Download and run the collector

Download the [Google Maps Owner and Email Finder](/skills/google-maps-owner-email-finder), unzip it and open the folder in Claude Code or Codex.

The code is also available in the [public GitHub repository](https://github.com/Moussaoui-Ghiles/google-maps-owner-email-finder).

Run:

```bash
node scripts/collect-website-evidence.mjs \
  --input=path/to/companies.csv \
  --output-dir=run
```

Optional limits:

```bash
node scripts/collect-website-evidence.mjs \
  --input=path/to/companies.csv \
  --output-dir=run \
  --max-pages=20 \
  --concurrency=3
```

The collector visits the homepage and direct links whose paths suggest:

- About;
- Team;
- Story;
- Leadership;
- Founder or Owner;
- Company;
- Contact.

For each page it saves:

- the final URL;
- page title;
- text near owner or leadership terms;
- public email candidates;
- request failures.

The run creates one JSON evidence file per company and one `evidence-index.csv`.

## 3. Keep the safety limits

The collector blocks:

- local files and non-HTTP protocols;
- localhost and private network targets;
- unsafe redirects;
- non-HTML responses;
- pages larger than 2 MB;
- requests that exceed the timeout.

It follows no more than 20 pages per company. One failed site does not stop the run.

Do not remove these controls to increase coverage. A failed site should become a review task, not a weaker security rule.

## 4. Review the evidence with the agent

Give Claude Code or Codex this instruction:

```text
Read SKILL.md completely.
Review every JSON file under run/evidence/.
Create run/owners.csv using templates/owners-output.csv.
Follow the owner states exactly.
Do not infer an owner or generate an email pattern.
```

Use only two owner states.

### Explicit

Use `explicit` when a public page clearly identifies the named person as the owner, co-owner or proprietor of the same business.

```text
Jane Smith is the owner of Example Roofing.
```

### Unknown

Use `unknown` when:

- no person is named;
- only a founder, president, CEO or other executive is named;
- the page belongs to a different business or location;
- one weak or stale page is the only evidence;
- public pages disagree;
- the owner wording is ambiguous.

`unknown` is a completed result. It is safer than confident personalization with the wrong name.

If one page clearly names multiple current owners, keep the names and matching roles together. Do not treat co-owners as a conflict. Use `unknown` when separate pages disagree about who owns the company.

## 5. Record the evidence and email correctly

The output uses one row per company:

```text
company_name
website
owner_name
owner_role
owner_status
evidence_url
evidence_text
public_email
email_status
email_source_url
notes
```

Every owner claim needs the exact evidence URL and supporting text.

The collector copies only emails published on the pages it visits. Every retained email must use:

```text
email_status=published_unverified
```

That label means the address appeared on the website. It does not mean the mailbox exists, accepts mail or belongs to the owner.

A generic address such as `info@company.com` can remain when the website publishes it. Keep it separate from the owner claim.

Do not create likely addresses from a person's name and company domain.

## 6. Handle failed and incomplete websites

If the collector returns a failure:

1. Keep the owner as `unknown`.
2. Record the request error in `notes`.
3. Open the official site manually when access is permitted.
4. Check the exact About, Team or Contact page.
5. Save the URL, supporting text and observation date when you find valid evidence.
6. Leave the record unknown when the page is blocked, dynamic, stale or unclear.

Do not bypass access controls. Do not copy an AI answer without the underlying public page.

## 7. Run the audit, then check the claims

Run:

```bash
node scripts/audit-results.mjs --input=run/owners.csv
```

The audit rejects:

- missing owner evidence;
- `explicit` claims without owner or proprietor wording;
- owner states other than `explicit` or `unknown`;
- malformed emails;
- public emails without `published_unverified`;
- email records without a page URL.

Then manually open every claimed-owner page and check:

- the name matches the page;
- the role is copied accurately;
- the page belongs to the same company and location;
- the ownership wording is current;
- conflicts are marked `unknown`;
- the email appears on the cited page;
- no email is called verified.

After any separate contact enrichment or verification, run the [CSV List Quality Auditor](/tools/csv-list-quality-auditor) before sending.

## Completion checklist

- [ ] Every input company has one output row.
- [ ] Every claimed owner has an evidence URL and supporting text.
- [ ] Unsupported and conflicting owners are `unknown`.
- [ ] Multiple owners are preserved without hiding a co-owner.
- [ ] Every public email is copied from a cited page.
- [ ] Every email is marked `published_unverified`.
- [ ] Failed requests remain visible.
- [ ] The audit passes.
- [ ] A person checks every claimed owner.

## Where the package stops

- Google Maps collection;
- LinkedIn collection;
- paid search or enrichment services;
- JavaScript browser rendering;
- email deliverability verification;
- outreach or sending.

The package starts after company collection and ends before deliverability verification or sending. Its output is a reviewable owner-and-email file, not a finished outreach list.
