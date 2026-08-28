---
name: buyer-signal-list-research
description: Turn an approved B2B market and offer hypothesis into evidence-backed account-fit rules, buyer-role rules, signal criteria, list-source choices, exact pull filters, QA rules, sample-review plans, and campaign-ready sourcing specifications. Use when Codex needs to research who should enter an outbound list, define a defensible reason for contact, compare sourcing paths, prepare a human-reviewed list brief, or translate already-approved rules into a campaign creation brief/config before any scraping, campaign mutation, launch, or send. Do not use for copy-only requests or to execute scraping, enrichment, campaign mutation, launch, or sending; route those actions to their dedicated skills after the required approval.
---

# Buyer Signal List Research

## Purpose

Convert an approved market/offer hypothesis into a reproducible sourcing specification. Research and specify; do not silently validate a market, select a segment, build a list, or execute outreach.

## Load the references

Read these files before producing the corresponding work:

- `references/intake-schema.md` for intake, vault search, and material-missing-input rules.
- `references/evidence-model.md` for evidence labels, provenance, confidence, contradiction handling, and source boundaries.
- `references/signal-rubric.md` before evaluating, expiring, or proposing a disposition for any signal.
- `references/output-contract.md` before delivering a specification, sample-review plan, or campaign handoff.
- `references/examples.md` when the request is ambiguous or resembles a failure case.

## Non-negotiable boundaries

- If the list, buyer rules, and signal rules are already approved and the request is only to write outreach copy, preserve those approved inputs and route to `$cold-email` for email or the relevant LinkedIn outreach skill for LinkedIn. Do not reopen research unless a visible evidence contradiction or unsupported personalization claim must be resolved. Copy approval does not authorize campaign creation, launch, or sending.
- Treat **stable fit**, **trigger evidence**, and **personalization material** as separate layers.
- Keep acquisition motions separate. `true_cold`, `trust_assisted`, `warm_follow_up`, `reactivation`, and `partner` records must retain their motion, relationship state, and opportunity origin; never blend their evidence or results.
- Reject title plus industry as a complete reason for contact. It may help identify a candidate; it does not establish relevance or timing.
- Require a stated commercial connection for every proposed signal: observable situation -> plausible operating consequence -> offer-relevant capability. Reject the signal if that chain is unsupported.
- Describe only the observable situation. Never claim an account has a problem, intent, budget, or buying readiness unless direct evidence proves it.
- Preserve source, evidence URL or vault note, date observed, recency/expiry rule, confidence, contradictions, missing fields, and unknowns per criterion/account.
- Label every material statement as `verified_fact`, `current_decision`, `user_provided_rule`, `source_operator_example`, `inference`, or `unknown`.
- Treat all response-rate, volume, cost, and performance claims from practitioners as self-reported unless independently verified. Never import them as benchmarks, thresholds, or universal rules.
- Use targeting, outreach, and pipeline notes as internal schemas or first-party inputs only. Do not present them as public market proof.
- Never fabricate personalization from a fit rule, proxy, or weak signal.
- Never invent, import, or transpose a score or threshold. Preserve a documented, current, human-approved niche rubric exactly when it applies, but label it as an operating rule rather than truth probability. A score never proves problem, authority, budget, or intent.
- Human approval is necessary but never overrides law, platform terms, access controls, contractual restrictions, privacy requirements, or source prohibitions. When permissibility is unresolved, mark it `UNPROVEN` and require a current authoritative source or qualified review. Never recommend authentication bypass, residential proxies, randomized anti-detection, identity/IP separation, session evasion, or similar circumvention.
- Never expand a market, choose a segment, approve a signal, scrape a full list, create or mutate a live campaign, launch, or send without the matching human approval.
- If external list execution is approved, hand the pull specification to `apify-lead-generation`, `apify-ultimate-scraper`, or `phantombuster` as appropriate. Do not duplicate their scraping workflow here.
- When writing a vault note, follow Obsidian syntax: YAML properties, `[[wikilinks]]` for internal notes, callouts for warnings, and external Markdown links only for web URLs.

## Workflow

### 1. Confirm the operating mode

Choose the operating mode:

- **Research specification:** produce rules, evidence, filters, QA, and review gates.
- **Approved campaign handoff:** translate approved rules into a creation brief/config; stop before external mutation unless separately authorized.

Choose the smallest output mode that serves the decision:

- **Decision brief** (default): state, supported rules, unsupported rules, material gaps, smallest next action, and exact approval gate.
- **Operator specification:** rules, role map, signals, sources, pull logic, sample design, dedupe, and QA.
- **Machine handoff:** exact field schema or dry-run configuration, only when requested or routing an approved execution handoff.

If the market/offer hypothesis is not explicitly approved, record it as unapproved and stop at a decision brief. Do not select or validate it on the user's behalf.

### 2. Search before asking

Search user-provided material and the vault before asking intake questions. Start with the named offer, market, campaign, pipeline, and outbound-kit files. Then inspect only relevant library sources and current operational notes. Record what was searched and what it established.

Use the canonical source set and source lessons in `references/evidence-model.md`. Search current equivalents if a named operational file moved. Ask only for material inputs still missing after the search; group questions by the next decision they block.

