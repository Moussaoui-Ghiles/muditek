---
title: Buyer Signal Research Output Contract
tags:
  - gtm
  - sourcing
  - handoff
  - skill-reference
---

# Output Contract

## Decision states

Lead with exactly one state:

- `ready_for_rule_review`
- `ready_for_sample_pull_approval`
- `ready_for_approved_sample_handoff`
- `ready_for_full_pull_approval`
- `ready_for_approved_full_pull_handoff`
- `ready_for_campaign_creation_approval`
- `blocked_by_material_evidence_gaps`

The state describes the next authorized decision, not general quality. Never use a sample state for a full pull or an approved-handoff state when the corresponding external action is still unapproved.

## Output modes

### Decision brief (default)

Use for routine, incomplete, or executive-facing requests. Return only:

1. decision state and one-sentence reason;
2. acquisition motion, relationship state, and opportunity origin;
3. supported rules;
4. unsupported or contradicted rules;
5. up to five material gaps, ordered by the gate they block;
6. smallest next action;
7. exact approval requested and what it does not authorize.

Do not expose a large field schema, every empty criterion, or implementation detail in this mode.

### Operator specification

Use when the user requests the complete research and sourcing plan, or when an operator must review rules before a sample/full pull. Include the applicable sections below. Omit genuinely irrelevant sections with a short reason; do not manufacture content to fill them.

### Machine handoff

Use only when requested or when routing an approved specification to an execution skill. Include the exact fields/configuration needed for that action, with approval IDs and dry-run status. Technical field names belong here, not in the business-facing decision brief.

## Operator specification sections

### 1. Context and evidence

State:

- approved hypothesis and decision owner/version;
- offer/problem/outcome connection;
- acquisition motion, relationship state, and opportunity origin;
- sources searched and current equivalents used;
- material contradictions and unknowns.

The evidence ledger must follow `evidence-model.md`. A source reference must include its evidence ID, label, URL or vault note, publication/update date when known, date observed/verified, verifier/owner, limitation, and rule/approval version where relevant.

### 2. Account rules

| Rule ID | Include/exclude | Exact test | Commercial reason | Evidence required | Null handling | Evidence ID/label | Date verified | Limitation | Approval/version | Status |
|---|---|---|---|---|---|---|---|---|---|---|

Cover stable fit, geography, serviceability, size/capacity logic, required characteristics, exclusions, and disqualifiers. Distinguish `pass`, `fail`, `unknown`, and `manual_review`.

### 3. Buyer-role map

| Role type | Decision contribution | Candidate functions/titles | Authority evidence required | Evidence IDs | Evidence label/date | Ambiguity/limitation | Alternate path | Reach paths | Approval/version | Status |
|---|---|---|---|---|---|---|---|---|---|---|

Map problem owner, budget owner, evaluator, blocker, and necessary user/champion roles. Seniority or title alone does not prove ownership.

Normalize the person independently of employment. Preserve each person-account-role relationship, its current/past status, and supporting evidence.

### 4. Signal matrix

Use the evidence criteria and human-controlled dispositions in `signal-rubric.md`. Separate stable fit, triggers, and personalization-only context. Record the commercial connection, evidence references, observed/verified dates, expiry, limits, and approval version.

If a current niche-specific score is supplied, reproduce its documented rules separately from eligibility. Do not modify it, generalize it, or treat it as intent.

### 5. List-source comparison

| Source | Class | Exact URL/account | Coverage boundary | Authority | Native fields | Published/updated | Observed/verified | Expiry/recheck | Access method | Permission/terms evidence | Enrichment | Cost/time | Evidence ID | Owner | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

Never repeat an old count, price, access limit, or permission conclusion as current without verification and date. If official or qualified permission evidence is absent, compliance remains `UNPROVEN`.

### 6. Pull and filter specification

For each source define:

- exact source, universe boundary, and retrieval method;
- routed execution skill;
- native filters as `field / operator / value`;
- post-pull filters, joins, enrichment order, and null handling;
- evidence URL, observation date, verification date, and expiry capture;
- pagination, rate, licensing, privacy, terms, and access constraints;
- expected volume only when evidenced;
- cost/time ceiling, stop conditions, and destination;
- input snapshot/version/hash;
- human approval ID/status.

Express eligibility logic explicitly. Example:

```text
ACCOUNT_ELIGIBLE = geography_pass
  AND serviceability_pass
  AND required_characteristics_pass
  AND NOT hard_disqualifier
  AND suppression_clear

SIGNAL_ELIGIBLE = account_eligible
  AND human_accepted_signal_present
  AND every_required_signal_criterion_pass
  AND signal_current
  AND no_material_contradiction
```

### 7. Identity, reach, dedupe, and suppression

Define:

- account identity and canonical organization keys;
- person identity independent of employer;
- person-account-role relationship keys and current/past role handling;
- reach-path identity, provenance, verification, and permission requirements;
- parent/subsidiary, franchise, shared-domain, and collision handling;
- duplicate winner rule without deleting provenance or contradictions;
- customer, active-opportunity, partner, employee, prior-outreach, bounce, unsubscribe, do-not-contact, legal, and reputation suppressions;
- missing-critical-field behavior.

