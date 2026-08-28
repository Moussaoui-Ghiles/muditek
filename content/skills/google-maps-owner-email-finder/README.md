# Google Maps Owner and Email Finder

Research owner claims and public website emails for a local-business CSV without a paid API.

The collector visits the supplied company website, saves relevant page evidence, and leaves the owner decision for review. Unsupported owners stay `unknown`. Website emails stay `published_unverified`.

## Requirements

- Node.js 20 or newer
- Claude Code or Codex for evidence review
- A CSV containing `company_name` and `website`

## Run it

```bash
node scripts/collect-website-evidence.mjs \
  --input=path/to/companies.csv \
  --output-dir=run
```

The command creates:

- one JSON evidence file per company;
- `run/evidence-index.csv` with collection status and email candidates.

Next, ask Claude Code or Codex to read `SKILL.md`, review every file under `run/evidence/`, and create `run/owners.csv` from `templates/owners-output.csv`.

Audit the reviewed file:

```bash
node scripts/audit-results.mjs --input=run/owners.csv
```

The audit rejects unsupported owner states, missing owner evidence, unrelated evidence domains, malformed email addresses, email claims that are not labelled `published_unverified`, and addresses that do not appear in the saved source-page evidence.

## Boundaries

The package does not collect the starting Google Maps list, use LinkedIn, verify deliverability, guess email patterns, or send outreach.

Read `SKILL.md` for the complete review rules.