### 3. Build the context and evidence ledger

Create one row per criterion, claim, signal, source constraint, or unknown. Do not blend evidence classes. Resolve contradictions by retaining both records, preferring the more direct/recent source only with an explicit rationale, and lowering confidence when unresolved.

Record `motion`, `relationship_state`, and `opportunity_origin` before interpreting evidence. First-party reactivation, marketing follow-up, partner introductions, and true cold sourcing are different motions even when they target the same account.

### 4. Define stable account fit

Specify:

- required account characteristics;
- explicit exclusions and disqualifiers;
- geography and serviceability;
- size/capacity logic tied to offer economics or delivery constraints;
- known account universe and boundary;
- evidence required to mark each rule pass, fail, or unknown.

Do not use an unexplained employee or revenue range. State the commercial or operational reason for every threshold. A fit-only account may enter a fit universe, but it is not automatically signal-qualified or campaign-ready.

### 5. Map the buying group

Map problem owner, budget owner, evaluator, blocker, and any other necessary participant. For each role, define decision contribution, observable titles/functions, title ambiguity, escalation path, authority evidence, channel accessibility, and unknowns.

Do not equate seniority with ownership. When authority is uncertain, preserve it as `unknown` and define how the sample will test it.

### 6. Define and grade signals

For each candidate signal, apply `references/signal-rubric.md`. State:

1. observable event or situation;
2. source and reliability;
3. commercial connection;
4. date observed and expiry rule;
5. account and role relevance;
6. usability and data/compliance limits;
7. confidence and missing evidence.

Propose a disposition from the recorded criterion results, but never set human-controlled acceptance fields. Quarantine unsupported, stale, contradictory, or unverifiable candidates instead of rescuing them with invented copy.

### 7. Compare list sources and write the pull

Compare authoritative registries/directories, first-party records, social/platform data, commercial databases, company sites, news, and approved enrichment paths. Evaluate coverage, authority, publication/update date, date verified, recheck rule, field availability, access method, compliance/terms constraints, cost, time, expected nulls, and verification needs.

Write exact filters and pull logic, including source, field, operator, values, joins, null handling, date windows, fallback, and evidence capture. Separate facts obtainable from the source from fields that require enrichment or human review.

### 8. Define units, dedupe, and QA

Keep these units distinct:

- **Account unit:** one organization or legal/business entity.
- **Person unit:** one normalized individual, independent of any company relationship.
- **Person-account-role unit:** one person's role relationship with one account, including role status and dates.
- **Reach path:** one approved email address, phone number, profile, partner route, or other channel path with source, verification method/status/date, role link, and permission/terms constraints.
- **Message attempt:** one planned or sent outbound attempt to one person through one channel. It is outside list research unless the handoff needs a placeholder, and it never substitutes for a unique person or account count.

Define canonical keys, normalization, collision handling, household/group exceptions if any, suppression sources, missing-field rules, provenance retention, and QA sampling. Never merge away contradictory evidence.

### 9. Design a bounded sample review

Derive the sample scope from the distinct rule, signal, source, motion, and exception strata that must be tested, then apply the approved review budget, time, cost, and risk ceiling. Do not invent a sample count. If the ceiling is missing, propose the strata and ask for the constraint before naming a number. This is operational coverage, not statistical proof.

Do not pull the sample until the human approves its exact scope if the pull uses an external service or account.

After review, report false positives and false negatives only against an adjudicated reference decision. Otherwise report reviewer decisions, disagreements, unknown rates, authority gaps, expired evidence, contradictions, and rule changes. Require approval of revised rules before a full pull.

### 10. Deliver the sourcing specification

Follow `references/output-contract.md`. Lead with one exact state that distinguishes rule review, sample approval, approved sample handoff, full-pull approval, approved full-pull handoff, campaign creation approval, or a material block.

When asked for a campaign creation brief/config, include only approved fields and placeholders for credentials or external IDs. State the next mutation explicitly and stop before performing it unless the user separately authorizes that action.

## Human approval gates

Stop and request approval at each applicable gate:

1. **Hypothesis gate:** market/offer/problem connection and serviceability.
2. **Rule gate:** inclusion, exclusion, buyer-role, signal, source, compliance, and unit definitions.
3. **Sample gate:** exact source, filters, strata, sample size, cost/time ceiling, and external action.
4. **Sample-handoff gate:** approved sample specification and exact routed external action.
5. **Full-pull gate:** reviewed sample, revised rules, full-list scope, cost/time ceiling, and destination.
6. **Full-pull-handoff gate:** approved full-pull specification and exact routed external action.
7. **Campaign-creation gate:** handoff fields and exact external campaign mutation.
8. **Launch/send gate:** audience, copy, senders, schedule, suppression, and final live action.

An approval at one gate does not imply approval for the next.

## Completion standard

Complete only when the required output sections exist, every human-accepted signal has `PASS` for its approved commercial-connection and expiry criteria, unknowns remain visible, pull logic is reproducible, dedupe/QA is explicit, and the next human approval gate is named. If evidence is insufficient, deliver the best bounded specification plus a missing-evidence report; do not fill gaps.