An account has channel coverage only when at least one relevant buyer has an approved, verified reach path on that channel. An accepted email by a receiving server is not evidence that a human buyer was reached.

### 8. Sample-review design

State:

- decisions and strata the sample must cover;
- sampling frame and exclusions;
- deterministic selection method and seed, or documented manual selection method;
- review budget, time, cost, and risk ceiling;
- proposed sample count only after those constraints are known;
- source, filters, and whether an external action is required;
- reviewer checks and row-level reason codes;
- adjudication owner and reference set used to judge false positives/negatives;
- rules for revise, proceed, or stop;
- approval required before the pull and after review.

Do not invent a convenient count. If constraints are missing, provide the required strata and ask for the ceiling. A sample demonstrates operational coverage; it is not statistical proof unless a valid statistical design is separately supplied.

Do not report false-positive or false-negative rates as objective when no adjudicated reference decision exists. Report reviewer disagreement or unresolved cases instead.

### 9. Reproducible QA and reconciliation

Record:

- source/input snapshot, version, timestamp, and hash where available;
- rules, rubric, and code/config version;
- batch counts at source capture, native filters, enrichment, dedupe, suppression, manual review, approval, and handoff;
- count variances with reason codes;
- deterministic sample selection evidence;
- row-level QA status, reviewer, decision, and reason code;
- stale evidence, identity collisions, role uncertainty, expired signals, contradictions, and missing reach paths;
- pre-import schema, required-field, uniqueness, suppression, and approval validation;
- expected post-import readback: imported, rejected, suppressed, changed, and unresolved counts plus destination identifiers.

This research skill defines the readback contract. The routed execution skill performs the mutation and readback only after approval.

### 10. Missing-evidence report and decision request

Group gaps by what they block: rule review, sample pull, full pull, campaign creation, or launch/send. Name the smallest evidence/action that can close each gap.

End with one precise gate:

> [!warning] Human approval required
> Approve or revise: [exact rules/action/scope]. This approval does not authorize: [next mutation, launch, or send].

## Machine handoff schema

Include only fields needed by the approved destination. Preserve nulls rather than fabricating defaults.

### Context

- `hypothesis_id`
- `hypothesis_approval_id`
- `motion`
- `relationship_state`
- `opportunity_origin`
- `rules_version`
- `input_snapshot_id`
- `input_snapshot_hash`

### Account

- `account_id`
- `legal_name`
- `display_name`
- `domain`
- `registry_or_source_id`
- `parent_account_id`
- `location`
- `geography_status`
- `serviceability_status`
- `stable_fit_status`
- `inclusion_rule_results`
- `exclusion_rule_results`
- `account_evidence_ids`
- `account_confidence`
- `account_unknowns`

### Person and role relationship

- `person_id`
- `normalized_full_name`
- `person_identity_evidence_ids`
- `person_account_role_id`
- `account_id`
- `current_title`
- `role_type`
- `relationship_status`
- `role_start_date`
- `role_end_date`
- `authority_status`
- `authority_evidence_ids`
- `role_unknowns`

### Reach path

- `reach_path_id`
- `person_account_role_id`
- `channel`
- `path_value_or_url`
- `source_name`
- `source_url_or_vault_note`
- `source_evidence_id`
- `date_observed`
- `date_verified`
- `verification_method`
- `verification_status`
- `current_role_link_status`
- `access_permission_status`
- `terms_constraint_status`
- `reach_path_unknowns`

### Signal and evidence

- `evidence_ids`
- `signal_ids`
- `observable_situation`
- `commercial_connection`
- `date_observed`
- `date_verified`
- `expiry_rule`
- `signal_rule_version`
- `signal_criterion_results`
- `signal_recommended_disposition`
- `signal_human_disposition`
- `signal_decision_owner`
- `signal_decision_date`
- `confidence`
- `contradictions`
- `missing_fields`
- `personalization_usable`
- `personalization_basis`

### Operations and QA

- `list_source`
- `pulled_at`
- `pull_version`
- `account_dedupe_key`
- `person_dedupe_key`
- `person_account_role_key`
- `reach_path_key`
- `suppression_status`
- `qa_status`
- `qa_reason_codes`
- `human_review_status`
- `approval_gate`
- `campaign_handoff_status`
- `copy_version`
- `message_attempt_id`

`message_attempt_id` and `copy_version` are placeholders for a later campaign/copy system. A message attempt means one planned or sent outbound attempt to one person through one channel; it is not a unique-person or unique-account metric.

### Dry-run control

```yaml
mode: dry_run
hypothesis_approval: approved
rules_approval: approved
sample_pull_approval: pending
full_pull_approval: pending
campaign_creation_approval: pending
external_campaign_id: null
launch_authorized: false
send_authorized: false
```

Stop before any external pull, import, campaign mutation, launch, or send unless the user has separately authorized that exact action.
