---
title: Buyer Signal Rubric
tags:
  - gtm
  - signals
  - skill-reference
---

# Signal Rubric

## First classify the input

- **Stable fit:** a comparatively durable account characteristic that determines whether the account can plausibly benefit and be served.
- **Trigger:** a time-bound observable event or situation that may change relevance, timing, or priority.
- **Personalization material:** accurate context that may make a message concrete but does not independently establish fit or timing.

One observation may serve more than one layer only when each use is justified separately. Title and industry are normally discovery fields, not a sufficient trigger or reason for contact.

## Required signal record

- `signal_id`
- `signal_name`
- `observable_definition`
- `layer`
- `account_fit_prerequisite`
- `commercial_connection`
- `plausible_alternative_explanations`
- `source_class`
- `source_reliability`
- `evidence_ids`
- `source_url_or_vault_note`
- `date_published_or_updated`
- `date_observed`
- `date_verified`
- `verifier_or_owner`
- `recency_window`
- `expires_on_or_expiry_rule`
- `role_relevance`
- `channel_usability`
- `compliance_or_terms_constraint`
- `required_corroboration`
- `confidence`
- `approved_rule_version`
- `criterion_results`
- `recommended_disposition`
- `human_disposition`
- `decision_owner`
- `decision_date`

## Commercial-connection test

Complete all four lines:

1. **Observed:** What is directly visible?
2. **May imply:** What narrow operating change could follow, stated as an inference?
3. **Offer connection:** Which specific offer capability could be relevant if that implication is true?
4. **Unknown:** What must still be learned before claiming need, intent, or priority?

Reject the signal if line 3 is generic, circular, or merely says the prospect is in the target industry. Keep the language conditional unless direct evidence closes the gap.

## Evidence-criterion review

Evaluate each criterion against an explicit evidence requirement. Never invent, import, transpose, or optimize a score, weight, ranking, or threshold. If a current, documented, human-approved niche-specific rubric exists, preserve it exactly as a separate prioritization rule with its version and evidence requirements. Do not use it as an eligibility gate unless that exact use was approved, and never interpret its result as proof of pain, authority, budget, or intent.

Use only:

- `PASS`: the record satisfies a human-approved rule and the required evidence is present.
- `FAIL`: the record contradicts or does not satisfy a human-approved rule.
- `UNPROVEN`: the evidence, rule, or human decision needed to resolve the criterion is missing or ambiguous.

| Criterion | `PASS` | `FAIL` | `UNPROVEN` |
|---|---|---|---|
| Observability | Specific observable situation and entity match satisfy the approved definition | Observation is vague, mismatched, or not the defined event | Entity, event, or definition cannot yet be resolved |
| Source eligibility | Source and captured evidence satisfy the approved source rule | Source is prohibited, unusable, or fails the approved source rule | No approved source rule or source eligibility is unresolved |
| Commercial connection | The exact observed -> possible consequence -> offer-capability chain is human-approved | Connection is generic, circular, industry-only, or contradicted | Connection is plausible but not evidenced or approved |
| Observation and expiry | Observation date exists and the signal is current under an approved expiry rule | Signal is expired for the proposed use | Date or approved expiry rule is missing/ambiguous |
| Stable-fit prerequisite | Account passes every prerequisite required by the approved signal rule | Account fails a required stable-fit prerequisite | One or more required fit facts are unresolved |
| Role/action usefulness | Proposed role or review action satisfies the approved role-use rule | Proposed role/action conflicts with the approved rule | Role relevance or authority remains unresolved |
| Compliance and terms | Current official evidence or qualified review supports the exact source, access method, data, jurisdiction, purpose, and destination, and the responsible human has approved use | Proposed use violates or circumvents law, privacy requirements, licensing, platform terms, access controls, or source restrictions | Current authoritative applicability or qualified review is missing, ambiguous, or out of date |
| Contradiction check | No material contradiction remains for the proposed use | Current evidence materially contradicts the proposed use | A material conflict exists but is unresolved |

### Hard evidence gates

Do not propose campaign use when any required criterion is `FAIL` or `UNPROVEN`. Reject or quarantine when:

- the commercial connection is not `PASS`;
- source eligibility or observation/expiry is not `PASS`;
- the signal is expired for its proposed use;
- stable-fit prerequisites are not `PASS`;
- compliance and terms are not `PASS`;
- a material contradiction is unresolved;
- using the signal would require asserting unproven pain, intent, authority, or personalization.

An approved sample may deliberately investigate named `UNPROVEN` criteria only when all non-negotiable safety/compliance gates pass and the human approves the exact sample and review plan. Sample inclusion does not authorize campaign use.

Human approval is necessary but not sufficient for compliance. It cannot override a prohibition or resolve an unclear law, term, license, privacy duty, or access control. Never propose authentication bypass, residential proxies, randomized anti-detection, identity/IP separation, session evasion, or similar circumvention.

### Human-controlled disposition

Do not derive an overall disposition from a formula. Record the human-approved rule/version, criterion results, decision owner, and decision date. Use these labels only under the stated conditions:

- `accepted`: every criterion required by the human-approved signal rule is `PASS`, and the human explicitly approves campaign eligibility.
- `sample_candidate`: the human explicitly approves the record for a bounded sample that tests named `UNPROVEN` criteria; it is not campaign-eligible.
- `needs_corroboration`: the human-approved rule requires additional evidence; do not use it in a campaign until review changes the disposition.
- `rejected`: a hard criterion is `FAIL` or the human rejects the signal.
- `unknown`: no applicable approved rule or disposition exists.

The agent may recommend a disposition with reasons, but only a recorded human decision can set `accepted`, `sample_candidate`, or `needs_corroboration`.

## Recency and expiry

Set expiry from the mechanism, not convenience. Examples:

- An active job posting may expire when closed or after a defined observation window.
- A funding event may remain a stable company-history fact after it stops being a timely trigger.
- A social engagement may become unusable for message context quickly, even if the content remains public.
- A regulatory deadline may expire after the deadline or change meaning after compliance status changes.

When no defensible expiry exists, mark it `unknown` and do not use the observation as a current trigger.

## Compound signals

Do not add weak signals mechanically. For a compound rule, state:

- why the signals are independent or complementary;
- whether one source merely repeats another;
- what alternative explanation survives;
- which component supplies fit, timing, role, and message context;
- how contradictions affect the result.

Compound evidence can raise confidence in an inference; it still does not prove a company has a problem or intent.

## Eligibility and prioritization

Keep these separate:

- **Eligibility:** explicit inclusion, exclusion, safety, evidence, and suppression gates. A required `FAIL` or `UNPROVEN` blocks campaign eligibility.
- **Prioritization:** ordering among already eligible records using an approved rule. A score may prioritize review or outreach only inside its documented niche and version.

Never repair a weak eligibility record with a high score. Never convert a niche score into a universal framework or describe it as probability of purchase.

## Signal-matrix output columns

| Signal | Layer | Observable definition | Approved rule/version | Criterion results | Evidence IDs/links | Published/observed/verified/expiry | Confidence | Recommended disposition | Human disposition | Decision owner/date | Unknowns |
|---|---|---|---|---|---|---|---|---|---|---|---|

Keep the recommendation and human disposition separate. Never write an agent recommendation into the human-decision field.
