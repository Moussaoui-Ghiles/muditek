---
title: Buyer Signal Evidence Model
tags:
  - gtm
  - evidence
  - skill-reference
---

# Evidence Model

## Evidence labels

Use exactly one primary label per statement or field:

| Label | Meaning | Permitted use |
|---|---|---|
| `verified_fact` | The inspected artifact directly supports the bounded observation recorded. This verifies what the artifact states or shows, not automatically the underlying commercial reality, current truth, buyer intent, or role authority. | Rule input, account evidence, filter, or conclusion only within the observation's source, date, and authority limits. |
| `current_decision` | Current governing choice made by the authorized owner, with decision date/version. It is authority for the operating rule, not factual proof that the rule is correct. | Approval status, operating constraint, rubric version, source permission decision, or next gate. |
| `user_provided_rule` | Explicit rule or decision supplied by the authorized user/client; not independently proven. | Operating constraint or approved hypothesis, visibly attributed. |
| `source_operator_example` | Practitioner framework, case, tactic, or self-reported result. | Generate or shape a test; never a benchmark or market fact. |
| `inference` | Reasoned interpretation from stated evidence. | Candidate rule or prioritization only; include rationale and confidence. |
| `unknown` | Missing, inaccessible, ambiguous, expired, or unresolved. | Preserve and route to research/review; never fill with a default silently. |

An internal targeting note can be a `user_provided_rule` or an input schema. It is not public proof merely because it exists in the in-scope workspace.

## Evidence ledger fields

Maintain one ledger row per claim or criterion:

- `evidence_id`
- `subject_type`: hypothesis, criterion, account, person, person-account-role, reach-path, signal, source, compliance, or suppression
- `subject_id`
- `field_or_claim`
- `value`
- `evidence_label`
- `source_name`
- `source_class`
- `source_url_or_workspace_file`
- `source_excerpt_or_observed_fact`
- `date_published` when known
- `date_updated` when known
- `date_observed`
- `date_verified`
- `verifier_or_owner`
- `expiry_rule`
- `status`: current, stale, contradicted, inaccessible, or unknown
- `confidence`: high, medium, or low
- `confidence_reason`
- `contradicts_evidence_ids`
- `missing_fields`
- `reviewer`
- `review_status`
- `rule_or_approval_version`

For account-level evidence, never replace the original source with a summary. Keep the summary and source side by side.

## Confidence rules

- **High:** direct, specific, current evidence from an authoritative or first-party source; no material contradiction.
- **Medium:** specific evidence from a credible secondary source, or multiple consistent indirect observations; limitations are material but bounded.
- **Low:** single indirect source, ambiguous entity match, thin text, old observation, or unresolved contradiction.
- **Unknown:** no usable evidence. Do not coerce unknown into low.

Confidence is not truth probability. It communicates evidence quality for the stated claim.

An approved score is also not truth probability. It is a documented operating rule that may rank or route records only within its approved niche, version, and evidence requirements.

## Contradictions and staleness

1. Retain every conflicting record and link the evidence IDs.
2. Check entity identity, definition, source authority, and observation date.
3. Prefer the more direct/current record only when the reason is explicit.
4. Mark the field `contradicted` if the conflict remains material.
5. Exclude or route to human review when the contradiction changes fit, signal usability, role authority, compliance, or suppression.
6. Never use an expired signal as current personalization. Historical facts may remain stable-fit evidence only if the rule permits it.

## Claim discipline

Write observable situations, not diagnosed pain:

- Allowed: “The company posted three revenue-operations roles on 2026-07-20.”
- Not allowed without direct evidence: “The company cannot manage its pipeline.”
- Allowed inference: “This may indicate investment in revenue operations; whether it creates a need for this offer is unknown.”

Separate the evidence chain:

`observable fact -> bounded inference -> commercial connection -> decision status`

Do not skip directly from a public event to buying intent.

## Source use rules

- Use public operator material only as an example or hypothesis unless its claim is independently verified.
- Use compiled research to define possible problems, disqualifiers, and evidence gaps. It does not prove that a specific account has a problem.
- Treat behavioral or engagement data as an observable event, not buying intent.
- Use current first-party operating notes as rules or schemas, not public market proof.
- Re-verify dated source capabilities, prices, access terms, and performance claims before use.
- Keep niche-specific economics and judgment rules inside their stated market. Do not reuse them as universal thresholds.
- Treat client or user answers as provided rules until independently evidenced.

## Public-use rule

If an output may be shown outside the company, verify precise statistics at the original source, remove confidential workspace details, obtain necessary client permission, and separate contracted, paid, built, tested, deployed, adopted, and business-result claims.

## Permissibility boundary

This canonical source set does not establish current legal, privacy, licensing, or platform-terms permission for a proposed pull. Treat permissibility as `UNPROVEN` until a current official source or qualified review covers the exact source, access method, jurisdiction, data, purpose, and destination.

Human approval cannot convert a prohibited or access-controlled use into a permitted one. Never recommend or operationalize authentication bypass, residential proxies, randomized anti-detection, identity/IP separation, session evasion, or similar circumvention, even when an operator source describes it.
