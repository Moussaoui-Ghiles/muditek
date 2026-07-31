---
name: outbound-funnel-economics
description: Audit first-party B2B outbound cohorts and calculate channel-correct funnel conversion, leakage, fully loaded CAC, first-year gross profit, gross-profit LTV:CAC, CAC payback, break-even customers, required customer rate, and marginal expansion scenarios. Use when Codex must analyze cold-email, LinkedIn, or named-account outbound results; normalize CRM or campaign exports; compare cohorts; plan a pilot without invented benchmarks; test whether acquired customers can support acquisition cost; or produce an evidence-led funnel and economics report. Preserve missing data as unknown, keep actuals separate from projections, and never infer causation from a rate.
---

# Outbound Funnel & Economics

Turn first-party outbound evidence into a reproducible funnel and unit-economics audit. Calculate what the supplied cohort establishes; never manufacture a benchmark, prediction, cause, or commercial verdict.

## Load the references

Read each file before completing the corresponding work:

- `references/intake-and-data-contract.md` before collecting, normalizing, or mapping data.
- `references/metric-specification.md` before defining a denominator, cost boundary, gross-profit input, payback series, or comparison.
- `references/interpretation-and-audit.md` before diagnosing leakage or delivering recommendations.
- `references/source-boundaries.md` before attributing a framework or presenting a formula as sourced.
- `references/worked-examples.md` when preparing an input file, checking an edge case, or explaining a result.

## Non-negotiable rules

- Use one fixed cohort, observation window, attribution window, acquisition motion, original-entry unit, and definition version per calculation.
- Count unique original entities reaching each funnel stage. For cold email and LinkedIn, use unique prospects. For named-account outreach, use unique accounts. Report event volumes separately; never mix messages, replies, meetings, people, and accounts in one conversion chain.
- Treat an email accepted by the recipient mail server as technical acceptance, not inbox placement, human reach, or attention.
- Require the LinkedIn reach event to be defined before calculating a reach-based rate. Do not silently equate sent, delivered, connected, or viewed.
- Preserve `unknown`, explicit zero, `not_applicable`, `provisional`, and `invalid` as different states.
- Use a matured cohort for final customer yield, CAC, win rate, and realized customer economics. Calculate immature-cohort results only as provisional observations.
- Include every cohort-attributable acquisition cost and document the allocation method for shared costs. Never treat labor, management, setup, data, or infrastructure as free because it is internal.
- Keep acquisition costs separate from delivery costs and from any post-acquisition cost subtracted in the contribution definition. Flag possible double counting instead of resolving it by assumption.
- Label every input and output `actual`, `expected`, `assumption`, `mixed`, or `unknown` as applicable. Never present a projection as historical performance.
- Do not import an industry conversion rate, CAC, LTV:CAC threshold, payback target, or sample-size rule. A company-approved target may be shown as an operating decision, not external truth.
- A rate locates an observed transition. It does not prove why the transition occurred. Review underlying accounts, messages, replies, meetings, opportunity records, and cost records before assigning cause.
- Compare cohorts only when the motion, unit, stage definitions, attribution logic, and maturity treatment are comparable. Otherwise explain the mismatch and stop the comparison.
- Do not call revenue divided by acquisition cost profit, gross-profit LTV:CAC, or ROI.
- Do not infer that an unprovided post-acquisition sales or onboarding cost is zero or already included in delivery cost. Require an explicit value, including an explicit `0`, before calculating contribution or break-even.
- Use the deterministic calculator as the numerical source of truth for every metric it supports. Do not add improvised ratios, proxy denominators, or manually calculated performance metrics to the final report.
- When the comparability gate fails, do not name a winner, leader, better cohort, or causal improvement. Report each supported observation separately and state the exact conditions required for a valid comparison.
- Do not make pricing, hiring, budget, channel, or scaling decisions autonomously. Show the arithmetic, uncertainty, and decision the result can inform.

## Workflow

### 1. Fix the decision and audit mode

Select one mode:

- **Historical cohort audit:** calculate observed funnel and economics from actual records.
- **Pilot requirement:** calculate the customer count and rate required to recover a defined pilot cost without inventing conversion assumptions.
- **Projection:** model explicitly labeled expected or assumed inputs.
- **Cohort comparison:** compare like-for-like cohorts and isolate measured deltas.
- **Marginal expansion:** compare the additional gross contribution expected from one more unit of activity with its additional cost.

