# Intake and Evidence Protocol

## Contents

- Vault-first discovery
- Evidence classes
- Coverage schema
- Progressive questioning
- Contradictions and unknowns

## Vault-first discovery

Start from names and artifacts the user supplied. Search before asking:

1. Exact offer, company, product, program, buyer, or proposal names.
2. Offer and pricing notes under `marketing/offers/`.
3. Prospect-specific proposals, discovery calls, and pipeline notes under `marketing/pipeline/` when the named account makes them relevant.
4. Case studies, testimonials, delivery records, public pages, contracts, and terms named by the user.
5. Decision notes that constrain pricing, qualification, or client fit.

Use `rg` or the available vault search. Keep searches bounded to the user's offer and evidence. Do not inspect unrelated confidential client records.

For a website or external file, inspect the accessible source itself. Record the URL, page or section, access date, and whether the buyer would see it. If it cannot be accessed, label it `unknown`; do not reconstruct it.

> [!warning] Buyer-visible proof
> A private intake, internal calculation, draft case study, sales note, or operator example can inform the audit but is not buyer-visible proof unless the buyer receives it and its underlying claim is supported.

## Evidence classes

Use exactly these labels in the evidence register:

| Label | Meaning | Allowed use |
|---|---|---|
| `current decision` | The user or an authoritative decision record identifies the current offer version, rule, constraint, or intended choice. | Establish what governs the audit. It is not proof that a buyer, market, result, or legal claim is true. |
| `verified fact` | An inspected artifact directly supports the bounded statement. | State only what the artifact proves, with date and limitations. |
| `user-provided assertion` | The user states it, but no inspected artifact independently supports it. | Use as an input; request corroboration for material buyer-facing claims. |
| `source/operator example` | A named source supplies a framework, opinion, hypothetical, or self-reported example. | Use as a diagnostic prompt, never as proof or a universal threshold. |
| `inference` | A conclusion follows from identified evidence but is not directly stated. | Label it and show the reasoning chain. |
| `unknown` | The evidence is absent, inaccessible, contradictory, or insufficiently specific. | Ask, test, or leave unresolved. Never encode as zero or false. |

Verification is claim-specific. A signed proposal verifies agreed scope and terms, not delivered results. A published testimonial verifies the testimonial's wording and existence, not necessarily the underlying result. A dashboard screenshot may verify a dated metric display, not attribution or causality.

## Coverage schema

Populate every field from artifacts first. Preserve dates, source, status, and contradictions.

### Buyer and situation

- Current governing offer version, decision owner, decision date, and any unresolved version conflict.
- Buyer role, authority, company type, size or stage only when relevant.
- Explicit inclusions and exclusions.
- Intended acquisition channel and sales context: true cold email, LinkedIn, calling, named-account, partner, content-led, referral, warm follow-up, mixed, or unknown.
- Buying event or situation.
- Problem in the buyer's language.
- Cost or consequence, with calculation source and assumptions.
- Current alternative or workaround.
- Why that alternative is insufficient, if evidenced.
- Desired outcome and how the buyer would recognize it.

### Offer and delivery

- Product or service being purchased.
- Positioning or category, current alternative, stated differentiator, packaging, and terms.
- Method or mechanism: causal explanation, not merely a branded name.
- Deliverables, sequence, ownership, and acceptance criteria.
- Buyer tasks, access, data, people, approvals, training, and change burden.
- Time to onboarding, first value, stated outcome, and ongoing value.
- Sales cycle and buying process when known.
- Implementation dependencies and failure conditions.
- Delivery repeatability, provider labour, specialist or staffing constraints, bottlenecks, capacity, marginal delivery cost, and conditions under which fulfillment fails.
- Disqualifiers and no-go conditions.

### Claims and trust

- Every material claim, including numerical, timing, comparative, economic, guarantee, and outcome claims.
- Proof attached to each claim.
- Proof buyer, problem, method, result, conditions, date, acquisition motion, buyer visibility, and permission to use it.
- Existing trust source: referral, prior relationship, content, brand, platform, partner, recognized past role, or none evidenced.
- Whether that trust transfers to a true cold buyer.
- Known objections and the observed source of each objection.

### Commercial terms and risk

- Price, currency, tax treatment when stated, payment timing, recurring or one-time structure.
- Minimum commitment, renewal, cancellation, refund, back-out, and termination terms.
- Guarantee, performance pricing, eligibility, exclusions, buyer obligations, measurement, remedy, and enforceability status.
- Switching costs, data portability, lock-in, sunk setup effort, and reversibility.
- First commitment type: call, meeting, application, assessment, money, time, data, access, paid diagnostic, pilot, contract, or operational change.
- For a call, meeting, or application: purpose, expected outcome, qualification, buyer burden, transparency, and next step.
- For a paid front-end offer, pilot, or diagnostic: bounded useful result, success definition, deliverable the buyer can judge or keep, and transparent connection to any larger service.

### Economics and evidence health

- Deal value, lifetime value, margin, capacity, delivery cost, acquisition cost, payback, or ROI only when supplied.
- Formula, numerator, denominator, population, period, source, and evidence date for each economic claim.
- Contradictions across artifacts.
- Stale evidence and date-sensitive assumptions.
- Explicit unknowns.

## Progressive questioning

Do not send the whole schema as a questionnaire. Ask the smallest next batch that changes the audit.

### Batch 1: establish the nucleus

Ask only missing items among:

1. Who is the exact buyer?
2. What problem do they already recognize?
3. What are they being asked to buy and commit to first?
4. Is this a true cold sale or is trust transferred by referral, content, a partner, or a prior relationship?
5. Which artifact contains the current offer and terms?

Without these, give only an `UNPROVEN` partial audit.

### Batch 2: establish belief and coherence

Ask only unresolved high-impact items among:

- What claim matters most to the purchase?
- What exact proof supports that claim?
- What is delivered, by whom, and when?
- What must the buyer provide or change?
- What are the price, commitment, exit, and risk terms?

### Batch 3: establish validation and economics

Ask only what is necessary to choose a next test:

- What has been observed in cold conversations or paid trials?
- What objections, disqualifiers, sales cycle, and lost-deal reasons are documented?
- Which economics are measured, assumed, or unknown?
- What decision must the next evidence resolve?

For every question, state the dimension or decision it unlocks. Accept `unknown` as a valid answer.

## Contradictions and unknowns

Create a contradiction row when two artifacts cannot both describe the same current offer: different buyer, promise, scope, price, timing, commitment, guarantee, or success definition. Cite both.

Do not choose the newest file automatically unless the user or version evidence establishes it as authoritative. Ask which governs.

Maintain unknowns as first-class entries. Separate:

- missing input;
- inaccessible evidence;
- unverified assertion;
- ambiguous definition;
- contradictory evidence;
- stale or undated evidence.
