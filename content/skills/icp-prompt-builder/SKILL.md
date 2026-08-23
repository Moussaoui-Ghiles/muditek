---
name: icp-prompt-builder
description: Build and calibrate a reusable company-fit evaluation prompt through small mixed examples and explicit user corrections.
---

# ICP Prompt Builder

Build a company-fit prompt before applying it to a large list. Human judgment defines fit. The prompt makes that judgment repeatable.

## Inputs

Require:

- positive company-fit rules;
- hard disqualifiers;
- buyer or use-case context;
- fields available in the company file;
- a mixed sample of likely fits, likely non-fits, and edge cases;
- the user's decision for each reviewed company.

Do not scrape private data or call a paid model without explicit approval. Use the current agent runtime for calibration when available.

## Workflow

1. Normalize the fit rules into required, preferred, disqualifying, and unknown conditions.
2. Select a mixed batch of 10 companies. Keep source evidence with each row.
3. Draft a prompt that returns `qualified`, `confidence`, `reason`, `evidence`, and `unknowns`.
4. Evaluate the batch.
5. Show every result to the user. Ask which decisions or reasons are wrong.
6. Convert each correction into an explicit rule or example.
7. Run a new mixed batch. Reset the approval streak after any correction.
8. Lock the prompt only after two consecutive reviewed batches need no corrections.

The batch size and two-round stop condition are operating defaults. Change them when the user defines another review standard.

## Prompt contract

The final prompt must:

- name every input field;
- keep missing evidence as `unknown`;
- forbid inference from company name alone;
- apply hard disqualifiers before positive fit;
- cite the evidence used for each decision;
- return strict JSON;
- treat confidence as uncertainty, not fit quality.

## Output

Return:

- `icp-prompt.md`;
- `test-cases.json` with reviewed examples and expected decisions;
- `change-log.md` with each correction and resulting rule;
- the unresolved edge cases;
- the scale decision that this prompt can inform.

## Completion gate

Complete only when the user reviewed the test cases, the prompt matches the available fields, corrections are retained, and the locked prompt passes the agreed review condition.

## Example

Read `examples/example.md` and `examples/test-cases.json`. The company names and domains are fictional.
