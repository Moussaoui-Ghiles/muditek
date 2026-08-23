# Cold Offer Review Output Schema

## Contents

- Output modes
- Report contract
- Decision brief
- Full audit tables
- Earliest-link diagnosis
- Next evidence
- Minimal validation plan
- Routing boundary

## Output modes

Use `decision brief` by default, including for a single high-value offer. Use `full audit` when the user requests it or when multiple substantial artifacts or material numerical, guarantee, contract, or delivery contradictions make the complete record necessary for the decision. High stakes alone do not require a longer outward report; preserve the checks internally.

Run all applicable checks internally in either mode. Do not expose empty or immaterial rows merely to fill a template.

## Report contract

Lead with the bounded status. Use concise business language. Cite workspace evidence with file paths or links. Cite external sources with direct links. Include dates and section or line references when available.

Do not collapse unknowns into a numeric score. Do not average `PASS`, `FAIL`, and `UNPROVEN` into a readiness percentage.

## Decision brief: default

Return only:

1. **Verdict:** overall status for the bounded decision and one-sentence reason.
2. **Earliest links:** earliest evidenced broken link and earliest unresolved link, reported separately.
3. **Strongest supported facts:** only the facts that materially shape the decision.
4. **Top material gaps or contradictions:** no more than three, each with its evidence status.
5. **Next evidence or test:** the smallest safe step, what it records, and the decision it unlocks.
6. **Question or routing:** the smallest governing question, or the separately scoped rebuild when it was explicitly requested.

Include compact claim-to-proof or contradiction rows only when they are necessary to substantiate the verdict.

## Full audit

### 1. Audit status

State:

- **Overall:** `PASS`, `FAIL`, or `UNPROVEN` for the exact decision tested.
- **Earliest broken link:** first evidenced `FAIL`, or `none evidenced`.
- **Earliest unresolved link:** first `UNPROVEN`, or `none`.
- **Decision this informs:** one concrete decision.
- **What this does not prove:** demand, urgency, product-market fit, validation, or likely conversion unless independently established by suitable evidence.

Apply the deterministic aggregation in the criteria reference. An overall `PASS` means only that no material failure or unresolved dependency remains for the bounded document/coherence question. It never predicts market response.

### 2. Scope and context

| Field | Current answer | Evidence class | Source and date | Limitation |
|---|---|---|---|---|
| Offer/version |  |  |  |  |
| Buyer |  |  |  |  |
| Sales context |  |  |  |  |
| First commitment |  |  |  |  |
| Decision under review |  |  |  |  |
| Governing version/decision |  | `current decision` or another evidence class |  |  |

### 3. Evidence register

| ID | Statement or input | Class | Artifact/location | Date | Buyer-visible? | Limitation |
|---|---|---|---|---|---|---|
| E1 |  | `current decision`, `verified fact`, `user-provided assertion`, `source/operator example`, `inference`, or `unknown` |  |  |  |  |

Never cite an evidence ID for a broader claim than the row supports.

### 4. Intake coverage

Summarize populated, contradictory, and missing fields. Ask only the next three to five high-leverage questions when the audit remains `UNPROVEN`.

| Field | State | Evidence | Why it matters next |
|---|---|---|---|
|  | known, asserted, contradictory, inaccessible, or unknown |  |  |

### 5. Dimension audit

Include all seven dimensions and all additional tests.

| Dimension/test | Status | Conclusion | Evidence | Exact gap or contradiction | Evidence needed next |
|---|---|---|---|---|---|
| Outcome | `PASS` / `FAIL` / `UNPROVEN` |  | E# |  |  |

Every conclusion gets one status and evidence. Do not use blended labels such as “mostly pass.”

### 6. Claim-to-proof map

| Claim | Claim type and scope | Proof offered | Match | Status | Exact limitation or next proof |
|---|---|---|---|---|---|
|  | outcome, numerical, timing, comparative, economic, guarantee, testimonial implication, or differentiator |  | buyer/problem/method/result/conditions/period/motion/visibility/permission | `PASS` / `FAIL` / `UNPROVEN` |  |

When an artifact proves only that a testimonial or claim was published, say so.

### 7. Contradiction ledger

| Topic | Artifact A | Artifact B | Why they conflict | Status | Resolution needed |
|---|---|---|---|---|---|
|  |  |  |  | `FAIL` or `UNPROVEN` |  |

If none are found, write `No contradiction found in the inspected scope`; do not imply uninspected sources agree.

### 8. Earliest-link diagnosis

Write four short lines:

1. **Link:** the earliest failed or unresolved step in the ordered buyer chain.
2. **Status:** `FAIL` or `UNPROVEN`.
3. **Evidence:** exact evidence IDs and artifacts.
4. **Why it blocks the next link:** the decision the cold buyer cannot yet make.

Do not prescribe copy polishing before fixing the earliest link.

### 9. Exact evidence needed next

Prioritize no more than five items. Make each request inspectable:

| Priority | Exact artifact or observation | Claim/dimension resolved | Acceptable evidence characteristics | Decision unlocked |
|---|---|---|---|---|
| 1 |  |  | source, period, population, conditions, buyer visibility |  |

Avoid vague requests such as “more proof” or “validate the market.”

### 10. Minimal validation plan

Design the smallest safe sequence that resolves the highest-impact unknown. Adapt rather than automatically include every step:

1. **Hypothesis:** one falsifiable statement, currently labeled `UNPROVEN`.
2. **Artifact or offer version:** the exact version tested; change no unrelated major variable.
3. **Relevant buyer and context:** eligibility and disqualifiers; distinguish true cold from trust-assisted.
4. **Test action:** evidence review, buyer comprehension test, sales conversation, paid diagnostic, bounded pilot, or operational observation.
5. **Observed evidence:** what will be recorded, including objections, commitment, delivery burden, first value, and commercial outcome where relevant.
6. **Decision rule:** define the action each result triggers. Use user-approved or first-party thresholds; otherwise describe the comparison or evidence pattern without inventing a universal cutoff.
7. **Decision informed:** keep the audited element, gather proof, clarify terms, change the test, stop, or request a broader rebuild.

Keep booked, held, qualified, paid, delivered, first value, and business outcome separate. A positive reply does not validate delivery; a paid pilot does not prove repeatable market demand; a coherent offer does not prove conversion.

### 11. Questions or routing

When key inputs are missing, end with the next small question batch and leave affected conclusions `UNPROVEN`.

When the original request explicitly asks to audit and then redesign or rebuild, complete the audit first and then start the separately scoped rebuild, carrying forward only evidenced findings. Do not redesign inside this review or ask for a second confirmation unless a new material business decision requires authority.
