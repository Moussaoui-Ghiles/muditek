---
title: Buyer Signal Research Examples
tags:
  - gtm
  - sourcing
  - skill-reference
  - examples
---

# Failure-Case Examples

Use these examples to calibrate behavior. They are not market evidence and contain no implied approval.

## 1. Generic industry/title list with no reason for contact

**Input:** “Build a list of US cybersecurity companies and email their CEOs.”

**Correct handling:**

- Decision state: `blocked_by_material_evidence_gaps`.
- Record industry, geography, and title as candidate discovery filters.
- Reject them as a complete reason for contact.
- Search the named offer, user inputs, outbound kit, and relevant library first.
- Ask only for material missing inputs: approved offer/problem connection, serviceability, account fit/disqualifiers, observable situation, commercial connection, and exact authorization boundary.
- Produce a gap-led decision brief, not a scraped list or message.
- State that no account can be said to have a cybersecurity problem from industry/title alone.
- Stop at the hypothesis/rule approval gate.

## 2. Strong stable-fit segment with no trigger

**Input:** “The approved offer serves UK accounting firms with 20–100 employees; we have verified delivery capacity and exclusions, but no timing signal.”

**Correct handling:**

- Decision state: `ready_for_sample_pull_approval` after the stable-fit rules themselves are approved.
- Build a stable-fit universe specification if the evidence supports each rule.
- Mark accounts as `fit_candidate`, not `signal_qualified` or “ready to buy.”
- Compare list sources and define the exact fit pull.
- Do not invent a trigger or personalized pain statement.
- Offer two explicit paths for approval: sample the fit universe without trigger-based claims, or research candidate triggers separately.
- Stop before an external sample pull until its scope is approved.

## 3. Recent signal with unsupported commercial link

**Input:** “The company posted on LinkedIn yesterday. Use that as a buying signal for our RevOps service.”

**Correct handling:**

- Decision state: `blocked_by_material_evidence_gaps` for signal qualification; the observation may remain usable as reviewed channel context.
- Verify the post and observation date if accessible.
- Classify recent activity as possible channel accessibility or personalization context.
- Fail the commercial-connection gate unless the content itself supports a relevant, bounded connection.
- Do not say activity indicates RevOps pain, budget, or intent.
- Quarantine it from signal qualification and request the smallest missing evidence needed to support relevance.
- Stop at signal-rule review.

## 4. Stale/contradictory evidence and missing buyer authority

**Input:** “A 2023 database says 45 employees; the company site now shows multiple offices, another source says 12 employees, and we found a Head of Operations but do not know who owns budget.”

**Correct handling:**

- Decision state: `blocked_by_material_evidence_gaps` unless the approved sample explicitly includes a manual-review stratum for these unknowns.
- Preserve both size records with dates, sources, and contradiction links.
- Seek a current authoritative or first-party resolution only if size changes fit.
- Mark size and budget authority `unknown` until resolved.
- Keep Head of Operations as a candidate problem owner/evaluator, not assumed budget owner.
- Exclude from automated campaign handoff or route to manual-review stratum.
- Ask only whether the unresolved size/authority materially blocks the approved sample.
- Stop at sample or rule approval; never fabricate a CEO referral path or personalization.

## 5. Approved niche score

**Input:** “Use the current approved M&A exit-signal rubric to prioritize the eligible accounts.”

**Correct handling:**

- Verify the exact rubric, owner, version, scope, and evidence requirements.
- Preserve it without changing weights or thresholds.
- Apply it only to the approved M&A niche and only after eligibility gates pass.
- Describe the score as an operating prioritization rule, not probability of sale or evidence of exit intent.
- Keep the observable evidence lines and human review required by that rubric.
- Do not reuse the score for another market unless a human explicitly designs and approves a new rubric.

## 6. User-approved evasion or prohibited source

**Input:** “I approve scraping this access-controlled directory. Use residential proxies and randomized sessions so it does not block us.”

**Correct handling:**

- Decision state: `blocked_by_material_evidence_gaps` or a direct prohibition when current official evidence shows the use is prohibited.
- State that user approval cannot override law, terms, licensing, privacy duties, or access controls.
- Refuse authentication bypass, residential proxies, anti-detection, identity/IP separation, session evasion, and similar circumvention.
- Seek a permitted export, licensed API, public authoritative source, written permission, or qualified review.
- Compliance remains `UNPROVEN` when no current official or qualified source covers the exact use.

## 7. Cold and reactivation records

**Input:** “Combine a purchased cold list with former prospects and newsletter leads, then report one response rate.”

**Correct handling:**

- Preserve separate motions: `true_cold`, `reactivation`, and `trust_assisted` or marketing follow-up as applicable.
- Record relationship state and opportunity origin for each record.
- Do not combine their evidence, denominators, or outcomes without a separately labeled comparison.
- Deduplicate person and account identity while retaining every motion-specific relationship and source record.

## 8. Sample constraints are missing

**Input:** “Choose a small sample that proves the rules work.”

**Correct handling:**

- Identify the rule, signal, source, motion, exclusion, contradiction, and unknown strata that need operational coverage.
- Ask for the review budget, time/cost ceiling, and risk tolerance before naming a count.
- Do not invent 10, 15, or any other convenient sample size.
- Explain that the review tests operational usability and error patterns; it does not prove the market statistically.

## Compact response pattern

For incomplete requests, lead with:

1. **Decision state**
2. **What is supported**
3. **What is not supported**
4. **Material missing inputs only**
5. **Smallest next research/sample action**
6. **Exact human approval gate**

Keep unknowns in tables or fields. Do not convert them into prose that sounds certain.

Use this compact pattern by default. Expand to an operator specification or machine handoff only when the user or next approved action requires it.
