---
name: library-compile
description: >
  Compile library source notes into source-grounded playbooks with step-by-step
  SOPs. Use when asked to compile the library, build a playbook, synthesize
  sources into a guide, or update existing compilations with new material.
---

# Library Compile

Reads all source notes in `library/sources/`, discovers topic clusters with enough evidence, compiles them into actionable playbooks in `library/compiled/`, and audits every claim for source traceability. One trigger, three sequential phases.

## Inputs

- **Default (no args):** discover all compilable topics, then compile all
- **Specific topic:** `library-compile <topic-slug>` — compile or recompile one topic
- **Recompile:** pass an existing topic slug — detects new sources since last compile, updates the playbook

## Required references

- `library/sources/TAXONOMY.md`
- `library/compiled/REGISTRY.md`

---

## Phase 1 — Discover

Goal: find topic clusters that have enough source material for a playbook but haven't been compiled yet.

### Steps

1. Read `library/compiled/REGISTRY.md` to get already-compiled topics and their status.
2. Scan all source notes in `library/sources/**/*.md`:
   - Read ONLY frontmatter + "Distilled claims" section (NOT raw content — save tokens).
   - Extract: `sub_category`, `topic` field, file path, `date_ingested`.
3. Cluster sources:
   - **Layer 1:** Group by `sub_category`.
   - **Layer 2:** Tokenize each source's `topic` field (split on spaces/commas, lowercase, drop stopwords: and, the, for, with, via, from, how, to, a, in, of, by, on, vs, is). Sources sharing 2+ significant tokens belong to the same cluster even across sub_categories.
   - **Layer 3:** Merge cross-category clusters that share sources.
4. Filter: require **3+ sources** per cluster. Log 2-source clusters as "thin — not yet compilable."
5. Name each cluster from the top 2-3 most common tokens, joined with hyphens (e.g., `cold-email-copywriting`, `offer-design`).
6. Exclude clusters already in REGISTRY.md with status `current` — unless running in recompile mode.
7. Present discovered topics to the user with source counts and file paths.
8. Proceed to Phase 2 for all topics, or let the user pick which to compile.

### Handling edge cases

- Sources with `topic: "to-classify"` — skip during clustering, flag separately.
- Sub-categories not in TAXONOMY.md (e.g., `offer-positioning`) — treat as belonging to the closest match.
- The user can specify a custom cluster by naming source files directly.

---

## Phase 2 — Compile

Goal: for each discovered topic, produce a source-grounded playbook.

### Steps

1. Read every source note in the cluster **FULLY** (including raw content). This is the deep read.
2. Extract exact frameworks, step sequences, and wording from each source.
3. Write the playbook to `library/compiled/<topic-slug>.md` using the format below.
4. Update REGISTRY.md with the new entry.

### Compile rules (non-negotiable)

- **Every claim wikilinks to its source:** `[[2026-03-14-problematized-outbound-personalization-is-dead|Dimitar - Problematized Outbound]]`
- **Preserve exact wording** where the source's phrasing is valuable. Use blockquotes:
  ```
  > "You are not allowed to just sell whatever you want." — [[source|Creator - Title]]
  ```
- **Convergence:** when multiple sources agree, note it: "Confirmed by 3 sources: [[s1]], [[s2]], [[s3]]"
- **Contradictions:** when sources disagree, surface both sides explicitly. Never silently pick one.
- **NEVER add LLM knowledge.** If there is a gap in the sources, write: "No source covers this."
- **Structure as actionable SOP steps**, not a literature review. The playbook is for doing, not reading.

### Playbook output format

```markdown
---
type: compiled-playbook
topic_slug: "<slug>"
title: "<Title>"
sources_used:
  - "<source-filename-1>"
  - "<source-filename-2>"
source_count: <N>
date_compiled: "<YYYY-MM-DD>"
status: current
---

# <Title> — Compiled Playbook

> [!info] <N> sources | Compiled <date>

## Executive summary

2-3 sentences from distilled claims only. What this playbook covers and why it matters.

## Core frameworks

Named frameworks extracted from sources. Each framework gets its own subsection with exact steps, attributed via wikilink.

### <Framework Name> ([[source]])

1. Step (from source)
2. Step (from source)
3. Step (from source)

## Step-by-step playbook

Operational SOP synthesized from all sources. Every instruction traces to a source.

### Step 1: <action>

Instructions from sources.

> [!quote]
> "Exact wording" — [[source|Creator - Title]]

### Step 2: <action>

...

## Key claims (with sources)

All distinct claims across sources, each wikilinked.

- Claim text — [[source1]], [[source2]]
- **Contradicted by:** alternative claim — [[source3]]

## Gaps

What the sources do NOT cover. No LLM fill-in.

- Gap: <description>

## Audit results

> [!warning] Audit
> Results from Phase 3 audit (auto-populated).

## Sources

1. [[source-path-1|Creator - Title]]
2. [[source-path-2|Creator - Title]]
```

---

## Phase 3 — Audit

Goal: verify every claim in the compiled playbook traces to a real source.

### Steps

1. Re-read the compiled playbook.
2. For each claim with a wikilink:
   - Verify the linked source file exists.
   - Verify the source actually contains that claim (check distilled claims + raw content).
3. Check: did the compile miss any source in the cluster that should have been included?
4. Check: is any claim vague, unsupported, or suspiciously specific without a source link?
5. Check: is exact wording in blockquotes actually from the source?
6. Report results in the `## Audit results` section of the playbook:
   - List any issues found.
   - If no issues: mark all checks as passed.
   - Fix inline issues directly (broken links, misattributions) rather than just reporting them.

---

## Recompile Mode

Triggered when the user passes an existing topic slug.

### Steps

1. Read REGISTRY.md entry for the topic — get `date_compiled` and `sources_used`.
2. Re-run discovery scoped to this topic: find sources with `date_ingested > date_compiled` and any sources the previous compile missed.
3. Read all sources (old + new) fully.
4. Update the existing playbook:
   - Keep what is still accurate.
   - Add new material from new sources.
   - Mark contradictions between old and new sources.
   - Update frontmatter: `sources_used`, `source_count`, `date_compiled`.
5. Update REGISTRY.md with new date and expanded source list.
6. Re-run Phase 3 audit on the updated playbook.

---

## Guardrails

- NEVER modify source notes. They are read-only evidence.
- NEVER invent claims or fill gaps with LLM knowledge.
- Use Obsidian syntax: `[[wikilinks]]`, `> [!callout]`, YAML frontmatter.
- Follow taxonomy from `library/sources/TAXONOMY.md` for categorization.
- Source notes are immutable reference material.

## Completion message

Return:
- Topics discovered (Phase 1) with source counts
- For each compiled topic: playbook path, source count, any audit issues
- REGISTRY.md update confirmation
