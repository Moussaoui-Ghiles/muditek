---
title: Buyer Signal Research Intake Schema
tags:
  - gtm
  - sourcing
  - skill-reference
---

# Intake Schema

Use progressive intake. Search supplied inputs and the in-scope workspace first, prefill every supported answer with its evidence label, then ask only questions whose answers change the next rule, filter, source, cost, compliance boundary, or approval decision.

## Search order

1. User-provided hypothesis, offer, market, files, links, and prior decisions.
2. Current offer, proposal, and operating notes supplied for this work.
3. Current intake, list-source, enrichment, infrastructure, and campaign notes in scope.
4. Relevant outreach and pipeline records as first-party inputs or schemas only.
5. Directly relevant source material governed by `evidence-model.md`.
6. External research only when needed, allowed, and sourceable.

Log the search path, useful files, current equivalents found, and gaps. Do not ask the user to repeat facts already present.

## Progressive intake groups

### A. Approval and problem-offer connection

- Is the market/offer hypothesis approved? By whom and when?
- What exactly is sold, to whom, for what unit of value?
- What observable situation is connected to the offer?
- What desired buyer outcome does the offer support?
- What commercial consequence makes the situation relevant?
- What remains hypothesis rather than verified buyer demand?
- What outcome would invalidate or pause this segment?
- Which acquisition motion applies: `true_cold`, `trust_assisted`, `warm_follow_up`, `reactivation`, `partner`, or another explicitly defined motion?
- What is the current relationship state with the account/person?
- Where did the opportunity originate: sourced list, first-party CRM, content, lead magnet, event, referral, partner, prior pipeline, or another recorded source?

### B. Stable-fit account rules

- Required characteristics and minimum evidence for each.
- Exclusions and hard disqualifiers.
- Geography, language, jurisdiction, and serviceability.
- Company type, ownership, business model, regulatory context, and maturity where relevant.
- Company size/capacity logic: employee, revenue, transaction, location, technology, or operating-volume thresholds and the reason each matters.
- Buyer-side capacity or minimum economic value.
- Seller delivery capacity and maximum new accounts/meetings.
- Known account universe, named seed accounts, authoritative registries, and boundary conditions.
- Whether subsidiaries, franchises, portfolio companies, branches, practices, or locations count as distinct accounts.

### C. Buying-group and contact rules

- Problem owner.
- Budget owner.
- Technical/business evaluator.
- Blocker or veto holder.
- Champion or workflow user when distinct.
- Typical and alternate titles for each role.
- Functional evidence that matters more than title.
- Known title ambiguity and authority uncertainty.
- Escalation or referral path when the first contact is not the owner.
- Channel paths available for each role: work email, phone, LinkedIn, X, partner/referral, form, event, or other approved route.
- Person identity fields independent of employment: normalized name, stable profile/source identifiers, and identity-match evidence.
- Person-account-role relationship: account, role/title, function, current/past status, start/end dates when known, and evidence ID.
- Reach-path requirements for every channel: path value, source, date observed/verified, verification method, verification status, current-role link, and access/permission/terms constraints.

### D. Signals and evidence

For every proposed signal collect:

- precise observable event/situation;
- fit layer, trigger layer, or personalization-only layer;
- commercial connection to the offer;
- source class and source reliability;
- evidence URL or workspace file reference;
- date observed;
- recency window and expiry rule;
- usability: account selection, prioritization, role selection, timing, or message context;
- confidence and why;
- contradictions and missing fields;
- whether human verification is required;
- data-use, privacy, terms, and compliance constraints.

### E. List sources and pull constraints

- Known list sources and whether each is authoritative, first party, operator-provided, platform-derived, database-derived, or inferred.
- Permitted and prohibited data sources.
- Access method: export, API, public page, licensed account, manual lookup, or approved scraper.
- Source URL, publication/update date, date observed/verified, owner/verifier, expiry or recheck rule, expected coverage, nulls, and update cadence.
- Exact filters available natively versus filters requiring enrichment.
- Rate/access constraints; current official terms, access-control, privacy, and permitted-use evidence.
- Whether a qualified legal/privacy review is needed because official guidance does not resolve the proposed use.
- Required enrichment and verification providers.
- Target sample size and full-universe size if known.
- Cost ceiling, time ceiling, owner, and delivery date.

### F. Units, identity, dedupe, and suppressions

- Account unit and canonical account key: preferably verified domain plus legal/registry ID where available.
- Person unit and identity key independent of any employer; do not use an email or profile alone as proof of the current role relationship.
- Person-account-role unit and key, with current/past relationship state preserved. One person may have multiple simultaneous or historical roles.
- Reach-path unit and key: person-account-role + channel + normalized path value, with provenance and verification retained.
- Message attempt, when needed by a later handoff: one planned or sent outbound attempt to one person through one channel. It is not a list unit or a proxy for unique reach.
- Fallback keys and collision-resolution rules.
- Subsidiary/domain-sharing rules.
- Existing-customer, active-opportunity, partner, employee, prior-outreach, bounce, unsubscribe, do-not-contact, legal, and reputation suppressions.
- Record-merging rules that preserve all provenance and contradictions.

### G. Required output and handoff

- Required account, contact, evidence, and operational fields.
- CRM/sheet/campaign destination and allowed formats.
- Qualification status values.
- Campaign handoff fields.
- Copy or personalization dependencies, without inventing either.
- Reviewer, approver, approval evidence, and change-control owner.
- Required QA checks and acceptable error/unknown thresholds; if not known, mark unknown rather than choose one.
- Input snapshot/version/hash, selection method or seed, source-to-handoff batch counts, QA reason codes, adjudication owner/reference set, and expected post-import readback.
- Requested output mode: decision brief, operator specification, or machine handoff.

### H. Human approval gates

- Who approves the hypothesis?
- Who approves fit, exclusion, buyer-role, and signal rules?
- Who approves source use and compliance constraints?
- Who approves the sample scope and cost?
- Who reviews the sample and approves rule revisions?
- Who authorizes the full pull?
- Who authorizes campaign creation, launch, and sending separately?

Approval identifies the responsible decision-maker; it does not make a prohibited or unresolved data use permissible. Require current authoritative evidence or qualified review when law, platform terms, privacy, licensing, or access controls are unclear.

## Materiality test for questions

Ask a question now only if its answer changes at least one of:

- include/exclude decision;
- signal pass/reject/expiry decision;
- buyer-role selection;
- source or filter choice;
- account/person/person-account-role/reach-path/message-attempt unit;
- legal/data-use boundary;
- sample size, cost, time, or QA plan;
- approval gate.

Otherwise record it as a later-stage unknown. Prefer a short gap table over a long questionnaire.
