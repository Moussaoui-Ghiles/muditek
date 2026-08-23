---
name: list-expander
description: Expand a narrow set of known-good seed companies into a broader qualified list through fingerprinting, independent candidate lanes, calibrated fit, and coverage reconciliation.
---

# List Expander

Expand a difficult company list from known-good seeds. Work from evidence about how the seeds appear, not from a single guessed keyword.

## Inputs

Require:

- seed domains known to fit;
- company-fit rules and disqualifiers;
- geography and company-size boundaries;
- approved discovery sources and budget;
- exclusion domains;
- the user-defined stop condition.

## Workflow

### 1. Fingerprint the seeds

For each seed, record the live website, public description, categories, industry labels, products, customers, operating model, and phrases that distinguish it. Keep source dates. Report seeds that a source cannot find.

### 2. Generate candidate lanes

Use independent user-approved lanes such as:

- source-native lookalikes;
- public-web similarity research;
- industry and category expansion;
- discriminative phrases from confirmed fits;
- local maps research when the market is geographic.

Do not fund or select a paid lane without approval.

### 3. Normalize and deduplicate

Normalize domains and retain source overlap. Keep raw data. Apply only the approved geography, size, and hard-exclusion boundaries before qualification.

### 4. Calibrate fit

Use `icp-prompt-builder` on a mixed sample. Keep human corrections as rules and examples. Verify the current website when database evidence is stale or insufficient.

### 5. Expand from confirmed fits

Use newly confirmed companies to discover additional categories, phrases, and lookalikes. Run only the net-new candidates through the same fit contract.

### 6. Stop on the agreed evidence

Use the user's stop condition, such as no material net-new qualified companies after a defined number of complete rounds. Do not invent a universal convergence threshold.

### 7. Reconcile coverage

Report each lane's raw candidates, unique candidates, qualified companies, unknowns, exclusions, source overlap, failures, spend, and net-new contribution by round.

## Output

Return the qualified company file, evidence file, exclusions, lane reconciliation, expansion rounds, remaining unknowns, and the exact coverage limitations.

## Completion gate

Complete when every approved lane ran or has a declared failure, every fit decision traces to evidence, duplicate domains are reconciled, and the stop condition was met.

## Example

Read `examples/example.md`. It uses fictional lanes and counts.
