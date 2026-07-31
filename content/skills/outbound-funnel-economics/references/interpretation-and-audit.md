# Interpretation and Audit Protocol

## Contents

1. Evidence audit
2. Funnel interpretation
3. Economic interpretation
4. Comparison protocol
5. Decision language
6. Final quality checklist

## 1. Evidence audit

Before interpreting a rate, verify:

- the numerator and denominator use the same unique original entity;
- both belong to the same cohort and attribution window;
- stage definitions were fixed and applied consistently;
- retries, duplicates, reschedules, and multiple contacts per account were handled explicitly;
- later events were not silently inferred from missing earlier events;
- the cohort maturity claim is supported by the normal sales cycle or resolved opportunities;
- the cost ledger covers the stated acquisition boundary;
- shared-cost allocation is reproducible;
- actual, expected, and assumed values are visibly separated.

Classify issues:

- **Error:** prevents a calculation or makes the unit chain incoherent.
- **Material warning:** permits a bounded calculation but could change the decision.
- **Disclosure:** affects interpretation but not arithmetic.

## 2. Funnel interpretation

Use rates to select records for inspection, not to assign cause.

| Observed transition | Review next | Do not conclude |
|---|---|---|
| Entry to technical email acceptance | Address validity, bounces, authentication, sending configuration, sender reputation | That accepted messages reached an inbox or person |
| LinkedIn/account entry to defined reach | Path execution, contact coverage, buyer-role mapping, profile/path constraints | That the offer is irrelevant |
| Reach/acceptance to relevant engagement | Account fit, person fit, timing evidence, offer, proof, message, underlying responses | That copy alone caused the result |
| Qualified conversation to booking | Ask, response handling, qualification path, first commitment, scheduling friction | That the prospect would or would not ultimately buy |
| Booking to held meeting | Meeting purpose, qualification depth, scheduling, expectations, reminders | That reminders alone are the fix |
| Held meeting to qualified opportunity | Authority, problem relevance, commercial fit, qualification, discovery notes | That lead source or salesperson alone caused the loss |
| Qualified opportunity to customer | Offer, proof, risk, terms, stakeholders, decision process, sales execution, timing | That either offer or closer alone caused the result |

### Prioritizing without a benchmark

Do not label the lowest rate “bad.” Prioritize an investigation using evidence such as:

1. a material decline versus a genuinely comparable prior cohort;
2. a stage whose observed yield makes the company-approved economic requirement unattainable;
3. a reconciliation error or definition gap that invalidates downstream decisions;
4. concentrated loss tied to reviewable records or a controlled operational change;
5. the earliest unresolved transition in the chain.

State which basis was used.

## 3. Economic interpretation

### CAC

Say: “This matured cohort spent X in fully loaded acquisition cost and acquired Y customers, producing observed CAC of Z under the stated attribution and allocation rules.”

Do not say: “The channel is profitable” without matching CAC to a supported customer-contribution horizon and payback requirement.

### Gross profit and LTV:CAC

State whether customer gross profit is realized or projected. If lifetime value depends on retention assumptions, list them. A high projected ratio can coexist with weak cash timing or unreliable retention.

### Payback

State whether payback uses gross profit or cash. For a monthly series, disclose the month reached and cumulative gross profit at that point. For the simplified estimate, disclose the stable-monthly-profit assumption.

### Break-even

State both:

- continuous required customer rate; and
- whole customers required.

Explain that neither is a forecast. If impossible under the entered economics, identify whether the cause is non-positive contribution, required rate above 100%, or required whole customers above available entries.

### Marginal expansion

State the assumed additional cost, additional customers, contribution horizon, additional gross contribution, and net incremental contribution. Then show the break-even additional customer count. Do not authorize expansion from the scenario alone; review capacity, uncertainty, and whether prior marginal returns remained stable.

## 4. Comparison protocol

Create a comparability table before reporting deltas:

| Condition | Baseline | Candidate | Comparable? |
|---|---|---|---|
| Motion | | | |
| Original entity | | | |
| Definition version | | | |
| Attribution window | | | |
| Maturity | | | |
| Segment/offer | | | |
| Cost boundary | | | |
| Observation opportunity | | | |

If the segment or offer changed, the arithmetic can still be reported, but causal attribution to that change remains unproven unless the design supports it.

If any required comparability condition fails, do not rank the cohorts. “More customers observed so far” is a bounded count, not proof that an immature or differently defined cohort is better.

Review absolute counts alongside rates. Small cohorts can show large rate changes from one entity. Do not create statistical confidence claims unless a separate, appropriate analysis was explicitly requested and supported.

## 5. Decision language

Use bounded language:

- “The supplied records show…”
- “Under the stated definition…”
- “This rate changed from X to Y…”
- “The result supports inspecting…”
- “The evidence does not distinguish between…”
- “This remains unknown because…”
- “The scenario requires…, but does not predict…”
- “The cohorts are not rankable under the current definitions because…”

Avoid:

- “Outbound works/does not work” from one rate;
- “The message is the problem” without record review;
- “Industry standard” without a current authoritative source and explicit user request;
- “Profitable” when only revenue is available;
- “Validated” from an internal model;
- “Scale” as an automatic recommendation from a positive average result.
- “Winner,” “leader,” or “better” after the comparability gate fails.
- A proxy such as LinkedIn responses divided by entries when the defined denominator is reach and reach is unknown.

## 6. Final quality checklist

- [ ] The decision and cohort are named.
- [ ] The original entity and entry event are explicit.
- [ ] Stage definitions, definition version, and attribution window are recorded.
- [ ] Missing values remain unknown; explicit zeros are sourced.
- [ ] Rates use unique original entities, not event counts.
- [ ] Cold-email technical acceptance is not called human reach.
- [ ] LinkedIn reach uses a predefined event.
- [ ] Maturity is supported or outputs are provisional.
- [ ] Costs are fully listed, allocated consistently, and not double counted.
- [ ] Gross profit uses collected/collectible revenue and direct delivery cost.
- [ ] Contribution horizon is explicit.
- [ ] LTV:CAC uses gross profit or is labeled revenue-only.
- [ ] Payback method and cash/gross-profit basis are explicit.
- [ ] Break-even is presented as a requirement, not a forecast.
- [ ] Comparisons passed the comparability gate.
- [ ] Every diagnosis is framed as an investigation, not a proven cause.
- [ ] The calculator version and input fingerprint are retained.
