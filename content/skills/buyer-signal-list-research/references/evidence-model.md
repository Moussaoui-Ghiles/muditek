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

An internal targeting note can be a `user_provided_rule` or an input schema. It is not public proof merely because it exists in the vault.

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
- `source_url_or_vault_note`
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

## Canonical vault source set and safe use

Read current files at these paths or locate their current equivalents when an operational file moved:

| Vault source | Safe contribution | Boundary |
|---|---|---|
| `[[library/sources/youtube/cole-gordon/2026-07-18-outbound-setting-team-75m-playbook]]` | Market size, customer value, buyer accessibility, motion/source context, small first-party sample, and complete handoff-chain thinking. | Distinguish cold SDR from MDR follow-up. Treat figures and KPI ranges as operator examples, not universal benchmarks. |
| `[[library/research/Pipeline Micro-Problems  Evidence-Led Research on Qualified-Meeting Buyers]]` | Problem records, evidence-strength language, disqualifiers, manual diagnostic logic, and explicit evidence gaps. | Compiled research is not proof that any particular account has a problem. Preserve the segment and source limitations. |
| `[[library/sources/twitter/dimitar-angelov/2026-01-20-social-media-scraping-behavioral-lead-data]]` | Candidate behavioral-data sources and platform-specific observable events. | All performance, cost, volume, intent, and platform-limit claims are self-reported/operator claims unless independently verified. Engagement is not buying intent. |
| `[[library/sources/twitter/dimitar-angelov/2026-03-14-problematized-outbound-personalization-is-dead]]` | Testable problem-matrix idea and distinction between surface personalization and commercial relevance. | Do not claim a problem from a proxy. All test results are self-reported. |
| `[[library/sources/twitter/dimitar-angelov/2026-03-23-platform-exploits-cold-email-twitter-linkedin-response-rates]]` | Candidate timing, activity, role, and micro-segment hypotheses. | Every claimed rate or multiplier is self-reported and never a benchmark, threshold, forecast, or universal rule. Some tactics may create compliance or platform-risk concerns. |
| `[[marketing/outbound-kit/list-source-map]]` | Source-comparison schema: authority, access method, native fields, enrichment gaps, fallback, and compliance flags. | Niche choices, counts, prices, and build order are dated operational inputs; re-verify before use. |
| `[[marketing/outbound-kit/ma-enrichment-pipeline]]` | Universe -> structured fit -> evidence read -> contact enrichment -> review pipeline, plus evidence lines and explicit out-of-scope fields. | Its M&A judgment rubric and economics are niche-specific, not reusable market facts or thresholds. Exit signals are probability-raising, never proof of intent. |
| `[[marketing/outbound-kit/intake-form]]` | Offer economics, fit, pain language, proof, logistics, suppression, and approval intake fields. | Client answers are user-provided rules until independently evidenced. |
| `[[marketing/content-operating-system]]` | Truth labels, problem record, promotion gates, unknown preservation, source hierarchy, and qualified-response validation logic. | Content engagement cannot validate a niche; AI-generated material is never evidence. |

## Public-use rule

If an output may be shown outside the company, verify precise statistics at the original source, remove confidential vault details, obtain necessary client permission, and separate contracted, paid, built, tested, deployed, adopted, and business-result claims.

## Permissibility boundary

This canonical source set does not establish current legal, privacy, licensing, or platform-terms permission for a proposed pull. Treat permissibility as `UNPROVEN` until a current official source or qualified review covers the exact source, access method, jurisdiction, data, purpose, and destination.

Human approval cannot convert a prohibited or access-controlled use into a permitted one. Never recommend or operationalize authentication bypass, residential proxies, randomized anti-detection, identity/IP separation, session evasion, or similar circumvention, even when an operator source describes it.