State the decision the work must inform. Do not substitute a generic “is outbound working?” verdict for a specific cost, funnel, pilot, or expansion question.

### 2. Search before asking

Inspect user-supplied exports, spreadsheets, campaign reports, CRM records, finance records, offer economics, and relevant vault notes first. Search exact campaign, cohort, offer, and customer names before broader keywords.

Record the source, period, extraction date, filters, deduplication key, and inaccessible evidence. Treat an artifact as evidence of what it records, not proof of an unrecorded event.

### 3. Build the cohort contract

Use `references/intake-and-data-contract.md`. Fix:

- cohort ID and acquisition motion;
- start and end dates plus analysis date;
- original entry unit and exact entry event;
- stage definitions and definition version;
- attribution window and win definition;
- maturity status and normal sales-cycle basis;
- unique entity key and deduplication rules;
- cost boundary and allocation rules;
- actual, expected, assumption, or unknown status for every input.

If any definition is missing, calculate only metrics whose numerator and denominator remain unambiguous.

### 4. Normalize evidence

Create one row per original entity or a reconciled stage-count ledger. Retain provenance and exceptions.

For event-level data:

1. normalize the original entity key;
2. deduplicate repeated events without erasing retries or contradictory outcomes;
3. map each entity to the furthest evidenced stage under the fixed definition;
4. retain event counts separately for operational workload;
5. reconcile counts against source totals and explain differences.

Do not infer a missing stage from a later stage unless the cohort contract explicitly guarantees that implication. Record the contradiction or missing event instead.

### 5. Prepare and run the deterministic calculator

Create JSON that follows `references/intake-and-data-contract.md`. Run:

```bash
python3 scripts/calculate.py --input <cohort-input.json> --format markdown
```

Use `--format json` when another system must consume exact statuses and values. The calculator:

- validates units and stage order;
- distinguishes absent fields from explicit zeros;
- calculates only supported metrics;
- labels provisional and mixed-basis outputs;
- reconciles costs and economics;
- blocks invalid ratios and impossible break-even inputs;
- fingerprints the normalized input for reproducibility.

Never repair rejected input silently. Correct the source mapping or report the validation issue.

Do not replace a missing motion-specific denominator with a convenient proxy. In particular, if LinkedIn reach is undefined, relevant-response and reach-based qualified-conversation rates remain unknown; `responses / entries` is not a substitute metric.

### 6. Audit the result against evidence

Apply `references/interpretation-and-audit.md`. Verify:

- every displayed value traces to a supplied input or transparent arithmetic;
- every rate has the intended unique-entity numerator and denominator;
- missing values did not become zeros;
- shared-cost allocations are documented;
- customer economics use the stated horizon and basis;
- maturity and attribution are not overstated;
- comparisons passed the comparability gate;
- interpretations state what the number cannot establish.

Inspect the underlying records for the transition selected for further investigation. Do not let the calculator replace evidence review.

### 7. Deliver the audit

Lead with one of:

- `COMPLETE — supported by the supplied cohort evidence`
- `PARTIAL — calculations completed, with material unknowns`
- `PROVISIONAL — cohort has not matured`
- `INVALID — source reconciliation or unit definitions must be corrected`

Then provide:

1. **Decision and scope**
2. **Cohort contract**
3. **Data-quality and reconciliation findings**
4. **Funnel table** with numerator, denominator, result, status, meaning, and limitation
5. **Economics table** with formula, result, horizon, basis, and limitation
6. **Break-even or marginal scenario**, when requested and supported
7. **Observed transition to investigate**, without asserting cause
8. **Underlying evidence to review next**
9. **Assumptions, unknowns, and excluded costs**
10. **Input fingerprint and calculation version**

Use concise business language. Put the exact calculation behind every material conclusion.

## Completion gate

Complete only when the cohort unit and definitions are fixed, inputs are traceable, the calculator passes without unresolved errors, cost treatment is explicit, unknowns remain visible, and the report distinguishes measurement from diagnosis. If the data cannot support a requested conclusion, deliver the supported subset and name the exact missing evidence.
